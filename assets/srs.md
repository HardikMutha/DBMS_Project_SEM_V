# Software Requirements Specification

## CampGround Site

### Team Details

- Khush Gandhi - 612303058
- Hardik Mutha - 612303066
- Suswan Joglekar - 612303074
- Tanmay Karad - 612303083

<hr>

### Table of Contents

1. [Introduction](#introduction)
    - [Purpose](#purpose)
    - [Scope](#scope)
    - [Definitions, Acronyms, and Abbreviations](#definitions-acronyms-and-abbreviations)
    - [References](#references)
    - [Overview](#overview)

2. [Overall Description](#overall-description)
    - [Product Perspective](#product-perspective)
    - [Product Functions](#product-functions)
    - [User Characteristics](#user-characteristics)
    - [Constraints](#constraints)
    - [Assumptions and Dependencies](#assumptions-and-dependencies)

3. [Specific Requirements](#specific-requirements)
    - [Functional Requirements](#functional-requirements)
    - [Non-Functional Requirements](#non-functional-requirements)
    - [External Interface Requirements](#external-interface-requirements)

4. [Appendices](#appendices)
    - [Glossary](#glossary)
    - [Assumptions](#assumptions)
    - [References](#references)

5. [Index](#index)

<div style="page-break-after: always;"></div>

## Introduction

### Purpose
This document defines the Software Requirements Specification (SRS) for the CampGround Booking Platform, a web-based system that enables users to discover, list, and book verified campgrounds. It serves as a formal agreement between developers and evaluators, specifying what the system will do, not how it will do it.

### Scope
The project provides a unified online solution for campers to find, book, and review campgrounds, while owners can list and manage their properties. It integrates core modules such as user management, booking, reviews, amenities, and admin approval.
The system demonstrates database normalization (up to 3NF), CRUD operations, and the application of UML-based software design principles.

### Definitions, Acronyms, and Abbreviations
| Term | Definition                        |
|------|-----------------------------------|
| CRUD | Create, Read, Update, Delete operations |
| UPI  | Unified Payments Interface       |
| ERD  | Entity Relationship Diagram      |
| UI   | User Interface                    |
| SRS  | Software Requirements Specification |

### References
- IEEE Std 830-1998: Software Requirements Specification Format
- Unit 2: Requirement Engineering (Academic Reference, 2025)
- add some more references

### Overview
This SRS outlines the project description, functionalities, user roles, and both functional and non-functional requirements. The document also includes database and design perspectives to integrate SE and DBMS aspects.

<div style="page-break-after: always;"></div>

## Overall Description

### Product Perspective
The CampGround Platform is a standalone web application built using a 3-tier architecture:
- **Frontend Layer**: Web interface for users, owners, and admins.
- **Backend Layer**: Node.js/Express REST API for business logic.
- **Database Layer**: MySQL database storing normalized relational data.

### Product Functions
Key system functions include:
1. User registration and authentication
2. Campground listing and admin approval
3. Booking and payment handling
4. Review and rating system
5. Notifications for approvals and bookings
6. Search and filtering by price, location, and amenities

### User Characteristics
| User Type        | Description                                   | Access Level |
|------------------|-----------------------------------------------|--------------|
| Admin            | Approves listings, manages users & FAQs.     | Full         |
| Campground Owner | Lists and manages campgrounds, views bookings.| Moderate     |
| Camper/User      | Searches, books, reviews, and favorites campgrounds.| Basic       |

### Constraints
- Database must be implemented using MySQL.
- Interfaces must follow a RESTful API design.
- Authentication handled using secure password storage.
- Only approved campgrounds visible to users.

### Assumptions and Dependencies
- Users must have internet access.
- Payment system simulated (not real).
- Browser-based access assumed (desktop/mobile).
- The system depends on MySQL and Node.js environment.

<div style="page-break-after: always;"></div>

## Specific Requirements

### Functional Requirements
| ID    | Functionality         | Description                                                      |
|-------|----------------------|------------------------------------------------------------------|
| FR-1  | User Management       | Register/login users and assign roles (admin, owner, camper).    |
| FR-2  | Campground Management | Owners can create, edit, and delete campground listings.         |
| FR-3  | Admin Approval        | Admin approves or rejects new campground listings.               |
| FR-4  | Booking System        | Users can book campgrounds with valid date ranges and payment type. |
| FR-5  | Review System         | Campers can rate and review campgrounds post-booking.            |
| FR-6  | Amenity Management    | Campgrounds can have multiple amenities, free or paid.           |
| FR-7  | Notification System   | System generates booking and approval notifications.             |
| FR-8  | Favorites Feature     | Users can mark campgrounds as favorites.                         |
| FR-9  | Search and Filter     | Search by location, price, or amenities.                         |
| FR-10 | Rules and Policies    | Each campground maintains check-in/out and payment policies.     |

### Non-Functional Requirements
| ID    | Category      | Requirement                                                     |
|-------|---------------|-----------------------------------------------------------------|
| NFR-1 | Performance   | The system shall handle up to 100 concurrent users with response time < 2s. |
| NFR-2 | Security      | Passwords stored in encrypted format; access restricted by role.|
| NFR-3 | Usability     | Interface shall be user-friendly, mobile-compatible, and intuitive. |
| NFR-4 | Reliability   | Daily database backup to prevent data loss.                     |
| NFR-5 | Maintainability | Modular backend services to support easy debugging and updates. |
| NFR-6 | Scalability   | Design shall support future features like payment gateway and analytics. |

### External Interface Requirements
| Type                  | Description                                                        |
|-----------------------|--------------------------------------------------------------------|
| User Interface        | Web-based, responsive layout with forms for booking, registration, and reviews. |
| Hardware Interface    | Standard computing devices (laptops, phones).                      |
| Software Interface    | MySQL 8.0 (DB), Node.js backend, React frontend.                   |
| Communication Interface | HTTP/HTTPS with JSON data exchange.                               |

<div style="page-break-after: always;"></div>

## Appendices

### Glossary
| Term  | Description                  |
|-------|------------------------------|
| CRUD  | Create, Read, Update, Delete |
| ERD   | Entity Relationship Diagram  |
| UPI   | Unified Payments Interface   |
| UI    | User Interface               |

### Assumptions
- All users have access to stable internet.
- Payments are handled via mock gateway.
- Users must register before booking.

### References
1. IEEE 830-1998 – SRS Standard
2. Unit 2 Notes – Requirement Engineering (Academic)
3. add more references as needed

## Index
**Keywords**: Campground, Booking, Admin, Owner, Review, DBMS, Normalization, User, Rules, Amenities.
