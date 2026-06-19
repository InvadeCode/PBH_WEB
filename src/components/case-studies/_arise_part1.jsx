import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform, useAnimationFrame, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const C = {
  bg: '#1a1a1a', bgDeep: '#111111', dark: '#0d0d0d',
  paper: '#F2F1EF', gold: '#FFCD00', indigo: '#6865FA',
  teal: '#3ecdc6', orange: '#e8651a', rule: 'rgba(255,255,255,0.08)',
};

/* ── Scroll Rail ─────────────────────────────────────── */
const ScrollRail = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return <motion.div className="fixed left-0 top-0 w-[2px] origin-top z-50 pointer-events-none h-screen" style={{ scaleY, backgroundColor: C.gold }} />;
};

/* ── Tension Lines (BaseStructures style) ────────────── */
const TensionLines = ({ section = 'hero' }) => {
  const configs = {
    hero: [
      { x1: '-5%', y1: '15%', x2: '105%', y2: '85%', color: C.teal, w: 1.5, dot: { x: '65%', y: '55%' } },
      { x1: '30%', y1: '-5%', x2: '95%', y2: '105%', color: C.teal, w: 1, dot: { x: '70%', y: '60%' } },
      { x1: '105%', y1: '20%', x2: '-5%', y2: '95%', color: C.teal, w: 0.8, dot: null },
    ],
    mid: [
      { x1: '-5%', y1: '30%', x2: '105%', y2: '70%', color: C.teal, w: 1, dot: { x: '50%', y: '50%' } },
      { x1: '80%', y1: '-5%', x2: '20%', y2: '105%', color: C.teal, w: 0.7, dot: null },
    ],
    end: [
      { x1: '50%', y1: '-5%', x2: '50%', y2: '50%', color: C.gold, w: 1.5, dot: { x: '50%', y: '50%' } },
      { x1: '-5%', y1: '50%', x2: '50%', y2: '50%', color: C.gold, w: 1, dot: null },
      { x1: '105%', y1: '50%', x2: '50%', y2: '50%', color: C.gold, w: 1, dot: null },
    ],
  };
  const lines = configs[section] || configs.hero;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" preserveAspectRatio="none">
      {lines.map((l, i) => (
        <g key={i}>
          <motion.line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth={l.w} opacity={0.35}
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.8, delay: i * 0.3, ease: [0.16, 1, 0.3, 1] }} />
          {l.dot && (
            <motion.circle cx={l.dot.x} cy={l.dot.y} r="6" fill={C.orange}
              initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.3 }} />
          )}
        </g>
      ))}
    </svg>
  );
};

/* ── Triangle Marker (BaseStructures accent) ─────────── */
const TriangleMarker = ({ className = '', size = 20, color = C.orange, delay = 0 }) => (
  <motion.svg width={size} height={size} viewBox="0 0 20 20" className={className}
    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}>
    <polygon points="10,2 18,18 2,18" fill={color} />
  </motion.svg>
);

/* ── Dot Grid Pattern ────────────────────────────────── */
const DotGrid = ({ rows = 6, cols = 8, className = '' }) => (
  <div className={`absolute pointer-events-none opacity-[0.06] ${className}`}>
    <svg width={cols * 24} height={rows * 24}>
      {Array.from({ length: rows * cols }, (_, i) => (
        <circle key={i} cx={(i % cols) * 24 + 12} cy={Math.floor(i / cols) * 24 + 12} r="1.5" fill="white" />
      ))}
    </svg>
  </div>
);

/* ── Char Reveal ─────────────────────────────────────── */
const CharReveal = ({ text, delay = 0, stagger = 0.025, dur = 0.85, inView = false, className = '' }) => {
  let ci = 0;
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="mr-[0.26em] inline-flex whitespace-nowrap last:mr-0">
          {word.split('').map((ch, i) => {
            const idx = ci++;
            return (
              <span key={i} className="inline-block overflow-hidden" style={{ verticalAlign: 'bottom', lineHeight: 'inherit' }}>
                <motion.span className="inline-block" initial={{ y: '105%' }}
                  {...(inView ? { whileInView: { y: 0 }, viewport: { once: true, amount: 0.2 } } : { animate: { y: 0 } })}
                  transition={{ duration: dur, delay: delay + idx * stagger, ease: [0.16, 1, 0.3, 1] }}>{ch}</motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

/* ── FadeUp ──────────────────────────────────────────── */
const FadeUp = ({ children, delay = 0, className = '', style }) => (
  <motion.div className={className} style={style} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
    {children}
  </motion.div>
);

/* ── Bold-Highlight Text (BaseStructures style) ──────── */
const HighlightText = ({ text, bolds = [], className = '' }) => {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i}>
          {bolds.includes(w.replace(/[.,!?]/g, '').toLowerCase())
            ? <strong className="text-white font-semibold">{w}</strong>
            : <span className="text-white/50 font-light">{w}</span>}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
};

/* ── Label ───────────────────────────────────────────── */
const Label = ({ index, children, light = false }) => (
  <div className={`flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] font-primary ${light ? 'text-black/35' : 'text-white/35'}`}>
    <span style={{ color: C.gold }}>{index}</span>
    <span>{children}</span>
  </div>
);

const imageFrom = (item) => (typeof item === 'string' ? item : item?.url || item?.imageUrl);

export { C, ScrollRail, TensionLines, TriangleMarker, DotGrid, CharReveal, FadeUp, HighlightText, Label, imageFrom };
