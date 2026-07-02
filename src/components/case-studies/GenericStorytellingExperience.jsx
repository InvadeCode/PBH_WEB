import React, { useRef, useState, useEffect, useContext } from 'react';
import { motion, useScroll, useTransform, useAnimationFrame, useMotionValue } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import { GlobalContext } from '../../App';
import CaseStudyVideoHero, { hasVideoHeroSource } from './CaseStudyVideoHero';
import CaseStudyMedia, { normalizeMediaItems } from './CaseStudyMedia';
import CaseStudySectorPill from './CaseStudySectorPill';
import { getSafeEmbedUrl } from '../../lib/videoUtils';
import { DEFAULT_STORY_CHAPTERS } from '../../lib/defaultStoryChapters';

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

const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');

const normalizeChapterCopy = (chapter) => ({
  label: cleanText(chapter?.chapterLabel),
  t: cleanText(chapter?.title || chapter?.caption),
  l: cleanText(chapter?.description),
});

const getEditableChapters = (chapters, { preserveSlots = false } = {}) => {
  if (!Array.isArray(chapters)) return [];

  const normalizedChapters = chapters.map(normalizeChapterCopy);
  return preserveSlots
    ? normalizedChapters
    : normalizedChapters.filter((chapter) => chapter.label || chapter.t || chapter.l);
};

const BUILT_IN_STORY_CHAPTERS = getEditableChapters(DEFAULT_STORY_CHAPTERS);

const resolveChapterCopy = ({ projectChapters, defaultChapters, image, index }) => {
  const projectChapter = projectChapters.length ? projectChapters[index % projectChapters.length] : {};
  const defaultChapter = defaultChapters.length ? defaultChapters[index % defaultChapters.length] : {};
  const imageChapter = normalizeChapterCopy(image);

  return {
    label: projectChapter.label || defaultChapter.label || imageChapter.label,
    t: projectChapter.t || defaultChapter.t || imageChapter.t,
    l: projectChapter.l || defaultChapter.l || imageChapter.l,
  };
};

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
      <div className="pointer-events-none absolute left-1/2 top-36 z-10 -translate-x-1/2 px-4 md:top-40">
        <CaseStudySectorPill
          sector={project?.sector || (project?.tags?.length > 0 ? project.tags[0] : null) || (project?.roles?.length > 0 ? project.roles[0] : null)}
          className="border bg-[#6f6a62]/55 text-[#fff6e5] shadow-[0_16px_42px_rgba(0,0,0,0.24)] backdrop-blur-md"
          style={{ borderColor: `${c.cream}24` }}
        />
      </div>

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

const Page = React.forwardRef((props, ref) => {
  return (
    <div className={`page ${props.className || ''}`} ref={ref} style={props.style}>
      {props.children}
    </div>
  );
});

const Narrative = ({ project, c }) => {
  const about = project.overview && { k: project.overviewHeading || 'The Brand', v: project.overview };
  const problem = project.challenge && { k: project.challengeHeading || 'The Question', v: project.challenge };
  const solution = project.solution && { k: project.solutionHeading || 'The Answer', v: project.solution };

  const pages = [about, problem, solution].filter(Boolean);

  if (pages.length === 0) return null;

  return (
    <section className="relative w-full h-[90vh] min-h-[600px] overflow-hidden bg-[#0d0714]">
      {/* Background aesthetic to ensure anything beyond the book is seamless */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-repeat" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="absolute inset-0 w-full h-full">
        <HTMLFlipBook 
          width={800} 
          height={800} 
          size="stretch" 
          minWidth={300} 
          maxWidth={3000} 
          minHeight={400} 
          maxHeight={2000} 
          maxShadowOpacity={0.8} 
          showCover={true} 
          mobileScrollSupport={true}
          usePortrait={true}
          flippingTime={1200}
        >
          {/* COVER PAGE */}
          <Page className="flex flex-col justify-center items-center overflow-hidden border-l relative h-full w-full" style={{ backgroundColor: '#1a1126', borderColor: '#ffffff10' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(120% 120% at 50% 0%, #b091f025 0%, transparent 100%)` }} />
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-repeat" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            {/* Absolute Centering */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8 md:px-16 text-center">
              <h2 className="text-xl md:text-2xl md:text-4xl md:text-5xl font-primary tracking-tight text-[#f5f0ff] drop-shadow-lg">The Story</h2>
              <div className="w-16 h-px mx-auto mt-6 bg-[#d8cbf255]" />
            </div>
            
            <span className="absolute bottom-10 right-10 text-[16px] md:text-[17px] font-secondary uppercase tracking-widest text-[#d8cbf2]/50 drop-shadow-md">
              Drag to Peel
            </span>
          </Page>

          {/* INNER PAGES */}
          {pages.map((p, i) => (
            <Page key={i} className="flex flex-col justify-center items-center overflow-hidden border-x relative h-full w-full" style={{ backgroundColor: '#1a1126', borderColor: '#ffffff10' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(120% 120% at 50% 0%, #b091f015 0%, transparent 100%)` }} />
              
              {/* Text Content centered perfectly inside the massive full-screen boundaries */}
              <div className="relative z-10 w-full h-full px-8 md:px-24 flex flex-col justify-center items-center text-center">
                <div className="flex items-center justify-center gap-4 mb-10 w-full">
                  <span className="font-primary text-[16px] md:text-[17px] md:text-[16px] md:text-[17px] text-[#b091f0]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="h-px w-12 bg-[#b091f0]/40" />
                  <h3 className="text-2xl md:text-xl md:text-2xl font-primary tracking-tight text-[#f5f0ff] drop-shadow-md">{p.k}</h3>
                </div>
                <p className="font-secondary font-light leading-relaxed text-[17px] md:text-[22px] text-[#d8cbf2] max-w-3xl drop-shadow-sm">
                  {p.v}
                </p>
              </div>

              <span className="absolute bottom-10 right-10 text-[16px] md:text-[17px] font-secondary uppercase tracking-widest text-[#d8cbf2]/40">
                Page {i + 1}
              </span>
            </Page>
          ))}
          
          {/* BACK COVER / BLANK */}
          <Page className="flex items-center justify-center relative overflow-hidden h-full w-full" style={{ backgroundColor: '#0d0714' }}>
             <div className="w-full h-full absolute inset-0 opacity-5 bg-repeat" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
             <span className="font-primary text-5xl opacity-10 tracking-widest text-[#d8cbf2]">PBH</span>
          </Page>
        </HTMLFlipBook>
      </div>

      {/* Testimonial Section sits fixed over the flip so it floats elegantly */}
      {project.fullStory?.execution && (
        <div className="absolute bottom-12 inset-x-0 z-50 text-center px-[7%] pointer-events-none mix-blend-screen opacity-70">
          <span className="block font-primary mb-2 text-xl md:text-2xl drop-shadow-lg" style={{ color: '#b091f0', lineHeight: 1 }}>“</span>
          <p className="font-primary font-light leading-snug mx-auto max-w-4xl text-xl md:text-2xl drop-shadow-md" style={{ color: '#f5f0ff' }}>
            {project.fullStory.execution}
          </p>
        </div>
      )}
    </section>
  );
};

// ── SCENE 3 · STORYTELLING CAROUSEL ──────────────────────────────────────────
const StoryChapterCarousel = ({ images, project, SITE_SETTINGS, c }) => {
  const containerRef = useRef(null);
  const firstSetRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const projectChapters = getEditableChapters(project?.fullStory?.storyChapters, { preserveSlots: true });
  const editableDefaultChapters = getEditableChapters(SITE_SETTINGS?.defaultStoryChapters);
  const defaultChapters = editableDefaultChapters.length ? editableDefaultChapters : BUILT_IN_STORY_CHAPTERS;

  const hasImages = images && images.length > 0;

  const x = useMotionValue(0);

  // PERF: pause RAF when carousel is off-screen
  const isVisible = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry.isIntersecting; },
      { rootMargin: '100px' }
    );
    if (containerRef.current) io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

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
    // PERF: skip when off-screen
    if (!isVisible.current) return;

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
    const ch = resolveChapterCopy({
      projectChapters,
      defaultChapters,
      image: img,
      index: originalIndex,
    });
    const hasChapterText = Boolean(ch.label || ch.t || ch.l);

    return (
      <motion.div
        key={`${prefix}-${img?.key ?? index}-${index}`}
        className="relative shrink-0 flex flex-col items-center max-h-[50vh] md:max-h-[75vh]"
        style={{ width: 'min(85vw, 420px)' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Adaptive Image Container */}
        <div className="w-full h-full max-h-[40vh] md:max-h-[60vh] relative p-3 bg-[#0E0805] shadow-2xl flex flex-col z-10 hover:scale-[1.02] transition-transform duration-500 cursor-grab active:cursor-grabbing"
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
                <span className="text-white/30 text-[16px] md:text-[17px] uppercase tracking-widest font-secondary">Media Unavailable</span>
              </div>
            )}
          </div>
          <RegMarks c={c} />
        </div>

        {/* Chapter Text */}
        {hasChapterText && (
          <div className="mt-8 text-center max-w-[80%] pointer-events-none">
            {ch.label && (
              <p className="text-[16px] md:text-[17px] font-secondary uppercase tracking-[0.2em] mb-2" style={{ color: `${c.cream}80` }}>
                {ch.label}
              </p>
            )}
            {ch.t && (
              <h4 className="text-xl md:text-2xl font-primary mb-3" style={{ color: c.cream }}>
                {ch.t}
              </h4>
            )}
            {ch.l && (
              <p className="text-[16px] md:text-[17px] font-secondary leading-relaxed" style={{ color: `${c.cream}AA` }}>
                {ch.l}
              </p>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <section ref={containerRef} className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundColor: c.soilDeep }}>
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundSize: '120px', opacity: 0.1 }} />

      <div className="text-center mb-16 px-[6%] relative z-10">
        <h3 className="font-primary text-2xl md:text-xl md:text-2xl" style={{ color: c.terra }}>{project?.carouselTitle || SITE_SETTINGS?.csCarouselFallbackTitle || 'The Unfolding Story'}</h3>
        <p className="text-[16px] md:text-[17px] font-secondary uppercase tracking-[0.3em] mt-4" style={{ color: `${c.cream}66` }}>{project?.carouselSubtext || SITE_SETTINGS?.csCarouselFallbackSubtitle || 'Scroll or drag to explore'}</p>
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
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2 text-[16px] md:text-[17px] md:text-[16px] md:text-[17px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white group">
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
                  preload="metadata"
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

        const rawMainVideoData = hasVideoHero ? project.videoHero : {
          enabled: true,
          backgroundText: project.client || 'Case Study',
          videoTitle: allVideos[0]?.videoTitle || 'Watch Video',
          videoSubtitle: allVideos[0]?.videoSubtitle || 'Experience the story in motion.',
          embedUrl: allVideos[0]?.videoUrl,
          uploadedVideoUrl: allVideos[0]?.videoFileUrl,
          thumbnailUrl: allVideos[0]?.thumbnailUrl
        };

        const mainVideoData = {
          ...rawMainVideoData,
          backgroundColor: 'transparent'
        };
        
        return (
          <CaseStudyVideoHero videoHero={mainVideoData} fallbackName={project.client} allVideos={allVideos} />
        );
      })()}
    </div>
  );
};

export default GenericStorytellingExperience;
