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

// --- SCENE 3: THE STORYLINE GALLERY ---
const CreeperImage = ({ img, index }) => {
  const ref = useRef(null);
  
  // Trigger animation seamlessly when image enters viewport
  const isInView = useInView(ref, { margin: "-20%", once: true });

  // Keep a subtle vertical parallax tied to scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const yOffset = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className={`w-full flex ${isLeft ? 'justify-start' : 'justify-end'} mb-48`}>
      <motion.div 
        style={{ y: yOffset }}
        className="w-[90%] md:w-[85%] max-w-5xl relative"
      >
        <motion.div 
          initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
          animate={isInView ? { clipPath: "circle(150% at 50% 50%)", opacity: 1 } : { clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden bg-black/40"
        >
          <motion.img 
            initial={{ scale: 1.4 }}
            animate={isInView ? { scale: 1 } : { scale: 1.4 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
            src={img} 
            className="w-full h-auto object-contain block origin-center" 
            alt={`Gallery ${index}`} 
          />
        </motion.div>
        
        {/* Decorative golden path dot next to the center line */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? '-right-6 md:-right-12' : '-left-6 md:-left-12'} w-3 h-3 rounded-full bg-[#B35D30] shadow-[0_0_20px_#B35D30] z-20`} 
        />
        
        {/* Horizontal Storyline Connecting String to the Center */}
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{ originX: isLeft ? 1 : 0 }}
          className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'left-[100%]' : 'right-[100%]'} h-[2px] w-[50vw] pointer-events-none z-0 ${isLeft ? 'bg-gradient-to-r from-[#B35D30]/80 to-transparent' : 'bg-gradient-to-l from-[#B35D30]/80 to-transparent'} shadow-[0_0_10px_#B35D30]`} 
        />
      </motion.div>
    </div>
  );
};

const RootLine = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  return (
    <div ref={ref} className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 z-0 opacity-80 pointer-events-none">
      <motion.div 
        className="w-full bg-gradient-to-b from-[#B35D30]/0 via-[#B35D30] to-[#B35D30]/0 shadow-[0_0_15px_#B35D30]"
        style={{ height: "100%", scaleY: scrollYProgress, transformOrigin: "top" }}
      />
    </div>
  );
};

const Scene3CreeperGallery = ({ images }) => {
  if (!images || images.length === 0) return null;
  return (
    <section className="py-24 px-[5%] max-w-7xl mx-auto relative overflow-hidden">
      
      <RootLine />
      
      {images.map((img, i) => (
        <CreeperImage key={i} img={img} index={i} />
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
