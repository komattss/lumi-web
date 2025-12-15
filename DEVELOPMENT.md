# Lumi Development Guide

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Run the development server:**

```bash
npm run dev
```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
lumi/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Home page with module grid
│   │   ├── providers.tsx     # React Query provider
│   │   ├── maps/
│   │   │   └── page.tsx      # Maps module
│   │   ├── tasks/
│   │   │   └── page.tsx      # Tasks module
│   │   ├── store/
│   │   │   └── page.tsx      # Store module
│   │   └── profile/
│   │       └── page.tsx      # Profile module
│   │
│   ├── components/
│   │   ├── ui/               # Base UI components
│   │   │   ├── button.tsx    # Button component
│   │   │   ├── card.tsx      # Card component
│   │   │   ├── input.tsx     # Input component
│   │   │   ├── dialog.tsx    # Dialog/modal component
│   │   │   └── badge.tsx     # Badge component
│   │   │
│   │   ├── common/           # Shared layout components
│   │   │   ├── AppLayout.tsx # Main layout wrapper
│   │   │   ├── Sidebar.tsx   # Desktop sidebar
│   │   │   └── BottomNav.tsx # Mobile bottom navigation
│   │   │
│   │   └── modules/          # Feature-specific components
│   │       └── MapView.tsx   # Leaflet map component
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useMediaQuery.ts  # Responsive breakpoint hook
│   │   └── useLocalStorage.ts # LocalStorage hook
│   │
│   ├── lib/                  # Utilities and helpers
│   │   ├── utils.ts          # cn() utility for className merging
│   │   ├── animations.ts     # Framer Motion presets
│   │   └── helpers.ts        # General helper functions
│   │
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts          # Shared types
│   │
│   └── styles/
│       └── globals.css       # Global styles and CSS variables
│
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── next.config.js            # Next.js configuration
└── postcss.config.js         # PostCSS configuration
```

## 🎨 Design System

### Colors

Lumi uses a soft glow aesthetic with the following color palette:

- **Primary**: Purple/Violet (`hsl(262, 83%, 58%)`)
- **Background**: Light neutral whites
- **Accent colors**: Module-specific gradients

### Components

All UI components are built with:

- **Tailwind CSS** for styling
- **shadcn/ui** patterns for consistency
- **Framer Motion** for animations
- **CVA** (Class Variance Authority) for variants

### Animations

- **Fade in/out** - Page transitions
- **Slide up** - Card entry animations
- **Stagger** - List item animations
- **Glow pulse** - Interactive hover effects

## 🧩 Module Overview

### 1. Home Grid

- **File**: `src/app/page.tsx`
- **Features**:
  - Animated card grid with 4 module cards
  - Smooth hover effects with glow
  - Framer Motion stagger animations
  - Responsive grid layout

### 2. Maps Module

- **Files**: `src/app/maps/page.tsx`, `src/components/modules/MapView.tsx`
- **Features**:
  - Interactive Leaflet map
  - Multiple location markers
  - Popup information
  - Full-screen responsive view

### 3. Tasks Module

- **File**: `src/app/tasks/page.tsx`
- **Features**:
  - CRUD operations for tasks
  - Mark tasks as complete/incomplete
  - Smooth animations on add/remove
  - Progress tracking
  - Local state management

### 4. Store Module

- **File**: `src/app/store/page.tsx`
- **Features**:
  - Product grid with cards
  - Category badges
  - Price display
  - Add to cart button
  - Responsive grid layout

### 5. Profile Module

- **File**: `src/app/profile/page.tsx`
- **Features**:
  - User information display
  - Activity stats
  - Recent activity feed
  - Preferences section
  - Edit profile button

## 🛠️ Development Tips

### Adding a New Module

1. **Create page file:**

```tsx
// src/app/my-module/page.tsx
export default function MyModulePage() {
  return <div>My Module</div>;
}
```

2. **Add navigation link:**
   Update `navigation` array in:

- `src/components/common/Sidebar.tsx`
- `src/components/common/BottomNav.tsx`

3. **Create module components:**

```tsx
// src/components/modules/MyModuleComponent.tsx
export function MyModuleComponent() {
  return <div>Component</div>;
}
```

### Using Animations

```tsx
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

function MyComponent() {
  return (
    <motion.div {...fadeInUp}>
      <motion.div variants={staggerContainer}>{/* Content */}</motion.div>
    </motion.div>
  );
}
```

### Styling Components

```tsx
import { cn } from "@/lib/utils";

function MyComponent({ className }) {
  return (
    <div className={cn("base-classes", "hover:glow-effect", className)}>
      Content
    </div>
  );
}
```

### Using Custom Hooks

```tsx
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useLocalStorage } from "@/hooks/useLocalStorage";

function MyComponent() {
  const isMobile = useIsMobile();
  const [value, setValue] = useLocalStorage("key", "default");

  // Use hooks...
}
```

## 🎯 Key Features

### Responsive Design

- **Desktop**: Collapsible sidebar navigation
- **Mobile**: Bottom navigation bar
- **Breakpoint**: 768px (md)

### Animations

- Entry animations on page load
- Hover effects on interactive elements
- Smooth transitions between states
- Stagger animations for lists

### Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus visible states

## 📦 Dependencies

### Core

- **next**: ^14.2.0 - React framework
- **react**: ^18.3.1 - UI library
- **typescript**: ^5.4.0 - Type safety

### UI & Styling

- **tailwindcss**: ^3.4.0 - Utility-first CSS
- **framer-motion**: ^11.0.0 - Animations
- **lucide-react**: ^0.363.0 - Icons
- **class-variance-authority**: ^0.7.0 - Component variants

### Features

- **@tanstack/react-query**: ^5.28.0 - Data fetching
- **leaflet**: ^1.9.4 - Maps
- **react-leaflet**: ^4.2.1 - React wrapper for Leaflet
- **@radix-ui/react-dialog**: ^1.0.5 - Accessible dialogs

## 🚨 Common Issues

### Issue: Leaflet map not displaying

**Solution**: Make sure `MapView` is dynamically imported with `ssr: false`

### Issue: Hydration errors

**Solution**: Use `'use client'` directive for components with browser-only APIs

### Issue: Styles not applying

**Solution**: Check Tailwind content paths in `tailwind.config.ts`

## 🔄 Next Steps

1. **Add authentication**: Implement user login/signup
2. **Connect to API**: Replace mock data with real backend
3. **Add state management**: Consider Zustand or Redux for global state
4. **Implement cart**: Build shopping cart functionality for Store
5. **Add tests**: Write unit and integration tests
6. **Deploy**: Deploy to Vercel or your preferred platform

## 📝 Code Style

- Use TypeScript for all new files
- Follow Next.js App Router conventions
- Keep components small and focused
- Use semantic HTML elements
- Write descriptive variable names
- Add comments for complex logic
- Export named exports for utilities

## 🤝 Contributing

1. Create a new branch for your feature
2. Follow the existing code style
3. Test your changes thoroughly
4. Update documentation as needed
5. Submit a pull request

---

**Happy coding with Lumi! ✨**
