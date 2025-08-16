# investlp - Investment Platform

A modern investment platform built with Next.js, featuring user authentication, portfolio management, and comprehensive investment tools.

## Features

- **Complete Pages**: Home, About, Education, Platforms, Promotions, Trading
- **User Authentication**: JWT-based authentication with NextAuth.js
- **Dashboard**: User portfolio overview, investments, transactions, and settings
- **Responsive Design**: Modern UI with Framer Motion animations
- **Database**: MongoDB integration with Mongoose

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with JWT strategy
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS with custom CSS variables
- **Animations**: Framer Motion
- **Icons**: React Icons

## Setup Instructions

### 1. Install Dependencies

```bash
npm install next-auth bcryptjs mongoose
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/investlp

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here-change-in-production
```

### 3. Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `investlp`
3. The application will automatically create the required collections

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth configuration
│   │   └── register/route.ts            # User registration API
│   ├── about/page.tsx                   # About page
│   ├── dashboard/page.tsx               # User dashboard
│   ├── education/page.tsx               # Education resources
│   ├── login/page.tsx                   # Login page
│   ├── platforms/page.tsx               # Trading platforms
│   ├── promotions/page.tsx              # Promotions and bonuses
│   ├── register/page.tsx                # Registration page
│   ├── trading/page.tsx                 # Trading page
│   ├── globals.css                      # Global styles
│   ├── layout.tsx                       # Root layout
│   └── Navigation.tsx                   # Navigation component
├── components/
│   └── Footer.tsx                       # Footer component
├── lib/
│   └── mongodb.ts                       # MongoDB connection utility
└── models/
    └── User.ts                          # User data model
```

## Authentication Flow

1. **Registration**: Users can create accounts with email/password
2. **Login**: Secure authentication with NextAuth.js
3. **Dashboard**: Protected routes for authenticated users
4. **Session Management**: JWT-based sessions with automatic renewal

## Database Models

### User Model
- Basic info: name, email, password
- Profile: phone, country, date of birth, KYC status
- Investment data: deposits, withdrawals, balance, profit
- Active investments tracking

## Design System

The application follows a consistent design pattern:
- **Color Scheme**: Dark theme with blue accents
- **Typography**: Clean, modern fonts with good hierarchy
- **Components**: Cards with subtle borders, shadows, and hover effects
- **Animations**: Smooth transitions and micro-interactions with Framer Motion
- **Layout**: Responsive grid systems with consistent spacing

## Available Routes

- `/` - Home page with investment overview
- `/about` - Company information and team
- `/education` - Investment courses and resources
- `/platforms` - Trading platform information
- `/promotions` - Current offers and bonuses
- `/trading` - Trading tools and market data
- `/login` - User authentication
- `/register` - User registration
- `/dashboard` - User portfolio (protected)

## Development

### Adding New Features
1. Follow the established design pattern
2. Use the existing color variables and spacing
3. Implement responsive design
4. Add Framer Motion animations for smooth interactions

### Styling Guidelines
- Use CSS variables for colors: `var(--background)`, `var(--foreground)`, `var(--brand)`
- Maintain consistent spacing: `mt-32`, `px-4`, `gap-8`
- Use the established card design: `bg-[var(--card-bg)]`, `border-[var(--brand)]/20`

## Deployment

1. Set up environment variables in your hosting platform
2. Configure MongoDB connection (local or cloud)
3. Build and deploy:
   ```bash
   npm run build
   npm start
   ```

## Contributing

1. Follow the existing code structure and design patterns
2. Maintain responsive design principles
3. Use TypeScript for type safety
4. Test authentication flows thoroughly

## License

This project is proprietary software. All rights reserved.
