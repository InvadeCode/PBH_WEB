import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ArrowLeft } from 'lucide-react';

const LeverageEduExperience = ({ project, onBack }) => {
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lock body scroll when video is fullscreen
  useEffect(() => {
    if (videoOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [videoOpen]);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ backgroundColor: '#FFA8DF' }}>
      
      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-0 left-0 w-full z-50 p-6 md:p-10"
      >
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 text-sm tracking-widest uppercase hover:opacity-70 transition-opacity text-[#2D2D2D]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </motion.div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* HERO: Typography Video Section — "Leverage"        */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        
        {/* Typography Background: "lev [video] rage" */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">

          {/* Outline 'L' — far left, faded */}
          <span 
            className="absolute text-[18vw] md:text-[22vw] lg:text-[25vw] font-black leading-none lowercase"
            style={{ 
              left: '-3vw',
              fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
              WebkitTextStroke: '2px rgba(45, 45, 45, 0.2)', 
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.04em'
            }}
          >
            l
          </span>

          {/* Solid 'ev' */}
          <span 
            className="absolute text-[18vw] md:text-[22vw] lg:text-[25vw] font-black leading-none text-[#2D2D2D] lowercase"
            style={{ 
              left: '8vw',
              fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
              letterSpacing: '-0.04em'
            }}
          >
            ev
          </span>

          {/* Solid 'rage' — right of video */}
          <span 
            className="absolute text-[18vw] md:text-[22vw] lg:text-[25vw] font-black leading-none text-[#2D2D2D] lowercase"
            style={{ 
              right: '-1vw',
              fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
              letterSpacing: '-0.04em'
            }}
          >
            rage
          </span>
        </div>

        {/* ── Circular Video Thumbnail (replaces the "e") ── */}
        <motion.div 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] md:w-[28vw] md:h-[28vw] md:max-w-[480px] md:max-h-[480px] rounded-full overflow-hidden shadow-2xl group cursor-pointer"
          onClick={() => setVideoOpen(true)}
          style={{ border: '4px solid rgba(45, 45, 45, 0.08)' }}
        >
          {/* Thumbnail */}
          <img 
            src={project?.bannerImage || '/clients/logos/leverage_edu/8_leverage.png'} 
            alt="Video Cover" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-500" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-black/60">
              <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="white" />
            </div>
          </div>
        </motion.div>

        {/* ── "Meet" Annotation (Bottom-Left) ── */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute bottom-16 md:bottom-24 left-8 md:left-20 z-20"
        >
          <div className="relative inline-block mb-3">
            <span 
              className="uppercase text-sm md:text-base tracking-[0.15em] font-medium text-[#2D2D2D] relative z-10 px-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Meet
            </span>
            {/* Hand-drawn SVG oval */}
            <svg 
              className="absolute -inset-x-2 -inset-y-1 w-[calc(100%+16px)] h-[calc(100%+8px)] overflow-visible" 
              viewBox="0 0 120 50" 
              preserveAspectRatio="none"
            >
              <ellipse 
                cx="60" cy="25" rx="55" ry="20" 
                fill="none" 
                stroke="#2D2D2D" 
                strokeWidth="1.2"
                className="opacity-60"
                style={{ 
                  strokeDasharray: "4 3",
                  transform: "rotate(-2deg)",
                  transformOrigin: "center"
                }}
              />
            </svg>
          </div>
          <div className="mt-3">
            <p className="font-bold text-xl md:text-2xl leading-tight text-[#2D2D2D]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Leverage Edu
            </p>
            <p className="font-normal text-sm md:text-base text-[#2D2D2D]/70 leading-tight mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              EdTech Brand Transformation
            </p>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* FULLSCREEN VIDEO OVERLAY                           */}
      {/* ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100000] bg-black flex items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-6 right-6 md:top-10 md:right-10 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Fullscreen Video Player */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-[95vw] h-[85vh] md:w-[90vw] md:h-[80vh] max-w-[1600px]"
            >
              <iframe
                className="w-full h-full rounded-2xl"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1&modestbranding=1&rel=0"
                title="Leverage Edu Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 'none' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════ */}
      {/* CONTENT SECTION                                    */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-8 md:px-24 bg-white min-h-[60vh]">
        <motion.div 
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-4xl md:text-6xl font-light mb-12 text-black tracking-tight"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            The Approach
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light mb-16"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {project?.challenge || "When an established educational platform requires a completely refined narrative, the approach must center on clarity, authority, and deeply empathetic storytelling."}
          </motion.p>

          <motion.div variants={fadeIn} className="grid md:grid-cols-3 gap-12 border-t border-gray-200 pt-16">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 font-medium">Sector</h4>
              <p className="text-lg text-black font-medium">{project?.sector || "EdTech"}</p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 font-medium">Scope</h4>
              <div className="flex flex-wrap gap-2">
                {(project?.tags || ["Brand Identity", "Visual Narrative"]).map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full border border-gray-300 text-xs text-gray-600 uppercase tracking-wider">{tag}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 font-medium">Client</h4>
              <p className="text-lg text-black font-medium">{project?.client || "Leverage Edu"}</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Back to Work CTA */}
      <section className="py-20 px-8 md:px-24 bg-[#0A0A0A] text-center">
        <h3 className="text-3xl md:text-4xl font-light text-white mb-8 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
          See more work
        </h3>
        <button 
          onClick={onBack}
          className="px-8 py-4 border border-white/20 rounded-full text-white/70 hover:text-white hover:border-white/50 transition-all text-sm uppercase tracking-widest"
        >
          All Projects
        </button>
      </section>
    </div>
  );
};

export { LeverageEduExperience };
