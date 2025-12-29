# Hockey Performance Tracker - MVP Spec

## What We're Building
A web app that helps hockey players understand how mental factors (sleep, confidence, stress) affect their on-ice performance by tracking stats and psychology together.

## MVP Scope (Bare Bones Only)
- Player can create account and log in
- Player can manually add games with basic stats or import Instat csv file
- Player can log mental state after each game
- Player shows simple correlations on a dashboard
- Works on mobile (players fill out forms on phones)

## Tech Stack
- **Frontend/Backend:** Next.js 14 (App Router)
- **Database:** PostgreSQL (Vercel Postgres or Railway)
- **ORM:** Prisma
- **Auth:** NextAuth.js (credentials provider)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Deployment:** Vercel

## Database Schema
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // hashed
  name      String
  team      String
  position  String
  createdAt DateTime @default(now())
  games     Game[]
}

model Game {
  id          String       @id @default(cuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  date        DateTime
  opponent    String
  homeAway    String       // "home" or "away"
  result      String       // "win" or "loss"
  goals       Int          @default(0)
  assists     Int          @default(0)
  shots       Int          @default(0)
  plusMinus   Int          @default(0)
  iceTime     Int          @default(0) // minutes
  createdAt   DateTime     @default(now())
  mentalState MentalState?
}

model MentalState {
  id             String   @id @default(cuid())
  gameId         String   @unique
  game           Game     @relation(fields: [gameId], references: [id])
  confidence     Int      // 1-10
  sleepHours     Float    // decimal for 7.5 etc
  sleepQuality   Int      // 1-10
  stressLevel    Int      // 1-10
  physicalEnergy Int      // 1-10
  notes          String?  // optional text
  createdAt      DateTime @default(now())
}
```

## Pages & Routes
```
/ (public landing page - dead simple, just login/signup buttons)
/auth/login
/auth/signup
/dashboard (protected - shows stats and insights)
/games/add (protected - add new game form)
/games/[id] (protected - view/edit specific game)
/games/[id]/mental (protected - add mental state for game)
```

## MVP Features (In Order of Build)

### 1. Authentication System
**What it does:**
- Sign up with email, password, name, team, position
- Log in
- Log out
- Protected routes (redirect to login if not authenticated)

**Commit checkpoint:** "Add authentication system with signup and login"

---

### 2. Add Game Form
**What it does:**
- Form with fields: date, opponent, home/away dropdown, result dropdown, goals, assists, shots, plus/minus, ice time
- Basic validation (no negative numbers, date not in future)
- Saves to database linked to logged-in user
- Redirects to dashboard after save

**Commit checkpoint:** "Add game creation form with validation"

---

### 3. Games List (Dashboard Part 1)
**What it does:**
- Shows all user's games in table format
- Columns: Date, Opponent, Result, Points (goals+assists), +/-
- Sorted by date (newest first)
- Click row to view game details
- "Add Game" button at top

**Commit checkpoint:** "Add games list view on dashboard"

---

### 4. Mental State Form
**What it does:**
- Accessed from game detail page if mental state not logged yet
- Form with:
  - Confidence slider (1-10)
  - Sleep hours number input
  - Sleep quality slider (1-10)
  - Stress level slider (1-10)
  - Physical energy slider (1-10)
  - Optional notes textarea
- Mobile-friendly (big touch targets)
- Saves and links to game
- Shows success message

**Commit checkpoint:** "Add post-game mental state tracking form"

---

### 5. Dashboard Stats Summary
**What it does:**
- At top of dashboard, show summary cards:
  - Total games played
  - Average points per game (goals + assists)
  - Average plus/minus
  - Average confidence rating
  - Average sleep hours
- Simple card layout, no charts yet

**Commit checkpoint:** "Add dashboard summary statistics"

---

### 6. Basic Correlations (The Core Value)
**What it does:**
- Calculate and display:
  - **High Confidence Impact:** "You average X.X points per game when confidence is 8+ vs Y.Y points when confidence is 5 or below"
  - **Sleep Impact:** "You average X.X points per game with 8+ hours sleep vs Y.Y points with less than 7 hours"
- Show these as insight cards on dashboard
- Only show if user has at least 5 games with mental state logged
- If not enough data: "Log 5+ games with mental state to see insights"

**Logic:**
```javascript
// Filter games into high/low groups
const highConfidenceGames = games.filter(g => g.mentalState.confidence >= 8)
const lowConfidenceGames = games.filter(g => g.mentalState.confidence <= 5)

// Calculate averages
const avgPointsHighConf = average(highConfidenceGames.map(g => g.goals + g.assists))
const avgPointsLowConf = average(lowConfidenceGames.map(g => g.goals + g.assists))

// Display difference
```

**Commit checkpoint:** "Add correlation insights for confidence and sleep"

---

### 7. Simple Charts
**What it does:**
- Line chart: Points per game over time
- Bar chart: Average confidence by game
- Bar chart: Sleep hours by game
- Use Recharts library
- Mobile responsive

**Commit checkpoint:** "Add performance and mental state charts"

---

### 8. Mobile Polish
**What it does:**
- Make sure all forms work well on phone screens
- Large touch targets for sliders
- Mobile nav menu if needed
- Test on actual phone, fix any issues

**Commit checkpoint:** "Optimize mobile UX for forms and dashboard"

---

### 9. Edit/Delete Games
**What it does:**
- Edit button on game detail page
- Delete button with confirmation ("Are you sure?")
- Update game stats
- Update mental state if exists

**Commit checkpoint:** "Add edit and delete functionality for games"

---

### 10. Basic Styling & Polish
**What it does:**
- Clean up UI with Tailwind
- Consistent colors, spacing, typography
- Loading states for forms
- Error messages for validation
- Success messages for actions
- Make it look professional, not beautiful

**Commit checkpoint:** "Polish UI and add loading/error states"

---
## Success Criteria for MVP

 I can create an account
 I can add a game with stats in under 2 minutes
 I can log mental state in under 90 seconds on my phone
 After 5+ games, I see meaningful insights about confidence and sleep
 The insights are accurate (I verify the math by hand)
 A teammate can use it without me explaining anything
 It's deployed and accessible via URL

---

## Development Workflow

### Setup
```bash
npx create-next-app@latest hockey-performance-tracker
cd hockey-performance-tracker
npm install prisma @prisma/client next-auth bcryptjs recharts
npx prisma init
```

### Each Feature
1. Build the feature
2. Test it manually (actually use it, don't just check if it loads)
3. Fix bugs
4. Commit with clear message
5. Push to GitHub
6. Deploy to Vercel (should auto-deploy on push)

### Git Commands for Each Checkpoint
```bash
git add .
git commit -m "[checkpoint message from above]"
git push origin main
```

---

## Folder Structure
```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard with stats and insights
│   ├── games/
│   │   ├── add/
│   │   │   └── page.tsx        # Add game form
│   │   └── [id]/
│   │       ├── page.tsx        # Game detail/edit
│   │       └── mental/
│   │           └── page.tsx    # Mental state form
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   └── signup/
│   │       └── page.tsx        # Signup page
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts    # NextAuth config
│       ├── games/
│       │   └── route.ts        # CRUD for games
│       └── mental/
│           └── route.ts        # CRUD for mental state
├── components/
│   ├── GameForm.tsx
│   ├── MentalStateForm.tsx
│   ├── GamesList.tsx
│   ├── StatsCard.tsx
│   ├── InsightCard.tsx
│   └── Charts.tsx
├── lib/
│   ├── prisma.ts               # Prisma client
│   ├── auth.ts                 # Auth utilities
│   └── analytics.ts            # Correlation calculations
└── prisma/
    └── schema.prisma           # Database schema
```

---

## Key Implementation Notes

### Authentication
- Use NextAuth.js credentials provider
- Hash passwords with bcryptjs before storing
- Use middleware to protect routes
- Session management handled by NextAuth

### Forms
- Use HTML5 validation where possible (type="number", required, min, max)
- Client-side validation for UX
- Server-side validation for security
- Optimistic UI updates (show change immediately, handle errors)

### Correlations Logic
```javascript
// Only calculate if enough data
if (gamesWithMentalState.length < 5) {
  return "Need at least 5 games with mental state data"
}

// Split into groups
const highConfGames = games.filter(g => g.mentalState.confidence >= 8)
const lowConfGames = games.filter(g => g.mentalState.confidence <= 5)

// Calculate averages
const avgHigh = highConfGames.reduce((sum, g) => sum + g.goals + g.assists, 0) / highConfGames.length
const avgLow = lowConfGames.reduce((sum, g) => sum + g.goals + g.assists, 0) / lowConfGames.length

// Display
return `You average ${avgHigh.toFixed(1)} points when confidence is 8+ vs ${avgLow.toFixed(1)} points when 5 or below`
```

### Mobile Optimization
- Use Tailwind responsive classes (sm:, md:, lg:)
- Forms: `<input type="range">` for sliders, large step sizes
- Touch targets minimum 44x44px
- Test on actual device, not just Chrome DevTools

---

## Testing Checklist (Before Calling it Done)

- [ ] Sign up new account
- [ ] Log in with account
- [ ] Add 3 games with different stats
- [ ] Log mental state for each game (use different values)
- [ ] View dashboard - see summary stats
- [ ] Add 2 more games with mental state
- [ ] Check if insights appear (should show after 5 games)
- [ ] Verify insight math is correct by hand
- [ ] Edit a game's stats
- [ ] Delete a game
- [ ] Log out and log back in - data persists
- [ ] Open on phone - forms are usable
- [ ] Have teammate create account and add a game

---

## Timeline

- **Week 1:** Features 1-3 (Auth, Add Game, Games List)
- **Week 2:** Features 4-5 (Mental State, Stats Summary)
- **Week 3:** Features 6-7 (Correlations, Charts)
- **Week 4:** Features 8-10 (Mobile Polish, Edit/Delete, Final Polish)

**Target:** Working MVP by December 8

---

## When You Get Stuck

1. Check if you're overthinking it - can it be simpler?
2. Ask Claude Code for specific implementation
3. Google the error message
4. Check Next.js docs: https://nextjs.org/docs
5. Check Prisma docs: https://www.prisma.io/docs
6. Commit what works, try the broken part in a new branch

---

## Final Note

**This is bare bones for a reason.** Get this working first. Get it in your hands. Use it for 5 games. Then decide what to add.

Don't add features until you've used what exists. You'll know what's missing when you actually use it.

Build fast. Ship fast. Iterate.