import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GlobalContext } from '../../App';
import CaseStudyVideoHero, { hasVideoHeroSource, toComparableVideoUrl } from './CaseStudyVideoHero';
import CaseStudyMedia, { normalizeMediaItems } from './CaseStudyMedia';
import CaseStudySectorPill from './CaseStudySectorPill';
import { getSafeEmbedUrl } from '../../lib/videoUtils';

const palette = {
  bgDeep: '#001525',
  panel: '#002038',
  primary: '#00b8d9',
  secondary: '#7adcf0',
  blue: '#2a97d9',
  accent: '#ffcd00',
  purple: '#af73dd',
  green: '#93d435',
  orange: '#ffa040',
  text: '#F0FAFF'
};

/* --- 1. Chic Ambient Glows --- */
const ChicAmbientBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div
      animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen blur-[120px]"
      style={{ background: `radial-gradient(circle, ${palette.primary}90 0%, transparent 60%)` }}
    />
    <motion.div
      animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen blur-[120px]"
      style={{ background: `radial-gradient(circle, ${palette.secondary}70 0%, transparent 60%)` }}
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
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-[#002038]/70">
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
        className="absolute w-72 h-72 bg-gradient-to-tr from-[#00b8d9] via-[#7adcf0] to-transparent blur-[50px] opacity-30 mix-blend-screen"
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0], borderRadius: ["60% 40% 30% 70%", "40% 60% 70% 30%", "60% 40% 30% 70%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-80 h-80 bg-gradient-to-bl from-[#00b8d9] via-[#040e1e] to-[#7adcf0] blur-[60px] opacity-40 mix-blend-screen"
      />

      {/* Expanding Ripple Base */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute border border-[#7adcf0]/20 rounded-full"
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
          className="absolute inset-0 border border-[#7adcf0]/30 rounded-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Nodes */}
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white] -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateZ(24px)' }} />
          <div className="absolute bottom-0 left-1/2 w-2.5 h-2.5 bg-[#7adcf0] rounded-full shadow-[0_0_15px_#7adcf0] -translate-x-1/2 translate-y-1/2" style={{ transform: 'translateZ(-24px)' }} />
          <div className="absolute top-1/2 left-0 w-3.5 h-3.5 bg-[#00b8d9] rounded-full shadow-[0_0_20px_#00b8d9] -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateZ(10px)' }} />
          <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white] translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateZ(-10px)' }} />
        </motion.div>

        <motion.div
          animate={{ rotateX: 360, rotateZ: 30 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-5 border border-[#00b8d9]/40 rounded-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Nodes */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#7adcf0] rounded-full shadow-[0_0_10px_#7adcf0]" />
          <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_15px_white]" />
        </motion.div>
      </div>

      {/* Sophisticated Central Core */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], filter: ['blur(20px)', 'blur(35px)', 'blur(20px)'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-28 h-28 bg-gradient-to-tr from-[#00b8d9] to-[#7adcf0] rounded-full mix-blend-screen opacity-50"
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
      className="w-full h-full relative group overflow-hidden bg-[#002038] flex items-center justify-center"
    >
      <CaseStudyMedia
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 opacity-90 group-hover:opacity-100"
        sizes="(min-width: 1024px) 50vw, 100vw"
        motionProps={{ style: { y: useTransform(smoothProgress, [0, 1], [-yOffset/2, yOffset/2]) } }}
      />
      
      {/* Creative Glassmorphism Overlay on Hover */}
      <div className="absolute inset-0 bg-[#002038]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-overlay" />
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
      className="absolute w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-[40%] border border-[#00b8d9]/30 opacity-60 shadow-[inset_0_0_100px_rgba(0,184,217,0.2)] mix-blend-screen pointer-events-none"
    />
    <motion.div 
      animate={{ rotate: -360, scale: [1, 1.2, 1] }} 
      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      className="absolute w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] rounded-[45%] border border-[#7adcf0]/20 opacity-50 shadow-[0_0_80px_rgba(122,220,240,0.1)] mix-blend-screen pointer-events-none"
    />
  </>
);

const ProblemGraphic = () => (
  <>
    <motion.div 
      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }} 
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-[40%] bg-[#7adcf0] mix-blend-screen blur-[120px] pointer-events-none"
    />
    <motion.div 
      animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }} 
      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute w-[70vw] h-[70vw] md:w-[45vw] md:h-[45vw] rounded-[45%] bg-[#00b8d9] mix-blend-screen blur-[140px] pointer-events-none"
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
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#001525] to-transparent z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#001525] to-transparent z-0 pointer-events-none" />
        
        {/* Title Container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div style={{ opacity: titleOpacity, scale: titleScale, y: titleY }} className="flex flex-col items-center justify-center w-full px-6 text-center pointer-events-auto">
            <motion.h2 
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="font-primary text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(0,184,217,0.5)]" 
              style={{ 
                backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #00b8d9 45%, #7adcf0 50%, #00b8d9 55%, #FFFFFF 70%, #FFFFFF 100%)',
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
            <h3 className="text-xl md:text-2xl font-primary tracking-tight text-[#7adcf0] mb-6 md:mb-8">
               {title}
            </h3>
            <div className="space-y-6">
              {typeof content === 'string' 
                ? content.split('\n\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="text-white/90 font-light text-[17px] md:text-[19px] max-w-3xl mx-auto leading-relaxed md:leading-relaxed font-secondary">
                      {para.trim()}
                    </p>
                  ))
                : <p className="text-white/90 font-light text-[17px] md:text-[19px] max-w-3xl mx-auto leading-relaxed md:leading-relaxed font-secondary">{content}</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


const ParamInnovationExperience = ({ navigate, project }) => {
  const { SITE_SETTINGS } = React.useContext(GlobalContext) || {};
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const heroImg = project?.bannerVideo || project?.fullStory?.heroVideo || project?.bannerImage || project?.fullStory?.heroImg || project?.imageUrl || '';
  
  // Standardize banner size across all case studies to prevent layout fluctuations
  const heroAspectRatio = 16 / 9;
  
  const cmsMedia = normalizeMediaItems(project?.fullStory?.media || project?.fullStory?.images, project?.client || 'Case study media');

  // Render only when Sanity has a real video source; the enabled toggle is optional for legacy entries.
  const videoHeroData = hasVideoHeroSource(project?.videoHero) ? project.videoHero : null;

  return (
    <div className="w-full min-h-screen font-secondary selection:bg-[#00b8d9] selection:text-white" style={{ backgroundColor: palette.bgDeep, color: palette.text }}>
      <ChicAmbientBackground />

      {/* Navigation */}
      <div className="fixed top-0 left-0 w-full z-50 px-6 pt-28 pb-6 md:px-12 md:pt-32 md:pb-8 flex items-center gap-3 pointer-events-none">
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2 text-[17px] md:text-[19px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>

      {/* ── 1. CINEMATIC HERO (Boxed) ── */}
      <section className="relative w-full flex flex-col items-center justify-start z-10 pb-20 md:pb-24 pt-44 md:pt-48 px-4 md:px-8">
        
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
             <div className="w-full h-full bg-[#002038]" />
           )}
          <div className="pointer-events-none absolute left-1/2 top-24 z-20 -translate-x-1/2 px-3 md:top-28">
            <CaseStudySectorPill
              sector={project?.sector || (project?.tags?.length > 0 ? project.tags[0] : null) || (project?.roles?.length > 0 ? project.roles[0] : null)}
              className="border border-white/[0.16] bg-[#001525]/45 text-white/85 shadow-[0_14px_40px_rgba(0,0,0,0.24)] backdrop-blur-md"
            />
          </div>
        </div>

        {/* Text Below the Banner Box */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 mt-12 md:mt-16">
          <ElegantFade delay={0.4} className="mb-6 flex flex-wrap justify-center gap-4">
            {(project?.tags?.length > 0 ? project.tags : (project?.roles?.length > 0 ? project.roles : (project?.sector ? [project.sector] : ['Branding', 'Visual Identity', 'Collateral']))).map((tag, i) => (
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
                backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #7adcf0 45%, #00b8d9 50%, #7adcf0 55%, #FFFFFF 70%, #FFFFFF 100%)',
                backgroundSize: '300% auto',
              }}
            >
              {project?.client || 'Arise Ventures'}
            </motion.h1>
          </ElegantFade>
        </div>
      </section>

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

      {/* ── 1.5 CASE STUDY VIDEO HERO (CMS-driven, reusable) ── */}
      <CaseStudyVideoHero videoHero={videoHeroData} fallbackName={project?.client || 'Arise Ventures'} />

      {/* ── 2. DRAMATIC: ABOUT THE BRAND ── */}
      {project?.overview && (
        <DramaticSection
          title={project?.overviewHeading || "About the Brand."}
          content={project?.overview}
          motionGraphic={<AboutGraphic />}
        />
      )}

      {/* ── 3. DRAMATIC: PROBLEM STATEMENT ── */}
      {project?.challenge && (
        <DramaticSection 
          title={project?.challengeHeading || "The Problem."}
          content={project?.challenge}
          motionGraphic={<ProblemGraphic />}
        />
      )}

      {/* ── 4. HIGH-MOTION: CREATIVE SOLUTION (DramaticSection) ── */}
      <DramaticSection
        title={project?.solutionHeading?.length > 100 ? (SITE_SETTINGS?.csCreativeSolution || "Creative Solution") : (project?.solutionHeading || SITE_SETTINGS?.csCreativeSolution || "Creative Solution")}
        content={[project?.solution, project?.fullStory?.execution].filter(Boolean).join('\n\n')}
        motionGraphic={<SolutionVisualizer />}
      />

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

      {/* ── 5.5 OPTIONAL VIDEO SECTION ── */}
      {(() => {
        const allVideos = [];
        const heroVideoKeys = new Set([
          toComparableVideoUrl(project?.videoHero?.embedUrl),
          toComparableVideoUrl(project?.videoHero?.uploadedVideoUrl),
          ...(project?.videoHero?.videos || []).flatMap((video) => [
            toComparableVideoUrl(video?.embedUrl || video?.videoUrl),
            toComparableVideoUrl(video?.uploadedVideoUrl || video?.videoFileUrl),
          ]),
        ].filter(Boolean));

        const pushVideo = (video) => {
          const sourceKey = toComparableVideoUrl(video.videoUrl || video.videoFileUrl);
          if (sourceKey && heroVideoKeys.has(sourceKey)) return;
          allVideos.push(video);
        };

        if (project?.videoSection?.videoUrl || project?.videoSection?.videoFileUrl) {
          pushVideo({
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
            pushVideo({
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
                {project?.deliverablesHeading || "Ecosystem Highlights"}
              </h2>
            </ElegantFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[400px]">
              {cmsMedia.map((media, index) => {
                const ratio = getUrlAspectRatio(media.url) || 1;
                
                let colSpan = 'col-span-1';
                let rowSpan = 'row-span-1';

                // Bento logic based on intrinsic aspect ratios to prevent awkward cropping
                if (ratio > 1.5) {
                  colSpan = 'col-span-1 md:col-span-2 lg:col-span-2';
                  rowSpan = 'row-span-1';
                } else if (ratio < 0.8) {
                  colSpan = 'col-span-1';
                  rowSpan = 'row-span-2';
                } else if (ratio >= 0.8 && ratio <= 1.2) {
                  colSpan = 'col-span-1';
                  rowSpan = 'row-span-1';
                } else {
                  colSpan = 'col-span-1 md:col-span-2 lg:col-span-2';
                  rowSpan = 'row-span-2';
                }

                // Aesthetic overriding for the first few items to guarantee a hero-like bento feel
                if (index === 0) {
                  colSpan = 'col-span-1 md:col-span-2 lg:col-span-3';
                  rowSpan = 'row-span-2';
                } else if (index === 1 && ratio < 1) {
                  colSpan = 'col-span-1';
                  rowSpan = 'row-span-2';
                }

                const yOffsets = [70, 40, -50, 60, -30];
                const parallaxY = yOffsets[index % yOffsets.length];
                
                return (
                  <div key={media.key} className={`${colSpan} ${rowSpan} rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 relative bg-[#002038]`}>
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
          </div>
        </section>
      )}

      {/* ── 7. FOOTER ── */}
      <section className="pt-12 pb-20 px-6 md:px-12 text-center relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <ElegantFade>
            <p className="text-[17px] md:text-[19px] tracking-widest uppercase text-[#7adcf0] mb-6 font-medium font-primary">{SITE_SETTINGS?.csBackToWork || 'Back to Portfolio'}</p>
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

export default ParamInnovationExperience;
