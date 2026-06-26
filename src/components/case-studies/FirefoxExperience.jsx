import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GlobalContext } from '../../App';
import CaseStudyMedia, { normalizeMediaItems } from './CaseStudyMedia';
import MediaRibbon3D from './MediaRibbon3D';
import CaseStudySectorPill from './CaseStudySectorPill';

// Import all Firefox Flow Images
import observationMap from '../../assets/firefox/observation_map.png';
import insightMapping from '../../assets/firefox/insight_mapping.png';
import themeMapping from '../../assets/firefox/theme_mapping.png';
import starGazerSketch from '../../assets/firefox/star_gazer_sketch.png';
import sketchesCollage from '../../assets/firefox/sketches_collage.png';
import dreamerBikes from '../../assets/firefox/dreamer_bikes.png';
import stargazerBikes from '../../assets/firefox/stargazer_bikes.png';
import stellarBikes from '../../assets/firefox/stellar_bikes.png';
import ecosystemImage from '../../assets/firefox/ecosystem.png';
import lifestyleGrid from '../../assets/firefox/lifestyle_grid.png';

/* ── Arise Visual DNA (palette, utilities) ─────────────────────────── */
const palette = {
  bgDeep: '#010d54',
  panel: '#0c185c',
  primary: '#6865fa',
  secondary: '#d4cefc',
  text: '#F4F4F5',
};

/* Ambient background glows — identical to Arise */
const ChicAmbientBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div
      animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen blur-[120px]"
      style={{ background: `radial-gradient(circle, ${palette.primary}40 0%, transparent 60%)` }}
    />
    <motion.div
      animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen blur-[120px]"
      style={{ background: `radial-gradient(circle, ${palette.secondary}30 0%, transparent 60%)` }}
    />
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
      className={`w-full relative group overflow-hidden bg-[#0c185c]/40 flex items-center justify-center rounded-[2rem] shadow-xl ring-1 ring-white/10 ${className}`}
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
      <div className="absolute inset-0 bg-[#0C185C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-overlay pointer-events-none" />
    </motion.div>
  );
};

/* ── Section Title — consistent typographic hierarchy ────────────── */
const SectionTitle = ({ children, label, className = '' }) => (
  <ElegantFade className={className}>
    {label && (
      <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full bg-[#D4CEFC]/10 text-[#D4CEFC] text-[15px] md:text-[17px] font-bold tracking-widest uppercase backdrop-blur-md font-primary">
        <span className="w-2 h-2 rounded-full bg-[#D4CEFC] animate-pulse shadow-[0_0_10px_#D4CEFC]" />
        {label}
      </div>
    )}
    <motion.h2
      animate={{ backgroundPosition: ['200% center', '-200% center'] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      className="font-primary text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(104,101,250,0.3)]"
      style={{
        backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #6865FA 45%, #D4CEFC 50%, #6865FA 55%, #FFFFFF 70%, #FFFFFF 100%)',
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
          <div className={`grid gap-6 md:gap-8 ${images.length === 1 ? 'grid-cols-1 max-w-5xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
            {images.map((img, i) => (
              <ElegantFade key={img?._key || img?.url || i} delay={i * 0.1}>
                <ParallaxImage
                  src={img?.url}
                  item={img?.url ? img : undefined}
                  alt={img?.alt || `Section image ${i + 1}`}
                  yOffset={15}
                  imageClassName={imageClassName}
                />
              </ElegantFade>
            ))}
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

/* ── Universe Card — alternating text/image blocks ────────────────── */
const UniverseCard = ({ title, description, imageUrl, index }) => {
  const isReversed = index % 2 !== 0;

  return (
    <ElegantFade className="mb-16 md:mb-24 last:mb-0">
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center ${isReversed ? 'lg:direction-rtl' : ''}`}>
        <div className={`lg:col-span-5 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
          <motion.h3
            className="font-primary text-3xl md:text-5xl text-white mb-6 font-medium tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {title}
          </motion.h3>
          {description && (
            <p className="text-white/85 font-normal text-[17px] md:text-[19px] leading-relaxed font-secondary">
              {description}
            </p>
          )}
        </div>
        <div className={`lg:col-span-7 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
          {imageUrl && (
            <ParallaxImage src={imageUrl} alt={title} yOffset={20} imageClassName="object-contain max-h-[600px] w-auto mx-auto" className="bg-transparent shadow-none ring-0" />
          )}
        </div>
      </div>
    </ElegantFade>
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

  return (
    <div className="w-full min-h-screen font-secondary selection:bg-[#6865FA] selection:text-white" style={{ backgroundColor: palette.bgDeep, color: palette.text }}>
      <ChicAmbientBackground />

      {/* Navigation */}
      <div className="fixed top-0 left-0 w-full z-50 px-6 pt-28 pb-6 md:px-12 md:pt-32 md:pb-8 flex items-center gap-3 pointer-events-none">
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2 text-[17px] md:text-[19px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>

      {/* ── 1. HERO ── */}
      <section className="relative w-full flex flex-col items-center justify-start z-10 pb-16 md:pb-20 pt-10 px-4 md:px-8">
        <div
          className="relative w-full max-w-[95vw] md:max-w-7xl mx-auto rounded-[30px] md:rounded-[50px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
          style={{ aspectRatio: heroAspectRatio }}
        >
          {heroImg ? (
            <CaseStudyMedia src={heroImg} alt={`${project?.client || 'Firefox'} Banner`} className="w-full h-full object-cover" priority sizes="(min-width: 1280px) 1280px, 95vw" />
          ) : (
            <div className="w-full h-full bg-[#0C185C]" />
          )}
          <CaseStudySectorPill
            sector={project?.sector}
            className="absolute left-5 top-5 z-20 border border-white/15 bg-black/35 text-white/85 shadow-[0_14px_40px_rgba(0,0,0,0.25)] backdrop-blur-md md:left-8 md:top-8"
          />
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
                backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #D4CEFC 45%, #6865FA 50%, #D4CEFC 55%, #FFFFFF 70%, #FFFFFF 100%)',
                backgroundSize: '300% auto',
              }}
            >
              {project?.client || 'Firefox × lilFox'}
            </motion.h1>
          </ElegantFade>
        </div>
      </section>

      {/* ── 2. INTRO ── */}
      <EditorialSection
        title="Designing for Untamed Imaginations"
        body={`Firefox approached us to design graphics for a new range of children's bicycles. The brief sounded simple. The opportunity wasn't.\n\nAs we explored the category, we realised children don't experience bicycles the way adults do. Adults see products. Children see possibilities. A bicycle can become a spaceship, a dragon rider, a superhero vehicle, or a ticket to another world.\n\nThat insight transformed the project.\n\nWhat began as a graphics assignment evolved into the creation of lilFox, a children's brand built around imagination, storytelling, and adventure.`}
        images={[]}
      />

      {/* ── 3. CHALLENGE ── */}
      <EditorialSection
        title="Creating the lilFox Universe"
        body={`Rather than designing a product range under Firefox, we set out to create a world with its own personality, language, and visual identity.\n\nThis led to the creation of lilFox as a standalone children's brand where imagination became the organising principle behind every touchpoint.\n\nFrom bicycles to accessories, packaging, and future products, every element belonged to the same universe.\n\nThe goal wasn't to sell bicycles.\n\nIt was to create a platform for adventure.`}
        images={[]}
      />

      {/* ── 4. STRATEGY ── */}
      <EditorialSection
        title="Our Creative Strategy"
        label="Strategy"
        body={`Our research revealed that bicycles play a very different role in a child's life.\n\nIt wasn't just a vehicle to get from point A to B.\n\nIt was something they imagined through.`}
        images={[{ url: observationMap, alt: 'Observation Map' }]}
        imageClassName="object-contain max-h-[500px]"
      />

      {/* ── 5. INSIGHT MAPPING ── */}
      <EditorialSection
        title="Insight Mapping"
        body=""
        images={[{ url: insightMapping, alt: 'Insight Mapping' }]}
        layoutVariant="visual-first"
        imageClassName="object-contain max-h-[500px]"
      />

      {/* ── 6. THEME MAPPING ── */}
      <EditorialSection
        title="Theme Mapping"
        body=""
        images={[{ url: themeMapping, alt: 'Theme Mapping' }]}
        layoutVariant="visual-first"
        imageClassName="object-contain max-h-[500px]"
      />

      {/* ── 7. SCIART ── */}
      <EditorialSection
        title="Designing Through SciArt"
        body={`At PBH, we call our approach SciArt.\n\nFor lilFox, that meant combining observation with imagination.\n\nWe studied how children interact with objects, how they create stories, how curiosity develops, and how fantasy becomes a tool for understanding the world.\n\nEvery concept had to work within real manufacturing constraints, frame geometries, production requirements, and decal placement limitations.\n\nThrough multiple iterations, we developed graphic systems that balanced storytelling with practicality.\n\nThe same thinking extended beyond the bicycle itself into accessories, packaging, manuals, merchandise, and future product concepts, creating a cohesive experience across the entire ecosystem.`}
        images={[
          { url: starGazerSketch, alt: 'Star Gazer Sketch' },
          { url: sketchesCollage, alt: 'Sketches Collage' }
        ]}
        imageClassName="object-contain max-h-[400px]"
      />

      {/* ── 8. UNIVERSE BREAKDOWN ── */}
      <section className="relative w-full z-10">
        <div className="py-12 md:py-20 px-6 md:px-12 max-w-[1400px] mx-auto">
          <SectionTitle label="The Universe" className="mb-8 md:mb-10">Dreamer, Stargazer & Stellar</SectionTitle>
          <div className="mb-16">
            <p className="text-white/90 font-normal text-[17px] md:text-[19px] leading-relaxed font-secondary max-w-4xl">
              To translate the strategy into products, we created three distinct worlds within the lilFox universe.
            </p>
          </div>
          
          <div className="space-y-12">
            <UniverseCard
              title="Dreamer"
              description="A world of wonder, optimism, stars, clouds, and limitless imagination."
              imageUrl={dreamerBikes}
              index={0}
            />
            <UniverseCard
              title="Stargazer"
              description="A world inspired by curiosity, celestial discovery, and exploration."
              imageUrl={stargazerBikes}
              index={1}
            />
            <UniverseCard
              title="Stellar"
              description="A vibrant universe built around movement, adventure, and big dreams."
              imageUrl={stellarBikes}
              index={2}
            />
          </div>
        </div>
      </section>

      {/* ── 9. ECOSYSTEM ── */}
      <EditorialSection
        title=""
        body=""
        images={[{ url: ecosystemImage, alt: 'Ecosystem accessories and packaging' }]}
        layoutVariant="visual-first"
        imageClassName="object-contain max-h-[600px]"
      />

      {/* ── 10. OUTCOME ── */}
      <EditorialSection
        title="Outcome: More Than a Bicycle"
        label="Impact"
        body={`What started as a graphics project became a scalable children's brand.\n\nA visual language.\n\nA storytelling framework.\n\nAn expandable ecosystem of products and experiences.\n\nMost importantly, it transformed the bicycle from a mobility product into a catalyst for imagination.\n\nFirefox came to us to design bicycles.\n\nWe helped create a world where imagination could ride along.`}
        images={[{ url: lifestyleGrid, alt: 'Kids enjoying the bicycles' }]}
        imageClassName="object-contain max-h-[500px]"
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
            <p className="text-[17px] md:text-[19px] tracking-widest uppercase text-[#D4CEFC] mb-6 font-medium font-primary">{SITE_SETTINGS?.csBackToWork || 'Back to Portfolio'}</p>
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

