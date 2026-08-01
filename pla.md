# Order Processing — Implementation Plan

## Objective

Automate the full forward order-fulfilment lifecycle across marketplace channels (Amazon SmartConnect / Yojaka and Flipkart Order Management API): ingest new orders, drive them through confirmation, packing, document generation, and shipping via marketplace APIs, surface everything to an Ops review UI in real time, and maintain a complete, immutable history of every state transition and action taken.

Also in scope: checking order line items against an existing inventory source of truth to confirm fulfillability, and syncing stock updates (reservation on confirm, release on cancel, decrement on ship) back both to that inventory source and outward to the marketplaces themselves.

Payments are explicitly out of scope. Returns/RTO handling is deferred (see Open Decisions).

---

## Why This Needs Its Own Design (Not a Shared Adapter)

Amazon and Flipkart model the same real-world process — accept → pack/label → dispatch → ship — but disagree on almost everything else:

- **Granularity**: Amazon's workflow operates at the order level. Flipkart's operates at the shipment level (one order can split into multiple shipments; a shipment can bundle multiple order items).
- **Explicitness of transitions**: Amazon exposes a distinct API call per workflow step (confirm, create-packages, retrieve-pickup-slots, generate-packing-documents, generate-ship-label, ship-order). Flipkart has transitions with no seller-triggered API at all (`PACKING_IN_PROGRESS → PACKED` happens purely because Flipkart's backend finished generating documents — you can only poll or wait for a push notification).
- **Fulfilment variants**: Flipkart additionally has an entirely separate Self Ship state machine (Approved → Shipped → Delivered → Completed) layered on top of Standard Fulfilment, with its own SLA fields (`Dispatch_By_Date`, `Deliver_By_Date`).
- **Delivery mechanism**: Amazon is pull-only (poll `listOrders`). Flipkart supports both pull (filter/search APIs) and push (a notification/webhook service).

Given this, the system is built as **independent per-marketplace workers**, not a shared `MarketplaceClient` interface. Each worker owns its platform's real lifecycle end-to-end (via its own state machine); the two only converge at the canonical internal data model, not at a forced common code interface.

**A note on inventory as a third API surface**: stock/inventory sync-out to Amazon and Flipkart is handled through their respective **Listing/Catalog Management APIs**, not the Order Management APIs referenced throughout this document. That means inventory sync-out needs its own API research pass (auth, endpoints, rate limits, batching behavior) before Phase 4/5 work on it can be scoped accurately — it isn't just "one more call" on the clients we're already building for orders.

---

## Proposed Workflow

```text
[Amazon Poller: fixed interval Schedule]         [Flipkart Poller / Webhook Listener]
        ↓                                                    ↓
 Fetch ACCEPTED orders                          Fetch APPROVED shipments
 (listOrders, paginated)                        (filter API and/or push notification)
        ↓                                                    ↓
 Validate + normalize (Effect Schema)           Validate + normalize (Effect Schema)
        ↓                                                    ↓
        └──────────────────→ Canonical Order/Shipment upsert ←──────────────────┘
                                        ↓
                        Always published to Ops UI (live queue)
                                        ↓
                    ┌───────────────────┴───────────────────┐
                    │                                        │
        Auto-actionable step?                      Needs human input?
        (e.g. dispatch-after-date passed,           (e.g. package dimensions,
         not on hold)                                serial numbers, hold review)
                    ↓                                        ↓
        Marketplace-specific lifecycle          Ops UI surfaces action needed
        worker advances the state                          ↓
        (confirm → package → document →         Human provides input via Ops UI
         label → dispatch/ship)                             ↓
                    ↓                            Action worker resumes lifecycle
        Append immutable OrderStatusEvent  ←─────────────────┘
        (audit log of every transition)
                    ↓
        Update canonical current-state row
        (orders / shipments — source of truth)
                    ↓
        SLA / failure monitor watches for stuck orders
        → Notification Worker alerts Ops on breach or repeated failure
```

**Key design decision (mirrored from the Product Approval plan)**: every ingested order/shipment is shown on the Ops UI immediately, annotated with its current step and whether it's progressing automatically or waiting on a human. Nothing is hidden until it needs attention — this avoids the same "flicker" problem, and gives Ops visibility into what the automation is doing on its own.

---

## Architecture

### Actors / Workers

*(Following the actor-per-responsibility structure as instructed; here each actor is scoped per marketplace where the underlying platform behavior differs.)*

- **Amazon Order Poller** — fires on a fixed schedule, calls `listOrders` for `ACCEPTED` status, paginates via cursor.
- **Flipkart Shipment Poller / Notification Listener** — either polls the shipment search API on a schedule, or consumes Flipkart's push notification service (decision pending — see Open Decisions), plus a periodic reconciliation poll as a safety net against missed webhooks.
- **Ingestion Normalizer** (per marketplace) — validates raw payloads via Effect Schema, maps into the canonical `Order`/`Shipment` model, upserts.
- **Inventory Check Worker** — for each ingested order/shipment, queries the existing inventory source of truth for available stock per SKU/location. Annotates the order as fulfillable, at-risk, or blocked; feeds this into the Ops UI and into whether the lifecycle worker proceeds automatically or waits for human input.
- **Amazon Lifecycle Worker** — drives Amazon's explicit workflow calls in sequence: confirm-order → create-packages → retrieve-pickup-slots/shipping-options → generate-packing-documents → generate-ship-label → ship-order. Owns Amazon-specific state (its own XState machine).
- **Flipkart Lifecycle Worker** — drives Flipkart's shipment flow: request labels/invoices (async) → poll/listen until `PACKED` → mark Ready to Dispatch → track through Shipped. Owns Flipkart-specific state (its own XState machine), including the Self Ship variant as a distinct sub-machine.
- **Document Readiness Poller** — both platforms generate labels/invoices asynchronously (Flipkart explicitly warns 5–10 sec, occasionally up to 30 min); this worker polls until documents are ready rather than blocking the lifecycle worker.
- **Cancellation Worker** — handles Amazon's `reject-order` (per-line-item reasons, with special `OUT_OF_STOCK` inventory-zeroing behavior) and Flipkart's `shipments/cancel`.
- **Inventory Sync Worker** — reacts to canonical status changes that affect stock (reserve on confirm, release on cancel/reject, decrement on ship). Writes the update back to the existing inventory source of truth, and separately pushes the resulting stock levels out to Amazon/Flipkart via their Listing/Catalog Management APIs.
- **Status Projector** — consumes marketplace-specific state events from both lifecycle workers and writes the canonical status (see Domain Model) — this is the convergence point between the two otherwise-independent workers, and the trigger point for the Inventory Sync Worker.
- **Reconciliation Worker** — periodically diffs canonical state against a fresh marketplace fetch, to catch drift from missed webhooks or failed writes.
- **SLA Monitor** — watches `dispatchAfterDate`/`Dispatch_By_Date`/`Deliver_By_Date`-style fields and flags orders approaching or past breach.
- **Notification Worker** — alerts Ops (email, same pattern as the existing team email service) when an order needs manual input, an action has failed repeatedly, or an SLA is at risk. Does not fire on routine successful automated transitions.
- **Ops Action Worker** — handles human input from the Ops UI (e.g. supplying package dimensions/IMEI, approving a hold override) and resumes the relevant lifecycle worker.

### Components

**AmazonOrdersClient** — all HTTP communication with SmartConnect/Yojaka (LWA-authenticated): list/get orders, confirm, create-packages, retrieve-pickup-slots/shipping-options, generate/retrieve packing documents, generate/regenerate ship-label, ship-order, reject-order.

**FlipkartOMSClient** — all HTTP communication with Flipkart's v3 Order Management API: shipment search/get, labels (pack), dispatch (RTD), cancel, manifest, and Self Ship-specific endpoints.

**InventorySystemClient** — reads/writes against the inventory source of truth (interface to be confirmed, see Open Decisions). This system is not duplicated here; it's queried for fulfillability checks and written to for stock reservation/release/decrement.

**MarketplaceListingClients** (Amazon + Flipkart) — separate from the Orders clients above; used only for pushing updated stock levels outward once a canonical stock change has been confirmed. Scope and API details to be researched (see Open Decisions).

**Schema Validation** — every normalized payload validated via Effect `Schema` before entering the canonical pipeline, so a marketplace API/response change fails loudly rather than corrupting downstream data — same principle as the SAM Portal scraper's decode-failure alerting.

**Canonical Order/Shipment Store** — one row per canonical order and per canonical shipment (even for Amazon, where shipment is modeled 1:1 with the order, to keep the schema uniform across both marketplaces). Holds only current/latest state — the fast lookup table for Ops UI and for "what needs to happen next."

**OrderStatusEvent Log (append-only, immutable)** — every state transition and every action taken (automated or human), written once, never edited. Mirrors `product_decision_events` from the Product Approval plan: source of truth for "what happened and why," and the basis for rebuilding canonical state via full replay if it's ever corrupted.

**Durable Stream / Sync Engine** — reused from existing infrastructure (same as the Product Approval plan), powering live SSE push to the Ops UI and checkpointed catch-up on reconnect. Requires its own materializer/table for order-status events, same consideration as noted in the Product Approval plan for product-decision events.

**Ops UI** — live cross-marketplace order/shipment queue, subscribed via SSE. Surfaces: current step, whether progressing automatically or blocked on human input, SLA proximity, and failure/retry state. Supports manual actions (provide package details, override a hold, retry a failed step).

---

## Domain Model

```text
Order (canonical)
- orderId              (internal)
- marketplace           ("amazon" | "flipkart")
- marketplaceOrderId
- sellerLocationId
- status                 (canonical status — see below)
- placedAt
- lastUpdatedAt
- lineItems[]

Shipment (canonical — modeled even for Amazon, 1:1 with its order)
- shipmentId            (internal)
- orderId               (parent)
- marketplaceShipmentId  (null for Amazon; Flipkart's native id)
- status                 (canonical status)
- dispatchAfterDate / dispatchByDate
- deliverByDate
- hold                   (bool, Flipkart-specific but modeled generically)
- inventoryCheckStatus    ("fulfillable" | "at-risk" | "blocked")
- inventoryCheckedAt
- packages[]
- documents[]            (invoice, label, forms)

OrderStatusEvent          (immutable, append-only)
- eventId
- orderId / shipmentId
- marketplace
- rawMarketplaceStatus    (as received, pre-mapping)
- canonicalStatus         (post-mapping)
- triggeredBy             ("system" | "ops-user:<id>")
- action                  (e.g. "confirm-order", "generate-label", "mark-rtd")
- success                 (bool)
- errorDetail             (if failed)
- occurredAt
```

**Canonical status set (proposed, forward-flow only):**
`INGESTED → CONFIRMED → PACKING → DOCUMENTS_READY → READY_TO_DISPATCH → SHIPPED → DELIVERED`, with `CANCELLED` and `BLOCKED_NEEDS_INPUT` as side states. Each marketplace's native status maps into this set via a per-marketplace mapping table (Amazon's `ACCEPTED/CONFIRMED/PACKAGE_CREATED/.../SHIPPED/DELIVERED` and Flipkart's `APPROVED/PACKING_IN_PROGRESS/PACKED/READY_TO_DISPATCH/SHIPPED/DELIVERED`, plus Flipkart's separate Self Ship status set).

---

## Data Store Design

**Two separate stores, deliberately not combined** :

1. **`order_status_events`** — append-only, immutable, indexed by `orderId`/`shipmentId` for fast full-history queries. Never updated or deleted. Enables full audit trail and lets the canonical store be rebuilt from scratch via replay if corrupted.
2. **`orders` / `shipments`** — one row per canonical order/shipment, latest state only. The table every Ops UI query and every "what needs to happen next" check hits. Kept lean and indexed for fast lookups as order volume grows.

**Indexing / identity key**: `marketplace + marketplaceOrderId` for orders, `marketplace + marketplaceShipmentId` (or synthetic 1:1 id for Amazon) for shipments. No ambiguous/mutable field is part of this key (unlike the HSN concern flagged in the Product Approval plan) — marketplace order/shipment ids are stable identifiers by design.

**Inventory data is deliberately not duplicated here.** `shipments.inventoryCheckStatus` is a cached check *result*, not stock data itself — actual stock quantities remain owned by the existing inventory source of truth. This system only reads from and writes reservation/release/decrement events to that source; it does not become a second inventory database.

---

## Atomicity

Same principle : the canonical `orders`/`shipments` update and the `order_status_events` append happen as a single atomic operation, inside the same commit boundary. Given that the canonical store is what every downstream action worker checks before calling a marketplace API (to avoid, e.g., double-confirming an order or double-requesting a label), an out-of-sync canonical store would risk duplicate or invalid marketplace API calls — some of which (like Amazon's ship-order) are known to throw hard conflict errors (`409 SC_00004`) rather than silently no-op.

---

## Implementation Phases

### Phase 1 — Foundations
- Auth: Amazon LWA token flow (with refresh), Flipkart seller API auth
- Canonical domain model + status-mapping tables for both marketplaces
- Schema validation on all inbound payloads, with decode-failure alerting from day one
- Sandbox/test seller accounts on both platforms
- Confirm interface to the existing inventory source of truth (DB access, RPC, or HTTP)
- Research Amazon and Flipkart Listing/Catalog Management APIs for stock sync-out (separate surface from the Order Management APIs)

### Phase 2 — Ingestion
- Amazon Order Poller (listOrders, ACCEPTED, pagination)
- Flipkart Shipment Poller and/or Notification Listener
- Normalization + canonical upsert
- Durable Stream event publishing so every ingested order appears on the Ops UI immediately

### Phase 3 — Lifecycle Workers & Inventory Check
- Inventory Check Worker (fulfillability check against the existing inventory source, feeding into confirm-vs-block decisions)
- Amazon Lifecycle Worker (state machine covering confirm → package → pickup-slot/shipping-option → documents → label → ship)
- Flipkart Lifecycle Worker (state machine covering label/invoice request → packed → ready-to-dispatch → shipped), including the Self Ship variant
- Status Projector mapping both into canonical status, with atomic event + state writes

### Phase 4 — Async Document Handling, Inventory Sync & Reliability
- Document Readiness Poller for both platforms
- Inventory Sync Worker: reserve on confirm, release on cancel/reject, decrement on ship — writing back to the existing inventory source
- Stock sync-out to Amazon/Flipkart Listing/Catalog APIs (pending Phase 1 research)
- Retry/backoff for marketplace API failures
- Reconciliation Worker (periodic drift check against live marketplace state)
- SLA Monitor + Notification Worker

### Phase 5 — Cancellation
- Amazon reject-order flow (per-line-item reasons, OUT_OF_STOCK handling)
- Flipkart shipment cancel flow

### Phase 6 — Ops UI
- Live cross-marketplace queue via SSE, with automatic-vs-blocked annotation
- Manual-input surfaces (package details, hold overrides, retry actions)
- Full per-order history view (from `order_status_events`)

### Phase 7 — Testing & Rollout
- Sandbox validation on both platforms (Amazon publishes a sandbox environment; Flipkart's sandbox availability to be confirmed)
- End-to-end lifecycle test per marketplace, order-in to shipped-out
- Production credential cutover

---

## Assumptions

- Payments are fully out of scope; no payment-status data is read from or written to either marketplace by this system.
- Both marketplaces' documented workflow APIs (as of the referenced Swagger/API docs) continue to reflect production behavior; sandbox testing will validate this before production cutover.
- The existing Durable Stream / Sync Engine infrastructure can be extended with a sibling materializer for order-status events, following the same pattern used for product-decision events.
- Amazon and Flipkart credentials/seller accounts needed for sandbox and production access will be provided or already exist under the DeepEcom seller setup.
- An inventory source of truth already exists within DeepEcom's systems; this project integrates with it rather than building a new one.

---

## Open Decisions (to resolve before/at start of relevant phase)

1. **"Workers, not adapters"** Working interpretation used throughout this doc: independent Effect-based background processes per marketplace, each owning its own state machine, converging only at the canonical data model. Needs sign-off — sir may have a specific pattern or tech in mind (e.g. a job queue, literal worker threads).
2. **Flipkart ingestion mechanism** — pull-only polling, push-only via notification service, or both (poll as a reconciliation safety net alongside push for latency)?
3. **Returns/RTO scope** — confirmed deferred for now; needs a future decision on whether it's a later phase of this same project or a separate one, since both platforms treat it as a materially different lifecycle (own states, own APIs).
4. **Self Ship fulfilment scope** — is Self Ship (Flipkart) in scope alongside Standard Fulfilment, or only Standard for now?
5. **Manual-input triggers** — which fields genuinely require human input per order (package dimensions, IMEI/serial numbers, hold review) vs. which can be defaulted/automated from existing product/inventory data already held elsewhere in the system?
6. **Notification service contract** — reuse the existing team email service as-is (same as the Product Approval plan), or does order-processing urgency (SLA breaches) warrant a different/faster channel?
7. **Sandbox availability** — confirm Flipkart provides a sandbox/test environment equivalent to Amazon's; if not, decide how Phase 7 testing is handled safely.
8. **Inventory system interface** — confirm how this system reads from and writes to the existing inventory source of truth (direct DB access, an internal RPC/service call, or an HTTP API), and who owns changes to that system.
9. **Inventory sync trigger points** — confirm exact moments stock should change: reserve at order-confirm vs. at ingestion time; release immediately on cancel vs. after marketplace confirms the cancellation; decrement at ship vs. at delivery.
10. **Marketplace stock sync-out scope** — confirm whether this project owns pushing updated stock levels to Amazon/Flipkart listings, or whether that's handled by another existing system this one just notifies/hands off to.
11. **Stock conflict handling** — if the inventory check finds insufficient stock for an already-ingested order, does the system auto-reject it (with the marketplace-specific `OUT_OF_STOCK`-style reason), or always route it to Ops for a manual call?

---

## Deliverables

- Amazon Orders API client + Flipkart OMS API client
- Typed canonical domain models (`Order`, `Shipment`, `OrderStatusEvent`)
- Per-marketplace status-mapping tables
- Amazon Lifecycle Worker + Flipkart Lifecycle Worker (state machines)
- Ingestion pollers/listeners for both marketplaces
- Document readiness polling for async label/invoice generation
- Cancellation flow for both marketplaces
- Reconciliation worker + SLA monitor
- Ops UI: live cross-marketplace queue with manual-action support
- Atomic status-write pipeline
- Immutable audit log (`order_status_events`) + replay-based recovery capability
- Notification integration for blocked orders / SLA risk
- Inventory Check Worker (fulfillability check against existing inventory source)
- Inventory Sync Worker (reserve/release/decrement, written back to the existing inventory source)
- Stock sync-out integration to Amazon/Flipkart Listing/Catalog APIs