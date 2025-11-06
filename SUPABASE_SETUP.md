# Supabase Setup for PartyBuilder

Quick and easy database setup using Supabase's free tier.

---

## Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project**
3. Sign up with GitHub (easiest) or email

---

## Step 2: Create New Project

1. Click **New Project**
2. Fill in:
   - **Name**: `partybuilder` (or whatever you like)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., `ap-southeast-2` for Australia)
   - **Plan**: Free (includes 500MB database)
3. Click **Create new project**
4. Wait ~2 minutes for provisioning

---

## Step 3: Get Your Connection String

1. In your Supabase project dashboard, click **Settings** (gear icon)
2. Click **Database** in the sidebar
3. Scroll down to **Connection string**
4. Select **URI** tab
5. Copy the connection string (looks like this):
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the database password you created in Step 2

---

## Step 4: Create the PartyBuilder Table

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy and paste the contents of `CREATE_TABLE.sql`
4. Click **Run** (or press Ctrl+Enter)
5. You should see: "Success. No rows returned"

---

## Step 5: Add Seed Data

1. Still in SQL Editor, click **New query**
2. Copy and paste the contents of `SEED_DATA.sql`
3. Click **Run**
4. You should see: "Success. 15 rows affected" (12 real parties + 3 fun ones)

---

## Step 6: Configure Your Next.js App

1. Open `.env.local` in your project
2. Update the `DATABASE_URL` with your Supabase connection string:

```env
# PostgreSQL Connection (Supabase)
DATABASE_URL="postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres"

# Election date for countdown
NEXT_PUBLIC_ELECTION_DATE=2029-03-08
```

**IMPORTANT**:
- Use the **Transaction** mode connection string (port 6543)
- NOT the Session mode (port 5432)
- Transaction mode is required for serverless/edge functions

---

## Step 7: Test the Connection

Run the test script:

```bash
node test-db.js
```

You should see:
```
🔌 Connecting to database...
✅ Database connected successfully!
📅 Server time: [timestamp]

📊 Checking partybuilder table...
✅ Found 15 parties in database

🎉 Party breakdown:
  DRAFT: 1 parties (89 members)
  PREP: 2 parties (687 members)
  REGISTERED: 12 parties (12020 members)

🏆 Top 5 parties by members:
  1. WA Labor - 2100 members
  2. Liberal Party Western Australia - 1850 members
  3. The Greens (WA) Inc - 1450 members
  4. Pauline Hanson's One Nation - 920 members
  5. The Nationals WA - 890 members

✅ All tests passed! Database is ready.
```

---

## Step 8: Start Your App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you should see all 15 parties!

---

## Verify Your Data in Supabase

1. Go to **Table Editor** in Supabase dashboard
2. Click on `partybuilder` table
3. You should see all 15 rows with party data

---

## Troubleshooting

### Connection Failed
- Double-check your password in the connection string
- Make sure you're using port **6543** (Transaction mode)
- Check your project isn't paused (free tier pauses after inactivity)

### Table Doesn't Exist
- Run `CREATE_TABLE.sql` again in SQL Editor
- Make sure there were no errors when creating the table

### No Data Showing
- Run `SEED_DATA.sql` again in SQL Editor
- Check Table Editor to verify rows were inserted

---

## Supabase Free Tier Limits

- **Database**: 500MB
- **Bandwidth**: 5GB
- **API Requests**: Unlimited
- **Pauses**: After 1 week of inactivity (auto-resumes on access)

For PartyBuilder, this is more than enough!

---

## Next Steps

Once your connection test passes:

1. I'll migrate your Next.js app to use PostgreSQL
2. Update `lib/store.ts` to query Supabase
3. Update all API routes to use SQL
4. Remove in-memory storage
5. Test all features work

---

**Ready?** Just paste your Supabase connection string and I'll help you complete the migration! 🚀
