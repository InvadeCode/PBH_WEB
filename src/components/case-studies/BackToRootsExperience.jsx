import React, { useRef, useEffect, useContext } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GlobalContext } from '../../App';
import CaseStudyMedia, { normalizeMediaItems } from './CaseStudyMedia';
import CaseStudyVideoHero from './CaseStudyVideoHero';
import { getSafeEmbedUrl } from '../../lib/videoUtils';

// ── Palette ───────────────────────────────────────────────────────────────
const C = {
  soil: '#1E120D',
  soilDeep: '#150B07',
  terra: '#B35D30',
  cream: '#F5E6C8',
  ease: [0.16, 1, 0.3, 1],
};

const DEFAULT_CHAPTERS = [
  { t: 'The Seed', l: 'Every brand begins as a single idea, planted deep.' },
  { t: 'The Soil', l: 'Nurtured by heritage, grounded in meaning.' },
  { t: 'First Light', l: 'A visual language breaks through the surface.' },
  { t: 'Taking Root', l: 'Identity spreads, steady and deliberate.' },
  { t: 'The Bloom', l: 'Form and feeling flourish into one.' },
  { t: 'The Harvest', l: 'A story ready to be shared with the world.' },
  { t: 'Full Circle', l: 'Rooted in the past, reaching for tomorrow.' },
];

// Gradient backdrops cycled across the image chapters
const GRADS = [
  `radial-gradient(120% 90% at 22% 18%, ${C.terra}26 0%, transparent 55%), linear-gradient(180deg, ${C.soil}, ${C.soilDeep})`,
  `radial-gradient(120% 90% at 80% 26%, ${C.terra}20 0%, transparent 55%), linear-gradient(180deg, ${C.soilDeep}, ${C.soil})`,
  `radial-gradient(120% 100% at 50% 88%, ${C.terra}26 0%, transparent 55%), linear-gradient(180deg, ${C.soil}, ${C.soilDeep})`,
];

// Film grain (procedural SVG noise)
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const Sprockets = ({ pos }) => (
  <div className={`absolute inset-x-2 ${pos === 'top' ? 'top-1' : 'bottom-1'} flex justify-between pointer-events-none`}>
    {Array.from({ length: 16 }).map((_, i) => (
      <span key={i} className="rounded-[1px]" style={{ width: 6, height: 4, backgroundColor: `${C.cream}1f` }} />
    ))}
  </div>
);

const RegMarks = () => (
  <>
    {[['top-1 left-1', 'border-t border-l'], ['top-1 right-1', 'border-t border-r'], ['bottom-1 left-1', 'border-b border-l'], ['bottom-1 right-1', 'border-b border-r']].map(([pos, b]) => (
      <span key={pos} className={`absolute ${pos} ${b} w-4 h-4 pointer-events-none`} style={{ borderColor: `${C.terra}cc` }} />
    ))}
  </>
);

// ── Top scroll-progress bar ─────────────────────────────────────────────────
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50" style={{ scaleX: scrollYProgress, background: `linear-gradient(90deg, ${C.terra}, ${C.cream})` }} />;
};

// ── SCENE 1 · COVER (Curtain Reveal) ───────────────────────────────
const Cover = ({ project, navigate, SITE_SETTINGS }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroImage = project.bannerVideo || project.fullStory?.heroVideo || project.bannerImage || project.fullStory?.heroImg || project.imageUrl;
  const title = (project.client || 'Back To Roots').toUpperCase();

  return (
    <section ref={ref} className="relative h-screen overflow-hidden" style={{ backgroundColor: C.soil }}>
      
      {/* The Banner Image (revealed underneath) */}
      <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
        {heroImage && (
          <CaseStudyMedia
            src={heroImage}
            alt={`${project.client || 'Case study'} hero`}
            className="w-full h-full object-cover"
            priority
            sizes="100vw"
          />
        )}
        {/* We keep a subtle gradient so it blends into the rest of the site */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${C.soil}cc 0%, ${C.soil}22 40%, ${C.soilDeep}f2 100%)` }} />
      </motion.div>

      {/* The Opening Brown Interface Curtain */}
      <motion.div 
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
        style={{ backgroundColor: C.soil }}
        initial={{ y: '0%' }}
        animate={{ y: '-100%' }}
        transition={{ duration: 1.4, delay: 2.2, ease: [0.76, 0, 0.24, 1] }}
      >

        <h1 className="leading-[0.95] text-center whitespace-nowrap font-primary w-full px-4 overflow-hidden text-ellipsis">
          {title.split(' ').map((word, wi, arr) => (
            <React.Fragment key={wi}>
              <span className="inline-block overflow-hidden align-bottom">
                <motion.span className="inline-block align-bottom" style={{
                  fontSize: 'clamp(1.5rem, 6vw, 7rem)', letterSpacing: '0.02em',
                  background: `linear-gradient(120deg, ${C.cream}, ${C.terra})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}
                  initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.1 + wi * 0.12, ease: C.ease }}>
                  {word}
                </motion.span>
              </span>
              {wi < arr.length - 1 && <span className="inline-block w-[3vw]">&nbsp;</span>}
            </React.Fragment>
          ))}
        </h1>
      </motion.div>



      {/* Scroll cue (fades in after curtain) */}
      <motion.div className="absolute bottom-10 inset-x-0 z-30 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5, duration: 1 }}>
        {/* Removed text as requested */}
        <motion.div className="w-5 h-8 rounded-full border flex justify-center pt-1.5" style={{ borderColor: `${C.cream}40` }}>
          <motion.div className="w-1 h-1.5 rounded-full" style={{ backgroundColor: C.terra }}
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }} />
        </motion.div>
      </motion.div>
    </section>
  );
};

// ── SCENE 2 · NARRATIVE (words chunked together) ────────────────────────────
const Narrative = ({ project }) => {
  const beats = [
    project.overview && { k: project.overviewHeading || 'The Brand', v: project.overview },
    project.challenge && { k: project.challengeHeading || 'The Question', v: project.challenge },
    project.solution && { k: project.solutionHeading || 'The Answer', v: project.solution },
  ].filter(Boolean);

  return (
    <section className="relative py-28 md:py-40 px-[7%]" style={{ background: `linear-gradient(180deg, ${C.soilDeep}, ${C.soil})` }}>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-14 md:gap-y-20">
          {beats.map((b, i) => (
            <motion.div key={b.k} className={i === beats.length - 1 && beats.length % 2 !== 0 ? 'md:col-span-2 md:max-w-2xl' : ''}
              initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-12%' }}
              transition={{ duration: 1, delay: i * 0.08, ease: C.ease }}>
              <div className="flex items-center gap-3 mb-5">
                <span className="font-primary text-sm" style={{ color: C.terra }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="h-px w-10" style={{ backgroundColor: `${C.terra}88` }} />
                <h3 className="text-xl md:text-2xl font-primary tracking-tight" style={{ color: C.terra }}>{b.k}</h3>
              </div>
              <p className="font-secondary font-light leading-relaxed whitespace-pre-line text-[17px] md:text-[19px]" style={{ color: `${C.cream}d9` }}>
                {b.v}
              </p>
            </motion.div>
          ))}
        </div>

        {project.fullStory?.execution && (
          <motion.blockquote className="mt-24 md:mt-32 text-center"
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-12%' }} transition={{ duration: 1.1, ease: C.ease }}>
            <span className="block font-primary mb-4 text-4xl" style={{ color: C.terra, lineHeight: 1 }}>“</span>
            <p className="font-primary font-light leading-snug mx-auto max-w-3xl text-2xl md:text-3xl" style={{ color: C.cream }}>
              {project.fullStory.execution}
            </p>
            <div className="w-16 h-px mx-auto mt-10" style={{ backgroundColor: C.terra }} />
          </motion.blockquote>
        )}
      </div>
    </section>
  );
};

// ── SCENE 3 · STORYTELLING CAROUSEL ──────────────────────────────────────────
const StoryChapterCarousel = ({ images, project, SITE_SETTINGS }) => {
  const containerRef = useRef(null);

  // We use standard CSS horizontal scroll plus a smooth auto-scroll effect
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();
    let speed = 0.6; // pixels per frame

    const scrollLoop = (time) => {
      const delta = time - lastTime;
      lastTime = time;
      
      if (containerRef.current) {
        // Auto-scroll runs continuously
        containerRef.current.scrollLeft += speed * (delta / 16);
        
        // Soft loop
        if (containerRef.current.scrollLeft >= containerRef.current.scrollWidth - containerRef.current.clientWidth - 5) {
            containerRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (!images || images.length === 0) return null;

  // Duplicate images for infinite scroll effect
  const extendedImages = [...images, ...images, ...images];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundColor: C.soilDeep }}>
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundSize: '120px', opacity: 0.1 }} />
      
      {(project?.carouselTitle || project?.carouselSubtext) && (
        <div className="text-center mb-16 px-[6%] relative z-10">
          {project?.carouselTitle && <h3 className="font-primary text-2xl md:text-4xl" style={{ color: C.terra }}>{project.carouselTitle}</h3>}
          {project?.carouselSubtext && <p className="text-sm font-secondary uppercase tracking-[0.3em] mt-4" style={{ color: `${C.cream}66` }}>{project.carouselSubtext}</p>}
        </div>
      )}

      <div 
        ref={containerRef}
        className="flex gap-16 md:gap-24 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-[10vw] pb-16 pt-8 items-center"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {extendedImages.map((img, index) => {
          const storyChapters = project?.fullStory?.storyChapters || [];
          const chData = storyChapters.length > 0 ? storyChapters[index % storyChapters.length] : null;
          const ch = chData ? { label: chData.chapterLabel, t: chData.title, l: chData.description } : null;

          return (
            <motion.div 
              key={`${img.key}-${index}`} 
              className="relative shrink-0 snap-center flex flex-col items-center"
              style={{ width: 'min(85vw, 420px)' }}
              initial={{ opacity: 0, rotateY: 45, x: 100 }}
              whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
              viewport={{ margin: "-10%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Adaptive Image Container */}
              <div className="w-full relative p-3 bg-[#0E0805] shadow-2xl overflow-hidden z-10" 
                   style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.8)', transformStyle: 'preserve-3d' }}>
                <Sprockets pos="top" />
                <Sprockets pos="bottom" />
                <div className="w-full overflow-hidden bg-white/5 flex items-center justify-center relative border border-white/5 p-2">
                  {img ? (
                    <CaseStudyMedia
                      item={img}
                      alt={ch?.t || 'Case study image'}
                      className="w-full h-auto object-contain shadow-inner"
                      sizes="(min-width: 768px) 420px, 85vw"
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] flex items-center justify-center">
                      <span className="text-white/30 text-xs uppercase tracking-widest font-secondary">Media Unavailable</span>
                    </div>
                  )}
                </div>
                <RegMarks />
              </div>

              {/* Chapter Text */}
              {ch && (
                <div className="mt-8 text-center max-w-[80%]">
                  {ch.label && (
                    <p className="text-xs font-secondary uppercase tracking-[0.2em] mb-2" style={{ color: `${C.cream}80` }}>
                      {ch.label}
                    </p>
                  )}
                  {ch.t && (
                    <h4 className="text-xl md:text-2xl font-primary mb-3" style={{ color: C.cream }}>
                      {ch.t}
                    </h4>
                  )}
                  {ch.l && (
                    <p className="text-[17px] md:text-[19px] font-secondary leading-relaxed" style={{ color: `${C.cream}AA` }}>
                      {ch.l}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* CSS to hide scrollbar for webkit browsers */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
};

// ── ROOT ────────────────────────────────────────────────────────────────────
const BackToRootsExperience = ({ navigate, project }) => {
  const { SITE_SETTINGS } = useContext(GlobalContext) || {};
  const images = normalizeMediaItems(project.fullStory?.media || project.fullStory?.images, project.client || 'Case study media');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  return (
    <div className="w-full font-secondary relative" style={{ backgroundColor: C.soil, color: C.cream }}>
      <ScrollProgress />
      
      {/* Global Top Navigation */}
      <motion.div className="fixed top-0 left-0 w-full z-[100] flex items-center gap-3 px-6 pt-28 pb-6 md:px-12 md:pt-32 md:pb-8 pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 3.2 }}>
        <button onClick={() => navigate('home')} className="pointer-events-auto flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] font-secondary transition-colors hover:opacity-70 px-4 py-2 rounded-full border" style={{ color: C.cream, borderColor: `${C.cream}33`, backgroundColor: `${C.soilDeep}33`, backdropFilter: 'blur(8px)' }}>
          <ArrowLeft className="w-4 h-4" /> Home
        </button>
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] font-secondary transition-colors hover:opacity-70 px-4 py-2 rounded-full border text-white/60 hover:text-white border-white/20 bg-white/5 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> All Case Studies
        </button>
      </motion.div>
      <Cover project={project} navigate={navigate} SITE_SETTINGS={SITE_SETTINGS} />
      <Narrative project={project} />
      <StoryChapterCarousel images={images} project={project} SITE_SETTINGS={SITE_SETTINGS} />
      {/* ── OPTIONAL VIDEO SECTION ── */}
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
              orientation: project.videoSection.orientation // Inherit parent orientation if not set
            });
          });
        }

        if (allVideos.length === 0) return null;

        return (
          <CaseStudyVideoHero 
            videoHero={{ enabled: true, backgroundColor: C.soilDeep, backgroundText: project.client || 'Case Study' }} 
            fallbackName={project.client} 
            allVideos={allVideos} 
          />
        );
      })()}
    </div>
  );
};

export default BackToRootsExperience;
