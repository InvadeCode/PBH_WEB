import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const ARISE = {
  ink:    '#060B1A',
  paper:  '#F4F3EF',
  gold:   '#FFCD00',
  indigo: '#6865FA',
  rule:   'rgba(244,243,239,0.15)',
};

// ─── SCENE 1: THE ZOOM-THROUGH (0-200vh) ─────────────────────────────────────
const ZoomThroughHero = ({ navigate, project }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const scale = useTransform(smoothProgress, [0, 0.8, 1], [1, 50, 100]);
    const opacity = useTransform(smoothProgress, [0, 0.5, 0.8], [1, 1, 0]);
    const blur = useTransform(smoothProgress, [0, 0.5, 0.8], [0, 0, 20]);
    const tracking = useTransform(smoothProgress, [0, 0.2], ["0.2em", "-0.05em"]);

    const heroImg = project?.fullStory?.heroImg || project?.bannerImage;

    return (
        <section ref={ref} className="relative h-[200vh]" style={{ backgroundColor: ARISE.ink }}>
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                {heroImg && (
                    <motion.div 
                        className="absolute inset-0 z-0"
                        style={{ opacity: useTransform(smoothProgress, [0, 0.8], [0.4, 0]) }}
                    >
                        <img src={heroImg} className="w-full h-full object-cover blur-sm" alt="Hero Background" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060B1A] via-transparent to-[#060B1A]/50" />
                    </motion.div>
                )}

                <button onClick={() => navigate('work')} className="absolute top-12 left-12 z-50 flex items-center gap-2 text-xs uppercase tracking-widest font-mono transition-opacity hover:opacity-60" style={{ color: ARISE.paper }}>
                    <ArrowLeft className="w-3 h-3" /> Back
                </button>

                <motion.div 
                    className="flex flex-col items-center justify-center z-10"
                    style={{ scale, opacity, filter: `blur(${blur}px)` }}
                >
                    <p className="text-[10px] uppercase tracking-[0.4em] font-mono mb-4" style={{ color: ARISE.gold }}>Identity Architecture</p>
                    <motion.h1 
                        className="text-[15vw] font-black uppercase leading-none"
                        style={{ color: ARISE.paper, letterSpacing: tracking }}
                    >
                        ARISE
                    </motion.h1>
                </motion.div>

                <motion.div style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }} className="absolute bottom-12 text-[10px] font-mono uppercase tracking-widest text-white/50">
                    Scroll to dive in
                </motion.div>
            </div>
        </section>
    );
};

// ─── SCENE 2: THE BRAND MARK (Clean Reveal) ──────────────────────────────────
const BrandMarkSection = ({ project }) => {
    return (
        <section className="py-48 px-4 flex flex-col items-center justify-center relative border-t" style={{ backgroundColor: ARISE.ink, borderColor: ARISE.rule }}>
             <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="text-[10px] uppercase tracking-[0.4em] font-mono mb-24" 
                style={{ color: ARISE.gold }}
             >
                01 — The Mark
             </motion.p>

             <motion.div 
                 initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                 whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                 viewport={{ once: true, margin: "-20%" }}
                 transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                 className="flex items-center justify-center"
             >
                 {project?.logo ? (
                     <img src={project.logo} alt="Arise Ventures Logo" className="w-[60vw] md:w-[40vw] max-w-2xl object-contain invert mix-blend-screen" />
                 ) : (
                     <div className="flex flex-col items-center">
                         <h2 className="text-[10vw] font-black uppercase leading-none tracking-tighter" style={{ color: ARISE.paper }}>ARISE</h2>
                         <h3 className="text-[4vw] font-light uppercase tracking-[0.3em] mt-2" style={{ color: `${ARISE.paper}80` }}>VENTURES</h3>
                     </div>
                 )}
             </motion.div>
        </section>
    );
};

// ─── SCENE 3: INTERACTIVE VISUAL ASSEMBLY ────────────────────────────────────
const InteractiveAssembly = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!images || images.length === 0) return null;

    return (
        <section className="py-32 px-4 md:px-12 relative border-t" style={{ backgroundColor: ARISE.ink, borderColor: ARISE.rule }}>
            <div className="max-w-[1600px] mx-auto">
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="text-[10px] uppercase tracking-[0.4em] font-mono mb-24 text-center" 
                    style={{ color: ARISE.gold }}
                >
                    02 — Visual Assembly
                </motion.p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {images.map((src, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="aspect-[4/3] relative overflow-hidden rounded-md cursor-pointer group"
                            onClick={() => setSelectedImage(src)}
                        >
                            <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={`Application ${i}`} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-xs uppercase tracking-widest font-mono text-white border border-white/30 px-6 py-2 rounded-full backdrop-blur-sm">
                                    Tap to View
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* LIGHTBOX MODAL */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#060B1A]/95 backdrop-blur-xl p-4 md:p-12 cursor-pointer"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-50">
                            <X className="w-8 h-8" />
                        </button>
                        <motion.img 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            src={selectedImage} 
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                            alt="Expanded view" 
                            onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking image itself
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

// ─── SCENE 4: SMOOTH CIRCULAR COLOR REVEAL ───────────────────────────────────
const CircularColorReveal = ({ colors }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    
    // Smooth circle expansion
    const circleScale = useTransform(scrollYProgress, [0.3, 0.6], [0, 15]);
    
    const palette = colors || [ARISE.ink, ARISE.paper, ARISE.indigo, ARISE.gold];
    const names = ['Ink Deep', 'Paper White', 'Identity Indigo', 'Signal Gold'];

    return (
        <section ref={ref} className="relative min-h-[150vh]" style={{ backgroundColor: ARISE.ink }}>
            {/* The circular reveal effect */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
                
                {/* The expanding circle acting as a background wipe */}
                <motion.div 
                    className="absolute top-1/2 left-1/2 w-[20vw] h-[20vw] rounded-full -translate-x-1/2 -translate-y-1/2 z-0"
                    style={{ backgroundColor: ARISE.paper, scale: circleScale }}
                />

                {/* Content over the circle */}
                <div className="relative z-10 w-full max-w-6xl mx-auto px-8 flex flex-col items-center">
                    <motion.p 
                        style={{ opacity: useTransform(scrollYProgress, [0.4, 0.5], [0, 1]), color: ARISE.ink }}
                        className="text-[10px] uppercase tracking-[0.4em] font-mono mb-24 text-center" 
                    >
                        03 — Chromatic Architecture
                    </motion.p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full">
                        {palette.map((c, i) => (
                            <motion.div 
                                key={c}
                                style={{ 
                                    opacity: useTransform(scrollYProgress, [0.5 + (i * 0.05), 0.6 + (i * 0.05)], [0, 1]),
                                    y: useTransform(scrollYProgress, [0.5 + (i * 0.05), 0.6 + (i * 0.05)], [50, 0])
                                }}
                                className="flex flex-col gap-4"
                            >
                                <div 
                                    className="aspect-square rounded-full shadow-lg"
                                    style={{ backgroundColor: c, border: `1px solid rgba(0,0,0,0.1)` }}
                                />
                                <div className="flex flex-col items-center text-center mt-4">
                                    <span className="text-sm font-medium" style={{ color: ARISE.ink }}>{names[i] || 'Brand Color'}</span>
                                    <span className="text-[10px] font-mono uppercase mt-1" style={{ color: `${ARISE.ink}80` }}>{c}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ─── SCENE 5: CLOSING ────────────────────────────────────────────────────────
const ClosingSequence = ({ navigate }) => {
    return (
        <section className="h-screen flex flex-col items-center justify-center relative" style={{ backgroundColor: ARISE.paper }}>
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
               className="text-center z-10"
            >
                <h2 className="text-[8vw] font-black uppercase leading-none tracking-tighter mb-12" style={{ color: ARISE.ink }}>
                    ARISE.
                </h2>
                <button 
                    onClick={() => navigate('work')}
                    className="group relative inline-flex items-center gap-4 text-xs uppercase tracking-[0.3em] font-mono"
                    style={{ color: ARISE.ink }}
                >
                    <div className="w-12 h-px bg-black group-hover:w-24 transition-all duration-500 ease-out" />
                    Return to Index
                    <div className="w-12 h-px bg-black group-hover:w-24 transition-all duration-500 ease-out" />
                </button>
            </motion.div>
        </section>
    );
};

// ─── ROOT EXPERIENCE ─────────────────────────────────────────────────────────
const AriseVenturesExperience = ({ navigate, project }) => {
  const images = (project.fullStory?.images || [])
    .map(img => (typeof img === 'string' ? img : img?.url || img?.imageUrl))
    .filter(Boolean);

  useEffect(() => { 
      window.scrollTo({ top: 0, behavior: 'instant' }); 
  }, []);

  return (
    <div className="w-full text-white font-sans selection:bg-[#FFCD00] selection:text-[#060B1A]" style={{ backgroundColor: ARISE.ink }}>
       <ZoomThroughHero navigate={navigate} project={project} />
       <BrandMarkSection project={project} />
       <InteractiveAssembly images={images} />
       <CircularColorReveal colors={project.colors} />
       <ClosingSequence navigate={navigate} />
    </div>
  );
};

export default AriseVenturesExperience;
