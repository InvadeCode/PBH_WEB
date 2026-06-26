import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
  AnimatePresence
} from 'framer-motion';
import { X } from 'lucide-react';
import CaseStudyMedia from './CaseStudyMedia';

/**
 * MediaRibbon3D
 * A premium 3D "floating ribbon" — media panels orbit a central axis in true 3D
 * (perspective + preserve-3d + rotateY/translateZ). 
 */

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Exact aspect ratio from Sanity asset metadata (falls back gracefully).
const getMediaAspect = (m) => {
  const dim = m?.source?.metadata?.dimensions || m?.metadata?.dimensions;
  let ar = dim?.aspectRatio;
  if (!(typeof ar === 'number' && ar > 0) && dim?.width && dim?.height) ar = dim.width / dim.height;
  if (!(typeof ar === 'number' && ar > 0)) ar = 4 / 3;
  return clamp(ar, 0.45, 2.4);
};

// ── A single media panel: places itself on the ring, derives depth looks from `rotation`.
const Panel = ({ media, index, step, radius, baseArea, rotation, isActive, onClick }) => {
  const aspect = getMediaAspect(media);
  // Constant Area Scaling: ensures portraits and landscapes have equal visual weight
  const height = Math.sqrt(baseArea / aspect);
  const width = height * aspect;
  
  const baseAngle = index * step;

  const front = useTransform(rotation, (r) => Math.cos(((baseAngle + r) * Math.PI) / 180));

  const scale = useTransform(front, [-1, 0.5, 1], [0.8, 1.0, 1.25]);
  const opacity = useTransform(front, [-1, -0.35, 0.15, 1], [0.05, 0.35, 0.88, 1]);
  const blurPx = useTransform(front, (f) => ((1 - (f + 1) / 2) * 6).toFixed(2));
  const brightness = useTransform(front, [-1, 0.4, 1], [0.5, 0.95, 1.15]);
  const saturate = useTransform(front, [-1, 1], [0.7, 1.15]);
  const filter = useMotionTemplate`blur(${blurPx}px) brightness(${brightness}) saturate(${saturate})`;
  const glow = useTransform(front, [0.55, 1], [0, 1]);
  const glowBlur = useTransform(glow, [0, 1], [0, 60]);
  const glowAlpha = useTransform(glow, [0, 1], [0, 0.6]);
  const boxShadow = useMotionTemplate`0 34px 80px -26px rgba(0,0,0,0.8), 0 0 ${glowBlur}px rgba(150,150,255,${glowAlpha})`;

  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    else v.pause();
  }, [isActive]);

  const useVideoTag = media?.isVideo;

  return (
    <div
      className="absolute top-1/2 left-1/2 cursor-pointer"
      onClick={() => onClick(media)}
      style={{
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
        transformStyle: 'preserve-3d',
        transform: `rotateY(${baseAngle}deg) translateZ(${radius}px)`,
      }}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-[16px] ring-1 ring-white/10 bg-[#0b1340] will-change-transform"
        style={{ scale, opacity, filter, boxShadow }}
      >
        {useVideoTag ? (
          <video
            ref={videoRef}
            src={media.url}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <CaseStudyMedia item={media} alt={media?.alt} className="absolute inset-0 h-full w-full object-cover" sizes="(min-width: 768px) 40vw, 80vw" />
        )}
        {/* Soft top sheen + bottom depth — flat panel volume, no hard edge */}
        <div className="pointer-events-none absolute inset-0 rounded-[16px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, transparent 22%, transparent 70%, rgba(0,0,0,0.35) 100%)' }} />
        <div className="pointer-events-none absolute inset-0 rounded-[16px]" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 0 1px rgba(255,255,255,0.05)' }} />
        <motion.div className="pointer-events-none absolute -inset-px rounded-[16px]" style={{ opacity: glow, boxShadow: 'inset 0 0 0 1.5px rgba(212,206,252,0.55)' }} />
      </motion.div>
    </div>
  );
};

// ── Lightbox Portal Component
const LightboxPortal = ({ media, onClose }) => {
  if (!media) return null;
  const useVideoTag = media?.isVideo;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4 md:p-12"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 z-[100000] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </button>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative max-w-full max-h-full overflow-hidden rounded-[24px] shadow-2xl ring-1 ring-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {useVideoTag ? (
          <video
            src={media.url}
            autoPlay
            loop
            controls
            playsInline
            className="w-auto h-auto max-w-full max-h-[85vh] object-contain"
          />
        ) : (
          <CaseStudyMedia item={media} alt={media?.alt} className="w-auto h-auto max-w-full max-h-[85vh] object-contain" />
        )}
      </motion.div>
    </motion.div>,
    document.body
  );
};

const MediaRibbon3D = ({ media }) => {
  const items = Array.isArray(media) ? media.filter((m) => m && m.url) : [];
  const N = items.length;

  const reduce = useReducedMotion();
  const sceneRef = useRef(null);
  const [dims, setDims] = useState({ baseArea: 90000, radius: 540, maxPanelHeight: 300 });
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const measure = () => {
      const w = sceneRef.current?.clientWidth || window.innerWidth;
      const baseH = clamp(w * 0.15, 180, 360);
      const baseArea = baseH * baseH;
      
      // Dynamic radius based on N so fewer items don't have massive gaps
      const calculatedRadius = (items.length * 480) / (2 * Math.PI);
      const radius = clamp(calculatedRadius, 280, clamp(w * 0.5, 500, 1000));
      
      let maxH = baseH;
      if (items.length > 0) {
        maxH = Math.max(...items.map(m => {
          const aspect = getMediaAspect(m);
          return Math.sqrt(baseArea / aspect);
        }));
      }

      setDims({ baseArea, radius, maxPanelHeight: maxH });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sceneRef.current) ro.observe(sceneRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [items]);

  const rotation = useMotionValue(0);
  // Increased base velocity from 4 to 10 for faster, more dynamic movement
  const BASE_VEL = reduce ? 0 : 10;
  const velocity = useRef(BASE_VEL);
  const targetVel = useRef(BASE_VEL);

  const tiltX = useSpring(-6, { stiffness: 60, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 60, damping: 18 });
  const [activeIndex, setActiveIndex] = useState(0);

  const step = N > 0 ? 360 / N : 0;

  useAnimationFrame((_, deltaMs) => {
    if (N === 0) return;
    const dt = Math.min(deltaMs, 50) / 1000;
    // Smoother acceleration interpolation
    velocity.current += (targetVel.current - velocity.current) * Math.min(1, dt * 4);
    rotation.set(rotation.get() + velocity.current * dt);
    const r = rotation.get();
    const idx = ((Math.round(-r / step) % N) + N) % N;
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  const handleMove = (e) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(-6 - py * 10);
    tiltY.set(px * 8);
    // Move faster when hovering to the sides, but maintain solid minimum speed
    targetVel.current = BASE_VEL + px * 15;
  };
  
  const handleLeave = () => { 
    tiltX.set(-6); 
    tiltY.set(0); 
    targetVel.current = BASE_VEL; 
  };

  const ringTransform = useMotionTemplate`translate(-50%, -50%) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  const innerRotate = useTransform(rotation, (r) => `rotateY(${r}deg)`);

  if (N === 0) return null;

  return (
    <>
      <div
        ref={sceneRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative w-full overflow-hidden rounded-[28px]"
        style={{ height: Math.max(dims.maxPanelHeight + 240, 500) }}
      >
        {/* Ambient depth */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]" style={{ background: 'radial-gradient(circle, rgba(104,101,250,0.18), transparent 62%)' }} />
          <div className="absolute inset-x-0 top-0 h-24" style={{ background: 'linear-gradient(to bottom, #010836, transparent)' }} />
          <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(to top, #010836, transparent)' }} />
        </div>

        {/* 3D scene */}
        <div className="absolute inset-0" style={{ perspective: '1700px', perspectiveOrigin: '50% 48%' }}>
          <motion.div className="absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d', transform: ringTransform, willChange: 'transform' }}>
            <motion.div className="absolute" style={{ transformStyle: 'preserve-3d', transform: innerRotate }}>
              {items.map((m, i) => (
                <Panel
                  key={m.key || i}
                  media={m}
                  index={i}
                  step={step}
                  radius={dims.radius}
                  baseArea={dims.baseArea}
                  rotation={rotation}
                  isActive={i === activeIndex}
                  onClick={(clickedMedia) => setSelectedMedia(clickedMedia)}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedMedia && (
          <LightboxPortal media={selectedMedia} onClose={() => setSelectedMedia(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default MediaRibbon3D;
