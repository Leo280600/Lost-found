# ER Diagram — Lost & Found Hub

```mermaid
erDiagram
  User ||--o{ Item : "posts"
  User ||--o{ Favorite : "saves"
  User ||--o{ Claim : "requests"
  User ||--o{ Notification : "receives"
  Category ||--o{ Item : "categorizes"
  Item ||--o{ Favorite : "saved by"
  Item ||--o{ Claim : "claimed by"

  User {
    string id PK
    string email UK
    string password
    string name
    string phone
    string faculty
    string studentId
    string avatarUrl
    Role role
    boolean isBanned
    datetime createdAt
    datetime updatedAt
  }

  Category {
    string id PK
    string name UK
    string slug UK
    string icon
  }

  Item {
    string id PK
    string title
    string description
    ItemType type
    ItemStatus status
    string color
    string brand
    string contact
    string location
    datetime date
    string[] images
    string categoryId FK
    string ownerId FK
    datetime createdAt
    datetime updatedAt
  }

  Favorite {
    string id PK
    string userId FK
    string itemId FK
    datetime createdAt
  }

  Claim {
    string id PK
    string itemId FK
    string userId FK
    string reason
    string[] evidence
    ClaimStatus status
    datetime createdAt
    datetime updatedAt
  }

  Notification {
    string id PK
    string userId FK
    NotificationType type
    string title
    string message
    boolean isRead
    string link
    datetime createdAt
  }
```

## Enums
- **Role**: `USER`, `ADMIN`
- **ItemType**: `LOST`, `FOUND`
- **ItemStatus**: `LOST`, `FOUND`, `RETURNED`
- **ClaimStatus**: `PENDING`, `APPROVED`, `REJECTED`
- **NotificationType**: `CLAIM_REQUESTED`, `CLAIM_APPROVED`, `CLAIM_REJECTED`, `ITEM_RETURNED`
