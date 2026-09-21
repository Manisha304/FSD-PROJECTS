CLIENT

- Register
- Login
- Apply for Service
- Upload Documents
- View Applications
- View Eligibility Results
- View Notifications

AGENT

- Login
- View Assigned Clients
- Review Applications
- Verify Documents
- Request Missing Documents
- Add Remarks
- View Notifications

ADMIN

- Login
- View All Applications
- View All Agents
- Review Verified Applications
- Approve Applications
- Reject Applications
- Assign Bank Partner
- View Analytics
- View Notifications

# APIs

## Authentication

POST /auth/register
POST /auth/login
GET /auth/profile

## Applications

POST /applications
GET /applications
GET /applications/:id
PATCH /applications/:id

## Documents

POST /documents/upload
GET /documents
DELETE /documents/:id

## Notifications

GET /notifications
PATCH /notifications/:id/read

## Agent

GET /agent/clients
GET /agent/applications
PATCH /agent/applications/:id/verify

## Admin

GET /admin/applications
PATCH /admin/applications/:id/approve
PATCH /admin/applications/:id/reject
GET /admin/agents

# Entities

User
Application
Document
Notification
Service
BankPartner

# User Fields

id
name
email
password
phone
role
createdAt

# Application Fields

id
userId
serviceId
assignedAgentId
status
remarks
createdAt

# Document Fields

id
userId
documentType
fileName
fileType
fileSize
fileUrl
verificationStatus
uploadedAt

# Notification Fields

id
userId
title
message
isRead
createdAt

# Service Fields

id
name
category
isActive

# BankPartner Fields

id
name
contactPerson
email
phone
isActive

Supported Formats:
- PDF
- DOC
- DOCX
- JPG
- JPEG
- PNG

# Relationships

User
├── has many Applications
├── has many Documents
├── has many Notifications

Application
├── belongs to User
├── belongs to Service
├── assigned to Agent
├── assigned to Bank Partner

Service
├── has many Applications

BankPartner
├── has many Applications

Agent (User with AGENT role)
├── manages many Applications