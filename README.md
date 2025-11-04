# PartyBuilder

**Build your political party prototype for Western Australia**

PartyBuilder is a no-database MVP platform that helps aspiring political parties in Western Australia prototype their organization, gather members, and prepare for WAEC (Western Australian Electoral Commission) registration.

## Features

- **Party Management**: Create and manage political party prototypes
- **Member Recruitment**: Gather supporters and track progress to 500 members
- **WAEC Compliance**: Built-in validation rules for party names and registration requirements
- **Progress Tracking**: Visual dashboards showing member growth and readiness
- **Data Export**: Export member lists as CSV for WAEC submissions
- **In-Memory Storage**: Fast, lightweight storage with optional JSON persistence

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Vanilla Canvas** (for charts)
- **In-Memory Storage** with JSON file fallback

## Getting Started

### Prerequisites

- Node.js 18+ or pnpm/npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd partybuilder
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env` file in the root directory:

```env
# Election date for countdown timer (YYYY-MM-DD)
NEXT_PUBLIC_ELECTION_DATE=2029-03-08

# Admin secret (reserved for future use)
ADMIN_SECRET=dev-only-override
```

## Data Storage

PartyBuilder uses an in-memory storage system with optional JSON persistence:

- **Local/Dev**: Data is persisted to `./.data/state.json`
- **Serverless/Vercel**: Runs in memory-only mode (no persistence)

The `.data` directory is git-ignored and created automatically on first run.

## WAEC Validation Rules

Party names are validated against Western Australian Electoral Commission rules:

- **Max 4 words**
- **Title Case only** (no ALL-CAPS)
- **No forbidden words**: "royal", "independent"
- **No public body names**: Parliament, WAEC, City of, Shire of, etc.
- **Not similar to existing parties**: Levenshtein distance > 2
- **No offensive/obscene terms**

## Project Structure

```
partybuilder/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   └── parties/          # Party endpoints
│   ├── p/[slug]/             # Party detail pages
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── Countdown.tsx         # Election countdown
│   ├── CreatePartyModal.tsx  # Party creation form
│   ├── MiniLine.tsx          # Line chart (vanilla canvas)
│   ├── MiniPie.tsx           # Pie chart (vanilla canvas)
│   ├── PartyTable.tsx        # Party listing table
│   └── ProgressBar.tsx       # Member progress indicator
├── lib/                      # Core logic
│   ├── store.ts              # In-memory storage layer
│   ├── types.ts              # TypeScript types
│   ├── util.ts               # Utility functions
│   └── validate.ts           # WAEC validation rules
└── .data/                    # JSON persistence (git-ignored)
    └── state.json            # Persisted state
```

## API Endpoints

### Parties

- `GET /api/parties` - List all parties with stats
- `POST /api/parties` - Create a new party
- `GET /api/parties/[slug]` - Get party details
- `POST /api/parties/[slug]/join` - Join a party
- `POST /api/parties/[slug]/like` - Like a party
- `GET /api/parties/[slug]/export.csv` - Export members as CSV

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
  waec_status: 'DRAFT' | 'PREP' | 'SUBMITTED' | 'GAZETTE_NOTICE' | 'OBJECTION_WINDOW' | 'REGISTERED' | 'REJECTED';
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

## Key Features Explained

### 1. Party Name Validation

All party names are automatically validated and formatted:
- Converted to Title Case
- Checked against forbidden words list
- Compared to existing party names using Levenshtein distance
- Validated against public body names

### 2. Member Progress Tracking

Parties need 500 members to be eligible for WAEC registration:
- Visual progress bar showing percentage completion
- Member growth chart (30-day history)
- Ready badge when 500 members reached

### 3. WAEC Registration Status

Track your registration journey:
- Draft → Prep → Submitted → Gazette Notice → Objection Window → Registered/Rejected
- Checklist for registration requirements (bank account, executive, constitution, etc.)
- Automatic objection deadline calculation (1 month after gazette notice)

### 4. Data Persistence

The app uses a hybrid storage approach:
- In-memory for fast access
- Debounced JSON writes (1 second delay)
- Graceful fallback if filesystem not writable (e.g., Vercel)

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**Note**: On Vercel, the app runs in memory-only mode (no JSON persistence).

### Other Platforms

The app can be deployed to any Node.js hosting platform. Just ensure:
- Node.js 18+ is available
- Environment variables are set
- `.data` directory is writable (optional)

## Future Enhancements

This is an MVP. Future versions could add:

- **Authentication**: User accounts and party ownership
- **Database**: SQLite or PostgreSQL for persistence
- **Real-time updates**: WebSocket support for live member counts
- **Email notifications**: Member confirmations and updates
- **Payment integration**: WAEC application fee processing
- **Document upload**: Constitution and other required documents
- **Admin dashboard**: WAEC-facing interface for reviewing applications

## WAEC Information

For official information about political party registration in Western Australia:

- [Western Australian Electoral Commission](https://www.elections.wa.gov.au/)
- [Political Party Registration Guide](https://www.elections.wa.gov.au/vote/political-parties)

**Disclaimer**: PartyBuilder is a prototype tool and not affiliated with WAEC. Always refer to official WAEC guidelines for registration requirements.

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

Built with Next.js 14 and deployed on [partybuilder.com.au](https://partybuilder.com.au)
