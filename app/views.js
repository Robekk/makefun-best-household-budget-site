// Tally House — the pages.
//
// Every view is drawn from the same computed book (see book() in main.js):
// totals are summed from the ledger at render time, so a change made on
// any page — a budget line edited, a bill marked paid, a transaction
// added — shows up everywhere at once.

import { CATEGORIES, GOALS, HOUSEHOLD, RULE_503020 } from './data.js';

export const money = (n, cents = false) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
export const money2 = (n) => money(n, true);
export const catOf = (id) => CATEGORIES.find((c) => c.id === id);
export const pct = (part, whole) => (whole <= 0 ? 0 : Math.round((part / whole) * 100));

const bar = (value, max, color, h = 10) => {
  const w = Math.min(100, max <= 0 ? 0 : (value / max) * 100);
  return `<div class="bar" style="height:${h}px"><span style="width:${w}%;background:${color}"></span></div>`;
};

// ————————————————— Overview —————————————————
export function overview(book, monthLabel) {
  const { income, spent, saved, byCat, txns } = book;
  const left = income - spent - saved;
  const rate = pct(saved + Math.max(0, left), income);
  const topCats = CATEGORIES.map((c) => ({ c, spent: byCat[c.id] || 0 }))
    .filter((x) => x.spent > 0).sort((a, b) => b.spent - a.spent).slice(0, 6);
  const weeks = [0, 0, 0, 0, 0];
  for (const t of txns) if (t.kind === 'out') weeks[Math.min(4, Math.floor((t.day - 1) / 7))] += t.amount;
  const maxWeek = Math.max(...weeks, 1);
  const recent = [...txns].sort((a, b) => b.day - a.day).slice(0, 6);
  const due = book.bills.filter((b) => !b.paid);
  const dueTotal = due.reduce((s, b) => s + b.amount, 0);
  const biggest = topCats[0];
  const sumCats = (ids) => ids.reduce((s, id) => s + (byCat[id] || 0), 0);
  const needs = sumCats(RULE_503020.needs);
  const wants = sumCats(RULE_503020.wants);
  const kept = saved + Math.max(0, left);
  const ruleRows = [
    { name: 'Needs', amt: needs, target: 50, color: '#1d4d33', verdict: pct(needs, income) <= 50 ? 'inside the line' : 'over the line' },
    { name: 'Wants', amt: wants, target: 30, color: '#e0a458', verdict: pct(wants, income) <= 30 ? 'inside the line' : 'over the line' },
    { name: 'Kept', amt: kept, target: 20, color: '#2e7d5b', verdict: pct(kept, income) >= 20 ? 'ahead of the line' : 'behind the line' },
  ];

  const weekBars = weeks.map((w, i) =>
    `<div class="wk"><div class="wk-bar" style="height:${Math.round((w / maxWeek) * 84)}px" title="${money(w)}"></div><span>W${i + 1}</span><strong>${money(w)}</strong></div>`).join('');

  return `
  <section class="hero">
    <h1>${monthLabel} at the Hales’</h1>
    <p class="lede">${HOUSEHOLD.people}. One book for the money that comes in, the money that goes
    out, and the money being kept on purpose. ${biggest ? `The biggest pot this month is
    <strong>${biggest.c.name.toLowerCase()}</strong> at ${money(biggest.spent)}.` : ''}</p>
  </section>

  <section class="stat-grid">
    <div class="stat"><span class="stat-label">Money in</span><strong>${money(income)}</strong><small>Two salaries + June’s freelance invoice</small></div>
    <div class="stat"><span class="stat-label">Money out</span><strong>${money(spent)}</strong><small>Across ${CATEGORIES.length} budget pots</small></div>
    <div class="stat"><span class="stat-label">Put into goals</span><strong>${money(saved)}</strong><small>${GOALS.length} savings goals funded</small></div>
    <div class="stat ${left < 0 ? 'stat-warn' : ''}"><span class="stat-label">Left unspent</span><strong>${money(left)}</strong><small>${left >= 0 ? 'Breathing room at month’s end' : 'Over the line — see the budget page'}</small></div>
  </section>

  <section class="card">
    <div class="card-head"><h2>The 50/30/20 check</h2><a href="#/reports">More reports →</a></div>
    <div class="rule-bar">${ruleRows.map((r) => `<span style="width:${pct(r.amt, income)}%;background:${r.color}" title="${r.name} ${money(r.amt)}"></span>`).join('')}</div>
    <div class="rule-nums">
      ${ruleRows.map((r) => `<span class="rule-item"><span class="dot" style="background:${r.color}"></span>${r.name} <strong>${pct(r.amt, income)}%</strong> <small>of money in · aim ${r.target}% · ${r.verdict}</small></span>`).join('')}
    </div>
    <p class="card-note">The old rule of thumb — half of income on needs, a third or less on wants,
    a fifth kept — measured against this month's real ledger, not a guess.</p>
  </section>

  <div class="cols">
    <section class="card">
      <div class="card-head"><h2>Where the money goes</h2><a href="#/budget">Open the budget →</a></div>
      ${topCats.map(({ c, spent: s }) => {
        const lim = book.limits[c.id];
        const over = s > lim;
        return `<div class="cat-row">
          <span class="dot" style="background:${c.color}"></span>
          <span class="cat-name">${c.name}</span>
          <span class="cat-amt">${money(s)} <small>of ${money(lim)}</small></span>
          ${bar(s, lim, over ? '#b3382e' : c.color)}
          <span class="cat-pct ${over ? 'over' : ''}">${pct(s, lim)}%</span>
        </div>`;
      }).join('')}
      <p class="card-note">Savings rate so far: <strong>${rate}%</strong> of money in is being kept
      (goal transfers plus what is left unspent).</p>
    </section>

    <section class="card">
      <div class="card-head"><h2>Spending by week</h2><a href="#/transactions">See the ledger →</a></div>
      <div class="weeks">${weekBars}</div>
      <p class="card-note">Week 1 always carries the rent, which is why it towers over the rest.</p>
      <h3 class="mini-head">Still to pay this month</h3>
      ${due.length ? due.map((b) => `<div class="due-row"><span>${b.name}</span><span class="due-when">due the ${b.dueDay}th</span><strong>${money(b.amount)}</strong></div>`).join('')
        : '<p class="card-note">Every bill for this month is paid. 🎉</p>'}
      ${due.length ? `<p class="card-note">${money(dueTotal)} still to go out. Once it does, the month ends about <strong>${money(left - dueTotal)}</strong> unspent — the plan is on the <a href="#/bills">Bills page</a>.</p>` : ''}
    </section>
  </div>

  <section class="card">
    <div class="card-head"><h2>Latest in the ledger</h2><a href="#/transactions">All transactions →</a></div>
    <table class="ledger">
      <tbody>
      ${recent.map((t) => rowHtml(t)).join('')}
      </tbody>
    </table>
  </section>

  <section class="card">
    <div class="card-head"><h2>Savings goals</h2><a href="#/goals">All goals →</a></div>
    <div class="goal-strip">
    ${GOALS.map((g) => `<div class="goal-mini">
        <span class="goal-name">${g.name}</span>
        <strong>${money(g.saved)} <small>of ${money(g.target)}</small></strong>
        ${bar(g.saved, g.target, g.color)}
        <span class="goal-pct">${pct(g.saved, g.target)}% there</span>
      </div>`).join('')}
    </div>
  </section>`;
}

export const rowHtml = (t) => {
  const isIn = t.kind === 'in';
  const isSave = t.kind === 'save';
  const label = isSave ? 'To a goal' : isIn ? 'Money in' : (catOf(t.cat)?.name ?? t.cat);
  const color = isSave ? '#1d4d33' : isIn ? '#2e7d5b' : (catOf(t.cat)?.color ?? '#777');
  return `<tr>
    <td class="d">${t.day}</td>
    <td class="payee">${t.payee}<small>${label} · ${t.account}</small></td>
    <td class="amt ${isIn ? 'in' : ''}">${isIn ? '+' : isSave ? '→' : '−'} ${money2(Math.abs(t.amount))}</td>
  </tr>`;
};

// ————————————————— Budget —————————————————
export function budget(book, monthLabel) {
  const rows = CATEGORIES.map((c) => {
    const s = book.byCat[c.id] || 0;
    const lim = book.limits[c.id];
    const leftAmt = lim - s;
    return `<div class="budget-row ${leftAmt < 0 ? 'is-over' : ''}">
      <div class="budget-top">
        <span class="dot" style="background:${c.color}"></span>
        <div class="budget-name"><strong>${c.name}</strong><small>${c.note}</small></div>
        <label class="limit-edit">Limit $<input type="number" min="0" step="10" value="${lim}" data-limit="${c.id}" inputmode="numeric"></label>
      </div>
      ${bar(s, Math.max(lim, s), leftAmt < 0 ? '#b3382e' : c.color, 12)}
      <div class="budget-nums"><span>Spent <strong>${money(s)}</strong></span>
      <span>${leftAmt >= 0 ? `${money(leftAmt)} left` : `${money(-leftAmt)} over`}</span>
      <span>${pct(s, lim)}% used</span></div>
    </div>`;
  }).join('');
  const totalLimit = CATEGORIES.reduce((s, c) => s + book.limits[c.id], 0);
  return `
  <section class="hero"><h1>The ${monthLabel.split(' ')[0]} budget</h1>
  <p class="lede">Twelve pots, one per kind of spending. The limits are the household’s own —
  type a new figure into any pot and the whole book rebalances: the overview, the reports
  and this page’s totals all move together.</p></section>
  <section class="card">
    <div class="budget-rows">${rows}</div>
    <div class="budget-total">
      <span>Total limits <strong>${money(totalLimit)}</strong></span>
      <span>Spent <strong>${money(book.spent)}</strong></span>
      <span>Money in <strong>${money(book.income)}</strong></span>
      <span>Planned to keep <strong>${money(totalLimit >= 0 ? Math.max(0, book.income - totalLimit) : 0)}</strong> before goal transfers</span>
    </div>
  </section>`;
}

// ————————————————— Transactions —————————————————
export function transactions(book, monthLabel, filter) {
  const cats = ['all', ...CATEGORIES.map((c) => c.id), 'income'];
  const list = book.txns.filter((t) =>
    (filter.cat === 'all' || t.cat === filter.cat || (filter.cat === 'income' && t.kind === 'in')) &&
    (filter.account === 'all' || t.account === filter.account) &&
    (filter.q === '' || t.payee.toLowerCase().includes(filter.q)));
  const outSum = list.filter((t) => t.kind === 'out').reduce((s, t) => s + t.amount, 0);
  const inSum = list.filter((t) => t.kind === 'in').reduce((s, t) => s + t.amount, 0);
  return `
  <section class="hero"><h1>The ledger — ${monthLabel}</h1>
  <p class="lede">Every dollar in and out, newest first. Search it, narrow it by pot or account,
  or add the receipt sitting on the counter — the totals everywhere else update themselves.</p></section>

  <section class="card">
    <form id="add-form" class="add-form">
      <input name="payee" required maxlength="60" placeholder="Payee — e.g. Greenbasket Market" aria-label="Payee">
      <select name="cat" aria-label="Category">${CATEGORIES.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}</select>
      <input name="amount" required type="number" min="0.01" step="0.01" placeholder="0.00" aria-label="Amount">
      <select name="day" aria-label="Day of month">${Array.from({ length: 30 }, (_, i) => `<option value="${i + 1}" ${i + 1 === 26 ? 'selected' : ''}>${i + 1}</option>`).join('')}</select>
      <button type="submit">Add to ledger</button>
    </form>
    <div class="toolbar">
      <input id="f-q" type="search" placeholder="Search payees…" value="${filter.q.replace(/"/g, '&quot;')}" aria-label="Search payees">
      <select id="f-cat" aria-label="Filter by category">${cats.map((id) => `<option value="${id}" ${filter.cat === id ? 'selected' : ''}>${id === 'all' ? 'All pots' : id === 'income' ? 'Money in' : catOf(id).name}</option>`).join('')}</select>
      <select id="f-account" aria-label="Filter by account">${['all', ...book.accounts].map((a) => `<option value="${a}" ${filter.account === a ? 'selected' : ''}>${a === 'all' ? 'All accounts' : a}</option>`).join('')}</select>
      <span class="count">${list.length} entries · out ${money(outSum)} · in ${money(inSum)}</span>
    </div>
    <table class="ledger"><tbody>
      ${list.length ? [...list].sort((a, b) => b.day - a.day || b.seq - a.seq).map(rowHtml).join('') : '<tr><td class="empty">Nothing matches — try a different search.</td></tr>'}
    </tbody></table>
  </section>`;
}

// ————————————————— Bills —————————————————
export function bills(book, monthLabel) {
  const paid = book.bills.filter((b) => b.paid);
  const due = book.bills.filter((b) => !b.paid);
  const paidSum = paid.reduce((s, b) => s + b.amount, 0);
  const dueSum = due.reduce((s, b) => s + b.amount, 0);
  const row = (b) => `<div class="bill-row ${b.paid ? 'is-paid' : ''}">
      <span class="dot" style="background:${catOf(b.cat)?.color ?? '#777'}"></span>
      <div class="bill-name"><strong>${b.name}</strong><small>${catOf(b.cat)?.name} · due the ${b.dueDay}th · ${b.autopay ? 'autopay' : 'paid by hand'}</small></div>
      <strong class="bill-amt">${money(b.amount)}</strong>
      <button type="button" class="bill-toggle" data-bill="${b.id}">${b.paid ? 'Paid ✓' : 'Mark paid'}</button>
    </div>`;
  return `
  <section class="hero"><h1>Bills — ${monthLabel}</h1>
  <p class="lede">The fixed costs, in due-date order. Mark one paid and it stays paid —
  the overview’s “still to pay” list and this page’s totals follow along.</p></section>
  <section class="stat-grid">
    <div class="stat"><span class="stat-label">Paid so far</span><strong>${money(paidSum)}</strong><small>${paid.length} of ${book.bills.length} bills settled</small></div>
    <div class="stat"><span class="stat-label">Still due</span><strong>${money(dueSum)}</strong><small>${due.length ? due.map((b) => `${b.name.split('—')[0].trim()} on the ${b.dueDay}th`).join(' · ') : 'Nothing outstanding'}</small></div>
    <div class="stat"><span class="stat-label">Month ends at</span><strong>${money(book.income - book.spent - book.saved - dueSum)}</strong><small>Unspent once every open bill has gone out</small></div>
    <div class="stat"><span class="stat-label">On autopay</span><strong>${book.bills.filter((b) => b.autopay).length} of ${book.bills.length}</strong><small>Only water and school meals are paid by hand</small></div>
  </section>
  <section class="card"><div class="bill-rows">
    ${[...book.bills].sort((a, b) => a.dueDay - b.dueDay).map(row).join('')}
  </div>
  <p class="card-note">Autopay bills leave the Everyday checking account on their due day;
  the two paid by hand — water and school meals — are the ones worth a calendar note.</p></section>`;
}

// ————————————————— Goals —————————————————
export function goals(book) {
  const cards = GOALS.map((g) => {
    const inThisMonth = book.txns.filter((t) => t.kind === 'save' && t.cat === 'goal:' + g.id).reduce((s, t) => s + t.amount, 0);
    const remaining = g.target - g.saved;
    const months = g.monthly > 0 ? Math.ceil(remaining / g.monthly) : null;
    const eta = months === null ? 'Funded from freelance invoices as they land'
      : months <= 0 ? 'Fully funded 🎉'
      : `On pace for ${new Date(2026, 10 + months, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} at ${money(g.monthly)}/month`;
    return `<article class="goal-card">
      <div class="goal-head"><h2>${g.name}</h2><span class="goal-pct-big" style="color:${g.color}">${pct(g.saved, g.target)}%</span></div>
      <p class="goal-why">${g.why}</p>
      ${bar(g.saved, g.target, g.color, 14)}
      <div class="goal-nums"><span><strong>${money(g.saved)}</strong> saved</span><span><strong>${money(remaining)}</strong> to go</span><span>Target <strong>${money(g.target)}</strong></span></div>
      <p class="goal-eta">${eta}${inThisMonth ? ` · ${money(inThisMonth)} added this month` : ''}</p>
      <div class="sim">
        <label for="sim-${g.id}">Try a different pace — <strong>$<span data-sim-val="${g.id}">${g.monthly || 100}</span>/month</strong></label>
        <input id="sim-${g.id}" type="range" min="25" max="1000" step="25" value="${g.monthly || 100}"
          data-sim="${g.id}" data-target="${g.target}" data-saved="${g.saved}">
        <p class="sim-out">At that pace: <strong data-sim-out="${g.id}"></strong></p>
      </div>
    </article>`;
  }).join('');
  return `
  <section class="hero"><h1>Savings goals</h1>
  <p class="lede">Money kept on purpose, in four pots. Transfers land from the ledger —
  this month’s are listed on each card — and the finish lines move closer every payday.</p></section>
  <section class="goal-grid">${cards}</section>`;
}

// ————————————————— Reports —————————————————
export function reports(book, monthLabel, history) {
  // Donut of this month's spending by pot (top 6 + Other).
  const entries = CATEGORIES.map((c) => ({ c, s: book.byCat[c.id] || 0 })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  const top = entries.slice(0, 6);
  const other = entries.slice(6).reduce((s, x) => s + x.s, 0);
  const slices = [...top.map((x) => ({ name: x.c.name, s: x.s, color: x.c.color })), ...(other > 0 ? [{ name: 'Other pots', s: other, color: '#cbbf9f' }] : [])];
  const R = 84, CIRC = 2 * Math.PI * R;
  let acc = 0;
  const arcs = slices.map((x) => {
    const frac = x.s / book.spent;
    const seg = `<circle r="${R}" cx="110" cy="110" fill="none" stroke="${x.color}" stroke-width="34"
      stroke-dasharray="${Math.max(0, frac * CIRC - 3)} ${CIRC}" stroke-dashoffset="${-acc * CIRC}" transform="rotate(-90 110 110)"/>`;
    acc += frac;
    return seg;
  }).join('');
  const legend = slices.map((x) => `<div class="legend-row"><span class="dot" style="background:${x.color}"></span><span>${x.name}</span><strong>${money(x.s)}</strong><span class="cat-pct">${pct(x.s, book.spent)}%</span></div>`).join('');

  // Three-month trend: grouped bars for in / out / kept.
  const maxV = Math.max(...history.flatMap((h) => [h.income, h.spent, h.saved]), 1);
  const trend = history.map((h) => `<div class="trend-col">
      <div class="trend-bars">
        <span style="height:${Math.round((h.income / maxV) * 120)}px;background:#2e7d5b" title="In ${money(h.income)}"></span>
        <span style="height:${Math.round((h.spent / maxV) * 120)}px;background:#e07a5f" title="Out ${money(h.spent)}"></span>
        <span style="height:${Math.round((h.saved / maxV) * 120)}px;background:#1d4d33" title="Kept ${money(h.saved)}"></span>
      </div><strong>${h.short}</strong><small>in ${money(h.income)} · out ${money(h.spent)} · kept ${money(h.saved + Math.max(0, h.income - h.spent - h.saved))}</small>
    </div>`).join('');

  // Top payees this month.
  const byPayee = {};
  for (const t of book.txns) if (t.kind === 'out') byPayee[t.payee] = (byPayee[t.payee] || 0) + t.amount;
  const topPayees = Object.entries(byPayee).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const closest = CATEGORIES.map((c) => ({ c, r: (book.byCat[c.id] || 0) / book.limits[c.id] })).sort((a, b) => b.r - a.r)[0];
  const single = [...book.txns].filter((t) => t.kind === 'out').sort((a, b) => b.amount - a.amount)[0];

  return `
  <section class="hero"><h1>Reports — ${monthLabel}</h1>
  <p class="lede">The month in pictures, drawn from the same ledger as everything else.</p></section>
  <div class="cols">
    <section class="card">
      <div class="card-head"><h2>Spending by pot</h2></div>
      <div class="donut-wrap">
        <svg viewBox="0 0 220 220" class="donut" role="img" aria-label="Spending by category donut chart">${arcs}
          <text x="110" y="104" text-anchor="middle" class="donut-total">${money(book.spent)}</text>
          <text x="110" y="126" text-anchor="middle" class="donut-sub">spent in ${monthLabel.split(' ')[0]}</text>
        </svg>
        <div class="legend">${legend}</div>
      </div>
    </section>
    <section class="card">
      <div class="card-head"><h2>Three months side by side</h2></div>
      <div class="trend">${trend}</div>
      <p class="card-note"><span class="dot" style="background:#2e7d5b"></span> money in ·
      <span class="dot" style="background:#e07a5f"></span> money out ·
      <span class="dot" style="background:#1d4d33"></span> put into goals. “Kept” adds what was
      left unspent on top of goal transfers.</p>
    </section>
  </div>
  <div class="cols">
    <section class="card">
      <div class="card-head"><h2>Where it went — top payees</h2></div>
      ${topPayees.map(([name, amt], i) => `<div class="due-row"><span>${i + 1}. ${name}</span><strong>${money(amt)}</strong></div>`).join('')}
    </section>
    <section class="card">
      <div class="card-head"><h2>Worth knowing</h2></div>
      <ul class="insights">
        <li><strong>${closest.c.name}</strong> is the tightest pot: ${money(book.byCat[closest.c.id] || 0)} of its ${money(book.limits[closest.c.id])} limit (${pct(book.byCat[closest.c.id] || 0, book.limits[closest.c.id])}%).</li>
        <li>The single biggest purchase was <strong>${single.payee}</strong> at ${money(single.amount)} on the ${single.day}th.</li>
        <li>Groceries run about <strong>${money(Math.round((book.byCat.groceries || 0) / 4))} a week</strong> at the current pace.</li>
        <li>${book.bills.filter((b) => !b.paid).length} bills are still open this month, worth ${money(book.bills.filter((b) => !b.paid).reduce((s, b) => s + b.amount, 0))}.</li>
      </ul>
    </section>
  </div>`;
}
