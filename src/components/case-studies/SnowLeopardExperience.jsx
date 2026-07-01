import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring, useMotionValue, animate } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import createGlobe from 'cobe';
import CaseStudyVideoHero, { hasVideoHeroSource } from './CaseStudyVideoHero';
import { getSafeEmbedUrl } from '../../lib/videoUtils';
import CaseStudyMedia, { normalizeMediaItems } from './CaseStudyMedia';
import CaseStudySectorPill from './CaseStudySectorPill';

// --- PLANETARY SWARM COMPONENT (World Map Background, Full Screen, Tap to cycle) ---
const asOptionalText = (value) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getStatContent = (stat) => {
  if (!stat) return null;
  const label = asOptionalText(stat.label);
  const value = asOptionalText(stat.value || stat.val);
  if (!label && !value) return null;
  return { label, value };
};

// Split a body paragraph into two balanced halves (for the two-column editorial layout).
// Prefers a clean break at a sentence boundary; falls back to the word midpoint.
// Returns [left, right]; right is null when the text is too short to split gracefully.
const splitBodyInTwo = (text) => {
  const clean = asOptionalText(text);
  if (!clean) return [null, null];
  const sentences = clean.match(/[^.!?]+[.!?]+[)\]'"`’”]*\s*/g);
  if (sentences && sentences.length >= 2) {
    const mid = Math.ceil(sentences.length / 2);
    return [sentences.slice(0, mid).join('').trim(), sentences.slice(mid).join('').trim()];
  }
  const words = clean.split(/\s+/);
  if (words.length < 14) return [clean, null];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
};

// Brand accent presets for the narrative blocks (`soft` is an open rgba prefix).
const NARRATIVE_ACCENTS = {
  cyan:   { line: '#22D3EE', label: '#A5B4FC', soft: 'rgba(34,211,238,',  dim: 'rgba(34,211,238,0.05)' },
  indigo: { line: '#818CF8', label: '#C4B5FD', soft: 'rgba(129,140,248,', dim: 'rgba(129,140,248,0.05)' },
  violet: { line: '#A78BFA', label: '#DDD6FE', soft: 'rgba(167,139,250,', dim: 'rgba(167,139,250,0.05)' },
};

/* Cohesive premium narrative block — numbered index, accent bar, two-column
   balanced body (half-left / half-right) with a glowing center divider. */
const NarrativeBlock = ({ index, label, paragraphs, accent = 'cyan', align = 'left' }) => {
  const a = NARRATIVE_ACCENTS[accent] || NARRATIVE_ACCENTS.cyan;
  const ps = (paragraphs || []).filter((p) => asOptionalText(p));
  if (ps.length === 0) return null;

  let left, right;
  if (ps.length >= 2) {
    left = ps[0];
    right = ps.slice(1).join('\n\n');
  } else {
    [left, right] = splitBodyInTwo(ps[0]);
  }
  const rightAlign = align === 'right';

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-5xl mx-auto"
    >
      {/* Giant index numeral bleeding behind the panel */}
      <span
        className={`absolute -top-12 md:-top-20 ${rightAlign ? 'right-0 md:-right-6' : 'left-0 md:-left-6'} text-4xl md:text-5xl font-primary font-bold leading-none pointer-events-none select-none`}
        style={{ color: a.dim, zIndex: 0 }}
      >
        {index}
      </span>

      {/* Glass panel */}
      <div
        className="relative z-10 rounded-[28px] md:rounded-[36px] overflow-hidden p-8 md:p-14 lg:p-16 backdrop-blur-xl"
        style={{
          background: 'linear-gradient(145deg, rgba(15,10,46,0.72) 0%, rgba(21,13,58,0.6) 40%, rgba(13,20,69,0.6) 100%)',
          boxShadow: `0 12px 70px ${a.soft}0.16), 0 0 0 1px rgba(129,140,248,0.12)`,
        }}
      >
        {/* Accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${a.line}, transparent)` }} />

        {/* Ambient glow orb */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.18, 0.36, 0.18] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute -top-24 ${rightAlign ? '-left-24' : '-right-24'} w-[340px] h-[340px] rounded-full pointer-events-none`}
          style={{ background: `radial-gradient(circle, ${a.soft}0.26) 0%, ${a.soft}0.08) 40%, transparent 70%)` }}
        />

        {/* Header: index + label */}
        <motion.div
          initial={{ opacity: 0, x: rightAlign ? 10 : -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className={`relative flex items-center gap-4 mb-10 md:mb-12 ${rightAlign ? 'flex-row-reverse text-right' : ''}`}
        >
          <span className="text-[16px] md:text-[17px] font-primary font-bold tabular-nums" style={{ color: a.label, opacity: 0.55 }}>{index}</span>
          <span className="h-[2px] w-10 rounded-full" style={{ background: `linear-gradient(90deg, ${a.line}, transparent)` }} />
          <span className="text-[16px] md:text-[17px] uppercase tracking-[0.5em] font-primary" style={{ color: a.label }}>{label}</span>
        </motion.div>

        {/* Two-column balanced body */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-y-7 md:gap-x-16">
          {right && (
            <div
              className="hidden md:block absolute left-1/2 top-1 bottom-1 -translate-x-1/2 w-[1px] pointer-events-none"
              style={{ background: `linear-gradient(180deg, transparent, ${a.soft}0.45) 20%, ${a.soft}0.4) 50%, ${a.soft}0.45) 80%, transparent)` }}
            />
          )}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`whitespace-pre-line text-[16px] md:text-[17px] font-secondary leading-[1.85] text-white/95 tracking-wide md:pr-2 ${right ? '' : 'md:col-span-2 md:max-w-3xl'}`}
          >
            {left}
          </motion.p>
          {right && (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="whitespace-pre-line text-[16px] md:text-[17px] font-secondary leading-[1.85] text-white/80 tracking-wide md:pl-2"
            >
              {right}
            </motion.p>
          )}
        </div>
      </div>
    </motion.section>
  );
};

// ── CHIC STICKY SCROLLYTELLING COMPONENT ──

// ── CHIC STICKY SCROLLYTELLING COMPONENT ──

// ── PINNED SCROLL JACKED LAYOUT ──
const StickyScrollytellingGrid = ({ content }) => {
  const containerRef = useRef(null);
  
  // Track scroll progress purely within this specific section container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);
  
  // Parse content into sections
  const executionBlocks = content.solution2 ? content.solution2.split(/\n+/) : [];
  const strategicIntro = content.solution1 || (executionBlocks.length > 0 ? executionBlocks[0] : null);
  const remainingExecution = content.solution1 ? executionBlocks : executionBlocks.slice(1);

  const sections = [];
  if (content.about) {
    sections.push({
      id: 'about',
      word: 'ABOUT',
      color: 'cyan',
      subtitle: 'ABOUT THE BRAND',
      paragraphs: [content.about],
      borderColor: 'border-cyan-500/20',
      shadow: 'shadow-[0_0_50px_rgba(34,211,238,0.15)]',
      dotColor: 'bg-cyan-300',
      dotShadow: 'shadow-[0_0_15px_rgba(103,232,249,0.8)]',
      scanColor: 'via-cyan-400/20',
      hoverGrad: 'from-cyan-900/40 via-purple-900/10 to-transparent',
      textColor: 'text-cyan-400',
      lineColor: 'bg-cyan-400'
    });
  }
  if (content.problem) {
    sections.push({
      id: 'problem',
      word: 'PROBLEM',
      color: 'purple',
      subtitle: 'THE PROBLEM',
      paragraphs: [content.problem],
      borderColor: 'border-purple-500/20',
      shadow: 'shadow-[0_0_50px_rgba(168,85,247,0.15)]',
      dotColor: 'bg-purple-400',
      dotShadow: 'shadow-[0_0_15px_rgba(192,132,252,0.8)]',
      scanColor: 'via-purple-400/20',
      hoverGrad: 'from-purple-900/40 via-blue-900/10 to-transparent',
      textColor: 'text-purple-400',
      lineColor: 'bg-purple-400'
    });
  }
  if (strategicIntro || remainingExecution.length > 0) {
    const p = [];
    if (strategicIntro) p.push(strategicIntro);
    p.push(...remainingExecution);
    sections.push({
      id: 'solution',
      word: 'SOLUTION',
      color: 'blue',
      subtitle: 'SOLUTION',
      paragraphs: p,
      borderColor: 'border-blue-500/20',
      shadow: 'shadow-[0_0_50px_rgba(59,130,246,0.15)]',
      dotColor: 'bg-blue-400',
      dotShadow: 'shadow-[0_0_15px_rgba(96,165,250,0.8)]',
      scanColor: 'via-blue-400/20',
      hoverGrad: 'from-blue-900/40 via-cyan-900/10 to-transparent',
      textColor: 'text-blue-400',
      lineColor: 'bg-blue-400'
    });
  }

  // Update active slide based on scroll percentage within the container
  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      // Divide the total scroll progress by the number of sections
      const index = Math.min(sections.length - 1, Math.floor(v * sections.length));
      setActiveIndex(index);
    });
  }, [scrollYProgress, sections.length]);

  const activeData = sections[activeIndex];
  const [isOrbHovered, setIsOrbHovered] = useState(false);

  return (
    // The physical tall container that lets the user scroll. (e.g. 3 sections = 300vh)
    <section 
      ref={containerRef} 
      className="w-full relative" 
      style={{ height: `${sections.length * 100}vh`, clipPath: 'inset(0)' }}
    >
      
      {/* ── THE PINNED/STICKY VIEWPORT ── */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* SMOOTH DARKENING OVERLAY */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#01020a] to-[#010514] transition-colors duration-1000" />
        
        {/* SUBTLE GRID OVERLAY */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        {/* VOLUMETRIC LIGHT & PARTICLES */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Star particles */}
          <motion.div 
            animate={{ y: [0, -100] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIwLjUiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjI1MCIgcj0iMC41IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSIyODAiIGN5PSIxMjAiIHI9IjAuOCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC44Ii8+PGNpcmNsZSBjeD0iMzIwIiBjeT0iMzIwIiByPSIwLjUiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] opacity-40 mix-blend-screen h-[200%]" 
          />
          
          <motion.div 
            animate={{ opacity: [0.05, 0.1, 0.05], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/4 w-[50vw] h-[100vh] bg-gradient-to-b from-blue-400/5 to-transparent blur-[120px] transform -rotate-12"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_80%)]" />
        </div>

        {/* GIANT BACKGROUND TYPOGRAPHY — completely visible behind content */}
        <div className="absolute inset-0 z-0 flex items-center justify-start pointer-events-none pl-6 md:pl-12 lg:pl-[8%] overflow-hidden">
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], ['-2%', '2%']) }}
            className="w-full flex items-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeData.word}
                initial={{ opacity: 0, x: -50, filter: 'blur(8px)' }}
                animate={{ opacity: 0.45, x: 0, filter: 'blur(2px)' }}
                exit={{ opacity: 0, filter: 'blur(16px)' }}
                transition={{ 
                  opacity: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                  filter: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                }}
                className="absolute text-[16vw] md:text-[11vw] font-primary font-bold leading-none tracking-tight text-[#1e2e54] whitespace-nowrap origin-left mix-blend-screen"
              >
                {activeData.word}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="relative flex flex-col w-full max-w-[1400px] mx-auto px-6 md:px-12 z-10 h-full">
          
          {/* MOBILE STICKY HEADER (Simplified) */}
          <div className="lg:hidden absolute top-[80px] z-50 w-[calc(100%-3rem)] py-4 mb-8 px-6 flex justify-between items-center pointer-events-none">
             <AnimatePresence mode="wait">
                <motion.h2
                   key={activeData.word}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="text-sm font-secondary font-medium text-white/50 tracking-[0.3em] uppercase"
                >
                   {activeData.word}
                </motion.h2>
             </AnimatePresence>
          </div>

          {/* ASYMMETRICAL EDITORIAL CONTENT BLOCK (Spatial Orbital) */}
          <div className="w-full h-full flex items-center lg:justify-end relative z-20 pointer-events-none lg:-mr-10 xl:-mr-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeData.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[850px] pointer-events-auto relative lg:translate-x-6 xl:translate-x-12"
                onMouseEnter={() => setIsOrbHovered(true)}
                onMouseLeave={() => setIsOrbHovered(false)}
              >
                <div className="relative z-10 px-8 py-12 w-full rounded-[2rem] bg-[#050a15]/40 backdrop-blur-md shadow-2xl border border-white/5">
                  <SpatialOrbitalText activeData={activeData} isHovered={isOrbHovered} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

const PlanetarySwarm = ({ images, currentAssetIndex, setCurrentAssetIndex, title, subtext, worldMapImage }) => {
  const hasIntro = title || subtext;

  return (
    <div className="w-[100vw] relative left-1/2 -translate-x-1/2 mt-32 z-20">
      
      {hasIntro && (
        <div className="text-center mb-12 px-4">
          {title && <h2 className="text-4xl md:text-5xl font-primary text-white mb-4">{title}</h2>}
          {subtext && <p className="text-[16px] md:text-[17px] font-secondary uppercase tracking-[0.3em] text-white/50">{subtext}</p>}
          <div className="w-12 h-[1px] bg-white/30 mx-auto mt-5" />
        </div>
      )}

      <div 
        onClick={() => setCurrentAssetIndex(prev => (prev + 1) % images.length)}
        className="w-full h-[100vh] relative bg-transparent overflow-hidden flex items-center justify-center cursor-pointer group"
        style={{ 
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', 
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' 
        }}
      >
        {/* SciArt HUD Architectural Grid & Radar Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#22d3ee05_1px,transparent_1px),linear-gradient(to_bottom,#22d3ee05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(34,211,238,0.02)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none" />

        {/* World Map Background (SciArt Glowing Edition) */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: `url('${worldMapImage || 'https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg'}')`,
            backgroundSize: '90%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            // Turn black map white, then tint it cyan/blue with a massive glow drop-shadow
            filter: 'invert(1) sepia(1) hue-rotate(180deg) saturate(5) opacity(0.15) drop-shadow(0 0 30px rgba(34,211,238,0.6))'
          }}
        />

        {/* Ambient Core Energy Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none" />

        {/* The Orbiting Image Nodes */}
        {images.map((img, i) => {
          const isActive = i === currentAssetIndex;
          
          // Calculate elliptical orbital positions across the full width screen
          const angle = (i / images.length) * Math.PI * 2;
          const radiusX = 20 + (i % 3) * 8; // X spread (20% to 36% from center)
          const radiusY = 15 + (i % 3) * 8; // Y spread (15% to 31% from center)
          const swarmX = `calc(50% + ${Math.cos(angle) * radiusX}%)`;
          const swarmY = `calc(50% + ${Math.sin(angle) * radiusY}%)`;

          return (
            <motion.div
              key={img.key}
              layout
              initial={false}
              animate={{
                left: isActive ? '50%' : swarmX,
                top: isActive ? '50%' : swarmY,
                x: '-50%',
                y: '-50%',
                scale: isActive ? 1 : 0.4,
                opacity: isActive ? 1 : 0.4,
                filter: isActive ? 'blur(0px)' : 'blur(5px)',
                zIndex: isActive ? 50 : 10,
                rotateZ: isActive ? 0 : (i % 2 === 0 ? 5 : -5)
              }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 15,
                mass: 1.2,
              }}
              className={`absolute overflow-hidden ${isActive ? 'p-4 bg-black/60 backdrop-blur-3xl rounded-2xl border border-white/20 shadow-2xl' : 'bg-transparent border border-white/10 rounded-lg'}`}
              style={{
                 // Guaranteed not to crop when active!
                 width: isActive ? 'auto' : '200px',
                 height: isActive ? 'auto' : '200px',
                 maxWidth: isActive ? '80vw' : '200px',
                 maxHeight: isActive ? '75vh' : '200px',
              }}
            >
              <CaseStudyMedia
                 item={img}
                 alt={img.alt || `Memory Node ${i + 1}`}
                 className={`w-full h-full object-contain ${isActive ? 'max-h-[70vh] rounded-xl drop-shadow-2xl' : 'rounded-md opacity-80 mix-blend-screen'}`}
                 draggable={false}
                 sizes={isActive ? '80vw' : '200px'}
              />
            </motion.div>
          );
        })}



      </div>
    </div>
  );
};
// --- SVG CONNECTION PATH ---
// Draws a glowing bezier curve between points when scrolled into view
const FlowConnection = ({ d }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10%", once: true });

  return (
    <g ref={ref}>
      {/* Base faint line */}
      <path d={d} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      {/* Animated glowing line */}
      <motion.path
        d={d}
        fill="none"
        stroke="url(#glowGradient)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ filter: 'drop-shadow(0 0 8px rgba(200,100,255,0.8))' }}
      />
      {/* Flowing particle */}
      {isInView && (
        <motion.circle r="3" fill="#fff" style={{ filter: 'drop-shadow(0 0 10px #fff)' }}>
          <animateMotion dur="3s" repeatCount="indefinite" path={d} />
        </motion.circle>
      )}
    </g>
  );
};

// --- BENTO DASHBOARD LAYOUT ---
const SnowLeopardExperience = ({ navigate, project }) => {
  const images = normalizeMediaItems(project.fullStory?.media || project.fullStory?.images, project.client || 'Case study media');

  const heroImage = project.bannerVideo || project.fullStory?.heroVideo || project.bannerImage || project.fullStory?.heroImg || project.imageUrl;

  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentAssetIndex((prev) => (prev + 1) % images.length);
    }, 4500); // Cycles every 4.5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const reachTitle = asOptionalText(project.reachHeading) || asOptionalText(project.carouselTitle);
  const reachSubtext = asOptionalText(project.reachSubtext) || asOptionalText(project.carouselSubtext);
  const outcomeHeading = asOptionalText(project.outcomeHeading);
  const outcomeText = asOptionalText(project.outcomeText);
  const stats = (project.fullStory?.stats || []).map(getStatContent).filter(Boolean).slice(0, 2);

  const content = {
    about: asOptionalText(project.overview) || asOptionalText(project.challenge),
    problem: asOptionalText(project.fullStory?.challenge) || asOptionalText(project.challenge),
    solution1: asOptionalText(project.fullStory?.strategy) || asOptionalText(project.solution),
    solution2: asOptionalText(project.fullStory?.execution)
  };

  return (
    <div className="min-h-screen w-full relative overflow-clip bg-[#010d54] text-[#F4F4F5] font-primary selection:bg-purple-500/30">
      
      {/* --- AMBIENT MESH GRADIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: ['-10%', '10%', '-10%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-purple-900/40 mix-blend-screen blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], y: ['-10%', '20%', '-10%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/30 mix-blend-screen blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: ['20%', '-20%', '20%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-blue-500/20 mix-blend-screen blur-[100px]" 
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* --- NAVIGATION --- */}
      <div className="fixed top-28 left-8 z-50 flex items-center gap-3">
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2 text-[16px] md:text-[17px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>

      {/* --- TIGHT BENTO DASHBOARD --- */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-4 md:px-8 py-24 flex flex-col gap-6">

        {/* ROW 1: HERO (Main Character) */}
        <div className="w-full min-h-[60vh] md:min-h-[70vh] relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(129,140,248,0.2)] flex flex-col justify-between">
          {heroImage && (
            <div className="absolute inset-0 z-0">
              <CaseStudyMedia
                src={heroImage}
                alt={`${project.client || 'Case study'} hero`}
                className="w-full h-full object-cover"
                priority
                sizes="100vw"
                motionProps={{
                  initial: { scale: 1.05 },
                  animate: { scale: 1 },
                  transition: { duration: 10, ease: "easeOut" },
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#010d54] via-[#010d54]/40 to-transparent" />
            </div>
          )}
          <div className="pointer-events-none absolute left-1/2 top-5 z-20 -translate-x-1/2 px-3 md:top-6">
            <CaseStudySectorPill
              sector={project?.sector}
              className="border border-white/15 bg-[#010d54]/45 text-white/85 shadow-[0_14px_40px_rgba(0,0,0,0.24)] backdrop-blur-md"
            />
          </div>
        </div>

        <div className="flex flex-col items-center px-4 py-8 text-center md:py-10">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            data-case-study-title
            className="mb-6 max-w-[1200px] font-primary text-5xl font-medium leading-[0.9] tracking-tight text-white drop-shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:text-7xl lg:text-8xl"
          >
            {project?.client || project?.title || 'Case Study'}
          </motion.h1>
        </div>
      </div>

      {/* ── EXTREME SCI-ART SCROLLYTELLING SECTIONS (FULL WIDTH) ── */}
      <StickyScrollytellingGrid content={content} images={images} />

      {/* Re-open container for stats and planetary swarm */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col gap-6">

        {/* ROW 3: SATELLITES (Editorial Grid) */}
        {stats.length > 0 && (
        <div className="w-full mt-40 mb-20 relative z-20">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
              
              {stats.map((stat, index) => (
                <React.Fragment key={`${stat.label || stat.value}-${index}`}>
                  {index === 1 && (
                    <div className="hidden lg:block col-span-1 lg:col-span-2 flex justify-center">
                       <div className="w-[1px] h-64 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    </div>
                  )}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ margin: "-20%", once: true }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                    className={`col-span-1 ${stats.length === 1 ? 'lg:col-span-12' : 'lg:col-span-5'} flex flex-col justify-center border-t border-white/10 pt-12 ${index === 1 ? 'lg:mt-32' : ''}`}
                  >
                     <div className="flex items-baseline gap-6 mb-6">
                        <span className={`text-4xl md:text-5xl font-primary text-transparent bg-clip-text ${index === 0 ? 'bg-gradient-to-b from-cyan-400' : 'bg-gradient-to-b from-indigo-400'} to-transparent opacity-80 drop-shadow-2xl`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {stat.label && <h4 className="text-[16px] md:text-[17px] font-bold uppercase tracking-[0.4em] text-white/80">{stat.label}</h4>}
                     </div>
                     {stat.value && <p className="text-[16px] md:text-[17px] text-white/60 font-secondary leading-relaxed font-light">{stat.value}</p>}
                  </motion.div>
                </React.Fragment>
              ))}
           </div>
        </div>
        )}

        {/* ROW 4: INTERACTIVE 3D GLOBE ARCHIVE */}
        {images.length > 0 && (
          <PlanetarySwarm 
            images={images} 
            currentAssetIndex={currentAssetIndex} 
            setCurrentAssetIndex={setCurrentAssetIndex} 
            title={reachTitle}
            subtext={reachSubtext}
            worldMapImage={project?.worldMapImage}
          />
        )}

        {/* ── OPTIONAL HUGE PRE-VIDEO MEDIA (Image / GIF / Video) ── */}
        {(() => {
          const media = project?.preVideoMedia;
          const legacyImage = project?.preVideoImage;
          const hasMedia = media?.imageUrl || media?.videoUrl || legacyImage;
          if (!hasMedia) return null;

          const altText = media?.alt || 'Pre-video hero media';
          const isVideo = media?.mediaType === 'video' && media?.videoUrl;

          return (
            <section className="relative w-full z-10 pb-16 pt-8">
              <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-center">
                {isVideo ? (
                  <video
                    src={media.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-auto rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
                    aria-label={altText}
                  />
                ) : (
                  <CaseStudyMedia
                    src={media?.imageUrl || legacyImage}
                    alt={altText}
                    className="w-full h-auto object-cover rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
                  />
                )}
              </div>
            </section>
          );
        })()}

        {/* ── CINEMATIC VIDEO HERO & ADDITIONAL VIDEOS ── */}
        {(() => {
          const hasVideoHero = project?.videoHero?.enabled || hasVideoHeroSource(project?.videoHero);
          
          const allVideos = [];
          if (project?.videoSection?.videoUrl || project?.videoSection?.videoFileUrl) {
            allVideos.push({
              videoTitle: project.videoSection.videoTitle,
              videoSubtitle: project.videoSection.videoSubtitle,
              thumbnailUrl: project.videoSection.thumbnailUrl,
              videoUrl: getSafeEmbedUrl(project.videoSection.videoUrl),
              videoFileUrl: project.videoSection.videoFileUrl,
              orientation: project.videoSection.orientation
            });
          }
          if (project?.videoSection?.videos?.length > 0) {
            project.videoSection.videos.forEach(v => {
              allVideos.push({
                videoTitle: v.videoTitle,
                videoSubtitle: v.videoSubtitle,
                thumbnailUrl: v.thumbnailUrl,
                videoUrl: getSafeEmbedUrl(v.videoUrl),
                videoFileUrl: v.videoFileUrl,
                orientation: project.videoSection.orientation
              });
            });
          }

          if (!hasVideoHero && allVideos.length === 0) return null;
          
          const mainVideoData = hasVideoHero ? project.videoHero : {
            enabled: true,
            backgroundColor: 'transparent',
            backgroundText: project.client || 'Case Study',
            videoTitle: allVideos[0]?.videoTitle || 'Watch Video',
            videoSubtitle: allVideos[0]?.videoSubtitle || 'Experience the story in motion.',
            embedUrl: allVideos[0]?.videoUrl,
            uploadedVideoUrl: allVideos[0]?.videoFileUrl,
            thumbnailUrl: allVideos[0]?.thumbnailUrl
          };
          
          return (
            <CaseStudyVideoHero videoHero={mainVideoData} fallbackName={project.client} allVideos={allVideos} />
          );
        })()}

        {/* ROW 5: OUTCOME */}
        {(outcomeHeading || outcomeText) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-20%", once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-center mt-40 mb-32 relative z-20"
          >
            <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-white/30 mx-auto mb-12" />
            {outcomeHeading && (
              <h3 className="text-xl md:text-2xl font-primary text-white mb-6 leading-tight max-w-4xl mx-auto drop-shadow-2xl">
                {outcomeHeading}
              </h3>
            )}
            {outcomeText && (
              <p className="text-[16px] md:text-[17px] text-white/70 font-secondary max-w-3xl mx-auto leading-relaxed font-light">
                {outcomeText}
              </p>
            )}
            <div className="w-[1px] h-24 bg-gradient-to-t from-transparent to-white/30 mx-auto mt-12" />
          </motion.div>
        )}

      </div>
    </div>
  );
};

// ── SPATIAL ORBITAL TEXT COMPONENT ──

const SpatialOrbitalText = ({ activeData, isHovered }) => {
  const orbProgress = useMotionValue(0);
  
  useEffect(() => {
    // Orb descends, exits, pauses, and repeats seamlessly
    const controls = animate(orbProgress, [0, 1], {
      duration: isHovered ? 4.5 : 7,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 1.2,
      ease: "linear"
    });
    return () => controls.stop();
  }, [isHovered, orbProgress]);

  // Split on single or double newlines — Sanity text fields use \n between paragraphs
  const paragraphs = activeData.paragraphs.flatMap(p =>
    p.split(/\n+/).map(s => s.trim()).filter(s => s.length > 0)
  );

  const numItems = paragraphs.length;

  return (
    <div className="relative w-full pl-8 md:pl-12">

      {/* Ring centered directly on this text block */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen opacity-50"
        style={{ width: '850px', height: '850px' }}
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-cyan-400/30"
        >
          <div className="absolute top-[15%] left-[10%] w-[4px] h-[4px] bg-cyan-300 rounded-full shadow-[0_0_15px_#22d3ee]" />
          <div className="absolute bottom-[20%] right-[5%] w-[3px] h-[3px] bg-indigo-300 rounded-full shadow-[0_0_10px_#818cf8]" />
        </motion.div>
      </div>

      {/* EYEBROW TITLE */}
      <div className="mb-10 flex items-center gap-4 overflow-hidden relative z-10">
        <motion.span 
          key={`${activeData.id}-line`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className={`h-[1px] ${activeData.lineColor} opacity-70 origin-left`}
          style={{ width: '40px' }}
        />
        <motion.h3 
          key={`${activeData.id}-subtitle`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className={`text-[12px] md:text-[13px] uppercase tracking-[0.4em] ${activeData.textColor} font-semibold`}
        >
          {activeData.subtitle}
        </motion.h3>
      </div>

      {/* The Straight Orbit Path & Orb */}
      <div className="absolute left-0 top-3 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/15 to-transparent">
        {/* The gradually illuminating line trail behind the orb */}
        <motion.div 
          className={`absolute left-0 top-0 w-full ${activeData.lineColor} opacity-60`}
          style={{ height: useTransform(orbProgress, [0, 1], ['0%', '100%']) }}
        />
        
        {/* The glowing orb */}
        <motion.div 
          className={`absolute left-[-2.5px] w-[6px] h-[6px] rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] ${activeData.dotColor}`}
          style={{ top: useTransform(orbProgress, [0, 1], ['0%', '100%']) }}
        >
          <div className={`absolute inset-0 w-full h-full rounded-full blur-[2px] ${activeData.dotColor} shadow-[0_0_12px_${activeData.textColor}]`} />
        </motion.div>
        
        {/* Local Background Reaction Glow */}
        <motion.div
          className={`absolute left-[-150px] w-[300px] h-[300px] rounded-full blur-[80px] pointer-events-none mix-blend-screen opacity-15 ${activeData.dotColor}`}
          style={{ top: useTransform(orbProgress, [0, 1], ['0%', '100%']), y: '-50%' }}
        />
      </div>

      {/* The Paragraphs */}
      <div className="flex flex-col gap-8 text-[16px] md:text-[17px] font-secondary leading-[1.8] font-normal text-[#cbd5e1]">
        {paragraphs.map((paragraph, i) => {
          const center = numItems > 1 ? (i + 0.5) / numItems : 0.5;
          return (
            <ParagraphItem 
              key={i} 
              paragraph={paragraph} 
              center={center} 
              orbProgress={orbProgress} 
              textColor={activeData.textColor}
            />
          );
        })}
      </div>
    </div>
  );
};

const ParagraphItem = ({ paragraph, center, orbProgress }) => {
  // Orb is nearby when within +/- 0.25 of the paragraph's center to ensure smooth overlapping fades
  const range = [Math.max(0, center - 0.25), center, Math.min(1, center + 0.25)];
  
  const opacity = useTransform(orbProgress, range, [0.5, 1, 0.5]);
  const color = useTransform(orbProgress, range, ['#cbd5e1', '#ffffff', '#cbd5e1']);
  const y = useTransform(orbProgress, range, [10, 0, 10]);
  const textShadow = useTransform(orbProgress, range, ['none', '0 0 24px rgba(255,255,255,0.25)', 'none']);

  return (
    <motion.p 
      style={{ opacity, color, y, textShadow }}
      className="inline-block transition-colors duration-700 m-0"
    >
      {paragraph}
    </motion.p>
  );
};

export default SnowLeopardExperience;
