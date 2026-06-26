import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GlobalContext } from '../../App';
import CaseStudyVideoHero from './CaseStudyVideoHero';
import CaseStudyMedia, { normalizeMediaItems } from './CaseStudyMedia';
import { getSafeEmbedUrl } from '../../lib/videoUtils';

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
  
  const titleOpacity = useTransform(spring, [0, 0.15], [1, 0]);
  const titleScale = useTransform(spring, [0, 0.15], [1, 1.2]);
  const titleY = useTransform(spring, [0, 0.15], [0, -30]);
  
  // Fade content in from 0.05 to 0.25, hold until 0.9, then fade out quickly by 1.0
  const contentOpacity = useTransform(spring, [0.05, 0.25, 0.9, 1], [0, 1, 1, 0]);
  const contentY = useTransform(spring, [0.05, 0.25, 0.9, 1], [30, 0, 0, -30]);
  const graphicScale = useTransform(spring, [0, 1], [1, 1.5]);

  return (
    <section ref={ref} className="h-[200vh] relative w-full">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        <motion.div style={{ scale: graphicScale }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {motionGraphic}
        </motion.div>

        {/* Ambient Edge Masking (Prevents graphics from hard-cutting at the top/bottom of the screen) */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#010d54] to-transparent z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#010d54] to-transparent z-0 pointer-events-none" />
        
        {/* Title Container */}
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
        
        {/* Content Container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <motion.div style={{ opacity: contentOpacity, y: contentY }} className="w-full max-w-4xl px-6 md:px-12 text-center flex flex-col items-center pointer-events-auto">
            <h3 className="text-sm md:text-base tracking-widest uppercase text-[#D4CEFC] mb-6 md:mb-8 font-bold font-primary">
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
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2 text-sm md:text-base backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white group">
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
        </div>

        {/* Text Below the Banner Box */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 mt-12 md:mt-16">
          <ElegantFade delay={0.4} className="mb-6 flex flex-wrap justify-center gap-4">
            {(project?.tags || project?.roles || ['Branding', 'Visual Identity', 'Collateral']).map((tag, i) => (
              <span key={i} className="px-6 py-2 rounded-full border border-white/10 text-sm md:text-base tracking-widest uppercase font-bold text-white/80 bg-white/5 backdrop-blur-md shadow-lg font-primary">
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
      {project?.overview && (
        <DramaticSection
          title={project?.overviewHeading || SITE_SETTINGS?.csAboutTheBrand || "About the Brand."}
          content={project?.overview}
          motionGraphic={<AboutGraphic />}
        />
      )}

      {/* ── 3. DRAMATIC: PROBLEM STATEMENT ── */}
      {project?.challenge && (
        <DramaticSection 
          title={project?.challengeHeading || SITE_SETTINGS?.csTheProblem || "The Problem."}
          content={project?.challenge}
          motionGraphic={<ProblemGraphic />}
        />
      )}

      {/* ── 4. HIGH-MOTION: CREATIVE SOLUTION (Seamlessly Blended) ── */}
      <section className="relative w-full z-10">
        
        <div className="pt-4 pb-16 md:pt-6 md:pb-20 px-6 md:px-12 max-w-[1400px] mx-auto relative">
        
          {/* Ambient Background Aura behind the whole section (blended) */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#6865FA_0%,transparent_60%)] blur-[80px] pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 0.18, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          />
        
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
            {/* Left Side: Text (Seamlessly integrated, no boxes) */}
            <motion.div 
              className="lg:col-span-7 relative z-10" 
              initial={{ opacity: 0, y: 40, filter: 'blur(15px)' }} 
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
              viewport={{ once: true, margin: "-10%" }}
            >
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full bg-[#D4CEFC]/10 text-[#D4CEFC] text-sm md:text-base font-bold tracking-widest uppercase backdrop-blur-md font-primary">
                <span className="w-2 h-2 rounded-full bg-[#D4CEFC] animate-pulse shadow-[0_0_10px_#D4CEFC]" />
                The Solution
              </div>
            
              <motion.h3
                className="font-primary text-5xl md:text-7xl lg:text-8xl text-white mb-10 font-medium tracking-tight drop-shadow-lg"
                initial={{ opacity: 0, y: 32, filter: 'blur(14px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {project?.solutionHeading?.length > 100 ? (SITE_SETTINGS?.csCreativeSolution || "Creative Solution") : (project?.solutionHeading || SITE_SETTINGS?.csCreativeSolution || "Creative Solution")}
              </motion.h3>
            
              {/* Readable Text with NO box */}
              {(project?.solution || project?.fullStory?.execution) && (
                <div className="space-y-8 text-white/95 font-normal text-[17px] md:text-[19px] leading-relaxed font-secondary">
                  {project?.solution && <p>{project.solution}</p>}
                
                  {/* Highlighted text block */}
                  {project?.fullStory?.execution && (
                    <motion.div
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-12%' }}
                      transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="relative overflow-hidden pt-6 pb-6 pl-8 mt-10 rounded-r-xl"
                    >
                      {/* Drawing accent border */}
                      <motion.span
                        className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4CEFC] origin-top shadow-[0_0_12px_#D4CEFC]"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                      {/* Gradient fill sweep */}
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-[#6865FA]/25 to-transparent origin-left"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.3, delay: 0.7, ease: 'easeOut' }}
                      />
                      <p className="relative z-10 font-primary font-medium text-white text-xl md:text-2xl leading-snug drop-shadow-md">
                        {project.fullStory.execution}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Right Side: Visualizer (Organic & Floating) */}
            <motion.div 
              className="lg:col-span-5 h-[400px] lg:h-full relative flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.82, rotate: -6, filter: 'blur(22px)', clipPath: 'circle(0% at 50% 50%)' }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)', clipPath: 'circle(82% at 50% 50%)' }}
              transition={{ duration: 1.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-10%" }}
            >
                <SolutionVisualizer />
            </motion.div>

          </div>
        </div>
      </section>

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

            {(() => {
              const isAriseBespoke = project.client?.toLowerCase().includes('arise');

              if (isAriseBespoke) { 
                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-[repeat(4,_minmax(150px,_auto))] gap-4 md:gap-6 w-full max-w-[1600px] mx-auto">
                    {/* Image 0: Large Left Block (Row 1-4) */}
                    <div className="md:col-start-1 md:col-span-5 md:row-start-1 md:row-span-4 h-full min-h-[300px] md:min-h-0">
                      {cmsMedia[0] && <ParallaxImage src={cmsMedia[0].url} alt={cmsMedia[0].alt} delay={0.1} yOffset={10} className="h-full w-full object-cover" />}
                    </div>
                    
                    {/* Image 1: Middle Top (Row 1) */}
                    <div className="md:col-start-6 md:col-span-3 md:row-start-1 md:row-span-1 h-full">
                      {cmsMedia[1] && <ParallaxImage src={cmsMedia[1].url} alt={cmsMedia[1].alt} delay={0.2} yOffset={5} className="h-full w-full object-cover" />}
                    </div>

                    {/* Image 2: Middle Center (Row 2-3) */}
                    <div className="md:col-start-6 md:col-span-3 md:row-start-2 md:row-span-2 h-full">
                      {cmsMedia[2] && <ParallaxImage src={cmsMedia[2].url} alt={cmsMedia[2].alt} delay={0.3} yOffset={-5} className="h-full w-full object-cover" />}
                    </div>

                    {/* Image 3: Middle Bottom (Row 4) */}
                    <div className="md:col-start-6 md:col-span-3 md:row-start-4 md:row-span-1 h-full">
                      {cmsMedia[3] && <ParallaxImage src={cmsMedia[3].url} alt={cmsMedia[3].alt} delay={0.4} yOffset={-10} className="h-full w-full object-cover" />}
                    </div>

                    {/* Image 4: Right Top (Row 1) */}
                    <div className="md:col-start-9 md:col-span-4 md:row-start-1 md:row-span-1 h-full">
                      {cmsMedia[4] && <ParallaxImage src={cmsMedia[4].url} alt={cmsMedia[4].alt} delay={0.3} yOffset={10} className="h-full w-full object-cover" />}
                    </div>

                    {/* Image 5: Right Center (Row 2-3) */}
                    <div className="md:col-start-9 md:col-span-4 md:row-start-2 md:row-span-2 h-full">
                      {cmsMedia[5] && <ParallaxImage src={cmsMedia[5].url} alt={cmsMedia[5].alt} delay={0.4} yOffset={-10} className="h-full w-full object-cover" />}
                    </div>

                    {/* Image 6: Right Bottom-Left (Row 4) */}
                    <div className="md:col-start-9 md:col-span-2 md:row-start-4 md:row-span-1 h-full">
                      {cmsMedia[6] && <ParallaxImage src={cmsMedia[6].url} alt={cmsMedia[6].alt} delay={0.5} yOffset={10} className="h-full w-full object-cover" />}
                    </div>

                    {/* Image 7: Right Bottom-Right (Row 4) */}
                    <div className="md:col-start-11 md:col-span-2 md:row-start-4 md:row-span-1 h-full">
                      {cmsMedia[7] && <ParallaxImage src={cmsMedia[7].url} alt={cmsMedia[7].alt} delay={0.6} yOffset={25} className="h-full w-full object-cover" />}
                    </div>
                  </div>
                );
              }

              // Fallback masonry layout for other clients or fewer images
              return (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                  {cmsMedia.map((media, index) => {
                    const yOffsets = [30, 15, -20, 35, -15];
                    const parallaxY = yOffsets[index % yOffsets.length];
                    
                    return (
                      <div key={media.key} className="break-inside-avoid relative w-full mb-6">
                        <ParallaxImage 
                          src={media.url}
                          alt={media.alt || `Highlight 0${index + 1}`}
                          delay={0.1 * ((index % 3) + 1)} 
                          yOffset={parallaxY} 
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* ── 7. FOOTER ── */}
      <section className="pt-12 pb-20 px-6 md:px-12 text-center relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <ElegantFade>
            <p className="text-sm md:text-base tracking-widest uppercase text-[#D4CEFC] mb-6 font-medium font-primary">{SITE_SETTINGS?.csBackToWork || 'Back to Portfolio'}</p>
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
