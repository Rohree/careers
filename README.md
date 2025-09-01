# React Careers & Admin App

A full-featured job posting and application management system built with React, Netlify Functions, Supabase, and Firebase Auth.

## Features

### Careers Page (Public)
- Browse available job openings
- Apply to positions with cover letter and CV upload
- Responsive design for all devices

### Admin Dashboard (Protected)
- Firebase Authentication for secure access
- Add new job postings
- Delete existing jobs
- View all applications (future feature)

### Backend
- Netlify Functions for all API endpoints
- Supabase database for data storage
- File uploads with Supabase Storage
- Email notifications via Nodemailer

## Setup

1. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your credentials:
   - Supabase project URL and keys
   - Firebase project configuration
   - SMTP email settings

2. **Database Setup**
   - Connect to Supabase using the "Connect to Supabase" button
   - Run the migration to create tables:
     ```sql
     -- The migration file will be automatically applied
     ```

3. **Firebase Setup**
   - Create a Firebase project
   - Enable Email/Password authentication
   - Add your admin user credentials

4. **Email Configuration**
   - Configure SMTP settings (Gmail recommended)
   - Use App Password for Gmail authentication

## Development

```bash
npm run dev
```

## Deployment

This app is designed to deploy to Netlify with automatic function deployment.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Routing**: React Router DOM
- **Backend**: Netlify Functions
- **Database**: Supabase
- **Authentication**: Firebase Auth
- **Email**: Nodemailer
- **File Storage**: Supabase Storage