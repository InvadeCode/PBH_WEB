import React, { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CaseStudyMedia, { getMediaUrl, normalizeMediaItems } from './CaseStudyMedia';

const CYAN = '#00E5CC';
const AMBER = '#FFCD00';
const LAB_DARK = '#010836';
const DIAGRAM_WHITE = '#F4F4F5';
const ARISE_PRIMARY = '#6865FA';
const ARISE_SECONDARY = '#D4CEFC';
const ARISE_PANEL = '#0C185C';

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

// --- RETICLE CURSOR ---
const ReticleCursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <motion.div style={{ x, y, translateX: '-50%', translateY: '-50%' }} className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] mix-blend-difference hidden md:block">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={CYAN} strokeWidth="1" opacity="0.8"/>
        <line x1="12" y1="0" x2="12" y2="5" stroke={CYAN} strokeWidth="1" opacity="0.6"/>
        <line x1="12" y1="19" x2="12" y2="24" stroke={CYAN} strokeWidth="1" opacity="0.6"/>
        <line x1="0" y1="12" x2="5" y2="12" stroke={CYAN} strokeWidth="1" opacity="0.6"/>
        <line x1="19" y1="12" x2="24" y2="12" stroke={CYAN} strokeWidth="1" opacity="0.6"/>
      </svg>
    </motion.div>
  );
};

// --- SECTION 01: THE IMAGE TEMPLATE HERO ---
const ImageTemplateHero = ({ project, navigate }) => {
  const firstGalleryMedia = project.fullStory?.media?.[0] || project.fullStory?.images?.[0];
  const heroImage = project.bannerVideo || project.fullStory?.heroVideo || project.bannerImage || project.fullStory?.heroImg || project.imageUrl || getMediaUrl(firstGalleryMedia);
  const firstGalleryDimensions = firstGalleryMedia?.metadata?.dimensions || firstGalleryMedia?.asset?.metadata?.dimensions;
  const heroAspectRatio =
    getDimensionsAspectRatio(project.bannerImageDimensions) ||
    getDimensionsAspectRatio(project.fullStory?.heroImgDimensions) ||
    getDimensionsAspectRatio(firstGalleryDimensions) ||
    getUrlAspectRatio(heroImage) ||
    16 / 9;
  const tags = (project.tags?.length ? project.tags : project.roles || []).filter(Boolean);

  return (
    <>
      <div className="relative z-50 px-6 pt-28 pb-6 md:px-12 md:pt-32 md:pb-8 flex flex-wrap items-center gap-3 pointer-events-none" style={{ background: LAB_DARK }}>
        <button onClick={() => navigate('home')} className="pointer-events-auto flex items-center gap-2 text-sm backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Home
        </button>
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2 text-sm backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> All Case Studies
        </button>
      </div>

      <section className="relative w-full flex flex-col items-center justify-start z-10 pb-40 md:pb-48 pt-10 px-4 md:px-8 overflow-hidden" style={{ background: LAB_DARK }}>
        <div
          className="relative w-full max-w-[95vw] md:max-w-7xl mx-auto rounded-[30px] md:rounded-[50px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
          style={{ aspectRatio: heroAspectRatio }}
        >
          {heroImage && (
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-[#0c185c]/70">
              <CaseStudyMedia
                src={heroImage}
                alt={project.client ? `${project.client} hero` : ''}
                className="w-full h-full object-contain"
                priority
                sizes="(min-width: 1280px) 1280px, 95vw"
                style={{ aspectRatio: heroAspectRatio }}
              />
            </div>
          )}
          {!heroImage && <div className="w-full h-full" style={{ background: ARISE_PANEL }} />}
        </div>

        {(project.client || tags.length > 0) && (
          <div className="relative z-20 flex flex-col items-center text-center px-4 mt-12 md:mt-16">
            {tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
                className="mb-6 flex flex-wrap justify-center gap-4"
              >
                {tags.map((tag, i) => (
                  <span key={`${tag}-${i}`} className="px-6 py-2 rounded-full border border-white/10 text-xs md:text-sm tracking-[0.2em] uppercase font-bold text-white/80 bg-white/5 backdrop-blur-md shadow-lg font-secondary">
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
            {project.client && (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                className="font-primary text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-transparent bg-clip-text font-medium tracking-tight drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                style={{
                  backgroundImage: `linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, ${ARISE_SECONDARY} 45%, ${ARISE_PRIMARY} 50%, ${ARISE_SECONDARY} 55%, #FFFFFF 70%, #FFFFFF 100%)`,
                  backgroundSize: '300% auto',
                }}
              >
                {project.client}
              </motion.h1>
            )}
          </div>
        )}
      </section>
    </>
  );
};

// --- SECTION 02: THE HYPOTHESIS ---
const Hypothesis = ({ text }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-30%", once: true });
  if (!text) return null;
  const words = text.split(' ');

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center py-32 px-[5%] relative" style={{ background: LAB_DARK }}>
      {/* Measurement scale */}
      <div className="absolute left-6 top-[10%] bottom-[10%] w-[1px] hidden md:block" style={{ background: `${CYAN}20` }}>
        {[...Array(11)].map((_, i) => (
          <div key={i} className="absolute w-3 h-[1px]" style={{ top: `${i * 10}%`, left: '-6px', background: `${CYAN}40` }}/>
        ))}
      </div>

      <div className="max-w-4xl text-center">
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.5 } : {}} transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.3em] mb-12 font-primary" style={{ color: CYAN }}>
          Research Question
        </motion.p>
        <p className="text-2xl md:text-3xl font-primary leading-relaxed">
          {words.map((word, i) => (
            <motion.span key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              className="inline-block mr-[0.35em]"
              style={{ color: DIAGRAM_WHITE }}
            >
              {word}
            </motion.span>
          ))}
        </p>
        <motion.div initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: words.length * 0.04 + 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="h-[1px] mt-12 origin-left" style={{ background: `linear-gradient(90deg, ${CYAN}, transparent)` }}/>
      </div>
    </section>
  );
};

// --- SECTION 03: THE METHODOLOGY DIAGRAM ---
const NODES = [
  { label: "Interactive Content Boards", x: 15, y: 20 },
  { label: "Puzzle-Based Learning", x: 70, y: 15 },
  { label: "Graphic Illustrations", x: 10, y: 65 },
  { label: "Riddles & Engagement", x: 72, y: 60 },
  { label: "Hands-On Science", x: 20, y: 85 },
  { label: "Wonder at Every Interaction", x: 65, y: 88 },
];
const EDGES = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[0,3],[2,3]];

const MethodologyDiagram = ({ project }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%", once: true });
  if (!project.solution) return null;

  return (
    <section ref={ref} className="min-h-screen py-32 px-[5%] relative flex flex-col items-center justify-center" style={{ background: LAB_DARK }}>
      <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.5 } : {}} transition={{ duration: 0.6 }}
        className="text-xs uppercase tracking-[0.3em] mb-16 font-primary" style={{ color: CYAN }}>
        Methodology Map
      </motion.p>

      <div className="relative w-full max-w-5xl" style={{ height: '70vh', minHeight: 500 }}>
        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {EDGES.map(([a, b], i) => {
            const x1 = NODES[a].x + '%'; const y1 = NODES[a].y + '%';
            const x2 = NODES[b].x + '%'; const y2 = NODES[b].y + '%';
            const mx = ((NODES[a].x + NODES[b].x) / 2) + '%';
            const my = ((NODES[a].y + NODES[b].y) / 2 - 8) + '%';
            return (
              <motion.path key={i}
                d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                fill="none" stroke={CYAN} strokeWidth="1" opacity="0.3"
                initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.15, duration: 1.2, ease: "easeOut" }}
              />
            );
          })}
        </svg>

        {/* Hub Node */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-4 rounded-xl border-2 text-center font-primary text-sm uppercase tracking-wider z-10"
          style={{ borderColor: AMBER, background: `${LAB_DARK}ee`, color: AMBER, boxShadow: `0 0 30px ${AMBER}30` }}>
          {project.client}
        </motion.div>

        {/* Satellite Nodes */}
        {NODES.map((node, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute px-4 py-3 rounded-lg border text-xs font-primary backdrop-blur-sm z-10"
            style={{ left: node.x + '%', top: node.y + '%', transform: 'translate(-50%, -50%)',
              borderColor: `${CYAN}50`, background: `${LAB_DARK}cc`, color: DIAGRAM_WHITE }}>
            {node.label}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- SECTION 04: THE OBSERVATION DECK ---
const ObservationCard = ({ media, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-15%", once: true });
  const isLeft = index % 2 === 0;
  const num = String(index + 1).padStart(2, '0');

  return (
    <div ref={ref} className={`w-full ${index % 3 === 0 ? 'md:row-span-2' : ''}`}>
      <motion.div
        initial={{ opacity: 0, rotate: isLeft ? -2 : 2 }}
        animate={isInView ? { opacity: 1, rotate: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full relative"
      >
        {/* Border draws itself via a box-shadow trick, image fades in after */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.01 }}
            className="absolute inset-0 rounded-lg pointer-events-none z-20"
          >
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <motion.rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="8"
                fill="none" stroke={CYAN} strokeWidth="1"
                initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ width: '100%', height: '100%' }}
              />
            </svg>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="w-full bg-[#0A1A22] rounded-lg overflow-hidden relative p-1 z-10"
          >
            <div className="w-full h-full relative overflow-hidden rounded-md bg-[#05111A] flex items-center justify-center min-h-[300px]">
              <CaseStudyMedia item={media} alt={`Observation ${num}`} className="w-full h-auto max-h-[80vh] object-contain" />
            </div>
          </motion.div>
        </div>

        {/* Measurement line */}
        <motion.div initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
          className="h-[1px] mt-4 origin-left" style={{ background: `${CYAN}30` }}/>
      </motion.div>
    </div>
  );
};

const ObservationDeck = ({ images }) => {
  if (!images || images.length === 0) return null;
  return (
    <section className="py-32 px-[5%] relative" style={{ background: LAB_DARK }}>
      <div className="max-w-7xl mx-auto relative">
        {/* Dotted research thread */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden md:block"
          style={{ borderLeft: `1px dashed ${CYAN}25` }}/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
          {images.map((media, i) => <ObservationCard key={media.key} media={media} index={i} />)}
        </div>
      </div>
    </section>
  );
};

// --- SECTION 05: THE FINDINGS ---
const Findings = ({ results }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%", once: true });
  if (!results || results.length === 0) return null;

  return (
    <section ref={ref} className="min-h-[60vh] flex items-center justify-center py-32 px-[5%]" style={{ background: LAB_DARK }}>
      {/* Concentric pulse bg */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full border" style={{ borderColor: `${CYAN}08`, width: 200 + i * 200, height: 200 + i * 200 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 4, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }}/>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-3xl w-full p-12 md:p-16 rounded-2xl z-10"
        style={{ border: `2px solid ${CYAN}40`, boxShadow: `0 0 0 4px ${LAB_DARK}, 0 0 0 6px ${AMBER}40`, background: `${LAB_DARK}f0` }}>

        <p className="text-xs uppercase tracking-[0.3em] mb-10 font-primary" style={{ color: AMBER }}>Findings</p>
        {results.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.8 }}
            className="flex items-start gap-4 mb-4">
            <motion.span initial={{ scale: 0 }} animate={isInView ? { scale: [0, 1.3, 1] } : {}}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
              style={{ color: AMBER }} className="text-sm mt-1">◆</motion.span>
            <p className="text-[17px] md:text-[19px] font-secondary leading-relaxed" style={{ color: `${DIAGRAM_WHITE}cc` }}>{r}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

// --- SECTION 06: THE APPARATUS ---
const Apparatus = ({ roles, deliverables }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%", once: true });
  if (!roles || roles.length === 0) return null;

  return (
    <section ref={ref} className="py-32 px-[5%]" style={{ background: LAB_DARK }}>
      <div className="max-w-3xl mx-auto space-y-8">
        {roles.map((role, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: i * 0.3, duration: 0.5 }}
            className="flex items-center gap-4">
            <p className="text-xs font-primary uppercase tracking-widest w-48 shrink-0" style={{ color: `${DIAGRAM_WHITE}60` }}>
              Instrument {String(i + 1).padStart(2, '0')}:
            </p>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: `${CYAN}15` }}>
              <motion.div initial={{ width: 0 }} animate={isInView ? { width: '100%' } : {}}
                transition={{ delay: 0.3 + i * 0.3, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full relative"
                style={{ background: `linear-gradient(90deg, ${CYAN}80, ${CYAN})` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 rounded-sm" style={{ background: '#fff', boxShadow: `0 0 10px ${CYAN}` }}/>
              </motion.div>
            </div>
            <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.3 }}
              className="text-sm font-primary uppercase tracking-wider w-40 text-right" style={{ color: CYAN }}>
              {role}
            </motion.p>
          </motion.div>
        ))}
        {deliverables && (
          <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.4 } : {}}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-xs font-primary tracking-widest uppercase pt-8 border-t" style={{ color: DIAGRAM_WHITE, borderColor: `${CYAN}15` }}>
            Output Classification: {deliverables}
          </motion.p>
        )}
      </div>
    </section>
  );
};

// --- SECTION 07: THE LAB NOTES ---
const LabNotes = ({ text }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%", once: true });
  if (!text) return null;

  return (
    <section ref={ref} className="py-32 px-[5%] relative" style={{ background: LAB_DARK }}>
      {/* Graph paper grid */}
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }}/>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto relative z-10">
        <p className="text-xs uppercase tracking-[0.3em] mb-8 font-primary flex items-center gap-2" style={{ color: CYAN }}>
          <span className="inline-block w-4 h-4 border rounded-sm text-xs flex items-center justify-center" style={{ borderColor: CYAN }}>i</span>
          Lab Notes
        </p>
        <p className="text-[17px] md:text-[19px] font-secondary leading-relaxed" style={{ color: `${DIAGRAM_WHITE}bb` }}>{text}</p>
        <motion.div initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-[2px] mt-8 origin-left" style={{ background: `linear-gradient(90deg, ${CYAN}60, transparent)` }}/>
      </motion.div>
    </section>
  );
};

// --- SECTION 08: THE CLASSIFICATION ---
const Classification = ({ project }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%", once: true });

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center py-32 px-[5%]" style={{ background: LAB_DARK }}>
      <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.5 }}
        className="text-center relative">
        <motion.div initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
          className="border rounded-2xl px-12 py-16 md:px-20 md:py-20 relative"
          style={{ borderColor: `${CYAN}30`, background: `${LAB_DARK}f0` }}>

          {/* Scanline */}
          <motion.div initial={{ top: 0, opacity: 0 }} animate={isInView ? { top: '100%', opacity: [0, 0.4, 0] } : {}}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="absolute left-0 right-0 h-[2px] pointer-events-none" style={{ background: CYAN }}/>

          <p className="text-xs font-primary uppercase tracking-[0.3em] mb-8" style={{ color: `${DIAGRAM_WHITE}50` }}>Classified Under</p>
          <p className="text-2xl md:text-3xl font-primary uppercase tracking-widest mb-10 flex items-center justify-center gap-3" style={{ color: AMBER }}>
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>◆</motion.span>
            SciArt Saga
          </p>

          <div className="space-y-3 text-sm font-primary uppercase tracking-widest" style={{ color: `${DIAGRAM_WHITE}60` }}>
            <p>Subject: <span style={{ color: DIAGRAM_WHITE }}>{project.client}</span></p>
            <p>Sector: <span style={{ color: DIAGRAM_WHITE }}>{project.sector}</span></p>
            <p>Status: <span style={{ color: CYAN }}>Experience Delivered</span></p>
          </div>

          <div className="mt-10 pt-8 border-t text-xs font-primary tracking-widest uppercase" style={{ borderColor: `${CYAN}15`, color: `${DIAGRAM_WHITE}30` }}>
            PurpleBlue House · 2026
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// --- MAIN EXPERIENCE ---
const ParamInnovationExperience = ({ navigate, project }) => {
  const images = normalizeMediaItems(project.fullStory?.media || project.fullStory?.images, project.client || 'Case study media');

  return (
    <div className="min-h-screen w-full text-white relative" style={{ background: LAB_DARK, cursor: 'none' }}>
      <ReticleCursor />
      <ImageTemplateHero project={project} navigate={navigate} />
      <Hypothesis text={project.challenge} />
      <MethodologyDiagram project={project} />
      <ObservationDeck images={images} />
      <Findings results={project.results} />
      <Apparatus roles={project.roles} deliverables={project.deliverablesHeading} />
      <LabNotes text={project.fullStory?.execution || project.solutionHeading} />
      <Classification project={project} />
    </div>
  );
};

export default ParamInnovationExperience;
