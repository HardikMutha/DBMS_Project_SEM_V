# CampGround Site

### Team Details

- Khush Gandhi - 612303058
- Hardik Mutha - 612303066
- Suswan Joglekar - 612303074
- Tanmay Karad - 612303083


## Problem Statement

Travelers seeking outdoor camping experiences often struggle to find verified, well-documented campgrounds online. Existing travel platforms focus mostly on hotels and resorts, leaving campsite owners with little digital visibility. Moreover, booking systems for campgrounds are either scattered or rely on manual coordination. This project aims to develop a dedicated **CampGround Booking Platform** that connects campers with verified campgrounds, offering an intuitive interface for searching, booking, and managing stays — thereby digitizing the camping experience.


## Objectives

1. To provide a **unified platform** for discovering, listing, and booking campgrounds.

2. To allow campground owners to manage their listings, availability, and pricing in real-time.

3. To let users book campgrounds easily with confirmation tracking.

4. To ensure an intuitive, responsive user interface for both desktop and mobile users.

5. To maintain a database of campgrounds with ratings, facilities, and location data.

6. To provide normalized, efficient, and consistent database design up to
**3NF**.


## Functional Requirements

### User Roles:

- **Admin**: Manage user accounts, approve/reject listings, moderate reviews, handle reports.

- **Campground Owner**: Create/update/delete listings, set pricing, manage availability, view bookings.

- **User (Camper)**: Browse campgrounds, view amenities, make bookings, post reviews.

### Core Functions:

- **Campground Listing**: Owners can add details, images, location, and pricing.

- **Booking System**: Users can reserve campgrounds with start/end dates.

- **Review System**: Campers can rate and review their experiences.

- **Search & Filter**: Search by location, price range, or amenities.

- **Admin Dashboard**: Oversee user activity, reports, and analytics.


## ER Diagram

![image](cg-er-svg-final.svg)


## Relational Schemas

1. **Users**
    - `(id PK, username U, role, email, password)`

2. **Location**
    - `(id PK, place, longitude, latitude, UNIQUE(longitude, latitude))`

3. **Campground**
    - `(id PK, title, description, capacity, type, locId FK → Location(id), ownerId FK → Users(id), isApproved, price)`

4. **Request**
    - `(id PK, requestedBy FK → Users(id), campgroundId FK → Campground(id), status)`

5. **Amenity**
    - `(id PK, name U, isPaid, price)`

6. **Review**
    - `(id PK, userId FK → Users(id), campgroundId FK → Campground(id), content, rating)`

7. **Booking**
    - `(userId FK → Users(id), bookingId U, campgroundId FK → Campground(id), checkInDate, checkOutDate, createdAt, amount, PRIMARY KEY(userId,campgroundId,checkInDate))`

8. **HasAmenity**
    - `(amenity_id FK → Amenity(id), campgroundId FK → Campground(id), PRIMARY KEY(amenity_id,campgroundId))`

9. **HasFavourite**
    - `(userId FK → Users(id), campgroundId FK → Campground(id), PRIMARY KEY(campgroundId,userId))`

10. **Images**
    - `(id, imgUrl, campgroundId FK → Campground(id), PRIMARY KEY(id,campgroundId))`

11. **Notifications**
    - `(id PK, content, userId FK → Users(id), viewed)`

12. **ApprovalNotif**
    - `(notifId PK FK → Notifications(id), requestId FK → Request(id))`

13. **BookingNotif**
    - `(notifId PK FK → Notifications(id), bookingId FK → Booking(bookingId))`

14. **FAQs**
    - `(faqId PK, question, answer)`

15. **Rules**
    - `(campgroundId PK FK → Campground(id), checkInStart, checkInEnd, checkOutStart, checkOutEnd, cancellationPolicy, cash, upi, card)`


## Functional Dependencies

1. **Users**
    - id → {username, role, email, password} (Primary Key)
    - username → {id, role, email, password} (UNIQUE)

2. **Location**
    - id → {place, longitude, latitude} (Primary Key)
    - {longitude, latitude} → {id, place} (UNIQUE)

3. **Campground**
    - id → {title, description, capacity, type, locId, ownerId, isApproved, price} (Primary Key)

4. **Request**
    - id → {requestedBy, campgroundId, status}

5. **Amenity**
    - id → {name, isPaid, price} (Primary Key)
    - name → {id, isPaid, price} (UNIQUE)

6. **Review**
    - id → {userId, campgroundId, content, rating} (Primary Key)

7. **Booking**
    - {userId, campgroundId, checkInDate} → {bookingId, checkOutDate, createdAt, amount} (Primary Key)
    - bookingId → {userId, campgroundId, checkInDate, checkOutDate, createdAt, amount} (UNIQUE)

8. **Images**
    - {id, campgroundId} → {imgUrl} (Primary Key)

9. **Notification**
    - id → {content, userId, viewed} (Primary Key)

10. **FAQs**
    - faqId → {question, answer} (Primary Key)

11. **Rules**
    - campgroundId → {checkInStart, checkInEnd, checkOutStart, checkOutEnd, cancellationPolicy, cash, upi, card} (Primary Key)