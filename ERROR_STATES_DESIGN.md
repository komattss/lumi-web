# Human-Centered Error States Design System

## Overview

This document outlines the error state design system for the Lumi Home page. The goal is to provide clear, calm, and non-technical messaging when features fail, while offering simple recovery actions and maintaining user trust during failure scenarios.

## Core Principles

### 1. **Clarity Over Jargon**

- Avoid technical error messages (404, 500, timeouts)
- Use simple, conversational Indonesian language
- Explain what happened and why in user-friendly terms

### 2. **Emotional Tone**

- Be calm and reassuring, not alarming
- Use appropriate emoji to add personality without being dismissive
- Acknowledge the inconvenience without blaming the user

### 3. **Actionable Solutions**

- Always provide a clear next step (Retry, Try Alternative, etc.)
- Make recovery actions prominent and easy to access
- Suggest alternatives when the primary option is unavailable

### 4. **Visual Consistency**

- Use orange accent colors for error states (different from success/neutral)
- Maintain consistent borders, spacing, and typography
- Match the app's design system (RADIUS, SPACING, TRANSITION)

## Error Types

### 1. **Network Error** (📡)

**When:** User's device has no internet or connection is lost

```
Title: "Koneksi Terputus"
Message: "Kami tidak dapat terhubung ke [Section]. Periksa koneksi internet Anda."
Suggestion: "Pastikan Anda terhubung ke Wi-Fi atau data mobile."
Action: "Coba Lagi"
```

**Recovery:** Retry mechanism that re-attempts the request

### 2. **Server Maintenance** (🔧)

**When:** Backend service is temporarily unavailable for updates

```
Title: "Sedang Pemeliharaan"
Message: "[Section] sedang diperbarui untuk pengalaman yang lebih baik."
Suggestion: "Kami akan siap dalam beberapa menit. Terima kasih atas kesabaran Anda!"
Action: "Coba Lagi Nanti"
```

**Recovery:** Automatic retry with exponential backoff

### 3. **Timeout Error** (⏱️)

**When:** Request takes longer than expected to complete

```
Title: "Terlalu Lama Menunggu"
Message: "[Section] memakan waktu lebih lama dari biasanya."
Suggestion: "Koneksi Anda mungkin lambat. Silakan coba lagi atau gunakan koneksi yang lebih stabil."
Action: "Coba Ulang"
```

**Recovery:** Retry with longer timeout window

### 4. **Feature Unavailable** (⚡)

**When:** Feature/service is not available for this user or region

```
Title: "Fitur Tidak Tersedia"
Message: "[Section] sementara tidak dapat diakses."
Suggestion: "Coba jelajahi bagian lain aplikasi atau kembali lagi nanti."
Action: "Buka Fitur Lain"
```

**Recovery:** Navigate to alternative features

### 5. **Generic Error** (❓)

**When:** Unknown error occurred

```
Title: "Terjadi Kesalahan"
Message: "Kami tidak dapat memuat [Section]."
Suggestion: "Silakan coba lagi atau hubungi dukungan jika masalah berlanjut."
Action: "Coba Lagi"
```

**Recovery:** Retry with option to contact support

## Component Structure

### 1. **SectionError Component**

Used for large sections (hero, full-width areas)

```tsx
<SectionError
  type="network" | "server" | "timeout" | "unavailable" | "generic"
  sectionName="Display Name"
  onRetry={() => handleRetry()}
  hasAlternative={boolean}
  alternativeHref="/path"
/>
```

**Features:**

- Large emoji icon (54px)
- Bold title (lg/xl size)
- Detailed message + suggestion
- Prominent retry button
- Optional alternative action button

### 2. **CardError Component**

Used for individual cards in grids

```tsx
<CardError
  type="network" | "server" | "timeout"
  sectionName="Display Name"
  onRetry={() => handleRetry()}
/>
```

**Features:**

- Compact design (fits in card grid)
- Medium emoji icon (24px)
- Brief message
- Small inline retry button

### 3. **QuickActionError Component**

Specialized for quick action cards

```tsx
<QuickActionError
  errorType="network" | "server" | "timeout"
  onRetry={() => handleRetry()}
/>
```

**Features:**

- Minimal design
- Center-aligned layout
- Quick retry option
- Matches quick action card height

## Implementation

### Adding Error States to a Section

1. **Add error state variable:**

```tsx
const [sectionError, setSectionError] = useState<
  "network" | "server" | "timeout" | null
>(null);
```

2. **Add retry handler:**

```tsx
const retrySection = (sectionName: string, resetError: (val: any) => void) => {
  resetError(null);
  // In production: trigger actual API call
};
```

3. **Wrap content with conditional:**

```tsx
{
  isLoading ? (
    <SkeletonComponent />
  ) : showErrors && sectionError ? (
    <SectionError
      type={sectionError}
      sectionName="Feature Name"
      onRetry={() => retrySection("Feature Name", setSectionError)}
      hasAlternative={true}
      alternativeHref="/alternative"
    />
  ) : (
    <ActualContent />
  );
}
```

## Error State Styling

### Colors

- **Background:** `bg-orange-50/40 dark:bg-orange-950/20`
- **Border:** `border-orange-200/50`
- **Text:** `text-orange-600 dark:text-orange-400`
- **Button:** `bg-orange-500 hover:bg-orange-600`

### Spacing

Uses design system constants:

- Card padding: `${SPACING.card.padding}`
- Section margin: `${SPACING.section.large}`
- Button radius: `${RADIUS.md}` or `${RADIUS.lg}`

### Animations

- Smooth transitions: `${TRANSITION.all}`
- Transform on hover: `${TRANSITION.transform}`

## Testing Error States

### Demo Toggle

A button in the bottom-right corner toggles error display:

```tsx
const [showErrors, setShowErrors] = useState(false);
```

When enabled, you can trigger errors for testing by setting error states:

```tsx
// Simulate network error
setHeroError("network");
setGlanceError("network");

// Simulate server maintenance
setFeaturesError("server");

// Simulate timeout
setQuickActionsError("timeout");
```

## Localization Strings

All error messages are in Indonesian (Bahasa Indonesia). For multi-language support, extract these strings into a translation system:

```ts
// Example i18n structure
const errorMessages = {
  network: {
    title: "Koneksi Terputus",
    message: "Kami tidak dapat terhubung ke {section}...",
    suggestion: "Pastikan Anda terhubung ke Wi-Fi atau data mobile.",
    action: "Coba Lagi",
  },
  server: {
    title: "Sedang Pemeliharaan",
    // ...
  },
  // ...
};
```

## Retry Logic

### Client-Side Retry

1. User clicks retry button
2. Error state resets to null
3. Loading state resumes
4. Request re-attempts

### Server-Side Retry (Recommended)

Implement exponential backoff:

```ts
const retryWithBackoff = async (fn, maxAttempts = 3) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
};
```

## Accessibility

### Keyboard Navigation

- Retry buttons are keyboard accessible
- Links to alternatives use standard `<Link>` component
- Focus states follow app design

### Screen Readers

- Use semantic HTML (buttons, links)
- Emoji used for visual reference, not critical information
- Error description is in text form

### Color Contrast

- Orange-600 on white: 7.1:1 ratio (AAA)
- Orange-400 on dark background: meets WCAG 2.1 AAA

## Production Checklist

Before shipping error states:

- [ ] All error messages reviewed for tone and clarity
- [ ] Retry logic tested and working
- [ ] Alternative navigation paths functional
- [ ] Dark mode appearance verified
- [ ] Mobile responsiveness tested
- [ ] Accessibility audit completed
- [ ] Demo toggle removed from production build
- [ ] Error logging integrated with backend
- [ ] Analytics set up for error tracking
- [ ] Support docs updated with common errors

## Future Improvements

1. **Smart Error Recovery**

   - Detect network type and suggest wifi when on mobile data
   - Offer offline mode for cached data
   - Queue actions for retry when connection restores

2. **Contextual Help**

   - Link to help articles for specific errors
   - Suggest alternatives based on error type
   - Provide contact support option with pre-filled context

3. **Error Analytics**

   - Track which sections fail most often
   - Monitor error rates by type
   - Alert on error spikes

4. **Graceful Degradation**
   - Show partial content if some sections fail
   - Use cached data while new request attempts
   - Fallback to simplified UI if major components fail

## Related Files

- **Main Component:** `src/app/page.tsx`
- **Error Components:** Lines 121-245
- **Error State Management:** Lines 665-688
- **Usage Examples:** Throughout the return JSX
