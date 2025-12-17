# Trust Signals - Developer Quick Reference

## Files Modified/Created

### New Files

1. **`src/components/common/TrustIndicators.tsx`** (180 lines)
   - Main trust signals component library
   - Exports 4 components: TrustIndicators, TrustBadge, TrustDots, SyncStatusMessage
   - Self-contained with animations and state management

### Modified Files

1. **`src/app/page.tsx`**
   - Added Lock icon import
   - Added TrustIndicators imports (4 components)
   - Added trust badge in header (lines 768-791)
   - Added sync status message in "Today at Glance" section (lines 938-945)
   - Added TrustDots to primary feature cards (lines 1454-1464)
   - Added TrustDots to secondary tool cards (lines 1563-1573)
   - Added trust info section between quick actions and personalized content (lines 1117-1165)

## Component API Reference

### TrustIndicators

```tsx
interface TrustIndicatorsProps {
  compact?: boolean; // Reduce spacing
  showLabels?: boolean; // Show text labels
  className?: string; // Custom CSS classes
}

<TrustIndicators compact={true} showLabels={false} />;
```

### TrustBadge

```tsx
// No props needed
<TrustBadge />
```

### TrustDots

```tsx
// No props needed
<TrustDots />
```

### SyncStatusMessage

```tsx
// No props needed
<SyncStatusMessage />
```

## Usage Examples

### In a Custom Component

```tsx
import {
  TrustIndicators,
  TrustBadge,
  TrustDots,
  SyncStatusMessage,
} from "@/components/common/TrustIndicators";

export function MyComponent() {
  return (
    <div>
      {/* Full dashboard view */}
      <TrustIndicators showLabels={true} />

      {/* Compact badge */}
      <TrustBadge />

      {/* Just the dots */}
      <TrustDots />

      {/* Sync timestamp */}
      <SyncStatusMessage />
    </div>
  );
}
```

### In Card Headers

```tsx
<div className="flex items-start justify-between mb-2">
  <IconContainer />
  <TrustDots />
</div>
```

### In Section Headers

```tsx
<div className="flex items-center justify-between">
  <div>
    <h2>Today at Glance</h2>
    <p className="text-muted-foreground">Summary</p>
  </div>
  <SyncStatusMessage />
</div>
```

## Animation Constants

All animations use the design system constants:

```tsx
const ANIMATION = {
  duration: {
    fast: 0.2, // Micro-interactions
    normal: 0.3, // Standard transitions
    slow: 0.5, // Page entrance
  },
  easing: "ease-in-out",
};
```

TrustIndicators use custom Framer Motion:

```tsx
// Sync status animation
animate={{ scale: [1, 1.5], opacity: [0.75, 0] }}
transition={{ duration: 1.5, repeat: Infinity }}
```

## State Management

### Sync Status Simulation (Demo)

```tsx
// In TrustIndicators component
useEffect(() => {
  const interval = setInterval(() => {
    setIndicators((prev) =>
      prev.map((indicator) => {
        if (indicator.type === "sync" && Math.random() < 0.1) {
          return { ...indicator, status: "syncing" };
        }
        return { ...indicator, status: "active" };
      })
    );
  }, 8000);

  return () => clearInterval(interval);
}, []);
```

### For Production Use

Replace with actual sync state:

```tsx
// Connect to your sync state
const syncStatus = useYourSyncStore((state) => state.status);

useEffect(() => {
  // Update UI based on real sync events
}, [syncStatus]);
```

## Styling & Customization

### Color Scheme

Edit color classes in TrustIndicators.tsx:

```tsx
const getStatusColor = (status: TrustIndicator["status"]) => {
  switch (status) {
    case "active":
      return "text-green-600 dark:text-green-400";
    case "syncing":
      return "text-amber-600 dark:text-amber-400";
    case "warning":
      return "text-orange-600 dark:text-orange-400";
    case "offline":
      return "text-red-600 dark:text-red-400";
  }
};
```

### Icon Sizing

Edit in trust cards section of page.tsx:

```tsx
<Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
```

### Animation Speed

Edit in TrustIndicators.tsx:

```tsx
animate={{ scale: [1, 1.2, 1] }}
transition={{ duration: 2, repeat: Infinity }}  // Change duration here
```

## Integration Patterns

### Pattern 1: Header Badge Only

```tsx
<motion.div className="header">
  <h1>App Name</h1>
  <TrustBadge />
</motion.div>
```

### Pattern 2: Full Dashboard

```tsx
<motion.div className="header">
  <h1>App Name</h1>
  <TrustIndicators compact={false} showLabels={true} />
</motion.div>
```

### Pattern 3: Card Indicators

```tsx
<Card>
  <CardHeader>
    <div className="flex justify-between">
      <Icon />
      <TrustDots />
    </div>
    <Title>Card Title</Title>
  </CardHeader>
</Card>
```

### Pattern 4: Section Status

```tsx
<section>
  <div className="flex justify-between items-center">
    <h2>Section Title</h2>
    <SyncStatusMessage />
  </div>
  {/* Content */}
</section>
```

## Accessibility Features

### Built-in

- Semantic HTML elements
- Icon tooltips via title attributes
- Color + icon for status (not color-only)
- Framer Motion respects prefers-reduced-motion

### Recommended Additions

```tsx
// Add aria-label to icons
<Cloud
  className="w-4 h-4"
  aria-label="Data synchronization status"
/>

// Add role to custom containers
<div role="status" aria-live="polite">
  <TrustDots />
</div>
```

## Common Customization Tasks

### Task: Change sync update interval

```tsx
// In TrustIndicators.tsx
const interval = setInterval(() => {
  // ... update logic
}, 8000); // Change 8000ms to desired interval
```

### Task: Add more trust indicators

```tsx
// In TrustIndicators.tsx
const indicators: TrustIndicator[] = [
  { type: "sync", status: "active", label: "Data synchronized" },
  { type: "security", status: "active", label: "Encrypted" },
  { type: "reliability", status: "active", label: "All systems healthy" },
  // ADD NEW:
  { type: "backup", status: "active", label: "Backup complete" },
];
```

### Task: Connect to real sync status

```tsx
// Replace simulated status with real state
const { syncStatus } = useSyncState();

useEffect(() => {
  setIndicators((prev) =>
    prev.map((indicator) => {
      if (indicator.type === "sync") {
        return {
          ...indicator,
          status: syncStatus === "syncing" ? "syncing" : "active",
        };
      }
      return indicator;
    })
  );
}, [syncStatus]);
```

### Task: Add offline detection

```tsx
// In useEffect
const handleOnline = () => setSyncStatus("active");
const handleOffline = () => setSyncStatus("offline");

window.addEventListener("online", handleOnline);
window.addEventListener("offline", handleOffline);

return () => {
  window.removeEventListener("online", handleOnline);
  window.removeEventListener("offline", handleOffline);
};
```

## Performance Considerations

### Bundle Size

- Component file: ~4KB (uncompressed)
- ~2KB gzipped
- Uses existing dependencies (framer-motion, lucide-react)

### Runtime Performance

- No heavy computations
- Animations use GPU acceleration (transform, opacity)
- Interval-based updates every 8 seconds (minimal)
- No network calls in demo

### Optimization Tips

```tsx
// Memoize component if used in many places
export const MemoizedTrustDots = React.memo(TrustDots);

// Use useCallback for status handlers
const updateStatus = useCallback(() => {
  // Update logic
}, []);

// Batch state updates
const updateIndicators = useCallback(() => {
  setIndicators((prev) => [...prev]); // Single state update
}, []);
```

## Testing

### Unit Test Example

```tsx
import { render, screen } from "@testing-library/react";
import { TrustBadge } from "@/components/common/TrustIndicators";

describe("TrustBadge", () => {
  it("renders with secure & synced text", () => {
    render(<TrustBadge />);
    expect(screen.getByText("Secure & Synced")).toBeInTheDocument();
  });

  it("displays green indicator", () => {
    const { container } = render(<TrustBadge />);
    const dot = container.querySelector(".bg-green-500");
    expect(dot).toBeInTheDocument();
  });
});
```

### E2E Test Example

```tsx
// In Cypress or Playwright
describe("Trust Signals", () => {
  it("displays trust badge in header", () => {
    cy.visit("/");
    cy.contains("Secure & Synced").should("be.visible");
  });

  it("shows sync status in data section", () => {
    cy.visit("/");
    cy.contains("Last synced").should("be.visible");
  });

  it("displays trust dots on cards", () => {
    cy.visit("/");
    cy.get("[role='link']")
      .first()
      .within(() => {
        cy.get("svg").should("have.length.greaterThan", 2);
      });
  });
});
```

## Troubleshooting

### Issue: Icons not rendering

```tsx
// Make sure icons are imported from lucide-react
import { Lock, Cloud, CheckCircle } from "lucide-react";
```

### Issue: Animations not smooth

```tsx
// Check if Framer Motion is installed
npm list framer-motion

// Use GPU acceleration for better performance
animate={{ opacity: 1 }} // Good - uses opacity
animate={{ height: 100 }} // Bad - reflow heavy
```

### Issue: Layout shift

```tsx
// Ensure fixed dimensions for animated elements
<motion.div className="w-1.5 h-1.5" animate={...}>
  {/* Content with fixed size */}
</motion.div>
```

### Issue: Dark mode colors not working

```tsx
// Verify dark mode is configured in tailwind.config.ts
darkMode: "class", // or 'media'
  // Ensure dark: classes are used
  (className = "text-green-600 dark:text-green-400");
```

## Related Documentation

- [TRUST_SIGNALS_IMPLEMENTATION.md](./TRUST_SIGNALS_IMPLEMENTATION.md) - Full feature overview
- [TRUST_SIGNALS_VISUAL_GUIDE.md](./TRUST_SIGNALS_VISUAL_GUIDE.md) - Visual design specifications
- Main page component: `src/app/page.tsx`
- Component library: `src/components/common/TrustIndicators.tsx`
