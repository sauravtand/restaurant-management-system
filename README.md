# Restaurant Management System

A comprehensive web-based restaurant management system built with Next.js and React. This application helps restaurant owners and staff manage tables, menu items, and orders efficiently.


## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **UI Components**: React, shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Custom authentication with localStorage
- **Icons**: Lucide React

## Features

- **Authentication & Authorization**
  - Role-based access control (Owner, Manager, Staff)
  - Multi-restaurant support with restaurant code

- **Dashboard**
  - Overview of restaurant performance
  - Real-time statistics for tables, menu items, and orders
  - Quick access to today's orders

- **Menu Management**
  - Add, edit, and delete menu items
  - Toggle item availability
  - Categorize menu items

- **Table Management**
  - Visual table layout
  - Table status tracking (Free, Occupied, Reserved)
  - Table capacity management

- **Order Management**
  - Create and manage orders
  - Add multiple items to an order
  - Track order status (Pending, Preparing, Served, Completed, Cancelled)
  - Real-time order updates

## How to Run the Project

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/sauravtand/restaurant-management-system.git
   cd restaurant-management-system
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   ## or
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev

   ## or
   
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Login Credentials

The system comes with pre-configured demo accounts:

**Italiano Delizioso (REST001)**
- Email: john@example.com
- Password: password
- Restaurant Code: REST001

**Sushi Paradise (REST002)**
- Email: akira@example.com
- Password: password
- Restaurant Code: REST002

## Assumptions

1. **Data Persistence**: This demo uses in-memory storage. In a production environment, you would integrate with a database like PostgreSQL, MongoDB, or a similar solution.

2. **Authentication**: The current implementation uses localStorage for authentication. In a production environment, you would implement JWT tokens, HTTP-only cookies, or a similar secure authentication method.

3. **Multi-restaurant Support**: The system assumes each user belongs to a specific restaurant identified by a restaurant code.

4. **Role-based Access**: The system implements basic role-based access control with three roles: owner, manager, and staff.

5. **Real-time Updates**: The current implementation simulates real-time updates through state management. In a production environment, you might use WebSockets or a similar technology for true real-time functionality.

## Project Structure

\`\`\`
restaurant-management/
├── app/                    # Next.js App Router
│   ├── dashboard/          # Dashboard pages
│   │   ├── menu/           # Menu management
│   │   ├── orders/         # Order management
│   │   ├── tables/         # Table management
│   │   └── layout.tsx      # Dashboard layout
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Login page
├── components/             # Reusable components
│   ├── ui/                 # UI components (shadcn/ui)
│   ├── dashboard-sidebar.tsx
│   ├── login-form.tsx
│   └── role-guard.tsx
├── context/                # React Context providers
│   ├── auth-context.tsx    # Authentication context
│   └── restaurant-context.tsx # Restaurant data context
├── lib/                    # Utility functions and types
│   ├── auth-service.ts     # Authentication service
│   ├── data-service.ts     # Data service
│   ├── mock-data.ts        # Mock data
│   └── types.ts            # TypeScript types
└── public/                 # Static assets


## Future Improvements

1. **Database Integration**: Replace in-memory storage with a proper database
2. **Real-time Updates**: Implement WebSockets for real-time data synchronization
3. **Advanced Analytics**: Add reporting and analytics features
4. **Kitchen Display System**: Add a dedicated view for kitchen staff
5. **Customer Management**: Add customer profiles and order history
6. **Inventory Management**: Track ingredient usage and stock levels
7. **Mobile App**: Develop a companion mobile app for staff
8. **Online Ordering**: Integrate with online ordering platforms
9. **Payment Processing**: Add payment processing capabilities
10. **Reservation System**: Implement a table reservation system


