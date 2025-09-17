<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Feez - Fee Management Application

This is a Next.js full-stack fee management application for tracking monthly payments.

## Application Overview
**Feez** is a modern, minimalistic web application for fee management with the following core functionality:
- **Single user role**: One authenticated user (like a teacher) manages all entries
- **Entry management**: Add/manage entries (e.g., students) with monthly fee obligations  
- **Payment tracking**: Mark fees as paid/unpaid per month (12 months per year)
- **Public access**: Read-only view of fee tracking for visitors (no login required)
- **Private dashboard**: Full management interface for authenticated users
- **Responsive design**: Dark theme, mobile-first, clean and simple UI

## Technology Stack
- **Frontend**: Next.js 15.5.3 with React 19.1.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Dark theme, mobile-first)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs for password hashing
- **Validation**: Zod for schema validation
- **API**: Next.js App Router API routes

## Database Schema

### Users Collection
```
user: {
  userID: ObjectId (MongoDB _id)
  userName: string
  user: string (username/email)
  password: string (hashed)
}
```

### Entries Collection
```
entries: {
  userID: ObjectId (reference to user)
  [entryname]: {
    monthlyPaymentStatus: {
      1: boolean,  // January
      2: boolean,  // February  
      3: boolean,  // March
      4: boolean,  // April
      5: boolean,  // May
      6: boolean,  // June
      7: boolean,  // July
      8: boolean,  // August
      9: boolean,  // September
      10: boolean, // October
      11: boolean, // November
      12: boolean  // December
    }
  }
}
```

## Project Structure
- `/src/app` - Next.js App Router pages and API routes
- `/src/app/(auth)` - Authentication pages (login)
- `/src/app/dashboard` - Private dashboard for authenticated users
- `/src/app/public` - Public read-only fee tracking view
- `/src/lib` - Utility functions and database connections
- `/src/models` - MongoDB/Mongoose models (User, Entry)
- `/src/types` - TypeScript type definitions
- `/src/components` - Reusable React components
- `/src/components/ui` - UI components (forms, tables, cards)

## Key Features Requirements
1. **Authentication System**
   - Secure login for single user
   - JWT token-based authentication
   - Protected routes for dashboard
   
2. **Entry Management**
   - Add/edit/delete entries (students)
   - Bulk operations support
   - Search and filter entries
   
3. **Payment Tracking**
   - Monthly payment status (paid/unpaid) for each entry
   - Quick toggle payment status
   - Visual payment calendar/grid
   - Payment history tracking
   
4. **Dashboard Views**
   - **Private**: Full management interface with CRUD operations
   - **Public**: Read-only view showing payment statuses
   - **Summary**: Overview of payments by month, outstanding amounts
   
5. **UI/UX Requirements**
   - **Dark theme** as primary design
   - **Mobile-first** responsive design
   - **Minimalistic** and clean interface
   - **Intuitive** for non-technical users
   - **Fast loading** and smooth interactions

## Development Guidelines
1. **API Routes**: Use `/src/app/api/` directory with proper HTTP methods
2. **Database**: Always use the `dbConnect()` function before database operations
3. **Error Handling**: Use consistent API responses and user feedback
4. **Authentication**: Implement JWT middleware for protected routes
5. **Validation**: Validate all inputs using Zod schemas
6. **Security**: Hash passwords, sanitize inputs, implement CORS
7. **Styling**: Use Tailwind CSS with dark theme utilities
8. **State Management**: Use React state and context for global state
9. **File-based Routing**: Leverage Next.js App Router for pages and API

## Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `NEXTAUTH_URL` - Application URL for authentication
- `NEXTAUTH_SECRET` - NextAuth secret key

## Code Style & Best Practices
- Use functional components with TypeScript
- Implement proper error boundaries and loading states
- Follow Next.js best practices for SEO and performance
- Use server components where possible, client components when needed
- Always handle loading and error states in UI components
- Implement responsive design patterns
- Use semantic HTML and accessibility features
- Follow modern authentication and security practices
