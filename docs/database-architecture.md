# FINZURA Database Architecture

Version 1.0

---

# Mission

Design a database capable of serving millions of businesses while ensuring complete tenant isolation, security, auditability, and performance.

---

# Core Principles

- Multi-tenant by design
- Every record belongs to one Business
- Row Level Security enabled
- Immutable audit logs
- Soft deletes where appropriate
- UUID primary keys
- Optimized indexing
- Horizontally scalable

---

# Core Entities

Business
│
├── Users
├── Customers
├── Vendors
├── Employees
├── Bank Accounts
├── Invoices
├── Payments
├── Expenses
├── Purchase Orders
├── Taxes
├── Payroll
├── Assets
├── Liabilities
├── Inventory
├── AI Memory
├── Audit Logs
└── Notifications

---

# Primary Tables

## businesses

Stores company information.

Columns

- id
- name
- slug
- industry
- currency
- timezone
- created_at
- updated_at

---

## users

Stores users belonging to businesses.

Columns

- id
- business_id
- role
- email
- name
- avatar
- status

---

## customers

Columns

- id
- business_id
- customer_code
- name
- email
- phone
- gstin
- credit_limit
- payment_terms
- created_at

---

## vendors

Columns

- id
- business_id
- vendor_code
- company_name
- gstin
- payment_terms
- category

---

## invoices

Columns

- id
- business_id
- customer_id
- invoice_number
- subtotal
- tax
- total
- balance_due
- status
- due_date
- created_at

---

## payments

Columns

- id
- business_id
- invoice_id
- customer_id
- amount
- payment_method
- gateway
- transaction_reference
- status
- paid_at

---

## expenses

Columns

- id
- business_id
- vendor_id
- category
- amount
- tax
- payment_method
- expense_date

---

## bank_accounts

Columns

- id
- business_id
- bank_name
- account_type
- currency
- current_balance

---

## bank_transactions

Columns

- id
- business_id
- bank_account_id
- amount
- type
- description
- transaction_date
- matched

---

## audit_logs

Stores every important action.

Columns

- id
- business_id
- actor
- action
- entity
- entity_id
- previous_state
- new_state
- timestamp

---

## ai_memory

Stores AI learning.

Columns

- id
- business_id
- memory_type
- content
- confidence
- created_at

---

## notifications

Stores every notification.

Columns

- id
- business_id
- user_id
- type
- title
- message
- read
- created_at

---

# Relationships

Business

↓

Users

↓

Customers

↓

Invoices

↓

Payments

↓

Bank Transactions

↓

Cash Flow

↓

AI Recommendations

↓

Audit Logs

---

# Security

Every table contains:

business_id

Every query filters by:

business_id

No business can ever access another business's data.

---

# Auditability

Every financial action records:

- User
- AI Engine
- Timestamp
- Previous Value
- New Value
- Source
- Reason

Nothing is ever silently changed.

---

# Scaling

Support

- 10,000,000+ businesses
- Billions of invoices
- Billions of payments
- Global regions
- Multi-currency
- Multi-language

---

# Engineering Rules

- UUIDs only
- Foreign keys everywhere
- Proper indexes
- Soft deletes where applicable
- Immutable audit history
- Database migrations only
- No direct production edits

---

# Golden Rule

The database is the single source of truth.

Every AI decision must originate from verified database records.