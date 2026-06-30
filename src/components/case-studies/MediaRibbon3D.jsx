import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import CaseStudyMedia from './CaseStudyMedia';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const getMediaAspect = (m) => {
  const dim = m?.source?.metadata?.dimensions || m?.metadata?.dimensions;
  let ar = dim?.aspectRatio;
  if (!(typeof ar === 'number' && ar > 0) && dim?.width && dim?.height) ar = dim.width / dim.height;
  if (!(typeof ar === 'number' && ar > 0)) ar = 4 / 3;
  return clamp(ar, 0.45, 1.4);
};

const Panel = ({ media, index, step, radius, height, rotation, isActive, onHoverChange }) => {
  const aspect = getMediaAspect(media);
  const width = height * aspect;
  const baseAngle = index * step;

  const [isHovered, setIsHovered] = useState(false);

  // Spring-based hover scale — multiplies on top of depth scale
  const hoverScaleSpring = useSpring(1, { stiffness: 300, damping: 24, mass: 0.8 });
  useEffect(() => {
    hoverScaleSpring.set(isHovered ? 1.42 : 1);
  }, [isHovered, hoverScaleSpring]);

  const front = useTransform(rotation, (r) => Math.cos(((baseAngle + r) * Math.PI) / 180));

  const depthScale = useTransform(front, [-1, 0.5, 1], [0.82, 1.0, 1.04]);
  // Combine depth scale × hover scale
  const combinedScale = useTransform(
    [depthScale, hoverScaleSpring],
    ([d, h]) => d * h,
  );

  const opacity = useTransform(front, [-1, -0.35, 0.15, 1], [0.05, 0.35, 0.88, 1]);

  // On hover: remove blur and max brightness; off hover: normal depth blur
  const blurPx = useTransform(front, (f) => ((1 - (f + 1) / 2) * 6).toFixed(2));
  const hoverBlur = useSpring(0, { stiffness: 320, damping: 28 });
  useEffect(() => { hoverBlur.set(isHovered ? -99 : 0); }, [isHovered, hoverBlur]);
  const effectiveBlur = useTransform([blurPx, hoverBlur], ([b, h]) =>
    Math.max(0, parseFloat(b) + h).toFixed(2),
  );

  const brightness = useTransform(front, [-1, 0.4, 1], [0.5, 0.95, 1.15]);
  const hoverBrightness = useSpring(0, { stiffness: 300, damping: 26 });
  useEffect(() => { hoverBrightness.set(isHovered ? 0.25 : 0); }, [isHovered, hoverBrightness]);
  const effectiveBrightness = useTransform(
    [brightness, hoverBrightness],
    ([b, h]) => Math.min(2, b + h),
  );

  const saturate = useTransform(front, [-1, 1], [0.7, 1.15]);
  const hoverSaturate = useSpring(0, { stiffness: 300, damping: 26 });
  useEffect(() => { hoverSaturate.set(isHovered ? 0.2 : 0); }, [isHovered, hoverSaturate]);
  const effectiveSaturate = useTransform([saturate, hoverSaturate], ([s, h]) => s + h);

  const filter = useMotionTemplate`blur(${effectiveBlur}px) brightness(${effectiveBrightness}) saturate(${effectiveSaturate})`;

  const glow = useTransform(front, [0.55, 1], [0, 1]);
  const hoverGlow = useSpring(0, { stiffness: 280, damping: 24 });
  useEffect(() => { hoverGlow.set(isHovered ? 1 : 0); }, [isHovered, hoverGlow]);
  const effectiveGlow = useTransform([glow, hoverGlow], ([g, h]) => Math.min(1, g + h * 0.6));
  const glowBlur = useTransform(effectiveGlow, [0, 1], [0, 80]);
  const glowAlpha = useTransform(effectiveGlow, [0, 1], [0, 0.75]);
  const boxShadow = useMotionTemplate`0 34px 80px -26px rgba(0,0,0,0.8), 0 0 ${glowBlur}px rgba(150,150,255,${glowAlpha})`;

  // Hover ring border intensity
  const ringOpacity = useSpring(0.1, { stiffness: 300, damping: 26 });
  useEffect(() => { ringOpacity.set(isHovered ? 0.7 : 0.1); }, [isHovered, ringOpacity]);
  const ringBorder = useMotionTemplate`1px solid rgba(212, 206, 252, ${ringOpacity})`;

  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    else v.pause();
  }, [isActive]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange?.(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(false);
  };

  const useVideoTag = media?.isVideo;

  return (
    <div
      className="absolute top-1/2 left-1/2 select-none"
      style={{
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
        transformStyle: 'preserve-3d',
        transform: `rotateY(${baseAngle}deg) translateZ(${radius}px)`,
        zIndex: isHovered ? 200 : 'auto',
        cursor: isHovered ? 'zoom-in' : 'grab',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-[16px] bg-[#0b1340] will-change-transform"
        style={{ scale: combinedScale, opacity, filter, boxShadow, outline: ringBorder }}
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
          <CaseStudyMedia
            item={media}
            alt={media?.alt}
            className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
            sizes="(min-width: 768px) 56vw, 92vw"
            draggable="false"
          />
        )}

        {/* Soft sheen + depth gradient */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[16px]"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, transparent 22%, transparent 70%, rgba(0,0,0,0.35) 100%)' }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[16px]"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 0 1px rgba(255,255,255,0.05)' }}
        />

        {/* Lavender hover ring overlay */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[16px]"
          style={{ opacity: effectiveGlow, boxShadow: 'inset 0 0 0 2px rgba(212,206,252,0.7)' }}
        />

        {/* Hover shine sweep */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[16px]"
          style={{
            opacity: hoverGlow,
            background: 'linear-gradient(135deg, rgba(212,206,252,0.12) 0%, transparent 50%, rgba(104,101,250,0.08) 100%)',
          }}
        />
      </motion.div>
    </div>
  );
};

const MediaRibbon3D = ({ media }) => {
  const items = Array.isArray(media) ? media.filter((m) => m && m.url) : [];
  const N = items.length;

  const reduce = useReducedMotion();
  const sceneRef = useRef(null);
  const [dims, setDims] = useState({ height: 320, radius: 720 });
  const [hoverPaused, setHoverPaused] = useState(false);
  const [expandedMediaIndex, setExpandedMediaIndex] = useState(null);
  const hoverTimeout = useRef(null);

  const isDragging = useRef(false);
  const dragDistance = useRef(0);
  const lastX = useRef(0);
  const hoverCount = useRef(0); // track multiple overlapping enter/leave calls

  useEffect(() => {
    const measure = () => {
      const w = sceneRef.current?.clientWidth || window.innerWidth;
      const height = clamp(w * 0.26, 240, 460);
      const minRadius = clamp(w * 0.30, 300, 520);
      const maxRadius = clamp(w * 2.0, 1400, 3600);
      const approxPanelWidth = height * 1.4;
      const minGap = 60;
      // Chord-based formula: (W+gap) / (2·sin(π/N)) guarantees the actual 3D
      // edge-to-edge separation equals minGap regardless of item count
      const requiredRadius = items.length > 1
        ? (approxPanelWidth + minGap) / (2 * Math.sin(Math.PI / items.length))
        : minRadius;
      const radius = clamp(requiredRadius, minRadius, maxRadius);
      setDims({ height, radius });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sceneRef.current) ro.observe(sceneRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [items]);

  const rotation = useMotionValue(0);
  const BASE_VEL = reduce ? 0 : 18;
  const velocity = useRef(BASE_VEL);
  const targetVel = useRef(BASE_VEL);

  const tiltX = useSpring(-6, { stiffness: 60, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 60, damping: 18 });
  const [activeIndex, setActiveIndex] = useState(0);

  const step = N > 0 ? 360 / N : 0;

  useAnimationFrame((_, deltaMs) => {
    if (N === 0) return;
    const dt = Math.min(deltaMs, 50) / 1000;
    // Slow to ~10% speed when a panel is hovered, so it stays readable
    const effective = hoverPaused ? BASE_VEL * 0.08 : targetVel.current;
    velocity.current += (effective - velocity.current) * Math.min(1, dt * 4);
    rotation.set(rotation.get() + velocity.current * dt);
    const r = rotation.get();
    const idx = ((Math.round(-r / step) % N) + N) % N;
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  const handlePanelHoverChange = (entering, index) => {
    hoverCount.current = Math.max(0, hoverCount.current + (entering ? 1 : -1));
    setHoverPaused(hoverCount.current > 0);
    
    if (entering) {
      clearTimeout(hoverTimeout.current);
      setExpandedMediaIndex(index);
    } else {
      hoverTimeout.current = setTimeout(() => {
        setExpandedMediaIndex(null);
      }, 150); // Small delay prevents flicker when moving to overlay
    }
  };

  const handlePointerDown = (e) => {
    isDragging.current = true;
    dragDistance.current = 0;
    lastX.current = e.clientX;
    targetVel.current = 0;
    e.target.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (rect) {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      tiltX.set(-6 - py * 10);
      tiltY.set(px * 8);
      if (!isDragging.current) targetVel.current = BASE_VEL + px * 15;
    }
    if (isDragging.current) {
      const deltaX = e.clientX - lastX.current;
      dragDistance.current += Math.abs(deltaX);
      lastX.current = e.clientX;
      rotation.set(rotation.get() - deltaX * 0.4);
      velocity.current = -deltaX * 25;
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging.current) {
      isDragging.current = false;
      targetVel.current = BASE_VEL;
      e.target.releasePointerCapture?.(e.pointerId);
    }
  };

  const handlePointerLeave = () => {
    if (isDragging.current) return;
    tiltX.set(-6);
    tiltY.set(0);
    targetVel.current = BASE_VEL;
  };

  const ringTransform = useMotionTemplate`translate(-50%, -50%) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  const innerRotate = useTransform(rotation, (r) => `rotateY(${r}deg)`);

  if (N === 0) return null;

  return (
    <div
      ref={sceneRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onDragStart={(e) => e.preventDefault()}
      className="relative w-full overflow-hidden touch-none cursor-grab active:cursor-grabbing"
      style={{ height: 'clamp(820px, 90vh, 1200px)' }}
    >
      {/* Ambient depth */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-[45%] h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(circle, rgba(104,101,250,0.18), transparent 62%)' }}
        />
      </div>

      {/* 3D scene */}
      <div className="absolute inset-0" style={{ perspective: '5500px', perspectiveOrigin: '50% 48%' }}>
        <motion.div
          className="absolute left-1/2 top-[45%]"
          style={{ transformStyle: 'preserve-3d', transform: ringTransform, willChange: 'transform' }}
        >
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
                onHoverChange={(entering) => handlePanelHoverChange(entering, i)}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Static Hover Overlay */}
      {expandedMediaIndex !== null && items[expandedMediaIndex] && (
        <motion.div 
          initial={{ backgroundColor: 'rgba(0,0,0,0)', backdropFilter: 'blur(0px)' }}
          animate={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          exit={{ backgroundColor: 'rgba(0,0,0,0)', backdropFilter: 'blur(0px)' }}
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative pointer-events-auto shadow-[0_40px_100px_rgba(0,0,0,0.9)] rounded-[20px] overflow-hidden bg-transparent border border-white/10"
            style={{ 
              height: '90%', 
              maxHeight: '980px',
              aspectRatio: getMediaAspect(items[expandedMediaIndex]),
              boxShadow: '0 0 100px rgba(104,101,250,0.3)'
            }}
            onMouseEnter={() => clearTimeout(hoverTimeout.current)}
            onMouseLeave={() => setExpandedMediaIndex(null)}
          >
            {items[expandedMediaIndex].isVideo ? (
              <video
                src={items[expandedMediaIndex].url}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <CaseStudyMedia
                item={items[expandedMediaIndex]}
                alt={items[expandedMediaIndex]?.alt}
                className="absolute inset-0 h-full w-full object-cover"
                sizes="100vw"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MediaRibbon3D;
