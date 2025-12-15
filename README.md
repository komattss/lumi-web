# Lumi - Interactive Mini-Superapp

A modern, responsive web application built with Next.js, React, and Tailwind CSS.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **shadcn/ui** (component library)
- **Leaflet** (maps)
- **TanStack Query** (data fetching)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/src
  /app              # Next.js App Router pages
  /components       # React components
    /ui             # Base UI components (buttons, cards, etc.)
    /common         # Shared components (navbar, footer)
    /modules        # Feature-specific components
  /lib              # Utilities and helpers
  /hooks            # Custom React hooks
  /styles           # Global styles
  /types            # TypeScript type definitions
```

## Features

- 🏠 **Home Grid** - Responsive card grid with smooth animations
- 🗺️ **Maps Module** - Interactive map view
- ✅ **Tasks Module** - To-do list with CRUD operations
- 🛒 **Store Module** - Product catalog with cart
- 👤 **Profile Module** - User profile page
- 📱 **Responsive Design** - Desktop sidebar, mobile bottom nav
- ✨ **Smooth Animations** - Framer Motion transitions

## Design System

Lumi uses a soft glow aesthetic with:

- Light neutral color palette
- Rounded shapes and smooth corners
- Subtle animations and transitions
- Accessible, mobile-first approach
