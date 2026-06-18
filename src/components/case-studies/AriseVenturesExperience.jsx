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
      initial={{ opacity: 0, clipPath: 'inset(10% 10% 10% 10% round 30px)', filter: 'blur(20px)' }}
      animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)', filter: 'blur(0px)' }}
      transition={{ duration: 2.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full relative overflow-hidden"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 95%)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 95%)'
      }}
    >
      <motion.img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, delay, ease: [0.16, 1, 0.3, 1] }}
      />
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

/* --- 5. Sophisticated Solution Visualizer --- */
const SolutionVisualizer = () => {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center pointer-events-none">
      {/* Organic Pulsing Blobs (Mesmerizing Fluid Motion) */}
      <motion.div 
        animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 180, 360], borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "40% 60% 70% 30%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-72 h-72 bg-gradient-to-tr from-[#6865FA] via-[#D4CEFC] to-transparent blur-[50px] opacity-30 mix-blend-screen"
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0], borderRadius: ["60% 40% 30% 70%", "40% 60% 70% 30%", "60% 40% 30% 70%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-80 h-80 bg-gradient-to-bl from-[#6865FA] via-[#010836] to-[#D4CEFC] blur-[60px] opacity-40 mix-blend-screen"
      />

      {/* Expanding Ripple Base */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute border border-[#D4CEFC]/20 rounded-full"
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 500, height: 500, opacity: 0 }}
          transition={{ duration: 6, repeat: Infinity, delay: i * 2, ease: 'easeOut' }}
        />
      ))}

      {/* 3D Orbiting Constellation */}
      <div className="relative w-64 h-64" style={{ perspective: 1200 }}>
        <motion.div
          animate={{ rotateY: 360, rotateX: 15 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 border border-[#D4CEFC]/30 rounded-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Nodes */}
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white] -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateZ(24px)' }} />
          <div className="absolute bottom-0 left-1/2 w-2.5 h-2.5 bg-[#D4CEFC] rounded-full shadow-[0_0_15px_#D4CEFC] -translate-x-1/2 translate-y-1/2" style={{ transform: 'translateZ(-24px)' }} />
          <div className="absolute top-1/2 left-0 w-3.5 h-3.5 bg-[#6865FA] rounded-full shadow-[0_0_20px_#6865FA] -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateZ(10px)' }} />
          <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white] translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateZ(-10px)' }} />
        </motion.div>

        <motion.div
          animate={{ rotateX: 360, rotateZ: 30 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-5 border border-[#6865FA]/40 rounded-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Nodes */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#D4CEFC] rounded-full shadow-[0_0_10px_#D4CEFC]" />
          <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_15px_white]" />
        </motion.div>
      </div>

      {/* Sophisticated Central Core */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], filter: ['blur(20px)', 'blur(35px)', 'blur(20px)'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-28 h-28 bg-gradient-to-tr from-[#6865FA] to-[#D4CEFC] rounded-full mix-blend-screen opacity-50"
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
      className="absolute w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] rounded-[45%] border border-[#D4CEFC]/20 opacity-50 shadow-[0_0_80px_rgba(212,206,252,0.1)] mix-blend-screen pointer-events-none"
    />
  </>
);

const ProblemGraphic = () => (
  <>
    <motion.div 
      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }} 
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-[40%] bg-[#D4CEFC] mix-blend-screen blur-[120px] pointer-events-none"
    />
    <motion.div 
      animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }} 
      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute w-[70vw] h-[70vw] md:w-[45vw] md:h-[45vw] rounded-[45%] bg-[#6865FA] mix-blend-screen blur-[140px] pointer-events-none"
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
    <section ref={ref} className="h-[200vh] relative w-full">
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
              backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #6865FA 45%, #D4CEFC 50%, #6865FA 55%, #FFFFFF 70%, #FFFFFF 100%)',
              backgroundSize: '300% auto',
            }}
          >
            {title}
          </motion.h2>
        </motion.div>
        
        <motion.div style={{ opacity: contentOpacity, y: contentY }} className="absolute z-20 w-full max-w-4xl px-6 md:px-12 text-center flex flex-col items-center">
          <h3 className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#D4CEFC] mb-8 font-bold pb-4" style={{ fontFamily: '"Carla", sans-serif' }}>
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

      {/* ── 1. CINEMATIC HERO (Unconstructed & Blended) ── */}
      <section className="relative w-full flex flex-col items-center justify-start z-10 pb-20">
        
        {/* Full Width Background Reveal with Bottom Fade via Mask Image */}
        <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
           {heroImg ? (
             <CreativeHeroReveal src={heroImg} alt="Arise Ventures Banner" delay={0.2} />
           ) : (
             <div className="w-full h-full bg-[#0C185C]" />
           )}
        </div>

        {/* Floating Text Below the Banner */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 mt-8 md:mt-12">
          <ElegantFade delay={0.4} className="mb-6 flex flex-wrap justify-center gap-4">
            {['Branding', 'Visual Identity', 'Collateral'].map((tag, i) => (
              <span key={i} className="px-6 py-2 rounded-full border border-white/10 text-xs md:text-sm tracking-[0.2em] uppercase font-bold text-white/80 bg-white/5 backdrop-blur-md shadow-lg" style={{ fontFamily: '"Carla", sans-serif' }}>
                {tag}
              </span>
            ))}
          </ElegantFade>

          <ElegantFade delay={0.2}>
            <motion.h1 
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="font-carla text-6xl md:text-8xl lg:text-[10rem] leading-[0.9] text-transparent bg-clip-text font-medium tracking-tight drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
              style={{ 
                fontFamily: '"Carla", sans-serif',
                backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #D4CEFC 45%, #6865FA 50%, #D4CEFC 55%, #FFFFFF 70%, #FFFFFF 100%)',
                backgroundSize: '300% auto',
              }}
            >
              Arise Ventures
            </motion.h1>
          </ElegantFade>
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

      {/* ── 4. HIGH-MOTION: CREATIVE SOLUTION (Seamlessly Blended) ── */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10 mt-10">
        
        {/* Ambient Background Aura behind the whole section (blended) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#6865FA_0%,transparent_60%)] opacity-[0.15] blur-[80px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* Left Side: Text (Seamlessly integrated, no boxes) */}
          <motion.div 
            className="lg:col-span-7 relative z-10" 
            initial={{ opacity: 0, y: 40, filter: 'blur(15px)' }} 
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
            viewport={{ once: true, margin: "-10%" }}
          >
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full bg-[#D4CEFC]/10 text-[#D4CEFC] text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#D4CEFC] animate-pulse shadow-[0_0_10px_#D4CEFC]" />
              The Solution
            </div>
            
            <h3 className="font-carla text-5xl md:text-7xl text-white mb-10 font-medium tracking-tight drop-shadow-lg" style={{ fontFamily: '"Carla", sans-serif' }}>
              Creative Solution
            </h3>
            
            {/* Readable Text with NO box */}
            <div className="space-y-8 text-white/95 font-normal text-lg md:text-xl leading-relaxed" style={{ fontFamily: '"Carla", sans-serif' }}>
              <p>For Arise Ventures, the rebrand began with a single idea—what does it mean to "back the bold"? At PurpleBlue House, we translated that into a living visual identity rooted in movement, momentum, and moonshots. At its heart was a new logomark: a ripple, symbolizing bold capital fueling bold founders and scalable innovation.</p>
              <p>Grounded in deep stakeholder interviews, our approach uncovered the mindset driving Arise. This informed a design system of gradients and constellation-inspired elements, reflecting scale, guidance, and interconnectedness. The visual language is future-ready and fearless—bold enough to command attention, yet polished for boardrooms and global stages.</p>
              
              {/* Highlighted text block */}
              <motion.div 
                initial={{ backgroundSize: '0% 100%' }}
                whileInView={{ backgroundSize: '100% 100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                className="bg-gradient-to-r from-[#6865FA]/20 to-transparent bg-no-repeat pt-6 pb-6 pl-8 mt-10 border-l-4 border-[#D4CEFC] rounded-r-xl"
              >
                <p className="font-medium text-white text-xl md:text-2xl leading-snug drop-shadow-md">
                  More than a redesign, this was the creation of a visual world that moves with Arise's mission. A world where every detail speaks one truth: bold is just the beginning.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side: Visualizer (Organic & Floating) */}
          <motion.div 
            className="lg:col-span-5 h-[400px] lg:h-full relative flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-10%" }}
          >
              <SolutionVisualizer />
          </motion.div>

        </div>
      </section>

      {/* ── 5. STATEMENT ── */}
      <section className="py-24 px-6 md:px-12 max-w-[1000px] mx-auto text-center relative z-10">
        <ElegantFade>
          <h2 className="font-carla text-2xl md:text-3xl lg:text-4xl leading-[1.4] text-white tracking-tight" style={{ fontFamily: '"Carla", sans-serif' }}>
            "Rebranded bold capital with a ripple of fearless design and strategic clarity. From constellation cues to a confident logomark, Arise now radiates momentum across every medium."
          </h2>
        </ElegantFade>
      </section>

      {/* ── 6. GALLERY (ANIMATED PARALLAX MASKS) ── */}
      <section className="pb-32 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10">
        <ElegantFade className="mb-12 pb-6 flex items-center justify-between">
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
      <section className="pt-12 pb-32 px-6 md:px-12 max-w-[1200px] mx-auto text-center relative z-10">
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
