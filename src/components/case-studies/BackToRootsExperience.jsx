import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionTemplate } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// --- SCENE 1: THE THRESHOLD (SPLIT DOORS) ---
const Scene1Threshold = ({ project, navigate }) => {
  const heroImage = project.bannerImage || project.fullStory?.heroImg || project.imageUrl;

  return (
    <section className="h-screen relative overflow-hidden flex items-center justify-center">
        
        {/* The banner image taking up the entire screen */}
        <div className="absolute inset-0 z-0 bg-[#1A0F0A] flex items-center justify-center">
          {heroImage && (
            <img 
              src={heroImage} 
              alt="Hero" 
              className="w-full h-full object-cover" 
            />
          )}
        </div>

        {/* Top Door */}
        <motion.div 
          animate={{ y: ["0%", "0%", "-100%", "-100%", "0%", "0%"] }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.1, 0.35, 0.65, 0.9, 1]
          }}
          className="absolute top-0 left-0 right-0 h-1/2 bg-[#1A0F0A] z-10 overflow-hidden border-b border-[#F5E6C8]/10 flex items-end justify-center pointer-events-none"
        >
          <div className="absolute top-8 left-[3%] text-[#F5E6C8]/60 flex items-center gap-2 text-sm transition-colors font-secondary pointer-events-auto z-50">
            <button onClick={() => navigate('work')} className="hover:text-[#F5E6C8] flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
          
          <h1 className="font-serif text-[#B35D30] text-7xl md:text-[10rem] tracking-[0.2em] leading-none translate-y-[50%] drop-shadow-xl">
            {(project.client || "BACK TO ROOTS").toUpperCase()}
          </h1>
        </motion.div>

        {/* Bottom Door */}
        <motion.div 
          animate={{ y: ["0%", "0%", "100%", "100%", "0%", "0%"] }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.1, 0.35, 0.65, 0.9, 1]
          }}
          className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#1A0F0A] z-10 overflow-hidden border-t border-[#F5E6C8]/10 flex items-start justify-center pointer-events-none"
        >
          <h1 className="font-serif text-[#B35D30] text-7xl md:text-[10rem] tracking-[0.2em] leading-none -translate-y-[50%] drop-shadow-xl">
            {(project.client || "BACK TO ROOTS").toUpperCase()}
          </h1>
        </motion.div>

    </section>
  );
};

// --- SCENE 2: THE STORY TEXT ---
const Scene2StoryText = ({ project }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10%", once: true });

  return (
    <section ref={ref} className="py-32 px-[5%] w-full max-w-7xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-16 text-[#F5E6C8]"
      >
        {/* Left Column */}
        <div className="flex flex-col gap-12">
          {project.overview && (
            <div>
              <h3 className="text-xl md:text-2xl font-serif text-[#B35D30] mb-6">About the Brand</h3>
              <p className="text-base md:text-lg leading-relaxed text-white/70 font-secondary whitespace-pre-line">
                {project.overview}
              </p>
            </div>
          )}
          {project.challenge && (
            <div>
              <h3 className="text-xl md:text-2xl font-serif text-[#B35D30] mb-6">Problem Statement</h3>
              <p className="text-base md:text-lg leading-relaxed text-white/70 font-secondary whitespace-pre-line">
                {project.challenge}
              </p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {project.solution && (
            <div className="md:sticky md:top-32">
              <h3 className="text-xl md:text-2xl font-serif text-[#B35D30] mb-6">Creative Solution</h3>
              <p className="text-base md:text-lg leading-relaxed text-white/70 font-secondary whitespace-pre-line">
                {project.solution}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

// --- SCENE 2B: EXECUTION QUOTE ---
const Scene2bExecution = ({ project }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%", once: true });

  if (!project.fullStory?.execution) return null;

  return (
    <section ref={ref} className="py-24 px-[5%] w-full relative flex flex-col items-center justify-center z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center max-w-5xl bg-black/20 p-12 md:p-20 rounded-2xl border border-[#B35D30]/20 shadow-2xl backdrop-blur-sm"
      >
        <p className="text-2xl md:text-4xl text-[#B35D30] font-serif leading-snug">
          {project.fullStory.execution}
        </p>
      </motion.div>
    </section>
  );
};

// --- SCENE 3: THE STORYTELLING GALLERY ---

// A single gallery "moment" — each image gets a unique cinematic treatment
const StoryMoment = ({ img, index, total }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-15%", once: true });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 0.2, 0.2, 0.6]);

  // Every 3rd image is a full-bleed hero moment, others alternate asymmetric
  const layoutPattern = index % 5;
  const isHeroMoment = layoutPattern === 0;
  const isLeftLean = layoutPattern === 1 || layoutPattern === 3;
  const isRightLean = layoutPattern === 2 || layoutPattern === 4;

  const chapterNum = String(index + 1).padStart(2, '0');

  if (isHeroMoment) {
    // FULL-BLEED CINEMATIC HERO MOMENT
    return (
      <div ref={ref} className="w-full relative mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[70vh] md:h-[85vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)] border border-white/5"
        >
          <motion.img
            src={img}
            alt={`Story moment ${chapterNum}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ scale: imgScale, y: yParallax }}
          />
          {/* Dark vignette overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-[#1E120D] via-transparent to-[#1E120D]/40"
            style={{ opacity: overlayOpacity }}
          />
          {/* Chapter marker */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10"
          >
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#B35D30] font-bold"
              style={{ fontFamily: '"Carla", serif' }}>
              Chapter {chapterNum}
            </span>
            <div className="w-12 h-[2px] bg-[#B35D30]/60 mt-3" />
          </motion.div>
          {/* Progress indicator */}
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10 text-[#F5E6C8]/30 text-xs tracking-widest font-light">
            {chapterNum} / {String(total).padStart(2, '0')}
          </div>
        </motion.div>
      </div>
    );
  }

  // ASYMMETRIC EDITORIAL LAYOUT — alternating left/right lean
  return (
    <div
      ref={ref}
      className={`w-full flex ${isLeftLean ? 'justify-start' : 'justify-end'} mb-8`}
    >
      <motion.div
        initial={{ opacity: 0, x: isLeftLean ? -60 : 60, rotateY: isLeftLean ? 5 : -5 }}
        animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-[88%] md:w-[70%] relative group"
        style={{ perspective: '1200px' }}
      >
        <div className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/5">
          <motion.img
            src={img}
            alt={`Story moment ${chapterNum}`}
            className="w-full h-auto object-contain block"
            style={{ scale: imgScale }}
          />
          {/* Subtle hover glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E120D]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>

        {/* Floating chapter tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={`absolute -top-4 ${isLeftLean ? '-right-3 md:-right-6' : '-left-3 md:-left-6'} z-20`}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1E120D] border border-[#B35D30]/40 flex items-center justify-center shadow-[0_0_30px_rgba(179,93,48,0.3)]">
            <span className="text-[#B35D30] text-[10px] md:text-xs font-bold tracking-wider">{chapterNum}</span>
          </div>
        </motion.div>

        {/* Connecting storyline thread */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: isLeftLean ? 'right' : 'left' }}
          className={`absolute top-1/2 -translate-y-1/2 ${isLeftLean ? 'left-full ml-2' : 'right-full mr-2'} h-[1px] w-[30vw] pointer-events-none ${isLeftLean ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-[#B35D30]/50 to-transparent`}
        />
      </motion.div>
    </div>
  );
};

// Quote interstitial between gallery images
const StoryInterstitial = ({ text, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%", once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex items-center justify-center py-16 md:py-24 my-4"
    >
      <div className="max-w-2xl text-center px-8">
        <div className="w-8 h-[1px] bg-[#B35D30]/40 mx-auto mb-6" />
        <p className="text-[#F5E6C8]/50 text-sm md:text-base font-serif italic leading-relaxed tracking-wide">
          {text}
        </p>
        <div className="w-8 h-[1px] bg-[#B35D30]/40 mx-auto mt-6" />
      </div>
    </motion.div>
  );
};

const Scene3CreeperGallery = ({ images }) => {
  if (!images || images.length === 0) return null;

  const interstitials = [
    "Where tradition meets transformation.",
    "Every frame tells a deeper story.",
    "The art of visual identity, reimagined.",
    "Rooted in heritage, reaching for tomorrow.",
    "Crafting narratives that endure.",
  ];

  return (
    <section className="py-24 px-[3%] md:px-[5%] max-w-[1400px] mx-auto relative overflow-hidden" style={{ backgroundColor: '#1E120D' }}>
      
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.2 }}
        className="text-center mb-20 md:mb-28"
      >
        <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#B35D30] font-bold block mb-4">The Visual Journey</span>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#F5E6C8] tracking-tight leading-[1.1]">
          A Story in Frames
        </h2>
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#B35D30] to-transparent mx-auto mt-8" />
      </motion.div>

      {/* The storytelling gallery flow */}
      {images.map((img, i) => (
        <React.Fragment key={i}>
          <StoryMoment img={img} index={i} total={images.length} />
          {/* Insert interstitial quote between images (not after the last one) */}
          {i < images.length - 1 && i % 2 === 0 && (
            <StoryInterstitial 
              text={interstitials[Math.floor(i / 2) % interstitials.length]} 
              index={i} 
            />
          )}
        </React.Fragment>
      ))}
    </section>
  );
};

// --- SCENE 4: THE ARRIVAL ---
const Scene4Arrival = ({ project }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "center center"]
  });

  const backgroundColor = useTransform(scrollYProgress, [0, 1], ['#1E120D', '#F5E6C8']);
  const textColor = useTransform(scrollYProgress, [0, 1], ['#F4F4F5', '#2A1810']);
  
  return (
    <motion.section 
      ref={containerRef}
      style={{ backgroundColor }}
      className="py-48 px-[5%] w-full flex flex-col items-center justify-center min-h-screen transition-colors duration-1000"
    >
      <div className="max-w-4xl mx-auto text-center relative z-20 mb-32">
        <motion.h2 
          style={{ color: textColor }}
          className="text-4xl md:text-7xl font-serif leading-snug drop-shadow-sm"
        >
          A journey completed, a story eternal.
        </motion.h2>
      </div>

      <motion.div 
        style={{ color: textColor }}
        className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl mx-auto text-center border-t border-current/20 pt-16"
      >
        <div>
          <h4 className="text-xs uppercase tracking-widest opacity-60 mb-2 font-primary">Client</h4>
          <p className="text-2xl font-serif">{project.client}</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest opacity-60 mb-2 font-primary">Route</h4>
          <p className="text-2xl font-serif">{project.route}</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest opacity-60 mb-2 font-primary">Roles</h4>
          <p className="text-2xl font-serif">Branding · Storytelling</p>
        </div>
      </motion.div>
      
      <motion.button 
        style={{ color: textColor, borderColor: textColor }}
        className="mt-32 px-8 py-3 rounded-full border border-current hover:bg-current hover:text-[#F5E6C8] transition-colors uppercase tracking-widest text-xs font-primary font-bold"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ← Back to the World
      </motion.button>
    </motion.section>
  );
};

const BackToRootsExperience = ({ navigate, project }) => {
  return (
    <div className="min-h-screen w-full font-secondary relative bg-[#1E120D]">
      {/* Global Background Image covering the entire screen */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/realistic_roots_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10">
        <Scene1Threshold project={project} navigate={navigate} />
        <Scene2StoryText project={project} />
        <Scene2bExecution project={project} />
        <Scene3CreeperGallery images={project.fullStory?.images || []} />
        <Scene4Arrival project={project} />
      </div>
    </div>
  );
};

export default BackToRootsExperience;
