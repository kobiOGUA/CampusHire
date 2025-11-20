# CampusHire - Student Job Portal

## Overview
CampusHire is a comprehensive web application that connects students with job opportunities and recruiters. Built with HTML, CSS, and vanilla JavaScript, it uses Firebase for authentication and data storage.

**Status**: ✅ Ready for Use  
**Last Updated**: November 20, 2025

## Project Type
- **Frontend**: Static HTML/CSS/JavaScript application
- **Backend**: Firebase (Firestore + Authentication)
- **Server**: Python HTTP server for local development

## Key Features
- **For Students**: Profile management, job browsing, application tracking
- **For Recruiters**: Job posting, applicant management, status updates
- **For Admins**: User management, job oversight, analytics dashboard

## Architecture
### Frontend Structure
- Static HTML pages for each user role (student, recruiter, admin)
- Modular JavaScript using ES6 modules
- Responsive CSS with mobile-first approach
- Firebase SDK via CDN for backend services

### Database (Firebase Firestore)
Collections:
- `users` - User profiles (students, recruiters, admins)
- `jobs` - Job postings with recruiter details
- `applications` - Application tracking with status
- `studentCVs` - CV uploads stored as base64

## Development Setup
The application runs on a Python HTTP server bound to `0.0.0.0:5000` to serve static files and work with Replit's proxy system.

## Firebase Configuration
Firebase config is embedded in `js/app.js`. The application uses:
- Firebase Authentication v12.4.0
- Cloud Firestore v12.4.0
- ES6 module imports from CDN

### Security Note
The Firebase API key visible in `js/app.js` is a **web API key** intended for client-side use and is safe to be public. Firebase security is enforced through:
- **Firestore Security Rules**: Control who can read/write data
- **Firebase Authentication**: Verify user identity
- **API Key Restrictions**: Can be configured in Firebase Console to restrict usage by domain

The API key identifies your Firebase project but does not grant unauthorized access. All security is managed server-side by Firebase through properly configured security rules.

## User Roles
1. **Students**: Can create profiles, upload CVs, browse jobs, and apply
2. **Recruiters**: Can post jobs, view applicants, and manage applications
3. **Admins**: Can manage users/jobs and view analytics

## Quick Start Guide
1. Navigate to the home page
2. Register as a student or recruiter
3. For admin access, use `/admin_register.html` (one-time setup)

## Recent Changes
- November 20, 2025: Comprehensive project audit and fixes
  - Fixed profile picture upload to properly convert images to base64 and store in Firebase
  - Configured for Replit environment with Python HTTP server on port 5000
  - Added deployment configuration for static hosting
  - Cleaned up duplicate project folder and unnecessary files
  - Verified all pages load correctly with no LSP errors
  - Confirmed Firebase authentication and Firestore integration working properly
