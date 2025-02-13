# Domicile Hotels - Booking System

## Overview
Domicile Hotels Booking System is a comprehensive web application that provides a seamless hotel room booking experience. Built with React and Firebase, it offers both client-facing features for hotel guests and administrative tools for hotel management.

## Live Demo
[Add your deployed application URL here]

## Features

### Client Features
- **User Authentication**
  - Email/password registration and login
  - Secure session management
  - Password reset functionality

- **Room Browsing & Booking**
  - View detailed room information with high-quality images
  - Real-time room availability checking
  - Advanced filtering options (price, room type, capacity, amenities)
  - Interactive room search with instant results
  - Secure PayPal payment integration

- **Booking Management**
  - View booking history and current reservations
  - Access booking details and confirmation
  - Download booking receipts
  - Special requests handling

- **User Profile**
  - Personal information management
  - Contact details updates
  - Booking preferences

### Admin Features
- **Dashboard**
  - Overview of bookings, occupancy rates, and revenue
  - Real-time booking notifications
  - Quick access to key management functions

- **Room Management**
  - Add/edit room details and pricing
  - Update room availability
  - Manage room images and descriptions
  - Set room amenities and features

- **Booking Administration**
  - View and manage all bookings
  - Process check-ins/check-outs
  - Handle booking modifications
  - Generate booking reports

## Technology Stack
- **Frontend**: React.js
- **State Management**: React Context API
- **UI Components**: React Icons, SweetAlert2
- **Maps Integration**: React Leaflet
- **Payment Processing**: PayPal SDK
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Cloud Storage
- **Styling**: CSS3 with responsive design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd domicile-hotels
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_KEY=your_firebase_api_key
   REACT_APP_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_PROJECT_ID=your_firebase_project_id
   REACT_APP_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_APP_ID=your_firebase_app_id
   REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

4. **Firebase Setup**
   - Create a new project in Firebase Console
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Set up storage rules
   - Copy your Firebase configuration to the `.env` file

5. **Start Development Server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## Usage Guide

### For Clients
1. **Registration/Login**
   - Create an account using email and password
   - Login with credentials
   - Reset password if forgotten

2. **Booking a Room**
   - Browse available rooms
   - Use filters to find specific room types
   - Select check-in/check-out dates
   - Complete booking with PayPal payment

3. **Managing Bookings**
   - View booking history
   - Access booking details
   - Download booking confirmations
   - Submit special requests

### For Administrators
1. **Accessing Admin Panel**
   - Login with admin credentials
   - Navigate to admin dashboard

2. **Managing Rooms**
   - Add new rooms with details
   - Update room information
   - Manage availability
   - Set pricing

3. **Managing Bookings**
   - View all bookings
   - Process check-ins/check-outs
   - Handle booking modifications
   - Generate reports

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support
For support, please contact:
- Email: [support@domicilehotels.com]
- Phone: [+27 12 345 6789]

## License
[Add your license information here]

## Acknowledgments
- React.js team
- Firebase team
- All contributors and supporters

## Project Structure
```
domicile-hotels/
├── src/
│   ├── components/
│   │   ├── admin/         # Admin-specific components
│   │   │   └── AdminStyles/  # Admin-specific styles
│   │   ├── client/        # Client-specific components
│   │   │   ├── common/    # Shared client components
│   │   │   └── ClientStyles/  # Client-specific styles
│   │   └── shared/        # Global shared components
│   ├── context/          # React Context providers
│   ├── firebase/         # Firebase configuration
│   └── assets/           # Images and static assets
```

## Security Considerations
- Secure authentication using Firebase Auth
- Protected routes for authenticated users
- Environment variables for sensitive data
- Input validation and sanitization
- CORS policies implementation
- Regular security updates

## Performance Optimization
- Lazy loading of images
- Component code splitting
- Caching strategies
- Optimized database queries
- Minimized bundle size

## Best Practices
### Coding Standards
- Follow React best practices
- Use consistent naming conventions
- Implement proper error handling
- Write meaningful comments
- Follow ESLint configuration

### Git Workflow
1. Create feature branches from `develop`
2. Use meaningful commit messages
3. Submit PRs for review
4. Merge only after approval
5. Keep branches up to date

## Testing
### Unit Tests
```bash
npm test
```
- Component rendering tests
- User interaction tests
- Context provider tests
- Utility function tests

### End-to-End Tests
```bash
npm run test:e2e
```
- User flow testing
- Integration testing
- Cross-browser testing

## Deployment
### Production Build
```bash
npm run build
```

### Deployment Checklist
- [ ] Update environment variables
- [ ] Run all tests
- [ ] Build production bundle
- [ ] Check bundle size
- [ ] Verify Firebase configuration
- [ ] Test payment integration
- [ ] Validate all forms and functions
- [ ] Check responsive design
- [ ] Verify SEO elements

## Troubleshooting
### Common Issues
1. **Authentication Errors**
   - Verify Firebase credentials
   - Check email verification status
   - Ensure proper route protection

2. **Payment Processing Issues**
   - Validate PayPal credentials
   - Check payment callback URLs
   - Verify transaction logs

3. **Database Connection Issues**
   - Check Firebase rules
   - Verify network connectivity
   - Review database indices

### Error Logging
- Application errors are logged to Firebase Analytics
- Critical errors trigger admin notifications
- User feedback collection for bug reports

## API Documentation
### Firebase API
- Authentication endpoints
- Database operations
- Storage interactions

### PayPal Integration
- Payment initialization
- Transaction processing
- Refund handling

## Environment Setup
### Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Generate build
npm run build
```

### Production
```bash
# Set production environment
export NODE_ENV=production

# Install dependencies
npm ci

# Build application
npm run build
```

## Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Known Issues
- [List any known bugs or limitations]
- [Include workarounds if available]

## Future Enhancements
- Mobile application development
- Multi-language support
- Advanced analytics dashboard
- AI-powered pricing optimization
- Virtual room tours
- Loyalty program integration

## Version History
### v1.0.0 (Current)
- Initial release
- Basic booking functionality
- User authentication
- Admin dashboard

### Planned Updates
- v1.1.0: Enhanced reporting
- v1.2.0: Mobile responsiveness
- v2.0.0: Advanced features

## FAQ
1. **How do I reset my password?**
   - Use the "Forgot Password" link on the login page

2. **Can I modify my booking?**
   - Yes, through the booking management section

3. **How do I contact support?**
   - Email: support@domicilehotels.com
   - Phone: +27 12 345 6789
   - In-app help center

## Resources
- [React Documentation](https://reactjs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [PayPal Developer Documentation](https://developer.paypal.com/docs)
