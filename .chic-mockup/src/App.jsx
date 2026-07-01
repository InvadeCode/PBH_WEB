import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

const caseStudyData = [
  {
    id: 'about',
    word: 'ABOUT',
    heading: 'A story infrastructure that travels borders.',
    body: 'Snow Leopard Trust needed a narrative that could travel across South Asia, Central Asia, Europe, and the UK — moving governments, NGOs, and cultural voices to act with purpose.',
    imageSrc: 'https://images.unsplash.com/photo-1501862700950-18382cd41497?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'problem',
    word: 'PROBLEM',
    heading: 'Fragmented narratives in a delicate ecosystem.',
    body: 'With multiple stakeholders across vastly different regions, the core mission was getting lost in translation. The challenge was unifying the voice without losing local nuance.',
    imageSrc: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'solution',
    word: 'SOLUTION',
    heading: 'A cohesive, cinematic visual language.',
    body: 'We stripped away the noise. By employing a "quiet luxury" approach to their conservation story, we elevated the snow leopard from a charity case to a majestic, urgent necessity.',
    imageSrc: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1000&auto=format&fit=crop'
  }
];

const ContentBlock = ({ data, setActiveWord }) => {
  const ref = useRef(null);
  // Triggers when the block hits the center 50% of the viewport
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveWord(data.word);
    }
  }, [isInView, data.word, setActiveWord]);

  return (
    <div ref={ref} className="min-h-screen flex flex-col justify-center py-24 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden relative group"
      >
        {/* Subtle animated gradient glow inside the card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-all duration-1000 pointer-events-none"></div>

        <h3 className="text-xs uppercase tracking-[0.3em] text-cyan-400/80 mb-6 font-semibold flex items-center gap-4">
          <span className="w-8 h-[1px] bg-cyan-400/50"></span>
          {data.word} THE BRAND
        </h3>
        <h4 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white leading-tight mb-6">
          {data.heading}
        </h4>
        <p className="text-zinc-300 font-light leading-relaxed text-lg mb-10">
          {data.body}
        </p>

        {data.imageSrc && (
          <div className="w-full aspect-video rounded-xl overflow-hidden relative border border-white/5">
            <div className="absolute inset-0 bg-cyan-900/10 mix-blend-overlay z-10 pointer-events-none"></div>
            <img 
              src={data.imageSrc} 
              alt={data.word} 
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out grayscale-[30%]" 
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

function App() {
  const { scrollYProgress } = useScroll();
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  
  const [activeWord, setActiveWord] = useState('ABOUT');

  return (
    <div className="bg-black min-h-screen text-zinc-50 font-sans selection:bg-cyan-500/30 relative">
      
      {/* ── GLOBAL CINEMATIC BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          style={{ scale: bgScale, y: bgY }}
          className="absolute inset-[-5%] w-[110%] h-[110%]"
        >
          {/* Cinematic Snow Leopard Vibe */}
          <img 
            src="https://images.unsplash.com/photo-1549480017-d77466a4a059?q=80&w=2000&auto=format&fit=crop" 
            alt="Snow Leopard Habitat" 
            className="w-full h-full object-cover opacity-60"
          />
          {/* Overlays for contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent w-2/3"></div>
        </motion.div>
      </div>

      {/* ── CONTENT WRAPPER ── */}
      <div className="relative z-10">
        
        {/* Intro Spacer */}
        <div className="h-screen flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="text-center"
          >
            <h1 className="text-sm font-serif tracking-[0.5em] uppercase font-light text-zinc-400 mb-8">
              The Snow Leopard Trust
            </h1>
            <div className="w-[1px] h-24 bg-gradient-to-b from-cyan-500/50 to-transparent mx-auto"></div>
          </motion.div>
        </div>

        {/* ── THE TWO-COLUMN STICKY LAYOUT ── */}
        <div className="relative flex flex-col md:flex-row w-full max-w-7xl mx-auto px-6 md:px-12">
          
          {/* LEFT: STATIC/FIXED WORD THAT CHANGES */}
          <div className="w-full md:w-1/2 relative">
            <div className="sticky top-0 h-screen flex items-center justify-start pointer-events-none">
              <div className="relative w-full h-[150px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeWord}
                    initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    {/* Ghost Fill */}
                    <h2 
                      className="text-6xl md:text-8xl lg:text-[9rem] font-serif font-black tracking-tighter leading-none mix-blend-overlay opacity-80"
                      style={{ color: 'white' }}
                    >
                      {activeWord}
                    </h2>
                    {/* Outline Stroke */}
                    <h2 
                      className="absolute inset-0 text-6xl md:text-8xl lg:text-[9rem] font-serif font-black tracking-tighter leading-none text-transparent"
                      style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}
                    >
                      {activeWord}
                    </h2>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT: SCROLLING CONTENT CARDS */}
          <div className="w-full md:w-1/2 flex flex-col pb-[20vh]">
            {caseStudyData.map((data) => (
              <ContentBlock 
                key={data.id} 
                data={data} 
                setActiveWord={setActiveWord} 
              />
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}

export default App;
