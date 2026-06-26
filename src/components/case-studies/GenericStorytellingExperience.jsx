import React, { useRef, useState, useEffect, useContext } from 'react';
import { motion, useScroll, useTransform, useAnimationFrame, useMotionValue } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GlobalContext } from '../../App';
import CaseStudyVideoHero from './CaseStudyVideoHero';
import CaseStudyMedia, { normalizeMediaItems } from './CaseStudyMedia';
import { getSafeEmbedUrl } from '../../lib/videoUtils';

const ease = [0.16, 1, 0.3, 1];

const hexToRgba = (hex, alpha) => {
  if(!hex) return 'rgba(0,0,0,1)';
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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


// Film grain (procedural SVG noise)
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const Sprockets = ({ pos, c }) => (
  <div className={`absolute inset-x-2 ${pos === 'top' ? 'top-1' : 'bottom-1'} flex justify-between pointer-events-none`}>
    {Array.from({ length: 16 }).map((_, i) => (
      <span key={i} className="rounded-[1px]" style={{ width: 6, height: 4, backgroundColor: `${c.cream}1f` }} />
    ))}
  </div>
);

const RegMarks = ({ c }) => (
  <>
    {[['top-1 left-1', 'border-t border-l'], ['top-1 right-1', 'border-t border-r'], ['bottom-1 left-1', 'border-b border-l'], ['bottom-1 right-1', 'border-b border-r']].map(([pos, b]) => (
      <span key={pos} className={`absolute ${pos} ${b} w-4 h-4 pointer-events-none`} style={{ borderColor: `${c.terra}cc` }} />
    ))}
  </>
);

// ── Top scroll-progress bar ─────────────────────────────────────────────────
const ScrollProgress = ({ c }) => {
  const { scrollYProgress } = useScroll();
  return <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50" style={{ scaleX: scrollYProgress, background: `linear-gradient(90deg, ${c.terra}, ${c.cream})` }} />;
};

// ── SCENE 1 · COVER (Curtain Reveal) ───────────────────────────────
const Cover = ({ project, navigate, SITE_SETTINGS, c }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroImage = project.bannerVideo || project.fullStory?.heroVideo || project.bannerImage || project.fullStory?.heroImg || project.imageUrl;
  const title = (project.client || project.title || 'Case Study').toUpperCase();

  return (
    <section ref={ref} className="relative h-screen overflow-hidden" style={{ backgroundColor: c.soil }}>
      
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
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${c.soil}cc 0%, ${c.soil}22 40%, ${c.soilDeep}f2 100%)` }} />
      </motion.div>

      {/* The Opening Brown Interface Curtain */}
      <motion.div 
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
        style={{ backgroundColor: c.soil }}
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
                  background: `linear-gradient(120deg, ${c.cream}, ${c.terra})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}
                  initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.1 + wi * 0.12, ease: ease }}>
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
        <motion.div className="w-5 h-8 rounded-full border flex justify-center pt-1.5" style={{ borderColor: `${c.cream}40` }}>
          <motion.div className="w-1 h-1.5 rounded-full" style={{ backgroundColor: c.terra }}
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }} />
        </motion.div>
      </motion.div>
    </section>
  );
};

// ── SCENE 2 · NARRATIVE (words chunked together) ────────────────────────────
const Narrative = ({ project, c }) => {
  const about = project.overview && { k: project.overviewHeading || 'The Brand', v: project.overview };
  const problem = project.challenge && { k: project.challengeHeading || 'The Question', v: project.challenge };
  const solution = project.solution && { k: project.solutionHeading || 'The Answer', v: project.solution };

  const topBeats = [about, problem].filter(Boolean);

  return (
    <section className="relative py-28 md:py-40 px-[7%]" style={{ background: `linear-gradient(180deg, ${c.soilDeep}, ${c.soil})` }}>
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Parallel About & Problem */}
        {topBeats.length > 0 && (
          <div className={`grid ${topBeats.length === 2 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-x-16 gap-y-14 md:gap-y-20 w-full mb-16 md:mb-24`}>
            {topBeats.map((b, i) => (
              <motion.div key={b.k}
                initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 1, delay: i * 0.08, ease: "easeOut" }}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-primary text-sm" style={{ color: c.terra }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="h-px w-10" style={{ backgroundColor: `${c.terra}88` }} />
                  <h3 className="text-xl md:text-2xl font-primary tracking-tight" style={{ color: c.terra }}>{b.k}</h3>
                </div>
                <p className="font-secondary font-light leading-relaxed whitespace-pre-line text-[17px] md:text-[19px]" style={{ color: `${c.cream}d9` }}>
                  {b.v}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Centered Solution in Box */}
        {solution && (
          <motion.div 
            initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-12%' }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-4xl border p-10 md:p-14 relative overflow-hidden shadow-2xl" 
            style={{ borderColor: `${c.terra}30`, backgroundColor: `${c.soilDeep}99` }}
          >
            {/* Box Accent Glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(100% 100% at 50% 0%, ${c.terra}10 0%, transparent 100%)` }} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="font-primary text-sm" style={{ color: c.terra }}>{String(topBeats.length + 1).padStart(2, '0')}</span>
                <span className="h-px w-10" style={{ backgroundColor: `${c.terra}88` }} />
                <h3 className="text-xl md:text-2xl font-primary tracking-tight" style={{ color: c.terra }}>{solution.k}</h3>
              </div>
              <p className="font-secondary font-light leading-relaxed whitespace-pre-line text-[17px] md:text-[19px] text-center" style={{ color: `${c.cream}d9` }}>
                {solution.v}
              </p>
            </div>
          </motion.div>
        )}

        {project.fullStory?.execution && (
          <motion.blockquote className="mt-24 md:mt-32 text-center"
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-12%' }} transition={{ duration: 1.1, ease: "easeOut" }}>
            <span className="block font-primary mb-4 text-4xl" style={{ color: c.terra, lineHeight: 1 }}>“</span>
            <p className="font-primary font-light leading-snug mx-auto max-w-3xl text-2xl md:text-3xl" style={{ color: c.cream }}>
              {project.fullStory.execution}
            </p>
            <div className="w-16 h-px mx-auto mt-10" style={{ backgroundColor: c.terra }} />
          </motion.blockquote>
        )}
      </div>
    </section>
  );
};

// ── SCENE 3 · STORYTELLING CAROUSEL ──────────────────────────────────────────
const StoryChapterCarousel = ({ images, project, SITE_SETTINGS, c }) => {
  const containerRef = useRef(null);
  const firstSetRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const fallbackChapters = [
    { t: 'The Seed', l: 'Every brand begins as a single idea, planted deep.' },
    { t: 'The Soil', l: 'Nurtured by heritage, grounded in meaning.' },
    { t: 'First Light', l: 'A visual language breaks through the surface.' },
    { t: 'Taking Root', l: 'Identity spreads, steady and deliberate.' },
    { t: 'The Bloom', l: 'Form and feeling flourish into one.' },
    { t: 'The Harvest', l: 'A story ready to be shared with the world.' },
    { t: 'Full Circle', l: 'Rooted in the past, reaching for tomorrow.' },
  ];

  const siteDefaultChapters = SITE_SETTINGS?.defaultStoryChapters?.map(ch => ({
    label: ch.chapterLabel,
    t: ch.title,
    l: ch.description
  }));

  const defaultChaptersArray = (siteDefaultChapters?.length > 0) ? siteDefaultChapters : fallbackChapters;

  const hasImages = images && images.length > 0;
  
  const firstSetRef = useRef(null);
  const x = useMotionValue(0);

  // To prevent the "lag" or "jumping" bug when wrapping, we must ensure a single set
  // is physically wider than the user's screen. If they only upload 1-3 images, we duplicate 
  // them in the base array until it has enough items to span a large desktop.
  let baseImages = [];
  if (hasImages) {
    baseImages = [...images];
    while (baseImages.length < 6) {
      baseImages = [...baseImages, ...images];
    }
  }

  // Pure Framer Motion auto-scroller. Immune to CSS and native scroll float bugs.
  // Directly animates the X transform for ultra-smooth 60fps GPU acceleration.
  useAnimationFrame((time, delta) => {
    if (!hasImages) return;
    if (isPaused) return;

    // Adjust speed here (higher = faster)
    let moveBy = 0.8 * (delta / 16);
    let currentX = x.get() - moveBy;

    const wrapWidth = firstSetRef.current?.offsetWidth || 0;
    
    // When we've scrolled exactly one set width to the left, seamlessly reset
    if (wrapWidth > 0 && Math.abs(currentX) >= wrapWidth) {
      currentX += wrapWidth;
    }

    x.set(currentX);
  });

  if (!hasImages) return null;

  const renderCard = (img, index, prefix) => {
    // We map back to the original index using modulo so chapters match properly
    const originalIndex = index % images.length;
    const storyChapters = project?.fullStory?.storyChapters || [];
    const chData = storyChapters.length > 0 ? storyChapters[originalIndex % storyChapters.length] : null;
    const defaultCh = defaultChaptersArray[originalIndex % defaultChaptersArray.length];
    const ch = chData ? {
      label: chData.chapterLabel, // No default label, optional
      t: chData.title || defaultCh.t,
      l: chData.description || defaultCh.l
    } : defaultCh;

    return (
      <motion.div
        key={`${prefix}-${img?.key ?? index}-${index}`}
        className="relative shrink-0 flex flex-col items-center"
        style={{ width: 'min(85vw, 420px)', maxHeight: '75vh' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Adaptive Image Container */}
        <div className="w-full h-full max-h-[60vh] relative p-3 bg-[#0E0805] shadow-2xl flex flex-col z-10 hover:scale-[1.02] transition-transform duration-500 cursor-grab active:cursor-grabbing"
             style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}>
          <Sprockets pos="top" c={c} />
          <Sprockets pos="bottom" c={c} />
          <div className="flex-1 w-full overflow-hidden bg-white/5 flex items-center justify-center relative border border-white/5 p-2 min-h-0 pointer-events-none">
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
          <RegMarks c={c} />
        </div>

        {/* Chapter Text */}
        <div className="mt-8 text-center max-w-[80%] pointer-events-none">
          <p className="text-xs font-secondary uppercase tracking-[0.2em] mb-2" style={{ color: `${c.cream}80` }}>
            {ch.label}
          </p>
          <h4 className="text-xl md:text-2xl font-primary mb-3" style={{ color: c.cream }}>
            {ch.t}
          </h4>
          <p className="text-[17px] md:text-[19px] font-secondary leading-relaxed" style={{ color: `${c.cream}AA` }}>
            {ch.l}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundColor: c.soilDeep }}>
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundSize: '120px', opacity: 0.1 }} />

      <div className="text-center mb-16 px-[6%] relative z-10">
        <h3 className="font-primary text-2xl md:text-4xl" style={{ color: c.terra }}>{project?.carouselTitle || SITE_SETTINGS?.csCarouselFallbackTitle || 'The Unfolding Story'}</h3>
        <p className="text-sm font-secondary uppercase tracking-[0.3em] mt-4" style={{ color: `${c.cream}66` }}>{project?.carouselSubtext || SITE_SETTINGS?.csCarouselFallbackSubtitle || 'Scroll or drag to explore'}</p>
      </div>

      <div 
        className="w-full overflow-hidden pb-16 pt-8 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <motion.div 
          className="flex w-max"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -100000, right: 100000 }} // Very large constraints to prevent drag snap-back
          onDrag={(e, info) => {
            // Support dragging manually and wrapping on the fly!
            let currentX = x.get();
            const wrapWidth = firstSetRef.current?.offsetWidth || 0;
            if (wrapWidth > 0) {
              if (currentX <= -wrapWidth) currentX += wrapWidth;
              else if (currentX > 0) currentX -= wrapWidth;
              x.set(currentX);
            }
          }}
        >
          <div ref={firstSetRef} className="flex gap-16 md:gap-24 items-center pl-[5vw] pr-16 md:pr-24 shrink-0">
            {baseImages.map((img, i) => renderCard(img, i, 'a'))}
          </div>
          <div className="flex gap-16 md:gap-24 items-center pr-16 md:pr-24 shrink-0" aria-hidden="true">
            {baseImages.map((img, i) => renderCard(img, i, 'b'))}
          </div>
        </motion.div>
      </div>

    </section>
  );
};

// ── ROOT ────────────────────────────────────────────────────────────────────
const GenericStorytellingExperience = ({ navigate, project }) => {
  const pColors = project?.colors || ['#6865FA', '#010836', '#010D54', '#F4F4F5'];
  const c = { terra: pColors[0] || '#6865FA', soil: pColors[1] || '#010836', soilDeep: pColors[2] || '#010D54', cream: pColors[3] || '#F4F4F5' };

  const { SITE_SETTINGS } = useContext(GlobalContext) || {};
  
  const hasStoryChapters = project.fullStory?.storyChapters?.length > 0;
  const mediaSource = hasStoryChapters 
    ? project.fullStory.storyChapters 
    : (project.fullStory?.media || project.fullStory?.images);
  const images = normalizeMediaItems(mediaSource, project.client || 'Case study media');
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  return (
    <div className="w-full font-secondary relative" style={{ backgroundColor: c.soil, color: c.cream }}>
      <ScrollProgress c={c} />
      
      {/* Global Top Navigation */}
      <motion.div className="fixed top-0 left-0 w-full z-[100] flex items-center gap-3 px-6 pt-28 pb-6 md:px-12 md:pt-32 md:pb-8 pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 3.2 }}>
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2 text-sm md:text-base backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </motion.div>
      
      <Cover project={project} navigate={navigate} SITE_SETTINGS={SITE_SETTINGS} c={c} />
      <Narrative project={project} c={c} />
      <StoryChapterCarousel images={images} project={project} SITE_SETTINGS={SITE_SETTINGS} c={c} />
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
                  className="w-full h-auto rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/5"
                  aria-label={altText}
                />
              ) : (
                <CaseStudyMedia
                  src={media?.imageUrl || legacyImage}
                  alt={altText}
                  className="w-full h-auto rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/5"
                  sizes="100vw"
                />
              )}
            </div>
          </section>
        );
      })()}

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
          backgroundColor: c.soilDeep,
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
    </div>
  );
};

export default GenericStorytellingExperience;
