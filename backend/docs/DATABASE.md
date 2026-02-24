# Database Documentation

Complete guide to the database schema, migrations, and Prisma ORM.

## Overview

The backend uses **PostgreSQL** as the database with **Prisma** as the ORM. Prisma provides type-safe database access, automatic migrations, and a powerful query builder.

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐           ┌──────────────┐
│    User     │◄──────────┤  CartItem    │
│             │   1:N     │              │
│ - id        │           │ - id         │
│ - email     │           │ - quantity   │
│ - password  │           │ - userId  ───┼──┐
│ - firstName │           │ - productId ─┼──┼─┐
│ - lastName  │           └──────────────┘  │ │
│ - phone     │                             │ │
│ - billing   │           ┌──────────────┐  │ │
└──────┬──────┘           │   Product    │◄─┘ │
       │                  │              │    │
       │ 1:N              │ - id (EAN)   │    │
       │                  │ - name       │    │
       ▼                  │ - brand      │    │
┌─────────────┐           │ - price      │    │
│   Invoice   │           │ - category   │    │
│             │           │ - stock      │    │
│ - id        │           │ - imageUrl   │    │
│ - date      │           │ - nutrition  │    │
│ - total     │           └──────┬───────┘    │
│ - status    │                  │            │
│ - userId    │                  │ N:1        │
└──────┬──────┘                  │            │
       │                         │            │
       │ 1:N                     │            │
       ▼                         ▼            │
┌──────────────┐           ┌──────────────┐  │
│ InvoiceItem  │           │  CartItem    │◄─┘
│              │           └──────────────┘
│ - id         │
│ - quantity   │
│ - unitPrice  │
│ - invoiceId  │
│ - productId ─┼───────────────────────────┘
└──────────────┘

┌──────────────┐
│ RevokedToken │
│              │
│ - id         │
│ - token      │
│ - revokedAt  │
└──────────────┘
```

## Prisma Schema

**File**: `prisma/schema.prisma`

### Configuration

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### User Model

```prisma
model User {
  id              String   @id @default(uuid())
  email           String   @unique
  passwordHash    String
  firstName       String?
  lastName        String?
  phone           String?
  billingAddress  Json?
  createdAt       DateTime @default(now())

  // Relations
  invoices        Invoice[]
  cartItems       CartItem[]
}
```

**Fields:**

- `id`: UUID primary key
- `email`: Unique email address
- `passwordHash`: Bcrypt hashed password
- `firstName`, `lastName`, `phone`: Optional user details
- `billingAddress`: JSON object for flexible address structure
- `createdAt`: Timestamp of account creation

**Relations:**

- One-to-many with `Invoice` (user's orders)
- One-to-many with `CartItem` (user's cart)

**Indexes:**

- Unique index on `email` (enforced by `@unique`)

### Product Model

```prisma
model Product {
  id              String   @id
  name            String
  brand           String?
  smallImageUrl   String?
  imageUrl        String?
  price           Decimal  @db.Decimal(10, 2)
  category        String?
  stockQuantity   Int      @default(0)
  nutritionalInfo Json?
  lastUpdated     DateTime @default(now())

  // Relations
  cartItems       CartItem[]
  invoiceItems    InvoiceItem[]
}
```

**Fields:**

- `id`: Barcode/EAN (String, not UUID)
- `name`: Product name
- `brand`: Brand name (optional)
- `imageUrl`, `smallImageUrl`: Product images from Open Food Facts
- `price`: Decimal(10,2) for precise currency values
- `category`: Product category (optional)
- `stockQuantity`: Available stock (default: 0)
- `nutritionalInfo`: JSON for flexible nutrition data
- `lastUpdated`: Last fetch/update timestamp

**Relations:**

- One-to-many with `CartItem`
- One-to-many with `InvoiceItem`

**Notes:**

- Uses barcode as primary key (not UUID)
- Price is estimated/default value
- Products fetched from Open Food Facts API

### CartItem Model

```prisma
model CartItem {
  id          String   @id @default(uuid())
  quantity    Int
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
}
```

**Fields:**

- `id`: UUID primary key
- `quantity`: Number of items
- `userId`: Foreign key to User
- `productId`: Foreign key to Product

**Relations:**

- Many-to-one with `User`
- Many-to-one with `Product`

**Constraints:**

- Composite unique constraint on `(userId, productId)` prevents duplicates

### Invoice Model

```prisma
model Invoice {
  id              String         @id @default(uuid())
  date            DateTime       @default(now())
  totalAmount     Decimal        @db.Decimal(10, 2)
  status          PaymentStatus  @default(PENDING)
  paymentMethod   PaymentMethod  @default(PAYPAL)
  userId          String
  user            User           @relation(fields: [userId], references: [id])

  // Relations
  items           InvoiceItem[]
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
}

enum PaymentMethod {
  PAYPAL
}
```

**Fields:**

- `id`: UUID primary key
- `date`: Order date/time
- `totalAmount`: Total invoice amount (Decimal for precision)
- `status`: Payment status (enum)
- `paymentMethod`: Payment method (enum)
- `userId`: Foreign key to User

**Relations:**

- Many-to-one with `User`
- One-to-many with `InvoiceItem`

### InvoiceItem Model

```prisma
model InvoiceItem {
  id          String   @id @default(uuid())
  quantity    Int
  unitPrice   Decimal  @db.Decimal(10, 2)
  invoiceId   String
  invoice     Invoice  @relation(fields: [invoiceId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
}
```

**Fields:**

- `id`: UUID primary key
- `quantity`: Number of items ordered
- `unitPrice`: Price per unit at time of purchase
- `invoiceId`: Foreign key to Invoice
- `productId`: Foreign key to Product

**Relations:**

- Many-to-one with `Invoice`
- Many-to-one with `Product`

### RevokedToken Model

```prisma
model RevokedToken {
  id        String   @id @default(uuid())
  token     String   @unique
  revokedAt DateTime @default(now())
}
```

**Fields:**

- `id`: UUID primary key
- `token`: JWT token string (unique)
- `revokedAt`: Timestamp of revocation

**Purpose:**

- Track logged-out users
- Prevent reuse of revoked tokens
- Implements token blacklist

## Migrations

### Migration Workflow

```bash
# 1. Modify schema.prisma
# 2. Create migration
npx prisma migrate dev --name describe_your_change

# 3. Migration files created in prisma/migrations/
# 4. Database updated automatically
# 5. Prisma Client regenerated
```

### Existing Migrations

```
prisma/migrations/
├── migration_lock.toml
├── 20260205152136_init_tables/
│   └── migration.sql
├── 20260205160311_init_db/
│   └── migration.sql
├── 20260206184546_add_revoked_token/
│   └── migration.sql
├── 20260209162746_add_cart/
│   └── migration.sql
└── 20260212133818_add_small_image_url/
    └── migration.sql
```

**Migration History:**

1. **init_tables** - Initial database tables
2. **init_db** - Database initialization
3. **add_revoked_token** - Added RevokedToken model
4. **add_cart** - Added CartItem model
5. **add_small_image_url** - Added smallImageUrl to Product

### Creating a New Migration

**Example: Add user role field**

1. Edit `schema.prisma`:

```prisma
model User {
  // ... existing fields
  role  String @default("user")  // Add this
}
```

2. Generate migration:

```bash
npx prisma migrate dev --name add_user_role
```

3. Prisma creates:
   - `migrations/TIMESTAMP_add_user_role/migration.sql`
   - Applies migration to database
   - Regenerates Prisma Client

### Production Migrations

```bash
# Apply pending migrations (no prompts)
npx prisma migrate deploy
```

Use in production/CI:

- Does not create new migrations
- Only applies existing migrations
- Safe for automated deployments

### Reset Database (Development Only)

```bash
# WARNING: Deletes all data
npx prisma migrate reset
```

This will:

1. Drop database
2. Recreate database
3. Apply all migrations
4. Run seed script (if configured)

## Database Seeding

**File**: `prisma/seed.ts`

### Seed Configuration

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --require tsconfig-paths/register prisma/seed.ts"
  }
}
```

### Running the Seed

```bash
npm run seed
# or
npx prisma db seed
```

### Seed Script

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import axios from 'axios';

const prisma = new PrismaClient();

async function main() {
  // 1. Clean database
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.revokedToken.deleteMany();

  // 2. Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      email: 'test@user.test',
      passwordHash: hashedPassword,
      firstName: 'Testman',
      lastName: 'Tester',
    },
  });

  // 3. Import products from Open Food Facts
  const response = await axios.get('https://fr.openfoodfacts.org/cgi/search.pl?...');
  const products = response.data.products;

  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.code,
        name: p.product_name,
        brand: p.brands,
        price: randomPrice(),
        imageUrl: p.image_url,
        // ...
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**What it does:**

- Cleans existing data
- Creates test user (email: `test@user.test`, password: `password123`)
- Imports ~250 products from Open Food Facts
- Assigns random prices and stock

## Prisma Client Usage

### Initialization

```typescript
// prismaClient.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
```

### Basic Queries

```typescript
// Find unique
const user = await prisma.user.findUnique({
  where: { email: 'test@example.com' },
});

// Find many
const products = await prisma.product.findMany({
  where: { category: 'Beverages' },
  take: 10,
  skip: 0,
});

// Create
const newUser = await prisma.user.create({
  data: {
    email: 'new@example.com',
    passwordHash: hashedPassword,
  },
});

// Update
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { firstName: 'John' },
});

// Delete
await prisma.cartItem.delete({
  where: { id: itemId },
});
```

### Relations

```typescript
// Include related data
const cart = await prisma.cartItem.findMany({
  where: { userId },
  include: { product: true },
});

// Select specific fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    firstName: true,
    // passwordHash NOT included
  },
});

// Nested operations
const invoice = await prisma.invoice.create({
  data: {
    userId,
    totalAmount: 99.99,
    items: {
      create: [
        { productId: 'prod1', quantity: 2, unitPrice: 25.0 },
        { productId: 'prod2', quantity: 1, unitPrice: 49.99 },
      ],
    },
  },
  include: { items: true },
});
```

### Transactions

```typescript
// Ensure multiple operations succeed or fail together
await prisma.$transaction([
  prisma.cartItem.deleteMany({ where: { userId } }),
  prisma.invoice.create({ data: invoiceData }),
]);

// Interactive transactions
await prisma.$transaction(async (tx) => {
  const user = await tx.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  await tx.cartItem.deleteMany({ where: { userId } });
  return tx.invoice.create({ data: invoiceData });
});
```

## Prisma Studio

Visual database browser built into Prisma.

### Launch Studio

```bash
npx prisma studio
```

Opens at `http://localhost:5555`

### Features

- View all tables and records
- Filter and search
- Edit data directly
- Add/delete records
- Explore relations
- No SQL required

### Use Cases

- Quick data inspection
- Manual data fixes
- Testing queries
- Understanding schema

## Database Backups

### Export Database

```bash
# Dump entire database
pg_dump -U postgres -d derogative_shop > backup_$(date +%Y%m%d).sql

# Dump schema only
pg_dump -U postgres -d derogative_shop --schema-only > schema.sql

# Dump data only
pg_dump -U postgres -d derogative_shop --data-only > data.sql
```

### Restore Database

```bash
# Restore from backup
psql -U postgres -d derogative_shop < backup_20260217.sql
```

### Automated Backups

**Example cron job (Linux):**

```bash
# Daily backup at 2 AM
0 2 * * * pg_dump -U postgres derogative_shop > /backups/db_$(date +\%Y\%m\%d).sql
```

## Performance Optimization

### Indexes

```prisma
model Product {
  name     String
  category String?

  @@index([category])  // Index for filtering
  @@index([name])      // Index for search
}
```

### Query Optimization

```typescript
// ❌ Bad - N+1 query problem
const cartItems = await prisma.cartItem.findMany({ where: { userId } });
for (const item of cartItems) {
  const product = await prisma.product.findUnique({ where: { id: item.productId } });
}

// ✅ Good - Single query with include
const cartItems = await prisma.cartItem.findMany({
  where: { userId },
  include: { product: true },
});
```

### Connection Pooling

Prisma handles connection pooling automatically. Configure in schema:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Example: postgresql://user:pass@localhost:5432/db?connection_limit=5
}
```

## Troubleshooting

### Prisma Client Out of Sync

**Error**: `Type X is not assignable to type Y`

**Solution**:

```bash
npx prisma generate
```

### Migration Failed

**Error**: `Migration failed to apply`

**Solutions**:

1. Check database connection
2. Review migration SQL
3. Reset database (development):
   ```bash
   npx prisma migrate reset
   ```
4. Manual fix:
   ```bash
   npx prisma migrate resolve --applied <migration_name>
   ```

### Database Connection Issues

**Error**: `Can't reach database server`

**Check:**

1. PostgreSQL is running
2. DATABASE_URL is correct
3. Firewall allows connection
4. Database exists

---

**Next**: [API Documentation](./API.md) | [Deployment Guide](./DEPLOYMENT.md)
