import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Play } from 'lucide-react';

const palette = {
  primary: '#ff3366',
  secondary: '#00c3ff',
  accent: '#ffcc00',
  text: '#ffffff',
  bgDeep: '#050510',
  pink: '#FFA8DF', // Exact pink from the reference
  darkText: '#2D2D2D'
};

export const LeverageEduExperience = ({ project, onBack }) => {
  const controls = useAnimation();

  useEffect(() => {
    window.scrollTo(0, 0);
    controls.start("visible");
  }, [controls]);

  // Framer motion variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ backgroundColor: palette.pink }}>
      
      {/* Navigation / Back Button */}
      <div className="absolute top-0 left-0 w-full z-50 p-6 md:p-10 flex justify-between items-center mix-blend-difference text-white">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 text-sm font-secondary tracking-widest uppercase hover:opacity-70 transition-opacity"
        >
          <div className="w-8 h-[1px] bg-white group-hover:w-12 transition-all duration-300" />
          Back
        </button>
      </div>

      {/* The Typography Video Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Massive Typography Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none whitespace-nowrap overflow-hidden">
          <div className="flex items-center justify-center gap-2 md:gap-4 select-none">
            
            {/* Outline 'e' */}
            <span 
              className="text-[15rem] md:text-[30rem] lg:text-[40rem] font-primary font-black leading-none -ml-[10vw]"
              style={{ WebkitTextStroke: '2px rgba(45, 45, 45, 0.3)', WebkitTextFillColor: 'transparent' }}
            >
              e
            </span>
            
            {/* Solid 'm' */}
            <span className="text-[15rem] md:text-[30rem] lg:text-[40rem] font-primary font-black leading-none text-[#2D2D2D] tracking-tighter">
              m
            </span>
            
            {/* The Video 'o' Space (Empty space for the absolute video to sit perfectly) */}
            <div className="w-[12rem] md:w-[24rem] lg:w-[32rem] shrink-0" />

            {/* Solid 'n k' */}
            <span className="text-[15rem] md:text-[30rem] lg:text-[40rem] font-primary font-black leading-none text-[#2D2D2D] tracking-tighter">
              nk
            </span>

            {/* Outline 's' */}
            <span 
              className="text-[15rem] md:text-[30rem] lg:text-[40rem] font-primary font-black leading-none"
              style={{ WebkitTextStroke: '2px rgba(45, 45, 45, 0.3)', WebkitTextFillColor: 'transparent' }}
            >
              s
            </span>
          </div>
        </div>

        {/* Circular Video Player */}
        <motion.div 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-[16rem] h-[16rem] md:w-[28rem] md:h-[28rem] lg:w-[36rem] lg:h-[36rem] rounded-full overflow-hidden shadow-2xl group cursor-pointer -mt-[2%]"
        >
          {/* Using the hero image from Sanity or a placeholder as the video poster */}
          <img 
            src={project?.heroImage || '/clients/logos/leverage_edu/8_leverage.png'} 
            alt="Video Cover" 
            className="w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Play className="w-6 h-6 md:w-8 md:h-8 text-[#FFA8DF] ml-1" fill="#FFA8DF" />
            </div>
          </div>
        </motion.div>

        {/* Meet Annotation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-12 md:bottom-24 left-8 md:left-24 z-20"
        >
          <div className="relative inline-block mb-2">
            <span className="font-secondary uppercase text-sm md:text-base tracking-widest font-medium text-[#2D2D2D] px-4 py-1">
              Meet
            </span>
            {/* SVG Hand-drawn Oval */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
              <path 
                d="M5,20 C5,5 95,5 95,20 C95,35 5,35 5,20 Z" 
                fill="none" 
                stroke="#2D2D2D" 
                strokeWidth="1" 
                className="opacity-70"
                style={{ strokeDasharray: "300", strokeDashoffset: "0" }}
              />
              {/* Extra sloppy lines */}
              <path d="M10,25 C10,38 90,38 90,15" fill="none" stroke="#2D2D2D" strokeWidth="0.5" className="opacity-50" />
            </svg>
          </div>
          <div className="font-primary text-[#2D2D2D] mt-2">
            <p className="font-bold text-lg md:text-xl leading-tight">
              {project?.title || "Sir Martin Sorrell"}
            </p>
            <p className="font-normal text-sm md:text-base opacity-80 leading-tight">
              {project?.client || "S4Capital Executive Chairman"}
            </p>
          </div>
        </motion.div>

      </section>

      {/* Content Section (Rest of the case study could follow here) */}
      <section className="py-24 px-8 md:px-24 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-primary font-light mb-12 text-black">
            The Approach
          </h2>
          <div className="prose prose-lg">
            <p className="text-xl text-gray-600 leading-relaxed font-secondary font-light">
              {project?.challenge || "When an established educational platform requires a completely refined narrative, the approach must center on clarity, authority, and deeply empathetic storytelling."}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
