# Order Processing — Flipkart Pipeline

## 1. Overview

### What is Order Processing?

Order processing is the end-to-end workflow that begins when a customer places an order and ends when the order is successfully fulfilled. It includes receiving the order, validating it, preparing it for shipment, dispatching it, and tracking its status until completion.

### Goal

The goal of this pipeline is to synchronize the Flipkart order lifecycle with our internal order processing system so that every order and its state remain consistent across both systems.

---

## 2. Scope

### In Scope

- Ingest new orders from Flipkart through the browser extension.
- Synchronize order events and status updates with the internal system.
- Maintain a consistent order state between Flipkart and our platform.

### Out of Scope

- Order synchronization when the user is inactive.
- Order synchronization when the Chrome extension or browser session is not running.

---

## 3. High-Level Flow

```text
Customer places an order on Flipkart
            │
            ▼
Flipkart generates order events
            │
            ▼
Browser Extension receives the event
            │
            ▼
Extension sends the event to our backend
            │
            ▼
Backend validates the event
            │
            ▼
Order Processing Service creates or updates the internal order
            │
            ▼
Future Flipkart events (Hold, Packed, Ready to Ship, Shipped, Delivered, Cancelled, etc.)
            │
            ▼
Internal order status is updated
```

## Actor-Based Architecture

The system follows an **actor-based architecture**, where every actor has a single responsibility and communicates with other actors through events. Each actor is isolated, making the system easier to scale, test, and recover from failures.

### Auth Actor

**Purpose**
- Verify whether the user is authenticated with Flipkart.

**Responsibilities**
- Check login status.
- Redirect the user to the Flipkart login page if authentication is missing.
- Allow the polling workflow only after successful authentication.

**Events**
- `user_authenticated`
- `user_not_authenticated`

---

### Poll Actor

**Purpose**
- Poll Flipkart at a fixed interval to fetch the latest orders and inventory updates.

**Responsibilities**
- Execute polling every configured interval (e.g., every 2 minutes).
- Trigger synchronization when new data is available.
- Report failures if polling fails.

**Events**
- `poll_2_min`
- `poll_error`

---

### Sync Actor

**Purpose**
- Synchronize Flipkart data with the internal order processing system.

**Responsibilities**
- Import new orders.
- Import inventory updates.
- Lock inventory when required.
- Update inventory after order processing.
- Handle inventory rollback when an order is cancelled.

**Events**
- `import_order`
- `import_inventory`
- `lock_inventory`
- `update_inventory`
- `order_cancelled`

---

### Order Actor

**Purpose**
- Process and manage the complete lifecycle of an order.

**Responsibilities**
- Maintain the current state of every order.
- Handle all shipment lifecycle events received from Flipkart.
- Update the internal order state.

**Events**
- `shipment_created`
- `hold`
- `unhold`
- `shipment_packed`
- `shipment_ready_to_dispatch`
- `shipment_shipped`
- `shipment_delivered`
- `shipment_cancelled`

---

### Notification Actor

**Purpose**
- Notify users when important events or failures occur.

**Responsibilities**
- Send notifications through supported channels.
- Notify users when polling or synchronization fails.
- Deliver order-related notifications.

**Supported Channels**
- WhatsApp
- SMS
- Email

---

### UI Actor

**Purpose**
- Render the current state of the system in the browser extension.

**Responsibilities**
- Listen for events emitted by other actors.
- Display authentication status.
- Display polling status.
- Display synchronization progress.
- Display order status.
- Display notifications and errors.

---

## Actor Communication Flow

```text
Auth Actor
    │
    ▼
Poll Actor
    │
    ▼
Sync Actor
    │
    ▼
Order Actor

Any actor that emits an event
            │
            ├──────────────► UI Actor
            │
            └──────────────► Notification Actor (on errors or important events)
```

## Design Principles

- Each actor owns a single responsibility.
- Actors are isolated and do not share internal state.
- Communication happens only through events/messages.
- Failure of one actor does not directly affect other actors.
- New actors can be introduced without changing existing actors, provided they consume or emit the required events.



## 5. Data Flow
## 5. Data Flow

1. The user authenticates with Flipkart through the Chrome extension.

2. After successful authentication, the **Poll Actor** starts polling Flipkart at a configured interval (for example, every 2 minutes) to fetch the latest orders and inventory updates.

3. When a new order is detected:
   - The order is synchronized with the internal system.
   - The system checks whether sufficient inventory is available.
   - If inventory is available, the required quantity is reserved (locked) for the order.
   - If the remaining inventory falls below the configured threshold (e.g., **10 units**), a low-stock notification is sent to the user.

4. Once the inventory is successfully reserved:
   - The current order state is displayed in the UI.
   - The user is presented with the appropriate actions based on the order's current status (e.g., Pack, Ready to Dispatch, Ship, etc.).

5. As Flipkart sends shipment events (Packed, Ready to Dispatch, Shipped, Delivered, etc.), the **Order Actor** updates the internal order state, and the UI reflects the latest status.

6. If the customer cancels the order before shipment:
   - The reserved inventory is released.
   - Inventory is updated in the internal system.
   - The UI is refreshed to reflect the cancellation.
   - If necessary, a cancellation notification is sent to the user.

### Flow Diagram

```text
User authenticates
        │
        ▼
Poll orders every 2 minutes
        │
        ▼
New order received?
        │
   Yes ─┘
        │
        ▼
Check inventory
        │
        ├── No stock available
        │      │
        │      └── Notify user
        │
        └── Stock available
               │
               ▼
        Lock inventory
               │
               ▼
Remaining stock < 10?
               │
        Yes ───┘
               │
               ▼
Notify user (Low Inventory)
               │
               ▼
Display order in UI
               │
               ▼
Process shipment events
               │
               ▼
Order cancelled?
               │
        Yes ───┘
               │
               ▼
Release locked inventory
               │
               ▼
Update UI
```
## Edge Cases & Handling

### 1. User Inactive or Chrome Session Not Running

If the user is inactive or the Chrome extension is not running, the system cannot synchronize orders with Flipkart.

**Action**
- Send notifications using three escalation levels:
  1. Browser notification (if available)
  2. Email notification
  3. WhatsApp/SMS notification (if configured)

**Goal**
- Prompt the user to reopen the browser and resume order synchronization before any SLA is affected.

---

### 2. Chrome is Running but User is Not Authenticated

If the Chrome extension is active but the user is no longer authenticated with Flipkart, order synchronization cannot continue.

**Action**
- Detect the authentication failure.
- Redirect the user to the Flipkart login page (`HTTP 302` redirect).
- Display a browser notification requesting the user to log in.
- Send an email notification informing the user that re-authentication is required.

**Goal**
- Restore authentication automatically with minimal user intervention and resume synchronization.

---

### 3. New SKU Detected

If an order contains a SKU that does not exist in the internal catalog, the system should generate the required mapping dynamically.

**Action**
- Detect the unmapped SKU.
- Create the SKU mapping on demand.
- Validate the mapping before continuing order processing.
- Continue processing the order once the mapping has been successfully created.

**Goal**
- Eliminate manual SKU mapping for newly introduced products and ensure uninterrupted order processing.

## Major Trade-off

Real-time order processing depends on the user being online with an active Chrome session. If the user is offline or their Chrome session is inactive, real-time processing isn't possible.
