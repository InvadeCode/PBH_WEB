import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GlobalContext } from '../../App';
import CaseStudyVideoHero from './CaseStudyVideoHero';
import CaseStudyMedia, { normalizeMediaItems } from './CaseStudyMedia';
import CaseStudySectorPill from './CaseStudySectorPill';
import { getSafeEmbedUrl } from '../../lib/videoUtils';
import MediaRibbon3D from './MediaRibbon3D';

const palette = {
  bgDeep: '#010d54',
  panel: '#0c185c',
  primary: '#6865fa',
  secondary: '#d4cefc',
  blue: '#2a97d9',
  accent: '#ffcd00',
  purple: '#af73dd',
  green: '#93d435',
  orange: '#b9d5ff',
  text: '#F4F4F5'
};

/* --- 1. Chic Ambient Glows --- */
const ChicAmbientBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div
      animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen blur-[120px]"
      style={{ background: `radial-gradient(circle, ${palette.primary}40 0%, transparent 60%)` }}
    />
    <motion.div
      animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen blur-[120px]"
      style={{ background: `radial-gradient(circle, ${palette.secondary}30 0%, transparent 60%)` }}
    />
  </div>
);

/* --- 2. Pleasant Elegant Fade --- */
const ElegantFade = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 1.2, delay, ease: [0.25, 1, 0.5, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const getUrlAspectRatio = (url) => {
  if (!url) return null;
  const match = url.match(/-(\d+)x(\d+)\.[a-z0-9]+(?:\?|$)/i);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return width > 0 && height > 0 ? width / height : null;
};

const getDimensionsAspectRatio = (dimensions) => {
  const ratio = dimensions?.aspectRatio;
  if (Number.isFinite(ratio) && ratio > 0) return ratio;
  const width = Number(dimensions?.width);
  const height = Number(dimensions?.height);
  return width > 0 && height > 0 ? width / height : null;
};

/* --- 3. Creative Hero Entrance --- */
const CreativeHeroReveal = ({ src, alt, aspectRatio }) => {
  const resolvedAspectRatio = aspectRatio || getUrlAspectRatio(src) || 16 / 9;

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-[#0c185c]/70">
      <CaseStudyMedia
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        priority
        sizes="(min-width: 1280px) 1280px, 95vw"
      />
    </div>
  );
};

/* --- 4. Hover Float Card --- */
const HoverFloatCard = ({ children, className }) => {
  return (
    <motion.div
      whileHover={{ y: -15, scale: 1.01 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const PBHVerticalBands = ({ variant }) => {
  const isSolution = variant === 'solution';
  const isProblem = variant === 'problem';
  
  const primary = '#6865fa';
  const cyan = '#2a97d9';
  const purple = '#af73dd';
  const light = '#d4cefc';
  
  const c1 = isSolution ? cyan : isProblem ? purple : primary;
  const c2 = isSolution ? purple : isProblem ? cyan : cyan;
  const c3 = light;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#010836]">
      <motion.div 
        animate={{ x: ['0px', '-1000px'] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 bottom-0 left-0 w-[300vw] opacity-80"
        style={{
          backgroundSize: '1000px 100%',
          backgroundImage: `repeating-linear-gradient(90deg, 
            ${c1} 0%, 
            ${c1} 1%, 
            ${c2} 1%, 
            ${c2} 2.5%, 
            #010836 2.5%, 
            #010836 4%, 
            ${c1} 4%, 
            ${c1} 8%, 
            transparent 8%, 
            transparent 12%,
            ${c3} 12%,
            ${c3} 15%,
            transparent 15%,
            transparent 22%,
            ${c2} 22%,
            ${c2} 23%,
            transparent 23%,
            transparent 30%
          )`
        }}
      />
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3], scaleX: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 bottom-0 left-[-10%] w-[60%] blur-[120px] origin-left"
        style={{ background: `linear-gradient(90deg, ${c1}, ${c2}, transparent)` }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-[#010836]/90 to-[#010836]" />
      <div className="absolute inset-0 z-10 bg-gradient-to-l from-[#010836]/80 via-transparent to-transparent opacity-60" />
    </div>
  );
};

const SolutionGraphic = () => <PBHVerticalBands variant="solution" />;

/* --- 6. Animated Parallax Ecosystem Image --- */
const ParallaxImage = ({ src, alt, delay = 0, yOffset = 50, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const y = useTransform(smoothProgress, [0, 1], [-yOffset, yOffset]);

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: 'inset(100% 0 0 0)', scale: 0.95 }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 1.6, delay, ease: [0.25, 1, 0.5, 1] }}
      className={`w-full relative group overflow-hidden bg-[#0C185C] flex items-center justify-center rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 ${className}`}
    >
      <CaseStudyMedia
        src={src}
        alt={alt}
        className="w-full h-auto object-cover transition-transform duration-[2s] opacity-90 group-hover:opacity-100 scale-[1.15] group-hover:scale-[1.2]"
        sizes="(min-width: 1024px) 50vw, 100vw"
        motionProps={{ style: { y: useTransform(smoothProgress, [0, 1], [-yOffset/1.5, yOffset/1.5]) } }}
      />
      
      {/* Creative Glassmorphism Overlay on Hover */}
      <div className="absolute inset-0 bg-[#0C185C]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none">
        <div className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_30px_rgba(255,255,255,0.1)]">
           <svg className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
           </svg>
        </div>
      </div>
    </motion.div>
  );
};

/* --- 7. Dramatic Scrollytelling Sections --- */
const AboutGraphic = () => <PBHVerticalBands variant="about" />;
const ProblemGraphic = () => <PBHVerticalBands variant="problem" />;

const DramaticSection = ({ title, content, motionGraphic }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const spring = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Phase 1: Title appears and holds (0 → 0.25), then fades out (0.25 → 0.35)
  const titleOpacity = useTransform(spring, [0, 0.05, 0.25, 0.35], [0, 1, 1, 0]);
  const titleScale = useTransform(spring, [0, 0.05, 0.25, 0.35], [0.9, 1, 1, 1.15]);
  const titleY = useTransform(spring, [0, 0.05, 0.25, 0.35], [40, 0, 0, -40]);
  
  // Phase 2: Circle expands dramatically (0.15 → 0.6) — starts small, grows huge
  const graphicScale = useTransform(spring, [0, 0.15, 0.55, 1], [0.6, 0.8, 2.8, 3.5]);
  const graphicOpacity = useTransform(spring, [0, 0.1, 0.2, 0.85, 1], [0.3, 0.5, 1, 1, 0.4]);
  
  // Phase 3: Content fades in AFTER circle has expanded (0.4 → 0.55), holds until 0.88, fades out
  const contentOpacity = useTransform(spring, [0.4, 0.55, 0.88, 1], [0, 1, 1, 0]);
  const contentY = useTransform(spring, [0.4, 0.55, 0.88, 1], [50, 0, 0, -40]);

  return (
    <section ref={ref} className="h-[250vh] relative w-full">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Circular graphic — scales dramatically from small to huge */}
        <motion.div style={{ scale: graphicScale, opacity: graphicOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {motionGraphic}
        </motion.div>

        {/* Ambient Edge Masking */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#010d54] to-transparent z-[1] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#010d54] to-transparent z-[1] pointer-events-none" />
        
        {/* Phase 1: Title Container — appears first, fades before content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div style={{ opacity: titleOpacity, scale: titleScale, y: titleY }} className="flex flex-col items-center justify-center w-full px-6 text-center pointer-events-auto">
            <motion.h2 
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="font-primary text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(104,101,250,0.5)]" 
              style={{ 
                backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #6865FA 45%, #D4CEFC 50%, #6865FA 55%, #FFFFFF 70%, #FFFFFF 100%)',
                backgroundSize: '300% auto',
              }}
            >
              {title}
            </motion.h2>
          </motion.div>
        </div>
        
        {/* Phase 3: Content Container — appears after circle has expanded */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <motion.div style={{ opacity: contentOpacity, y: contentY }} className="w-full max-w-4xl px-6 md:px-12 text-center flex flex-col items-center pointer-events-auto">
            <h3 className="text-[17px] md:text-[19px] tracking-widest uppercase text-[#D4CEFC] mb-6 md:mb-8 font-bold font-primary">
               {title}
            </h3>
            <p className="text-white/90 font-normal text-[17px] md:text-[19px] max-w-3xl mx-auto leading-relaxed md:leading-relaxed font-secondary">
              {content}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ── Ecosystem Highlights carousel ──────────────────────────────────────────
   Seamless infinite horizontal carousel. Each card keeps the media's EXACT
   aspect ratio from Sanity (square stays square, rectangle stays rectangle —
   never a circle) and its exact format (image / gif / video) via CaseStudyMedia.
   Native scroll (mobile swipe works) + jump-free wrap; pauses on hover/touch. */
const getMediaAspect = (m) => {
  const ar = m?.source?.metadata?.dimensions?.aspectRatio;
  return (typeof ar === 'number' && ar > 0) ? ar : 4 / 3;
};

const EcosystemCarousel = ({ media }) => {
  const containerRef = useRef(null);
  const firstSetRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let raf;
    let last = performance.now();
    const speed = 0.45; // px per ~16ms frame
    const loop = (time) => {
      const dt = time - last;
      last = time;
      const el = containerRef.current;
      if (el && !paused) {
        el.scrollLeft += speed * (dt / 16);
        const w = firstSetRef.current?.offsetWidth || 0;
        if (w > 0 && el.scrollLeft >= w) el.scrollLeft -= w; // seamless wrap
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  if (!media || media.length === 0) return null;

  const renderCard = (m, i, prefix) => (
    <figure
      key={`${prefix}-${m.key || i}`}
      className="group relative shrink-0 h-[clamp(220px,34vh,440px)] rounded-[20px] overflow-hidden ring-1 ring-white/10 bg-[#0C185C] shadow-[0_28px_70px_-24px_rgba(0,0,0,0.75)]"
      style={{ aspectRatio: getMediaAspect(m) }}
    >
      <CaseStudyMedia
        item={m}
        alt={m.alt}
        className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
        sizes="(min-width: 768px) 42vw, 82vw"
      />
      <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/5" />
    </figure>
  );

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      className="flex overflow-x-auto pb-4 eco-hide-scrollbar"
      style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      <div ref={firstSetRef} className="flex items-center gap-5 md:gap-7 pr-5 md:pr-7 shrink-0">
        {media.map((m, i) => renderCard(m, i, 'a'))}
      </div>
      <div className="flex items-center gap-5 md:gap-7 pr-5 md:pr-7 shrink-0" aria-hidden="true">
        {media.map((m, i) => renderCard(m, i, 'b'))}
      </div>
      <style dangerouslySetInnerHTML={{ __html: '.eco-hide-scrollbar::-webkit-scrollbar{display:none}' }} />
    </div>
  );
};


const AriseVenturesExperience = ({ navigate, project }) => {
  const { SITE_SETTINGS } = React.useContext(GlobalContext) || {};
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const heroImg = project?.bannerVideo || project?.fullStory?.heroVideo || project?.bannerImage || project?.fullStory?.heroImg || project?.imageUrl || '';
  
  // Standardize banner size across all case studies to prevent layout fluctuations
  const heroAspectRatio = 16 / 9;
  
  const cmsMedia = normalizeMediaItems(project?.fullStory?.media || project?.fullStory?.images, project?.client || 'Case study media');

  // When `videoHero` is filled in Sanity (enabled = true), the CMS data takes over automatically.
  // We no longer use a fallback demo; it only renders if Sanity data is explicitly provided.
  const videoHeroData = project?.videoHero?.enabled ? project.videoHero : null;

  return (
    <div className="w-full min-h-screen font-secondary selection:bg-[#6865FA] selection:text-white" style={{ backgroundColor: palette.bgDeep, color: palette.text }}>
      <ChicAmbientBackground />

      {/* Navigation */}
      <div className="fixed top-0 left-0 w-full z-50 px-6 pt-28 pb-6 md:px-12 md:pt-32 md:pb-8 flex items-center gap-3 pointer-events-none">
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2 text-[17px] md:text-[19px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>

      {/* ── 1. CINEMATIC HERO (Boxed) ── */}
      <section className="relative w-full flex flex-col items-center justify-start z-10 pb-20 md:pb-24 pt-10 px-4 md:px-8">
        
        {/* Floating Box Hero Banner */}
        <div
          className="relative w-full max-w-[95vw] md:max-w-7xl mx-auto rounded-[30px] md:rounded-[50px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
          style={{ aspectRatio: heroAspectRatio }}
        >
           {heroImg ? (
             <CreativeHeroReveal
               src={heroImg}
               alt={`${project?.client || 'Case Study'} Banner`}
               aspectRatio={heroAspectRatio}
             />
           ) : (
             <div className="w-full h-full bg-[#0C185C]" />
           )}
          <div className="pointer-events-none absolute left-1/2 top-24 z-20 -translate-x-1/2 px-3 md:top-28">
            <CaseStudySectorPill
              sector={project?.sector}
              className="border border-white/[0.16] bg-[#010d54]/45 text-white/85 shadow-[0_14px_40px_rgba(0,0,0,0.24)] backdrop-blur-md"
            />
          </div>
        </div>

        {/* Text Below the Banner Box */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 mt-12 md:mt-16">
          <ElegantFade delay={0.4} className="mb-6 flex flex-wrap justify-center gap-4">
            {(project?.tags || project?.roles || ['Branding', 'Visual Identity', 'Collateral']).map((tag, i) => (
              <span key={i} className="px-6 py-2 rounded-full border border-white/10 text-[17px] md:text-[19px] tracking-widest uppercase font-bold text-white/80 bg-white/5 backdrop-blur-md shadow-lg font-primary">
                {tag}
              </span>
            ))}
          </ElegantFade>

          <ElegantFade delay={0.2}>
            <motion.h1 
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="font-primary text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-transparent bg-clip-text font-medium tracking-tight drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
              style={{ 
                backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #D4CEFC 45%, #6865FA 50%, #D4CEFC 55%, #FFFFFF 70%, #FFFFFF 100%)',
                backgroundSize: '300% auto',
              }}
            >
              {project?.client || 'Arise Ventures'}
            </motion.h1>
          </ElegantFade>
        </div>
      </section>

      {/* ── 1.5 CASE STUDY VIDEO HERO (CMS-driven, reusable) ── */}
      <CaseStudyVideoHero videoHero={videoHeroData} fallbackName={project?.client || 'Arise Ventures'} />

      {/* ── 2. DRAMATIC: ABOUT THE BRAND ── */}
      {(project?.overview || project?.fullStory?.overview) && (
        <div className="relative w-full flex flex-col lg:flex-row justify-start items-center py-16 gap-8 lg:gap-12 px-[5%] lg:px-[10%]">
          <motion.div 
            initial={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex justify-center items-center overflow-visible relative"
          >
            <div className="relative">
              {/* Subtle Grid behind text */}
              <div className="absolute inset-[-20%] bg-[linear-gradient(rgba(212,206,252,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,206,252,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] z-0 pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)' }} />
              
              {/* Subtle Ghost Text Behind */}
              <motion.span 
                animate={{ y: [-15, 15, -15], scale: [1, 1.05, 1], opacity: [0.03, 0.08, 0.03] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-0 left-0 block text-[4.5rem] md:text-[6.5rem] lg:text-[7.5rem] xl:text-[9rem] font-black leading-none select-none tracking-tighter whitespace-nowrap text-transparent"
                style={{ WebkitTextStroke: '2px rgba(212,206,252,0.08)' }}
              >
                ABOUT
              </motion.span>
              
              {/* Main Text */}
              <motion.span 
                animate={{ y: [-5, 5, -5], scale: [1, 1.02, 1], rotateZ: [-1, 1, -1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="relative block text-[4.5rem] md:text-[6.5rem] lg:text-[7.5rem] xl:text-[9rem] font-black text-[#D4CEFC]/10 leading-none select-none tracking-tighter whitespace-nowrap drop-shadow-[0_0_40px_rgba(212,206,252,0.2)] mix-blend-screen z-10"
              >
                ABOUT
              </motion.span>
              
              {/* Aesthetic Motion Graphic */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full scale-[1.5] blur-[10px] opacity-20">
                <AboutGraphic />
              </div>
              
              {/* Elegant vertical scan line */}
              <motion.div
                animate={{ x: ['0%', '100%', '0%'] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-[#D4CEFC]/30 to-transparent z-20 shadow-[0_0_15px_rgba(212,206,252,0.5)]"
              />
              
              {/* Very Subtle decorative gradient corner */}
              <div className="absolute -left-4 top-0 w-[20px] h-[20px] border-t border-l border-[#D4CEFC]/10 rounded-tl-lg" />
              <div className="absolute -right-4 bottom-0 w-[20px] h-[20px] border-b border-r border-[#D4CEFC]/10 rounded-br-lg" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="w-full lg:w-3/5 lg:max-w-2xl xl:max-w-3xl shrink-0 bg-[#010a40]/60 backdrop-blur-md p-8 md:p-12 border border-cyan-500/20 relative overflow-hidden group z-10 shadow-[0_0_50px_rgba(34,211,238,0.15)] rounded-2xl"
          >
            {/* Dynamic Graphic: Floating Dot inside box */}
            <motion.div 
              animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }} 
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 right-8 w-3 h-3 rounded-full bg-[#6865FA] shadow-[0_0_15px_rgba(104,101,250,0.8)] z-0" 
            />

            {/* Scanning Line Animation inside box */}
            <motion.div 
              animate={{ top: ['-10%', '110%'] }} 
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#6865FA]/20 to-transparent z-0 pointer-events-none" 
            />
            
            {/* Gradient sweep background */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-[#6865FA]/20 via-[#2a97d9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" 
            />
            
            <div className="relative z-10">
              <h3 className="text-[17px] md:text-[19px] uppercase tracking-[0.4em] text-[#6865FA] font-bold mb-6 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-[#6865FA]" /> 
                {project?.overviewHeading || SITE_SETTINGS?.csAboutBrand || "The Brand."}
              </h3>
              <p className="text-[17px] md:text-[19px] font-secondary leading-[1.8] text-white/90 drop-shadow-sm font-light">
                {project.overview || project.fullStory?.overview}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── 3. DRAMATIC: THE QUESTION ── */}
      {(project?.challenge || project?.fullStory?.challenge) && (
        <div className="relative w-full flex flex-col-reverse lg:flex-row justify-start items-center py-16 gap-8 lg:gap-12 px-[5%] lg:px-[10%]">
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
            className="w-full lg:w-3/5 lg:max-w-2xl xl:max-w-3xl shrink-0 bg-[#010a40]/60 backdrop-blur-md p-8 md:p-12 border border-purple-500/20 relative overflow-hidden group z-10 shadow-[0_0_50px_rgba(168,85,247,0.15)] rounded-2xl"
          >
            {/* Subtle Breathing Glow */}
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }} 
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[80px] pointer-events-none z-0" 
            />

            <div className="relative z-10">
              <h3 className="text-[17px] md:text-[19px] uppercase tracking-[0.4em] text-[#D4CEFC] font-bold mb-6 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-[#D4CEFC]" /> 
                {project?.challengeHeading || SITE_SETTINGS?.csTheQuestion || "The Question."}
              </h3>
              <p className="text-[17px] md:text-[19px] font-secondary leading-[1.8] text-white/90 drop-shadow-sm font-light">
                {project.challenge || project.fullStory?.challenge}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="flex-1 flex justify-center items-center overflow-visible relative"
          >
            <div className="relative">
              {/* Subtle Grid behind text */}
              <div className="absolute inset-[-20%] bg-[linear-gradient(rgba(212,206,252,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,206,252,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] z-0 pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)' }} />
              
              {/* Subtle Ghost Text Behind */}
              <motion.span 
                animate={{ y: [15, -15, 15], scale: [1, 1.05, 1], opacity: [0.03, 0.08, 0.03] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-0 left-0 block text-[4.5rem] md:text-[6.5rem] lg:text-[7.5rem] xl:text-[8.5rem] font-black leading-none select-none tracking-tighter whitespace-nowrap text-transparent"
                style={{ WebkitTextStroke: '2px rgba(212,206,252,0.08)' }}
              >
                PROBLEM
              </motion.span>

              {/* Main Text */}
              <motion.span 
                animate={{ y: [5, -5, 5], scale: [1, 1.02, 1], rotateZ: [1, -1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="relative block text-[4.5rem] md:text-[6.5rem] lg:text-[7.5rem] xl:text-[8.5rem] font-black text-[#D4CEFC]/10 leading-none select-none tracking-tighter whitespace-nowrap drop-shadow-[0_0_40px_rgba(212,206,252,0.2)] mix-blend-screen z-10"
              >
                PROBLEM
              </motion.span>
              
              {/* Aesthetic Motion Graphic */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full scale-[1.5] blur-[10px] opacity-20">
                <ProblemGraphic />
              </div>

              {/* Elegant vertical scan line */}
              <motion.div
                animate={{ x: ['100%', '0%', '100%'] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-[#D4CEFC]/30 to-transparent z-20 shadow-[0_0_15px_rgba(212,206,252,0.5)]"
              />
              
              {/* Very Subtle decorative gradient corner */}
              <div className="absolute -left-4 bottom-0 w-[20px] h-[20px] border-b border-l border-[#D4CEFC]/10 rounded-bl-lg" />
              <div className="absolute -right-4 top-0 w-[20px] h-[20px] border-t border-r border-[#D4CEFC]/10 rounded-tr-lg" />
            </div>
          </motion.div>
        </div>
      )}

      {/* ── 4. DRAMATIC: CREATIVE SOLUTION ── */}
      {(project?.solution || project?.fullStory?.execution) && (
        <DramaticSection 
          title={project?.solutionHeading || SITE_SETTINGS?.csCreativeSolution || "Creative Solution."}
          content={
            <div className="flex flex-col gap-6">
              {project?.solution && <span>{project.solution}</span>}
              {project?.fullStory?.execution && <span>{project.fullStory.execution}</span>}
            </div>
          }
          motionGraphic={<SolutionGraphic />}
        />
      )}

      {/* ── 5. STATEMENT ── */}
      {(project?.results?.length > 0) && (
        <section className="py-16 px-6 md:px-12 text-center relative z-10">
          <div className="max-w-[1000px] mx-auto">
            <ElegantFade>
              <h2 className="font-primary text-xl md:text-2xl leading-[1.4] text-white tracking-tight">
                "{project.results[0]}"
              </h2>
            </ElegantFade>
          </div>
        </section>
      )}

      {/* ── 5.4 OPTIONAL HUGE PRE-VIDEO MEDIA (Image / GIF / Video) ── */}
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
                  className="w-full h-auto rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
                  aria-label={altText}
                />
              ) : (
                <CaseStudyMedia
                  src={media?.imageUrl || legacyImage}
                  alt={altText}
                  className="w-full h-auto rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
                  sizes="100vw"
                />
              )}
            </div>
          </section>
        );
      })()}

      {/* ── 5.5 OPTIONAL VIDEO SECTION ── */}
      {(() => {
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
              orientation: project.videoSection.orientation // Inherit parent orientation
            });
          });
        }

        if (allVideos.length === 0) return null;

        return (
          <CaseStudyVideoHero 
            videoHero={{ enabled: true, backgroundColor: 'transparent', backgroundText: project.client || 'Case Study' }} 
            fallbackName={project.client} 
            allVideos={allVideos} 
          />
        );
      })()}

      {/* ── 6. GALLERY (ANIMATED PARALLAX MASKS) ── */}
      {cmsMedia.length > 0 && (
        <section className="relative w-full z-10">
          <div className="pb-20 px-6 md:px-12 max-w-[1400px] mx-auto relative">
            <ElegantFade className="mb-12 pb-6 flex items-center justify-between">
              <h2 className="font-primary text-5xl md:text-7xl lg:text-8xl text-white tracking-tight">
                {project?.deliverablesHeading || SITE_SETTINGS?.csEcosystemHighlights || "Ecosystem Highlights"}
              </h2>
            </ElegantFade>

            <MediaRibbon3D media={cmsMedia} />
          </div>
        </section>
      )}

      {/* ── 7. FOOTER ── */}
      <section className="pt-12 pb-20 px-6 md:px-12 text-center relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <ElegantFade>
            <p className="text-[17px] md:text-[19px] tracking-widest uppercase text-[#D4CEFC] mb-6 font-medium font-primary">{SITE_SETTINGS?.csBackToWork || 'Back to Portfolio'}</p>
            <motion.h2 
              onClick={() => navigate('work')} 
              className="font-primary text-5xl md:text-7xl lg:text-8xl text-white font-medium cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center gap-6"
            >
              <ArrowLeft className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" /> {SITE_SETTINGS?.csAllProjects || 'All Case Studies'}
            </motion.h2>
          </ElegantFade>
        </div>
      </section>
      
    </div>
  );
};

export default AriseVenturesExperience;
