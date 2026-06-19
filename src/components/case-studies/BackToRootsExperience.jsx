import { useRef, useEffect, useContext } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GlobalContext } from '../../App';

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
  const heroImage = project.bannerImage || project.fullStory?.heroImg || project.imageUrl;
  const title = (project.client || 'Back To Roots').toUpperCase();

  return (
    <section ref={ref} className="relative h-screen overflow-hidden" style={{ backgroundColor: C.soil }}>
      
      {/* The Banner Image (revealed underneath) */}
      <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
        {heroImage && <img src={heroImage} alt="" className="w-full h-full object-cover" />}
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
        <motion.span className="block text-[11px] md:text-xs uppercase tracking-[0.5em] mb-8 font-secondary" style={{ color: C.terra }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
          {project.sector || 'Brand Storytelling'}
        </motion.span>
        <h1 className="leading-[0.95] text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {title.split(' ').map((word, wi) => (
            <span key={wi} className="block overflow-hidden">
              <motion.span className="inline-block" style={{
                fontSize: 'clamp(3rem, 11vw, 11rem)', letterSpacing: '0.04em',
                background: `linear-gradient(120deg, ${C.cream}, ${C.terra})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
                initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.1 + wi * 0.12, ease: C.ease }}>
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
      </motion.div>

      {/* Top bar (fades in after curtain) */}
      <motion.div className="absolute top-0 inset-x-0 z-30 flex justify-between items-center px-[5%] pt-9"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 3.2 }}>
        <button onClick={() => navigate('work')} className="flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] font-secondary transition-colors hover:opacity-70" style={{ color: `${C.cream}99` }}>
          <ArrowLeft className="w-4 h-4" /> {SITE_SETTINGS?.csBackToWork || 'Work'}
        </button>
        <span className="text-[10px] uppercase tracking-[0.3em] font-secondary" style={{ color: `${C.cream}66` }}>
          {project?.type || 'A Story'}
        </span>
      </motion.div>

      {/* Scroll cue (fades in after curtain) */}
      <motion.div className="absolute bottom-10 inset-x-0 z-30 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5, duration: 1 }}>
        <span className="text-[9px] uppercase tracking-[0.4em] font-secondary" style={{ color: `${C.cream}55` }}>{SITE_SETTINGS?.csScrollStory || 'Scroll the story'}</span>
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
                <span className="font-serif text-sm" style={{ color: C.terra }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="h-px w-10" style={{ backgroundColor: `${C.terra}88` }} />
                <h3 className="text-sm md:text-base font-serif uppercase tracking-[0.2em]" style={{ color: C.terra }}>{b.k}</h3>
              </div>
              <p className="font-serif font-light leading-relaxed whitespace-pre-line" style={{ color: `${C.cream}d9`, fontSize: 'clamp(1.05rem, 1.6vw, 1.4rem)' }}>
                {b.v}
              </p>
            </motion.div>
          ))}
        </div>

        {project.fullStory?.execution && (
          <motion.blockquote className="mt-24 md:mt-32 text-center"
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-12%' }} transition={{ duration: 1.1, ease: C.ease }}>
            <span className="block font-serif mb-4" style={{ color: C.terra, fontSize: '3.5rem', lineHeight: 1 }}>“</span>
            <p className="font-serif font-light italic leading-snug mx-auto max-w-3xl" style={{ color: C.cream, fontSize: 'clamp(1.6rem, 3.5vw, 3rem)' }}>
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
      
      <div className="text-center mb-16 px-[6%] relative z-10">
        <h3 className="font-serif text-3xl md:text-5xl" style={{ color: C.terra }}>{project?.carouselTitle || 'The Unfolding Story'}</h3>
        <p className="text-sm font-secondary uppercase tracking-[0.3em] mt-4" style={{ color: `${C.cream}66` }}>{project?.carouselSubtext || 'Scroll or drag to explore'}</p>
      </div>

      <div 
        ref={containerRef}
        className="flex gap-16 md:gap-24 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-[10vw] pb-16 pt-8 items-center"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {extendedImages.map((img, index) => {
          const storyChapters = project?.fullStory?.storyChapters || [];
          const chData = storyChapters.length > 0 ? storyChapters[index % storyChapters.length] : null;
          const ch = chData ? { t: chData.title, l: chData.description } : DEFAULT_CHAPTERS[index % DEFAULT_CHAPTERS.length];
          const num = String((index % images.length) + 1).padStart(2, '0');

          return (
            <motion.div 
              key={index} 
              className="relative shrink-0 snap-center flex flex-col items-center"
              style={{ width: 'min(85vw, 420px)' }}
              initial={{ opacity: 0, rotateY: 45, x: 100 }}
              whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
              viewport={{ margin: "-10%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Giant Background Ghost Numeral */}
              <span className="absolute font-serif pointer-events-none select-none leading-none z-0"
                style={{ 
                  color: `${C.terra}1a`, 
                  fontSize: '40vh', 
                  top: '50%', 
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}>
                {num}
              </span>

              {/* Vertical / Portrait Image Container */}
              <div className="w-full aspect-[3/4] relative p-3 bg-[#0E0805] shadow-2xl overflow-hidden z-10" 
                   style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.8)', transformStyle: 'preserve-3d' }}>
                <Sprockets pos="top" />
                <Sprockets pos="bottom" />
                <div className="absolute inset-3 overflow-hidden">
                  <img src={img} alt={ch.t} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 pointer-events-none mix-blend-soft-light" style={{ background: `linear-gradient(155deg, ${C.terra} 0%, transparent 55%, ${C.soilDeep} 100%)` }} />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none" style={{ background: `linear-gradient(to top, ${C.soilDeep}f2, transparent)` }} />
                </div>
                
                {/* Floating Text within the "Page" */}
                <div className="absolute bottom-8 inset-x-6 text-center z-20">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-secondary mb-3 block" style={{ color: C.terra }}>
                    Chapter {num}
                  </span>
                  <h4 className="font-serif leading-none mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: C.cream }}>
                    {ch.t}
                  </h4>
                  <p className="font-serif font-light italic leading-snug text-sm md:text-base" style={{ color: `${C.cream}b3` }}>
                    {ch.l}
                  </p>
                </div>
                <RegMarks />
              </div>
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

// ── SCENE 4 · ARRIVAL ───────────────────────────────────────────────────────
const Arrival = ({ project, navigate, SITE_SETTINGS }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'center center'] });
  const bg = useTransform(scrollYProgress, [0, 1], [C.soilDeep, C.cream]);
  const fg = useTransform(scrollYProgress, [0, 1], [C.cream, '#2A1810']);

  return (
    <motion.section ref={ref} style={{ backgroundColor: bg }} className="py-40 md:py-52 px-[6%] min-h-screen flex flex-col items-center justify-center">
      <motion.h2 style={{ color: fg }} className="text-4xl md:text-7xl font-serif leading-snug text-center max-w-4xl mb-24 whitespace-pre-line">
        {project?.arrivalText || "A journey completed,\na story eternal."}
      </motion.h2>
      <motion.div style={{ color: fg, borderColor: 'currentColor' }} className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl text-center border-t pt-16 opacity-90">
        {[['Client', project.client], ['Route', project.route || 'Brand Boulevard'], ['Roles', project.roles?.join(' · ') || 'Branding · Storytelling']].map(([k, v]) => (
          <div key={k}>
            <h4 className="text-[10px] uppercase tracking-[0.3em] opacity-50 mb-3 font-secondary">{k}</h4>
            <p className="text-xl md:text-2xl font-serif">{v}</p>
          </div>
        ))}
      </motion.div>
      <motion.button onClick={() => navigate('work')} style={{ color: fg, borderColor: 'currentColor' }}
        className="mt-24 px-8 py-3 rounded-full border uppercase tracking-[0.25em] text-[11px] font-secondary font-medium transition-opacity hover:opacity-60">
        {SITE_SETTINGS?.csBackToWork || '← Back to all work'}
      </motion.button>
    </motion.section>
  );
};

// ── ROOT ────────────────────────────────────────────────────────────────────
const BackToRootsExperience = ({ navigate, project }) => {
  const { SITE_SETTINGS } = useContext(GlobalContext) || {};
  const images = (project.fullStory?.images || []).map(it => (typeof it === 'string' ? it : it?.url || it?.imageUrl)).filter(Boolean);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  return (
    <div className="w-full font-secondary relative" style={{ backgroundColor: C.soil, color: C.cream }}>
      <ScrollProgress />
      <Cover project={project} navigate={navigate} SITE_SETTINGS={SITE_SETTINGS} />
      <Narrative project={project} />
      <StoryChapterCarousel images={images} project={project} SITE_SETTINGS={SITE_SETTINGS} />
      {/* ── OPTIONAL VIDEO SECTION ── */}
      {(project?.videoSection?.videoUrl || project?.videoSection?.videoFileUrl) && (
        <section className="relative w-full py-24 md:py-32 px-[6%] z-10 bg-[#0E0805]">
          <div className="max-w-[1200px] mx-auto">
            <div className="relative w-full rounded-[1rem] md:rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 bg-black aspect-video">
              {project.videoSection.videoUrl ? (
                <iframe
                  className="w-full h-full"
                  src={project.videoSection.videoUrl}
                  title="Case Study Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              ) : (
                <video
                  className="w-full h-full object-cover"
                  src={project.videoSection.videoFileUrl}
                  controls
                  playsInline
                />
              )}
            </div>
          </div>
        </section>
      )}
      
      <Arrival project={project} navigate={navigate} SITE_SETTINGS={SITE_SETTINGS} />
    </div>
  );
};

export default BackToRootsExperience;
