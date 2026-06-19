import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Play, X } from 'lucide-react';

/**
 * CaseStudyVideoHero — reusable, CMS-driven cinematic video hero.
 *
 * Renders NOTHING (no DOM, no spacing) unless `videoHero.enabled` is true.
 * Driven entirely by the `videoHero` object on a caseStudy document:
 *   { enabled, backgroundColor, backgroundText, videoTitle, videoSubtitle,
 *     thumbnailUrl, embedUrl, uploadedVideoUrl }
 *
 * Clicking the circular thumbnail expands it (shared layout animation)
 * from a circle into a near-fullscreen player; ESC / click-outside closes it.
 */
const SHARED_ID = 'cs-video-hero-frame';

const withAutoplay = (url) => {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.searchParams.set('autoplay', '1');
    if (/youtube|youtu\.be/.test(u.hostname)) u.searchParams.set('rel', '0');
    return u.toString();
  } catch {
    return url;
  }
};

// Deterministic particle field (no layout-thrash randomness on re-render)
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: (i * 61) % 100,
  size: 2 + (i % 3),
  delay: (i % 6) * 0.9,
  dur: 9 + (i % 7),
}));

/** Cinematic motion-graphics backdrop that sits behind the video. */
const MotionBackdrop = ({ reduced }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {/* Drifting gradient orbs */}
    <motion.div
      className="absolute -top-[20%] -left-[15%] w-[70vw] h-[70vw] rounded-full mix-blend-screen"
      style={{ background: 'radial-gradient(circle, rgba(124,120,255,0.40) 0%, transparent 60%)', filter: 'blur(110px)' }}
      animate={reduced ? undefined : { x: ['0%', '14%', '0%'], y: ['0%', '10%', '0%'], scale: [1, 1.18, 1] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute -bottom-[20%] -right-[12%] w-[60vw] h-[60vw] rounded-full mix-blend-screen"
      style={{ background: 'radial-gradient(circle, rgba(212,206,252,0.34) 0%, transparent 60%)', filter: 'blur(120px)' }}
      animate={reduced ? undefined : { x: ['0%', '-12%', '0%'], y: ['0%', '-8%', '0%'], scale: [1.12, 1, 1.12] }}
      transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute top-1/3 left-1/2 w-[40vw] h-[40vw] rounded-full mix-blend-screen -translate-x-1/2"
      style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 65%)', filter: 'blur(90px)' }}
      animate={reduced ? undefined : { opacity: [0.4, 0.85, 0.4], scale: [0.9, 1.1, 0.9] }}
      transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Slow rotating conic halo, masked to a ring behind the center */}
    <motion.div
      className="absolute left-1/2 top-1/2 w-[130vh] h-[130vh] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
      style={{
        background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.35) 40deg, transparent 120deg, transparent 240deg, rgba(124,120,255,0.30) 300deg, transparent 360deg)',
        opacity: 0.13,
        maskImage: 'radial-gradient(circle, transparent 28%, black 40%, transparent 72%)',
        WebkitMaskImage: 'radial-gradient(circle, transparent 28%, black 40%, transparent 72%)',
      }}
      animate={reduced ? undefined : { rotate: 360 }}
      transition={{ duration: 44, repeat: Infinity, ease: 'linear' }}
    />

    {/* Rising particles */}
    {!reduced && PARTICLES.map((p) => (
      <motion.span
        key={p.id}
        className="absolute rounded-full bg-white/40"
        style={{ left: `${p.left}%`, bottom: '-4%', width: p.size, height: p.size }}
        animate={{ y: ['0vh', '-118vh'], opacity: [0, 0.7, 0] }}
        transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
      />
    ))}

    {/* Fine technical grid */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }}
    />

    {/* Sweeping light beam */}
    <motion.div
      className="absolute top-0 bottom-0 w-1/3"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
      animate={reduced ? undefined : { x: ['-60%', '360%'] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
    />
  </div>
);

const CaseStudyVideoHero = ({ videoHero, fallbackName = 'Case Study' }) => {
  const {
    backgroundColor = '#0A0A0A',
    backgroundText,
    videoTitle,
    videoSubtitle,
    thumbnailUrl,
    embedUrl,
    uploadedVideoUrl,
  } = videoHero || {};

  const enabled = videoHero?.enabled === true;
  const bgText = (backgroundText || videoTitle || fallbackName || '').toString();
  const hasVideo = Boolean(embedUrl || uploadedVideoUrl);

  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const videoRef = useRef(null);

  const layoutTransition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.16, 1, 0.3, 1] };

  const closeVideo = () => {
    // Pause native video immediately; embeds stop on unmount.
    if (videoRef.current) {
      try { videoRef.current.pause(); } catch { /* noop */ }
    }
    setOpen(false);
  };

  // ESC to close + body scroll lock + focus management while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') closeVideo(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 80);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(focusTimer);
      triggerRef.current?.focus();
    };
  }, [open]);

  // Conditional rendering — after all hooks, bail out entirely when disabled.
  // No DOM, no spacing, nothing rendered.
  if (!enabled) return null;

  const carla = { fontFamily: '"Karla", sans-serif' };

  const renderPlayer = () => {
    if (embedUrl) {
      return (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={withAutoplay(embedUrl)}
          title={videoTitle || 'Case study video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ border: 'none' }}
        />
      );
    }
    if (uploadedVideoUrl) {
      return (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain bg-black"
          src={uploadedVideoUrl}
          poster={thumbnailUrl}
          controls
          autoPlay
          playsInline
        />
      );
    }
    return (
      <div className="absolute inset-0 grid place-items-center bg-black text-white/40 text-sm tracking-widest uppercase">
        No video source
      </div>
    );
  };

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col items-center justify-center py-28 md:py-40"
      style={{ backgroundColor }}
      aria-label={videoTitle || `${fallbackName} video`}
    >
      {/* Motion-graphics backdrop */}
      <MotionBackdrop reduced={prefersReduced} />

      {/* Oversized background text (Carla) — sits behind the video, overflows the viewport */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none select-none">
        <motion.span
          aria-hidden="true"
          className="font-bold uppercase whitespace-nowrap leading-none text-white/[0.06]"
          style={{ ...carla, fontSize: 'clamp(6rem, 24vw, 26rem)' }}
          animate={prefersReduced ? undefined : { x: ['-1.5%', '1.5%', '-1.5%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        >
          {bgText}
        </motion.span>
      </div>

      {/* Circular video trigger — placeholder reserves space during expansion */}
      <div className="relative z-10 w-[230px] h-[230px] sm:w-[300px] sm:h-[300px] lg:w-[380px] lg:h-[380px]">
        {!open && (
          <motion.button
            ref={triggerRef}
            layoutId={SHARED_ID}
            onClick={() => setOpen(true)}
            transition={layoutTransition}
            style={{ borderRadius: '50%' }}
            className="group absolute inset-0 overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
            aria-label={`Play video${videoTitle ? `: ${videoTitle}` : ''}`}
            whileTap={{ scale: 0.97 }}
          >
            {/* Thumbnail (scales slightly on hover) */}
            <motion.div
              className="absolute inset-0"
              initial={false}
              whileHover={prefersReduced ? undefined : { scale: 1.06 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {thumbnailUrl
                ? <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.18), transparent 70%)' }} />}
              <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/15" />
            </motion.div>

            {/* Pulsing ring */}
            {!prefersReduced && (
              <motion.span
                className="absolute inset-0 rounded-full border border-white/40"
                animate={{ scale: [1, 1.12], opacity: [0.5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              />
            )}

            {/* Play button overlay */}
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid place-items-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/15 backdrop-blur-md border border-white/30 transition-transform duration-500 group-hover:scale-110 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                <Play className="w-6 h-6 md:w-7 md:h-7 text-white translate-x-0.5" fill="currentColor" />
              </span>
            </span>
          </motion.button>
        )}
      </div>

      {/* Title / subtitle */}
      {(videoTitle || videoSubtitle) && (
        <motion.div
          className="relative z-10 mt-10 md:mt-12 text-center px-6"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {videoTitle && <h2 className="text-2xl md:text-4xl text-white font-medium tracking-tight" style={carla}>{videoTitle}</h2>}
          {videoSubtitle && <p className="mt-3 text-sm md:text-base text-white/55 max-w-xl mx-auto" style={carla}>{videoSubtitle}</p>}
        </motion.div>
      )}

      {/* Fullscreen player (portal → escapes overflow/transform ancestors) */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Dim backdrop — click outside to close */}
              <motion.div
                className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.4 }}
                onClick={closeVideo}
              />

              {/* Expanding frame: circle → near-fullscreen, radius 50% → 0% */}
              <motion.div
                layoutId={SHARED_ID}
                transition={layoutTransition}
                style={{ borderRadius: hasVideo ? 0 : '0%' }}
                className="fixed z-[210] inset-3 sm:inset-8 lg:inset-12 overflow-hidden bg-black shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
                role="dialog"
                aria-modal="true"
                aria-label={videoTitle || 'Case study video'}
              >
                {renderPlayer()}

                <button
                  ref={closeRef}
                  onClick={closeVideo}
                  className="absolute top-4 right-4 z-10 grid place-items-center w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                  aria-label="Close video"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default CaseStudyVideoHero;
