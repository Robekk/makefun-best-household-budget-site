// Tally House — the bookkeeper.
//
// Holds the household's working state (the ledger, the limits as edited,
// which bills are marked paid, the current month and the ledger filters),
// computes the book from it, and re-renders the current page after every
// change. State lives in memory and in the browser's local storage when
// that is available, so the book survives a reload on the family tablet.

import { BILLS, CATEGORIES, MONTHS, TRANSACTIONS, ACCOUNTS } from './data.js';
import * as views from './views.js';

const STORE_KEY = 'hearth-ledger-v1';

const state = {
  month: '2026-11',
  monthIdx: MONTHS.findIndex((m) => m.id === '2026-11'),
  txns: TRANSACTIONS.map(([month, day, payee, cat, kind, amount, account], i) =>
    ({ month, day, payee, cat, kind, amount, account, seq: i })),
  limits: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.limit])),
  billsPaid: Object.fromEntries(BILLS.map((b) => [b.id, { ...b.paid }])),
  filter: { q: '', cat: 'all', account: 'all' },
  seq: TRANSACTIONS.length,
};

// Restore edits from a previous visit, when storage is available.
try {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) {
    const saved = JSON.parse(raw);
    if (saved.limits) state.limits = { ...state.limits, ...saved.limits };
    if (saved.billsPaid) for (const id of Object.keys(saved.billsPaid)) if (state.billsPaid[id]) Object.assign(state.billsPaid[id], saved.billsPaid[id]);
    if (Array.isArray(saved.added)) for (const t of saved.added) state.txns.push({ ...t, seq: state.seq++ });
  }
} catch { /* storage unavailable (private mode, file sandbox) — the book still works for the visit */ }

function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      limits: state.limits,
      billsPaid: state.billsPaid,
      added: state.txns.filter((t) => t.added),
    }));
  } catch { /* see above */ }
}

// The book for one month: every figure summed from the ledger itself.
export function book(monthId) {
  const txns = state.txns.filter((t) => t.month === monthId);
  const byCat = {};
  let income = 0, spent = 0, saved = 0;
  for (const t of txns) {
    if (t.kind === 'in') income += t.amount;
    else if (t.kind === 'save') saved += t.amount;
    else { spent += t.amount; byCat[t.cat] = (byCat[t.cat] || 0) + t.amount; }
  }
  const bills = BILLS.map((b) => ({ ...b, paid: !!state.billsPaid[b.id][monthId] }));
  return { txns, byCat, income, spent, saved, bills, limits: state.limits, accounts: ACCOUNTS };
}

const viewEl = document.getElementById('view');
const labelEl = document.getElementById('month-label');

function currentRoute() {
  const hash = location.hash.replace(/^#\//, '').split('?')[0];
  return ['budget', 'transactions', 'bills', 'goals', 'reports'].includes(hash) ? hash : 'overview';
}

function render() {
  const route = currentRoute();
  const month = MONTHS[state.monthIdx];
  state.month = month.id;
  labelEl.textContent = month.label;
  document.getElementById('month-prev').toggleAttribute('disabled', state.monthIdx === 0);
  document.getElementById('month-next').toggleAttribute('disabled', state.monthIdx === MONTHS.length - 1);
  for (const a of document.querySelectorAll('#topnav a')) a.classList.toggle('active', a.dataset.nav === route);
  const b = book(month.id);

  if (route === 'overview') viewEl.innerHTML = views.overview(b, month.label);
  else if (route === 'budget') { viewEl.innerHTML = views.budget(b, month.label); wireBudget(); }
  else if (route === 'transactions') { viewEl.innerHTML = views.transactions(b, month.label, state.filter); wireTransactions(); }
  else if (route === 'bills') { viewEl.innerHTML = views.bills(b, month.label); wireBills(); }
  else if (route === 'goals') { viewEl.innerHTML = views.goals(b); wireGoals(); }
  else if (route === 'reports') {
    const history = MONTHS.map((m) => { const hb = book(m.id); return { short: m.short, income: hb.income, spent: hb.spent, saved: hb.saved }; });
    viewEl.innerHTML = views.reports(b, month.label, history);
  }
  viewEl.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function wireBudget() {
  for (const input of viewEl.querySelectorAll('input[data-limit]')) {
    input.addEventListener('change', () => {
      const v = Math.max(0, Math.round(Number(input.value) || 0));
      state.limits[input.dataset.limit] = v;
      persist();
      render();
    });
  }
}

function wireTransactions() {
  const q = viewEl.querySelector('#f-q');
  const cat = viewEl.querySelector('#f-cat');
  const acc = viewEl.querySelector('#f-account');
  q.addEventListener('input', () => { state.filter.q = q.value.trim().toLowerCase(); rerenderLedgerOnly(); });
  cat.addEventListener('change', () => { state.filter.cat = cat.value; rerenderLedgerOnly(); });
  acc.addEventListener('change', () => { state.filter.account = acc.value; rerenderLedgerOnly(); });
  viewEl.querySelector('#add-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const fd = new FormData(ev.target);
    const amount = Number(fd.get('amount'));
    if (!amount || amount <= 0) return;
    state.txns.push({
      month: state.month, day: Number(fd.get('day')), payee: String(fd.get('payee')).trim(),
      cat: String(fd.get('cat')), kind: 'out', amount, account: 'Everyday checking',
      seq: state.seq++, added: true,
    });
    persist();
    render();
  });
}

// Re-render just the transactions page, keeping the search box focused.
function rerenderLedgerOnly() {
  const month = MONTHS[state.monthIdx];
  const active = document.activeElement?.id;
  viewEl.innerHTML = views.transactions(book(month.id), month.label, state.filter);
  wireTransactions();
  if (active === 'f-q') { const el = viewEl.querySelector('#f-q'); el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
}

// The goal simulator: slide a monthly pace and the finish line moves.
// November 2026 is the current month, so a goal n months out lands in
// the month n months after it.
function simLine(target, saved, pace) {
  const remaining = target - saved;
  if (remaining <= 0) return 'already fully funded 🎉';
  const months = Math.ceil(remaining / pace);
  const when = new Date(2026, 10 + months, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  return `${months} month${months === 1 ? '' : 's'} of saving — done by ${when}`;
}

function wireGoals() {
  for (const input of viewEl.querySelectorAll('input[data-sim]')) {
    const id = input.dataset.sim;
    const valEl = viewEl.querySelector(`[data-sim-val="${id}"]`);
    const outEl = viewEl.querySelector(`[data-sim-out="${id}"]`);
    const update = () => {
      const pace = Number(input.value);
      valEl.textContent = String(pace);
      outEl.textContent = simLine(Number(input.dataset.target), Number(input.dataset.saved), pace);
    };
    input.addEventListener('input', update);
    update();
  }
}

function wireBills() {
  for (const btn of viewEl.querySelectorAll('button[data-bill]')) {
    btn.addEventListener('click', () => {
      const id = btn.dataset.bill;
      state.billsPaid[id][state.month] = !state.billsPaid[id][state.month];
      persist();
      render();
    });
  }
}

document.getElementById('month-prev').addEventListener('click', () => { if (state.monthIdx > 0) { state.monthIdx--; render(); } });
document.getElementById('month-next').addEventListener('click', () => { if (state.monthIdx < MONTHS.length - 1) { state.monthIdx++; render(); } });
window.addEventListener('hashchange', render);
render();
