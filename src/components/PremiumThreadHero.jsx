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

/**
 * PremiumThreadHero
 * An ultra-premium, interactive 3D "thread of bumps" hero.
 *
 * A continuous ring of soft inflated beads orbits a central axis in true 3D
 * (perspective + preserve-3d + rotateY/translateZ — real foreshortening, not
 * flat scaling). The bead reaching front-center becomes the active focus:
 * it enlarges, sharpens, brightens, glows, and auto-plays its video/gif.
 * Neighbours stay visible but softer and blurred; far beads recede into depth.
 *
 * Props:
 *   media     — array of { type: 'image'|'video'|'gif'|'gradient', src, alt, poster }
 *   eyebrow / title / subtitle — optional overlay copy (kept minimal & editorial)
 *   className — wrapper classes
 *
 * Everything is CMS-ready: pass a `media` array (e.g. from Sanity) and it maps
 * each entry onto a bead. With no media it renders gorgeous gradient beads.
 */

// Luxe default beads (soft jewel/pastel gradients) so it looks premium with no assets.
const DEFAULT_MEDIA = [
  { type: 'gradient', g: 'radial-gradient(120% 120% at 30% 25%, #d4cefc 0%, #6865fa 45%, #2b2a8f 100%)' },
  { type: 'gradient', g: 'radial-gradient(120% 120% at 30% 25%, #ffe6a8 0%, #ffcd00 45%, #b97e00 100%)' },
  { type: 'gradient', g: 'radial-gradient(120% 120% at 30% 25%, #b9e8ff 0%, #2a97d9 45%, #0a3b66 100%)' },
  { type: 'gradient', g: 'radial-gradient(120% 120% at 30% 25%, #ffd2e8 0%, #ff6fae 45%, #7a1247 100%)' },
  { type: 'gradient', g: 'radial-gradient(120% 120% at 30% 25%, #d6ffe6 0%, #36d39a 45%, #0c5a44 100%)' },
  { type: 'gradient', g: 'radial-gradient(120% 120% at 30% 25%, #e9e4ff 0%, #8a7cff 45%, #2b2a8f 100%)' },
  { type: 'gradient', g: 'radial-gradient(120% 120% at 30% 25%, #fff0d6 0%, #ff9d4d 45%, #7a3a00 100%)' },
  { type: 'gradient', g: 'radial-gradient(120% 120% at 30% 25%, #cfeaff 0%, #5b8cff 45%, #15235e 100%)' },
  { type: 'gradient', g: 'radial-gradient(120% 120% at 30% 25%, #f3d6ff 0%, #b06cff 45%, #3d1660 100%)' },
  { type: 'gradient', g: 'radial-gradient(120% 120% at 30% 25%, #d4cefc 0%, #6865fa 45%, #2b2a8f 100%)' },
  { type: 'gradient', g: 'radial-gradient(120% 120% at 30% 25%, #d6fff6 0%, #2ad1c9 45%, #0a4d49 100%)' },
  { type: 'gradient', g: 'radial-gradient(120% 120% at 30% 25%, #ffe0e0 0%, #ff6b6b 45%, #6e1414 100%)' },
];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ── A single bead: places itself on the ring, derives all depth effects from `rotation`.
const Bead = ({ media, index, step, radius, beadSize, rotation, isActive }) => {
  const baseAngle = index * step;

  // front-ness: 1 = facing camera (front-center), -1 = facing away (back).
  const front = useTransform(rotation, (r) => Math.cos(((baseAngle + r) * Math.PI) / 180));

  // Depth-driven looks (GPU: transform + filter + opacity only).
  const scale = useTransform(front, [-1, 0.5, 1], [0.78, 1.0, 1.14]);
  const opacity = useTransform(front, [-1, -0.35, 0.15, 1], [0.06, 0.32, 0.82, 1]);
  const blurPx = useTransform(front, (f) => (((1 - (f + 1) / 2) * 7).toFixed(2)));
  const brightness = useTransform(front, [-1, 0.4, 1], [0.5, 0.92, 1.16]);
  const saturate = useTransform(front, [-1, 1], [0.65, 1.18]);
  const filter = useMotionTemplate`blur(${blurPx}px) brightness(${brightness}) saturate(${saturate})`;
  const glow = useTransform(front, [0.55, 1], [0, 1]); // 0..1 highlight as it reaches front
  const glowBlur = useTransform(glow, [0, 1], [0, 60]);
  const glowAlpha = useTransform(glow, [0, 1], [0, 0.5]);
  const boxShadow = useMotionTemplate`0 28px 60px -18px rgba(0,0,0,0.65), 0 0 ${glowBlur}px rgba(150,150,255,${glowAlpha})`;

  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive]);

  const isVideo = media?.type === 'video' && media?.src;
  const isImage = (media?.type === 'image' || media?.type === 'gif') && media?.src;

  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        width: beadSize,
        height: beadSize,
        marginLeft: -beadSize / 2,
        marginTop: -beadSize / 2,
        transformStyle: 'preserve-3d',
        transform: `rotateY(${baseAngle}deg) translateZ(${radius}px)`,
      }}
    >
      <motion.div
        className="relative h-full w-full rounded-full overflow-hidden will-change-transform"
        style={{ scale, opacity, filter, boxShadow }}
      >
        {/* Media surface */}
        {isVideo ? (
          <video
            ref={videoRef}
            src={media.src}
            poster={media.poster}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : isImage ? (
          <img src={media.src} alt={media.alt || ''} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        ) : (
          <div className="absolute inset-0" style={{ background: media?.g || DEFAULT_MEDIA[index % DEFAULT_MEDIA.length].g }} />
        )}

        {/* Sphere shading: top-left sheen + bottom volume shadow → fakes an inflated curved surface */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(60% 55% at 32% 26%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 26%, transparent 52%)', mixBlendMode: 'screen' }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(75% 75% at 50% 88%, rgba(0,0,0,0.55) 0%, transparent 55%)' }}
        />
        {/* Soft rim light — no hard edge */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.35), inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 -16px 32px rgba(0,0,0,0.35)' }}
        />
        {/* Active highlight ring (only when forward) */}
        <motion.div
          className="pointer-events-none absolute -inset-[2px] rounded-full"
          style={{ opacity: glow, boxShadow: 'inset 0 0 0 2px rgba(212,206,252,0.6)' }}
        />
      </motion.div>
    </div>
  );
};

const PremiumThreadHero = ({ media, eyebrow, title, subtitle, className = '' }) => {
  const beads = (media && media.length ? media : DEFAULT_MEDIA);
  const N = beads.length;
  const step = 360 / N;

  const reduce = useReducedMotion();
  const sceneRef = useRef(null);

  // Responsive geometry.
  const [dims, setDims] = useState({ beadSize: 200, radius: 520 });
  useEffect(() => {
    const measure = () => {
      const w = sceneRef.current?.clientWidth || window.innerWidth;
      const beadSize = clamp(w * 0.16, 130, 240);
      const radius = clamp(w * 0.42, 300, 720);
      setDims({ beadSize, radius });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sceneRef.current) ro.observe(sceneRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  // ── Rotation engine: continuous twirl + momentum + cursor influence.
  const rotation = useMotionValue(0);
  const velocity = useRef(reduce ? 0 : 7); // deg/sec
  const targetVel = useRef(reduce ? 0 : 7);
  const BASE_VEL = reduce ? 0 : 7;

  // Cursor parallax (springy tilt of the whole ring).
  const tiltX = useSpring(-7, { stiffness: 60, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 60, damping: 18 });
  const [activeIndex, setActiveIndex] = useState(0);

  useAnimationFrame((_, deltaMs) => {
    const dt = Math.min(deltaMs, 50) / 1000;
    // ease velocity toward target (momentum)
    velocity.current += (targetVel.current - velocity.current) * Math.min(1, dt * 3);
    rotation.set(rotation.get() + velocity.current * dt);

    // active bead = the one whose facing angle is closest to front (0°).
    const r = rotation.get();
    const idx = ((Math.round(-r / step) % N) + N) % N;
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  const handleMove = (e) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(-7 - py * 10);          // look slightly with vertical mouse
    tiltY.set(px * 8);                // parallax yaw
    targetVel.current = BASE_VEL + px * 10; // momentum nudges with horizontal mouse
  };
  const handleLeave = () => {
    tiltX.set(-7); tiltY.set(0); targetVel.current = BASE_VEL;
  };

  const ringTransform = useMotionTemplate`translate(-50%, -50%) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  const innerRotate = useTransform(rotation, (r) => `rotateY(${r}deg)`);

  return (
    <section
      ref={sceneRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ minHeight: '92vh', background: 'radial-gradient(120% 90% at 50% 18%, #161534 0%, #0a0a1f 45%, #050510 100%)' }}
    >
      {/* Ambient depth glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]" style={{ background: 'radial-gradient(circle, rgba(104,101,250,0.22), transparent 60%)' }} />
        <div className="absolute right-[8%] top-[18%] h-[34vw] w-[34vw] rounded-full blur-[150px]" style={{ background: 'radial-gradient(circle, rgba(212,206,252,0.14), transparent 65%)' }} />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* Overlay copy (optional, editorial) */}
      {(eyebrow || title || subtitle) && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center px-6 pt-28 text-center md:pt-32">
          {eyebrow && (
            <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 text-[11px] uppercase tracking-[0.5em] text-white/55" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {eyebrow}
            </motion.span>
          )}
          {title && (
            <motion.h1 initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)] md:text-6xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {title}
            </motion.h1>
          )}
          {subtitle && (
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-xl text-base text-white/55 md:text-lg" style={{ fontFamily: '"Karla", sans-serif' }}>
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      {/* 3D Scene */}
      <div className="absolute inset-0 z-10" style={{ perspective: '1700px', perspectiveOrigin: '50% 46%' }}>
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ transformStyle: 'preserve-3d', transform: ringTransform, willChange: 'transform' }}
        >
          <motion.div className="absolute" style={{ transformStyle: 'preserve-3d', transform: innerRotate }}>
            {beads.map((m, i) => (
              <Bead
                key={i}
                media={m}
                index={i}
                step={step}
                radius={dims.radius}
                beadSize={dims.beadSize}
                rotation={rotation}
                isActive={i === activeIndex}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade so the ribbon melts into the page (no hard edge) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32" style={{ background: 'linear-gradient(to top, #050510, transparent)' }} />
    </section>
  );
};

export default PremiumThreadHero;
