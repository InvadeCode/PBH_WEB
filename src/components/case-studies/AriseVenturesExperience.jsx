import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GlobalContext } from '../../App';
import CaseStudyVideoHero from './CaseStudyVideoHero';
import CaseStudyMedia, { normalizeMediaItems } from './CaseStudyMedia';
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

const SolutionGraphic = () => (
  <>
    <motion.div 
      animate={{ rotate: 360, scale: [1, 1.15, 1] }} 
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className="absolute w-[75vw] h-[75vw] md:w-[45vw] md:h-[45vw] rounded-[40%] border-[2px] border-[#6865FA]/40 opacity-70 shadow-[0_0_120px_rgba(104,101,250,0.3)] mix-blend-screen pointer-events-none"
    />
    <motion.div 
      animate={{ rotate: -360, scale: [1, 1.25, 1] }} 
      transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      className="absolute w-[65vw] h-[65vw] md:w-[35vw] md:h-[35vw] rounded-[50%] border border-[#2a97d9]/30 opacity-60 shadow-[inset_0_0_80px_rgba(42,151,217,0.2)] mix-blend-screen pointer-events-none"
    />
  </>
);

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
