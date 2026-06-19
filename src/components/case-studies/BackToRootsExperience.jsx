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

// ── SCENE 1 · COVER (heading clearly visible) ───────────────────────────────
const Cover = ({ project, navigate, SITE_SETTINGS }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const heroImage = project.bannerImage || project.fullStory?.heroImg || project.imageUrl;
  const title = (project.client || 'Back To Roots').toUpperCase();

  return (
    <section ref={ref} className="relative h-screen overflow-hidden" style={{ backgroundColor: C.soil }}>
      <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
        {heroImage && <img src={heroImage} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${C.soil}d9 0%, ${C.soil}55 40%, ${C.soilDeep}f2 100%)` }} />
      </motion.div>

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex justify-between items-center px-[5%] pt-9">
        <button onClick={() => navigate('work')} className="flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] font-secondary transition-colors" style={{ color: `${C.cream}99` }}>
          <ArrowLeft className="w-4 h-4" /> {SITE_SETTINGS?.csBackToWork || 'Work'}
        </button>
        <span className="text-[10px] uppercase tracking-[0.3em] font-secondary" style={{ color: `${C.cream}66` }}>
          {project?.type || 'A Story'}
        </span>
      </div>

      {/* Heading */}
      <motion.div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6" style={{ y: titleY }}>
        <motion.span className="block text-[11px] md:text-xs uppercase tracking-[0.5em] mb-8 font-secondary" style={{ color: C.terra }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}>
          {project.sector || 'Brand Storytelling'}
        </motion.span>
        <h1 className="leading-[0.95]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {title.split(' ').map((word, wi) => (
            <span key={wi} className="block overflow-hidden">
              <motion.span className="inline-block" style={{
                fontSize: 'clamp(3rem, 11vw, 11rem)', letterSpacing: '0.04em',
                background: `linear-gradient(120deg, ${C.cream}, ${C.terra})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
                initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.3 + wi * 0.12, ease: C.ease }}>
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div className="w-px mt-10 origin-top" style={{ backgroundColor: C.terra }}
          initial={{ height: 0 }} animate={{ height: 64 }} transition={{ duration: 1.4, delay: 1.1, ease: C.ease }} />
      </motion.div>

      {/* Scroll cue */}
      <motion.div className="absolute bottom-10 inset-x-0 z-20 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
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
      <div className="max-w-5xl mx-auto">
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

// ── SCENE 3 · IMAGE CHAPTERS (vertical, artistic, gradient) ─────────────────
const StoryChapter = ({ img, index, total }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const kb = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.06]);

  const storyChapters = project?.fullStory?.storyChapters || [];
  const chData = storyChapters.length > 0 ? storyChapters[index % storyChapters.length] : null;
  const ch = chData ? { t: chData.title, l: chData.description } : DEFAULT_CHAPTERS[index % DEFAULT_CHAPTERS.length];
  const num = String(index + 1).padStart(2, '0');
  const left = index % 2 === 0;
  const grad = GRADS[index % GRADS.length];

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden py-24 md:py-28" style={{ background: grad }}>
      {/* Ghost numeral */}
      <span className="absolute font-serif pointer-events-none select-none leading-none"
        style={{ color: `${C.terra}12`, fontSize: '52vh', top: '50%', transform: 'translateY(-50%)', [left ? 'right' : 'left']: '4%' }}>
        {num}
      </span>

      <div className={`relative z-10 w-full max-w-7xl mx-auto px-[6%] flex flex-col gap-12 md:gap-14 items-center ${left ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        {/* Film cell */}
        <motion.figure className="md:w-[64%] flex justify-center" style={{ y }}
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-15%' }} transition={{ duration: 1, ease: C.ease }}>
          <div className="relative px-3 py-4 md:px-4 md:py-5" style={{ backgroundColor: '#0E0805', boxShadow: '0 40px 90px rgba(0,0,0,0.55)' }}>
            <Sprockets pos="top" />
            <Sprockets pos="bottom" />
            <div className="relative overflow-hidden">
              <motion.img src={img} alt={ch.t} className="block w-auto h-auto object-contain"
                style={{ maxHeight: '68vh', maxWidth: 'min(60vw, 820px)', y: kb }} />
              {/* Warm duotone gradient grade */}
              <div className="absolute inset-0 pointer-events-none mix-blend-soft-light" style={{ background: `linear-gradient(155deg, ${C.terra} 0%, transparent 55%, ${C.soilDeep} 100%)` }} />
              {/* Bottom gradient fade */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none" style={{ background: `linear-gradient(to top, ${C.soilDeep}cc, transparent)` }} />
              {/* Vignette */}
              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 90px rgba(0,0,0,0.5)' }} />
              {/* Grain */}
              <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundSize: '120px', opacity: 0.22 }} />
            </div>
            <div className="absolute inset-2 md:inset-2.5 border pointer-events-none" style={{ borderColor: `${C.cream}1f` }} />
            <RegMarks />
          </div>
        </motion.figure>

        {/* Caption */}
        <motion.div className={`md:w-[36%] text-center ${left ? 'md:text-left' : 'md:text-right'}`}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-15%' }} transition={{ duration: 0.9, delay: 0.2, ease: C.ease }}>
          <div className={`flex items-center gap-3 mb-4 justify-center ${left ? 'md:justify-start' : 'md:justify-end md:flex-row-reverse'}`}>
            <span className="h-px w-10" style={{ backgroundColor: C.terra }} />
            <span className="text-[10px] uppercase tracking-[0.4em] font-secondary" style={{ color: C.terra }}>Chapter {num} / {String(total).padStart(2, '0')}</span>
          </div>
          <h3 className="font-serif leading-none mb-5" style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            background: `linear-gradient(120deg, ${C.cream}, ${C.terra})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>{ch.t}</h3>
          <p className="font-serif font-light italic leading-relaxed" style={{ color: `${C.cream}b3`, fontSize: 'clamp(1.05rem, 1.7vw, 1.35rem)' }}>{ch.l}</p>
        </motion.div>
      </div>
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
      {images.map((img, i) => (
        <StoryChapter key={i} img={img} index={i} total={images.length} />
      ))}
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
