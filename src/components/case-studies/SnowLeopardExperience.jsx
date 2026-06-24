import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import createGlobe from 'cobe';
import CaseStudyVideoHero from './CaseStudyVideoHero';
import { getSafeEmbedUrl } from '../../lib/videoUtils';
import CaseStudyMedia, { normalizeMediaItems } from './CaseStudyMedia';

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

const PlanetarySwarm = ({ images, currentAssetIndex, setCurrentAssetIndex, title, subtext }) => {
  const hasIntro = title || subtext;

  return (
    <div className="w-[100vw] relative left-1/2 -translate-x-1/2 mt-32 z-20">
      
      {hasIntro && (
        <div className="text-center mb-12 px-4">
          {title && <h2 className="text-3xl md:text-4xl font-primary text-white mb-4">{title}</h2>}
          {subtext && <p className="text-sm font-secondary uppercase tracking-[0.3em] text-white/50">{subtext}</p>}
          <div className="w-12 h-[1px] bg-white/30 mx-auto mt-5" />
        </div>
      )}

      <div 
        onClick={() => setCurrentAssetIndex(prev => (prev + 1) % images.length)}
        className="w-full h-[100vh] relative bg-[#010d54] overflow-hidden border-t border-b border-white/5 shadow-2xl flex items-center justify-center cursor-pointer group"
      >
        {/* SciArt HUD Architectural Grid & Radar Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#22d3ee05_1px,transparent_1px),linear-gradient(to_bottom,#22d3ee05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(34,211,238,0.02)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none" />

        {/* World Map Background (SciArt Glowing Edition) */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')",
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
          const radiusX = 35 + (i % 3) * 10; // X spread (35% to 55% from center)
          const radiusY = 25 + (i % 3) * 10; // Y spread (25% to 45% from center)
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

  const { scrollYProgress } = useScroll();
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, 400]);

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
    <div className="min-h-screen w-full relative overflow-hidden bg-[#010d54] text-[#F4F4F5] font-primary selection:bg-purple-500/30">
      
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
        <button onClick={() => navigate('home')} className="text-white/60 hover:text-white flex items-center gap-2 text-sm backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary">
          <ArrowLeft className="w-4 h-4" /> Home
        </button>
        <button onClick={() => navigate('work')} className="text-white/60 hover:text-white flex items-center gap-2 text-sm backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary">
          <ArrowLeft className="w-4 h-4" /> All Case Studies
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
          <div className="relative z-10 w-full p-6 md:p-10 flex justify-between items-start">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
              <h1 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-white">{project.client}</h1>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 hidden md:block">
              <span className="text-xs uppercase tracking-widest text-white/70 font-secondary">{project.sector || "Conservation"}</span>
            </motion.div>
          </div>
          
        </div>

        {/* ── ABOUT THE BRAND ── Premium Editorial Card Below Hero ── */}
        {content.about && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full mt-20 md:mt-32 px-4 md:px-0"
          >
            <div className="max-w-5xl mx-auto relative">
              {/* Deep purple card with contrast */}
              <div className="relative rounded-[28px] md:rounded-[36px] overflow-hidden shadow-[0_12px_80px_rgba(99,102,241,0.25),0_0_0_1px_rgba(129,140,248,0.15)]"
                style={{ background: 'linear-gradient(145deg, #0f0a2e 0%, #150d3a 40%, #0d1445 100%)' }}>

                {/* Inner border glow */}
                <div className="absolute inset-0 rounded-[28px] md:rounded-[36px] pointer-events-none"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(129,140,248,0.2), inset 0 -1px 0 rgba(34,211,238,0.1), inset 1px 0 0 rgba(129,140,248,0.1), inset -1px 0 0 rgba(129,140,248,0.1)' }}
                />

                {/* Ambient glow orbs — more vivid */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.45, 0.25] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-24 -right-24 w-[350px] h-[350px] rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)' }}
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)' }}
                />

                {/* Glowing left accent bar — bolder */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 top-[10%] bottom-[10%] w-[4px] origin-top rounded-r-full"
                  style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.3), #22D3EE, #818CF8, rgba(139,92,246,0.3))', boxShadow: '0 0 20px rgba(34,211,238,0.5), 0 0 40px rgba(99,102,241,0.2)' }}
                />

                <div className="relative z-10 p-8 md:p-14 lg:p-16 flex flex-col md:flex-row gap-8 md:gap-14 items-start">

                  {/* Large decorative quote mark — more visible */}
                  <div className="shrink-0 hidden md:flex flex-col items-center gap-6 pt-2">
                    <svg width="52" height="44" viewBox="0 0 48 40" fill="none" className="opacity-50 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                      <path d="M0 40V24.8C0 20.267 0.8 16.133 2.4 12.4C4.133 8.533 6.533 5.333 9.6 2.8C12.8 0.133 16.533 -1.2 20.8 -1.2V6.4C18.133 6.4 15.733 7.467 13.6 9.6C11.6 11.733 10.6 14.133 10.6 16.8H20V40H0ZM28 40V24.8C28 20.267 28.8 16.133 30.4 12.4C32.133 8.533 34.533 5.333 37.6 2.8C40.8 0.133 44.533 -1.2 48.8 -1.2V6.4C46.133 6.4 43.733 7.467 41.6 9.6C39.6 11.733 38.6 14.133 38.6 16.8H48V40H28Z" fill="url(#quoteGrad)"/>
                      <defs>
                        <linearGradient id="quoteGrad" x1="0" y1="0" x2="48" y2="40" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#22D3EE"/>
                          <stop offset="0.5" stopColor="#818CF8"/>
                          <stop offset="1" stopColor="#A78BFA"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Vertical dotted line connector */}
                    <div className="w-[1px] flex-1 min-h-[40px]" style={{ backgroundImage: 'repeating-linear-gradient(180deg, rgba(139,92,246,0.5) 0px, rgba(139,92,246,0.5) 4px, transparent 4px, transparent 10px)' }} />
                  </div>

                  {/* Content block */}
                  <div className="flex-1 flex flex-col gap-6">
                    {/* Label */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <span className="w-10 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, #22D3EE, rgba(129,140,248,0.4))' }} />
                      <span className="text-xs uppercase tracking-[0.5em] font-primary" style={{ color: '#A5B4FC' }}>
                        About the Brand
                      </span>
                    </motion.div>

                    {/* Main text */}
                    <p className="text-lg md:text-xl font-secondary leading-relaxed text-white/95 tracking-wide">
                      {content.about}
                    </p>

                    {/* Client name tag */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="flex items-center gap-3 mt-4 pt-5"
                      style={{ borderTop: '1px solid rgba(129,140,248,0.15)' }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.6)] animate-pulse" style={{ background: 'linear-gradient(135deg, #22D3EE, #818CF8)' }} />
                      <span className="text-xs uppercase tracking-[0.3em] font-primary" style={{ color: '#C4B5FD' }}>
                        {project.client}
                      </span>
                      <span className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(129,140,248,0.15), transparent)' }} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ROW 2: CHALLENGE & STRATEGY (Cinematic Parallax Typography) */}
        {(content.problem || content.solution1 || content.solution2) && (
        <div className="w-full mt-40 relative z-20 flex flex-col gap-40 md:gap-64 px-4 md:px-0">
          
          {/* Challenge Parallax Node */}
          {content.problem && (
          <div className="relative w-full min-h-[50vh] flex items-center">
            {/* Massive Parallax Watermark */}
            <motion.div 
               style={{ y: parallaxY1 }}
               className="absolute left-[-5%] md:left-[-10%] top-[-20%] text-[12vw] font-primary font-bold text-white/[0.03] leading-none whitespace-nowrap pointer-events-none uppercase tracking-tighter"
            >
               Challenge
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20%", once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-2xl pl-8 md:pl-16 border-l-[1px] border-cyan-500/50"
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.5em] text-cyan-400 mb-12 flex items-center gap-4 font-primary">
                 <span className="w-8 h-[1px] bg-cyan-400/50" />
                 Context
              </h3>
              <p className="text-xl md:text-2xl lg:text-3xl font-primary text-white leading-[1.6] tracking-tight drop-shadow-2xl">
                {content.problem}
              </p>
            </motion.div>
          </div>
          )}

          {/* Strategic Shift Parallax Node */}
          {(content.solution1 || content.solution2) && (
          <div className="relative w-full min-h-[50vh] flex items-center justify-end mt-16 md:mt-32">
            <motion.div 
               style={{ y: parallaxY2 }}
               className="absolute right-[-5%] md:right-[-10%] top-[-20%] text-[12vw] font-primary font-bold text-white/[0.03] leading-none whitespace-nowrap pointer-events-none uppercase tracking-tighter"
            >
               Evolution
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20%", once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-4xl pr-8 md:pr-16 border-r-[1px] border-indigo-500/50 text-right"
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.5em] text-indigo-400 mb-12 flex items-center justify-end gap-4 font-primary">
                 Strategic Shift
                 <span className="w-8 h-[1px] bg-indigo-400/50" />
              </h3>
              {content.solution1 && (
                <p className="text-xl md:text-2xl lg:text-3xl font-primary text-white leading-[1.6] tracking-tight drop-shadow-2xl mb-8">
                  {content.solution1}
                </p>
              )}
              {content.solution2 && (
                <p className="text-xl md:text-2xl lg:text-3xl font-primary text-white leading-[1.6] tracking-tight drop-shadow-2xl">
                  {content.solution2}
                </p>
              )}
            </motion.div>
          </div>
          )}
        </div>
        )}

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
                        <span className={`text-4xl md:text-6xl font-primary text-transparent bg-clip-text ${index === 0 ? 'bg-gradient-to-b from-cyan-400' : 'bg-gradient-to-b from-indigo-400'} to-transparent opacity-80 drop-shadow-2xl`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {stat.label && <h4 className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-white/80">{stat.label}</h4>}
                     </div>
                     {stat.value && <p className="text-sm md:text-base text-white/60 font-secondary leading-relaxed font-light">{stat.value}</p>}
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
          />
        )}

        {/* ── CINEMATIC VIDEO HERO & ADDITIONAL VIDEOS ── */}
        {(() => {
          const hasVideoHero = project?.videoHero?.enabled;
          
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
            backgroundColor: '#010d54', // Match SnowLeopard bg
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
              <h3 className="text-2xl md:text-4xl font-primary text-white mb-6 leading-tight max-w-4xl mx-auto drop-shadow-2xl">
                {outcomeHeading}
              </h3>
            )}
            {outcomeText && (
              <p className="text-base md:text-lg text-white/70 font-secondary max-w-3xl mx-auto leading-relaxed font-light">
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

export default SnowLeopardExperience;
