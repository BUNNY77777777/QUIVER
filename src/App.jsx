import React, { useState, useEffect, useRef, useCallback } from "react";

// ── Fonts ──────────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
  `}</style>
);

// ── CSS ────────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --black: #0a0900;
      --black2: #111009;
      --black3: #1a1800;
      --yellow: #f5c400;
      --yellow-dim: #c49b00;
      --yellow-glow: rgba(245,196,0,0.18);
      --yellow-faint: rgba(245,196,0,0.07);
      --white: #fdf8e8;
      --grey: #444030;
      --grey2: #2a2810;
      --text: #e8dfa0;
      --text-dim: #8a7e50;
      --red: #ff4444;
      --green: #44ff88;
      --radius: 12px;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--black);
      color: var(--text);
      font-family: 'Syne', sans-serif;
      overflow-x: hidden;
      cursor: none;
    }

    /* Custom cursor */
    .cursor-dot {
      position: fixed; top: 0; left: 0;
      width: 8px; height: 8px;
      background: var(--yellow);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: transform 0.1s, background 0.2s;
    }
    .cursor-ring {
      position: fixed; top: 0; left: 0;
      width: 36px; height: 36px;
      border: 1.5px solid var(--yellow);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99998;
      transform: translate(-50%, -50%);
      transition: transform 0.12s ease, width 0.2s, height 0.2s, opacity 0.2s, border-color 0.2s;
      opacity: 0.5;
    }
    .cursor-ring.hovering {
      width: 56px; height: 56px;
      opacity: 1;
      border-color: var(--yellow);
      background: var(--yellow-glow);
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--black2); }
    ::-webkit-scrollbar-thumb { background: var(--yellow-dim); border-radius: 3px; }

    /* Grain overlay */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 9997; opacity: 0.4;
    }

    /* Keyframes */
    @keyframes fadeUp {
      from { opacity:0; transform: translateY(28px); }
      to   { opacity:1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity:0; } to { opacity:1; }
    }
    @keyframes pulseGlow {
      0%,100% { box-shadow: 0 0 20px var(--yellow-glow); }
      50%      { box-shadow: 0 0 50px rgba(245,196,0,0.35); }
    }
    @keyframes slideRight {
      from { width:0; } to { width:100%; }
    }
    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes ripple {
      0%   { transform: scale(0); opacity:0.6; }
      100% { transform: scale(4); opacity:0; }
    }
    @keyframes bounce {
      0%,100% { transform: translateY(0); }
      50%     { transform: translateY(-6px); }
    }
    @keyframes scanLine {
      0%   { top: -2px; }
      100% { top: 100%; }
    }
    @keyframes ticker {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes countUp {
      from { opacity:0; transform:scale(0.5); }
      to   { opacity:1; transform:scale(1); }
    }
    @keyframes wrongShake {
      0%,100% { transform:translateX(0); }
      20%,60% { transform:translateX(-8px); }
      40%,80% { transform:translateX(8px); }
    }
    @keyframes correctPop {
      0%   { transform:scale(1); }
      50%  { transform:scale(1.05); }
      100% { transform:scale(1); }
    }
    @keyframes progressFill {
      from { width: 0; }
    }
    @keyframes float {
      0%,100% { transform: translateY(0) rotate(-1deg); }
      50%     { transform: translateY(-12px) rotate(1deg); }
    }
    @keyframes orbFloat1 {
      0%,100% { transform:translate(0,0); }
      50%     { transform:translate(30px,-40px); }
    }
    @keyframes orbFloat2 {
      0%,100% { transform:translate(0,0); }
      50%     { transform:translate(-20px,30px); }
    }

    /* Btn */
    .btn {
      font-family:'Syne',sans-serif; font-weight:700; font-size:14px;
      letter-spacing:0.08em; text-transform:uppercase;
      border:none; cursor:none; position:relative; overflow:hidden;
      transition: transform 0.15s, box-shadow 0.15s;
      display:inline-flex; align-items:center; justify-content:center; gap:8px;
      padding:14px 28px; border-radius:var(--radius);
    }
    .btn:active { transform:scale(0.97)!important; }
    .btn-primary {
      background:var(--yellow); color:var(--black);
      box-shadow: 0 0 0 0 var(--yellow-glow);
    }
    .btn-primary:hover {
      transform:translateY(-2px);
      box-shadow: 0 8px 30px rgba(245,196,0,0.4);
      animation: pulseGlow 2s infinite;
    }
    .btn-outline {
      background:transparent; color:var(--yellow);
      border:1.5px solid var(--yellow);
    }
    .btn-outline:hover {
      background:var(--yellow-faint);
      transform:translateY(-2px);
    }
    .btn-ghost {
      background:transparent; color:var(--text-dim);
      padding:10px 16px;
    }
    .btn-ghost:hover { color:var(--yellow); }

    /* Ripple */
    .ripple-effect {
      position:absolute; border-radius:50%;
      background:rgba(245,196,0,0.3);
      animation:ripple 0.6s linear;
      pointer-events:none;
    }

    /* Card */
    .card {
      background:var(--black2);
      border:1px solid var(--grey2);
      border-radius:var(--radius);
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    }
    .card:hover {
      border-color: var(--yellow-dim);
      box-shadow: 0 0 30px var(--yellow-faint);
    }

    /* Input */
    .input {
      width:100%;
      background:var(--black3);
      border:1.5px solid var(--grey2);
      border-radius:var(--radius);
      color:var(--text);
      font-family:'Syne',sans-serif;
      font-size:15px;
      padding:14px 16px;
      outline:none;
      transition:border-color 0.2s, box-shadow 0.2s;
    }
    .input:focus {
      border-color:var(--yellow);
      box-shadow:0 0 0 3px var(--yellow-faint);
    }
    .input::placeholder { color:var(--text-dim); }

    /* Tag */
    .tag {
      font-family:'Space Mono',monospace;
      font-size:11px;
      letter-spacing:0.1em;
      text-transform:uppercase;
      padding:4px 10px;
      border-radius:4px;
      background:var(--yellow-faint);
      border:1px solid rgba(245,196,0,0.2);
      color:var(--yellow);
      display:inline-block;
    }

    /* Progress bar */
    .progress-bar {
      height:3px; background:var(--grey2); border-radius:2px; overflow:hidden;
    }
    .progress-fill {
      height:100%; background:var(--yellow);
      animation:progressFill 0.5s ease;
      transition:width 0.5s cubic-bezier(0.4,0,0.2,1);
    }

    /* Ticker */
    .ticker-wrap {
      overflow:hidden; white-space:nowrap;
      border-top:1px solid var(--grey2);
      border-bottom:1px solid var(--grey2);
      padding:10px 0;
    }
    .ticker-content {
      display:inline-block;
      animation:ticker 28s linear infinite;
      font-family:'Bebas Neue',cursive;
      font-size:15px;
      letter-spacing:0.15em;
      color:var(--yellow-dim);
    }

    /* Difficulty badge */
    .diff-easy   { background:rgba(68,255,136,0.1);  border:1px solid rgba(68,255,136,0.3);  color:#44ff88; }
    .diff-medium { background:rgba(245,196,0,0.1);   border:1px solid rgba(245,196,0,0.3);   color:var(--yellow); }
    .diff-hard   { background:rgba(255,100,50,0.1);  border:1px solid rgba(255,100,50,0.3);  color:#ff6432; }
    .diff-expert { background:rgba(255,50,80,0.1);   border:1px solid rgba(255,50,80,0.3);   color:#ff3250; }

    /* Scan line */
    .scan-wrap { position:relative; overflow:hidden; }
    .scan-wrap::after {
      content:'';
      position:absolute; left:0; right:0;
      height:2px;
      background:linear-gradient(90deg,transparent,rgba(245,196,0,0.3),transparent);
      animation:scanLine 3s linear infinite;
      pointer-events:none;
    }

    /* Page transition */
    .page-enter {
      animation:fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
    }

    /* Grid bg */
    .grid-bg {
      background-image:
        linear-gradient(rgba(245,196,0,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(245,196,0,0.03) 1px, transparent 1px);
      background-size:40px 40px;
    }

    /* Answer option */
    .answer-opt {
      padding:16px 20px;
      border-radius:var(--radius);
      border:1.5px solid var(--grey2);
      background:var(--black2);
      cursor:none;
      transition:all 0.18s;
      font-size:15px;
      text-align:left;
      width:100%;
      font-family:'Syne',sans-serif;
      color:var(--text);
      position:relative; overflow:hidden;
    }
    .answer-opt:hover {
      border-color:var(--yellow);
      background:var(--yellow-faint);
      transform:translateX(4px);
    }
    .answer-opt.correct {
      border-color:var(--green);
      background:rgba(68,255,136,0.08);
      color:var(--green);
      animation:correctPop 0.3s ease;
    }
    .answer-opt.wrong {
      border-color:var(--red);
      background:rgba(255,68,68,0.08);
      color:var(--red);
      animation:wrongShake 0.4s ease;
    }
    .answer-opt.disabled { pointer-events:none; opacity:0.5; }

    /* Stat card */
    .stat-num {
      font-family:'Bebas Neue',cursive;
      font-size:52px;
      line-height:1;
      color:var(--yellow);
      animation:countUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
    }

    /* File drop zone */
    .dropzone {
      border:2px dashed var(--grey2);
      border-radius:16px;
      padding:48px;
      text-align:center;
      cursor:none;
      transition:all 0.25s;
      position:relative; overflow:hidden;
    }
    .dropzone:hover, .dropzone.dragging {
      border-color:var(--yellow);
      background:var(--yellow-faint);
    }
    .dropzone.dragging { transform:scale(1.01); }

    /* Loader */
    .loader-ring {
      width:48px; height:48px;
      border:3px solid var(--grey2);
      border-top-color:var(--yellow);
      border-radius:50%;
      animation:spinSlow 0.8s linear infinite;
    }

    /* Nav */
    .nav-link {
      font-family:'Space Mono',monospace;
      font-size:12px; letter-spacing:0.08em; text-transform:uppercase;
      color:var(--text-dim); cursor:none; padding:8px 12px;
      border-radius:6px;
      transition:color 0.2s, background 0.2s;
      text-decoration:none;
      border:none; background:transparent;
    }
    .nav-link:hover, .nav-link.active { color:var(--yellow); background:var(--yellow-faint); }

    /* Shimmer text */
    .shimmer-text {
      background: linear-gradient(90deg, var(--yellow) 0%, #fff8b0 40%, var(--yellow) 60%, var(--yellow-dim) 100%);
      background-size: 200% auto;
      -webkit-background-clip:text;
      background-clip:text;
      -webkit-text-fill-color:transparent;
      animation:shimmer 3s linear infinite;
    }

    /* Tooltip */
    .tooltip { position:relative; }
    .tooltip::after {
      content:attr(data-tip);
      position:absolute; bottom:calc(100% + 8px); left:50%;
      transform:translateX(-50%);
      background:var(--black3); border:1px solid var(--grey2);
      color:var(--text); font-size:12px; padding:6px 10px;
      border-radius:6px; white-space:nowrap; opacity:0;
      transition:opacity 0.15s; pointer-events:none;
      font-family:'Space Mono',monospace;
    }
    .tooltip:hover::after { opacity:1; }

    @media(max-width:640px){
      .stat-num { font-size:36px; }
    }
  `}</style>
);

// ── Ripple ─────────────────────────────────────────────────────────────────
function useRipple() {
  const [ripples, setRipples] = useState([]);
  const addRipple = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(r => [...r, { x, y, id }]);
    setTimeout(() => setRipples(r => r.filter(rr => rr.id !== id)), 700);
  }, []);
  const Ripples = () => ripples.map(r => (
    <span key={r.id} className="ripple-effect"
      style={{ left: r.x, top: r.y, width: 80, height: 80, marginLeft: -40, marginTop: -40 }} />
  ));
  return { addRipple, Ripples };
}

// ── Cursor ─────────────────────────────────────────────────────────────────
function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, raf;
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (dot.current) { dot.current.style.left = mx + 'px'; dot.current.style.top = my + 'px'; }
      if (ring.current) { ring.current.style.left = rx + 'px'; ring.current.style.top = ry + 'px'; }
      raf = requestAnimationFrame(loop);
    };
    const onOver = e => { if (e.target.matches('button,a,[role=button],input,textarea,.answer-opt,.dropzone,.nav-link,.btn')) ring.current?.classList.add('hovering'); };
    const onOut  = () => ring.current?.classList.remove('hovering');
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    loop();
    return () => { window.removeEventListener('mousemove', onMove); document.removeEventListener('mouseover', onOver); document.removeEventListener('mouseout', onOut); cancelAnimationFrame(raf); };
  }, []);
  return (<><div className="cursor-dot" ref={dot}/><div className="cursor-ring" ref={ring}/></>);
}

// ── Ticker ─────────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["QUIVER — ADAPTIVE QUIZ ENGINE", "UPLOAD ·  ANALYZE ·  TEST", "AI POWERED KNOWLEDGE ASSESSMENT", "DARK LEARNING MODE ACTIVATED", "DIFFICULTY SCALES WITH YOUR MASTERY"];
  const txt = items.join("  ◆  ") + "  ◆  " + items.join("  ◆  ");
  return (
    <div className="ticker-wrap">
      <div className="ticker-content">{txt}</div>
    </div>
  );
}

// ── File text extractors ────────────────────────────────────────────────────
async function extractTextFromFile(file) {
  const name = file.name.toLowerCase();

  // Plain text / markdown
  if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.csv')) {
    return await file.text();
  }

  // DOCX via mammoth
  if (name.endsWith('.docx') || name.endsWith('.doc')) {
    try {
      const mammoth = await import('https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js');
      const ab = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: ab });
      return result.value || '';
    } catch {
      return await file.text().catch(() => file.name);
    }
  }

  // PDF via PDF.js
  if (name.endsWith('.pdf')) {
    try {
      // Load PDF.js from CDN
      if (!window.pdfjsLib) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          s.onload = resolve; s.onerror = reject;
          document.head.appendChild(s);
        });
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
      const ab = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: ab }).promise;
      const pages = [];
      for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        pages.push(tc.items.map(item => item.str).join(' '));
      }
      return pages.join('\n\n');
    } catch (err) {
      console.error('PDF extract error:', err);
      return '';
    }
  }

  // PPTX — it's a zip, extract slide XML text
  if (name.endsWith('.pptx')) {
    try {
      // Use JSZip to unzip
      if (!window.JSZip) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
          s.onload = resolve; s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const ab = await file.arrayBuffer();
      const zip = await window.JSZip.loadAsync(ab);
      const slideTexts = [];
      const slideFiles = Object.keys(zip.files).filter(f => f.match(/ppt\/slides\/slide\d+\.xml/)).sort();
      for (const sf of slideFiles.slice(0, 30)) {
        const xml = await zip.files[sf].async('text');
        // Strip XML tags, get text nodes
        const text = xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (text.length > 10) slideTexts.push(text);
      }
      return slideTexts.join('\n\n');
    } catch (err) {
      console.error('PPTX extract error:', err);
      return '';
    }
  }

  // Fallback: try reading as text
  try { return await file.text(); } catch { return ''; }
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function smartChunk(content, maxChars = 12000) {
  const t = content.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  if (t.length <= maxChars) return t;
  // Take beginning, middle, and end to get broad coverage
  const third = Math.floor(maxChars / 3);
  const mid = Math.floor(t.length / 2);
  return (
    t.slice(0, third) +
    '\n\n[... middle of document ...]\n\n' +
    t.slice(mid - third / 2, mid + third / 2) +
    '\n\n[... end of document ...]\n\n' +
    t.slice(-third)
  );
}

async function callClaude(system, user, maxTokens = 2000) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const prompt = system + "\n\n" + user;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 }
      })
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function parseJSON(raw) {
  const clean = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object found in response');
  return JSON.parse(match[0]);
}

// ── STEP 1: Deep content analysis ──────────────────────────────────────────
async function analyzeContent(content) {
  const chunk = smartChunk(content, 12000);

  const system = `You are an expert academic content analyst. You read study material and identify its structure, key topics, and important concepts with surgical precision. Return ONLY valid JSON.`;

  const user = `Read this study material thoroughly:

===START OF MATERIAL===
${chunk}
===END OF MATERIAL===

Analyze it and return ONLY this JSON (no markdown, no explanation):
{
  "title": "concise title for this material (5-8 words)",
  "subject": "the academic subject/domain (e.g. Biology, Computer Science, History)",
  "summary": "2-3 sentence summary of what this material covers",
  "topics": [
    {
      "name": "topic name",
      "importance": "high|medium|low",
      "description": "one sentence about what this topic covers in the material",
      "subtopics": ["subtopic1", "subtopic2"]
    }
  ],
  "totalConcepts": <number of distinct testable concepts found>,
  "recommendedDifficulty": "easy|medium|hard",
  "contentQuality": "rich|moderate|sparse"
}

Rules:
- List 4-8 topics ordered by importance (most important first)
- Only include topics that actually appear in the material
- Be specific — use the actual terminology from the material`;

  const raw = await callClaude(system, user, 1500);
  return parseJSON(raw);
}

// ── STEP 2: Generate quiz — analysis-driven, topic-weighted ────────────────
async function generateQuizWithClaude(content, settings) {
  const { difficulty, numQuestions, focusTopic, analysis } = settings;
  const chunk = smartChunk(content, 14000);

  // ── Build topic blueprint from analysis ────────────────────────────────
  // Assign question counts per topic weighted by importance
  let topicBlueprint = '';
  let topicContext = '';

  if (analysis?.topics?.length && !focusTopic) {
    const topics = analysis.topics;
    // Weight: high=3, medium=2, low=1
    const weights = topics.map(t => t.importance === 'high' ? 3 : t.importance === 'medium' ? 2 : 1);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    // Allocate question counts proportionally
    const raw = weights.map(w => (w / totalWeight) * numQuestions);
    // Round but ensure sum = numQuestions
    let counts = raw.map(r => Math.max(1, Math.round(r)));
    while (counts.reduce((a, b) => a + b, 0) > numQuestions) {
      const maxIdx = counts.indexOf(Math.max(...counts));
      counts[maxIdx]--;
    }
    while (counts.reduce((a, b) => a + b, 0) < numQuestions) {
      const topHighIdx = topics.findIndex(t => t.importance === 'high');
      counts[topHighIdx >= 0 ? topHighIdx : 0]++;
    }

    topicBlueprint = topics.map((t, i) => (
      `  - "${t.name}" [${t.importance.toUpperCase()} IMPORTANCE] → generate EXACTLY ${counts[i]} question(s)
     Description: ${t.description}
     Subtopics to draw from: ${(t.subtopics || []).join(', ') || 'see material'}`
    )).join('\n');

    topicContext = `
TOPIC ALLOCATION (strictly follow this — this is based on importance analysis):
${topicBlueprint}

Total must = ${numQuestions} questions. High-importance topics get the most questions.`;

  } else if (focusTopic && analysis?.topics?.length) {
    const t = analysis.topics.find(top => top.name === focusTopic) || { name: focusTopic, description: '', subtopics: [] };
    topicContext = `
TOPIC FOCUS: Generate ALL ${numQuestions} questions exclusively about "${t.name}".
Description: ${t.description}
Key subtopics: ${(t.subtopics || []).join(', ') || 'see material'}`;
  }

  // ── Difficulty guidance ────────────────────────────────────────────────
  const diffGuide = {
    easy: `RECALL — Questions test whether the student READ the material.
    • Ask about definitions, names, basic facts stated directly in the text
    • "What is X?", "Which of these is Y?", "According to the material, Z is defined as..."
    • Wrong options: use terms from the material that sound related but aren't the answer
    • A student who read carefully gets 90%+`,

    medium: `COMPREHENSION — Questions test whether the student UNDERSTOOD the material.
    • Ask about relationships, causes, effects, processes, comparisons between concepts
    • "Why does X happen?", "What is the relationship between A and B?", "Which best explains..."
    • Wrong options: partially correct statements or plausible misconceptions from the material
    • A student who understood (not just memorized) gets 70%+`,

    hard: `APPLICATION & ANALYSIS — Questions test whether the student can USE the knowledge.
    • Ask about applying concepts to scenarios, analyzing mechanisms, evaluating statements
    • "In situation X, what would Y do?", "Which statement about Z is most accurate?"
    • Wrong options: require careful reading to distinguish — all options should seem plausible
    • Only a student with deep understanding gets 60%+`,

    expert: `SYNTHESIS & CRITICAL EVALUATION — Questions test mastery and edge-case reasoning.
    • Ask about subtle distinctions, exceptions, implications, and cross-concept reasoning
    • "Which of the following MOST accurately distinguishes X from Y?"
    • Wrong options: highly plausible — a student who skimmed will get these wrong
    • Only a student who mastered the material gets 50%+`,
  };

  // ── Subject-specific question type hints ──────────────────────────────
  const subjectHints = analysis?.subject
    ? `Subject domain: ${analysis.subject}. Use question formats appropriate to this domain (e.g., for sciences: mechanism/process questions; for history: cause/consequence questions; for CS: how/why/tradeoff questions; for medicine: pathophysiology/mechanism questions).`
    : '';

  const system = `You are Quiver — an elite academic quiz engine used by top universities.
You generate the most insightful, well-crafted multiple-choice questions possible from study material.
Your questions are famous for:
- Testing exactly what matters most (not trivia or edge cases unless at expert level)
- Having wrong options that are genuinely tempting to students who half-understand the material  
- Explanations that teach, not just confirm
- NEVER asking questions answerable from general knowledge alone
Return ONLY valid JSON. No markdown. No explanation outside JSON.`;

  const user = `MATERIAL SUMMARY: ${analysis?.summary || 'Study material provided below'}
${subjectHints}

===FULL MATERIAL===
${chunk}
===END MATERIAL===

TASK: Generate exactly ${numQuestions} multiple-choice questions at ${difficulty.toUpperCase()} difficulty.

DIFFICULTY STANDARD:
${diffGuide[difficulty]}

${topicContext}

QUESTION QUALITY CHECKLIST (every question must pass ALL of these):
✓ The question stem uses specific terminology/concepts/names from the material
✓ The correct answer is clearly supported by the material (not general knowledge)
✓ All 4 options are about the same length and grammatically parallel
✓ Wrong options use plausible terms/concepts from the material (not random distractors)
✓ The explanation references the specific part of the material that supports the answer
✓ No two questions test the same fact or concept
✓ Question is unambiguous — exactly one option is clearly correct

FORBIDDEN:
✗ "According to the document/text/material..." (too meta)
✗ Trivial questions about titles, authors, or formatting
✗ Questions with obvious wrong answers (e.g., joke options)
✗ Restating the question in the explanation

ANSWER POSITION RULE: Vary which option index (0,1,2,3) is correct across questions. Do NOT put the correct answer in the same position for multiple consecutive questions. Spread correct answers across all four positions (A, B, C, D) unpredictably.

Return ONLY this JSON (no markdown, no text outside):
{
  "topic": "${analysis?.title || 'Quiz'}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "question": "the question text",
      "options": ["option A", "option B", "option C", "option D"],
      "answer": <0-3>,
      "explanation": "The correct answer is [X] because [specific reference to material content]. [Why the other options are wrong if helpful.]",
      "topicTag": "the topic name this question covers"
    }
  ]
}`;

  const raw = await callClaude(system, user, 4000);
  const parsed = parseJSON(raw);

  if (!parsed.questions?.length) throw new Error('No questions returned');

  // Validate + clean
  parsed.questions = parsed.questions
    .filter(q =>
      q.question?.trim() &&
      Array.isArray(q.options) && q.options.length === 4 &&
      q.options.every(o => o?.trim()) &&
      typeof q.answer === 'number' && q.answer >= 0 && q.answer <= 3 &&
      q.explanation?.trim()
    )
    .slice(0, numQuestions);

  if (!parsed.questions.length) throw new Error('All questions failed validation — please try again');

  // Shuffle answer positions so correct answer is unpredictably placed across A/B/C/D
  parsed.questions = shuffleAnswerPositions(parsed.questions);
  return parsed;
}

// ── Shuffle answer positions so correct answer isn't predictably placed ─────
function shuffleAnswerPositions(questions) {
  // Force a distribution: across questions, spread correct answers across all 4 positions
  // Use a seeded rotation so no two consecutive questions have the same correct position
  const positionPool = [];
  // Build a shuffled pool that guarantees each position appears roughly equally
  const perCycle = Math.ceil(questions.length / 4);
  for (let i = 0; i < perCycle; i++) {
    positionPool.push(0, 1, 2, 3);
  }
  // Fisher-Yates shuffle the pool
  for (let i = positionPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positionPool[i], positionPool[j]] = [positionPool[j], positionPool[i]];
  }
  // Additionally ensure no 3 consecutive same positions
  for (let i = 2; i < positionPool.length; i++) {
    if (positionPool[i] === positionPool[i-1] && positionPool[i] === positionPool[i-2]) {
      // Swap with a later element that's different
      for (let j = i + 1; j < positionPool.length; j++) {
        if (positionPool[j] !== positionPool[i]) {
          [positionPool[i], positionPool[j]] = [positionPool[j], positionPool[i]];
          break;
        }
      }
    }
  }

  return questions.map((q, idx) => {
    const targetPos = positionPool[idx % positionPool.length];
    const currentPos = q.answer;
    if (currentPos === targetPos) return q; // already in right spot

    // Swap the correct answer option into targetPos
    const newOptions = [...q.options];
    [newOptions[currentPos], newOptions[targetPos]] = [newOptions[targetPos], newOptions[currentPos]];

    return { ...q, options: newOptions, answer: targetPos };
  });
}
function useUserStore() {
  // Use window-level storage so data survives React re-renders without localStorage
  if (!window.__qvr_users)    window.__qvr_users    = [];
  if (!window.__qvr_sessions) window.__qvr_sessions = [];

  const [, forceUpdate] = useState(0);
  const bump = () => forceUpdate(n => n + 1);

  const register = (name, email, pass) => {
    if (!name.trim()) return { error: 'Name is required' };
    if (!email.trim()) return { error: 'Email is required' };
    if (!pass.trim()) return { error: 'Password is required' };
    if (window.__qvr_users.find(u => u.email === email)) return { error: 'Email already registered' };
    const user = { id: Date.now().toString(), name: name.trim(), email: email.trim(), pass, createdAt: new Date().toISOString() };
    window.__qvr_users = [...window.__qvr_users, user];
    bump();
    return { user };
  };

  const login = (email, pass) => {
    if (!email.trim() || !pass.trim()) return { error: 'Please fill in all fields' };
    const user = window.__qvr_users.find(u => u.email === email.trim() && u.pass === pass);
    if (!user) return { error: 'Invalid email or password' };
    return { user };
  };

  const addSession = (userId, session) => {
    window.__qvr_sessions = [...window.__qvr_sessions, { ...session, userId, id: Date.now().toString(), date: new Date().toISOString() }];
    bump();
  };

  const getUserSessions = (userId) => window.__qvr_sessions.filter(s => s.userId === userId);

  return { register, login, addSession, getUserSessions };
}

// ══════════════════════════════════════════════════════════════════════════════
//  SCREENS
// ══════════════════════════════════════════════════════════════════════════════

// ── Landing ─────────────────────────────────────────────────────────────────
function LandingScreen({ onNavigate }) {
  const { addRipple, Ripples } = useRipple();
  const heroRef = useRef(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = e => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      el.style.setProperty('--rx', `${y * 8}deg`);
      el.style.setProperty('--ry', `${-x * 8}deg`);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="grid-bg" style={{ minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--grey2)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,9,0,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <QuiverLogo size={32} />
          <span style={{ fontFamily: 'Bebas Neue', fontSize: 24, letterSpacing: '0.1em', color: 'var(--yellow)' }}>QUIVER</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost nav-link" onClick={e => { addRipple(e); onNavigate('login'); }}>Login</button>
          <button className="btn btn-primary" style={{ padding: '10px 22px', fontSize: 13 }} onClick={e => { addRipple(e); onNavigate('register'); }}>
            Get Started <Ripples />
          </button>
        </div>
      </nav>

      <Ticker />

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 40px 60px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 32 }}>
          <div className="tag" style={{ animation: 'fadeUp 0.4s 0.1s both' }}>AI-Powered Adaptive Learning</div>

          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(64px, 12vw, 140px)', lineHeight: 0.9, letterSpacing: '-0.01em', animation: 'fadeUp 0.5s 0.2s both' }}>
            <span className="shimmer-text">MASTER</span><br />
            <span style={{ color: 'var(--white)' }}>ANYTHING</span><br />
            <span style={{ color: 'var(--yellow)', WebkitTextStroke: '1px var(--yellow)', WebkitTextFillColor: 'transparent' }}>FASTER</span>
          </h1>

          <p style={{ fontSize: 18, color: 'var(--text-dim)', maxWidth: 520, lineHeight: 1.7, animation: 'fadeUp 0.5s 0.3s both' }}>
            Upload your notes, documents or slides. Quiver's AI finds what matters most and builds quizzes that get harder as you improve.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp 0.5s 0.4s both' }}>
            <button className="btn btn-primary" style={{ fontSize: 15, padding: '16px 36px' }} onClick={e => { addRipple(e); onNavigate('register'); }}>
              <ArrowIcon /> Start for Free <Ripples />
            </button>
            <button className="btn btn-outline" style={{ fontSize: 15, padding: '16px 36px' }} onClick={e => { addRipple(e); onNavigate('login'); }}>
              Sign In <Ripples />
            </button>
          </div>
        </div>

        {/* 3D Card */}
        <div ref={heroRef} style={{ marginTop: 80, perspective: 1000, animation: 'fadeUp 0.7s 0.5s both' }}>
          <MockQuizCard />
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24, marginTop: 80 }}>
          {[
            { icon: '📄', title: 'Smart Upload', desc: 'PDF, DOCX, PPTX, or plain text. Quiver reads it all.' },
            { icon: '🧠', title: 'AI Topic Extraction', desc: 'Claude AI identifies the most important concepts in your material.' },
            { icon: '⚡', title: 'Adaptive Difficulty', desc: 'Answer correctly and the quiz gets harder. Answer wrong and it recalibrates.' },
            { icon: '📊', title: 'Progress Dashboard', desc: 'Track every session, see your weak spots, measure growth.' },
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: 28, animation: `fadeUp 0.5s ${0.6 + i * 0.1}s both` }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--white)' }}>{f.title}</div>
              <div style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockQuizCard() {
  const [selected, setSelected] = useState(null);
  const opts = ['Neural networks', 'Decision trees', 'Linear regression', 'K-means clustering'];
  return (
    <div className="scan-wrap card" style={{
      padding: 40, maxWidth: 700, margin: '0 auto',
      background: 'var(--black2)',
      transform: 'rotateX(var(--rx,0)) rotateY(var(--ry,0))',
      transition: 'transform 0.1s',
      transformStyle: 'preserve-3d',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <span className="tag diff-hard">Hard · Q3/10</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1,2,3,4,5].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i <= 3 ? 'var(--yellow)' : 'var(--grey2)' }} />)}
        </div>
      </div>
      <div className="progress-bar" style={{ marginBottom: 28 }}><div className="progress-fill" style={{ width: '30%' }} /></div>
      <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--white)', marginBottom: 24, lineHeight: 1.5 }}>
        Which machine learning technique uses backpropagation for training?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {opts.map((o, i) => (
          <button key={i} className={`answer-opt ${selected === i ? (i === 0 ? 'correct' : 'wrong') : ''}`}
            onClick={() => setSelected(i)}>
            <span style={{ fontFamily: 'Space Mono', fontSize: 12, marginRight: 12, color: 'var(--yellow)' }}>{String.fromCharCode(65 + i)}</span>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Auth screens ────────────────────────────────────────────────────────────
function AuthScreen({ mode, onNavigate, onAuth, store }) {
  const [form, setForm] = useState({ name: '', email: '', pass: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addRipple, Ripples } = useRipple();

  const submit = async () => {
    setError('');
    if (mode === 'register' && !form.name.trim()) { setError('Name is required'); return; }
    if (!form.email.trim()) { setError('Email is required'); return; }
    if (!form.pass.trim()) { setError('Password is required'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const res = mode === 'register'
      ? store.register(form.name, form.email, form.pass)
      : store.login(form.email, form.pass);
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    onAuth(res.user);
    onNavigate('upload');
  };

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,196,0,0.08) 0%, transparent 70%)', animation: 'orbFloat1 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,196,0,0.06) 0%, transparent 70%)', animation: 'orbFloat2 10s ease-in-out infinite' }} />
      </div>

      <button className="btn btn-ghost" style={{ position: 'absolute', top: 24, left: 24 }} onClick={() => onNavigate('landing')}>
        ← Back
      </button>

      <div className="card page-enter" style={{ width: '100%', maxWidth: 440, padding: 48, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <QuiverLogo size={48} style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 36, letterSpacing: '0.05em', color: 'var(--yellow)' }}>
            {mode === 'register' ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginTop: 6 }}>
            {mode === 'register' ? 'Start your adaptive learning journey' : 'Pick up where you left off'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: 12, fontFamily: 'Space Mono', color: 'var(--text-dim)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>FULL NAME</label>
              <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key === 'Enter' && submit()} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, fontFamily: 'Space Mono', color: 'var(--text-dim)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>EMAIL</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontFamily: 'Space Mono', color: 'var(--text-dim)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>PASSWORD</label>
            <input className="input" type="password" placeholder="••••••••" value={form.pass} onChange={e => setForm(f => ({ ...f, pass: e.target.value }))} onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>

          {error && <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--red)' }}>{error}</div>}

          <button className="btn btn-primary" style={{ width: '100%', fontSize: 15, padding: 16, marginTop: 8 }}
            onClick={e => { addRipple(e); submit(); }} disabled={loading}>
            {loading ? <div className="loader-ring" style={{ width: 22, height: 22, borderWidth: 2 }} /> : (mode === 'register' ? 'Create Account' : 'Sign In')}
            <Ripples />
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-dim)' }}>
            {mode === 'register' ? 'Already have an account? ' : "Don't have an account? "}
            <button className="btn btn-ghost" style={{ padding: '0 4px', fontSize: 13, color: 'var(--yellow)' }}
              onClick={() => onNavigate(mode === 'register' ? 'login' : 'register')}>
              {mode === 'register' ? 'Sign in' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Upload Screen (3 phases: upload → analyze → configure) ─────────────────
function UploadScreen({ user, onNavigate, onStartQuiz }) {
  const [phase, setPhase] = useState('upload'); // upload | analyzing | configure | generating
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [analyzeStep, setAnalyzeStep] = useState(0); // 0=reading,1=analyzing,2=done

  // Quiz settings
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [focusTopic, setFocusTopic] = useState(''); // '' = all topics

  const fileRef = useRef();
  const { addRipple, Ripples } = useRipple();

  const handleFiles = (newFiles) => {
    setFiles(Array.from(newFiles));
    setError('');
  };

  // Phase 1 → Phase 2: Extract + Analyze
  const handleAnalyze = async () => {
    setError('');
    let content = text.trim();

    if (files.length > 0) {
      setPhase('analyzing'); setAnalyzeStep(0);
      try {
        const texts = await Promise.all(files.map(f => extractTextFromFile(f)));
        content = texts.filter(Boolean).join('\n\n').trim();
      } catch (e) {
        setError('Could not read file: ' + e.message);
        setPhase('upload'); return;
      }
      if (!content || content.length < 80) {
        setError('Could not extract readable text. Try a text-based PDF/DOCX, or paste your notes directly below.');
        setPhase('upload'); return;
      }
    } else {
      if (!content || content.length < 80) {
        setError('Please paste at least a paragraph of study material.');
        return;
      }
      setPhase('analyzing'); setAnalyzeStep(0);
    }

    setExtractedText(content);
    setAnalyzeStep(1);

    try {
      const result = await analyzeContent(content);
      setAnalysis(result);
      setAnalyzeStep(2);
      // Auto-set difficulty from recommendation
      if (result.recommendedDifficulty) setDifficulty(result.recommendedDifficulty);
      setTimeout(() => setPhase('configure'), 600);
    } catch (e) {
      setError('Analysis failed: ' + e.message);
      setPhase('upload');
    }
  };

  // Phase 3 → Quiz: Generate with settings
  const handleGenerate = async () => {
    setPhase('generating');
    setError('');
    try {
      const quiz = await generateQuizWithClaude(extractedText, { difficulty, numQuestions, focusTopic, analysis });
      onStartQuiz(quiz, extractedText, analysis);
    } catch (e) {
      setError('Quiz generation failed: ' + e.message + '. Please try again.');
      setPhase('configure');
    }
  };

  const diffOptions = [
    { value: 'easy',   label: 'Easy',   desc: 'Direct recall', color: 'var(--green)',  icon: '🟢' },
    { value: 'medium', label: 'Medium', desc: 'Comprehension', color: 'var(--yellow)', icon: '🟡' },
    { value: 'hard',   label: 'Hard',   desc: 'Application',   color: '#ff9944',       icon: '🟠' },
    { value: 'expert', label: 'Expert', desc: 'Critical think',color: 'var(--red)',    icon: '🔴' },
  ];

  const qOptions = [3, 5, 7, 10, 15];

  // ── PHASE: analyzing ──
  if (phase === 'analyzing') {
    const steps = ['Extracting text from file…', 'AI reading and analyzing content…', 'Topics identified ✓'];
    return (
      <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppNav user={user} onNavigate={onNavigate} current="upload" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div className="card page-enter" style={{ width: '100%', maxWidth: 480, padding: 48, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, margin: '0 auto 32px', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, border: '3px solid var(--grey2)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: 'var(--yellow)', borderRadius: '50%', animation: 'spinSlow 1s linear infinite' }} />
              <div style={{ position: 'absolute', inset: 8, border: '2px solid transparent', borderTopColor: 'var(--yellow-dim)', borderRadius: '50%', animation: 'spinSlow 1.5s linear infinite reverse' }} />
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: 'var(--yellow)', marginBottom: 32, letterSpacing: '0.1em' }}>
              ANALYZING MATERIAL
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: i <= analyzeStep ? 1 : 0.25, transition: 'opacity 0.5s' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i < analyzeStep ? 'rgba(68,255,136,0.12)' : i === analyzeStep ? 'var(--yellow-faint)' : 'var(--black3)',
                    border: `2px solid ${i < analyzeStep ? 'var(--green)' : i === analyzeStep ? 'var(--yellow)' : 'var(--grey2)'}`,
                    transition: 'all 0.4s'
                  }}>
                    {i < analyzeStep
                      ? <span style={{ color: 'var(--green)', fontSize: 13 }}>✓</span>
                      : i === analyzeStep
                        ? <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--yellow)', animation: 'bounce 1s ease-in-out infinite' }} />
                        : <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'Space Mono' }}>{i + 1}</span>}
                  </div>
                  <span style={{ fontSize: 14, fontFamily: 'Space Mono', color: i === analyzeStep ? 'var(--yellow)' : i < analyzeStep ? 'var(--green)' : 'var(--text-dim)', textAlign: 'left', transition: 'color 0.4s' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── PHASE: generating ──
  if (phase === 'generating') {
    return (
      <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppNav user={user} onNavigate={onNavigate} current="upload" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div className="card page-enter" style={{ width: '100%', maxWidth: 480, padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 24, animation: 'bounce 1.2s ease-in-out infinite' }}>⚡</div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: 'var(--yellow)', marginBottom: 12, letterSpacing: '0.1em' }}>CRAFTING YOUR QUIZ</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>
              Generating {numQuestions} {difficulty} questions{focusTopic ? ` on "${focusTopic}"` : ''}…
            </p>
            {error && <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 8, fontSize: 13, color: 'var(--red)' }}>{error}</div>}
          </div>
        </div>
      </div>
    );
  }

  // ── PHASE: configure ──
  if (phase === 'configure' && analysis) {
    const highTopics = analysis.topics?.filter(t => t.importance === 'high') || [];
    const allTopics = analysis.topics || [];

    return (
      <div className="grid-bg" style={{ minHeight: '100vh' }}>
        <AppNav user={user} onNavigate={onNavigate} current="upload" />
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px' }} className="page-enter">

          {/* Analysis result card */}
          <div className="card" style={{ padding: 32, marginBottom: 32, borderColor: 'rgba(245,196,0,0.25)', background: 'linear-gradient(135deg, var(--black2) 0%, rgba(26,24,0,0.6) 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div className="tag">{analysis.subject || 'Study Material'}</div>
                  <div className="tag" style={{ background: analysis.contentQuality === 'rich' ? 'rgba(68,255,136,0.1)' : 'var(--yellow-faint)', color: analysis.contentQuality === 'rich' ? 'var(--green)' : 'var(--yellow)' }}>
                    {analysis.contentQuality === 'rich' ? '🟢 Rich Content' : analysis.contentQuality === 'moderate' ? '🟡 Moderate' : '🔴 Sparse'}
                  </div>
                </div>
                <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: 'var(--white)', letterSpacing: '0.05em', marginBottom: 8 }}>{analysis.title}</h2>
                <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7, maxWidth: 520 }}>{analysis.summary}</p>
              </div>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: 52, color: 'var(--yellow)', lineHeight: 1 }}>{analysis.totalConcepts || '?'}</div>
                <div style={{ fontFamily: 'Space Mono', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>CONCEPTS FOUND</div>
              </div>
            </div>

            {/* Topics grid */}
            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
              {allTopics.map((t, i) => (
                <div key={i} style={{
                  padding: '12px 14px', borderRadius: 8,
                  background: t.importance === 'high' ? 'rgba(245,196,0,0.06)' : 'var(--black3)',
                  border: `1px solid ${t.importance === 'high' ? 'rgba(245,196,0,0.2)' : 'var(--grey2)'}`,
                  animation: `fadeUp 0.4s ${i * 0.06}s both`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 10 }}>{t.importance === 'high' ? '⭐' : t.importance === 'medium' ? '◆' : '·'}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.importance === 'high' ? 'var(--yellow)' : 'var(--text)' }}>{t.name}</span>
                  </div>
                  {t.description && <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.5 }}>{t.description}</div>}
                </div>
              ))}
            </div>

            <button className="btn btn-ghost" style={{ marginTop: 16, fontSize: 12, color: 'var(--text-dim)', padding: '6px 0' }}
              onClick={() => { setPhase('upload'); setAnalysis(null); setFiles([]); setText(''); setExtractedText(''); }}>
              ← Upload different material
            </button>
          </div>

          {/* Quiz settings */}
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 26, color: 'var(--white)', letterSpacing: '0.08em', marginBottom: 24 }}>
            CONFIGURE YOUR QUIZ
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

            {/* Difficulty */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.1em', marginBottom: 16 }}>DIFFICULTY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {diffOptions.map(d => (
                  <button key={d.value} onClick={e => { addRipple(e); setDifficulty(d.value); }}
                    style={{ padding: '12px 16px', borderRadius: 8, border: `1.5px solid ${difficulty === d.value ? d.color : 'var(--grey2)'}`, background: difficulty === d.value ? `rgba(0,0,0,0.3)` : 'transparent',
                      cursor: 'none', transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                    <span style={{ fontSize: 16 }}>{d.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: difficulty === d.value ? d.color : 'var(--text)' }}>{d.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'Space Mono' }}>{d.desc}</div>
                    </div>
                    {d.value === analysis.recommendedDifficulty && (
                      <span style={{ fontSize: 10, fontFamily: 'Space Mono', color: 'var(--yellow)', background: 'var(--yellow-faint)', padding: '2px 6px', borderRadius: 4 }}>AI PICK</span>
                    )}
                    <Ripples />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Number of questions */}
              <div className="card" style={{ padding: 24 }}>
                <div style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.1em', marginBottom: 16 }}>NUMBER OF QUESTIONS</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {qOptions.map(n => (
                    <button key={n} onClick={e => { addRipple(e); setNumQuestions(n); }}
                      style={{ width: 52, height: 52, borderRadius: 8, border: `1.5px solid ${numQuestions === n ? 'var(--yellow)' : 'var(--grey2)'}`,
                        background: numQuestions === n ? 'var(--yellow-faint)' : 'transparent', cursor: 'none', transition: 'all 0.18s',
                        fontFamily: 'Bebas Neue', fontSize: 22, color: numQuestions === n ? 'var(--yellow)' : 'var(--text-dim)', position: 'relative', overflow: 'hidden' }}>
                      {n} <Ripples />
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus topic */}
              <div className="card" style={{ padding: 24, flex: 1 }}>
                <div style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.1em', marginBottom: 16 }}>
                  FOCUS TOPIC <span style={{ opacity: 0.5 }}>(OPTIONAL)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button onClick={e => { addRipple(e); setFocusTopic(''); }}
                    style={{ padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${focusTopic === '' ? 'var(--yellow)' : 'var(--grey2)'}`,
                      background: focusTopic === '' ? 'var(--yellow-faint)' : 'transparent', cursor: 'none', transition: 'all 0.18s',
                      fontFamily: 'Space Mono', fontSize: 12, color: focusTopic === '' ? 'var(--yellow)' : 'var(--text-dim)', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                    🌐 All topics (recommended) <Ripples />
                  </button>
                  {allTopics.slice(0, 6).map((t, i) => (
                    <button key={i} onClick={e => { addRipple(e); setFocusTopic(t.name); }}
                      style={{ padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${focusTopic === t.name ? 'var(--yellow)' : 'var(--grey2)'}`,
                        background: focusTopic === t.name ? 'var(--yellow-faint)' : 'transparent', cursor: 'none', transition: 'all 0.18s',
                        fontFamily: 'Space Mono', fontSize: 11, color: focusTopic === t.name ? 'var(--yellow)' : 'var(--text-dim)', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                      {t.importance === 'high' ? '⭐' : '◆'} {t.name} <Ripples />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && <div style={{ marginBottom: 20, padding: '14px 18px', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 10, fontSize: 14, color: 'var(--red)' }}>⚠️ {error}</div>}

          {/* Summary + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', padding: '20px 24px', background: 'var(--yellow-faint)', border: '1px solid rgba(245,196,0,0.15)', borderRadius: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--white)', marginBottom: 4 }}>
                {numQuestions} {difficulty} questions{focusTopic ? ` · ${focusTopic}` : ' · all topics'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>from: {analysis.title}</div>
            </div>
            <button className="btn btn-primary" style={{ fontSize: 15, padding: '16px 36px' }}
              onClick={e => { addRipple(e); handleGenerate(); }}>
              <ArrowIcon /> Generate Quiz <Ripples />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PHASE: upload ──
  return (
    <div className="grid-bg" style={{ minHeight: '100vh' }}>
      <AppNav user={user} onNavigate={onNavigate} current="upload" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }} className="page-enter">
        <div style={{ marginBottom: 40 }}>
          <div className="tag" style={{ marginBottom: 16 }}>New Quiz</div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 52, letterSpacing: '0.05em', color: 'var(--white)', lineHeight: 1 }}>
            UPLOAD YOUR <span className="shimmer-text">MATERIAL</span>
          </h1>
          <p style={{ color: 'var(--text-dim)', marginTop: 12, fontSize: 15, lineHeight: 1.7 }}>
            Drop your notes, slides, or docs. Quiver deeply reads the content, identifies the most important topics, then lets you configure your quiz before generating.
          </p>
        </div>

        <div className={`dropzone ${dragging ? 'dragging' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          style={{ marginBottom: 24 }}>
          <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.pptx,.txt,.md" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
          <div style={{ fontSize: 48, marginBottom: 16, animation: files.length ? 'none' : 'float 3s ease-in-out infinite' }}>
            {files.length ? '📋' : '📂'}
          </div>
          {files.length > 0 ? (
            <div>
              <div style={{ color: 'var(--yellow)', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{files.length} file{files.length > 1 ? 's' : ''} selected</div>
              {files.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 }}>
                  <span>{f.name.endsWith('.pdf') ? '📄' : f.name.endsWith('.pptx') ? '📊' : f.name.endsWith('.docx') || f.name.endsWith('.doc') ? '📝' : '📃'}</span>
                  <span style={{ fontFamily: 'Space Mono', fontSize: 12, color: 'var(--text-dim)' }}>{f.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--grey)', fontFamily: 'Space Mono' }}>({(f.size / 1024).toFixed(0)} KB)</span>
                </div>
              ))}
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-dim)' }}>Click to change</div>
            </div>
          ) : (
            <>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--white)', marginBottom: 8 }}>Drop files or click to browse</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>PDF · DOCX · PPTX · TXT · MD</div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--grey2)' }} />
          <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>OR PASTE TEXT</span>
          <div style={{ flex: 1, height: 1, background: 'var(--grey2)' }} />
        </div>

        <textarea className="input" rows={7}
          placeholder="Paste your notes, textbook chapter, lecture transcript, or any study material here…"
          value={text} onChange={e => setText(e.target.value)}
          style={{ resize: 'vertical', lineHeight: 1.7 }} />

        {error && (
          <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 10, fontSize: 14, color: 'var(--red)', lineHeight: 1.6 }}>
            ⚠️ {error}
          </div>
        )}

        <button className="btn btn-primary" style={{ width: '100%', marginTop: 24, fontSize: 16, padding: 18 }}
          onClick={e => { addRipple(e); handleAnalyze(); }}
          disabled={!files.length && !text.trim()}>
          <ArrowIcon /> Analyze Material <Ripples />
        </button>

        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { icon: '🔍', text: 'AI reads every word and finds key concepts' },
            { icon: '🎛️', text: 'You control difficulty, length & topic focus' },
            { icon: '🎯', text: 'Every question comes from your actual material' },
          ].map((t, i) => (
            <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--yellow-faint)', border: '1px solid rgba(245,196,0,0.08)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{t.icon}</span>
              <span style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Quiz Screen ─────────────────────────────────────────────────────────────
function QuizScreen({ user, quiz, sourceContent, sourceAnalysis, onFinish, onNavigate }) {
  const TOTAL = quiz.questions.length;
  const diffMap = { easy: 0, medium: 1, hard: 2, expert: 3 };
  const diffStrs = ['easy', 'medium', 'hard', 'expert'];
  const diffLabels = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
  const diffClasses = ['diff-easy', 'diff-medium', 'diff-hard', 'diff-expert'];

  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState([]);
  const [diffLevel, setDiffLevel] = useState(diffMap[quiz.difficulty] ?? 0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [phase, setPhase] = useState('quiz');
  const [bonusQ, setBonusQ] = useState(null);
  const [loadingBonus, setLoadingBonus] = useState(false);
  const { addRipple, Ripples } = useRipple();

  const q = bonusQ || quiz.questions[qIdx];
  if (!q) return null;

  const handleSelect = (i) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    const correct = i === q.answer;
    setScore(s => correct ? s + (diffLevel + 1) * 10 : s);
    setStreak(s => correct ? s + 1 : 0);
    setResults(r => [...r, { correct, question: q.question, chosen: q.options[i], answer: q.options[q.answer], topicTag: q.topicTag }]);
    if (correct) setDiffLevel(d => Math.min(d + 1, 3));
    else setDiffLevel(d => Math.max(d - 1, 0));
  };

  const handleNext = async () => {
    const curStreak = streak;
    setSelected(null); setRevealed(false); setBonusQ(null);
    if (curStreak > 0 && curStreak % 3 === 0 && qIdx < TOTAL - 1) {
      setLoadingBonus(true);
      try {
        const harder = await generateQuizWithClaude(sourceContent, {
          difficulty: diffStrs[Math.min(diffLevel, 3)],
          numQuestions: 1,
          focusTopic: q.topicTag || '',
          analysis: sourceAnalysis
        });
        if (harder?.questions?.[0]) { setBonusQ(harder.questions[0]); setLoadingBonus(false); return; }
      } catch {}
      setLoadingBonus(false);
    }
    if (qIdx + 1 >= TOTAL) { setPhase('result'); return; }
    setQIdx(i => i + 1);
  };

  if (phase === 'result') {
    return <ResultScreen user={user} results={results} score={score} diffLevel={diffLevel} topic={quiz.topic} onNavigate={onNavigate} onFinish={onFinish} />;
  }

  const progress = ((qIdx + (revealed ? 1 : 0)) / TOTAL) * 100;

  return (
    <div className="grid-bg" style={{ minHeight: '100vh' }}>
      <AppNav user={user} onNavigate={onNavigate} current="quiz" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }} className="page-enter">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className={`tag ${diffClasses[diffLevel]}`}>{diffLabels[diffLevel]}</span>
            {q.topicTag && <span className="tag" style={{ fontSize: 10 }}>{q.topicTag}</span>}
            {bonusQ && <span className="tag" style={{ background: 'rgba(245,196,0,0.15)', color: 'var(--yellow)', borderColor: 'var(--yellow)' }}>⚡ BONUS</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {streak >= 2 && <div style={{ fontFamily: 'Space Mono', fontSize: 12, color: 'var(--yellow)' }}>🔥 {streak} streak</div>}
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: 'var(--yellow)' }}>{score} pts</div>
            <div style={{ fontFamily: 'Space Mono', fontSize: 12, color: 'var(--text-dim)' }}>{bonusQ ? '⚡' : `${qIdx + 1}`}/{TOTAL}</div>
          </div>
        </div>

        <div className="progress-bar" style={{ marginBottom: 36 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {loadingBonus ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div className="loader-ring" style={{ margin: '0 auto 24px' }} />
            <div style={{ color: 'var(--text-dim)', fontFamily: 'Space Mono', fontSize: 13 }}>Generating harder question…</div>
          </div>
        ) : (
          <div key={qIdx + (bonusQ ? 'b' : '')} className="page-enter">
            <div className="card" style={{ padding: 36, marginBottom: 24 }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--white)', lineHeight: 1.5 }}>{q.question}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {q.options.map((opt, i) => (
                <button key={i}
                  className={`answer-opt ${revealed && i === q.answer ? 'correct' : ''} ${revealed && i === selected && i !== q.answer ? 'wrong' : ''} ${revealed && i !== selected && i !== q.answer ? 'disabled' : ''}`}
                  onClick={e => { addRipple(e); handleSelect(i); }}>
                  <span style={{ fontFamily: 'Space Mono', fontSize: 13, fontWeight: 700, marginRight: 14, color: revealed && i === q.answer ? 'var(--green)' : 'var(--yellow)' }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {revealed && i === q.answer && <span style={{ marginLeft: 'auto', paddingLeft: 16 }}>✓</span>}
                  {revealed && i === selected && i !== q.answer && <span style={{ marginLeft: 'auto', paddingLeft: 16 }}>✗</span>}
                  <Ripples />
                </button>
              ))}
            </div>

            {revealed && (
              <div style={{ animation: 'fadeUp 0.3s both' }}>
                <div style={{ marginTop: 20, padding: '16px 20px', background: 'var(--yellow-faint)', border: '1px solid rgba(245,196,0,0.2)', borderRadius: 10 }}>
                  <div style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--yellow)', letterSpacing: '0.1em', marginBottom: 6 }}>EXPLANATION</div>
                  <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{q.explanation}</p>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 20, fontSize: 15, padding: 16 }}
                  onClick={e => { addRipple(e); handleNext(); }}>
                  {qIdx + 1 >= TOTAL && !bonusQ ? 'See Results →' : 'Next Question →'}
                  <Ripples />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// ── Result Screen ───────────────────────────────────────────────────────────
function ResultScreen({ user, results, score, diffLevel, topic, onNavigate, onFinish }) {
  const correct = results.filter(r => r.correct).length;
  const wrong = results.length - correct;
  const pct = Math.round((correct / results.length) * 100);
  const { addRipple, Ripples } = useRipple();

  useEffect(() => { onFinish({ topic, score, correct, wrong, total: results.length, difficulty: diffLevel, date: new Date().toISOString() }); }, []);

  const grade = pct >= 90 ? { label: 'EXCEPTIONAL', color: '#44ff88' }
    : pct >= 70 ? { label: 'GREAT WORK', color: 'var(--yellow)' }
    : pct >= 50 ? { label: 'KEEP GOING', color: '#ff9944' }
    : { label: 'NEEDS REVIEW', color: 'var(--red)' };

  return (
    <div className="grid-bg" style={{ minHeight: '100vh' }}>
      <AppNav user={user} onNavigate={onNavigate} current="result" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }} className="page-enter">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, letterSpacing: '0.15em', color: grade.color, marginBottom: 8 }}>{grade.label}</div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(80px, 18vw, 140px)', lineHeight: 0.9, color: grade.color, animation: 'countUp 0.6s cubic-bezier(0.22,1,0.36,1) both' }}>
            {pct}%
          </div>
          <div style={{ color: 'var(--text-dim)', marginTop: 12, fontSize: 14, fontFamily: 'Space Mono' }}>
            {topic ? `Topic: ${topic}` : 'Quiz complete'}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
          {[
            { label: 'Correct', value: correct, color: 'var(--green)' },
            { label: 'Wrong', value: wrong, color: 'var(--red)' },
            { label: 'Score', value: score, color: 'var(--yellow)' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '28px 20px', textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
              <div className="stat-num" style={{ color: s.color, animationDelay: `${i * 0.15}s` }}>{s.value}</div>
              <div style={{ fontSize: 12, fontFamily: 'Space Mono', color: 'var(--text-dim)', letterSpacing: '0.08em', marginTop: 4 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Question review */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'Space Mono', fontSize: 12, letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 20 }}>QUESTION REVIEW</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {results.map((r, i) => (
              <div key={i} className="card" style={{ padding: '16px 20px', borderColor: r.correct ? 'rgba(68,255,136,0.2)' : 'rgba(255,68,68,0.2)', animation: `fadeUp 0.4s ${i * 0.05}s both` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: r.correct ? 'rgba(68,255,136,0.15)' : 'rgba(255,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>
                    {r.correct ? '✓' : '✗'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: 'var(--white)', marginBottom: 6, lineHeight: 1.4 }}>{r.question}</div>
                    {!r.correct && (
                      <div style={{ fontSize: 12, fontFamily: 'Space Mono', color: 'var(--text-dim)' }}>
                        <span style={{ color: 'var(--red)' }}>✗ {r.chosen}</span>
                        <span style={{ margin: '0 8px' }}>→</span>
                        <span style={{ color: 'var(--green)' }}>✓ {r.answer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <button className="btn btn-primary" style={{ flex: 1, fontSize: 15, padding: 16 }} onClick={e => { addRipple(e); onNavigate('upload'); }}>
            <ArrowIcon /> Try Another
            <Ripples />
          </button>
          <button className="btn btn-outline" style={{ flex: 1, fontSize: 15, padding: 16 }} onClick={e => { addRipple(e); onNavigate('dashboard'); }}>
            📊 Dashboard
            <Ripples />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ───────────────────────────────────────────────────────────────
function DashboardScreen({ user, store, onNavigate }) {
  const sessions = store.getUserSessions(user.id);
  const totalCorrect = sessions.reduce((a, s) => a + (s.correct || 0), 0);
  const totalWrong = sessions.reduce((a, s) => a + (s.wrong || 0), 0);
  const totalScore = sessions.reduce((a, s) => a + (s.score || 0), 0);
  const avgPct = sessions.length ? Math.round(sessions.reduce((a, s) => a + ((s.correct || 0) / (s.total || 1)) * 100, 0) / sessions.length) : 0;
  const { addRipple, Ripples } = useRipple();

  const diffLabels = ['Easy', 'Medium', 'Hard', 'Expert'];
  const diffClasses = ['diff-easy', 'diff-medium', 'diff-hard', 'diff-expert'];

  return (
    <div className="grid-bg" style={{ minHeight: '100vh' }}>
      <AppNav user={user} onNavigate={onNavigate} current="dashboard" />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px' }} className="page-enter">
        <div style={{ marginBottom: 48 }}>
          <div className="tag" style={{ marginBottom: 16 }}>Your Progress</div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 52, letterSpacing: '0.05em', color: 'var(--white)', lineHeight: 1 }}>
            KNOWLEDGE <span className="shimmer-text">DASHBOARD</span>
          </h1>
          <p style={{ color: 'var(--text-dim)', marginTop: 10 }}>Welcome back, {user.name}. Here's your learning overview.</p>
        </div>

        {/* Big stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 48 }}>
          {[
            { label: 'Total Score', value: totalScore, color: 'var(--yellow)', icon: '⚡' },
            { label: 'Avg Accuracy', value: `${avgPct}%`, color: 'var(--white)', icon: '🎯' },
            { label: 'Correct', value: totalCorrect, color: 'var(--green)', icon: '✓' },
            { label: 'Wrong', value: totalWrong, color: 'var(--red)', icon: '✗' },
            { label: 'Sessions', value: sessions.length, color: 'var(--text)', icon: '📚' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '24px 20px', animation: `fadeUp 0.4s ${i * 0.08}s both` }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div className="stat-num" style={{ color: s.color, fontSize: 40 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontFamily: 'Space Mono', color: 'var(--text-dim)', letterSpacing: '0.08em', marginTop: 4 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Mini bar chart */}
        {sessions.length > 0 && (
          <div className="card" style={{ padding: 28, marginBottom: 32 }}>
            <div style={{ fontFamily: 'Space Mono', fontSize: 12, letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 20 }}>ACCURACY OVER TIME</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
              {sessions.slice(-12).map((s, i) => {
                const pct = ((s.correct || 0) / (s.total || 1)) * 100;
                return (
                  <div key={i} className="tooltip" data-tip={`${Math.round(pct)}% · ${s.topic || 'Quiz'}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: '100%', background: `linear-gradient(to top, var(--yellow), var(--yellow-dim))`, borderRadius: '4px 4px 0 0', height: `${pct}%`, minHeight: 4, opacity: 0.7 + i * 0.025, animation: `progressFill 0.6s ${i * 0.05}s both`, transformOrigin: 'bottom' }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sessions list */}
        <div>
          <div style={{ fontFamily: 'Space Mono', fontSize: 12, letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 16 }}>RECENT SESSIONS</div>
          {sessions.length === 0 ? (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <div style={{ color: 'var(--text-dim)', fontSize: 15, marginBottom: 24 }}>No sessions yet. Take your first quiz!</div>
              <button className="btn btn-primary" onClick={e => { addRipple(e); onNavigate('upload'); }}>
                Start a Quiz <Ripples />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[...sessions].reverse().map((s, i) => {
                const pct = Math.round(((s.correct || 0) / (s.total || 1)) * 100);
                return (
                  <div key={s.id} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, animation: `fadeUp 0.4s ${i * 0.05}s both` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>{s.topic || 'Quiz Session'}</div>
                      <div style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--text-dim)' }}>
                        {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Space Mono', fontSize: 12, color: 'var(--green)' }}>✓{s.correct || 0}</span>
                      <span style={{ fontFamily: 'Space Mono', fontSize: 12, color: 'var(--red)' }}>✗{s.wrong || 0}</span>
                      <span className={`tag ${diffClasses[s.difficulty || 0]}`}>{diffLabels[s.difficulty || 0]}</span>
                      <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: pct >= 70 ? 'var(--yellow)' : 'var(--text-dim)' }}>{pct}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button className="btn btn-primary" style={{ marginTop: 32, fontSize: 15, padding: '16px 36px' }} onClick={e => { addRipple(e); onNavigate('upload'); }}>
          <ArrowIcon /> New Quiz <Ripples />
        </button>
      </div>
    </div>
  );
}

// ── Nav ─────────────────────────────────────────────────────────────────────
function AppNav({ user, onNavigate, current }) {
  const { addRipple, Ripples } = useRipple();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--grey2)', backdropFilter: 'blur(16px)', background: 'rgba(10,9,0,0.85)', position: 'sticky', top: 0, zIndex: 100 }}>
      <button className="btn btn-ghost" style={{ padding: 0, display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => onNavigate('upload')}>
        <QuiverLogo size={28} />
        <span style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: '0.1em', color: 'var(--yellow)' }}>QUIVER</span>
      </button>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {[
          { key: 'upload', label: 'New Quiz' },
          { key: 'dashboard', label: 'Dashboard' },
        ].map(n => (
          <button key={n.key} className={`nav-link btn ${current === n.key ? 'active' : ''}`} onClick={e => { addRipple(e); onNavigate(n.key); }}>
            {n.label} <Ripples />
          </button>
        ))}
        <div style={{ width: 1, height: 20, background: 'var(--grey2)', margin: '0 8px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue', fontSize: 16, color: 'var(--black)' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'Space Mono' }}>{user?.name?.split(' ')[0]}</span>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '8px 12px' }} onClick={() => onNavigate('landing')}>
          Sign out
        </button>
      </div>
    </nav>
  );
}

// ── Logo ────────────────────────────────────────────────────────────────────
function QuiverLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="1" y="1" width="38" height="38" rx="8" stroke="#f5c400" strokeWidth="1.5" fill="rgba(245,196,0,0.06)" />
      <line x1="20" y1="8" x2="20" y2="32" stroke="#f5c400" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 14 L20 8 L26 14" stroke="#f5c400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M16 20 L20 32 L24 20" stroke="#f5c400" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="rgba(245,196,0,0.2)"/>
      <circle cx="20" cy="20" r="2.5" fill="#f5c400"/>
      <line x1="12" y1="18" x2="16" y2="20" stroke="#f5c400" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <line x1="28" y1="18" x2="24" y2="20" stroke="#f5c400" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}

function ArrowIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

// ══════════════════════════════════════════════════════════════════════════════
//  ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('landing');
  const [user, setUser] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [sourceContent, setSourceContent] = useState('');
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const store = useUserStore();

  const navigate = (s) => {
    if ((s === 'upload' || s === 'dashboard') && !user) { setScreen('login'); return; }
    setScreen(s);
  };

  const handleAuth = (u) => setUser(u);

  const handleStartQuiz = (quiz, content, analysis) => {
    setActiveQuiz(quiz);
    setSourceContent(content);
    setActiveAnalysis(analysis || null);
    setScreen('quiz');
  };

  const handleFinish = (sessionData) => {
    if (user) store.addSession(user.id, sessionData);
  };

  return (
    <>
      <FontLoader />
      <GlobalStyles />
      <CustomCursor />
      {screen === 'landing' && <LandingScreen onNavigate={navigate} />}
      {screen === 'register' && <AuthScreen mode="register" onNavigate={navigate} onAuth={handleAuth} store={store} />}
      {screen === 'login' && <AuthScreen mode="login" onNavigate={navigate} onAuth={handleAuth} store={store} />}
      {screen === 'upload' && user && <UploadScreen user={user} onNavigate={navigate} onStartQuiz={handleStartQuiz} />}
      {screen === 'quiz' && user && activeQuiz && <QuizScreen user={user} quiz={activeQuiz} sourceContent={sourceContent} sourceAnalysis={activeAnalysis} onFinish={handleFinish} onNavigate={navigate} />}
      {screen === 'dashboard' && user && <DashboardScreen user={user} store={store} onNavigate={navigate} />}
    </>
  );
}





