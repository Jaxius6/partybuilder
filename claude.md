# PartyBuilder - Claude Project Context

## Project Status

✅ **Complete** - All code written and committed to local git
⏳ **Pending** - Seed database to populate test parties
⏳ **Pending** - Push to GitHub repository

## Quick Start

```bash
# 1. Install dependencies (already done)
npm install

# 2. Start development server
npm run dev

# 3. In another terminal, seed the database with test parties
npm run seed

# 4. Open http://localhost:3000
```

**IMPORTANT**: The app will show "No parties yet" until you run `npm run seed`!

## Project Overview

PartyBuilder is a no-database MVP platform for creating political party prototypes in Western Australia. It helps aspiring parties gather 500+ members and prepare for WAEC (Western Australian Electoral Commission) registration.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Charts**: Vanilla Canvas (no dependencies)
- **Storage**: In-memory with JSON persistence fallback

## Key Design Decisions

### 1. No Database MVP
- All data stored in-memory for speed
- Optional JSON persistence to `./.data/state.json`
- Graceful fallback if filesystem unavailable (e.g., Vercel)
- Easy migration to SQLite/Postgres later

### 2. WAEC Validation Rules
Party names must comply with strict rules:
- Maximum 4 words
- Title Case only (auto-formatted)
- No forbidden words: "royal", "independent"
- No public body names (Parliament, WAEC, City of, etc.)
- Levenshtein distance > 2 from existing parties
- No offensive/obscene terms

### 3. Member Requirements
- Email required for all members
- Track progress to 500 members (WAEC threshold)
- Visual progress bars showing % completion
- CSV export for WAEC submissions

### 4. Registration Workflow
WAEC registration stages:
1. DRAFT - Initial creation
2. PREP - Preparing requirements
3. SUBMITTED - Application sent to WAEC
4. GAZETTE_NOTICE - Published in Government Gazette
5. OBJECTION_WINDOW - 1 month for public objections
6. REGISTERED/REJECTED - Final decision

## Project Structure

```
partybuilder/
├── app/                      # Next.js pages & API
│   ├── api/parties/          # REST API endpoints
│   ├── p/[slug]/             # Party detail pages
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── Countdown.tsx         # Ticking election countdown
│   ├── CreatePartyModal.tsx  # Party creation form
│   ├── MiniLine.tsx          # Canvas line chart
│   ├── MiniPie.tsx           # Canvas pie chart
│   ├── PartyTable.tsx        # Party listing
│   └── ProgressBar.tsx       # Member progress
├── lib/                      # Core logic
│   ├── store.ts              # In-memory storage
│   ├── types.ts              # TypeScript definitions
│   ├── util.ts               # Helper functions
│   └── validate.ts           # WAEC validation
└── scripts/                  # Utilities
    └── seed.ts               # Database seeding
```

## API Endpoints

### Parties
- `GET /api/parties` - List all parties with stats
- `POST /api/parties` - Create new party (validated)
- `GET /api/parties/[slug]` - Party details + members + stats
- `POST /api/parties/[slug]/join` - Join as member
- `POST /api/parties/[slug]/like` - Increment likes
- `GET /api/parties/[slug]/export.csv` - Export member CSV

## Data Models

### Party
```typescript
{
  id: string;
  name: string;
  abbreviation?: string;
  slug: string;
  slogan?: string;
  category?: string;
  website?: string;
  constitution_url?: string;
  secretary_name?: string;
  secretary_address?: string;
  likes: number;
  has_bank_account: boolean;
  has_exec: boolean;
  has_constitution: boolean;
  has_website: boolean;
  has_facebook: boolean;
  waec_status: WAECStatus;
  app_fee_paid: boolean;
  application_submitted_at?: string;
  gazette_notice_date?: string;
  objection_deadline?: string;
  objections_count: number;
  created_at: string;
}
```

### Member
```typescript
{
  id: string;
  party_id: string;
  full_name: string;
  email: string;        // Required
  suburb?: string;
  dob?: string;
  is_wa_elector?: boolean;
  created_at: string;
}
```

## Key Features

### 1. Party Name Validation
Comprehensive validation with detailed error messages:
- Word count check (max 4)
- ALL-CAPS detection
- Forbidden word filtering
- Public body name rejection
- Levenshtein distance similarity check
- Auto-formatting to Title Case

### 2. Progress Tracking
Visual indicators for 500-member goal:
- Progress bar with percentage
- Color coding (blue < 500, green ≥ 500)
- "Ready for WAEC" badge at 500+
- 30-day member growth chart

### 3. Registration Checklist
Track WAEC requirements:
- Bank account
- Executive committee
- Constitution document
- Website
- Facebook page
- Application fee payment

### 4. Data Persistence
Hybrid storage approach:
- In-memory state for performance
- Debounced writes (1s delay)
- JSON file fallback
- No crashes if filesystem unavailable

## Environment Variables

```env
# Election date for countdown (YYYY-MM-DD)
NEXT_PUBLIC_ELECTION_DATE=2029-03-08

# Admin secret (future use)
ADMIN_SECRET=dev-only-override
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Seed database (requires dev server running)
npm run seed

# Build for production
npm run build

# Start production server
npm start
```

## Seeding Test Data

The seed script (`scripts/seed.ts`) populates:

### Test Parties (Prototypes)
- Stop Ai Party (120 members)
- Fix Housing Party (350 members)
- Pro Ai Party (89 members)

### Real Registered Parties (500+ members each)
- WA Labor (2100 members)
- Liberal Party Western Australia (1850 members)
- The Greens (WA) Inc (1450 members)
- Pauline Hanson's One Nation (920 members)
- The Nationals WA (890 members)
- Legalise Cannabis Party WA (720 members)
- Shooters, Fishers and Farmers (680 members)
- Animal Justice Party (650 members)
- Sustainable Australia Party (590 members)
- Australian Christians (580 members)
- Libertarian Party (540 members)
- Western Australia Party (510 members)

## UI Components

### Countdown
- Displays years, months, days, hours, minutes, seconds
- Updates every second (ticking animation)
- Responsive sizing for mobile/desktop
- Blue color scheme matching brand

### Progress Bar
- Shows current/goal member count
- Percentage calculation
- Color transitions at milestones
- "Ready for WAEC" indicator at 500+

### Charts
**MiniPie** - Category breakdown
- Vanilla canvas implementation
- Auto-color assignment
- Legend with counts
- Responsive sizing

**MiniLine** - Member growth over time
- 30-day history
- Grid lines for readability
- Auto-scaling Y-axis
- Date labels on X-axis

## Future Enhancements

### Authentication & Authorization
- User accounts
- Party ownership
- Admin roles
- WAEC reviewer access

### Database Migration
- SQLite for local/small deployments
- PostgreSQL for production
- Prisma ORM integration
- Data migration scripts

### Enhanced Features
- Email notifications
- Document uploads
- Payment processing
- Real-time updates (WebSocket)
- Social sharing
- Member forums
- Event management

### WAEC Integration
- API for WAEC submissions
- Document verification
- Automated objection tracking
- Registration status webhooks

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel dashboard
3. Set environment variables
4. Deploy

**Note**: Runs in memory-only mode (no JSON persistence)

### Self-Hosted
Requires:
- Node.js 18+
- Writable `.data` directory
- Environment variables configured

## Known Limitations

1. **No persistence on serverless** - Data lost on cold starts (Vercel, Lambda)
2. **No authentication** - Anyone can create parties/join
3. **No email validation** - Emails not verified
4. **Cookie-based throttling not implemented** - Unlimited likes
5. **Basic similarity check** - Levenshtein only, not fuzzy matching

## Contributing Guidelines

When working on PartyBuilder:

1. **Maintain validation integrity** - WAEC rules are regulatory requirements
2. **Preserve in-memory design** - Avoid database dependencies in MVP
3. **Keep components lightweight** - No heavy chart libraries
4. **Test on mobile** - Responsive design is critical
5. **Document breaking changes** - Especially storage format changes

## Testing Checklist

- [ ] Create party with valid name
- [ ] Reject party with invalid name (various rules)
- [ ] Join party as member
- [ ] Verify email requirement
- [ ] Check duplicate email prevention
- [ ] View party detail page
- [ ] Export members as CSV
- [ ] Like a party
- [ ] View progress bar at various member counts
- [ ] Verify countdown timer ticks
- [ ] Test responsive layout (mobile/desktop)
- [ ] Check JSON persistence (local dev)
- [ ] Verify graceful degradation (serverless)

## Next Steps

### To See Parties in the App

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Seed the database** (in another terminal):
   ```bash
   npm run seed
   ```

3. **You'll see**:
   - 3 test parties: Stop Ai Party, Fix Housing Party, Pro Ai Party
   - 12 real registered WA parties (all with 500+ members showing green progress bars)

### To Push to GitHub

```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/partybuilder.git
git push -u origin master
```

## Links

- **WAEC Official**: https://www.elections.wa.gov.au/
- **Party Registration Guide**: https://www.elections.wa.gov.au/vote/political-parties
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Last Updated**: November 4, 2025
**Version**: 0.1.0 (MVP)
**Status**: Code complete, ready to run and seed
