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
const Panel = ({ media, index, step, radius, height, rotation, isActive, onClickCapture }) => {
  const aspect = getMediaAspect(media);
  const width = height * aspect;
  
  const baseAngle = index * step;

  const front = useTransform(rotation, (r) => Math.cos(((baseAngle + r) * Math.PI) / 180));

  const scale = useTransform(front, [-1, 0.5, 1], [0.8, 1.0, 1.12]);
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
      className="absolute top-1/2 left-1/2 cursor-pointer select-none"
      onClickCapture={onClickCapture}
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
            draggable="false"
            className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
          />
        ) : (
          <CaseStudyMedia item={media} alt={media?.alt} className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none" sizes="(min-width: 768px) 40vw, 80vw" draggable="false" />
        )}
        {/* Soft top sheen + bottom depth — flat panel volume, no hard edge */}
        <div className="pointer-events-none absolute inset-0 rounded-[16px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, transparent 22%, transparent 70%, rgba(0,0,0,0.35) 100%)' }} />
        <div className="pointer-events-none absolute inset-0 rounded-[16px]" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 0 1px rgba(255,255,255,0.05)' }} />
        <motion.div className="pointer-events-none absolute -inset-px rounded-[16px]" style={{ opacity: glow, boxShadow: 'inset 0 0 0 1.5px rgba(212,206,252,0.55)' }} />
      </motion.div>
    </div>
  );
};

// ── Lightbox Portal Component — Premium floating popup card
const LightboxPortal = ({ media, onClose }) => {
  if (!media) return null;
  const useVideoTag = media?.isVideo;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-6 md:p-16"
      style={{ backgroundColor: 'rgba(5, 11, 36, 0.55)' }}
      onClick={onClose}
    >
      {/* Popup card */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="relative max-w-[90vw] max-h-[88vh] overflow-hidden rounded-[20px]"
        style={{
          background: 'linear-gradient(145deg, rgba(20,26,60,0.85), rgba(10,14,40,0.92))',
          boxShadow: '0 40px 120px -20px rgba(0,0,0,0.7), 0 0 80px rgba(100,100,255,0.12), inset 0 1px 0 rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button inside the card */}
        <button 
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white/80 hover:text-white transition-all duration-200"
          onClick={onClose}
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Inner media with padding for card feel */}
        <div className="p-3">
          {useVideoTag ? (
            <video
              src={media.url}
              autoPlay
              loop
              controls
              playsInline
              className="w-auto h-auto max-w-full max-h-[82vh] object-contain rounded-[14px]"
            />
          ) : (
            <CaseStudyMedia item={media} alt={media?.alt} className="w-auto h-auto max-w-full max-h-[82vh] object-contain rounded-[14px]" />
          )}
        </div>
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
  const [dims, setDims] = useState({ height: 230, radius: 540 });
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Drag state
  const isDragging = useRef(false);
  const dragDistance = useRef(0);
  const lastX = useRef(0);

  useEffect(() => {
    const measure = () => {
      const w = sceneRef.current?.clientWidth || window.innerWidth;
      const height = clamp(w * 0.14, 150, 320);
      
      // Dynamic radius: tighter ring for fewer items, full arc for many
      const maxRadius = clamp(w * 0.42, 320, 780);
      const minRadius = clamp(w * 0.1, 100, 200);
      // Smoothly interpolate: 1-3 items → min, 8+ items → max
      const t = clamp((items.length - 1) / 7, 0, 1);
      const radius = minRadius + (maxRadius - minRadius) * t;
      
      setDims({ height, radius });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sceneRef.current) ro.observe(sceneRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [items]);

  const rotation = useMotionValue(0);
  // Fast, dynamic carousel speed
  const BASE_VEL = reduce ? 0 : 20;
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

  const handlePointerDown = (e) => {
    isDragging.current = true;
    dragDistance.current = 0;
    lastX.current = e.clientX;
    targetVel.current = 0; // Pause auto-rotation temporarily
    e.target.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    // Always compute tilt for parallax effect
    const rect = sceneRef.current?.getBoundingClientRect();
    if (rect) {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      tiltX.set(-6 - py * 10);
      tiltY.set(px * 8);
      
      if (!isDragging.current) {
        // Adjust speed slightly based on mouse position horizontally
        targetVel.current = BASE_VEL + px * 15;
      }
    }

    if (isDragging.current) {
      const deltaX = e.clientX - lastX.current;
      dragDistance.current += Math.abs(deltaX);
      lastX.current = e.clientX;

      // Physically drag the rotation. Subtracting deltaX makes it feel like you are grabbing and pulling it.
      rotation.set(rotation.get() - deltaX * 0.4);
      
      // Inject momentum into the velocity so when released, it keeps spinning
      velocity.current = -deltaX * 25;
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging.current) {
      isDragging.current = false;
      targetVel.current = BASE_VEL; // Resume base auto-rotation
      e.target.releasePointerCapture?.(e.pointerId);
    }
  };
  
  const handlePointerLeave = () => { 
    if (isDragging.current) return; // Keep dragging if mouse leaves momentarily
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onDragStart={(e) => e.preventDefault()}
        className="relative w-full overflow-hidden rounded-[28px] touch-none cursor-grab active:cursor-grabbing"
        style={{ height: 'clamp(440px, 64vh, 720px)' }}
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
                  height={dims.height}
                  rotation={rotation}
                  isActive={i === activeIndex}
                  onClickCapture={(e) => {
                    // Prevent opening lightbox if this was a drag gesture
                    if (dragDistance.current > 10) {
                      e.stopPropagation();
                    } else {
                      setSelectedMedia(m);
                    }
                  }}
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
