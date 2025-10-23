# Obsidian-Frontend

A modern frontend application built with React and TypeScript, featuring real-time monitoring and management capabilities.

## Features

- 🔄 Real-time service monitoring
- 🛡️ Circuit breaker pattern implementation
- 📊 Service health metrics and analytics
- 🚨 Live event feed for service state changes
- 📈 System health overview
- 🔐 Secure authentication system

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Real-time Updates**: Socket.IO
- **Authentication**: JWT with Supabase
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Singaram-117/Obsidian-Frontend.git
cd Obsidian-Frontend
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory with your environment variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/      # Reusable UI components
├── context/         # React context providers
├── hooks/          # Custom React hooks
├── lib/           # Utility functions and API clients
└── pages/         # Application pages/routes
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
