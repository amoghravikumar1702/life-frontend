# ArkenOne API Architecture

Version 1.0

---

# Mission

Build a modular, secure, versioned API architecture capable of serving millions of businesses with independent services.

---

# Principles

- API First
- Stateless Services
- Versioned Endpoints
- Multi-tenant
- Secure by Default
- Scalable
- Observable

---

# API Layers

Client Layer

- Web App
- Mobile App
- AI CFO
- Public APIs

↓

API Gateway

↓

Business Services

↓

Financial Engines

↓

Database

↓

External Services

---

# Core Services

## Authentication Service

Responsibilities

- Login
- Signup
- Sessions
- MFA
- Roles
- Permissions

Endpoints

/auth/login

/auth/logout

/auth/signup

/auth/refresh

---

## Business Service

Responsibilities

- Company profile
- Business settings
- Teams
- Preferences

---

## Customer Service

Responsibilities

- Customers
- Credit Limits
- Customer History
- Customer Analytics

---

## Invoice Service

Responsibilities

- Create Invoice
- Update Invoice
- Invoice PDFs
- Payment Links
- Invoice Timeline

---

## Payment Service

Responsibilities

- Razorpay
- Payment Verification
- Refunds
- Payment Status
- Payment History

---

## Expense Service

Responsibilities

- Expenses
- Categories
- Receipts
- Attachments

---

## Banking Service

Responsibilities

- Bank Sync
- Reconciliation
- Bank Balances
- Transactions

---

## AI CFO Service

Responsibilities

- Recommendations
- Executive Brief
- AI Chat
- Financial Insights
- Decision Support

---

## Forecast Service

Responsibilities

- Cash Forecast
- Revenue Forecast
- Expense Forecast
- Risk Forecast

---

## Notification Service

Responsibilities

- Email
- WhatsApp
- SMS
- Push Notifications

---

## Compliance Service

Responsibilities

- GST
- Tax
- Filing
- Due Dates

---

## Reporting Service

Responsibilities

- Financial Statements
- Executive Reports
- Board Reports
- Investor Reports

---

# API Versioning

/v1/

Stable Production APIs

/v2/

Future APIs

Breaking changes always require a new version.

---

# Authentication

JWT

Supabase Auth

Row Level Security

Role Based Access Control

---

# Roles

Owner

Admin

Finance Manager

Accountant

Employee

Auditor

API

AI CFO

---

# Response Format

Success

{
  "success": true,
  "data": {}
}

Error

{
  "success": false,
  "error": {
    "code": "",
    "message": ""
  }
}

---

# Logging

Every request logs

- User
- Business
- IP
- Endpoint
- Response Time
- Status Code
- Request ID

---

# Rate Limits

Public APIs

100/minute

Authenticated APIs

1000/minute

Enterprise

Custom

---

# Security

HTTPS Only

JWT

Input Validation

Rate Limiting

Audit Logging

Encryption

---

# Engineering Rules

Services never access each other's database tables directly.

Communication happens through APIs or events.

Every API must be:

- Documented
- Tested
- Versioned
- Monitored

---

# Golden Rule

The API is the nervous system of ArkenOne.

Every service communicates through clean, secure, observable interfaces.