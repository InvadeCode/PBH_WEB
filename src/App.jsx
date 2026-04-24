import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';

// --- DATA MODELS (Used for routing/loops only, content is hidden) ---
const ROUTES = [1, 2, 3, 4, 5];
const CASE_STUDIES = [1, 2, 3, 4];
const QUIZ_QUESTIONS = [1, 2];

// --- SKELETON UTILITIES (Replaces all text and content) ---
const S = {
  Micro: ({ w = "w-16", className = "" }) => <div className={`h-2.5 bg-zinc-200 rounded-sm ${w} ${className}`} />,
  Line: ({ w = "w-full", className = "" }) => <div className={`h-4 bg-zinc-200 rounded-sm ${w} ${className}`} />,
  Paragraph: ({ lines = 3, className = "" }) => (
    <div className={`flex flex-col gap-3 w-full items-start ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-4 bg-zinc-200 rounded-sm ${i === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  ),
  Heading: ({ w = "w-48", className = "" }) => <div className={`h-8 bg-zinc-300 rounded-sm ${w} ${className}`} />,
  Title: ({ w = "w-3/4", className = "" }) => (
    <div className={`flex flex-col gap-4 items-start w-full ${className}`}>
      <div className={`h-12 md:h-16 bg-zinc-300 rounded-sm ${w}`} />
      <div className={`h-12 md:h-16 bg-zinc-300 rounded-sm w-1/2`} />
    </div>
  ),
  Box: ({ className = "" }) => <div className={`bg-zinc-100 border border-zinc-200 ${className}`} />
};

// --- HIGH-END UTILITIES ---
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => {
      setIsPointer(window.getComputedStyle(e.target).cursor === 'pointer' || e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'div');
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseover', handleMouseOver); };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 border border-zinc-300 pointer-events-none z-[999] hidden md:flex items-center justify-center bg-zinc-100/50 mix-blend-multiply"
      animate={{
        x: position.x - 12, y: position.y - 12,
        scale: isPointer ? 1.5 : 1,
        borderRadius: isPointer ? '4px' : '50%'
      }}
      transition={{ type: 'spring', stiffness: 700, damping: 40, mass: 0.1 }}
    />
  );
};

const FadeIn = ({ children, delay = 0, className = "", direction = "up" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const yOffset = direction === "up" ? 20 : 0;
  
  return (
    <div ref={ref} className={`w-full ${className}`}>
      <motion.div
        initial={{ y: yOffset, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: yOffset, opacity: 0 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const WireframeButton = ({ onClick, className = "", w = "w-24", disabled = false }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`group relative inline-flex items-center justify-start px-8 py-4 border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <S.Micro w={w} className="bg-zinc-300 group-hover:bg-zinc-400 transition-colors" />
    </button>
  );
};

// --- BLUEPRINT ANNOTATION COMPONENT ---
const Annotation = ({ title, rationale }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative z-20 w-full mb-8 flex flex-col items-start">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white font-mono text-[10px] sm:text-xs uppercase tracking-widest cursor-pointer hover:bg-zinc-800 transition-colors shadow-[2px_2px_0px_0px_rgba(161,161,170,0.5)] select-none"
      >
        <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-pulse" />
        {title}
        <span className="ml-4 font-bold text-zinc-400">{isOpen ? '[-]' : '[+]'}</span>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden relative mt-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] w-full sm:w-1/2 lg:w-1/3"
          >
            <div className="bg-white border-2 border-black p-4 text-black font-mono text-xs sm:text-sm leading-relaxed text-left w-full">
              <div className="inline-block mb-3 px-2 py-1 bg-black text-white text-[8px] uppercase tracking-widest">UX_RATIONALE</div>
              <p className="mt-2 text-zinc-600">{rationale}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- CORE PAGES ---

const HomePage = ({ navigate }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-zinc-50 min-h-screen w-full">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-[700px] flex flex-col justify-center items-start overflow-hidden px-[3vw] pt-32 pb-16 w-full">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 pointer-events-none flex items-start justify-start opacity-30">
          <svg className="w-full h-auto" viewBox="0 0 1000 1000" fill="none">
            <rect x="0" y="100" width="800" height="800" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="10 10"/>
            <line x1="0" y1="100" x2="800" y2="900" stroke="#e4e4e7" strokeWidth="1"/>
            <line x1="800" y1="100" x2="0" y2="900" stroke="#e4e4e7" strokeWidth="1"/>
            <circle cx="400" cy="500" r="300" stroke="#e4e4e7" strokeWidth="1" />
          </svg>
        </motion.div>

        <div className="relative z-10 flex flex-col items-start w-full mt-10 md:mt-0">
          <Annotation 
            title="SEC: HERO_BANNER" 
            rationale="Establishes the immediate value proposition. Above-the-fold space is prime real estate utilized to capture attention before the user's dopamine-depleted brain inevitably scrolls away." 
          />
          <div className="flex flex-col items-start text-left mt-6 w-full">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-3 px-4 py-2 border border-zinc-200 bg-white mb-12 rounded-sm">
              <S.Box className="w-3 h-3 rounded-full bg-zinc-300 border-none" />
              <S.Micro w="w-48" />
            </motion.div>
            
            <div className="flex flex-col items-start w-full mb-12">
              <S.Title w="w-full" className="items-start" />
            </div>
            
            <div className="w-full border-l-2 border-zinc-200 pl-6 mb-16 text-left">
              <S.Paragraph lines={3} />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start justify-start gap-4 w-full">
              <WireframeButton onClick={() => navigate('tools')} w="w-32" className="w-full sm:w-auto" />
              <WireframeButton onClick={() => navigate('services')} w="w-40" className="w-full sm:w-auto bg-zinc-100 hover:bg-zinc-200 border-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Strip */}
      <section className="py-12 border-y border-zinc-200 bg-white w-full px-[3vw]">
        <Annotation 
          title="SEC: SOCIAL_PROOF" 
          rationale="B2B decisions are heavily driven by risk mitigation. Seeing recognizable logos instantly reduces perceived risk and borrows credibility through mere association." 
        />
        <div className="flex flex-col md:flex-row items-start justify-start gap-12 mt-8 w-full">
          <S.Micro w="w-24" className="shrink-0 mt-3" />
          <div className="flex flex-wrap items-start justify-start gap-x-12 gap-y-6 w-full">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <S.Heading key={i} w={['w-32', 'w-48', 'w-24', 'w-40', 'w-36'][i]} className="h-6 bg-zinc-100" />
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Challenge */}
      <section className="py-32 md:py-48 bg-zinc-50 w-full px-[3vw]">
        <Annotation 
          title="SEC: PROBLEM_AGITATION" 
          rationale="Users rarely seek solutions until they acutely feel the pain of their problem. This section structurally 'twists the knife' before offering the architectural band-aid below." 
        />
        <FadeIn>
          <div className="mb-24 mt-12 border-l-4 border-zinc-200 pl-8 w-full">
            <S.Heading w="w-full" className="h-12 md:h-16 mb-4" />
            <S.Heading w="w-2/3" className="h-12 md:h-16 bg-zinc-200" />
          </div>
        </FadeIn>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {[1, 2, 3].map((i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="border border-zinc-200 bg-white p-8 w-full flex flex-col items-start">
                <S.Box className="w-12 h-12 mb-8 bg-zinc-100 border-zinc-200 rounded-sm" />
                <S.Heading w="w-3/4" className="mb-6" />
                <S.Paragraph lines={4} />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 4. Operation Flow (Process) */}
      <section className="py-32 bg-white border-y border-zinc-200 w-full px-[3vw]">
        <Annotation 
          title="SEC: OPERATION_FLOW" 
          rationale="Reduces cognitive friction by breaking down complex engagements into predictable, linear micro-steps. Users need to know 'what happens next' before committing." 
        />
        <FadeIn>
          <div className="mt-12 mb-20 flex flex-col items-start w-full">
            <S.Micro w="w-32" className="mb-6" />
            <S.Title w="w-full" className="items-start" />
          </div>
        </FadeIn>
        
        <div className="grid md:grid-cols-4 gap-12 relative w-full">
          <div className="absolute top-8 left-0 w-full h-[1px] bg-zinc-200 hidden md:block z-0" />
          {[1, 2, 3, 4].map((i) => (
            <FadeIn key={i} delay={i * 0.1} className="relative z-10 w-full flex flex-col items-start">
              <S.Box className="w-16 h-16 rounded-full bg-zinc-100 border-zinc-300 flex items-center justify-center mb-8">
                <div className="font-mono text-zinc-400 font-bold">0{i}</div>
              </S.Box>
              <S.Heading w="w-48" className="h-6 mb-4" />
              <S.Paragraph lines={3} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 5. Metrics (Quantifiable Impact) */}
      <section className="py-24 bg-zinc-50 border-b border-zinc-200 w-full px-[3vw]">
        <Annotation 
          title="SEC: QUANTIFIABLE_IMPACT" 
          rationale="Anchors abstract value propositions to hard, numerical realities. Massive typography for numbers bypasses analytical processing to create immediate emotional trust." 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-16 w-full">
          {[1, 2, 3, 4].map((i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="flex flex-col items-start text-left p-6 border border-zinc-200 bg-white w-full">
                <S.Heading w="w-32" className="h-16 md:h-20 mb-6 bg-zinc-300" />
                <S.Line w="w-24" className="h-3" />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 6. Testimonials (Peer Validation) */}
      <section className="py-32 bg-white border-b border-zinc-200 w-full px-[3vw]">
        <Annotation 
          title="SEC: PEER_VALIDATION" 
          rationale="Leverages the bandwagon effect. Specificity in peer validation (avatars, distinct text lengths) increases perceived authenticity compared to homogeneous marketing copy." 
        />
        <FadeIn>
          <div className="mt-12 mb-16 w-full">
            <S.Title w="w-full" className="mb-8 items-start" />
            <S.Paragraph lines={2} className="w-full" />
          </div>
        </FadeIn>
        
        <div className="grid md:grid-cols-3 gap-8 w-full">
          {[1, 2, 3].map((i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="p-8 border border-zinc-200 bg-zinc-50 flex flex-col h-full items-start w-full">
                <div className="flex items-center justify-start gap-4 mb-8">
                  <S.Box className="w-12 h-12 rounded-full shrink-0" />
                  <div className="flex flex-col items-start">
                    <S.Line w="w-32" className="mb-2" />
                    <S.Micro w="w-20" />
                  </div>
                </div>
                <div className="flex-grow w-full">
                  <S.Paragraph lines={i === 2 ? 6 : i === 1 ? 4 : 5} />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 7. Pricing (Choice Architecture) */}
      <section className="py-32 bg-zinc-50 border-b border-zinc-200 w-full px-[3vw]">
        <Annotation 
          title="SEC: CHOICE_ARCHITECTURE" 
          rationale="Implements the Decoy Effect and center-stage heuristic. By presenting three options, we guide users toward the middle 'optimal' tier, anchoring price expectations against the highest tier." 
        />
        <FadeIn>
          <div className="flex flex-col items-start mt-12 mb-20 text-left w-full">
            <S.Title w="w-full" className="items-start mb-6" />
            <S.Paragraph lines={2} className="w-full items-start" />
          </div>
        </FadeIn>
        
        <div className="grid lg:grid-cols-3 gap-8 items-start w-full">
          {[1, 2, 3].map((i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className={`p-8 md:p-10 border relative flex flex-col items-start w-full ${i === 2 ? 'border-zinc-400 bg-white shadow-xl z-10' : 'border-zinc-200 bg-white'}`}>
                {i === 2 && (
                   <div className="absolute top-0 left-0 -translate-y-full bg-zinc-800 px-4 py-1">
                      <S.Micro w="w-20" className="bg-zinc-300" />
                   </div>
                )}
                <S.Micro w="w-24" className="mb-6" />
                <S.Heading w="w-40" className="h-12 mb-4" />
                <S.Paragraph lines={2} className="mb-10 w-full" />
                
                <WireframeButton w="w-full" className={`w-full mb-10 ${i === 2 ? 'bg-zinc-100' : ''}`} />
                
                <div className="space-y-4 border-t border-zinc-100 pt-8 w-full">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="flex items-center justify-start gap-4 w-full">
                      <S.Box className="w-4 h-4 rounded-full shrink-0 bg-zinc-200 border-none" />
                      <S.Line w={j % 2 === 0 ? "w-full" : "w-5/6"} />
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 8. FAQ (Objection Handling) */}
      <section className="py-32 bg-white border-b border-zinc-200 w-full px-[3vw]">
        <Annotation 
          title="SEC: OBJECTION_HANDLING" 
          rationale="Proactively neutralizes purchase anxieties. The accordion format hides structural complexity while empowering the high-intent user to seek out specific technical reassurance." 
        />
        <FadeIn>
          <S.Title w="w-full" className="mt-12 mb-16 items-start" />
        </FadeIn>
        
        <div className="space-y-4 w-full">
          {[1, 2, 3, 4, 5].map((i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="border border-zinc-200 bg-zinc-50 p-6 flex justify-between items-center cursor-pointer hover:bg-zinc-100 transition-colors w-full">
                <S.Line w={['w-2/3', 'w-3/4', 'w-1/2', 'w-5/6', 'w-2/3'][i-1]} className="h-5" />
                <S.Box className="w-6 h-6 shrink-0" />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 9. Newsletter / Footer CTA (Micro Commitment) */}
      <section className="py-32 bg-zinc-50 w-full px-[3vw]">
        <Annotation 
          title="SEC: MICRO_COMMITMENT" 
          rationale="Captures visitors who are not ready for a high-friction primary CTA (booking a call or paying). Offers a low-stakes exchange of value for an email address to fuel the retargeting engine." 
        />
        <FadeIn>
          <div className="w-full mt-12 bg-white border border-zinc-200 p-12 md:p-20 shadow-sm flex flex-col items-start text-left">
            <S.Box className="w-16 h-16 mb-8 rounded-full" />
            <S.Heading w="w-3/4" className="h-10 mb-6" />
            <S.Paragraph lines={2} className="w-full items-start mb-12" />
            
            <div className="flex flex-col sm:flex-row gap-4 w-full items-start">
              <S.Box className="h-14 w-full bg-zinc-50 flex items-center justify-start px-4">
                <S.Micro w="w-32" />
              </S.Box>
              <WireframeButton w="w-24" className="h-14 py-0 sm:shrink-0 bg-zinc-100" />
            </div>
          </div>
        </FadeIn>
      </section>

    </motion.div>
  );
};

const AboutPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-zinc-50 min-h-screen pt-40 pb-32 w-full px-[3vw]">
      <Annotation 
        title="SEC: ORIGIN_NARRATIVE" 
        rationale="Humanizes the corporate entity. Establishes the 'Founder-Led' authority bias. Ultimately, clients buy from other humans, not from faceless geometric wireframes." 
      />
      
      <FadeIn>
        <div className="mb-24 mt-8 text-left border-b border-zinc-200 pb-16 flex flex-col items-start w-full">
          <S.Micro w="w-24" className="mb-8" />
          <S.Title w="w-full" className="items-start" />
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid md:grid-cols-2 gap-12 mb-32 w-full">
          <div className="space-y-6 w-full flex flex-col items-start">
            <S.Paragraph lines={5} />
            <S.Paragraph lines={4} />
          </div>
          <div className="space-y-6 w-full flex flex-col items-start">
            <S.Paragraph lines={4} />
            <S.Paragraph lines={6} />
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="bg-white border border-zinc-200 p-8 md:p-16 flex flex-col md:flex-row gap-12 items-start w-full">
          <S.Box className="w-48 h-48 rounded-full shrink-0" />
          <div className="w-full flex flex-col items-start">
            <S.Micro w="w-32" className="mb-4" />
            <S.Heading w="w-48" className="mb-6 h-10" />
            <S.Paragraph lines={4} />
          </div>
        </div>
      </FadeIn>
    </motion.div>
  );
};

const ServicesPage = ({ navigate }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-zinc-50 min-h-screen pt-40 pb-32 w-full px-[3vw]">
      <Annotation 
        title="SEC: VALUE_ROUTING" 
        rationale="Minimizes cognitive load. By categorizing abstract services into discrete, repeatable architectural buckets, we guide the user to self-qualify their exact operational needs." 
      />
      <FadeIn>
        <div className="mb-24 mt-8 flex flex-col md:flex-row md:items-start justify-start gap-12 border-b border-zinc-200 pb-12 w-full">
          <S.Title w="w-full" className="items-start" />
          <div className="w-full flex flex-col items-start">
            <S.Paragraph lines={3} />
          </div>
        </div>
      </FadeIn>

      <div className="space-y-8 w-full">
        {ROUTES.map((route, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="bg-white border border-zinc-200 p-8 md:p-12 hover:bg-zinc-100 transition-colors cursor-pointer w-full flex flex-col items-start" onClick={() => navigate('tools')}>
              <div className="flex flex-col md:flex-row gap-8 md:items-start w-full">
                <S.Box className="w-16 h-16 shrink-0" />
                <div className="flex-1 flex flex-col items-start w-full">
                  <S.Micro w="w-32" className="mb-4" />
                  <S.Heading w="w-64" className="mb-6" />
                  <S.Paragraph lines={2} className="w-full" />
                </div>
                <div className="md:pl-8 md:border-l border-zinc-200 shrink-0 pt-6 md:pt-0 flex flex-col items-start">
                  <WireframeButton onClick={(e) => { e.stopPropagation(); navigate('tools'); }} w="w-24" />
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </motion.div>
  );
};

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-zinc-50 min-h-screen pt-40 pb-32 w-full px-[3vw]">
      <Annotation 
        title="SEC: CONVERSION_TERMINAL" 
        rationale="The primary point of capture. Friction is intentionally introduced (via specific dropdowns and multi-line inputs) to filter out low-intent leads and qualify serious prospects." 
      />
      
      <div className="grid md:grid-cols-2 gap-16 md:gap-24 mt-8 w-full">
        <div className="flex flex-col items-start w-full">
          <FadeIn>
            <S.Micro w="w-32" className="mb-8" />
            <S.Title w="w-full" className="mb-12 items-start" />
            <div className="border-l-2 border-zinc-200 pl-6 mb-16 w-full flex flex-col items-start text-left">
              <S.Paragraph lines={3} />
            </div>

            <div className="space-y-8 bg-white border border-zinc-200 p-8 w-full flex flex-col items-start">
              <div className="flex items-center justify-start gap-6 w-full">
                <S.Box className="w-6 h-6 shrink-0" />
                <S.Line w="w-48" />
              </div>
              <div className="w-full h-[1px] bg-zinc-200" />
              <div className="flex items-center justify-start gap-6 w-full">
                <S.Box className="w-6 h-6 shrink-0" />
                <S.Line w="w-64" />
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="flex flex-col items-start w-full">
          <FadeIn delay={0.2}>
            {submitted ? (
              <div className="bg-white border border-zinc-200 p-12 text-left h-full flex flex-col justify-start items-start gap-6 w-full">
                <S.Box className="w-20 h-20 rounded-full mb-4" />
                <S.Heading w="w-64" className="h-10" />
                <S.Paragraph lines={2} className="w-full" />
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="bg-white border border-zinc-200 p-10 space-y-8 w-full flex flex-col items-start">
                <div className="grid sm:grid-cols-2 gap-6 w-full">
                  <div className="w-full flex flex-col items-start">
                    <S.Micro w="w-24" className="mb-4" />
                    <S.Box className="w-full h-12" />
                  </div>
                  <div className="w-full flex flex-col items-start">
                    <S.Micro w="w-24" className="mb-4" />
                    <S.Box className="w-full h-12" />
                  </div>
                </div>

                <div className="w-full flex flex-col items-start">
                  <S.Micro w="w-24" className="mb-4" />
                  <S.Box className="w-full h-12" />
                </div>

                <div className="w-full flex flex-col items-start">
                  <S.Micro w="w-32" className="mb-4" />
                  <S.Box className="w-full h-32" />
                </div>

                <WireframeButton type="submit" w="w-32" className="w-full bg-zinc-100" />
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </motion.div>
  );
};

const ToolsHubPage = ({ navigate }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-zinc-50 min-h-screen pt-40 pb-32 w-full px-[3vw]">
      <Annotation 
        title="SEC: INTERACTIVE_LEAD_GEN" 
        rationale="Leverages the psychological principle of reciprocity. We provide the user with a valuable diagnostic framework in exchange for their active engagement and deeper ecosystem immersion." 
      />
      
      <FadeIn>
        <div className="mb-24 mt-8 text-left border-b border-zinc-200 pb-12 flex flex-col items-start w-full">
          <S.Micro w="w-32" className="mb-8" />
          <S.Title w="w-full" className="items-start mb-8" />
          <div className="w-full bg-white p-6 border border-zinc-200 flex flex-col items-start text-left">
            <S.Paragraph lines={2} />
          </div>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {[
          { dest: 'quiz', lines: 3 },
          { dest: 'scope-builder', lines: 4 },
          { dest: 'contact', lines: 3 }
        ].map((tool, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div 
              onClick={() => navigate(tool.dest)}
              className="bg-white border border-zinc-200 p-8 hover:bg-zinc-100 transition-colors cursor-pointer h-full flex flex-col items-start w-full"
            >
              <S.Box className="w-12 h-12 mb-8" />
              <S.Heading w="w-3/4" className="mb-6" />
              <div className="flex-grow mb-8 w-full">
                <S.Paragraph lines={tool.lines} className="items-start" />
              </div>
              <div className="border-t border-zinc-200 pt-6 flex justify-between items-center w-full">
                <S.Micro w="w-24" />
                <S.Micro w="w-8" />
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </motion.div>
  );
};

const WorkPage = () => {
  return (
    <div className="min-h-screen bg-zinc-50 pt-40 pb-32 w-full px-[3vw]">
      <Annotation 
        title="SEC: EMPIRICAL_EVIDENCE" 
        rationale="Case studies act as the scientific method applied to design marketing. Hypothesis -> Execution -> Results. They provide irrefutable structural proof that the methodology is sound." 
      />
      
      <FadeIn>
        <div className="mb-24 mt-8 flex flex-col md:flex-row md:items-start justify-start gap-8 border-b border-zinc-200 pb-12 w-full">
          <S.Title w="w-full" className="items-start" />
          <div className="bg-white border border-zinc-200 p-4 flex flex-col items-start">
            <S.Micro w="w-32" />
          </div>
        </div>
      </FadeIn>

      <div className="grid gap-6 w-full">
        {CASE_STUDIES.map((_, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="bg-white border border-zinc-200 p-8 flex flex-col md:flex-row justify-start items-start md:items-center gap-8 hover:bg-zinc-100 transition-colors w-full">
              <div className="flex-1 w-full flex flex-col items-start">
                <S.Heading w="w-2/3" className="mb-4" />
                <S.Paragraph lines={2} className="w-full items-start" />
              </div>
              
              <div className="flex gap-4 items-start justify-start">
                <S.Micro w="w-16" className="h-6" />
                <S.Micro w="w-20" className="h-6" />
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

const QuizApp = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = () => {
    setTimeout(() => {
      if (currentStep < QUIZ_QUESTIONS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 300);
  };

  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-zinc-50 flex flex-col items-start justify-center pt-32 w-full px-[3vw]">
        <div className="w-full flex flex-col items-start text-left">
          <S.Box className="w-24 h-24 rounded-full mb-12 bg-white" />
          <S.Micro w="w-48" className="mb-8" />
          <S.Title w="w-full" className="items-start mb-16" />
          
          <div className="w-full bg-white border border-zinc-200 p-10 mb-12 flex flex-col items-start">
            <S.Paragraph lines={4} className="mb-10 w-full items-start" />
            <div className="border-t border-zinc-200 pt-8 flex items-start gap-6 w-full">
              <S.Box className="w-12 h-12 shrink-0" />
              <div className="w-full flex flex-col items-start text-left">
                <S.Heading w="w-1/2" className="mb-4" />
                <S.Paragraph lines={2} className="w-full items-start" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 w-full justify-start items-start">
            <WireframeButton onClick={() => onComplete('scope-builder')} w="w-32" className="bg-zinc-100" />
            <WireframeButton onClick={() => onComplete('tools')} w="w-32" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center pt-32 pb-24 w-full px-[3vw]">
      <div className="w-full relative flex flex-col items-start text-left">
        <div className="absolute -top-20 left-0 w-full flex justify-start">
           <Annotation 
             title="SEC: QUALIFICATION_FUNNEL" 
             rationale="Masked as a diagnostic game. This mechanism makes the user feel deeply understood while simultaneously mapping their psychographic profile and uncovering precise structural gaps." 
           />
        </div>

        <div className="mb-20 flex flex-col items-start mt-12 w-full">
          <S.Micro w="w-32" className="mb-6" />
          <div className="w-full h-2 bg-white border border-zinc-200 overflow-hidden rounded-sm">
            <motion.div 
              className="h-full bg-zinc-300" 
              initial={{ width: 0 }} 
              animate={{ width: `${((currentStep) / QUIZ_QUESTIONS.length) * 100}%` }} 
              transition={{ duration: 0.5 }} 
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="w-full">
            <div className="bg-white border border-zinc-200 p-8 md:p-12 mb-12 flex justify-start w-full">
              <S.Heading w="w-full" className="h-12 md:h-16" />
            </div>
            
            <div className="grid gap-6 w-full">
              {[1, 2, 3, 4].map((opt) => (
                <button
                  key={opt}
                  onClick={handleSelect}
                  className="bg-white border border-zinc-200 p-6 flex items-start gap-6 hover:bg-zinc-100 transition-colors w-full text-left"
                >
                  <S.Box className="w-10 h-10 shrink-0" />
                  <S.Line w="w-3/4" />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex justify-between items-start w-full border-t border-zinc-200 pt-6">
          <button 
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            className={`opacity-50 hover:opacity-100 transition-opacity py-2 pr-2 flex justify-start ${currentStep === 0 ? 'pointer-events-none opacity-0' : ''}`}
          >
            <S.Micro w="w-16" />
          </button>
          <button onClick={() => onComplete('tools')} className="opacity-50 hover:opacity-100 transition-opacity p-2 border border-zinc-200 rounded-sm flex justify-start">
            <S.Micro w="w-12" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ScopeBuilderApp = ({ onComplete }) => {
  const [projectType, setProjectType] = useState('');

  return (
    <div className="min-h-screen bg-zinc-50 pt-40 pb-24 w-full px-[3vw]">
      <Annotation 
        title="SEC: ANCHORING_MECHANISM" 
        rationale="Empowers the user to 'build' their own framework. This triggers the IKEA Effect—users place a disproportionately high value on solutions they actively participated in assembling." 
      />
      
      <FadeIn>
        <div className="mb-20 mt-8 bg-white border border-zinc-200 p-10 md:p-12 w-full flex flex-col items-start">
          <S.Micro w="w-40" className="mb-8" />
          <S.Title w="w-full" className="mb-8 items-start" />
          <S.Line w="w-full" />
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid sm:grid-cols-2 gap-6 w-full">
          {[1, 2, 3, 4, 5, 6].map((type) => (
            <button 
              key={type} 
              className={`text-left p-8 border transition-colors flex justify-between items-center w-full ${
                projectType === type ? 'border-zinc-400 bg-zinc-200' : 'border-zinc-200 bg-white hover:bg-zinc-100'
              }`}
              onClick={() => setProjectType(type)}
            >
              <S.Line w="w-48" className={projectType === type ? 'bg-white' : ''} />
              <S.Micro w="w-8" className={projectType === type ? 'bg-white' : ''} />
            </button>
          ))}
        </div>
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <div className="mt-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 border-t border-zinc-200 pt-12 w-full">
          <button onClick={() => onComplete('tools')} className="p-4 border border-zinc-200 bg-white hover:bg-zinc-100 transition-colors flex justify-start">
            <S.Micro w="w-32" />
          </button>
          <WireframeButton onClick={() => onComplete('tools')} disabled={!projectType} w="w-48" className="bg-zinc-100" />
        </div>
      </FadeIn>
    </div>
  );
};

// --- LAYOUT ---

const Header = ({ navigate, current }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-300 w-full px-[3vw] ${scrolled ? 'bg-white/80 backdrop-blur-sm border-b border-zinc-200 py-4' : 'bg-transparent py-8'}`}>
        <div className="w-full flex justify-between items-start md:items-center">
          <div className="cursor-pointer flex items-center justify-start gap-4" onClick={() => { navigate('home'); setMobileMenu(false); }}>
            <S.Box className="w-10 h-10 rounded-sm bg-zinc-200" />
            <S.Heading w="w-48" className="hidden sm:block h-6" />
          </div>
          
          <nav className="hidden md:flex items-start justify-start gap-8">
            {['work', 'services', 'about'].map(id => (
              <div key={id} onClick={() => navigate(id)} className="cursor-pointer py-2 flex items-start">
                <S.Micro w="w-16" className={current === id ? 'bg-zinc-400' : 'bg-zinc-200 hover:bg-zinc-300'} />
              </div>
            ))}
            <WireframeButton onClick={() => navigate('tools')} w="w-20" className="px-6 py-2 ml-4" />
          </nav>

          <button className="md:hidden p-2 border border-zinc-200 bg-white flex justify-start" onClick={() => setMobileMenu(!mobileMenu)}>
            <S.Box className="w-6 h-6 border-none bg-zinc-300" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            initial={{ opacity: 0, y: "-100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "-100%" }} transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-zinc-50 border-b border-zinc-200 pt-32 pb-12 flex flex-col justify-start items-start w-full px-[3vw]"
          >
            <div className="flex flex-col gap-8 items-start justify-start w-full">
              {['home', 'work', 'services', 'about'].map(id => (
                <div key={id} onClick={() => { navigate(id); setMobileMenu(false); }} className="border-b border-zinc-200 pb-6 w-full flex items-start justify-start">
                  <S.Heading w="w-48" className="h-10" />
                </div>
              ))}
            </div>
            <WireframeButton onClick={() => { navigate('tools'); setMobileMenu(false); }} w="w-32" className="w-full py-6 mt-8 bg-zinc-100" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = ({ navigate }) => (
  <footer className="bg-white border-t border-zinc-200 pt-24 pb-12 w-full px-[3vw]">
    <div className="w-full grid md:grid-cols-2 gap-16 mb-24">
      <div className="flex flex-col items-start gap-10 w-full">
        <S.Title w="w-full" className="items-start" />
        <WireframeButton onClick={() => navigate('tools')} w="w-32" className="bg-zinc-100" />
      </div>
      <div className="flex flex-col justify-start gap-6 items-start w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} onClick={() => navigate('services')} className="cursor-pointer pb-2 border-b border-zinc-200 flex items-start justify-start">
            <S.Micro w={['w-40', 'w-32', 'w-48'][i-1]} className="h-4" />
          </div>
        ))}
      </div>
    </div>
    <div className="w-full border-t border-zinc-200 pt-8 flex flex-col md:flex-row justify-between items-start gap-6">
      <S.Micro w="w-48" />
      <div className="flex gap-8 items-start justify-start">
        <S.Micro w="w-24" />
        <S.Micro w="w-24" />
      </div>
    </div>
  </footer>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [currentPage]);

  return (
    <div className="bg-zinc-50 min-h-screen font-sans selection:bg-zinc-200 w-full flex flex-col items-start text-left">
      <CustomCursor />
      <Header navigate={setCurrentPage} current={currentPage} />
      <main className="w-full flex flex-col items-start">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && <HomePage key="home" navigate={setCurrentPage} />}
          {currentPage === 'about' && <AboutPage key="about" />}
          {currentPage === 'services' && <ServicesPage key="services" navigate={setCurrentPage} />}
          {currentPage === 'work' && <WorkPage key="work" />}
          {currentPage === 'contact' && <ContactPage key="contact" />}
          {currentPage === 'tools' && <ToolsHubPage key="tools" navigate={setCurrentPage} />}
          {currentPage === 'quiz' && <QuizApp key="quiz" onComplete={setCurrentPage} />}
          {currentPage === 'scope-builder' && <ScopeBuilderApp key="scope" onComplete={setCurrentPage} />}
        </AnimatePresence>
      </main>
      <Footer navigate={setCurrentPage} />
    </div>
  );
}
