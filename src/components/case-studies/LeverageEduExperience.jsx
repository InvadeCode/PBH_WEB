import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowLeft } from 'lucide-react';

const LeverageEduExperience = ({ project, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePlayClick = () => {
    setIsPlaying(true);
    // If using a real video element, auto-play it
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  // Framer motion variants
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
      
      {/* Navigation / Back Button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-0 left-0 w-full z-50 p-6 md:p-10 flex justify-between items-center"
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

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO: The Typography Video Section (Monk Layout)       */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        
        {/* Massive Typography Background Layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          {/* We position the letters so the circular video sits where "o" would be */}
          
          {/* Left outline letter - faded */}
          <span 
            className="absolute text-[20vw] md:text-[25vw] lg:text-[28vw] font-black leading-none"
            style={{ 
              left: '-2vw',
              fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
              WebkitTextStroke: '2px rgba(45, 45, 45, 0.2)', 
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em'
            }}
          >
            e
          </span>

          {/* Solid 'm' */}
          <span 
            className="absolute text-[20vw] md:text-[25vw] lg:text-[28vw] font-black leading-none text-[#2D2D2D]"
            style={{ 
              left: '12vw',
              fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
              letterSpacing: '-0.03em'
            }}
          >
            m
          </span>

          {/* Solid 'nk' - right of the video circle */}
          <span 
            className="absolute text-[20vw] md:text-[25vw] lg:text-[28vw] font-black leading-none text-[#2D2D2D]"
            style={{ 
              right: '2vw',
              fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
              letterSpacing: '-0.03em'
            }}
          >
            nk
          </span>

          {/* Right outline letter - faded */}
          <span 
            className="absolute text-[20vw] md:text-[25vw] lg:text-[28vw] font-black leading-none"
            style={{ 
              right: '-6vw',
              fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
              WebkitTextStroke: '2px rgba(45, 45, 45, 0.15)', 
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em'
            }}
          >
            s
          </span>
        </div>

        {/* ── Circular Video Player (Acts as the letter "o") ── */}
        <motion.div 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-[55vw] h-[55vw] max-w-[550px] max-h-[550px] md:w-[30vw] md:h-[30vw] md:max-w-[500px] md:max-h-[500px] rounded-full overflow-hidden shadow-2xl group cursor-pointer"
          onClick={handlePlayClick}
          style={{ border: '4px solid rgba(45, 45, 45, 0.1)' }}
        >
          {!isPlaying ? (
            <>
              {/* Video Poster / Thumbnail */}
              <img 
                src={project?.bannerImage || '/clients/logos/leverage_edu/8_leverage.png'} 
                alt="Video Cover" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-black/60">
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="white" />
                </div>
              </div>
            </>
          ) : (
            /* Actual Video Player (YouTube embed example) */
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1&modestbranding=1&rel=0"
              title="Leverage Edu Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none', borderRadius: '50%' }}
            />
          )}
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
            <p 
              className="font-bold text-xl md:text-2xl leading-tight text-[#2D2D2D]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Leverage Edu
            </p>
            <p 
              className="font-normal text-sm md:text-base text-[#2D2D2D]/70 leading-tight mt-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              EdTech Brand Transformation
            </p>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CONTENT: Rest of the Case Study                        */}
      {/* ═══════════════════════════════════════════════════════ */}
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
