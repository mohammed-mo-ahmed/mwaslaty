# Mwaslaty - Navigate Egypt with Ease

Mwaslaty (مواصلاتي) is a comprehensive transportation platform that connects all of Egypt's transportation networks - metro, buses, and microbuses - into one intelligent, community-driven application.

## Features

### 🤖 AI ChatBot Assistant
Ask in natural language: "I'm in Nasr City, take me to 6th October City" and get step-by-step directions with multiple route options.

### 🔍 Manual Route Search
Search routes manually with interactive map visualization showing detailed directions, costs, and travel times.

### 🚇 Important Transportation Hubs
Explore major stops like Ramses Station, Tahrir Square, Aboud, El-Monib, and more with:
- Detailed route information
- Real-time schedules
- Fare information
- Station facilities

### 👥 Community-Driven Routes
- Submit new routes you discover
- Vote on route accuracy and usefulness
- Help improve the transportation network
- Earn credits for contributions

### 💰 Credit System
- Free trial with initial credits
- Pay-per-use model for continued access
- Earn free credits through community participation
- Transparent pricing for route searches

## Transportation Coverage

- **Metro Lines**: All 3 Cairo Metro lines with stations and connections
- **Bus Routes**: 500+ bus routes across Greater Cairo and Egypt
- **Microbus Networks**: 1000+ microbus lines with local knowledge
- **Major Hubs**: 50+ important transportation stops and terminals

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom Egyptian-inspired design
- **Routing**: React Router for navigation
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Vite for fast development and optimized builds

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd mwaslaty
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main app layout with navigation
├── pages/              # Application pages
│   ├── Home.tsx        # Landing page with feature overview
│   ├── ChatBot.tsx     # AI assistant for route queries
│   ├── Search.tsx      # Manual route search with map
│   ├── ImportantStops.tsx  # Major transportation hubs
│   ├── StopDetails.tsx # Individual stop information
│   ├── UserRoutes.tsx  # Community route management
│   └── Credits.tsx     # Credit system and billing
├── App.tsx             # Main app component with routing
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Contributing

We welcome contributions to improve Mwaslaty! Here's how you can help:

1. **Route Data**: Submit accurate route information through the app
2. **Bug Reports**: Report issues you encounter
3. **Feature Requests**: Suggest new features that would benefit users
4. **Code Contributions**: Submit pull requests for improvements

## Roadmap

- [ ] Real-time route tracking and delays
- [ ] Integration with official transportation APIs
- [ ] Offline route caching
- [ ] Push notifications for route updates
- [ ] Multi-language support (Arabic/English)
- [ ] Mobile app versions (iOS/Android)
- [ ] Integration with ride-sharing services
- [ ] Accessibility improvements

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, feature requests, or questions:
- Create an issue in this repository
- Contact us through the app's feedback system

---

**Mwaslaty** - Connecting all of Egypt, one route at a time. 🇪🇬