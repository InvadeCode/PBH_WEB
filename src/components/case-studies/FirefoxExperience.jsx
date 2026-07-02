import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GlobalContext } from '../../App';
import CaseStudyMedia, { normalizeMediaItems, getMediaUrl } from './CaseStudyMedia';
import MediaRibbon3D from './MediaRibbon3D';
import CaseStudySectorPill from './CaseStudySectorPill';

// Import all Firefox Flow Images
import observationMap from '../../assets/firefox/observation_map.png';
import insightMapping from '../../assets/firefox/insight_mapping.png';
import themeMapping from '../../assets/firefox/theme_mapping.png';
import starGazerSketch from '../../assets/firefox/star_gazer_sketch.png';
import sketches1 from '../../assets/firefox/sketches_1.png';
import sketches2 from '../../assets/firefox/sketches_2.png';
import sketches3 from '../../assets/firefox/sketches_3.png';
import sketches4 from '../../assets/firefox/sketches_4.png';
import dreamerBikesLeft from '../../assets/firefox/dreamer_bikes_left.png';
import dreamerBikesRight from '../../assets/firefox/dreamer_bikes_right.png';
import stargazerBikesLeft from '../../assets/firefox/stargazer_bikes_left.png';
import stargazerBikesRight from '../../assets/firefox/stargazer_bikes_right.png';
import stellarBikesLeft from '../../assets/firefox/stellar_bikes_left.png';
import stellarBikesRight from '../../assets/firefox/stellar_bikes_right.png';
import ecosystem1 from '../../assets/firefox/ecosystem_1.png';
import ecosystem2 from '../../assets/firefox/ecosystem_2.png';
import ecosystem3 from '../../assets/firefox/ecosystem_3.png';
import lifestyleGrid from '../../assets/firefox/lifestyle_grid.png';

/* ── Arise Visual DNA (palette, utilities) ─────────────────────────── */
const palette = {
  bgDeep: '#0d0600',
  panel: '#1e0e00',
  primary: '#e8800a',
  secondary: '#f5c240',
  text: '#F4F4F5',
};

/* Ambient background glows — identical to Arise */
const ChicAmbientBackground = () => (
  // PERF: isolation:isolate scopes mix-blend-screen compositing within this element only
  // contain:layout style limits repaint scope so scroll doesn't invalidate the whole page
  <div
    className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    style={{ isolation: 'isolate', contain: 'layout style' }}
  >
    <div className="absolute inset-0 mix-blend-screen">
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full blur-[120px]"
        style={{ background: `radial-gradient(circle, ${palette.primary}40 0%, transparent 60%)`, willChange: 'transform' }}
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px]"
        style={{ background: `radial-gradient(circle, ${palette.secondary}30 0%, transparent 60%)`, willChange: 'transform' }}
      />
    </div>
  </div>
);

/* Elegant scroll-reveal fade */
const ElegantFade = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-8%' }}
    transition={{ duration: 1.2, delay, ease: [0.25, 1, 0.5, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* Parallax image with clip-path reveal */
const ParallaxImage = ({ src, alt, item, delay = 0, yOffset = 20, className = '', imageClassName = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const y = useTransform(smooth, [0, 1], [-yOffset, yOffset]);

  // Reduced massive scaling and clipping constraints to address user feedback "reduce the size of the images"
  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: 'inset(100% 0 0 0)', scale: 0.98 }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 1.2, delay, ease: [0.25, 1, 0.5, 1] }}
      className={`w-full relative group overflow-hidden bg-[#1e0e00]/40 flex items-center justify-center rounded-[2rem] shadow-xl ring-1 ring-white/10 ${className}`}
    >
      {item ? (
        <CaseStudyMedia
          item={item}
          alt={alt || item?.alt}
          className={`w-full h-auto object-cover transition-transform duration-[2s] opacity-95 group-hover:opacity-100 ${imageClassName}`}
          sizes="(min-width: 1024px) 50vw, 100vw"
          motionProps={{ style: { y: useTransform(smooth, [0, 1], [-yOffset / 2, yOffset / 2]) } }}
        />
      ) : (
        <CaseStudyMedia
          src={src}
          alt={alt}
          className={`w-full h-auto object-cover transition-transform duration-[2s] opacity-95 group-hover:opacity-100 ${imageClassName}`}
          sizes="(min-width: 1024px) 50vw, 100vw"
          motionProps={{ style: { y: useTransform(smooth, [0, 1], [-yOffset / 2, yOffset / 2]) } }}
        />
      )}
      <div className="absolute inset-0 bg-[#1e0e00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-overlay pointer-events-none" />
    </motion.div>
  );
};

/* ── Section Title — consistent typographic hierarchy ────────────── */
const SectionTitle = ({ children, label, className = '' }) => (
  <ElegantFade className={className}>
    {label && (
      <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full bg-[#f5c240]/10 text-[#f5c240] text-[15px] md:text-[17px] font-bold tracking-widest uppercase backdrop-blur-md font-primary">
        <span className="w-2 h-2 rounded-full bg-[#f5c240] animate-pulse shadow-[0_0_10px_#f5c240]" />
        {label}
      </div>
    )}
    <motion.h2
      animate={{ backgroundPosition: ['200% center', '-200% center'] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      className="font-primary text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(232,128,10,0.3)]"
      style={{
        backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #e8800a 45%, #f5c240 50%, #e8800a 55%, #FFFFFF 70%, #FFFFFF 100%)',
        backgroundSize: '300% auto',
      }}
    >
      {children}
    </motion.h2>
  </ElegantFade>
);

/* ── Editorial Section: Title → Body → Images ─────────────────────── */
const EditorialSection = ({ title, label, body, images = [], layoutVariant = 'text-first', children, imageClassName = '' }) => {
  const isVisualFirst = layoutVariant === 'visual-first' || layoutVariant === 'full-width-visual';

  return (
    <section className="relative w-full z-10">
      <div className="py-12 md:py-20 px-6 md:px-12 max-w-[1400px] mx-auto">
        {!isVisualFirst && title && <SectionTitle label={label} className="mb-8 md:mb-10">{title}</SectionTitle>}

        {!isVisualFirst && body && (
          <ElegantFade delay={0.15} className="mb-10 md:mb-14">
            <div className="max-w-4xl">
              {body.split('\n\n').filter(Boolean).map((para, i) => (
                <p key={i} className="text-white/90 font-normal text-[17px] md:text-[19px] leading-relaxed md:leading-relaxed font-secondary mb-6 last:mb-0">
                  {para.trim()}
                </p>
              ))}
            </div>
          </ElegantFade>
        )}

        {isVisualFirst && title && <SectionTitle label={label} className="mb-8 md:mb-10">{title}</SectionTitle>}

        {images.length > 0 && (
          <div className="flex flex-col gap-16 md:gap-24 w-full">
            {images.map((img, i) => {
              const isReversed = i % 2 !== 0;
              return (
                <ElegantFade key={img?._key || img?.url || i} delay={i * 0.1}>
                  {images.length === 1 ? (
                    <div className="max-w-5xl mx-auto w-full">
                      <ParallaxImage
                        src={img?.url}
                        item={img?.url ? img : undefined}
                        alt={img?.alt || `Section image ${i + 1}`}
                        yOffset={15}
                        imageClassName={imageClassName || "object-contain max-h-[700px] w-auto mx-auto"}
                        className="bg-transparent shadow-none ring-0"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
                      <div className={`lg:col-span-9 ${isReversed ? 'lg:col-start-1' : 'lg:col-start-4'}`}>
                        <ParallaxImage
                          src={img?.url}
                          item={img?.url ? img : undefined}
                          alt={img?.alt || `Section image ${i + 1}`}
                          yOffset={15}
                          imageClassName={imageClassName || "object-contain max-h-[700px] w-auto mx-auto"}
                          className="bg-transparent shadow-none ring-0"
                        />
                      </div>
                    </div>
                  )}
                </ElegantFade>
              );
            })}
          </div>
        )}

        {isVisualFirst && body && (
          <ElegantFade delay={0.15} className="mt-10 md:mt-14">
            <div className="max-w-4xl">
              {body.split('\n\n').filter(Boolean).map((para, i) => (
                <p key={i} className="text-white/90 font-normal text-[17px] md:text-[19px] leading-relaxed md:leading-relaxed font-secondary mb-6 last:mb-0">
                  {para.trim()}
                </p>
              ))}
            </div>
          </ElegantFade>
        )}

        {children}
      </div>
    </section>
  );
};

/* ── Aesthetic Horizontal Carousel ─────────────────────────────────── */
const AestheticCarousel = ({ images, heightClass = "h-[350px] md:h-[500px]" }) => {
  const containerRef = useRef(null);
  const firstSetRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let raf;
    let last = performance.now();
    const speed = 0.25; // Slower, more elegant speed
    const loop = (time) => {
      const dt = time - last;
      last = time;
      const el = containerRef.current;
      if (el && !paused) {
        el.scrollLeft += speed * (dt / 16);
        const w = firstSetRef.current?.offsetWidth || 0;
        if (w > 0 && el.scrollLeft >= w) el.scrollLeft -= w; // seamless wrap
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const renderCard = (img, idx, prefix) => (
    <div 
      key={`${prefix}-${idx}`} 
      className="flex-none w-[60vw] max-w-[160px] md:max-w-[200px] relative group shrink-0 px-4 py-16"
    >
      {/* 
        Hover wrapper:
        Very smooth scaling and vertical shift for the sophisticated pop-up effect.
      */}
      <div className="w-full relative rounded-2xl transition-all duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.15] group-hover:-translate-y-6 z-10 group-hover:z-50">
        
        {/* Glow effect behind the card */}
        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-[900ms] ease-out -z-10" />

        <div className="w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/30 transition-all duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          <img 
            src={img.url || img} 
            alt={img.alt || `Carousel item ${idx + 1}`} 
            className="w-full aspect-[4/5] object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
            draggable="false"
          />
        </div>
      </div>
      
      {/* Title fades in below image on hover */}
      {img.alt && (
        <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 translate-y-4 transition-all duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100 group-hover:translate-y-0 z-50 pointer-events-none">
          <p className="text-white/80 font-secondary text-xs md:text-sm tracking-[0.25em] uppercase drop-shadow-md">
            {img.alt}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div 
        ref={containerRef}
        className="flex overflow-x-auto items-center eco-hide-scrollbar"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <div ref={firstSetRef} className="flex gap-2 md:gap-4 pr-2 md:pr-4 shrink-0">
          {images.map((img, idx) => renderCard(img, idx, 'a'))}
        </div>
        <div className="flex gap-2 md:gap-4 pr-2 md:pr-4 shrink-0" aria-hidden="true">
          {images.map((img, idx) => renderCard(img, idx, 'b'))}
        </div>
      </div>
      
      {/* Edge Fades for elegance */}
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-48 bg-gradient-to-r from-[#0d0600] via-[#0d0600]/80 to-transparent pointer-events-none z-40" />
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-48 bg-gradient-to-l from-[#0d0600] via-[#0d0600]/80 to-transparent pointer-events-none z-40" />
      <style dangerouslySetInnerHTML={{ __html: '.eco-hide-scrollbar::-webkit-scrollbar{display:none}' }} />
    </div>
  );
};

/* ── Universe Card — text block + carousel ────────────────────────── */
const UniverseCard = ({ title, description, images, index }) => {
  return (
    <div className="mb-24 md:mb-40 last:mb-0">
      <ElegantFade>
        <div className="px-6 md:px-12 mb-12 md:mb-16 text-center max-w-4xl mx-auto">
          <motion.h3
            className="font-primary text-4xl md:text-6xl text-white mb-6 font-medium tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {title}
          </motion.h3>
          {description && (
            <p className="text-white/70 font-normal text-[17px] md:text-[21px] leading-relaxed font-secondary">
              {description}
            </p>
          )}
        </div>
      </ElegantFade>
      
      <ElegantFade delay={0.2}>
        <div className="px-6 md:px-12 max-w-[1400px] mx-auto">
          <div className={`grid grid-cols-1 ${images.length > 1 ? 'md:grid-cols-2' : ''} gap-8 md:gap-12`}>
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className="w-full rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:scale-[1.01] hover:border-white/20 flex items-center justify-center relative group"
              >
                <img 
                  src={img.url || img} 
                  alt={img.alt || `${title} view ${idx + 1}`} 
                  className="w-full h-auto object-contain p-6 md:p-12 transition-transform duration-1000 group-hover:scale-105"
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </div>
      </ElegantFade>
    </div>
  );
};

/* ── Dramatic Scrollytelling Sections ─────────────────────────────────────── */
const AboutGraphic = () => (
  <>
    <motion.div 
      animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      className="absolute w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-[40%] border border-[#e8800a]/30 opacity-60 shadow-[inset_0_0_100px_rgba(232,128,10,0.2)] mix-blend-screen pointer-events-none"
    />
    <motion.div 
      animate={{ rotate: -360, scale: [1, 1.2, 1] }} 
      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      className="absolute w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] rounded-[45%] border border-[#f5c240]/20 opacity-50 shadow-[0_0_80px_rgba(245,194,64,0.1)] mix-blend-screen pointer-events-none"
    />
  </>
);

const ProblemGraphic = () => (
  <>
    <motion.div 
      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }} 
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-[40%] bg-[#f5c240] mix-blend-screen blur-[120px] pointer-events-none"
    />
    <motion.div 
      animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }} 
      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute w-[70vw] h-[70vw] md:w-[45vw] md:h-[45vw] rounded-[45%] bg-[#e8800a] mix-blend-screen blur-[140px] pointer-events-none"
    />
  </>
);

const DramaticSection = ({ title, content, motionGraphic }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const spring = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const titleOpacity = useTransform(spring, [0, 0.15], [1, 0]);
  const titleScale = useTransform(spring, [0, 0.15], [1, 1.2]);
  const titleY = useTransform(spring, [0, 0.15], [0, -30]);
  
  const contentOpacity = useTransform(spring, [0.05, 0.25, 0.9, 1], [0, 1, 1, 0]);
  const contentY = useTransform(spring, [0.05, 0.25, 0.9, 1], [30, 0, 0, -30]);
  const graphicScale = useTransform(spring, [0, 1], [1, 1.5]);

  return (
    <section ref={ref} className="h-[200vh] relative w-full z-10">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        <motion.div style={{ scale: graphicScale }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {motionGraphic}
        </motion.div>

        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0d0600] to-transparent z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d0600] to-transparent z-0 pointer-events-none" />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div style={{ opacity: titleOpacity, scale: titleScale, y: titleY }} className="flex flex-col items-center justify-center w-full px-6 text-center pointer-events-auto">
            <motion.h2 
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="font-primary text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(232,128,10,0.5)]" 
              style={{ 
                backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #e8800a 45%, #f5c240 50%, #e8800a 55%, #FFFFFF 70%, #FFFFFF 100%)',
                backgroundSize: '300% auto',
              }}
            >
              {title}
            </motion.h2>
          </motion.div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <motion.div style={{ opacity: contentOpacity, y: contentY }} className="w-full max-w-4xl px-6 md:px-12 text-center flex flex-col items-center pointer-events-auto">
            <h3 className="text-[17px] md:text-[19px] tracking-widest uppercase text-[#f5c240] mb-6 md:mb-8 font-bold font-primary">
               {title}
            </h3>
            <div className="space-y-6">
              {content.split('\n\n').filter(Boolean).map((para, i) => (
                <p key={i} className="text-white/90 font-normal text-[17px] md:text-[19px] max-w-3xl mx-auto leading-relaxed md:leading-relaxed font-secondary">
                  {para.trim()}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   FIREFOX EXPERIENCE — Main Component
   ══════════════════════════════════════════════════════════════════════ */
const FirefoxExperience = ({ navigate, project }) => {
  const { SITE_SETTINGS } = React.useContext(GlobalContext) || {};
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const heroImg = project?.bannerVideo || project?.fullStory?.heroVideo || project?.bannerImage || project?.fullStory?.heroImg || project?.imageUrl || '';
  const heroAspectRatio = 16 / 9;

  const cmsMedia = normalizeMediaItems(project?.fullStory?.media || project?.fullStory?.images, project?.client || 'Firefox');

  // Pull dynamic images from the new dedicated Sanity firefoxAssets schema if they exist
  const fxAssets = project?.firefoxAssets || {};
  
  const imgStrategy = getMediaUrl(fxAssets.imgStrategy) || observationMap;
  const imgInsight = getMediaUrl(fxAssets.imgInsight) || insightMapping;
  const imgTheme = getMediaUrl(fxAssets.imgTheme) || themeMapping;
  const imgStargazer = getMediaUrl(fxAssets.imgStargazerSketch) || starGazerSketch;

  const sketches = fxAssets.sketchesGrid || [];
  const imgSketch1 = getMediaUrl(sketches[0]) || sketches1;
  const imgSketch2 = getMediaUrl(sketches[1]) || sketches2;
  const imgSketch3 = getMediaUrl(sketches[2]) || sketches3;
  const imgSketch4 = getMediaUrl(sketches[3]) || sketches4;

  const dreamer = fxAssets.dreamerImages || [];
  const imgDreamerLeft = getMediaUrl(dreamer[0]) || dreamerBikesLeft;
  const imgDreamerRight = getMediaUrl(dreamer[1]) || dreamerBikesRight;
  
  const stargazer = fxAssets.stargazerImages || [];
  const imgStargazerLeft = getMediaUrl(stargazer[0]) || stargazerBikesLeft;
  const imgStargazerRight = getMediaUrl(stargazer[1]) || stargazerBikesRight;
  
  const stellar = fxAssets.stellarImages || [];
  const imgStellarLeft = getMediaUrl(stellar[0]) || stellarBikesLeft;
  const imgStellarRight = getMediaUrl(stellar[1]) || stellarBikesRight;
  
  const ecosystem = fxAssets.ecosystemImages || [];
  const imgEcosystem1 = getMediaUrl(ecosystem[0]) || ecosystem1;
  const imgEcosystem2 = getMediaUrl(ecosystem[1]) || ecosystem2;
  const imgEcosystem3 = getMediaUrl(ecosystem[2]) || ecosystem3;

  return (
    <div className="w-full min-h-screen font-secondary selection:bg-[#e8800a] selection:text-white" style={{ backgroundColor: palette.bgDeep, color: palette.text }}>
      <ChicAmbientBackground />

      {/* Navigation */}
      <div className="fixed top-0 left-0 w-full z-50 px-6 pt-28 pb-6 md:px-12 md:pt-32 md:pb-8 flex items-center gap-3 pointer-events-none">
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2 text-[17px] md:text-[19px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>

      {/* ── 1. HERO ── */}
      <section className="relative w-full flex flex-col items-center justify-start z-10 pb-16 md:pb-20 pt-44 md:pt-48 px-4 md:px-8">
        <div
          className="relative w-full max-w-[95vw] md:max-w-7xl mx-auto rounded-[30px] md:rounded-[50px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
          style={{ aspectRatio: heroAspectRatio }}
        >
          {heroImg ? (
            <CaseStudyMedia src={heroImg} alt={`${project?.client || 'Firefox'} Banner`} className="w-full h-full object-cover" priority sizes="(min-width: 1280px) 1280px, 95vw" />
          ) : (
            <div className="w-full h-full bg-[#1e0e00]" />
          )}
          <div className="pointer-events-none absolute left-1/2 top-5 z-20 -translate-x-1/2 px-3 md:top-6">
            <CaseStudySectorPill
              sector={project?.sector || (project?.tags?.length > 0 ? project.tags[0] : null) || (project?.roles?.length > 0 ? project.roles[0] : null)}
              className="border border-white/[0.16] bg-[#0d0600]/45 text-white/85 shadow-[0_14px_40px_rgba(0,0,0,0.24)] backdrop-blur-md"
            />
          </div>
        </div>

        <div className="relative z-20 flex flex-col items-center text-center px-4 mt-12 md:mt-16">
          <ElegantFade delay={0.4} className="mb-6 flex flex-wrap justify-center gap-4">
            {(project?.tags || ['Product Graphics', 'Illustration', 'Visual Strategy']).map((tag, i) => (
              <span key={i} className="px-6 py-2 rounded-full border border-white/10 text-[17px] md:text-[19px] tracking-widest uppercase font-bold text-white/80 bg-white/5 backdrop-blur-md shadow-lg font-primary">
                {tag}
              </span>
            ))}
          </ElegantFade>

          <ElegantFade delay={0.2}>
            <motion.h1
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="font-primary text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-transparent bg-clip-text font-medium tracking-tight drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              style={{
                backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #f5c240 45%, #e8800a 50%, #f5c240 55%, #FFFFFF 70%, #FFFFFF 100%)',
                backgroundSize: '300% auto',
              }}
            >
              {project?.client || 'Firefox × lilFox'}
            </motion.h1>
          </ElegantFade>
        </div>
      </section>

      {/* ── 2. INTRO ── */}
      <DramaticSection
        title="Designing for Untamed Imaginations"
        content={`Firefox approached us to design graphics for a new range of children's bicycles. The brief sounded simple. The opportunity wasn't.\n\nAs we explored the category, we realised children don't experience bicycles the way adults do. Adults see products. Children see possibilities. A bicycle can become a spaceship, a dragon rider, a superhero vehicle, or a ticket to another world.\n\nThat insight transformed the project.\n\nWhat began as a graphics assignment evolved into the creation of lilFox, a children's brand built around imagination, storytelling, and adventure.`}
        motionGraphic={<AboutGraphic />}
      />

      {/* ── 3. CHALLENGE ── */}
      <DramaticSection
        title="Creating the lilFox Universe"
        content={`Rather than designing a product range under Firefox, we set out to create a world with its own personality, language, and visual identity.\n\nThis led to the creation of lilFox as a standalone children's brand where imagination became the organising principle behind every touchpoint.\n\nFrom bicycles to accessories, packaging, and future products, every element belonged to the same universe.\n\nThe goal wasn't to sell bicycles.\n\nIt was to create a platform for adventure.`}
        motionGraphic={<ProblemGraphic />}
      />

      {/* ── 4. OUR CREATIVE STRATEGY ── */}
      <section className="relative w-full z-10 py-16 md:py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
          <ElegantFade delay={0.1}>
            <h2 className="font-primary text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 md:mb-10 tracking-tight">
              Our Creative Strategy
            </h2>
            
            <div className="space-y-4 text-white/90 font-secondary text-[18px] md:text-[22px] leading-relaxed md:leading-[1.6]">
              <p>Our research revealed that bicycles play a very different role in a child's life.</p>
              <p>Children use objects as storytelling tools. They create characters, missions, rules, and entire worlds around them.</p>
              <p>The bicycle wasn't simply something they rode.</p>
              <p>It was something they imagined through.</p>
            </div>
          </ElegantFade>
        </div>
          
        <ElegantFade delay={0.2} className="w-full flex justify-center">
          <div className="relative w-full max-w-[1200px] bg-white/5 rounded-xl border border-white/10 shadow-2xl p-4 md:p-6">
            <div className="w-full relative overflow-hidden rounded-lg">
              <img 
                src={imgStrategy} 
                alt="Observation Map Diagram" 
                className="w-full h-auto" 
                draggable="false"
              />
            </div>
          </div>
        </ElegantFade>
      </section>

      {/* ── 5. INSIGHT MAPPING ── */}
      <EditorialSection
        title="Insight Mapping"
        body=""
        images={[{ url: imgInsight, alt: 'Insight Mapping' }]}
        layoutVariant="visual-first"
        imageClassName="object-contain max-h-[500px]"
      />

      {/* ── 6. THEME MAPPING ── */}
      <EditorialSection
        title="Theme Mapping"
        body=""
        images={[{ url: imgTheme, alt: 'Theme Mapping' }]}
        layoutVariant="visual-first"
        imageClassName="object-contain max-h-[500px]"
      />

      {/* ── 7. DESIGNING THROUGH SCI ART ── */}
      <section className="w-full relative z-10 py-16 md:py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        
        {/* Intro Text */}
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
          <ElegantFade>
            <p className="text-white font-secondary text-[18px] md:text-[24px] leading-relaxed md:leading-[1.6]">
              Using our SciArt approach, we combined behavioural observations with creative exploration to understand how imagination shapes childhood experiences.
            </p>
          </ElegantFade>
        </div>

        {/* Standalone Star Gazer Image */}
        <ElegantFade delay={0.2} className="w-full flex justify-center mb-16 md:mb-24">
          <div className="w-full max-w-[1000px] bg-white rounded-xl shadow-2xl overflow-hidden p-6 md:p-10 border border-white/10">
            <img 
              src={imgStargazer} 
              alt="Star Gazer Sketch" 
              className="w-full h-auto object-contain drop-shadow-md" 
              draggable="false" 
            />
          </div>
        </ElegantFade>

        {/* 4-Image Sketches Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-6 md:gap-10">
            <ElegantFade delay={0.1}>
              <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden p-4 md:p-6 border border-white/10">
                <img src={imgSketch1} alt="Sketch 1" className="w-full h-auto object-contain drop-shadow-sm" draggable="false" />
              </div>
            </ElegantFade>
            <ElegantFade delay={0.3}>
              <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden p-4 md:p-6 border border-white/10">
                <img src={imgSketch3} alt="Sketch 3" className="w-full h-auto object-contain drop-shadow-sm" draggable="false" />
              </div>
            </ElegantFade>
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col gap-6 md:gap-10 md:pt-16">
            <ElegantFade delay={0.2}>
              <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden p-4 md:p-6 border border-white/10">
                <img src={imgSketch2} alt="Sketch 2" className="w-full h-auto object-contain drop-shadow-sm" draggable="false" />
              </div>
            </ElegantFade>
            <ElegantFade delay={0.4}>
              <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden p-4 md:p-6 border border-white/10">
                <img src={imgSketch4} alt="Sketch 4" className="w-full h-auto object-contain drop-shadow-sm" draggable="false" />
              </div>
            </ElegantFade>
          </div>
        </div>
      </section>

      {/* ── 8. UNIVERSE BREAKDOWN & ECOSYSTEM ── */}
      <section className="relative w-full z-10 py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          
          {/* Dreamer */}
          <div className="relative w-full flex flex-col items-center mb-24 md:mb-32">
            <ElegantFade className="z-20 w-full max-w-[800px] mx-auto mb-10 md:mb-14 text-center">
              <h2 className="text-white font-primary text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Dreamer, Stargazer & Stellar</h2>
              <p className="text-white/80 font-secondary text-[17px] md:text-[19px] leading-relaxed mb-10 md:mb-14">
                To translate the strategy into products, we created three distinct worlds within the lilFox universe.
              </p>
              <h3 className="text-white font-primary text-2xl md:text-3xl font-bold mb-4">Dreamer</h3>
              <p className="text-white/80 font-secondary text-[17px] md:text-[19px] leading-relaxed">
                A world of wonder, optimism, stars, clouds, and limitless imagination.
              </p>
            </ElegantFade>
            
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <ElegantFade delay={0.1}>
                <img src={imgDreamerLeft} alt="Dreamer visual 1" className="w-full h-auto object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]" draggable="false" />
              </ElegantFade>
              <ElegantFade delay={0.2}>
                <img src={imgDreamerRight} alt="Dreamer visual 2" className="w-full h-auto object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]" draggable="false" />
              </ElegantFade>
            </div>
          </div>

          {/* Stargazer */}
          <div className="relative w-full flex flex-col items-center mb-24 md:mb-32">
            <ElegantFade className="w-full max-w-[800px] mx-auto text-center mb-10 md:mb-14">
              <h3 className="text-white font-primary text-2xl md:text-3xl font-bold mb-4">Stargazer</h3>
              <p className="text-white/80 font-secondary text-[17px] md:text-[19px] leading-relaxed">
                A world inspired by curiosity, celestial discovery, and exploration.
              </p>
            </ElegantFade>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <ElegantFade delay={0.1}>
                <img src={imgStargazerLeft} alt="Stargazer visual 1" className="w-full h-auto object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]" draggable="false" />
              </ElegantFade>
              <ElegantFade delay={0.2}>
                <img src={imgStargazerRight} alt="Stargazer visual 2" className="w-full h-auto object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]" draggable="false" />
              </ElegantFade>
            </div>
          </div>

          {/* Stellar */}
          <div className="relative w-full flex flex-col items-center mb-24 md:mb-32">
            <ElegantFade className="w-full max-w-[800px] mx-auto text-center mb-10 md:mb-14">
              <h3 className="text-white font-primary text-2xl md:text-3xl font-bold mb-4">Stellar</h3>
              <p className="text-white/80 font-secondary text-[17px] md:text-[19px] leading-relaxed">
                A vibrant universe built around movement, adventure, and big dreams.
              </p>
            </ElegantFade>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <ElegantFade delay={0.1}>
                <img src={imgStellarLeft} alt="Stellar visual 1" className="w-full h-auto object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]" draggable="false" />
              </ElegantFade>
              <ElegantFade delay={0.2}>
                <img src={imgStellarRight} alt="Stellar visual 2" className="w-full h-auto object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]" draggable="false" />
              </ElegantFade>
            </div>
          </div>

          {/* Ecosystem */}
          <div className="relative w-full flex flex-col items-center">
            <ElegantFade className="w-full mb-10 md:mb-14 text-center">
              <div className="text-white font-primary text-2xl md:text-3xl font-bold leading-relaxed max-w-4xl mx-auto mb-6">
                <p>From bicycles to accessories, packaging, and future products, every element belonged to the same universe.</p>
              </div>
              <div className="text-white/80 font-secondary text-[17px] md:text-[19px] leading-relaxed space-y-4 max-w-4xl mx-auto">
                <p>The goal wasn't to sell bicycles.</p>
                <p>It was to create a platform for adventure.</p>
              </div>
            </ElegantFade>
            <div className="w-full flex flex-col items-center gap-6">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <ElegantFade delay={0.1}>
                  <img src={imgEcosystem1} alt="Ecosystem visual 1" className="w-full h-auto object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]" draggable="false" />
                </ElegantFade>
                <ElegantFade delay={0.2}>
                  <img src={imgEcosystem2} alt="Ecosystem visual 2" className="w-full h-auto object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]" draggable="false" />
                </ElegantFade>
              </div>
              <ElegantFade delay={0.3} className="w-full flex justify-center">
                <div className="w-full md:w-1/2">
                  <img src={imgEcosystem3} alt="Ecosystem visual 3" className="w-full h-auto object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]" draggable="false" />
                </div>
              </ElegantFade>
            </div>
          </div>

        </div>
      </section>

      {/* ── 10. OUTCOME ── */}
      <DramaticSection 
        title="Outcome: More Than a Bicycle"
        content={`What started as a graphics project became a scalable children's brand.\n\nA visual language.\n\nA storytelling framework.\n\nAn expandable ecosystem of products and experiences.\n\nMost importantly, it transformed the bicycle from a mobility product into a catalyst for imagination.\n\nFirefox came to us to design bicycles.\n\nWe helped create a world where imagination could ride along.`}
        motionGraphic={<ProblemGraphic />}
      />

      {/* ── GALLERY CAROUSEL ── */}
      {cmsMedia.length > 0 && (
        <section className="relative w-full z-10 overflow-hidden">
          <div className="pb-20 w-full relative">
            <ElegantFade className="mb-12 pb-6 px-6 md:px-12 max-w-[1400px] mx-auto">
              <h2 className="font-primary text-5xl md:text-7xl lg:text-8xl text-white tracking-tight">
                {project?.deliverablesHeading || 'Ecosystem Highlights'}
              </h2>
            </ElegantFade>
            <div className="w-full">
              <MediaRibbon3D media={cmsMedia} />
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <section className="pt-12 pb-20 px-6 md:px-12 text-center relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <ElegantFade>
            <p className="text-[17px] md:text-[19px] tracking-widest uppercase text-[#f5c240] mb-6 font-medium font-primary">{SITE_SETTINGS?.csBackToWork || 'Back to Portfolio'}</p>
            <motion.h2
              onClick={() => navigate('work')}
              className="font-primary text-5xl md:text-7xl lg:text-8xl text-white font-medium cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center gap-6"
            >
              <ArrowLeft className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" /> {SITE_SETTINGS?.csAllProjects || 'All Case Studies'}
            </motion.h2>
          </ElegantFade>
        </div>
      </section>
    </div>
  );
};

export default FirefoxExperience;
