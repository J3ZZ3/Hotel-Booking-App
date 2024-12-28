figma design :https://www.figma.com/design/aFxESiLmnRgPG81p68gKCx/Flux---Figma-Build-Tutorial-(Starter)-(Community)?node-id=210-124&t=efS9aIvfTLirt2iQ-1

Hotel Booking System
Overview
The Hotel Booking System is a web application designed to facilitate the booking of hotel rooms. It provides a user-friendly interface for both clients and administrators, allowing users to register, log in, view available rooms, and manage bookings. The application is built using React and integrates with Firebase for authentication and database management.

Features
Client Features
User Registration and Login: Clients can create an account and log in to manage their bookings.
Room Booking: Clients can view available rooms and make bookings through a secure payment system (PayPal).
Booking History: Clients can view their past bookings and ratings.
Responsive Design: The application is designed to be mobile-friendly, ensuring a seamless experience across devices.
Admin Features
Admin Dashboard: Admins can manage room listings, view customer bookings, and add or edit room details.
User Management: Admins can add new admins and manage user accounts.
Customer Bookings: Admins can view and manage customer bookings, including updating booking statuses.
Technologies Used
Frontend: React.js
Styling: CSS
Backend: Firebase (Firestore for database, Firebase Auth for authentication)
Payment Processing: PayPal SDK

Installation
To run the project locally, follow these steps:
1. Clone the repository:

git clone
cd 

2.Install dependencies:
```bash
    npm install
```
3.Set up Firebase:

-Create a Firebase project at Firebase Console.
-Enable Firestore and Authentication (Email/Password).
-Create a .env file in the root directory and add your Firebase configuration:

     REACT_APP_API_KEY=your_api_key
     REACT_APP_AUTH_DOMAIN=your_auth_domain
     REACT_APP_PROJECT_ID=your_project_id
     REACT_APP_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_APP_ID=your_app_id

4. Run the application:
```bash
npm start
```
