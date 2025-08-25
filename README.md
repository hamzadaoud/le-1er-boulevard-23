
# La Perle Rouge - Café Management System

## 🏪 Project Overview

La Perle Rouge is a comprehensive café management web application built for **La Perle Rouge** café in Gueliz. This progressive web application streamlines daily operations including order management, inventory tracking, staff time management, and revenue reporting with integrated thermal printer support.

### Target Users
- **Café Owners/Administrators**: Full system access, staff management, comprehensive reporting
- **Café Staff/Agents**: Order processing, basic reporting, time tracking

### Key Capabilities
- Real-time order processing and billing
- Thermal receipt printing (RONGTA RP330 series compatible)
- Staff time tracking and performance monitoring
- Revenue analytics with detailed reporting
- Product catalog management
- Multi-user role-based access control

## 🛠 Technology Stack

### Frontend & Web Technologies
- **React 18** - Modern UI framework with hooks and functional components
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing and navigation

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework with custom theme
- **shadcn/ui** - High-quality component library with Radix UI primitives
- **Lucide React** - Comprehensive icon library
- **Custom Design System** - Semantic color tokens and consistent spacing

### Data & State Management
- **Local Storage** - Client-side data persistence
- **@tanstack/react-query** - Server state management (prepared for future API integration)
- **React Hook Form** - Form validation and management with Zod schemas

### Hardware Integration
- **Web Serial API** - Direct communication with thermal printers
- **ESC/POS Commands** - Thermal printer control and formatting

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization

## ✅ Features & Progress

### 🟢 Completed Features

#### Core System
- ✅ **User Authentication & Authorization** - Role-based access (Admin/Agent)
- ✅ **Dashboard Analytics** - Revenue charts, top products, daily statistics
- ✅ **Product Catalog Management** - CRUD operations for drinks and items
- ✅ **Order Processing System** - Complete order workflow with receipt generation

#### Staff Management
- ✅ **Time Tracking** - Clock in/out system with daily logs
- ✅ **Staff Directory** - Employee information and role management
- ✅ **Activity Logging** - Comprehensive audit trail of user actions

#### Reporting & Analytics
- ✅ **Revenue Reports** - Daily, monthly, yearly analytics
- ✅ **Agent Performance Reports** - Individual staff metrics
- ✅ **Thermal Receipt Printing** - Customer and agent copies
- ✅ **Consolidated Daily Reports** - Product summaries and agent attribution

#### Hardware Integration
- ✅ **Thermal Printer Support** - RONGTA RP330 series compatibility
- ✅ **ESC/POS Protocol** - Complete command set implementation
- ✅ **Serial Communication** - Direct printer connection via Web Serial API

### 🚧 In Progress

- 🚧 **Table Management System** - Table ordering and status tracking
- 🚧 **Advanced Inventory Management** - Stock levels and automatic reordering

### ⏳ Planned Features

#### Database & Backend
- ⏳ **Database Migration** - Move from localStorage to SQLite/PostgreSQL
- ⏳ **REST API Development** - Backend service for data synchronization
- ⏳ **Cloud Synchronization** - Multi-device data consistency

#### Enhanced Features
- ⏳ **Progressive Web App** - Mobile-responsive offline capabilities
- ⏳ **Advanced Analytics** - Profit margins, trend analysis, forecasting
- ⏳ **Customer Management** - Loyalty programs and customer profiles
- ⏳ **Inventory Alerts** - Low stock notifications and automatic ordering
- ⏳ **Multi-location Support** - Franchise management capabilities

#### Cloud & Mobile
- ⏳ **Cloud Deployment** - Hosted solution with real-time sync
- ⏳ **Mobile Companion App** - Staff scheduling and basic operations
- ⏳ **Offline Mode** - Local data caching with sync when online

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui component library
│   └── ...             # Custom components (Dashboard, Layout, etc.)
├── pages/              # Route-based page components
├── services/           # Business logic and data services
│   ├── authService.ts  # Authentication and user management
│   ├── cafeService.ts  # Core business operations
│   ├── thermalRevenueService.ts  # Thermal printing for reports
│   └── ...
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
│   └── escposUtils.ts  # Thermal printer ESC/POS commands
└── hooks/              # Custom React hooks
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 20+ LTS
- **npm** 10.8+
- USB thermal printer (RONGTA RP330 series recommended)
- Modern web browser with Web Serial API support (Chrome, Edge)

### Development Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Thermal Printer Setup
1. Connect RONGTA RP330 via USB
2. Ensure printer is powered and has paper loaded
3. Grant Serial API permissions when prompted in browser
4. Test printing from the application

### Browser Compatibility
- **Chrome/Chromium** 89+ (Recommended)
- **Microsoft Edge** 89+
- **Opera** 75+
- **Firefox** - Limited support (no Web Serial API)
- **Safari** - Limited support (no Web Serial API)

## 👥 Usage Guide

### Administrator Access
- **Login**: Use admin credentials
- **Dashboard**: View comprehensive analytics and system overview
- **Product Management**: Add, edit, delete menu items
- **Staff Management**: Manage employee accounts and permissions
- **Reports**: Generate detailed revenue and performance reports
- **System Maintenance**: Clear data, manage system settings

### Agent/Staff Access
- **Login**: Use provided staff credentials
- **Order Processing**: Create customer orders and print receipts
- **Time Tracking**: Clock in/out for shifts
- **Basic Reports**: Print daily reports for shift handovers
- **Product Lookup**: View menu and pricing information

## 🔧 Services & Architecture

### Core Services
- **`authService.ts`** - User authentication, session management
- **`cafeService.ts`** - Orders, products, time tracking, revenue calculation
- **`thermalRevenueService.ts`** - Consolidated reporting for thermal printers
- **`ticketService.ts`** - Receipt generation and customer billing

### Key Data Models
- **User**: Authentication and role management
- **Order**: Transaction processing and item tracking
- **Product/Drink**: Menu item catalog
- **Revenue**: Financial reporting and analytics
- **TimeLog**: Staff attendance and working hours

## 🖨 Hardware Integration

### Supported Printers
- **RONGTA RP330 Series** (Primary support)
- **Generic ESC/POS Compatible Printers**

### Communication Protocol
- **Web Serial API** - Direct USB communication through browser
- **ESC/POS Commands** - Complete command set implementation
- **Auto-reconnection** - Handles printer disconnections gracefully

### Print Features
- Customer receipts with order details
- Agent copies for internal tracking
- Daily consolidated reports
- Revenue summaries with product breakdown

## 🔮 Future Improvements

### Short Term (Next 3 months)
- **Progressive Web App** - Offline capabilities and mobile installation
- **Database Integration** - Replace localStorage with cloud database
- **Table Management** - Complete table ordering system implementation
- **Enhanced Analytics** - Profit margin analysis and trend forecasting

### Medium Term (3-6 months)
- **Cloud Deployment** - Hosted solution with real-time synchronization
- **Advanced Inventory** - Stock management with automatic reordering
- **Customer Profiles** - Loyalty programs and purchase history
- **API Integration** - Third-party payment systems and delivery platforms

### Long Term (6+ months)
- **Multi-location Support** - Franchise management capabilities
- **Mobile Native App** - iOS/Android applications
- **AI Analytics** - Predictive analytics for inventory and staffing
- **Advanced Reporting** - Custom report builder with export options

## 🛠 Development Notes

### Code Organization
- **Component-based Architecture** - Modular, reusable UI components
- **Service Layer Pattern** - Separation of business logic from UI
- **Type-safe Development** - Comprehensive TypeScript coverage
- **Responsive Design** - Mobile-first approach with Tailwind CSS

### State Management
- **Local State** - React hooks for component-level state
- **Form State** - React Hook Form with Zod validation
- **Global State** - Context API for user authentication
- **Prepared for Server State** - TanStack Query integration ready

### Performance Considerations
- **Lazy Loading** - Route-based code splitting
- **Optimized Builds** - Vite for fast development and production builds
- **Efficient Rendering** - Minimal re-renders with proper dependency arrays
- **Local Storage Optimization** - Efficient data serialization and caching

### PWA Features (Planned)
- **Service Workers** - Offline functionality and caching
- **Web App Manifest** - Native-like installation experience
- **Background Sync** - Data synchronization when connection resumes
- **Push Notifications** - Order alerts and system notifications

## 🌐 Deployment

### Web Hosting Options
- **Netlify** - Static site hosting with CI/CD
- **Vercel** - Optimized for React applications
- **GitHub Pages** - Free hosting for open source projects
- **Firebase Hosting** - Google Cloud integration

### Production Considerations
- **Environment Variables** - API keys and configuration
- **HTTPS Required** - Web Serial API requires secure context
- **Cross-Origin Policies** - Printer communication restrictions
- **Browser Compatibility** - Feature detection and fallbacks

---

## 📞 Support & Contributing

For questions, bug reports, or feature requests, please contact the development team or create an issue in the project repository.

**Built with ❤️ for La Perle Rouge - Gueliz**
