import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const palette = {
  bgDeep: '#010836',
  panel: '#0C185C',
  primary: '#6865FA',
  secondary: '#D4CEFC',
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

/* --- 3. Creative Hero Entrance --- */
const CreativeHeroReveal = ({ src, alt, delay = 0 }) => {
  return (
    <motion.div
      initial={{ clipPath: 'circle(0% at 50% 50%)', rotateX: 10, scale: 0.95 }}
      animate={{ clipPath: 'circle(150% at 50% 50%)', rotateX: 0, scale: 1 }}
      transition={{ duration: 2.2, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1200 }}
      className="w-full h-full relative overflow-hidden bg-[#010836]"
    >
      <motion.img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover opacity-90"
        initial={{ filter: 'blur(20px) brightness(0.5)', scale: 1.2 }}
        animate={{ filter: 'blur(0px) brightness(1)', scale: 1 }}
        transition={{ duration: 2.5, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Intense Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#010836_120%)] opacity-80 mix-blend-multiply pointer-events-none" />
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem] pointer-events-none" />
    </motion.div>
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

/* --- 5. The Epic Solution Visualizer --- */
const SolutionVisualizer = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-60">
      {/* Expanding Ripple Base */}
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute border border-[#6865FA]/15 rounded-full"
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: '150vw', height: '150vw', opacity: 0 }}
          transition={{ duration: 8, repeat: Infinity, delay: i * 1.5, ease: 'easeOut' }}
        />
      ))}

      {/* 3D Orbiting Constellation - MASSIVE */}
      <div className="absolute right-[-20%] lg:right-0 w-[120vw] h-[120vw] lg:w-[60vw] lg:h-[60vw]" style={{ perspective: 2000 }}>
        <motion.div
          animate={{ rotateY: 360, rotateX: 20 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 border border-[#D4CEFC]/10 rounded-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Nodes */}
          <div className="absolute top-0 left-1/2 w-4 h-4 bg-white/70 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateZ(100px)' }} />
          <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-[#FFCD00]/70 rounded-full shadow-[0_0_20px_rgba(255,205,0,0.5)] -translate-x-1/2 translate-y-1/2" style={{ transform: 'translateZ(-100px)' }} />
          <div className="absolute top-1/2 left-0 w-6 h-6 bg-[#6865FA]/70 rounded-full shadow-[0_0_30px_rgba(104,101,250,0.5)] -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateZ(50px)' }} />
        </motion.div>

        <motion.div
          animate={{ rotateX: 360, rotateZ: -30 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-12 lg:inset-20 border border-[#6865FA]/15 rounded-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Nodes */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#FFCD00]/70 rounded-full shadow-[0_0_20px_rgba(255,205,0,0.5)]" />
          <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-white/70 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
        </motion.div>
      </div>

      {/* Supernova Central Core */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1], 
          filter: ['blur(60px)', 'blur(90px)', 'blur(60px)'],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[-10%] lg:right-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[conic-gradient(from_90deg_at_50%_50%,#6865FA,#FFCD00,#6865FA)] rounded-full mix-blend-screen opacity-15"
      />
    </div>
  );
};

/* --- 6. Animated Parallax Ecosystem Image --- */
const ParallaxImage = ({ src, alt, delay = 0, yOffset = 50 }) => {
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
      className="w-full h-full relative group overflow-hidden bg-black"
    >
      <motion.img 
        src={src} 
        alt={alt}
        style={{ y }}
        className="w-full h-[140%] object-cover absolute top-[-20%] left-0 transition-transform duration-[2s] group-hover:scale-110 opacity-80 group-hover:opacity-100"
      />
      
      {/* Creative Glassmorphism Overlay on Hover */}
      <div className="absolute inset-0 bg-[#0C185C]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-overlay" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
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
const AboutGraphic = () => (
  <>
    <motion.div 
      animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      className="absolute w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-[40%] border border-[#6865FA]/30 opacity-60 shadow-[inset_0_0_100px_rgba(104,101,250,0.2)] mix-blend-screen pointer-events-none"
    />
    <motion.div 
      animate={{ rotate: -360, scale: [1, 1.2, 1] }} 
      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      className="absolute w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] rounded-[45%] border border-[#FFCD00]/20 opacity-50 shadow-[0_0_80px_rgba(255,205,0,0.1)] mix-blend-screen pointer-events-none"
    />
  </>
);

const ProblemGraphic = () => (
  <>
    <motion.div 
      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }} 
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-[#FFCD00] mix-blend-screen blur-[120px] pointer-events-none"
    />
    <motion.div 
      animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }} 
      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute w-[70vw] h-[70vw] md:w-[45vw] md:h-[45vw] rounded-full bg-[#6865FA] mix-blend-screen blur-[140px] pointer-events-none"
    />
  </>
);

const DramaticSection = ({ title, content, motionGraphic }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const spring = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const titleOpacity = useTransform(spring, [0, 0.4], [1, 0]);
  const titleScale = useTransform(spring, [0, 0.4], [1, 1.2]);
  const titleY = useTransform(spring, [0, 0.4], [0, -50]);
  
  const contentOpacity = useTransform(spring, [0.4, 0.6, 1], [0, 1, 1]);
  const contentY = useTransform(spring, [0.4, 0.6], [50, 0]);
  const graphicScale = useTransform(spring, [0, 1], [1, 1.5]);

  return (
    <section ref={ref} className="h-[200vh] relative w-full border-t border-white/5">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        <motion.div style={{ scale: graphicScale }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {motionGraphic}
        </motion.div>
        
        <motion.div style={{ opacity: titleOpacity, scale: titleScale, y: titleY }} className="absolute z-10 flex flex-col items-center justify-center w-full px-6 text-center">
          <motion.h2 
            animate={{ backgroundPosition: ['200% center', '-200% center'] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="text-5xl md:text-7xl lg:text-[7rem] font-medium tracking-tight text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(104,101,250,0.5)]" 
            style={{ 
              fontFamily: '"Carla", sans-serif',
              backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #6865FA 45%, #FFCD00 50%, #6865FA 55%, #FFFFFF 70%, #FFFFFF 100%)',
              backgroundSize: '300% auto',
            }}
          >
            {title}
          </motion.h2>
        </motion.div>
        
        <motion.div style={{ opacity: contentOpacity, y: contentY }} className="absolute z-20 w-full max-w-4xl px-6 md:px-12 text-center flex flex-col items-center">
          <h3 className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#D4CEFC] mb-8 font-bold border-b border-[#D4CEFC]/20 pb-4" style={{ fontFamily: '"Carla", sans-serif' }}>
             {title}
          </h3>
          <p className="text-white/80 font-normal text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-[1.6]" style={{ fontFamily: '"Carla", sans-serif' }}>
            {content}
          </p>
        </motion.div>
      </div>
    </section>
  );
};


const AriseVenturesExperience = ({ navigate, project }) => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const heroImg = project?.fullStory?.heroImg || '';
  const cmsImages = project?.fullStory?.images || [];

  return (
    <div className="w-full min-h-screen font-secondary selection:bg-[#6865FA] selection:text-white" style={{ backgroundColor: palette.bgDeep, color: palette.text }}>
      <ChicAmbientBackground />

      {/* Navigation */}
      <div className="relative z-50 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center mix-blend-difference pointer-events-none">
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-3 text-[10px] md:text-xs tracking-[0.2em] uppercase font-light text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Work
        </button>
        <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-light text-white/40">Case Study 01</span>
      </div>

      {/* ── 1. HERO SECTION (Unobstructed Image) ── */}
      <section className="pt-12 md:pt-16 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10 pb-20">
        
        <div className="flex flex-col items-center text-center mb-10">
          <ElegantFade delay={0.2}>
            <motion.h1 
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="font-carla text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] text-transparent bg-clip-text font-medium tracking-tight drop-shadow-[0_0_30px_rgba(104,101,250,0.4)]" 
              style={{ 
                fontFamily: '"Carla", sans-serif',
                backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #D4CEFC 45%, #6865FA 50%, #D4CEFC 55%, #FFFFFF 70%, #FFFFFF 100%)',
                backgroundSize: '300% auto',
              }}
            >
              Arise Ventures
            </motion.h1>
          </ElegantFade>
          
          <ElegantFade delay={0.4} className="mt-8 flex flex-wrap justify-center gap-3">
            {['Branding', 'Visual Identity', 'Collateral'].map((tag, i) => (
              <span key={i} className="px-5 py-2 rounded-full border border-white/20 text-[10px] md:text-xs tracking-widest uppercase font-bold text-white bg-white/5 backdrop-blur-md shadow-lg" style={{ fontFamily: '"Carla", sans-serif' }}>
                {tag}
              </span>
            ))}
          </ElegantFade>
        </div>

        <div className="relative w-full h-[60vh] md:h-[75vh] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
           {heroImg ? (
             <CreativeHeroReveal src={heroImg} alt="Arise Ventures Banner" delay={0.2} />
           ) : (
             <div className="w-full h-full bg-[#0C185C] flex items-center justify-center text-[#6865FA] text-xl font-light tracking-widest">HERO BANNER</div>
           )}
        </div>
      </section>

      {/* ── 2. DRAMATIC: ABOUT THE BRAND ── */}
      <DramaticSection 
        title="About the Brand."
        content="Arise Ventures is a global early-stage venture capital firm dedicated to investing in transformative tech startups across Consumer, Climate, and Enterprise sectors. Founded by Ankita Vashistha, Arise builds upon the legacy of Saha Fund and StrongHer Ventures, aiming to back visionary founders who are reshaping industries and driving positive global impact."
        motionGraphic={<AboutGraphic />}
      />

      {/* ── 3. DRAMATIC: PROBLEM STATEMENT ── */}
      <DramaticSection 
        title="The Problem."
        content="Arise Ventures entered a critical growth phase where its brand needed to evolve to reflect its ambition and values. While the firm had a clear mission and strong leadership, its visual identity lacked the coherence required to unify its presence across platforms and stakeholders. What was needed was a thoughtful evolution—one that could weave Arise's unique voice into a cohesive, future-ready identity."
        motionGraphic={<ProblemGraphic />}
      />

      {/* ── 4. HIGH-MOTION: CREATIVE SOLUTION (Unboxed & Epic) ── */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden py-32 mt-20 border-t border-white/5 bg-gradient-to-b from-transparent via-[#010836] to-transparent">
        
        {/* Massive Screen-Spanning Motion Graphic */}
        <SolutionVisualizer />

        {/* Content Floating in the Void */}
        <div className="relative z-10 px-6 md:px-12 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          <motion.div className="lg:col-span-8 xl:col-span-8 relative" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full border border-[#FFCD00]/30 bg-[#FFCD00]/10 text-[#FFCD00] text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#FFCD00] animate-pulse shadow-[0_0_10px_#FFCD00]" />
              The Solution
            </div>
            
            <motion.h3 
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="text-5xl md:text-7xl lg:text-[7rem] font-medium tracking-tight text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(104,101,250,0.5)] leading-[0.9] mb-12" 
              style={{ 
                fontFamily: '"Carla", sans-serif',
                backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #6865FA 45%, #FFCD00 50%, #6865FA 55%, #FFFFFF 70%, #FFFFFF 100%)',
                backgroundSize: '300% auto',
              }}
            >
              Creative<br/>Solution
            </motion.h3>
            
            <div className="space-y-8 text-white/90 font-normal text-lg md:text-xl xl:text-2xl leading-relaxed p-8 md:p-12 xl:p-16 rounded-[2.5rem] bg-[#0C185C]/30 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden" style={{ fontFamily: '"Carla", sans-serif' }}>
              {/* Subtle glass reflection inside the text box */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              
              <p className="relative z-10">For Arise Ventures, the rebrand began with a single idea—what does it mean to "back the bold"? At PurpleBlue House, we translated that into a living visual identity rooted in movement, momentum, and moonshots. At its heart was a new logomark: a ripple, symbolizing bold capital fueling bold founders and scalable innovation.</p>
              <p className="relative z-10">Grounded in deep stakeholder interviews, our approach uncovered the mindset driving Arise. This informed a design system of gradients and constellation-inspired elements, reflecting scale, guidance, and interconnectedness. The visual language is future-ready and fearless—bold enough to command attention, yet polished for boardrooms and global stages.</p>
              
              <motion.div 
                initial={{ backgroundSize: '0% 100%' }}
                whileInView={{ backgroundSize: '100% 100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                className="relative z-10 bg-gradient-to-r from-[#6865FA]/40 to-transparent bg-no-repeat pt-6 pb-6 pl-6 mt-10 border-l-4 border-[#FFCD00] rounded-r-xl shadow-lg"
              >
                <p className="font-medium text-white text-xl md:text-2xl xl:text-3xl leading-snug">
                  More than a redesign, this was the creation of a visual world that moves with Arise's mission. A world where every detail speaks one truth: bold is just the beginning.
                </p>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Empty column for balance */}
          <div className="lg:col-span-4 xl:col-span-4 h-[100px] lg:h-auto pointer-events-none" />
        </div>
      </section>

      {/* ── 5. STATEMENT ── */}
      <section className="py-24 px-6 md:px-12 max-w-[1000px] mx-auto text-center relative z-10 border-t border-white/5">
        <ElegantFade>
          <h2 className="font-carla text-2xl md:text-3xl lg:text-4xl leading-[1.4] text-white tracking-tight" style={{ fontFamily: '"Carla", sans-serif' }}>
            "Rebranded bold capital with a ripple of fearless design and strategic clarity. From constellation cues to a confident logomark, Arise now radiates momentum across every medium."
          </h2>
        </ElegantFade>
      </section>

      {/* ── 6. GALLERY (ANIMATED PARALLAX MASKS) ── */}
      <section className="pb-32 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10">
        <ElegantFade className="mb-12 border-b border-white/10 pb-6 flex items-center justify-between">
          <h2 className="font-carla text-3xl md:text-5xl text-white tracking-tight" style={{ fontFamily: '"Carla", sans-serif' }}>
            Ecosystem Highlights
          </h2>
        </ElegantFade>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px] md:auto-rows-[400px]">
          {cmsImages.length > 0 ? (
            cmsImages.map((imgUrl, index) => {
              // Mathematical Grid Pattern: Loops every 5 images to create an infinite, perfect masonry layout
              const patternIndex = index % 5;
              let spanClass = "md:col-span-12";
              if (patternIndex === 0) spanClass = "md:col-span-8 md:row-span-2"; // 1 massive block
              if (patternIndex === 1) spanClass = "md:col-span-4 md:row-span-1"; // 2 side blocks
              if (patternIndex === 2) spanClass = "md:col-span-4 md:row-span-1"; 
              if (patternIndex === 3) spanClass = "md:col-span-6 md:row-span-1"; // 2 half-width blocks below
              if (patternIndex === 4) spanClass = "md:col-span-6 md:row-span-1";

              // Alternating Parallax offset directions to keep motion feeling organic
              const yOffsets = [70, 40, -50, 60, -30];
              
              return (
                <div key={index} className={`${spanClass} rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 relative bg-gradient-to-br from-[#0C185C] to-[#010836]`}>
                  <ParallaxImage 
                    src={imgUrl} 
                    alt={`Highlight 0${index + 1}`} 
                    delay={0.1 * (patternIndex + 1)} 
                    yOffset={yOffsets[patternIndex]} 
                  />
                </div>
              );
            })
          ) : (
            <div className="md:col-span-12 rounded-[2rem] min-h-[400px] bg-[#0C185C]/30 flex items-center justify-center text-white/30 tracking-widest font-light ring-1 ring-white/10">
              AWAITING CMS MEDIA
            </div>
          )}
        </div>
      </section>

      {/* ── 7. FOOTER ── */}
      <section className="pt-12 pb-32 px-6 md:px-12 max-w-[1200px] mx-auto text-center relative z-10 border-t border-white/10">
        <ElegantFade>
          <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#D4CEFC] mb-6 font-medium">Next Experience</p>
          <motion.h2 
            onClick={() => navigate('work')} 
            className="font-carla text-5xl md:text-7xl lg:text-8xl text-white font-medium cursor-pointer hover:opacity-70 transition-opacity inline-block"
            style={{ fontFamily: '"Carla", sans-serif' }}
          >
            Aura Skincare
          </motion.h2>
        </ElegantFade>
      </section>
      
    </div>
  );
};

export default AriseVenturesExperience;
