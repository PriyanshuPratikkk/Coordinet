# Coordinet - Club & Festival Management App

Coordinet is a frontend-only Next.js application designed to streamline the management of college clubs and festivals. This application uses client-side data persistence via localStorage.

## Features

- **User Authentication**: Email/password authentication with role-based access control
- **Role-Based Access**: Two user roles - club leaders and students, each with tailored experiences
- **Club Management**: Create and manage clubs with descriptions and member tracking
- **Festival Organization**: Plan and coordinate festivals with detailed information and file uploads
- **Sub-Events**: Break down festivals into smaller events with separate registrations
- **Task Management**: Assign and track tasks for festival organization (club leaders only)
- **Expense Tracking**: Record and monitor expenses for festivals (club leaders only)
- **Participation Management**: Students can register for festivals and sub-events

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Client-side data persistence** with localStorage
- **Base64 file encoding** for storing images and documents

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/coordinet.git
   cd coordinet
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
  auth/
    signup/page.tsx      # User registration
    signin/page.tsx      # User login
  dashboard/
    leader/page.tsx      # Club leader dashboard
    student/page.tsx     # Student dashboard
  festivals/
    [id]/page.tsx        # Festival details page
    create/page.tsx      # Create festival page
  subevents/
    [id]/page.tsx        # Sub-event details page
  page.tsx               # Home page
  layout.tsx             # Root layout
components/
  Button.tsx             # Reusable button component
  Card.tsx               # Card component family
  Input.tsx              # Form input component
  Navbar.tsx             # Application navigation bar
lib/
  localStorage.ts        # Data persistence utilities
  utils.ts               # Utility functions
styles/
  globals.css            # Global styles and Tailwind imports
types.ts                 # TypeScript type definitions
utils/
  authGuard.ts           # Route protection utilities
  fileToBase64.ts        # File conversion utilities
```

## Data Models

The application uses the following key data models:

- **User**: Authentication and profile information
- **Club**: Organization details and members
- **Festival**: Event information, dates, and files
- **SubEvent**: Individual activities within festivals
- **Task**: Assignments for festival organization
- **Expense**: Financial tracking for festivals
- **Participation**: Registration records for festivals and sub-events

## Development

### Building for Production

```bash
npm run build
```

### Running in Production Mode

```bash
npm start
```

## Notes

- This is a frontend-only application with no backend server
- All data is stored in the browser's localStorage
- File uploads are converted to Base64 strings and stored in localStorage
- In a production environment, consider implementing proper backend storage and authentication

---

© 2025 Coordinet. All rights reserved.#   C o o r d i n e t  
 #   C o o r d i n e t  
 #   C o o r d i n e t  
 