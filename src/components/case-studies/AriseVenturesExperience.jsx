import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const ARISE = {
  bg: '#010836',
  bgDeep: '#010521',
  panel: '#0C185C',
  paper: '#F4F4F5',
  rule: 'rgba(244,244,245,0.12)',
  gold: '#FFCD00',
  indigo: '#6865FA',
};

// ─── Scroll Rail ─────────────────────────────────────────────────────────────
// 1px gold vertical left rail that fills as you scroll the page

const ScrollRail = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      className="fixed left-0 top-0 w-px origin-top z-50 pointer-events-none"
      style={{ scaleY, backgroundColor: ARISE.gold, height: '100vh' }}
    />
  );
};

// ─── Primitives ───────────────────────────────────────────────────────────────

const MotionLine = ({ delay = 0, className = '' }) => (
  <motion.div
    className={`h-px origin-left ${className}`}
    style={{ backgroundColor: ARISE.rule }}
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, amount: 0.7 }}
    transition={{ duration: 0.9, delay, ease: 'linear' }}
  />
);

const SectionLabel = ({ index, children }) => (
  <div className="flex items-center gap-5 text-[10px] uppercase tracking-[0.32em] font-primary text-white/40">
    <span style={{ color: ARISE.gold }}>{index}</span>
    <span>{children}</span>
  </div>
);

// Character-by-character mask reveal — each letter lifts through its own slot
const CharReveal = ({ text, delay = 0, stagger = 0.028, duration = 0.9, className = '', inView = false }) => {
  const words = text.split(' ');
  let charIndex = 0;

  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="mr-[0.28em] inline-flex whitespace-nowrap last:mr-0">
          {word.split('').map((ch, i) => {
            const currentIndex = charIndex;
            charIndex += 1;

            return (
              <span key={`${ch}-${wordIndex}-${i}`} className="inline-block overflow-hidden" style={{ lineHeight: 'inherit', verticalAlign: 'bottom' }}>
                <motion.span
                  className="inline-block"
                  initial={{ y: '106%' }}
                  {...(inView
                    ? { whileInView: { y: 0 }, viewport: { once: true, amount: 0.3 } }
                    : { animate: { y: 0 } })}
                  transition={{ duration, delay: delay + currentIndex * stagger, ease: 'linear' }}
                >
                  {ch}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

// Word-by-word reveal
const WordByWord = ({ text, baseDelay = 0, stagger = 0.05, duration = 0.55, inView = false }) => (
  <span className="inline">
    {text.split(' ').map((word, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.28em]">
        <motion.span
          className="inline-block"
          initial={{ y: '110%' }}
          {...(inView
            ? { whileInView: { y: 0 }, viewport: { once: true, amount: 0.3 } }
            : { animate: { y: 0 } })}
          transition={{ duration, delay: baseDelay + i * stagger, ease: 'linear' }}
        >
          {word}
        </motion.span>
      </span>
    ))}
  </span>
);

const BorderTrace = ({ delay = 0 }) => (
  <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
    <motion.rect
      x="0.4" y="0.4" width="99.2" height="99.2"
      fill="none"
      stroke="rgba(244,244,245,0.22)"
      strokeWidth="0.45"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.2, delay, ease: 'linear' }}
    />
  </svg>
);

const imageFrom = (item) => (typeof item === 'string' ? item : item?.url || item?.imageUrl);

// ─── Hero ─────────────────────────────────────────────────────────────────────

// Grain overlay — subtle noise that adds depth to the dark image
const GrainOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none z-[3] opacity-[0.055] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '128px 128px',
    }}
  />
);

// One-time scan line that crosses the hero image on load
const HeroScanLine = () => (
  <motion.div
    className="absolute inset-x-0 z-[6] h-px pointer-events-none"
    style={{ backgroundColor: 'rgba(255,255,255,0.35)', top: 0 }}
    animate={{ top: ['0%', '100%'], opacity: [0, 0.7, 0.7, 0] }}
    transition={{ duration: 2.0, delay: 0.8, ease: 'linear', times: [0, 0.05, 0.92, 1] }}
  />
);

// Slow drifting ambient radial glow on the hero image
const AmbientGlow = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none z-[2]"
    animate={{
      background: [
        'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(104,101,250,0.18) 0%, transparent 70%)',
        'radial-gradient(ellipse 60% 50% at 70% 60%, rgba(255,205,0,0.08) 0%, transparent 70%)',
        'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(104,101,250,0.18) 0%, transparent 70%)',
      ],
    }}
    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
  />
);

// Gold baseline that traces under the hero H1 after it assembles
const HeroBaseline = () => (
  <motion.div
    className="h-px origin-left"
    style={{ backgroundColor: ARISE.gold, marginTop: '0.5rem' }}
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 0.8, delay: 1.5, ease: 'linear' }}
  />
);

const heroText = 'Designing a fearless identity for bold capital and visionary founders.';

const Hero = ({ project, navigate }) => {
  const heroImg = project?.fullStory?.heroImg || project?.bannerImage;
  return (
    <section className="relative min-h-screen overflow-hidden px-[3%] pb-16 pt-32 md:pb-20 md:pt-36" style={{ backgroundColor: ARISE.bg }}>

      {/* Background — blur+scale settle on load */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.05, filter: 'blur(14px)' }}
        animate={{ scale: 1.0, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: 'linear' }}
      >
        {heroImg && <img src={heroImg} alt="Arise Ventures identity system" className="h-full w-full object-cover" />}
        <GrainOverlay />
        <AmbientGlow />
        <div className="absolute inset-0 z-[4]" style={{ backgroundColor: 'rgba(1,8,54,0.82)' }} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 z-[4] bg-gradient-to-t from-[#010836] to-transparent" />
      </motion.div>

      <HeroScanLine />

      <div className="relative z-10 flex min-h-[calc(100vh-6rem)] flex-col">
        <button
          onClick={() => navigate('work')}
          className="group inline-flex w-fit items-center gap-3 text-xs uppercase tracking-[0.22em] font-primary text-white/55 hover:text-white"
          style={{ transition: 'color 200ms linear' }}
        >
          <ArrowLeft className="h-4 w-4" style={{ transition: 'transform 200ms linear' }} />
          Back To Selected Work
        </button>

        <div className="mt-28 max-w-7xl md:mt-36 lg:mt-40">
          <div className="mb-8 flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-primary text-white/42">
            <span style={{ color: ARISE.gold }}>Brand Boulevard</span>
            <span className="h-px w-12" style={{ backgroundColor: ARISE.rule }} />
            <span>{project.sector || 'Venture Capital'}</span>
          </div>

          {/* H1 — character-level reveal */}
          <h1 className="mb-2 text-6xl sm:text-7xl md:text-[7rem] lg:text-[8rem] xl:text-[9rem] 2xl:text-[9.75rem] font-light leading-[0.96] font-primary text-white">
            <CharReveal
              text={project.client || 'Arise Ventures'}
              delay={0.1}
              stagger={0.03}
              duration={0.9}
            />
          </h1>

          {/* Gold baseline draws after H1 assembles */}
          <HeroBaseline />

          <p className="mt-8 max-w-4xl text-2xl md:text-5xl font-light leading-[1.12] font-primary text-white/86">
            <WordByWord text={project.challenge || heroText} baseDelay={0.7} stagger={0.055} duration={0.55} />
          </p>
        </div>
      </div>
    </section>
  );
};

// ─── Challenge ────────────────────────────────────────────────────────────────

const StatItem = ({ label, val, index }) => (
  <motion.div
    className="border-l pl-8 first:border-l-0 first:pl-0"
    style={{ borderColor: ARISE.rule }}
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.6, delay: index * 0.12, ease: 'linear' }}
  >
    <p className="text-[10px] uppercase tracking-[0.28em] font-primary mb-3" style={{ color: ARISE.gold }}>{label}</p>
    <p className="text-xl md:text-2xl font-light font-primary text-white">{val}</p>
  </motion.div>
);

const defaultStats = [
  { label: 'Global Presence', val: 'IN, US, SG' },
  { label: 'Sectors', val: 'Consumer / Climate / Enterprise' },
  { label: 'Brand Ecosystem', val: 'Unified' },
];

const Challenge = ({ project }) => {
  const stats = project.fullStory?.stats?.length ? project.fullStory.stats : defaultStats;
  return (
    <section className="px-[3%] py-28 md:py-36" style={{ backgroundColor: ARISE.bg }}>
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[0.8fr_1.2fr] md:gap-24">
        <div>
          <SectionLabel index="02">Challenge</SectionLabel>
          <MotionLine className="mt-8" />
        </div>
        <div className="space-y-14">
          {/* Headline — character reveal on scroll */}
          <h2 className="text-3xl md:text-6xl font-light leading-[1.05] font-primary text-white">
            <CharReveal
              text="A venture identity rebuilt as a precise operating system."
              delay={0}
              stagger={0.018}
              duration={0.75}
              inView
            />
          </h2>

          {/* Stats strip */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 border-y py-10" style={{ borderColor: ARISE.rule }}>
            {stats.map((s, i) => (
              <StatItem key={s.label} label={s.label} val={s.val} index={i} />
            ))}
          </div>

          {/* Body copy */}
          <div className="grid gap-8 md:grid-cols-2">
            <p className="text-lg md:text-xl leading-relaxed text-white/62">
              <WordByWord
                text={project.fullStory?.challenge || project.overview || 'Arise Ventures needed an identity that matched the precision and ambition of the founders they back.'}
                baseDelay={0} stagger={0.04} duration={0.5} inView
              />
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-white/62">
              <WordByWord
                text={project.fullStory?.strategy || project.solution || 'Every system decision was built for scale — decks, social, events, and founder-facing touchpoints unified under one operating language.'}
                baseDelay={0.2} stagger={0.04} duration={0.5} inView
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Brand Archive ────────────────────────────────────────────────────────────

const BrandArchive = ({ images, logo }) => {
  const archive = [logo, ...images].filter(Boolean);
  const reel = archive.length > 0 ? [...archive, ...archive] : [];
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (reel.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden border-t"
      style={{ backgroundColor: ARISE.bgDeep, borderColor: ARISE.rule }}
    >
      <div className="px-[3%] pt-28 md:pt-36">
        <SectionLabel index="03">Brand Archive</SectionLabel>
      </div>

      <div className="arise-archive-mask py-20 md:py-28" onMouseLeave={() => setHoveredIndex(null)}>
        <div className={`arise-archive-track flex w-max items-center gap-20 md:gap-32${hoveredIndex !== null ? ' paused' : ''}`}>
          {reel.map((src, index) => {
            const archiveIndex = index % archive.length;
            const isHovered = hoveredIndex === index;
            const isDimmed = hoveredIndex !== null && !isHovered;
            return (
              <figure key={`${src}-${index}`} className="relative shrink-0" onMouseEnter={() => setHoveredIndex(index)}>
                <div
                  className="relative flex h-[38vh] min-h-[260px] max-h-[440px] w-[72vw] max-w-[760px] items-center justify-center border bg-[#010836]"
                  style={{ borderColor: isHovered ? 'rgba(255,205,0,0.35)' : ARISE.rule, transition: 'border-color 250ms linear' }}
                >
                  <img
                    src={src}
                    alt={`Arise Ventures archive ${archiveIndex + 1}`}
                    className="max-h-full max-w-full object-contain p-8 md:p-12"
                    style={{
                      opacity: isDimmed ? 0.35 : 1,
                      filter: isDimmed ? 'blur(2px)' : 'blur(0px)',
                      transition: 'opacity 220ms linear, filter 300ms linear',
                    }}
                    loading={index < archive.length ? 'eager' : 'lazy'}
                  />
                  {/* Hover label overlay */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute bottom-0 inset-x-0 px-8 py-5 flex items-center justify-between"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2, ease: 'linear' }}
                      >
                        <span className="text-[10px] uppercase tracking-[0.28em] font-primary" style={{ color: ARISE.gold }}>
                          Archive / {String(archiveIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.28em] font-primary text-white/50">Arise Ventures</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <figcaption
                  className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] font-primary"
                  style={{ color: isDimmed ? 'rgba(244,244,245,0.15)' : 'rgba(244,244,245,0.30)', transition: 'color 220ms linear' }}
                >
                  <span>Archive / {String(archiveIndex + 1).padStart(2, '0')}</span>
                  <span>Arise Ventures</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─── Identity Principles ──────────────────────────────────────────────────────

const identityWords = ['FEARLESS', 'MOVEMENT', 'SYSTEM', 'PRECISION'];

const principles = [
  {
    title: 'Clarity Before Expression',
    body: 'Every mark, rule, and layout choice was brought back to recognition, recall, and consistent use.',
  },
  {
    title: 'Systems Over One-Offs',
    body: 'The identity was built as a repeatable operating language for decks, social, events, and founder-facing touchpoints.',
  },
  {
    title: 'Momentum With Restraint',
    body: 'Motion, color, and graphic rhythm carry venture energy without letting the system become decorative.',
  },
];

// Symmetrical letter dispersion: outer letters drift more than inner ones
const DriftWord = ({ word, wordIndex, totalWords }) => {
  const letters = word.split('');
  const center = (letters.length - 1) / 2;
  const offsets = letters.map((_, i) => {
    const ratio = (i - center) / Math.max(center, 1);
    return ratio * 55; // outer letters drift ±55px
  });

  // Gold underline draws AFTER this word's letters have assembled
  const lastLetterDelay = wordIndex * 0.22 + (letters.length - 1) * 0.02 + 1.1;
  const isLastWord = wordIndex === totalWords - 1;

  return (
    <div className="relative leading-[0.86]">
      <span className="inline-flex">
        {letters.map((letter, i) => (
          <motion.span
            key={`${letter}-${i}`}
            className="inline-block font-primary font-light text-white"
            style={{ fontSize: 'clamp(3.2rem, 10vw, 12rem)' }}
            initial={{ x: offsets[i], opacity: 0.12 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.1, delay: wordIndex * 0.22 + i * 0.02, ease: 'linear' }}
          >
            {letter}
          </motion.span>
        ))}
      </span>

      {/* Gold underline traces under each word after it locks */}
      <motion.div
        className="absolute bottom-0 left-0 h-px origin-left"
        style={{ backgroundColor: ARISE.gold, width: '100%' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, delay: lastLetterDelay, ease: 'linear' }}
      />

      {/* On last word: a brief gold wash over all words — simulates identity "stamp" */}
      {isLastWord && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(255,205,0,0.06)', mixBlendMode: 'overlay' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 1, 0] }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: lastLetterDelay + 0.65, ease: 'linear' }}
        />
      )}
    </div>
  );
};

const IdentityPrinciples = () => (
  <section className="px-[3%] py-28 md:py-36" style={{ backgroundColor: ARISE.bg }}>
    <div className="mx-auto max-w-7xl">
      <div className="mb-16 flex items-end justify-between gap-10">
        <SectionLabel index="04">Identity Principles</SectionLabel>
        <MotionLine className="hidden flex-1 md:block" />
      </div>

      {/* Identity words — full-width, letters assemble symmetrically */}
      <div className="mb-24 md:mb-32 space-y-0">
        {identityWords.map((word, i) => (
          <DriftWord key={word} word={word} wordIndex={i} totalWords={identityWords.length} />
        ))}
      </div>

      {/* Principle rows */}
      <div className="divide-y" style={{ borderColor: ARISE.rule }}>
        {principles.map((item, index) => (
          <motion.article
            key={item.title}
            className="group grid gap-8 py-10 md:grid-cols-[0.25fr_0.75fr] md:py-14"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.9, delay: index * 0.08, ease: 'linear' }}
          >
            <p className="font-mono text-xs text-white/35">{String(index + 1).padStart(2, '0')}</p>
            <div className="grid gap-6 md:grid-cols-[0.7fr_1fr] md:gap-16">
              <div className="relative">
                <h3 className="text-3xl md:text-5xl font-light font-primary text-white">{item.title}</h3>
                {/* Underline sweeps on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 h-px w-full origin-left"
                  style={{ backgroundColor: ARISE.gold }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: 'linear' }}
                />
              </div>
              <p className="max-w-xl text-lg leading-relaxed text-white/62">{item.body}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

// ─── Typography System ────────────────────────────────────────────────────────

const typeRows = [
  { label: 'Display', specimen: 'ARISE VENTURES' },
  { label: 'System', specimen: 'BACKING THE BOLD' },
  { label: 'Detail', specimen: 'CONSUMER / CLIMATE / ENTERPRISE' },
];

const TrackingSpecimen = ({ text, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'end 45%'] });
  const tracking = useTransform(scrollYProgress, [0, 1], ['0.28em', '0em']);
  return (
    <motion.p ref={ref} className={className} style={{ letterSpacing: tracking }}>
      {text}
    </motion.p>
  );
};

const TypographySystem = () => (
  <section className="border-y px-[3%] py-28 md:py-36" style={{ backgroundColor: ARISE.bgDeep, borderColor: ARISE.rule }}>
    <div className="mx-auto max-w-7xl">
      <div className="mb-16 grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
        <SectionLabel index="05">Typography System</SectionLabel>
        <p className="max-w-3xl text-xl leading-relaxed text-white/58">
          Characters enter with measured distance, then tighten into the final system as the page moves.
        </p>
      </div>
      <div className="space-y-8">
        {typeRows.map((row) => (
          <div key={row.label} className="border-b pb-8" style={{ borderColor: ARISE.rule }}>
            <p className="mb-5 text-[10px] uppercase tracking-[0.28em] font-primary text-white/35">{row.label}</p>
            <TrackingSpecimen
              text={row.specimen}
              className="break-words text-5xl md:text-7xl lg:text-[8.5rem] font-light leading-[0.95] font-primary text-white"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Applications ─────────────────────────────────────────────────────────────

const ApplicationFigure = ({ src, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <figure
      className="relative w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden bg-[#010836]"
        style={{ scale: hovered ? 1.004 : 1, transition: 'scale 400ms linear' }}
      >
        <BorderTrace delay={0} />

        {/* Mask split — left and right panels open outward with rotation */}
        <motion.div className="absolute inset-0 z-10 flex pointer-events-none">
          <motion.div
            className="h-full w-1/2"
            style={{ backgroundColor: ARISE.bgDeep, transformOrigin: 'left center' }}
            initial={{ x: '0%', rotate: 0 }}
            whileInView={{ x: '-101%', rotate: -2 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.85, delay: 0.65, ease: 'linear' }}
          />
          <motion.div
            className="h-full w-1/2"
            style={{ backgroundColor: ARISE.bgDeep, transformOrigin: 'right center' }}
            initial={{ x: '0%', rotate: 0 }}
            whileInView={{ x: '101%', rotate: 2 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.85, delay: 0.65, ease: 'linear' }}
          />
        </motion.div>

        {/* Image sharpens after mask clears */}
        <motion.img
          src={src}
          alt={`Arise Ventures application ${index + 1}`}
          className="block h-auto w-full"
          initial={{ filter: 'blur(10px)', opacity: 0.5 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.05, delay: 1.0, ease: 'linear' }}
        />

        {/* Border brightens on hover */}
        <div
          className="absolute inset-0 pointer-events-none border"
          style={{
            borderColor: hovered ? 'rgba(244,244,245,0.5)' : 'rgba(244,244,245,0.22)',
            transition: 'border-color 200ms linear',
          }}
        />
      </div>

      <figcaption
        className="mt-5 flex items-center justify-between border-t pt-5 text-[10px] uppercase tracking-[0.28em] font-primary text-white/35"
        style={{ borderColor: ARISE.rule }}
      >
        <span>Application / {String(index + 1).padStart(2, '0')}</span>
        <span>Identity In Use</span>
      </figcaption>
    </figure>
  );
};

const Applications = ({ images }) => (
  <section className="border-y px-[3%] py-28 md:py-36" style={{ backgroundColor: ARISE.bgDeep, borderColor: ARISE.rule }}>
    <div className="mx-auto max-w-7xl">
      <div className="mb-16 grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
        <SectionLabel index="06">Applications</SectionLabel>
        <p className="max-w-3xl text-xl leading-relaxed text-white/58">
          The system is shown as a sequence of preserved-ratio artefacts. First the rule, then the image.
        </p>
      </div>
      <div className="space-y-20 md:space-y-28">
        {images.map((src, index) => (
          <ApplicationFigure key={`${src}-${index}`} src={src} index={index} />
        ))}
      </div>
    </div>
  </section>
);

// ─── Deliverables ─────────────────────────────────────────────────────────────

const deliverables = [
  'Brand Strategy',
  'Visual Identity System',
  'Logo And Logomark Design',
  'Investor Communication',
  'Social And Event Collaterals',
];

// Checkmark that draws itself then emits one pulse
const CheckmarkDraw = ({ delay }) => (
  <motion.svg
    width="14" height="14" viewBox="0 0 14 14" fill="none"
    className="shrink-0"
    initial={{ scale: 1 }}
    whileInView={{
      scale: [1, 1, 1.25, 1],
    }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.35, delay: delay + 0.42, ease: 'linear', times: [0, 0.6, 0.8, 1] }}
  >
    <motion.path
      d="M2 7L5.5 10.5L12 3.5"
      stroke={ARISE.gold}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.38, delay, ease: 'linear' }}
    />
  </motion.svg>
);

// Node circle that appears at each deliverable intersection on the line
const Node = ({ delay }) => (
  <motion.div
    className="absolute left-0 -translate-x-1/2 w-[5px] h-[5px] rounded-full border"
    style={{ borderColor: ARISE.gold, backgroundColor: ARISE.bg }}
    initial={{ scale: 0, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.2, delay, ease: 'linear' }}
  />
);

const DeliverableRow = ({ role, index, totalItems }) => {
  const [hovered, setHovered] = useState(false);
  const nodeDelay = 0.05 + index * (1.4 / totalItems);

  return (
    <div
      className="relative flex items-center justify-between gap-8 py-6"
      style={{ borderTop: `1px solid ${ARISE.rule}` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Node at each item's left edge */}
      <Node delay={nodeDelay} />

      <motion.div
        className="relative pl-4"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: index * 0.09, ease: 'linear' }}
      >
        <p className="text-2xl md:text-4xl font-light font-primary text-white">{role}</p>
        {/* Gold underline draws on hover */}
        <div
          className="absolute bottom-0 left-4 right-0 h-px origin-left"
          style={{
            backgroundColor: ARISE.gold,
            transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 280ms linear',
          }}
        />
      </motion.div>

      <div className="flex items-center gap-3 shrink-0">
        <CheckmarkDraw delay={index * 0.09 + 0.55} />
        <span
          className="font-mono text-xs"
          style={{
            color: hovered ? 'rgba(244,244,245,0.80)' : 'rgba(244,244,245,0.32)',
            transition: 'color 200ms linear',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

const Deliverables = ({ roles }) => (
  <section className="px-[3%] py-28 md:py-36" style={{ backgroundColor: ARISE.bg }}>
    <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[0.7fr_1.3fr] md:gap-24">
      <div>
        <SectionLabel index="07">Deliverables</SectionLabel>
        <MotionLine className="mt-8" />
      </div>

      <div className="relative pl-6">
        {/* Vertical connector line */}
        <motion.div
          className="absolute left-0 top-0 w-px origin-top"
          style={{ backgroundColor: ARISE.rule, height: '100%' }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.4, ease: 'linear' }}
        />
        {/* Traveling dot that moves down the line */}
        <motion.div
          className="absolute left-0 -translate-x-1/2 w-[3px] h-[3px] rounded-full"
          style={{ backgroundColor: ARISE.gold, top: 0 }}
          initial={{ top: '0%', opacity: 0 }}
          whileInView={{ top: '100%', opacity: [0, 1, 1, 0] }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.4, ease: 'linear', times: [0, 0.05, 0.92, 1] }}
        />

        {roles.map((role, index) => (
          <DeliverableRow key={role} role={role} index={index} totalItems={roles.length} />
        ))}
      </div>
    </div>
  </section>
);

// ─── Outcome ──────────────────────────────────────────────────────────────────

const OutcomeResult = ({ result, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.p
      className="border-t pt-6 text-lg leading-relaxed text-white/62 cursor-default"
      style={{
        borderColor: hovered ? ARISE.gold : ARISE.rule,
        transition: 'border-color 240ms linear',
      }}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: 'linear' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {result}
    </motion.p>
  );
};

const defaultResults = [
  'Unified identity across India, US, and Singapore presence',
  'Sharper founder-facing brand narrative for Consumer, Climate, and Enterprise sectors',
  'Scalable brand ecosystem across decks, social templates, banners, and digital touchpoints',
];

const Outcome = ({ results }) => {
  const items = results?.length ? results : defaultResults;
  return (
    <section className="px-[3%] py-28 md:py-40" style={{ backgroundColor: ARISE.bgDeep }}>
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="08">Outcome</SectionLabel>
        <MotionLine className="my-12" />
        <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-20">
          <TrackingSpecimen
            text="A unified brand system for bold capital."
            className="text-5xl md:text-7xl lg:text-[8rem] font-light leading-[0.95] font-primary text-white"
          />
          <div className="space-y-8 self-end">
            {items.map((result, index) => (
              <OutcomeResult key={result} result={result} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

const AriseVenturesExperience = ({ navigate, project }) => {
  const images = useMemo(
    () => (project.fullStory?.images || []).map(imageFrom).filter(Boolean),
    [project.fullStory?.images]
  );
  const logo = project.logo || '/clients/logos/arise_ventures/Asset 3@4x.png';
  const roles = project.roles?.length ? project.roles : deliverables;
  const results = project.results?.length ? project.results : [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div
      className="w-full overflow-hidden text-white font-secondary selection:bg-[#FFCD00] selection:text-[#010836]"
      style={{ backgroundColor: ARISE.bg }}
    >
      <style>{`
        @keyframes ariseArchiveMarquee {
          from { transform: translate3d(0,0,0); }
          to   { transform: translate3d(-50%,0,0); }
        }
        .arise-archive-track {
          animation: ariseArchiveMarquee 70s linear infinite;
        }
        .arise-archive-track.paused,
        .arise-archive-track:hover {
          animation-play-state: paused;
        }
        .arise-archive-mask {
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
        }
      `}</style>

      <ScrollRail />

      <Hero project={project} navigate={navigate} />
      <Challenge project={project} />
      <BrandArchive images={images} logo={logo} />
      <IdentityPrinciples />
      <TypographySystem />
      <Applications images={images} />
      <Deliverables roles={roles} />
      <Outcome results={results} />
    </div>
  );
};

export default AriseVenturesExperience;
