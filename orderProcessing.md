# Actor-Based State Machine Architecture

## Overview
This document outlines the distributed actor-based state machine for order polling and synchronization. The system leverages asynchronous message passing between distinct actors to handle authentication, data streaming, inventory validation, and order processing.

---

## 1. Actor & Event Matrix

This table breaks down exactly what each actor does and the events they handle, providing a quick reference guide to the system's distributed logic.

| Actor | Core Responsibility | Inbound Events (Listens For) | Outbound Events (Emits) |
| :--- | :--- | :--- | :--- |
| **Auth Actor** | Manages user session and token validation. | `POLL_ORDER`, `TOKEN_EXPIRED`, `CHECK_AUTH` | `USER_AUTHENTICATED`, `AUTHENTICATED`, `NOT_AUTHENTICATED` |
| **Poll Actor** | Controls the primary synchronization loop. | `USER_AUTHENTICATED`, `LATEST_DATA` | `TOKEN_EXPIRED`, `POLL_LATEST`, `POLL_COMPLETED` |
| **GetStream Actor** | Interfaces with external data streams. | `POLL_LATEST`, `AUTHENTICATED`, `ORDER_PROCESS` | `LATEST_DATA`, `CHECK_AUTH`, `COMPLETED_ORDER` |
| **Sync Actor** | Evaluates inventory state before ordering. | `POLL_COMPLETED` | `INV_SUFFICIENT`, `INV_LOW` |
| **Order Actor** | Manages the lifecycle of an active order. | `INV_SUFFICIENT`, `COMPLETED_ORDER` | `ORDER_PROCESS`, `COMPLETED_ORDER_ORDER_ID` |
| **Notification Actor** | Handles system alerts and failures. | `NOT_AUTHENTICATED`, `INV_LOW` | *(None)* |
| **Supervisor** | Final terminus for successful workflows. | `COMPLETED_ORDER_ORDER_ID` | *(None)* |

---

## 2. System Flow (Sequence Diagram)

For actor-based systems, a **Sequence Diagram** is often the "better way" to visualize the state machine because it shows the *timeline* of messages passed between actors, rather than just a static map. 

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Auth as Auth Actor
    participant Poll as Poll Actor
    participant Stream as GetStream Actor
    participant Sync as Sync Actor
    participant Order as Order Actor
    participant Notify as Notification Actor
    participant Sup as Supervisor

    User->>Auth: POLL_ORDER
    Auth->>Poll: USER_AUTHENTICATED
    
    rect rgb(30, 30, 30)
        Note right of Poll: Polling Loop
        Poll->>Stream: POLL_LATEST
        Stream->>Poll: LATEST_DATA
        
        opt If Token Expires
            Poll->>Auth: TOKEN_EXPIRED
        end
        
        opt If Stream Checks Auth
            Stream->>Auth: CHECK_AUTH
            alt Is Valid
                Auth->>Stream: AUTHENTICATED
            else Is Invalid
                Auth->>Notify: NOT_AUTHENTICATED
            end
        end
    end

    Poll->>Sync: POLL_COMPLETED
    
    alt Inventory Low
        Sync->>Notify: INV_LOW
    else Inventory Sufficient
        Sync->>Order: INV_SUFFICIENT
        
        rect rgb(30, 30, 30)
            Note right of Order: Order Processing Loop
            Order->>Stream: ORDER_PROCESS
            Stream->>Order: COMPLETED_ORDER
        end
        
        Order->>Sup: COMPLETED_ORDER_ORDER_ID
    end