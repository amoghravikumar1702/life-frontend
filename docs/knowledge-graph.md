# DhanarkOS Knowledge Graph

Version 1.0

---

# Purpose

The Knowledge Graph is the digital representation of every business using DhanarkOS.

It connects every financial entity, relationship, event, document, workflow, and AI decision into one unified financial brain.

The AI CFO never relies on isolated tables.

It reasons over this connected graph.

---

# Root Entity

Business

Every entity belongs to exactly one Business.

Business

├── Users

├── Customers

├── Vendors

├── Employees

├── Bank Accounts

├── Invoices

├── Expenses

├── Payments

├── Taxes

├── Assets

├── Liabilities

├── Inventory

├── Reports

├── AI Memory

└── Audit Logs

---

# Customer

Stores customer intelligence.

Attributes

- Customer ID
- Name
- Email
- Phone
- GSTIN
- Address
- Credit Limit
- Payment Terms
- Risk Score
- Payment Behaviour
- Lifetime Value

Relationships

Customer

↓

Invoices

↓

Payments

↓

Collections

↓

AI Recommendations

---

# Vendor

Stores supplier intelligence.

Attributes

- Vendor ID
- Company
- GSTIN
- Payment Terms
- Risk Score
- Category
- Contact Details

Relationships

Vendor

↓

Purchase Orders

↓

Bills

↓

Payments

↓

Performance History

---

# Invoice

Attributes

- Invoice Number
- Date
- Due Date
- Amount
- Tax
- Status
- Customer
- Currency

Relationships

Invoice

↓

Payment

↓

Reminder

↓

Collection Workflow

↓

Revenue

---

# Payment

Attributes

- Amount
- Method
- Gateway
- Date
- Status
- Reference Number

Relationships

Payment

↓

Invoice

↓

Bank Transaction

↓

Cash Flow

---

# Expense

Attributes

- Category
- Amount
- Vendor
- Date
- Tax
- Payment Method

Relationships

Expense

↓

Vendor

↓

Budget

↓

Cash Flow

---

# Bank Account

Attributes

- Balance
- Transactions
- Currency
- Account Type

Relationships

Bank Account

↓

Transactions

↓

Cash Flow

↓

Forecast

---

# Employee

Attributes

- Salary
- Department
- Payroll
- Benefits

Relationships

Employee

↓

Payroll

↓

Tax

↓

Expense

---

# Tax

Attributes

- GST
- TDS
- PF
- ESI

Relationships

Tax

↓

Invoices

↓

Expenses

↓

Compliance

---

# Cash Flow

Built From

- Revenue
- Expenses
- Payroll
- Taxes
- Loans
- Payments

Outputs

- Cash Position
- Forecast
- Runway
- Liquidity

---

# AI Memory

Stores

- Previous recommendations
- User preferences
- Approval history
- Business patterns
- Seasonal behaviour
- Learning history

---

# Audit Log

Every action generates an immutable record.

Stores

- Timestamp
- User
- AI Engine
- Action
- Previous State
- New State
- Confidence
- Evidence

---

# Entity Relationships

Business

↓

Customer

↓

Invoice

↓

Payment

↓

Bank

↓

Cash Flow

↓

Forecast

↓

AI Recommendation

↓

User Approval

↓

Audit Log

---

# Engineering Rules

The Knowledge Graph is the single source of truth.

Every AI recommendation must reference verified entities.

No recommendation may be generated from incomplete relationships.

Every entity must have:

- Unique ID
- Owner Business
- Audit History
- Created At
- Updated At

---

# Future Expansion

The graph is designed to support:

- Multiple companies
- Multiple currencies
- Global taxation
- International banking
- Multi-language AI
- Board reporting
- Investor analytics
- Enterprise finance
- Autonomous workflows
- Industry-specific intelligence

---

# Golden Rule

The AI CFO understands businesses through the Knowledge Graph.

Without the graph, there is no financial intelligence.