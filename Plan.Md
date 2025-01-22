# Project Planning Document: Hotel Booking System

## Project Overview
The Hotel Booking System is a web application designed to facilitate the booking of hotel rooms. It provides a user-friendly interface for both clients and administrators, allowing users to register, log in, view available rooms, and manage bookings.

## Features

### Client Features
- User Registration and Login
- Room Booking through a secure payment system (PayPal)
- Booking History
- Responsive Design

### Admin Features
- Admin Dashboard
- User Management
- Customer Bookings Management

## Technologies Used
- Frontend: React.js
- Styling: CSS
- Backend: Firebase (Firestore for database, Firebase Auth for authentication)
- Payment Processing: PayPal SDK

## Project Structure
- **src/**
  - **components/**
    - **admin/** (Admin-related components)
      - AdminDashboard.js
      - AdminLogin.js
      - AddAdmin.js
      - AdminNavbar.js
      - CustomerBookings.js
      - RoomList.js
    - **client/** (Client-related components)
      - ClientDashboard.js
      - ClientLogin.js
      - BookingForm.js
      - BookingHistory.js
    - **shared/** (Shared components)
      - Button.js
      - Toast.js
  - **context/** (Context for authentication)
    - AuthContext.js
  - **firebase/** (Firebase configuration)
    - firebaseConfig.js
  - App.js
  - index.js

## User Stories
1. As a client, I want to register and log in to manage my bookings.
2. As a client, I want to view available rooms and make bookings.
3. As an admin, I want to manage room listings and view customer bookings.
4. As an admin, I want to add new admins and manage user accounts.

## Milestones
1. Set up project structure and install dependencies.
2. Implement user authentication (registration and login).
3. Create admin dashboard and client dashboard.
4. Implement room booking functionality.
5. Integrate PayPal for payment processing.
6. Test the application and fix any bugs.
7. Deploy the application.

## Future Enhancements
- Add user reviews and ratings for rooms.
- Implement email notifications for bookings.
- Enhance the UI/UX for better user experience.

## Notes
- Ensure to follow best practices for coding and documentation.
- Regularly commit changes to version control (Git).
- Keep the README.md updated with project information.
