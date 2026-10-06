# Gold, FD, and Loans Module Implementation Plan

## Goal

Extend Paisa with three independent modules:

- Gold
- Fixed deposits (FDs)
- Loans

The existing bank and cash income/expense module should continue to work independently. Gold, FD, and Loans must not share records, calculations, forms, or navigation flows with one another.

## Module boundaries

### Transactions module

- Owns income, expenses, bank, cash, monthly summaries, and the existing transaction list.
- Keeps the current `transactions` table and calculations.
- Does not create Gold, FD, or Loan records.

### Gold module

- Tracks gold purchases and sales independently.
- Owns its own gold records, valuations, and history.
- Does not share the FD or Loans tables.
- Does not change the Transactions module balance.

### FD module

- Tracks each fixed deposit independently.
- Owns principal, interest, maturity, renewal, closure, and history.
- Does not share the Gold or Loans tables.
- Does not change the Transactions module balance.

### Loans module

- Tracks loans given and loans taken in one independent module.
- Owns parties, principal, repayments, interest, due dates, and outstanding balances.
- Does not share the Gold or FD tables.
- Does not change the Transactions module balance.

The first version should treat each module as a separate record system. If cash impact or net worth is needed later, add an explicit reporting layer after the modules are stable rather than linking their write operations.

## Data model

Keep the existing `transactions` table unchanged for the current module. Add separate tables for each new module. No new table should reference a record from another new module.

### Gold module tables

#### `gold_holdings`

One row per gold holding or purchase lot.

- `id`, `uid`
- `name`
- `weight` nullable
- `purity` nullable
- `purchase_amount`
- `current_value` nullable
- `purchased_at`
- `sold_at` nullable
- `status`: `active` or `sold`
- `note`, `created_at`, `updated_at`

#### `gold_movements`

- `id`, `uid`, `gold_holding_id`
- `kind`: `purchase`, `valuation`, or `sale`
- `amount`
- `weight` nullable
- `date`, `note`, `created_at`

Gold calculations use only Gold module data.

### FD module tables

#### `fixed_deposits`

One row per FD.

- `id`, `uid`
- `name`
- `principal`
- `interest_rate` nullable
- `started_at`
- `maturity_at`
- `maturity_amount` nullable
- `status`: `active`, `matured`, `closed`, or `renewed`
- `note`, `created_at`, `updated_at`

#### `fixed_deposit_movements`

- `id`, `uid`, `fixed_deposit_id`
- `kind`: `opened`, `interest`, `maturity`, `closed`, or `renewed`
- `amount`
- `date`, `note`, `created_at`

FD calculations use only FD module data.

### Loans module tables

#### `loans`

One row per loan.

- `id`, `uid`
- `direction`: `given` or `taken`
- `party_name`
- `principal`
- `interest_rate` nullable
- `started_at`
- `due_at` nullable
- `status`: `active`, `settled`, or `cancelled`
- `note`, `created_at`, `updated_at`

### `loan_movements`

Records disbursements, repayments, and received interest without overwriting the original principal.

- `id`, `uid`, `loan_id`
- `kind`: `disbursement`, `repayment`, or `interest`
- `amount`
- `date`, `note`, `created_at`

Loan calculations use only Loans module data. Outstanding balances must be derived from loan movements.

## Database and security work

1. Add separate migrations for Gold, FD, and Loans.
2. Add foreign keys only to `auth.users` and each module's own parent records.
3. Add checks for valid kinds, positive amounts, nonnegative weights where used, and valid dates.
4. Add indexes by `uid`, parent id, and date.
5. Enable RLS on every new table with the same ownership rules as `transactions`.
6. Add each module's tables to Supabase Realtime.
7. Keep module writes independent. Do not use cross-module database functions or linked writes.
8. Preserve existing transactions without migrating them into the new modules.

## TypeScript and service changes

- Add separate Gold, FD, and Loans types.
- Add `goldService`, `fdService`, and `loanService` modules.
- Add separate realtime hooks for each module.
- Add separate calculation utilities for each module.
- Add update and delete behavior within each module only.
- Keep existing transaction APIs working for current income/expense entries.

## Module calculations

Create independent pure utility functions with tests.

### Transactions

- Monthly income
- Monthly expenses
- Bank balance
- Cash balance

### Gold

- Total purchase amount
- Current value
- Gain/loss when current value is available
- Active and sold holdings

### FD

- Total principal
- Expected maturity amount when available
- Active, matured, closed, and renewed deposits
- Maturity status

### Loans

- Total given principal
- Total taken principal
- Given outstanding balance
- Taken outstanding balance
- Repayment totals
- Due and overdue loans

Do not combine these calculations into the Transactions summary. A future net-worth report can read the three module summaries without changing their ownership or write paths.

## Navigation and UI flow

### Bottom tab navigation

Introduce a bottom tab navigator after login with four independent tabs:

1. Home — existing transactions dashboard
2. Gold — gold holdings and gold history
3. FD — fixed deposits and maturity tracking
4. Loans — loans given, loans taken, and repayments

Each tab owns its own stack navigator for list, add, edit, and detail screens. The existing Login screen remains outside the tab navigator. The theme toggle and logout action remain in Home unless a shared account/settings screen is added later.

The tab bar should use the existing theme tokens, active primary color, compact icons, and safe-area handling. Tab state should survive navigation between module screens.

### Home tab

Keep the current income/expense entry flow and transaction list in Home. Do not add Gold, FD, or Loan type options to `AddEntryScreen`.

### Gold tab

- List active gold holdings with purchase amount and current value.
- Add a gold holding with name, purchase amount, optional weight/purity, purchase date, and note.
- Edit, sell, or update valuation for a holding.
- Show a holding detail screen with its movement history.

### FD tab

- List active, matured, closed, and renewed FDs.
- Add an FD with name, principal, start date, maturity date, interest rate, expected maturity amount, and note.
- Mark an FD matured, closed, or renewed.
- Show an FD detail screen with interest and lifecycle history.

### Loans tab

- Separate visible sections for Loans Given and Loans Taken.
- Add a loan with party name, principal, start date, due date, optional interest rate, and note.
- Record partial repayments and interest.
- Show outstanding, settled, due, and overdue states.
- Show a loan detail screen with movement history.

Use the existing form controls and save/delete interaction patterns as visual references, but keep each module's form component and validation independent.

## Implementation phases

### Phase 1: Confirm module rules

- Confirm whether Gold tracks weight and purity in the first release.
- Confirm whether FD interest is manually entered or calculated.
- Confirm whether Loans support partial repayments in the first release.
- Confirm the fields required for sold gold, matured FDs, and settled loans.

### Phase 2: Bottom navigation shell

- Add the bottom tab navigator.
- Add independent placeholder stacks for Home, Gold, FD, and Loans.
- Verify login routing and back navigation.

### Phase 3: Independent schemas and domain layers

- Add separate migrations, RLS policies, types, services, hooks, and calculations for each module.
- Verify no new module changes Transactions behavior.

### Phase 4: Gold module

- Implement Gold list, add/edit form, detail screen, movements, and calculations.

### Phase 5: FD module

- Implement FD list, add/edit form, detail screen, lifecycle movements, and calculations.

### Phase 6: Loans module

- Implement Loans list, given/taken sections, add/edit form, repayment flow, detail screen, and calculations.

### Phase 7: Verification and documentation

- Test each module independently with create, edit, delete, lifecycle changes, and realtime updates.
- Test bottom-tab navigation and authentication boundaries.
- Verify Transactions totals remain unchanged when Gold, FD, or Loans records change.
- Update README with the new tabs, setup, and module data models.

## Acceptance criteria

- Existing income and expense entries behave exactly as before.
- Gold records can be created, edited, valued, sold, and viewed without touching FD, Loans, or Transactions records.
- FD records can be created, edited, matured, closed, renewed, and viewed without touching Gold, Loans, or Transactions records.
- Loans can be created as Given or Taken, repaid partially or fully, settled, and viewed without touching Gold, FD, or Transactions records.
- Each module has independent lists, forms, details, services, hooks, calculations, and realtime updates.
- The bottom tab bar opens Home, Gold, FD, and Loans as separate modules.
- Users can only read and change their own records in every module.
- Existing Transactions totals and balances remain unchanged when records in the new modules change.
- Lint, TypeScript checks, and meaningful unit tests pass before release.
