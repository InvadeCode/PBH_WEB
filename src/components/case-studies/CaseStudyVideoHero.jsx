import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import CaseStudyMedia from './CaseStudyMedia';
import { getEmbedThumbnailUrl, getSafeEmbedUrl } from '../../lib/videoUtils';

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

const DIRECT_VIDEO_RE = /\.(mp4|webm|ogg|mov)(?:$|\?)/i;
const DIRECT_IMAGE_RE = /\.(gif|png|jpe?g|webp|avif|svg)(?:$|\?)/i;

export const hasPlayableVideoSource = (video) => Boolean(
  video?.uploadedVideoUrl ||
  video?.videoFileUrl ||
  video?.embedUrl ||
  video?.videoUrl
);

export const hasVideoHeroSource = (videoHero) => Boolean(
  hasPlayableVideoSource(videoHero) ||
  videoHero?.videos?.some((video) => hasPlayableVideoSource(video))
);

const normalizeVideoEntry = (video) => {
  if (!video || !hasPlayableVideoSource(video)) return null;
  return video;
};

export const toComparableVideoUrl = (url) => {
  if (!url) return '';
  try {
    return getSafeEmbedUrl(url).replace(/\/+$/, '').toLowerCase();
  } catch {
    return String(url).replace(/\/+$/, '').toLowerCase();
  }
};

/** Kanti Sweets-style technical preface backdrop. */
const KantiPrefaceBackdrop = ({ backgroundColor, reduced, theme }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(112deg, ${backgroundColor} 0%, ${theme?.panel || '#171b61'} 46%, ${theme?.primary || '#5f5da2'} 100%)`,
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.13]"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.58) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.58) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(90deg, ${theme?.bgDeep || '#010836'}b8 0%, ${theme?.bgDeep || '#010836'}29 32%, ${theme?.secondary || '#d4cefc'}1c 100%)`,
      }}
    />
    <div
      className="absolute inset-0 opacity-70"
      style={{
        background: `linear-gradient(to bottom, ${theme?.bgDeep || '#010836'}2e, transparent 22%, transparent 72%, ${theme?.bgDeep || '#010836'}70)`,
      }}
    />
    {!reduced && (
      <motion.div
        className="absolute inset-y-0 -left-1/3 w-1/2"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
        animate={{ x: ['0%', '310%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 5 }}
      />
    )}
  </div>
);

const CaseStudyVideoHero = ({ videoHero, fallbackName = 'Case Study', allVideos = [], theme }) => {
  const {
    backgroundColor = '#010836',
    backgroundText,
  } = videoHero || {};

  const heroVideoItem = videoHero?.videos?.[0] || videoHero || {};
  
  const directVideoTitle = heroVideoItem.videoTitle;
  const directVideoSubtitle = heroVideoItem.videoSubtitle;
  const directThumbnailUrl = heroVideoItem.thumbnailUrl;
  const directEmbedUrl = heroVideoItem.embedUrl;
  const directUploadedVideoUrl = heroVideoItem.uploadedVideoUrl;

  // Build the list of videos to render
  const heroVideos = [];

  // Add all videos from videoHero.videos if they exist
  if (videoHero?.videos && videoHero.videos.length > 0) {
    videoHero.videos.forEach((v, idx) => {
      const normalizedVideo = normalizeVideoEntry({
        videoTitle: v.videoTitle || (idx === 0 ? directVideoTitle : undefined),
        videoSubtitle: v.videoSubtitle || (idx === 0 ? directVideoSubtitle : undefined),
        embedUrl: v.embedUrl,
        uploadedVideoUrl: v.uploadedVideoUrl,
        thumbnailUrl: v.thumbnailUrl || (idx === 0 ? directThumbnailUrl : undefined),
      });
      if (normalizedVideo) heroVideos.push(normalizedVideo);
    });
  } else if (directEmbedUrl || directUploadedVideoUrl) {
    // Fallback to flat fields (for synthetic videoHero objects)
    const normalizedVideo = normalizeVideoEntry({
      videoTitle: directVideoTitle,
      videoSubtitle: directVideoSubtitle,
      embedUrl: directEmbedUrl,
      uploadedVideoUrl: directUploadedVideoUrl,
      thumbnailUrl: directThumbnailUrl,
    });
    if (normalizedVideo) heroVideos.push(normalizedVideo);
  }

  if (allVideos && allVideos.length > 0) {
    allVideos.forEach((v, idx) => {
      const vEmbed = v.embedUrl || v.videoUrl;
      const vUpload = v.uploadedVideoUrl || v.videoFileUrl;
      if (!vEmbed && !vUpload) return;
      const vEmbedKey = toComparableVideoUrl(vEmbed);
      const vUploadKey = toComparableVideoUrl(vUpload);
      
      // Prevent duplicating any video already in heroVideos
      const duplicateIndex = heroVideos.findIndex(hv => {
        const heroEmbedKey = toComparableVideoUrl(hv.embedUrl || hv.videoUrl);
        const heroUploadKey = toComparableVideoUrl(hv.uploadedVideoUrl || hv.videoFileUrl);
        return (vEmbedKey && heroEmbedKey === vEmbedKey) || 
               (vUploadKey && heroUploadKey === vUploadKey);
      });
      
      if (duplicateIndex !== -1) {
        const existing = heroVideos[duplicateIndex];
        const hasDefaultTitle = !existing.videoTitle || existing.videoTitle === 'Watch Video';
        const hasDefaultSubtitle = !existing.videoSubtitle || existing.videoSubtitle === 'Experience the story in motion.';
        heroVideos[duplicateIndex] = {
          ...existing,
          videoTitle: hasDefaultTitle ? (v.videoTitle || existing.videoTitle) : existing.videoTitle,
          videoSubtitle: hasDefaultSubtitle ? (v.videoSubtitle || existing.videoSubtitle) : existing.videoSubtitle,
          thumbnailUrl: existing.thumbnailUrl || v.thumbnailUrl,
          orientation: existing.orientation || v.orientation,
        };
        return;
      }
      
      const normalizedVideo = normalizeVideoEntry({
        ...v,
        videoTitle: v.videoTitle || (idx === 0 ? directVideoTitle : undefined),
        videoSubtitle: v.videoSubtitle || (idx === 0 ? directVideoSubtitle : undefined),
        embedUrl: vEmbed,
        uploadedVideoUrl: vUpload,
        thumbnailUrl: v.thumbnailUrl || (idx === 0 ? directThumbnailUrl : undefined),
      });
      if (normalizedVideo) heroVideos.push(normalizedVideo);
    });
  }

  const enabled = heroVideos.length > 0;
  const bgText = (backgroundText || heroVideos[0]?.videoTitle || fallbackName || 'CASE STUDY').toString();
  const normalizedBackdropText = bgText.replace(/\s+/g, ' ').trim();
  const normalizedFallbackName = (fallbackName || '').toString().replace(/\s+/g, ' ').trim();
  const shouldUsePunchWord = normalizedFallbackName
    && normalizedBackdropText.toLowerCase() === normalizedFallbackName.toLowerCase();
  const backdropText = shouldUsePunchWord
    ? normalizedBackdropText.split(' ').filter(Boolean).slice(-1)[0]
    : normalizedBackdropText;

  const [activeVideoIndex, setActiveVideoIndex] = useState(null);
  const isOpen = activeVideoIndex !== null;
  const activeVideo = isOpen ? heroVideos[activeVideoIndex] : null;

  const prefersReduced = useReducedMotion();

  const closeRef = useRef(null);
  const videoRef = useRef(null);

  const layoutTransition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.16, 1, 0.3, 1] };

  const closeVideo = () => {
    if (videoRef.current) {
      try { videoRef.current.pause(); } catch { /* noop */ }
    }
    setActiveVideoIndex(null);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closeVideo(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 80);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(focusTimer);
    };
  }, [isOpen]);

  if (!enabled) return null;

  const carla = { fontFamily: '"Karla", sans-serif' };

  const renderPlayer = (video) => {
    if (!video) return null;
    
    const embedOrUrl = video.embedUrl || video.videoUrl || '';
    const isDirectFile = DIRECT_VIDEO_RE.test(embedOrUrl);
    const isDirectImage = DIRECT_IMAGE_RE.test(embedOrUrl);
    
    if (video.uploadedVideoUrl || video.videoFileUrl || isDirectFile) {
      const srcToUse = video.uploadedVideoUrl || video.videoFileUrl || embedOrUrl;
      return (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain bg-black"
          src={srcToUse}
          poster={video.thumbnailUrl}
          controls
          autoPlay
          playsInline
        />
      );
    }

    if (isDirectImage) {
      return (
        <CaseStudyMedia
          src={embedOrUrl}
          alt={video.videoTitle || 'Case study media'}
          className="absolute inset-0 w-full h-full object-contain bg-black"
          sizes="100vw"
        />
      );
    }
    
    if (embedOrUrl) {
      const safeUrl = getSafeEmbedUrl(embedOrUrl);
      const isInstagram = /instagram\.com/i.test(safeUrl);
      
      return (
        <div className={`absolute inset-0 w-full h-full bg-black ${isInstagram ? 'flex justify-center items-center py-4 sm:py-8' : ''}`}>
          <iframe
            className={isInstagram ? "h-full w-full max-w-[450px] rounded-[1.5rem] overflow-hidden" : "absolute inset-0 w-full h-full"}
            src={withAutoplay(safeUrl)}
            title={video.videoTitle || 'Case study video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{ border: 'none' }}
          />
        </div>
      );
    }
    
    return (
      <div className="absolute inset-0 grid place-items-center bg-black text-white/40 text-[17px] md:text-[19px] tracking-widest uppercase">
        No video source
      </div>
    );
  };

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col items-center justify-center min-h-[430px] md:min-h-[520px] lg:min-h-[560px] py-20 md:py-28"
      style={{ backgroundColor }}
      aria-label={heroVideos[0]?.videoTitle || `${fallbackName} video`}
    >
      <KantiPrefaceBackdrop backgroundColor={backgroundColor} reduced={prefersReduced} theme={theme} />

      {/* Oversized Kanti-style background text */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="font-primary font-black uppercase whitespace-nowrap leading-none text-white/[0.075]"
          style={{ fontSize: 'clamp(8rem, 32vw, 30rem)' }}
          animate={prefersReduced ? undefined : { x: ['2%', '-2%', '2%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        >
          {backdropText}
        </motion.div>
      </div>

      {/* Circular video triggers (mapped horizontally) */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-8 md:gap-16 px-4 w-full">
        {heroVideos.map((video, idx) => {
          const vTitle = video.videoTitle || 'Watch Video';
          const vThumb = video.thumbnailUrl;
          const rawUrl = video.embedUrl || video.videoUrl;
          const vEmbed = rawUrl;
          const vEmbedThumb = getEmbedThumbnailUrl(vEmbed);
          const vUpload = video.uploadedVideoUrl || video.videoFileUrl;
          
          const isDirectFile = rawUrl && DIRECT_VIDEO_RE.test(rawUrl);
          const activeUploadSrc = vUpload || (isDirectFile ? rawUrl : null);
          const fallbackLabel = (backdropText || vTitle || fallbackName || 'Play').slice(0, 12);

          return (
            <div key={idx} className="relative flex flex-col items-center">
              <div className={`relative shrink-0 ${heroVideos.length > 1 ? 'w-[150px] h-[150px] sm:w-[220px] sm:h-[220px] lg:w-[280px] lg:h-[280px]' : 'w-[190px] h-[190px] sm:w-[260px] sm:h-[260px] lg:w-[330px] lg:h-[330px]'}`}>
                {!isOpen && (
                  <motion.button
                    layoutId={`${SHARED_ID}-${idx}`}
                    onClick={() => setActiveVideoIndex(idx)}
                    transition={layoutTransition}
                    style={{ borderRadius: '50%' }}
                    className="group absolute inset-0 overflow-hidden cursor-pointer border border-white/20 bg-white/[0.03] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
                    aria-label={`Play video${vTitle ? `: ${vTitle}` : ''}`}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      initial={false}
                      whileHover={prefersReduced ? undefined : { scale: 1.06 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {activeUploadSrc ? (
                        <video
                          src={activeUploadSrc}
                          poster={vThumb || vEmbedThumb || undefined}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover scale-[1.08]"
                        />
                      ) : vThumb || vEmbedThumb ? (
                        <CaseStudyMedia
                          src={vThumb || vEmbedThumb}
                          alt=""
                          className="w-full h-full object-cover"
                          sizes="(min-width: 1024px) 320px, 240px"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center" style={{ background: `radial-gradient(circle at 50% 35%, rgba(255,255,255,0.16), rgba(255,255,255,0.035) 58%, ${theme?.bgDeep || '#010836'}3d)` }}>
                          <span className="text-white/18 text-5xl md:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight font-primary">
                            {fallbackLabel}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/25 transition-colors duration-500 group-hover:bg-black/10" />
                    </motion.div>

                    {!prefersReduced && (
                      <motion.span
                        className="absolute inset-0 rounded-full border border-white/45"
                        animate={{ scale: [1, 1.08], opacity: [0.45, 0] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: idx * 0.5 }}
                      />
                    )}

                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid place-items-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/16 backdrop-blur-md border border-white/35 transition-transform duration-500 group-hover:scale-110 shadow-[0_0_44px_rgba(255,255,255,0.18)]">
                        <Play className="w-5 h-5 md:w-6 md:h-6 text-white translate-x-0.5" fill="currentColor" aria-hidden="true" />
                      </span>
                    </span>
                  </motion.button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* CMS-driven preface copy */}
      <motion.div
        className="absolute z-10 bottom-6 left-5 right-5 md:bottom-12 md:left-12 md:right-auto lg:left-16 flex flex-col items-start pointer-events-none"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {/* Hand-drawn SVG Arrow pointing right */}
        <div className="mb-4 text-white/70">
          <svg width="48" height="16" viewBox="0 0 64 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
            <path d="M1 12C15.5 8 32 16 48 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M42 6L48 12L42 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h2 className="text-[17px] md:text-[19px] md:text-2xl text-white font-primary font-medium tracking-tight mb-2">
          {heroVideos[0]?.videoTitle || 'Watch Video'}
        </h2>
        <p className="text-[17px] md:text-[19px] md:text-[17px] md:text-[19px] text-white/60 font-secondary max-w-[300px]">
          {heroVideos[0]?.videoSubtitle || 'Experience the story in motion.'}
        </p>
      </motion.div>

      {/* Fullscreen player (portal → escapes overflow/transform ancestors) */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Dim backdrop — click outside to close */}
              <motion.div
                className="fixed inset-0 z-[99998] bg-black/85 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.4 }}
                onClick={closeVideo}
              />

              {/* Expanding frame: circle → near-fullscreen, radius 50% → 0% */}
              <motion.div
                layoutId={`${SHARED_ID}-${activeVideoIndex}`}
                transition={layoutTransition}
                style={{ borderRadius: (activeVideo?.embedUrl || activeVideo?.uploadedVideoUrl || activeVideo?.videoUrl || activeVideo?.videoFileUrl) ? 0 : '0%' }}
                className="fixed z-[99999] inset-3 sm:inset-8 lg:inset-12 overflow-hidden bg-black shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
                role="dialog"
                aria-modal="true"
                aria-label={activeVideo?.videoTitle || 'Case study video'}
              >
                {renderPlayer(activeVideo)}

                {/* Back Button (Top Left) */}
                <button
                  onClick={closeVideo}
                  className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                  aria-label="Go back"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span className="text-[17px] md:text-[19px] font-medium tracking-wide uppercase font-secondary">Back</span>
                </button>

                {/* X Button (Top Right) */}
                <button
                  ref={closeRef}
                  onClick={closeVideo}
                  className="absolute top-6 right-6 z-10 grid place-items-center w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
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
