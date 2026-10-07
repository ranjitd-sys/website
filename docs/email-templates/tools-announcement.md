# Email Templates — New Tools Announcement

Templates for announcing the free tools to customers. Three variants:

1. [General announcement](#1-general-announcement)
2. [Follow-up (non-openers)](#2-follow-up-for-non-openers)
3. [Flipkart-only](#3-flipkart-only-send)

> **Ready-to-send HTML** (email-safe: table layout, inline styles, Outlook-safe
> button, hidden preheader, unsubscribe footer):
> - [`amazon-revenue-calculator.html`](./amazon-revenue-calculator.html) — Amazon
>   Revenue Calculator
> - [`meesho-label-manager.html`](./meesho-label-manager.html) — Meesho Label
>   Manager
> - [`flipkart-label-manager.html`](./flipkart-label-manager.html) — Flipkart
>   Label Manager
> - [`tools-announcement.html`](./tools-announcement.html) — general announcement
> - [`tools-followup.html`](./tools-followup.html) — follow-up for non-openers
>
> Paste the file into your email tool's "custom HTML" editor, then swap the
> placeholders for its merge tags.

> **Placeholders** — replace before sending:
> - `{{first_name}}` — merge field, or "there" if unpersonalized.
> - `{{tools_link}}` — `https://deepecom-app.vercel.app/tools`
> - `{{flipkart_tool_link}}` — `https://deepecom-app.vercel.app/tools/flipkart-label-manager`
> - `{{unsubscribe_link}}` — your email tool's unsubscribe merge tag (required).
> - `{{company_address}}` — your registered business address (required by
>   anti-spam rules in most regions).

> **Before sending:** segment by marketplace (Flipkart sellers get the Flipkart
> tool first), keep one primary CTA, include an unsubscribe link, and only send
> to people who opted in. A 10-second GIF of a label going from uploaded PDF to
> print-ready sheet converts better than any bullet list.

---

## 1. General announcement

### Subject lines (pick one)

- "Your labels, print-ready in seconds — now for Flipkart too"
- "New free tools to speed up your shipping day"
- "Print labels, export order data, know what you collected — free"

### Plain text

```
Subject: Your labels, print-ready in seconds — now for Flipkart too

Hi {{first_name}},

Every order you ship is a label you have to split, crop, and size by hand.
So we built tools that do it for you — free, right in your browser.

What's new:

• Flipkart Label Manager — upload your label PDF and get every label
  split from the invoice, cropped, and print-ready (A4 or 4×6 thermal).

• Meesho Label Manager — same one-tap flow for Meesho supplier labels.

• Batch summary — instantly see your orders, units, COD vs prepaid,
  order value, and GST for a whole batch instead of counting by hand.

• Export orders (CSV) — order ID, AWB, SKU, customer, pincode, courier,
  payment, and value, ready to open in Excel.

• Picklist + pincode sort — group deliveries by route and see what's COD.

• Amazon Revenue Calculator — compare FBA, Easy Ship, Self Ship, and
  Seller Flex fees and margin per order.

Everything runs in your browser — your PDFs never leave your device, and
there's no sign-up.

Try them free → {{tools_link}}

Onward and upward,
The DeepEcom team
```

### HTML

```html
<p>Hi {{first_name}},</p>

<p>Every order you ship is a label you have to split, crop, and size by hand.
So we built tools that do it for you — free, right in your browser.</p>

<h3>What's new</h3>
<ul>
  <li><strong>Flipkart Label Manager</strong> — split, crop, and print-ready
      labels (A4 or 4×6 thermal).</li>
  <li><strong>Meesho Label Manager</strong> — the same one-tap flow.</li>
  <li><strong>Batch summary</strong> — orders, units, COD vs prepaid, order
      value, and GST for the whole batch.</li>
  <li><strong>Export orders (CSV)</strong> — order ID, AWB, SKU, customer,
      pincode, courier, payment, value.</li>
  <li><strong>Picklist + pincode sort</strong> — route-wise grouping and COD
      visibility.</li>
  <li><strong>Amazon Revenue Calculator</strong> — FBA / Easy Ship / Self Ship /
      Seller Flex fees and margin.</li>
</ul>

<p>No sign-up. Your PDFs stay on your device.</p>

<p><a href="{{tools_link}}">Try the tools free →</a></p>

<p>Onward and upward,<br>The DeepEcom team</p>
```

---

## 2. Follow-up (for non-openers)

Short, one idea, one link.

### Subject

- "Your Flipkart labels, split and print-ready"

### Plain text

```
Subject: Your Flipkart labels, split and print-ready

Hi {{first_name}},

Quick one.

Upload your Flipkart label PDF, and it comes back split from the invoice,
cropped, and ready to print — every label in the batch, at once.

You also get a summary of your orders, COD vs prepaid, and a CSV of every
order for Excel. Free, in your browser, no sign-up.

Try it → {{flipkart_tool_link}}

— DeepEcom
```

> If you want the follow-up to feel urgent rather than repetitive, swap the
> subject for a benefit line (e.g. "Your label batch, summarized before you
> print") — non-openers never saw the first subject, but reusing the same line
> twice can read as a duplicate.

---

## 3. Flipkart-only send

For a list that is mostly Flipkart sellers.

### Subject

- "Print-ready Flipkart labels in seconds"

### Plain text

```
Subject: Print-ready Flipkart labels in seconds

Hi {{first_name}},

If you ship on Flipkart, you know the drill: download the label PDF, then
crop and resize every page before you can print.

Our Flipkart Label Manager does that part for you:

• Splits each label from the invoice automatically
• Crops to the printed label box (no more sideways or oversized prints)
• Outputs A4 sheets or 4×6 thermal stickers
• Shows a batch summary — orders, units, COD vs prepaid, order value, GST
• Exports every order to CSV (AWB, SKU, customer, pincode, courier, value)
• Sorts by pincode for faster route planning

It runs in your browser — your PDFs never leave your device, and there's no
account to create.

Try it free → {{flipkart_tool_link}}

— The DeepEcom team
```
