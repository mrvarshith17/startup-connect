# VentureLink - Founder-Investor Collaboration Platform


## 🚀 Overview

VentureLink is a comprehensive full-stack web application that connects startup founders with potential investors. The platform enables founders to share their innovative ideas while allowing investors to discover, evaluate, and connect with promising startups.

### 🎯 Key Value Propositions

- **For Founders**: Share your startup ideas, attract investors, and secure funding
- **For Investors**: Discover innovative startups, evaluate opportunities, and connect directly with founders
- **For Both**: Real-time communication, mutual interest matching, and transparent investment tracking

## ✨ Features

### 🔐 Authentication & User Management
- **Role-based Registration**: Separate registration flows for Founders and Investors
- **Secure Authentication**: JWT-based authentication with persistent sessions
- **User Profiles**: Customizable profiles with company information and bio

### 👨‍💼 Founder Dashboard
- **Idea Submission**: Submit startup ideas with categories, descriptions, and supporting documents
- **Investment Tracking**: View interested investors and investment amounts
- **Like Back System**: Express mutual interest in potential investors
- **Real-time Analytics**: Track likes, views, and investor engagement

### 💰 Investor Dashboard
- **Idea Discovery**: Browse and search startup ideas by category and keywords
- **Smart Filtering**: Filter ideas by industry, funding goals, and other criteria
- **Investment Interest**: Express interest with specific investment amounts
- **Portfolio Management**: Track liked ideas and investment commitments

### 💬 Communication System
- **Mutual Interest Chat**: Real-time messaging unlocked when both parties show interest
- **Persistent Conversations**: Chat history stored and accessible across sessions
- **Message Threading**: Organized conversations by idea and participants

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Automatic theme switching support
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- **Modern Components**: Built with Radix UI and styled with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **React Router 6** - Client-side routing with SPA mode
- **TailwindCSS 3** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations and transitions

### Backend
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe server development
- **Zod** - Runtime type validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **Vitest** - Blazingly fast unit testing
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality assurance

### Data Storage (Demo)
- **LocalStorage** - Client-side storage for demo purposes
- **Shared Data Store** - Centralized state management
- **Real-time Sync** - Cross-component data synchronization

> **Note**: In production, replace LocalStorage with a proper database like MongoDB, PostgreSQL, or similar.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 8.x or higher (or yarn/pnpm)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/venturelink.git
   cd venturelink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:8080
   ```

### Development Commands

```bash
# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Type checking
npm run typecheck

# Format code
npm run format.fix
```

## 📁 Project Structure

```
venturelink/
├── client/                 # React frontend application
│   ├── components/ui/      # Reusable UI components (Radix + Tailwind)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and shared logic
│   │   ├── dataStore.ts   # Centralized data management
│   │   └── utils.ts       # Helper functions
│   ├── pages/             # Route components
│   │   ├── Index.tsx      # Homepage
│   │   ├── Login.tsx      # Authentication
│   │   ├── Register.tsx   # User registration
│   │   ├── FounderDashboard.tsx    # Founder interface
│   │   └── InvestorDashboard.tsx   # Investor interface
│   ├── App.tsx            # Main app component with routing
│   └── global.css         # Global styles and Tailwind config
├── server/                # Express backend
│   ├── routes/            # API route handlers
│   │   ├── auth.ts        # Authentication endpoints
│   │   ├── ideas.ts       # Idea management
│   │   ├── investments.ts # Investment tracking
│   │   └── chat.ts        # Messaging system
│   └── index.ts           # Server configuration
├── shared/                # Shared types and interfaces
│   └── api.ts             # API type definitions
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login     # User login
POST   /api/auth/register  # User registration
POST   /api/auth/logout    # User logout
```

### Ideas Management
```
GET    /api/ideas          # Get all ideas (with filtering)
GET    /api/ideas/:id      # Get specific idea
POST   /api/ideas          # Create new idea (founders only)
PUT    /api/ideas/:id      # Update idea (owner only)
DELETE /api/ideas/:id      # Delete idea (owner only)
GET    /api/founder/ideas  # Get founder's ideas
```

### Investment System
```
POST   /api/investments                # Express investment interest
GET    /api/investments/idea/:ideaId   # Get investments for idea
GET    /api/investments/user           # Get user's investments
PUT    /api/investments/:id            # Update investment status
DELETE /api/investments/:id            # Withdraw investment
```

### Engagement System
```
POST   /api/likes                      # Toggle like on idea
GET    /api/likes/idea/:ideaId         # Get likes for idea
GET    /api/likes/user                 # Get user's likes
```

### Chat System
```
POST   /api/chats                      # Create new chat
GET    /api/chats                      # Get user's chats
GET    /api/chats/:id                  # Get specific chat
POST   /api/chats/message              # Send message
GET    /api/chats/:chatId/messages     # Get chat messages
```

## 🎮 Usage Guide

### For Founders

1. **Register** as a Founder with your details
2. **Submit Ideas** through the "Submit New Idea" form
   - Add title, description, category
   - Upload supporting documents
   - Set funding goals
3. **Track Interest** in the "Interested Investors" tab
4. **Like Back** investors you're interested in working with
5. **Chat** with investors once mutual interest is established

### For Investors

1. **Register** as an Investor with your firm details
2. **Browse Ideas** in the main dashboard
   - Filter by category, search keywords
   - View detailed idea information
3. **Express Interest** with specific investment amounts
4. **Like Ideas** that interest you
5. **Start Conversations** when founders like you back

### Chat System

- **Mutual Interest Required**: Chat is only enabled when both founder and investor have liked each other
- **Real-time Messaging**: Messages appear instantly for both parties
- **Persistent History**: All conversations are saved and accessible
- **Cross-Platform Sync**: Messages sync across all devices and sessions

## 🌐 Deployment

### Using Netlify (Recommended)

1. **Connect Netlify MCP** in the Builder.io interface
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`
4. **Environment Variables**: Set production environment variables

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

3. **Set environment variables** for production

### Environment Variables

```bash
# Server Configuration
PORT=8080
NODE_ENV=production

# Database (when implemented)
DATABASE_URL=your_database_url

# Authentication (when implemented)
JWT_SECRET=your_jwt_secret

# Other APIs
SMTP_CONFIG=your_email_config
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── components/     # Component unit tests
├── pages/         # Page integration tests
├── utils/         # Utility function tests
└── api/           # API endpoint tests
```


### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **TypeScript**: All code must be type-safe
- **ESLint**: Follow the configured linting rules
- **Prettier**: Use consistent code formatting
- **Testing**: Add tests for new features
- **Documentation**: Update docs for API changes

## 📈 Roadmap

### Phase 1 (Current) ✅
- [x] Basic authentication system
- [x] Idea submission and browsing
- [x] Investment interest system
- [x] Real-time chat functionality
- [x] Responsive UI/UX

### Phase 2 (Upcoming)
- [ ] Real database integration (MongoDB/PostgreSQL)
- [ ] File upload to cloud storage
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Investment analytics dashboard

### Phase 3 (Future)
- [ ] Video calls integration
- [ ] Document collaboration
- [ ] Legal document templates
- [ ] Payment processing
- [ ] Mobile app (React Native)

## 🐛 Known Issues

- **Data Persistence**: Currently uses localStorage (demo only)
- **File Uploads**: Files are stored locally, not in cloud storage
- **Real-time Updates**: Limited to local state, no WebSocket implementation yet



## 🙏 Acknowledgments

- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **React Team** - Amazing frontend framework
- **Open Source Community** - For all the amazing libraries




