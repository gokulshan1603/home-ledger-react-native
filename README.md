# Home Ledger

Home Ledger is a React Native CLI app for tracking personal home income and expenses. Every entry belongs to Bank or Cash, monthly totals update in real time, and balances are calculated from the full transaction history.

## Stack

- React Native 0.81 + TypeScript
- React Navigation native stack
- Supabase Auth and PostgreSQL
- Supabase Realtime for transaction updates
- System-aware light and dark themes with a persistent manual toggle

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the Supabase SQL Editor and run [`supabase/schema.sql`](./supabase/schema.sql).
3. Enable Email provider under Authentication → Sign In / Providers.
4. Create a user under Authentication → Users. The app intentionally has no public sign-up flow.
5. Copy the Project URL and Publishable key from the project's Connect dialog into [`src/config/supabase.ts`](./src/config/supabase.ts).

The publishable key is intended for client apps. Never put a Supabase service role key in the mobile app.

## Run locally

Install dependencies and start Metro:

```sh
npm install
npm start
```

In another terminal, run the native app:

```sh
npm run android
```

For iOS:

```sh
bundle install
bundle exec pod install --project-directory=ios
npm run ios
```

Useful checks:

```sh
npx tsc --noEmit
npm run lint
npm test -- --runInBand --watchman=false
```

## App structure

- `src/screens` contains Login, Home, and Add/Edit Entry screens.
- `src/services` contains the Supabase Auth and database boundary.
- `src/config/supabase.ts` creates the Supabase client and persists sessions with AsyncStorage.
- `src/hooks` connects realtime transaction listeners and summaries to screens.
- `src/utils/summary.ts` contains pure income, expense, and account balance calculations.
- `src/components` contains the reusable controls and transaction list UI.
