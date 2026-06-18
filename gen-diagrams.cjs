// SVG diagram generator for the Git Guide.
// Design rules:
//   - Plain lines (no arrowheads) connect commits in sequence
//   - Colored label boxes with a filled-triangle pointer show references
//   - Each diagram tracks maxY so notes are always placed below all content
const fs = require('fs');

const R    = 20;
const W    = 700;
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const MONO = "monospace";
const CHAIN = '#94a3b8';
const NOTE_PAD = 22; // gap between lowest element and note text
const BOT_PAD  = 22; // gap between note text and SVG bottom

// ── Commit type styles ───────────────────────────────────────────────────────
const TYPE = {
  normal: { fill: '#FFD700', stroke: '#DAA520', text: '#1e293b' },
  merge:  { fill: '#EF4444', stroke: '#B91C1C', text: 'white'   },
  rebase: { fill: '#9333EA', stroke: '#7E22CE', text: 'white'   },
  cherry: { fill: '#06B6D4', stroke: '#0891B2', text: 'white'   },
  revert: { fill: '#22C55E', stroke: '#16A34A', text: 'white'   },
  faded:  { fill: '#e2e8f0', stroke: '#94a3b8', text: '#94a3b8' },
};

// Label colors
const MAIN   = '#0066CC';
const FEAT   = '#22C55E';
const AUTH   = '#16A34A';
const SRCH   = '#7C3AED';
const HEAD   = '#DC2626';
const ORIG   = '#0891B2';

// ── Builder — accumulates elements and tracks max Y ─────────────────────────
function builder() {
  const parts = [];
  let maxY = 0;
  const track = (y) => { if (y > maxY) maxY = y; };

  function add(el, bottom) { parts.push(el); if (bottom != null) track(bottom); }

  function circ(cx, cy, label, type) {
    const { fill, stroke, text } = TYPE[type || 'normal'];
    add(
      `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>` +
      `\n<text x="${cx}" y="${cy}" font-family="${MONO}" font-size="12" font-weight="bold"` +
      ` text-anchor="middle" dominant-baseline="middle" fill="${text}">${label}</text>`,
      cy + R
    );
  }

  function seg(x1, y1, x2, y2, color, dash) {
    add(
      `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}"` +
      ` stroke="${color || CHAIN}" stroke-width="2"${dash ? ' stroke-dasharray="6,3"' : ''} fill="none"/>`,
      Math.max(y1, y2)
    );
  }

  // Straight line between edges of two commit circles
  function edge(x1, y1, x2, y2, color) {
    const dx = x2-x1, dy = y2-y1, d = Math.hypot(dx, dy);
    if (!d) return;
    const ux = dx/d, uy = dy/d;
    seg(x1+R*ux, y1+R*uy, x2-R*ux, y2-R*uy, color || CHAIN);
  }

  // Horizontal chain of commits: [[cx, cy, label, type?], ...]
  function chain(commits) {
    for (let i = 0; i < commits.length; i++) {
      const [cx, cy, label, type] = commits[i];
      if (i > 0) {
        const [px, py] = commits[i-1];
        if (Math.abs(py - cy) < 2) seg(px+R, py, cx-R, cy);
        else                       edge(px, py, cx, cy);
      }
      circ(cx, cy, label, type);
    }
  }

  // Reference label above a commit, arrow points down to it
  function ref(cx, cy, text, color, stack) {
    const bw = Math.max(text.length * 7.8 + 18, 46);
    const bh = 22;
    const bx = cx - bw / 2;
    const lineLen = 12 + (stack || 0) * 30;
    const by = cy - R - 10 - lineLen - bh;
    const y2 = cy - R - 10;
    const aw = 5;
    add(
      `<rect x="${f(bx)}" y="${f(by)}" width="${f(bw)}" height="${bh}" rx="4" fill="${color}"/>` +
      `\n<text x="${cx}" y="${f(by+15)}" font-family="${SANS}" font-size="12" font-weight="600"` +
      ` text-anchor="middle" fill="white">${text}</text>` +
      `\n<line x1="${cx}" y1="${f(by+bh)}" x2="${cx}" y2="${f(y2)}" stroke="${color}" stroke-width="1.5"/>` +
      `\n<polygon points="${cx-aw},${f(y2)} ${cx+aw},${f(y2)} ${cx},${f(cy-R+2)}" fill="${color}"/>`,
      cy + R   // bottom is the commit circle, not the label (label is above)
    );
    track(by); // also track the top of the label (could clip the SVG top)
  }

  // Reference label below a commit, arrow points up to it
  function refBelow(cx, cy, text, color) {
    const bw = Math.max(text.length * 7.8 + 18, 46);
    const bh = 22;
    const bx = cx - bw / 2;
    const gap = 10;
    const lineY1 = cy + R + gap;
    const by = lineY1 + 12;
    const aw = 5;
    add(
      `<rect x="${f(bx)}" y="${f(by)}" width="${f(bw)}" height="${bh}" rx="4" fill="${color}"/>` +
      `\n<text x="${cx}" y="${f(by+15)}" font-family="${SANS}" font-size="12" font-weight="600"` +
      ` text-anchor="middle" fill="white">${text}</text>` +
      `\n<line x1="${cx}" y1="${f(lineY1)}" x2="${cx}" y2="${f(by)}" stroke="${color}" stroke-width="1.5"/>` +
      `\n<polygon points="${cx-aw},${f(lineY1)} ${cx+aw},${f(lineY1)} ${cx},${f(cy+R-2)}" fill="${color}"/>`,
      by + bh
    );
  }

  function title(text) {
    add(`<text x="${W/2}" y="24" font-family="${SANS}" font-size="15" font-weight="bold"` +
        ` text-anchor="middle" fill="#1e293b">${text}</text>`, 36);
  }

  function secLabel(text, x, y) {
    add(`<text x="${x}" y="${y}" font-family="${SANS}" font-size="12" font-weight="600"` +
        ` fill="#94a3b8">${text}</text>`, y + 4);
  }

  function divider(y) {
    add(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="5,4"/>`, y);
  }

  function note(text, anchor) {
    // Placed dynamically below all content — call this LAST
    const ny = maxY + NOTE_PAD;
    const x  = anchor === 'start' ? 12 : W/2;
    add(`<text x="${x}" y="${f(ny)}" font-family="${SANS}" font-size="11" fill="#64748b"` +
        ` text-anchor="${anchor || 'middle'}">${text}</text>`,
        ny + 14);
  }

  function finalize() {
    const h = maxY + BOT_PAD;
    return `<svg viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg">\n${parts.join('\n')}\n</svg>\n`;
  }

  return { circ, seg, edge, chain, ref, refBelow, title, secLabel, divider, note, finalize, add, track };
}

const f = n => +n.toFixed(1);
// Make f available outside builder
global.f = f;

// ── Diagram definitions ──────────────────────────────────────────────────────

function linear_history() {
  const b = builder(), y = 100;
  b.title('Linear History');
  b.chain([[90,y,'C1'],[230,y,'C2'],[370,y,'C3'],[510,y,'C4']]);
  b.ref(510, y, 'main', MAIN);
  return b.finalize();
}

function branching() {
  const b = builder(), y = 130;
  b.title('Creating a Branch');
  b.chain([[90,y,'C1'],[240,y,'C2'],[390,y,'C3']]);
  b.ref(390, y, 'feature/new', FEAT, 0);
  b.ref(390, y, 'main', MAIN, 1);
  b.note('Both labels point to C3 — a branch is just a pointer to a commit');
  return b.finalize();
}

function merging_fastforward() {
  const b = builder();
  const xs = [65,175,285,395,505], lbls = ['C1','C2','C3','C4','C5'];
  const y1 = 100, y2 = 215;
  b.title('Merging (Fast-Forward)');
  b.secLabel('Before', 12, 50);
  // Before row
  b.chain(xs.map((x,i) => [x, y1, lbls[i]]));
  b.ref(xs[2], y1, 'main', MAIN);
  b.ref(xs[4], y1, 'feature', FEAT);
  b.divider(160);
  b.secLabel('After', 12, 178);
  // After row
  b.chain(xs.map((x,i) => [x, y2, lbls[i]]));
  b.ref(xs[4], y2, 'main', MAIN);
  b.ref(xs[4], y2, 'feature', FEAT, 1);
  b.note('main pointer moves forward to C5 — no new commit');
  return b.finalize();
}

function merging_with_commit() {
  const b = builder();
  const mainY = 80, brY = 185;
  const c1=75, c2=180, c3=285, c6=410, mx=555;
  const c4=325, c5=470;
  b.title('Merging (Non-Fast-Forward)');
  // Main chain
  b.seg(c1+R, mainY, c2-R, mainY);
  b.seg(c2+R, mainY, c3-R, mainY);
  b.seg(c3+R, mainY, c6-R, mainY);
  b.seg(c6+R, mainY, mx-R, mainY);
  // Feature branch
  b.edge(c3, mainY, c4, brY);
  b.seg(c4+R, brY, c5-R, brY);
  b.edge(c5, brY, mx, mainY);
  // Circles
  b.circ(c1, mainY, 'C1'); b.circ(c2, mainY, 'C2'); b.circ(c3, mainY, 'C3');
  b.circ(c6, mainY, 'C6'); b.circ(mx, mainY, 'M', 'merge');
  b.circ(c4, brY, 'C4');   b.circ(c5, brY, 'C5');
  // Labels
  b.ref(mx, mainY, 'main', MAIN);
  b.refBelow(c5, brY, 'feature', FEAT);
  b.note('M has two parents: C6 (main) and C5 (feature)');
  return b.finalize();
}

function rebasing() {
  const b = builder();
  const mY1=95, bY1=175, mY2=265, bY2=340;
  b.title('Rebasing');
  b.secLabel('Before', 12, 46);
  // Before — main
  b.chain([[65,mY1,'C1'],[180,mY1,'C2'],[290,mY1,'C3'],[405,mY1,'C6']]);
  b.ref(405, mY1, 'main', MAIN);
  // Before — feature branch
  b.edge(290, mY1, 325, bY1);
  b.seg(325+R, bY1, 440-R, bY1);
  b.circ(325, bY1, 'C4'); b.circ(440, bY1, 'C5');
  b.ref(440, bY1, 'feature', FEAT);
  b.divider(210);
  b.secLabel('After  (git rebase main)', 12, 230);
  // After — main (same)
  b.chain([[65,mY2,'C1'],[180,mY2,'C2'],[290,mY2,'C3'],[405,mY2,'C6']]);
  b.ref(405, mY2, 'main', MAIN);
  // After — faded old C4/C5
  b.edge(290, mY2, 325, bY2);
  b.seg(325+R, bY2, 440-R, bY2, CHAIN, true);
  b.circ(325, bY2, 'C4', 'faded'); b.circ(440, bY2, 'C5', 'faded');
  // After — replayed C4'/C5'
  b.seg(405+R, mY2, 505-R, mY2);
  b.seg(505+R, mY2, 605-R, mY2);
  b.circ(505, mY2, "C4'", 'rebase'); b.circ(605, mY2, "C5'", 'rebase');
  b.ref(605, mY2, 'feature', SRCH);
  b.note("C4' and C5' are new commits (different hashes); old C4/C5 become unreferenced");
  return b.finalize();
}

function rebase_fastforward_result() {
  const b = builder(), y = 100;
  b.title('After Rebase + Fast-Forward Merge');
  b.chain([
    [65,y,'C1'],[170,y,'C2'],[270,y,'C3'],
    [375,y,'C6'],[475,y,"C4'",'rebase'],[575,y,"C5'",'rebase'],
  ]);
  b.ref(575, y, 'main', MAIN, 1);
  b.ref(575, y, 'feature', SRCH, 0);
  b.note('Clean linear history — no merge commit needed');
  return b.finalize();
}

function cherry_pick() {
  const b = builder();
  const mainY = 85, brY = 195;
  b.title('Cherry-Pick');
  // Main chain
  b.chain([[65,mainY,'C1'],[180,mainY,'C2'],[295,mainY,'C3'],[430,mainY,"C4'",'cherry']]);
  b.ref(430, mainY, 'main', MAIN);
  // Feature branch
  b.edge(295, mainY, 325, brY);
  b.seg(325+R, brY, 445-R, brY);
  b.seg(445+R, brY, 565-R, brY);
  b.circ(325, brY, 'C4'); b.circ(445, brY, 'C5'); b.circ(565, brY, 'C6');
  b.refBelow(565, brY, 'feature', FEAT);
  // Dashed arrow showing C4 copied to C4'
  b.add(
    `<defs><marker id="cp-arrow" markerWidth="8" markerHeight="8" refX="7" refY="2.5" orient="auto">` +
    `<polygon points="0 0,8 2.5,0 5" fill="#06B6D4"/></marker></defs>` +
    `\n<path d="M 325 ${brY-R} C 325 ${(mainY+brY)/2} 430 ${(mainY+brY)/2} 430 ${mainY+R}"` +
    ` stroke="#06B6D4" stroke-width="1.5" stroke-dasharray="5,3" fill="none" marker-end="url(#cp-arrow)"/>`,
    mainY + R
  );
  b.note("C4 is copied as C4' onto main (same changes, new hash)");
  return b.finalize();
}

function detached_head() {
  const b = builder();
  const xs = [70,190,315,440], lbls = ['C1','C2','C3','C4'];
  const y1 = 105, y2 = 240;
  b.title('Detached HEAD');
  b.secLabel('Normal (HEAD tracks a branch)', 12, 48);
  // Normal
  b.chain(xs.map((x,i) => [x, y1, lbls[i]]));
  b.ref(xs[3], y1, 'main', MAIN, 0);
  b.ref(xs[3], y1, 'HEAD', HEAD, 1);
  b.add(`<text x="12" y="155" font-family="${SANS}" font-size="11" fill="#64748b">HEAD → main → C4</text>`, 159);
  b.divider(170);
  b.secLabel('Detached HEAD (HEAD points directly to a commit)', 12, 193);
  // Detached
  b.chain(xs.map((x,i) => [x, y2, lbls[i]]));
  b.ref(xs[3], y2, 'main', MAIN);
  b.ref(xs[2], y2, 'HEAD', HEAD);
  b.note('HEAD → C3  (not via a branch — new commits here will be orphaned)', 'start');
  return b.finalize();
}

function multiple_branches() {
  const b = builder();
  const mainY = 200, authY = 110, srchY = 295;
  b.title('Multiple Branches');
  // Main chain
  b.chain([[75,mainY,'C1'],[205,mainY,'C2'],[320,mainY,'C3']]);
  b.ref(320, mainY, 'main', MAIN);
  // Auth above
  b.edge(320, mainY, 390, authY);
  b.seg(390+R, authY, 510-R, authY);
  b.circ(390, authY, 'C4'); b.circ(510, authY, 'C5');
  b.ref(510, authY, 'feature/auth', AUTH);
  // Search below
  b.edge(320, mainY, 390, srchY);
  b.seg(390+R, srchY, 510-R, srchY);
  b.circ(390, srchY, 'C6'); b.circ(510, srchY, 'C7');
  b.refBelow(510, srchY, 'feature/search', SRCH);
  return b.finalize();
}

function merge_conflicts() {
  const b = builder();
  const mainY = 100, brY = 215;
  b.title('Merge Conflict');
  b.chain([[75,mainY,'C1'],[190,mainY,'C2'],[310,mainY,'C3'],[430,mainY,'C4']]);
  b.ref(430, mainY, 'main', MAIN);
  b.edge(190, mainY, 250, brY);
  b.seg(250+R, brY, 370-R, brY);
  b.circ(250, brY, 'C5'); b.circ(370, brY, 'C6');
  b.refBelow(370, brY, 'feature', FEAT);
  // Dashed arc and warning badge
  const midY = (mainY + brY) / 2;
  b.add(
    `<path d="M ${430} ${mainY+R} C ${430} ${midY} ${370} ${midY} ${370} ${brY-R}"` +
    ` stroke="#F59E0B" stroke-width="2" stroke-dasharray="5,3" fill="none"/>` +
    `\n<circle cx="${(430+370)/2}" cy="${midY}" r="15" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>` +
    `\n<text x="${(430+370)/2}" y="${midY+6}" font-family="${SANS}" font-size="17" font-weight="bold"` +
    ` text-anchor="middle" fill="#D97706">!</text>`,
    midY + 15
  );
  b.note('Both branches modified the same lines — resolve manually, then commit');
  return b.finalize();
}

function undoing_commits_reset() {
  const b = builder();
  const y1 = 100, y2 = 225;
  b.title('Undoing Commits (Reset)');
  b.secLabel('Before', 12, 48);
  b.chain([[75,y1,'C1'],[210,y1,'C2'],[345,y1,'C3'],[480,y1,'C4']]);
  b.ref(480, y1, 'main', MAIN);
  b.divider(162);
  b.secLabel('After  (git reset HEAD~2)', 12, 182);
  // After: C1-C2 referenced, C3-C4 faded and disconnected
  b.seg(75+R, y2, 210-R, y2);
  b.circ(75, y2, 'C1'); b.circ(210, y2, 'C2');
  b.ref(210, y2, 'main', MAIN);
  b.seg(210+R, y2, 345-R, y2, CHAIN, true);
  b.seg(345+R, y2, 480-R, y2, CHAIN, true);
  b.circ(345, y2, 'C3', 'faded'); b.circ(480, y2, 'C4', 'faded');
  b.note('C3 and C4 are unreferenced — still recoverable via git reflog');
  return b.finalize();
}

function reverting_commits() {
  const b = builder(), y = 95;
  b.title('Reverting Commits');
  b.chain([[65,y,'C1'],[185,y,'C2'],[305,y,'C3'],[425,y,'C4'],[555,y,'R','revert']]);
  b.ref(555, y, 'main', MAIN);
  b.note("R undoes C4's changes — C4 stays in history, R is a new normal commit");
  return b.finalize();
}

function amending_commits() {
  const b = builder();
  const y1 = 100, y2 = 230;
  b.title('Amending the Last Commit');
  b.secLabel('Before', 12, 48);
  b.chain([[75,y1,'C1'],[210,y1,'C2'],[345,y1,'C3'],[480,y1,'C4']]);
  b.ref(480, y1, 'main', MAIN);
  b.divider(162);
  b.secLabel('After  (git commit --amend)', 12, 182);
  // C3 connects to C4' (replaces C4); old C4 shown faded and detached
  b.seg(75+R, y2, 210-R, y2);
  b.seg(210+R, y2, 345-R, y2);
  b.seg(345+R, y2, 480-R, y2);
  b.circ(75, y2, 'C1'); b.circ(210, y2, 'C2'); b.circ(345, y2, 'C3');
  b.circ(480, y2, "C4'", 'rebase');
  b.ref(480, y2, 'main', MAIN);
  // Old C4 shown to the right, detached and faded
  b.circ(590, y2, 'C4', 'faded');
  b.add(`<text x="567" y="${y2+42}" font-family="${SANS}" font-size="10" fill="#94a3b8" text-anchor="middle">(old C4)</text>`, y2+46);
  b.note("C4' has a new hash; old C4 becomes unreferenced (recoverable via reflog)");
  return b.finalize();
}

function push_and_fetch() {
  const b = builder();
  const xs = [65,175,285,395], lbls = ['C1','C2','C3','C4'];
  const lY = 95, rY = 230;
  b.title('Push and Fetch');
  b.secLabel('Local repository', 12, 48);
  // Local: 4 commits; main→C4, origin/main→C3 (tracking)
  b.chain(xs.map((x,i) => [x, lY, lbls[i]]));
  b.ref(xs[3], lY, 'main', MAIN, 1);
  b.ref(xs[2], lY, 'origin/main', ORIG, 0);
  b.divider(162);
  b.secLabel('Remote repository (origin)', 12, 182);
  // Remote: 3 commits before push; C4 added via push
  b.chain(xs.slice(0,3).map((x,i) => [x, rY, lbls[i]]));
  b.seg(xs[2]+R, rY, xs[3]-R, rY, CHAIN, true);
  b.circ(xs[3], rY, 'C4');
  b.ref(xs[3], rY, 'main', ORIG);
  // Push arrow
  const midY = (lY + rY) / 2;
  b.add(
    `<defs><marker id="push-arr" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto">` +
    `<polygon points="0 0,9 3,0 6" fill="${ORIG}"/></marker></defs>` +
    `\n<path d="M ${xs[3]} ${lY+R+4} L ${xs[3]} ${rY-R-4}"` +
    ` stroke="${ORIG}" stroke-width="1.5" stroke-dasharray="5,3" fill="none" marker-end="url(#push-arr)"/>` +
    `\n<text x="${xs[3]+8}" y="${midY}" font-family="${SANS}" font-size="11" fill="${ORIG}">git push</text>`,
    midY + 6
  );
  b.note('After push: remote gains C4 and its main pointer advances');
  return b.finalize();
}

function team_workflow() {
  const b = builder();
  const mY=175, authY=85, srchY=270;
  const c1=65, c2=180, m1=420, m2=605;
  const c4=225, c5=350;
  const c6=465, c7=555;
  b.title('Team Workflow');
  // Main chain
  b.seg(c1+R, mY, c2-R, mY);
  b.seg(c2+R, mY, m1-R, mY);
  b.seg(m1+R, mY, m2-R, mY);
  // Auth: C2 → C4—C5 → M1
  b.edge(c2, mY, c4, authY);
  b.seg(c4+R, authY, c5-R, authY);
  b.edge(c5, authY, m1, mY);
  // Search: M1 → C6—C7 → M2
  b.edge(m1, mY, c6, srchY);
  b.seg(c6+R, srchY, c7-R, srchY);
  b.edge(c7, srchY, m2, mY);
  // Circles
  b.circ(c1, mY, 'C1'); b.circ(c2, mY, 'C2');
  b.circ(c4, authY, 'C4'); b.circ(c5, authY, 'C5');
  b.circ(m1, mY, 'M1', 'merge');
  b.circ(c6, srchY, 'C6'); b.circ(c7, srchY, 'C7');
  b.circ(m2, mY, 'M2', 'merge');
  // Labels
  b.ref(m2, mY, 'main', MAIN);
  b.ref(c5, authY, 'feature/auth', AUTH);
  b.refBelow(c7, srchY, 'feature/search', SRCH);
  // Role annotations
  b.add(`<text x="${c4-5}" y="${authY-R-12}" font-family="${SANS}" font-size="11" fill="${AUTH}">Alice</text>`, authY-R-8);
  b.add(`<text x="${c6-5}" y="${srchY+R+30}" font-family="${SANS}" font-size="11" fill="${SRCH}">Bob</text>`, srchY+R+34);
  b.note('Alice: branch from C2, merge as M1 — Bob: branch from M1, merge as M2');
  return b.finalize();
}

function initial_repository() {
  const b = builder();
  b.title('Initial Repository (After First Commit)');
  const cx = W/2, cy = 130;
  b.circ(cx, cy, 'C1');
  b.ref(cx, cy, 'main', MAIN, 0);
  b.ref(cx, cy, 'HEAD', HEAD, 1);
  b.note('HEAD → main → C1 (HEAD tracks the current branch; both point to the first commit)');
  return b.finalize();
}

function visual_patterns() {
  const b = builder();
  b.title('Visual Patterns at a Glance');

  // Inline branch label to the right of a commit — no box, no arrow
  const lbl = (cx, cy, text, color) =>
    b.add(`<text x="${f(cx+R+8)}" y="${f(cy+4)}" font-family="${SANS}" font-size="12"` +
          ` font-weight="700" text-anchor="start" fill="${color}">${text}</text>`, cy + 8);

  // ── 1: Linear History ──────────────────────────────────────────────────────
  b.secLabel('Linear History', 12, 52);
  b.chain([[85,95,'C1'],[200,95,'C2'],[315,95,'C3'],[430,95,'C4']]);
  lbl(430, 95, 'main', MAIN);

  b.divider(143);

  // ── 2: Branching ───────────────────────────────────────────────────────────
  b.secLabel('Branching', 12, 163);
  // Draw edges/lines before circles so circles cover the endpoints
  b.edge(195, 255, 285, 205);
  b.seg(285+R, 205, 415-R, 205);
  b.circ(285, 205, 'C3'); b.circ(415, 205, 'C4');
  lbl(415, 205, 'feature', FEAT);
  b.seg(85+R, 255, 195-R, 255);
  b.circ(85, 255, 'C1'); b.circ(195, 255, 'C2');
  lbl(195, 255, 'main', MAIN);

  b.divider(302);

  // ── 3: Merging (Non-Fast-Forward) ──────────────────────────────────────────
  b.secLabel('Merging (Non-Fast-Forward)', 12, 322);
  b.edge(185, 415, 270, 370);
  b.seg(270+R, 370, 375-R, 370);
  b.edge(375, 370, 430, 415);
  b.circ(270, 370, 'C3'); b.circ(375, 370, 'C4');
  lbl(375, 370, 'feature', FEAT);
  b.seg(85+R, 415, 185-R, 415);
  b.seg(185+R, 415, 430-R, 415);
  b.circ(85, 415, 'C1'); b.circ(185, 415, 'C2');
  b.circ(430, 415, 'M', 'merge');
  lbl(430, 415, 'main', MAIN);

  b.divider(463);

  // ── 4: Rebasing ────────────────────────────────────────────────────────────
  b.secLabel('Rebasing', 12, 483);
  b.chain([
    [85,530,'C1'],[200,530,'C2'],
    [315,530,"C3'",'rebase'],[430,530,"C4'",'rebase'],
  ]);
  // Small downward tick from C2 to indicate 'main' stops here
  b.add(
    `<line x1="200" y1="${530+R+3}" x2="200" y2="${530+R+16}" stroke="${MAIN}" stroke-width="1.5"/>` +
    `\n<text x="200" y="${530+R+28}" font-family="${SANS}" font-size="12" font-weight="700"` +
    ` text-anchor="middle" fill="${MAIN}">main</text>`,
    530+R+32
  );
  lbl(430, 530, 'feature', SRCH);

  b.note('These 4 shapes appear in every Git workflow');
  return b.finalize();
}

// ── Write all files ──────────────────────────────────────────────────────────
const diagrams = {
  'initial-repository':       initial_repository,
  'linear-history':           linear_history,
  'branching':                branching,
  'merging-fastforward':      merging_fastforward,
  'merging-with-commit':      merging_with_commit,
  'rebasing':                 rebasing,
  'rebase-fastforward-result':rebase_fastforward_result,
  'cherry-pick':              cherry_pick,
  'detached-head':            detached_head,
  'multiple-branches':        multiple_branches,
  'merge-conflicts':          merge_conflicts,
  'undoing-commits-reset':    undoing_commits_reset,
  'reverting-commits':        reverting_commits,
  'amending-commits':         amending_commits,
  'push-and-fetch':           push_and_fetch,
  'team-workflow':            team_workflow,
  'visual-patterns':          visual_patterns,
};

Object.entries(diagrams).forEach(([name, fn]) => {
  fs.writeFileSync(`public/diagrams/${name}.svg`, fn());
});
console.log(`Wrote ${Object.keys(diagrams).length} SVGs.`);
