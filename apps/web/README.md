# WiggleDots 🎯

*A Wiggle World of Living Dots!*

An interactive browser-based game where you hunt down animated dots in a colorful, dynamic environment. Test your reflexes and strategy as you try to eliminate all the wiggles - but watch out, they can regenerate!

## 🎮 How to Play

### Objective
Eliminate all the living dots (wiggles) to achieve victory!

### Game Instructions
1. **Start the Game** - Click the "Play" button to begin your wiggle-hunting adventure
2. **Hunt the Wiggles** - Tap or click anywhere on the game canvas to eliminate wiggles in that area
3. **Monitor Your Progress** - Keep an eye on the live statistics:
  - **☀️ Awake**: Number of living wiggles remaining
  - **🌙 Asleep**: Number of wiggles you've eliminated
4. **Strategic Challenge** - Be careful! Wiggles can regenerate, so timing and positioning matter
5. **Achieve Victory** - Eliminate all wiggles simultaneously to win

### Controls
- **▶️ Play** - Start or resume the game
- **⏸️ Pause** - Temporarily halt the action
- **🔄 Again!** - Reset and restart the game

### Victory
When you successfully eliminate all wiggles, you'll be greeted with a congratulations screen and the option to play again!

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- pnpm (version 10.10.0 or higher)

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd wiggledots

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Auto-fix linting issues
npm run check-types  # Type checking with TypeScript
```

## 🏗️ Technical Architecture

### Technology Stack

**Core Framework**
- **React 19.1.0** with TypeScript for component architecture
- **Vite 6.3.5** for lightning-fast development and optimized builds
- **HTML5 Canvas** for high-performance game rendering

**Game Engine**
- **@wiggledots/engine** - Custom game logic and physics
- **@wiggledots/webgl** - WebGL-based graphics rendering
- **@wiggledots/audio** - Comprehensive audio system with themes

**Development Tools**
- **ESLint** for code quality and consistency
- **TypeScript** for type safety and better developer experience
- **Vite TSConfig Paths** for clean import management

### Project Structure

```
src/
├── containers/application/           # Main application container
│   ├── components/                  # Reusable UI components
│   │   ├── Button.tsx              # Interactive button with audio feedback
│   │   ├── Canvas.tsx              # Game rendering surface
│   │   ├── Congrats.tsx            # Victory celebration screen
│   │   ├── Controls.tsx            # Game control interface
│   │   ├── Statistics.tsx          # Live game statistics display
│   │   └── Title.tsx               # Game branding and title
│   └── Application.tsx             # Main application orchestrator
├── providers/                      # React Context providers
│   ├── ApplicationProvider.tsx     # Game state and engine management
│   └── AudioProvider.tsx           # Audio system coordination
├── styles/                         # Styling and visual design
│   ├── global.css                  # Global styles and CSS variables
│   ├── layout.css                  # Responsive layout and components
│   └── icons.css                   # Icon sprite definitions
└── index.tsx                       # Application entry point
```

### State Management

**ApplicationProvider Features:**
- **Game State Management** - Handles `running | paused | stopped | won` states
- **Real-time Statistics** - Tracks alive/dead wiggle counts with live updates
- **Engine Integration** - Seamless interface with the custom game engine

**AudioProvider Capabilities:**
- **Theme-based Sound System** - Multiple audio themes (SOFT, RETRO, etc.)
- **Background Music** - Looping background soundtrack
- **Interactive Sound Effects** - Hover, click, and victory sounds
- **Smart Initialization** - Handles browser audio policy requirements

### Component Architecture

**Smart Components:**
- `Application.tsx` - Main orchestrator with conditional rendering
- `Controls.tsx` - Stateful game control interface
- `Statistics.tsx` - Real-time data display with calculations

**UI Components:**
- `Button.tsx` - Enhanced button with audio feedback
- `Canvas.tsx` - Game rendering surface with engine integration
- `Congrats.tsx` - Victory screen with replay functionality
- `Title.tsx` - Branding and game information display

### Styling Architecture

**CSS Custom Properties:**
```css
:root {
  --color-bg: #010420;           /* Deep space background */
  --color-panel: #3d2c3e;        /* UI panel backgrounds */
  --color-accent: #ff6b9d;       /* Primary accent color */
  --color-accent-dark: #e91e63;  /* Darker accent variant */
  --color-text: #f8e1f0;         /* Primary text color */
  --font-title: "Luckiest Guy";  /* Playful title font */
  --font-body: "Nunito";         /* Clean body font */
}
```

**Responsive Design:**
- Mobile-first approach with progressive enhancement
- Touch-friendly interactions with proper tap targets
- Optimized layouts for portrait/landscape orientations
- Safe area handling for modern mobile devices

### Performance Optimizations

**React Optimizations:**
- `useCallback` hooks for stable function references
- Conditional rendering to minimize DOM updates
- Efficient state updates with functional setters

**Game Engine Integration:**
- 120 FPS target for smooth animations
- Optimized canvas rendering with proper image scaling
- Touch action management for responsive mobile experience

**Audio System:**
- Lazy loading of audio resources
- Volume management and user preference handling
- Fallback handling for browsers with restricted audio policies

## 🎨 Features

### Visual Design
- **Vibrant Color Palette** - Eye-catching pink and purple theme
- **Smooth Animations** - 120 FPS gameplay with fluid interactions
- **Responsive Layout** - Optimized for desktop, tablet, and mobile
- **Custom Typography** - Playful fonts that match the game's personality

### Audio Experience
- **Dynamic Sound Effects** - Audio feedback for all interactions
- **Background Music** - Immersive soundtrack that loops seamlessly
- **Multiple Audio Themes** - Customizable sound profiles
- **Smart Audio Management** - Respects browser policies and user preferences

### User Experience
- **Touch-Friendly Interface** - Optimized for both mouse and touch input
- **Accessibility Considerations** - Proper contrast ratios and semantic markup

## 🛠️ Development

### Code Quality
- **TypeScript** for type safety and better developer experience
- **ESLint** with React and TypeScript rules for consistent code style
- **Modular Architecture** with clear separation of concerns
- **Custom Hooks** for reusable stateful logic

### Browser Compatibility
- Modern browsers with ES2015+ support
- WebGL support required for graphics rendering
- Web Audio API for sound effects
- Touch events for mobile interaction

## 📱 Platform Support

### Desktop
- Chrome, Firefox, Safari, Edge (latest versions)
- Keyboard and mouse interaction
- Full audio and visual experience

### Mobile
- iOS Safari, Chrome Mobile, Samsung Internet
- Touch interaction optimized
- Responsive layout for various screen sizes
- Performance optimized for mobile GPUs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing TypeScript and React patterns
- Ensure responsive design principles are maintained
- Test on both desktop and mobile devices
- Update documentation for new features

## 📄 License

This project is part of the WiggleDots game suite. Please refer to the main repository for licensing information.

## 🙏 Acknowledgments

- Game engine powered by custom @wiggledots packages
- Visual design inspired by modern mobile gaming
- Audio system designed for cross-platform compatibility
- Built with love for the gaming community

---

**Ready to hunt some wiggles? Start the game and see how quickly you can eliminate them all!** 🎯✨
