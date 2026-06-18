import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';

const C = {
  bg: '#F7F7F7', text: '#111111', textMuted: '#666666',
  card: '#FFFFFF', accent: '#E8E8E8', highlight: '#000000'
};

const imageFrom = (item) => (typeof item === 'string' ? item : item?.url || item?.imageUrl);

/* ── Char Reveal (Elegant staggered typography) ────────── */
const CharReveal = ({ text, delay = 0, stagger = 0.04, dur = 0.8, inView = false, className = '' }) => {
  let ci = 0;
  return (
    <span className={`inline-flex flex-wrap justify-center ${className}`}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="mr-[0.25em] inline-flex whitespace-nowrap last:mr-0">
          {word.split('').map((ch, i) => {
            const idx = ci++;
            return (
              <span key={i} className="inline-block overflow-hidden" style={{ verticalAlign: 'bottom', lineHeight: 'inherit' }}>
                <motion.span className="inline-block" 
                  initial={{ y: '110%', rotate: 5, opacity: 0 }}
                  {...(inView ? { whileInView: { y: 0, rotate: 0, opacity: 1 }, viewport: { once: true, amount: 0.2 } } : { animate: { y: 0, rotate: 0, opacity: 1 } })}
                  transition={{ duration: dur, delay: delay + idx * stagger, ease: [0.16, 1, 0.3, 1] }}>{ch}</motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

/* ── Main Component ────────────────────────────────────── */
const AriseVenturesExperience = ({ navigate, project }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const cardRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const bannerY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);

  const bannerImg = project?.bannerImage ? imageFrom(project.bannerImage) : null;
  const allImages = [
    project?.fullStory?.heroImg ? imageFrom(project.fullStory.heroImg) : null,
    ...(project?.fullStory?.images || [])
  ].map(imageFrom).filter(Boolean);
  
  const heroImg1 = allImages[0];
  const heroImg2 = allImages[1];

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const toggleGallery = () => {
    setIsGalleryOpen(!isGalleryOpen);
    if (!isGalleryOpen) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="w-full min-h-screen selection:bg-black selection:text-white font-secondary relative" style={{ backgroundColor: C.bg }}>
      
      {/* Background Banner */}
      {bannerImg && (
        <div className="absolute top-0 left-0 right-0 h-[80vh] z-0 overflow-hidden pointer-events-none">
          <motion.img 
            src={bannerImg} 
            className="w-full h-full object-cover" 
            style={{ y: bannerY }}
            alt="Background Banner"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(247,247,247,0.4) 50%, #F7F7F7 100%)' }} />
        </div>
      )}

      {/* Navigation */}
      <div className="relative z-50 flex justify-between items-center px-[4%] py-8 pointer-events-none">
        <motion.button 
          onClick={() => navigate('work')} 
          className="pointer-events-auto flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-medium transition-opacity"
          style={{ color: bannerImg ? '#111' : '#111' }}
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ArrowLeft className="w-4 h-4" /> Work
        </motion.button>
        <motion.div 
          className="text-xs uppercase tracking-[0.2em] font-medium"
          style={{ color: bannerImg ? 'rgba(17,17,17,0.6)' : '#666' }}
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
        >
          Case Study / 01
        </motion.div>
      </div>

      {/* Hero Title */}
      <section className="relative z-10 pt-20 md:pt-32 px-[4%] text-center mix-blend-multiply">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
          <h1 className="font-primary text-[#111] leading-[0.9] tracking-tight mx-auto max-w-[90vw]" style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}>
            <CharReveal text={project?.client || 'Arise Ventures'} delay={0.1} />
          </h1>
        </motion.div>
      </section>

      {/* Sleek Media Card - Acts as the Gallery Container */}
      <section className="relative z-10 px-[2%] md:px-[4%] mt-12 mb-16" ref={cardRef}>
        <motion.div 
          layout
          className="bg-white rounded-[2rem] md:rounded-[3rem] p-4 md:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] mx-auto max-w-[1200px] overflow-hidden"
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {!isGalleryOpen ? (
              <motion.div 
                key="hero-view"
                initial={{ opacity: 0, filter: 'blur(10px)' }} 
                animate={{ opacity: 1, filter: 'blur(0px)' }} 
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 md:gap-6"
              >
                {heroImg1 && (
                  <div className="w-full h-[40vh] md:h-[60vh] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden relative group">
                    <motion.img 
                      src={heroImg1} 
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                )}
                {heroImg2 && (
                  <div className="w-full h-[30vh] md:h-[40vh] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative group">
                    <motion.img 
                      src={heroImg2} 
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="grid-view"
                initial={{ opacity: 0, filter: 'blur(10px)' }} 
                animate={{ opacity: 1, filter: 'blur(0px)' }} 
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-8 mt-4 px-4 text-center">
                  <h3 className="text-3xl font-primary text-[#111] mb-2">Visual Gallery</h3>
                  <p className="text-[#666] text-sm">See the highlights of this project</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {allImages.map((img, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer relative shadow-sm"
                    >
                      <motion.img 
                        src={img} 
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Explore/Close Gallery Button */}
          <div onClick={toggleGallery} className="flex justify-between items-center mt-6 md:mt-8 px-4 pb-2 group cursor-pointer border-t border-gray-100 pt-6">
            <span className="text-sm md:text-base font-medium text-[#111]">
              {isGalleryOpen ? 'Close gallery' : 'Explore the gallery'}
            </span>
            <motion.div 
              layout
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#111]"
              whileHover={{ scale: 1.1, backgroundColor: '#111', color: '#fff' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {isGalleryOpen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Metadata Grid */}
      <section className="relative z-10 px-[4%] max-w-[1200px] mx-auto mb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h4 className="text-sm text-[#666] mb-3">Program</h4>
            <p className="text-lg md:text-xl text-[#111] font-medium leading-tight">{project?.route || 'Expansion, Brand Creation'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} delay={0.1}>
            <h4 className="text-sm text-[#666] mb-3">Industry</h4>
            <p className="text-lg md:text-xl text-[#111] font-medium leading-tight">{project?.sector || 'Real Estate'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} delay={0.2} className="col-span-2 md:col-span-1">
            <h4 className="text-sm text-[#666] mb-3">Stage</h4>
            <p className="text-lg md:text-xl text-[#111] font-medium leading-tight">Enterprise</p>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AriseVenturesExperience;
