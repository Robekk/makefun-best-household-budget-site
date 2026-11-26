// Hearth & Ledger — the household's books.
//
// One ledger, kept honestly: every total on every page is summed from the
// transactions below, so the overview, the budget, the bills and the
// reports can never disagree with each other. Amounts are dollars; a
// transaction with kind "in" is money in, "out" is money spent, and
// "save" is a transfer into a savings goal (counted as kept, not spent).

export const HOUSEHOLD = {
  name: 'The Hale household',
  people: 'June & Marcus Hale, with Ada (9) and Theo (6)',
  home: 'Maple Street',
};

export const MONTHS = [
  { id: '2026-09', label: 'September 2026', short: 'Sep' },
  { id: '2026-10', label: 'October 2026', short: 'Oct' },
  { id: '2026-11', label: 'November 2026', short: 'Nov' },
];

// Monthly spending limits per category, set by the household each January
// and adjusted on the Budget page. Order here is the order everywhere.
export const CATEGORIES = [
  { id: 'housing',     name: 'Housing',        limit: 1850, color: '#1d4d33', note: 'Rent for Maple Street' },
  { id: 'utilities',   name: 'Utilities',      limit: 320,  color: '#2e7d5b', note: 'Power, water, internet, phones' },
  { id: 'groceries',   name: 'Groceries',      limit: 820,  color: '#7fb069', note: 'Weekly shop and market runs' },
  { id: 'dining',      name: 'Dining out',     limit: 300,  color: '#e0a458', note: 'Cafés, takeaways, Friday pizza' },
  { id: 'transport',   name: 'Transport',      limit: 300,  color: '#4f86c6', note: 'Fuel, transit passes, parking' },
  { id: 'health',      name: 'Health',         limit: 220,  color: '#c65b7c', note: 'Pharmacy, dentist, glasses' },
  { id: 'kids',        name: 'Kids & school',  limit: 260,  color: '#8856a7', note: 'School lunches, clubs, shoes' },
  { id: 'home',        name: 'Home & garden',  limit: 180,  color: '#a67c52', note: 'Repairs, tools, plants' },
  { id: 'subs',        name: 'Subscriptions',  limit: 110,  color: '#5b8e7d', note: 'Music, films, cloud storage' },
  { id: 'fun',         name: 'Fun & leisure',  limit: 260,  color: '#e07a5f', note: 'Cinema, games, days out' },
  { id: 'clothing',    name: 'Clothing',       limit: 160,  color: '#6d8ea0', note: 'Clothes and shoes for four' },
  { id: 'pets',        name: 'Pets',           limit: 95,   color: '#b5651d', note: 'Biscuit the cat: food and vet' },
];

// The ledger itself: [month, day, payee, category, kind, amount, account]
// kind "in" rows carry category "income"; "save" rows carry a goal id.
export const TRANSACTIONS = [
  // ——— November 2026 (the current month, still open) ———
  ['2026-11', 1, 'Marcus — salary, Hartwell Logistics', 'income', 'in', 4650.00, 'Everyday checking'],
  ['2026-11', 1, 'Maple Street rent', 'housing', 'out', 1850.00, 'Everyday checking'],
  ['2026-11', 2, 'Transfer to Emergency fund', 'goal:emergency', 'save', 500.00, 'Savings'],
  ['2026-11', 2, 'Greenbasket Market — weekly shop', 'groceries', 'out', 168.42, 'Everyday checking'],
  ['2026-11', 3, 'City Power — electricity', 'utilities', 'out', 96.18, 'Everyday checking'],
  ['2026-11', 3, 'Shell — fuel for the wagon', 'transport', 'out', 58.30, 'Joint card'],
  ['2026-11', 4, 'Ada — school lunch account top-up', 'kids', 'out', 45.00, 'Everyday checking'],
  ['2026-11', 5, 'Streamly — family plan', 'subs', 'out', 17.99, 'Joint card'],
  ['2026-11', 5, 'Pharmacy — prescriptions', 'health', 'out', 38.60, 'Joint card'],
  ['2026-11', 6, 'Nonna’s Trattoria — Friday pizza', 'dining', 'out', 64.20, 'Joint card'],
  ['2026-11', 7, 'Greenbasket Market — weekly shop', 'groceries', 'out', 154.87, 'Everyday checking'],
  ['2026-11', 8, 'Metro Transit — two monthly passes', 'transport', 'out', 98.00, 'Everyday checking'],
  ['2026-11', 9, 'Transfer to Holiday in Maine', 'goal:holiday', 'save', 150.00, 'Savings'],
  ['2026-11', 9, 'Maple Hardware — tap washers & sealant', 'home', 'out', 23.75, 'Joint card'],
  ['2026-11', 10, 'June — salary, Brightpath Studio', 'income', 'in', 2900.00, 'Everyday checking'],
  ['2026-11', 10, 'Fiberline — home internet', 'utilities', 'out', 65.00, 'Everyday checking'],
  ['2026-11', 11, 'Theo — after-school football club', 'kids', 'out', 60.00, 'Everyday checking'],
  ['2026-11', 12, 'Greenbasket Market — weekly shop', 'groceries', 'out', 171.30, 'Everyday checking'],
  ['2026-11', 13, 'Cinema City — family matinee', 'fun', 'out', 52.00, 'Joint card'],
  ['2026-11', 14, 'H&M — winter coats for the kids', 'clothing', 'out', 118.45, 'Joint card'],
  ['2026-11', 15, 'Two phones — mobile plan', 'utilities', 'out', 84.00, 'Everyday checking'],
  ['2026-11', 15, 'June — freelance illustration invoice', 'income', 'in', 240.00, 'Everyday checking'],
  ['2026-11', 16, 'Pet Pantry — cat food & litter', 'pets', 'out', 46.80, 'Joint card'],
  ['2026-11', 17, 'Greenbasket Market — weekly shop', 'groceries', 'out', 149.65, 'Everyday checking'],
  ['2026-11', 18, 'Dr. Patel — dentist check-ups', 'health', 'out', 120.00, 'Everyday checking'],
  ['2026-11', 19, 'Transfer to A car that starts', 'goal:car', 'save', 200.00, 'Savings'],
  ['2026-11', 19, 'Burger Barn — midweek treat', 'dining', 'out', 38.75, 'Joint card'],
  ['2026-11', 20, 'City Water — quarterly bill', 'utilities', 'out', 54.30, 'Everyday checking'],
  ['2026-11', 21, 'Shell — fuel for the wagon', 'transport', 'out', 61.45, 'Joint card'],
  ['2026-11', 21, 'Garden Centre — bulbs & compost', 'home', 'out', 37.20, 'Joint card'],
  ['2026-11', 22, 'Greenbasket Market — weekly shop', 'groceries', 'out', 163.08, 'Everyday checking'],
  ['2026-11', 23, 'MusicBox — family plan', 'subs', 'out', 12.99, 'Joint card'],
  ['2026-11', 24, 'Ada — new school shoes', 'kids', 'out', 54.99, 'Joint card'],
  ['2026-11', 24, 'CloudKeep — photo storage', 'subs', 'out', 9.99, 'Joint card'],
  ['2026-11', 25, 'Sushi Go — date night', 'dining', 'out', 82.40, 'Joint card'],
  ['2026-11', 25, 'Vet — Biscuit’s annual check', 'pets', 'out', 39.00, 'Everyday checking'],
  ['2026-11', 26, 'Greenbasket Market — top-up shop', 'groceries', 'out', 88.54, 'Everyday checking'],
  ['2026-11', 26, 'Board Game Night — Catan expansion', 'fun', 'out', 44.95, 'Joint card'],
  // ——— October 2026 (closed) ———
  ['2026-10', 1, 'Marcus — salary, Hartwell Logistics', 'income', 'in', 4650.00, 'Everyday checking'],
  ['2026-10', 1, 'Maple Street rent', 'housing', 'out', 1850.00, 'Everyday checking'],
  ['2026-10', 2, 'Transfer to Emergency fund', 'goal:emergency', 'save', 500.00, 'Savings'],
  ['2026-10', 4, 'Greenbasket Market — weekly shops ×4', 'groceries', 'out', 641.20, 'Everyday checking'],
  ['2026-10', 6, 'City Power — electricity', 'utilities', 'out', 88.44, 'Everyday checking'],
  ['2026-10', 9, 'Transfer to Holiday in Maine', 'goal:holiday', 'save', 150.00, 'Savings'],
  ['2026-10', 10, 'June — salary, Brightpath Studio', 'income', 'in', 2900.00, 'Everyday checking'],
  ['2026-10', 12, 'Metro Transit + fuel', 'transport', 'out', 203.60, 'Everyday checking'],
  ['2026-10', 14, 'Theo — school trip contribution', 'kids', 'out', 85.00, 'Everyday checking'],
  ['2026-10', 17, 'Nonna’s Trattoria + Burger Barn', 'dining', 'out', 141.30, 'Joint card'],
  ['2026-10', 19, 'Transfer to A car that starts', 'goal:car', 'save', 200.00, 'Savings'],
  ['2026-10', 21, 'Fiberline, phones & water', 'utilities', 'out', 201.75, 'Everyday checking'],
  ['2026-10', 23, 'Pharmacy + dentist', 'health', 'out', 96.20, 'Joint card'],
  ['2026-10', 25, 'Subscriptions bundle', 'subs', 'out', 40.97, 'Joint card'],
  ['2026-10', 27, 'Cinema + bowling night', 'fun', 'out', 88.50, 'Joint card'],
  ['2026-10', 29, 'Pet Pantry + vet top-up', 'pets', 'out', 71.30, 'Joint card'],
  ['2026-10', 30, 'Home repairs — gutter clearing', 'home', 'out', 64.00, 'Everyday checking'],
  ['2026-10', 31, 'Kids’ clothes — autumn layers', 'clothing', 'out', 96.75, 'Joint card'],
  // ——— September 2026 (closed) ———
  ['2026-09', 1, 'Marcus — salary, Hartwell Logistics', 'income', 'in', 4650.00, 'Everyday checking'],
  ['2026-09', 1, 'Maple Street rent', 'housing', 'out', 1850.00, 'Everyday checking'],
  ['2026-09', 2, 'Transfer to Emergency fund', 'goal:emergency', 'save', 400.00, 'Savings'],
  ['2026-09', 5, 'Greenbasket Market — weekly shops ×4', 'groceries', 'out', 598.40, 'Everyday checking'],
  ['2026-09', 7, 'City Power — electricity', 'utilities', 'out', 79.90, 'Everyday checking'],
  ['2026-09', 10, 'June — salary, Brightpath Studio', 'income', 'in', 2900.00, 'Everyday checking'],
  ['2026-09', 11, 'Back-to-school — supplies & uniforms', 'kids', 'out', 214.60, 'Everyday checking'],
  ['2026-09', 13, 'Metro Transit + fuel', 'transport', 'out', 187.25, 'Everyday checking'],
  ['2026-09', 16, 'Fiberline, phones & water', 'utilities', 'out', 196.10, 'Everyday checking'],
  ['2026-09', 18, 'Dining — two family meals out', 'dining', 'out', 122.85, 'Joint card'],
  ['2026-09', 20, 'Transfer to A car that starts', 'goal:car', 'save', 200.00, 'Savings'],
  ['2026-09', 22, 'Pharmacy', 'health', 'out', 44.15, 'Joint card'],
  ['2026-09', 24, 'Subscriptions bundle', 'subs', 'out', 40.97, 'Joint card'],
  ['2026-09', 26, 'Day trip — lakeside picnic & boats', 'fun', 'out', 132.40, 'Joint card'],
  ['2026-09', 27, 'Pet Pantry', 'pets', 'out', 42.60, 'Joint card'],
  ['2026-09', 29, 'Garden — autumn planting', 'home', 'out', 58.30, 'Joint card'],
];

// Recurring bills: dueDay is the day of month; `paid` is per month so the
// Bills page can show November's two still to come. Amounts vary slightly
// month to month for metered utilities — the November figure is the one
// the ledger used where the bill is already paid.
export const BILLS = [
  { id: 'rent',      name: 'Maple Street rent',        cat: 'housing',   dueDay: 1,  amount: 1850.00, autopay: true,  paid: { '2026-09': true, '2026-10': true, '2026-11': true } },
  { id: 'power',     name: 'City Power — electricity', cat: 'utilities', dueDay: 3,  amount: 96.18,   autopay: true,  paid: { '2026-09': true, '2026-10': true, '2026-11': true } },
  { id: 'internet',  name: 'Fiberline internet',       cat: 'utilities', dueDay: 10, amount: 65.00,   autopay: true,  paid: { '2026-09': true, '2026-10': true, '2026-11': true } },
  { id: 'phones',    name: 'Two phones — mobile plan', cat: 'utilities', dueDay: 15, amount: 84.00,   autopay: true,  paid: { '2026-09': true, '2026-10': true, '2026-11': true } },
  { id: 'water',     name: 'City Water',               cat: 'utilities', dueDay: 20, amount: 54.30,   autopay: false, paid: { '2026-09': true, '2026-10': true, '2026-11': true } },
  { id: 'insurance', name: 'Home & car insurance',     cat: 'transport', dueDay: 28, amount: 142.00,  autopay: true,  paid: { '2026-09': true, '2026-10': true, '2026-11': false } },
  { id: 'school',    name: 'Ada & Theo — school meals', cat: 'kids',     dueDay: 30, amount: 92.00,   autopay: false, paid: { '2026-09': true, '2026-10': true, '2026-11': false } },
];

export const GOALS = [
  { id: 'emergency', name: 'Emergency fund',        target: 12000, saved: 8400,  monthly: 500, color: '#1d4d33', why: 'Six months of essentials, so a bad month is never a crisis.' },
  { id: 'holiday',   name: 'Holiday in Maine',      target: 2400,  saved: 1150,  monthly: 150, color: '#4f86c6', why: 'A cabin by the lake next July — flights, food and one very large ice cream budget.' },
  { id: 'car',       name: 'A car that starts',     target: 9000,  saved: 3900,  monthly: 200, color: '#e0a458', why: 'The wagon is 14 years old. A reliable replacement before next winter.' },
  { id: 'college',   name: 'Ada & Theo — college',  target: 20000, saved: 6250,  monthly: 0,   color: '#8856a7', why: 'Funded from June’s freelance invoices when they land; $240 arrived this month.' },
];

export const ACCOUNTS = ['Everyday checking', 'Joint card', 'Savings'];
