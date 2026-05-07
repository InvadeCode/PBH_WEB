import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Hexagon, Zap, CheckCircle2, 
  ArrowLeft, ArrowDown, Check, Menu, X, Globe, MoveRight,
  Lightbulb, Activity, BookOpen, Fingerprint, Dna, Rocket,
  Mail, MessageSquare, Terminal
} from 'lucide-react';

// --- DATA MODELS ---
const ROUTES = [
  { id: 'brand-boulevard', title: 'Brand Boulevard', tagline: 'Strategy & Identity', description: 'Brand workshops, audits, brand identity systems, design systems, collaterals, brand guidelines.', icon: <Fingerprint className="w-5 h-5" /> },
  { id: 'sciart-saga', title: 'SciArt Saga', tagline: 'Complexity Translation', description: 'Innovation and science frameworks, experience and IP strategy, product storytelling, go-to-market.', icon: <Dna className="w-5 h-5" /> },
  { id: 'storytelling-corner', title: 'Storytelling Corner', tagline: 'Digital Narratives', description: 'Creative direction, social media and influencer strategy, website frameworks, digital storytelling.', icon: <Lightbulb className="w-5 h-5" /> },
  { id: 'launch-systems', title: 'Launch Systems', tagline: 'Growth Assets', description: 'Packaging, SKU systems, launch campaigns, influencer PR kits, lookbooks, social templates.', icon: <Rocket className="w-5 h-5" /> },
  { id: 'institutional', title: 'Institutional Systems', tagline: 'Structured Frameworks', description: 'Branding workshops, institutional narratives, publication templates, report systems, governance.', icon: <BookOpen className="w-5 h-5" /> }
];

const CASE_STUDIES = [
  { client: 'Observer Research Foundation', sector: 'Think Tank', challenge: 'Translating complex global policy into accessible digital narratives.', route: 'Institutional Systems', tags: ['Policy', 'Digital'] },
  { client: 'Arise Ventures', sector: 'Venture Capital', challenge: 'Building an ecosystem narrative for deep-tech founders.', route: 'Brand Boulevard', tags: ['VC', 'Strategy'] },
  { client: 'Snow Leopard Trust', sector: 'Conservation', challenge: 'Bridging science, policy, and emotion for global impact.', route: 'SciArt Saga', tags: ['Impact', 'Story'] },
  { client: 'Firefox Bikes', sector: 'Consumer', challenge: 'Revitalising an iconic brand for a new generation of riders.', route: 'Launch Systems', tags: ['Consumer', 'Identity'] },
];

const QUIZ_QUESTIONS = [
  {
    id: 'q1', text: 'Your brand’s messaging feels inconsistent across different platforms. What feels closest?',
    options: [
      { id: 'A', text: 'Different teams interpret the brand differently.', cluster: 'Internal Alignment' },
      { id: 'B', text: 'There is no unified brand guideline or playbook.', cluster: 'System Gap' },
      { id: 'C', text: 'Each platform has a different audience and the message keeps changing.', cluster: 'Story Gap' },
      { id: 'D', text: 'The company scaled quickly but the brand foundation was never revisited.', cluster: 'Clarity Gap' }
    ]
  },
  {
    id: 'q2', text: 'Your business is gaining traction, but engagement remains low. What could be happening?',
    options: [
      { id: 'A', text: 'The product is useful, but the brand story is not resonating.', cluster: 'Story Gap' },
      { id: 'B', text: 'Marketing is not reaching the right audience.', cluster: 'Launch Gap' },
      { id: 'C', text: 'The brand voice feels functional but forgettable.', cluster: 'Identity Gap' },
      { id: 'D', text: 'The communication is too scattered to build recall.', cluster: 'System Gap' }
    ]
  }
];

// --- HIGH-END UTILITIES ---

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => {
      setIsPointer(window.getComputedStyle(e.target).cursor === 'pointer' || e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'a');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseover', handleMouseOver); };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[999] mix-blend-difference hidden md:flex items-center justify-center"
      animate={{
        x: position.x - 8, y: position.y - 8,
        scale: isPointer ? 3 : 1,
        backgroundColor: isPointer ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,1)',
        border: isPointer ? '0.5px solid rgba(255,255,255,0.5)' : 'none'
      }}
      transition={{ type: 'spring', stiffness: 700, damping: 40, mass: 0.1 }}
    />
  );
};

const FadeIn = ({ children, delay = 0, className = "", direction = "up" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const yOffset = direction === "up" ? 30 : 0;
  
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ y: yOffset, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: yOffset, opacity: 0 }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const PremiumButton = ({ children, onClick, variant = "primary", className = "", type = "button" }) => {
  const baseStyle = "group relative inline-flex items-center justify-center px-8 py-4 font-medium tracking-wide transition-all duration-500 overflow-hidden rounded-[9px] text-sm";
  const variants = {
    primary: "bg-white text-[#05050A]",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20",
    ghost: "text-white/70 hover:text-white hover:bg-white/5"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

// Gradient Hover Component for Italics
const AnimatedItalic = ({ children, className = "" }) => {
  return (
    <span className={`relative group inline-block cursor-default font-serif italic pr-4 ${className}`}>
      {/* Base Layer - Normal static text */}
      <span className="relative z-10">
        {children}
      </span>
      
      {/* Wipe-in Gradient Layer */}
      <span 
        className="absolute left-0 top-0 w-full h-full z-20 text-transparent bg-clip-text bg-gradient-to-r from-[#8A5CFF] via-[#2563FF] to-[#8A5CFF] bg-[length:200%_auto] [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_-20px_0_0)] transition-[clip-path] duration-500 ease-out group-hover:animate-gradient"
        aria-hidden="true"
      >
        {children}
      </span>
      
      {/* Glow Layer */}
      <span 
        className="absolute left-0 top-0 w-full h-full z-0 text-transparent bg-clip-text bg-gradient-to-r from-[#8A5CFF] via-[#2563FF] to-[#8A5CFF] bg-[length:200%_auto] opacity-0 group-hover:opacity-60 blur-[16px] transition-opacity duration-500 group-hover:animate-gradient pointer-events-none select-none" 
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
};

// --- CORE PAGES ---

const HomePage = ({ navigate }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  const heroRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, px: 0, py: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const x = px / rect.width - 0.5;
    const y = py / rect.height - 0.5;
    setMouse({ x, y, px, py });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#05050A] min-h-screen text-[#F4F4F5] w-full">
      
      {/* Combined Hero & Trusted By Section - Set strictly to 100vh */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-screen min-h-[750px] flex flex-col overflow-hidden w-full pt-28"
      >
        {/* Layer 1: Background Orbs & Parallax */}
        <motion.div 
          style={{ y, opacity }} 
          className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center"
        >
          <motion.div
            animate={{ x: mouse.x * -40, y: mouse.y * -40 }}
            transition={{ type: "spring", stiffness: 30, damping: 20 }}
            className="relative w-full h-full flex justify-center items-center"
          >
            <div className="absolute w-[80vw] md:w-[600px] h-[80vw] md:h-[450px] bg-[#6D3BEF] rounded-[100%] blur-[120px] md:blur-[160px] opacity-[0.15] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute w-[60vw] md:w-[450px] h-[80vw] md:h-[600px] bg-[#2563FF] rounded-[100%] blur-[120px] md:blur-[160px] opacity-[0.12] mix-blend-screen translate-x-1/4" />
          </motion.div>
        </motion.div>

        {/* Layer 2: Autonomous Orbiting Moving Light */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center mix-blend-screen"
        >
          <div className="relative w-[140%] max-w-[1200px] h-[500px]">
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0, 0.4, 0],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-1/4 w-72 h-72 bg-white rounded-full blur-[100px]"
            />
          </div>
        </motion.div>

        {/* Layer 3: Interactive Cursor Spotlight */}
        <motion.div
          animate={{ 
            x: mouse.px - 400, // Center the 800x800 orb
            y: mouse.py - 400,
            opacity: isHovered ? 1 : 0 
          }}
          transition={{ 
            opacity: { duration: 0.8 }, 
            x: { type: "spring", stiffness: 100, damping: 25, mass: 0.5 }, 
            y: { type: "spring", stiffness: 100, damping: 25, mass: 0.5 } 
          }}
          className="absolute z-[5] pointer-events-none"
          style={{ width: '800px', height: '800px', left: 0, top: 0 }}
        >
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,rgba(138,92,255,0.03)_30%,transparent_60%)] mix-blend-screen" />
        </motion.div>

        {/* Layer 4: SVG Grid / Rings */}
        <motion.div 
          animate={{ rotate: 360, x: mouse.x * 20, y: mouse.y * 20 }}
          transition={{ rotate: { duration: 150, repeat: Infinity, ease: "linear" }, x: { type: "spring", stiffness: 40, damping: 20 }, y: { type: "spring", stiffness: 40, damping: 20 } }}
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.15] flex items-center justify-center origin-center"
        >
          <svg className="w-full max-w-[1000px] h-auto" viewBox="0 0 1000 1000" fill="none">
            <circle cx="500" cy="500" r="300" stroke="url(#paint0_linear)" strokeWidth="0.5" strokeDasharray="4 8"/>
            <circle cx="500" cy="500" r="450" stroke="url(#paint1_linear)" strokeWidth="0.5" />
            <circle cx="500" cy="500" r="200" stroke="url(#paint0_linear)" strokeWidth="1" strokeDasharray="1 16"/>
            <defs>
              <linearGradient id="paint0_linear" x1="200" y1="200" x2="800" y2="800" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity="0.5"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient>
              <linearGradient id="paint1_linear" x1="500" y1="50" x2="500" y2="950" gradientUnits="userSpaceOnUse"><stop stopColor="#6D3BEF" stopOpacity="0.4"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Layer 5: Random Glowing Gradient Lines */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40 mix-blend-screen">
          {[
            { top: '15%', left: '-10%', width: '80vw', rotate: 25, duration: 12, delay: 0, gradient: 'via-[#8A5CFF]' },
            { top: '70%', left: '-5%', width: '120vw', rotate: -15, duration: 18, delay: 2, gradient: 'via-[#2563FF]' },
            { top: '40%', left: '20%', width: '90vw', rotate: 45, duration: 15, delay: 1, gradient: 'via-[#8A5CFF]' },
            { top: '85%', left: '40%', width: '70vw', rotate: -35, duration: 14, delay: 3, gradient: 'via-[#2563FF]' },
            { top: '5%', left: '60%', width: '60vw', rotate: 60, duration: 16, delay: 4, gradient: 'via-white' }
          ].map((line, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 40, 0],
                y: [0, 20, 0],
                opacity: [0.1, 0.7, 0.1],
              }}
              transition={{
                duration: line.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: line.delay
              }}
              style={{
                position: 'absolute',
                top: line.top,
                left: line.left,
                width: line.width,
                height: '1px',
                rotate: line.rotate,
                transformOrigin: 'left center'
              }}
              className={`bg-gradient-to-r from-transparent ${line.gradient} to-transparent`}
            >
              {/* Internal glow */}
              <div className="absolute inset-0 w-full h-[2px] blur-[3px] bg-inherit" />
              <div className="absolute inset-0 w-full h-[6px] -top-[2px] blur-[10px] bg-inherit opacity-60" />
            </motion.div>
          ))}
        </div>

        {/* Foreground Main Content Container */}
        <div className="flex-1 flex flex-col justify-center px-[3%] relative z-10 w-full">
          <div className="flex flex-col items-start justify-start mb-8 w-full">
            <div className="overflow-hidden pb-2">
              <motion.h1 
                initial={{ y: "100%", opacity: 0, rotateZ: 2 }}
                animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="text-[clamp(3.2rem,8vw,7rem)] font-light tracking-[-0.06em] leading-[0.95] text-white origin-bottom text-left drop-shadow-lg"
              >
                Where breakthrough
              </motion.h1>
            </div>

            <div className="overflow-hidden pb-3">
              <motion.h1 
                initial={{ y: "100%", opacity: 0, rotateZ: 2 }}
                animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="text-[clamp(3.2rem,8vw,7rem)] font-light tracking-[-0.06em] leading-[0.95] text-white origin-bottom text-left drop-shadow-lg"
              >
                <AnimatedItalic className="text-white/60 mr-3 md:mr-5">innovators</AnimatedItalic>
                <span>find their voice.</span>
              </motion.h1>
            </div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg text-white/40 font-light max-w-3xl leading-relaxed tracking-wide mb-12"
          >
            PurpleBlue House decodes complex ideas into elegant communication systems. We help research teams, founders, and institutions become understood, trusted, and remembered.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start justify-start gap-4 sm:gap-6 w-full sm:w-auto"
          >
            <PremiumButton onClick={() => navigate('tools')} className="w-full sm:w-auto min-w-[240px] shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              Access Tools <Terminal className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
            </PremiumButton>
            <PremiumButton variant="secondary" onClick={() => navigate('services')} className="w-full sm:w-auto min-w-[240px]">
              Explore Services
            </PremiumButton>
          </motion.div>
        </div>

        {/* Scroll Indicator - Integrated into flow */}
        <div className="w-full px-[3%] flex justify-end pb-8 relative z-20 shrink-0">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
            className="flex items-center gap-4 text-white/30"
          >
            <span className="text-[9px] uppercase tracking-[0.2em] font-medium">Scroll to explore</span>
            <motion.div 
              animate={{ y: [0, 5, 0] }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#05050A]/50 backdrop-blur-md"
            >
              <ArrowDown className="w-4 h-4 text-[#8A5CFF]" />
              <motion.div 
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-[#8A5CFF]"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Sleek, Docked Trusted By Strip */}
        <div className="relative z-10 w-full border-t border-white/5 bg-[#05050A]/40 backdrop-blur-md h-14 md:h-16 shrink-0 flex items-center">
          <div className="flex items-center w-full h-full">
            {/* Title Block */}
            <div className="h-full flex items-center px-[3%] border-r border-white/5 bg-white/[0.02] shrink-0">
              <span className="text-[9px] md:text-xs font-medium text-white/40 uppercase tracking-[0.2em]">Trusted By</span>
            </div>
            
            {/* Scrolling Area */}
            <div className="flex-1 overflow-hidden h-full flex items-center [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
              <motion.div 
                className="flex items-center w-max pl-10"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
              >
                {[...Array(2)].map((_, arrayIndex) => (
                  <div key={arrayIndex} className="flex items-center gap-12 md:gap-24 shrink-0 pr-12 md:pr-24">
                    {['Observer Research Foundation', 'Snow Leopard Trust', 'Firefox Bikes', 'Sayre Therapeutics', 'India Global Forum'].map((brand, i) => (
                      <span key={i} className="text-xs md:text-sm font-serif italic tracking-wider text-white/40 hover:text-white transition-colors duration-500 cursor-default">
                        {brand}
                      </span>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="py-32 md:py-48 px-[3%] relative overflow-hidden w-full">
        <div className="absolute top-1/2 left-[3%] -translate-y-1/2 w-[800px] h-[300px] bg-[#8A5CFF] rounded-[100%] blur-[200px] opacity-[0.05] pointer-events-none" />
        <div className="w-full text-left relative z-10">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-white">
              We don't build cosmetic brands. <br className="hidden md:block" /> 
              We engineer <AnimatedItalic className="text-[#8A5CFF]">strategic architectures</AnimatedItalic> <br className="hidden md:block" />
              for ideas that matter.
            </h2>
          </FadeIn>
        </div>
      </section>

      {/* The Challenge - Editorial Layout */}
      <section className="py-24 px-[3%] relative border-t border-white/5 bg-[#0A0A0F]/50 w-full">
        <div className="w-full">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-20 max-w-3xl">
              Your innovation is flawless. <br/>
              <span className="text-white/40">The story surrounding it might be the bottleneck.</span>
            </h2>
          </FadeIn>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 w-full">
            {[
              { title: "Comprehension Gap", desc: "The market is deaf to complexity. If they don't understand the value instantly, the opportunity is lost." },
              { title: "Generic Aesthetic", desc: "Your visuals are modern but feel like a template. It feels safe, functional, but entirely forgettable." },
              { title: "Internal Misalignment", desc: "As you scale, teams interpret the brand differently. There is no unified system governing the narrative." },
            ].map((problem, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group">
                  <div className="w-8 h-8 rounded-[9px] border border-white/10 flex items-center justify-center mb-6 text-[#8A5CFF] group-hover:bg-[#8A5CFF] group-hover:text-white transition-colors">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">{problem.title}</h3>
                  <p className="text-white/50 font-light leading-relaxed max-w-lg">{problem.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* The Framework */}
      <section className="py-32 px-[3%] bg-[#0A0A0F] border-y border-white/5 w-full">
        <div className="w-full">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-start mb-16 gap-8 w-full">
              <div>
                <h2 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4">The Methodology</h2>
                <h3 className="text-3xl md:text-4xl font-light tracking-tight">Structured <AnimatedItalic className="text-white/50">Execution.</AnimatedItalic></h3>
              </div>
              <p className="text-white/40 font-light max-w-sm text-sm">A rigorous, four-phase system designed to extract truth and deploy it at scale.</p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {[
              { step: "01", title: "Decode Complexity", desc: "Extracting the core scientific or strategic truth from raw, complex data." },
              { step: "02", title: "Construct the Spine", desc: "Building the structural narrative and verbal identity frameworks." },
              { step: "03", title: "Design the System", desc: "Crafting a premium, scalable visual language and design architecture." },
              { step: "04", title: "Scale the Narrative", desc: "Deploying the communication system across institutional and market channels." }
            ].map((phase, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="border-t border-white/10 pt-8 group text-left">
                  <span className="text-[#8A5CFF] font-medium text-sm mb-6 block group-hover:translate-x-2 transition-transform">{phase.step}</span>
                  <h3 className="text-xl font-medium mb-4">{phase.title}</h3>
                  <p className="text-white/40 font-light text-sm leading-relaxed">{phase.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Systems Preview */}
      <section className="py-32 md:py-48 px-[3%] relative w-full">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2563FF] rounded-[100%] blur-[250px] opacity-[0.04] pointer-events-none" />
        <div className="w-full relative z-10">
          <FadeIn>
            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-end mb-16 gap-6 w-full">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight">Featured <AnimatedItalic className="text-white/50">Systems.</AnimatedItalic></h2>
              <PremiumButton variant="ghost" onClick={() => navigate('work')} className="px-0 py-0 hover:bg-transparent text-[#8A5CFF] sm:ml-auto">
                View Full Archive <ArrowRight className="w-4 h-4 ml-1" />
              </PremiumButton>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 w-full">
            {CASE_STUDIES.slice(0, 2).map((cs, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div 
                  onClick={() => navigate('work')}
                  className="group bg-[#0A0A0F] border border-white/5 rounded-[9px] p-10 md:p-12 hover:bg-[#0D0D14] hover:border-white/10 transition-all duration-500 cursor-pointer h-full flex flex-col justify-between min-h-[320px] text-left"
                >
                  <div>
                    <h3 className="text-3xl font-medium mb-4 group-hover:text-[#8A5CFF] transition-colors">{cs.client}</h3>
                    <p className="text-white/50 font-light text-lg mb-8 max-w-xl">{cs.challenge}</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {cs.tags.map(t => (
                      <span key={t} className="px-4 py-2 rounded-[9px] border border-white/10 bg-white/5 text-xs font-medium text-white/60 tracking-wide">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* High-Impact Testimonial */}
      <section className="py-32 md:py-48 px-[3%] bg-[#0A0A0F] border-y border-white/5 text-left relative overflow-hidden w-full">
        <div className="absolute top-0 left-[3%] w-[800px] h-[300px] bg-[#6D3BEF] rounded-[100%] blur-[180px] opacity-[0.08] pointer-events-none" />
        
        <div className="w-full max-w-5xl relative z-10">
          <FadeIn>
            <div className="text-6xl text-[#8A5CFF]/40 font-serif mb-8 leading-none">"</div>
            <h3 className="text-2xl md:text-4xl font-light leading-relaxed tracking-tight text-white/90 mb-12">
              They possess a rare ability to bridge the gap between profound scientific complexity and compelling human storytelling. The framework they built completely shifted how the market perceives our technology.
            </h3>
            <div className="flex flex-col items-start justify-start gap-2">
              <span className="text-sm font-medium tracking-wide text-white">Innovation Lead</span>
              <span className="text-xs tracking-widest text-white/40 uppercase">Translational Health Sector</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Sector Expertise */}
      <section className="py-32 md:py-40 px-[3%] relative w-full">
        <div className="w-full text-left">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-16">
              Operating at the intersection of <br className="hidden md:block" />
              <AnimatedItalic className="text-white/50">complex sectors.</AnimatedItalic>
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap justify-start gap-3 md:gap-4 w-full">
              {['Translational Health', 'Deep-Tech & AI', 'Public Policy & Governance', 'Venture Capital Ecosystems', 'Conservation & Impact', 'Purpose-Led Consumer', 'Research Institutions'].map((sector, i) => (
                <span key={i} className="px-6 py-3 rounded-[9px] border border-white/10 bg-white/[0.02] text-sm md:text-base font-light text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all cursor-default">
                  {sector}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pre-Footer CTA */}
      <section className="py-32 px-[3%] border-t border-white/5 relative overflow-hidden bg-gradient-to-b from-transparent to-[#0A0A0F] w-full">
        <div className="absolute bottom-0 left-[3%] w-full max-w-[1000px] h-[400px] bg-[#2563FF] rounded-[100%] blur-[250px] opacity-[0.07] pointer-events-none" />
        
        <div className="w-full text-left relative z-10">
          <FadeIn>
            <h2 className="text-xs font-medium text-[#2563FF] uppercase tracking-widest mb-6">The Next Step</h2>
            <h3 className="text-4xl md:text-6xl font-light tracking-tight mb-8">
              Your innovation is ready. <br/>
              <AnimatedItalic className="text-white/50">Is your narrative?</AnimatedItalic>
            </h3>
            <p className="text-white/40 font-light mb-12 text-lg max-w-2xl">
              Engage with our strategic tools to map the scope of your transformation.
            </p>
            <PremiumButton onClick={() => navigate('tools')}>
              Initialize Systems <Terminal className="w-4 h-4 ml-2 opacity-70" />
            </PremiumButton>
          </FadeIn>
        </div>
      </section>
    </motion.div>
  );
};

const AboutPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#05050A] min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full">
      <div className="w-full">
        <FadeIn>
          <div className="mb-24 text-left">
            <h2 className="text-xs font-medium text-[#8A5CFF] uppercase tracking-widest mb-6">The Studio</h2>
            <h1 className="text-5xl md:text-7xl font-light leading-[1.1] tracking-tight">
              Bold innovation deserves <br /> <AnimatedItalic className="text-white/50">bold storytelling.</AnimatedItalic>
            </h1>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="prose prose-invert prose-lg max-w-4xl text-white/60 font-light leading-relaxed mb-32 text-left">
            <p className="text-2xl text-white/80 mb-8">
              PurpleBlue House began as a brand communication studio harnessing SciArt—blending scientific precision with artistic expression to illuminate true innovation.
            </p>
            <p className="mb-6">
              Today, PBH is the definitive brand partner for breakthrough innovators. We don't just "polish" brands. We decode complexity, construct strategic spines, and design the visual systems required to help deep-tech teams, researchers, consumer disruptors, and institutions communicate ideas that are too important to remain misunderstood.
            </p>
            <p>
              We believe that the future is being built in labs, policy rooms, and founder garages right now. But building the future isnt enough; you must be able to explain it. That is where we come in.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="bg-[#0A0A0F] border border-white/5 rounded-[9px] p-12 md:p-16 flex flex-col md:flex-row gap-12 items-start w-full">
            <div className="w-48 h-48 rounded-[9px] border border-white/10 bg-white/5 flex-shrink-0 overflow-hidden relative">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#6D3BEF_0%,transparent_70%)] opacity-20 mix-blend-screen" />
            </div>
            <div className="text-left max-w-2xl">
              <h2 className="text-xs font-medium text-[#8A5CFF] uppercase tracking-widest mb-2">Founder-Led</h2>
              <h3 className="text-3xl font-medium mb-4">Prerita</h3>
              <p className="text-white/60 font-light leading-relaxed mb-6">
                With over a decade of experience across innovation, policy, public communication, and breakthrough storytelling, Prerita built PBH specifically for founders and institutions who are often too busy building the future to explain it clearly.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </motion.div>
  );
};

const ServicesPage = ({ navigate }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#05050A] min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] relative overflow-hidden w-full">
      <div className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-[#6D3BEF] rounded-[100%] blur-[250px] opacity-[0.05] pointer-events-none" />
      
      <div className="w-full relative z-10">
        <FadeIn>
          <div className="mb-24 text-left">
            <h1 className="text-5xl md:text-7xl font-light mb-6">Architectures <br/><AnimatedItalic className="text-white/50">of Clarity.</AnimatedItalic></h1>
            <p className="text-xl text-white/50 font-light max-w-2xl leading-relaxed">
              We structure our engagements through five distinct pathways, ensuring the deliverables precisely match the altitude of your innovation.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-6 w-full">
          {ROUTES.map((route, i) => (
            <FadeIn key={route.id} delay={i * 0.1}>
              <div className="group bg-[#0A0A0F] border border-white/5 rounded-[9px] p-10 md:p-12 hover:bg-[#0D0D14] hover:border-white/10 transition-all duration-500 w-full text-left">
                <div className="flex flex-col md:flex-row gap-8 md:items-start">
                  <div className="w-16 h-16 rounded-[9px] border border-white/10 flex items-center justify-center text-white/30 group-hover:text-[#8A5CFF] group-hover:border-[#8A5CFF]/30 transition-colors flex-shrink-0">
                    {route.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xs font-medium text-[#8A5CFF] tracking-widest uppercase mb-2">{route.tagline}</h2>
                    <h3 className="text-3xl font-medium mb-4">{route.title}</h3>
                    <p className="text-white/50 font-light leading-relaxed text-lg max-w-3xl">
                      {route.description}
                    </p>
                  </div>
                  <div className="md:pl-8 md:border-l border-white/10 flex-shrink-0 pt-6 md:pt-0">
                    <PremiumButton variant="secondary" onClick={() => navigate('tools')}>
                      Initialize <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
                    </PremiumButton>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', type: '', need: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#05050A] min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full">
      <div className="w-full grid md:grid-cols-2 gap-16 md:gap-24">
        
        <div className="text-left">
          <FadeIn>
            <h2 className="text-xs font-medium text-[#2563FF] uppercase tracking-widest mb-6">Secure Transmission</h2>
            <h1 className="text-5xl md:text-7xl font-light mb-8">Initiate <br/><AnimatedItalic className="text-white/50">Contact.</AnimatedItalic></h1>
            <p className="text-xl text-white/50 font-light leading-relaxed mb-12 max-w-lg">
              Whether you are ready to build a system, or simply evaluating partners for an upcoming leap, our intelligence unit is ready to assist.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 text-white/60">
                <Mail className="w-5 h-5 text-white/30" />
                <span className="font-light">strategy@purplebluehouse.com</span>
              </div>
              <div className="flex items-start gap-4 text-white/60">
                <Globe className="w-5 h-5 text-white/30" />
                <span className="font-light">Based in India. Operating Globally.</span>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="text-left">
          <FadeIn delay={0.2}>
            {submitted ? (
              <div className="bg-[#0A0A0F] border border-white/5 rounded-[9px] p-12 h-full flex flex-col justify-start items-start">
                <div className="w-16 h-16 border border-white/10 rounded-[9px] flex items-center justify-center mb-6 bg-white/5">
                  <CheckCircle2 className="w-8 h-8 text-[#2563FF]" />
                </div>
                <h3 className="text-2xl font-medium mb-4">Transmission Received</h3>
                <p className="text-white/50 font-light">Our strategy team will review your parameters and respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#0A0A0F] border border-white/5 rounded-[9px] p-10 space-y-8 w-full">
                <div className="grid sm:grid-cols-2 gap-6 w-full">
                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-3">Your Name</label>
                    <input required type="text" className="w-full bg-white/[0.02] border border-white/10 rounded-[9px] px-4 py-3 text-white focus:outline-none focus:border-[#2563FF]/50 transition-colors" onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-3">Work Email</label>
                    <input required type="email" className="w-full bg-white/[0.02] border border-white/10 rounded-[9px] px-4 py-3 text-white focus:outline-none focus:border-[#2563FF]/50 transition-colors" onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-3">I am a...</label>
                  <select required className="w-full bg-white/[0.02] border border-white/10 rounded-[9px] px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#2563FF]/50 transition-colors" onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="" className="bg-[#05050A]">Select profile...</option>
                    <option value="founder" className="bg-[#05050A]">Founder / Startup</option>
                    <option value="research" className="bg-[#05050A]">Research / Deep-tech Team</option>
                    <option value="institution" className="bg-[#05050A]">Institution / Policy Body</option>
                    <option value="consumer" className="bg-[#05050A]">Consumer Brand</option>
                    <option value="investor" className="bg-[#05050A]">Investor / Ecosystem</option>
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-3">System Required</label>
                  <textarea required rows={4} placeholder="Briefly describe the challenge or scope..." className="w-full bg-white/[0.02] border border-white/10 rounded-[9px] px-4 py-3 text-white focus:outline-none focus:border-[#2563FF]/50 transition-colors resize-none" onChange={e => setForm({...form, message: e.target.value})} />
                </div>

                <PremiumButton type="submit">Initialize Contact</PremiumButton>
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#05050A] min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] relative overflow-hidden w-full">
      <div className="absolute top-1/4 left-[3%] w-[800px] h-[400px] bg-[#6D3BEF] rounded-[100%] blur-[200px] opacity-[0.08] pointer-events-none" />

      <div className="w-full relative z-10">
        <FadeIn>
          <div className="mb-24 text-left">
            <h2 className="text-xs font-medium text-[#8A5CFF] uppercase tracking-widest mb-6">Engineering Bay</h2>
            <h1 className="text-5xl md:text-7xl font-light mb-6">Strategic <AnimatedItalic className="text-white/50">Tools.</AnimatedItalic></h1>
            <p className="text-xl text-white/50 font-light max-w-3xl leading-relaxed">
              Access our proprietary diagnostic and scoping systems to accurately map the parameters of your next build.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <FadeIn delay={0.1}>
            <div 
              onClick={() => navigate('quiz')}
              className="group cursor-pointer bg-[#0A0A0F] border border-white/5 rounded-[9px] p-10 hover:border-[#8A5CFF]/30 hover:bg-[#0D0D14] transition-all duration-500 relative overflow-hidden h-full flex flex-col text-left"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#8A5CFF] rounded-full blur-[120px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />
              <Activity className="w-8 h-8 text-white/30 group-hover:text-[#8A5CFF] mb-8 transition-colors" />
              <h3 className="text-2xl font-light mb-3">Brand Diagnostic</h3>
              <p className="text-white/50 font-light leading-relaxed mb-8 flex-grow text-sm">A structured evaluation to uncover where your brand narrative is experiencing friction or misalignment.</p>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-white/40 group-hover:text-white transition-colors">
                Run Sequence <MoveRight className="w-4 h-4" />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div 
              onClick={() => navigate('scope-builder')}
              className="group cursor-pointer bg-[#0A0A0F] border border-white/5 rounded-[9px] p-10 hover:border-[#2563FF]/30 hover:bg-[#0D0D14] transition-all duration-500 relative overflow-hidden h-full flex flex-col text-left"
            >
              <div className="absolute top-0 left-0 w-64 h-64 bg-[#2563FF] rounded-full blur-[120px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />
              <Hexagon className="w-8 h-8 text-white/30 group-hover:text-[#2563FF] mb-8 transition-colors" />
              <h3 className="text-2xl font-light mb-3">Scope Generator</h3>
              <p className="text-white/50 font-light leading-relaxed mb-8 flex-grow text-sm">Select exact deliverables, set priorities, and generate a tailored, proposal-ready scope document instantly.</p>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-white/40 group-hover:text-white transition-colors">
                Build Scope <MoveRight className="w-4 h-4" />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div 
              onClick={() => navigate('contact')}
              className="group cursor-pointer bg-[#0A0A0F] border border-white/5 rounded-[9px] p-10 hover:border-white/20 hover:bg-[#0D0D14] transition-all duration-500 relative overflow-hidden h-full flex flex-col text-left"
            >
              <MessageSquare className="w-8 h-8 text-white/30 group-hover:text-white mb-8 transition-colors" />
              <h3 className="text-2xl font-light mb-3">Strategy Call</h3>
              <p className="text-white/50 font-light leading-relaxed mb-8 flex-grow text-sm">Bypass the automated tools and initiate direct contact with our strategy team for a custom consultation.</p>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-white/40 group-hover:text-white transition-colors">
                Initiate <MoveRight className="w-4 h-4" />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </motion.div>
  );
};


// --- WORK PAGE ---

const WorkPage = () => {
  return (
    <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full">
      <div className="w-full text-left">
        <FadeIn>
          <div className="mb-24">
            <h1 className="text-5xl md:text-7xl font-light mb-6">System Archives</h1>
            <p className="text-xl text-white/50 font-light"><AnimatedItalic className="text-white/50">Decoded complexity. Engineered clarity.</AnimatedItalic></p>
          </div>
        </FadeIn>

        <div className="grid gap-6 w-full">
          {CASE_STUDIES.map((cs, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="group bg-[#0A0A0F] border border-white/5 rounded-[9px] p-10 flex flex-col md:flex-row justify-between items-start gap-8 hover:bg-[#0D0D14] hover:border-white/10 transition-all duration-500 cursor-pointer w-full text-left">
                <div className="flex-1">
                  <h3 className="text-3xl font-medium mb-3 group-hover:text-[#8A5CFF] transition-colors">{cs.client}</h3>
                  <p className="text-white/50 font-light text-lg max-w-2xl">{cs.challenge}</p>
                </div>
                
                <div className="flex gap-3 flex-wrap justify-start">
                  {cs.tags.map(t => (
                    <span key={t} className="px-4 py-2 rounded-[9px] border border-white/10 bg-white/5 text-xs font-medium text-white/60 tracking-wide whitespace-nowrap">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- CONCIERGE QUIZ ---

const QuizApp = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
    setTimeout(() => {
      if (currentStep < QUIZ_QUESTIONS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 500);
  };

  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#05050A] text-[#F4F4F5] flex flex-col items-start justify-center px-[3%] pt-32 w-full">
        <div className="w-full text-left">
          <div className="w-16 h-16 border border-white/10 rounded-[9px] flex items-center justify-center mb-8 bg-white/5">
            <CheckCircle2 className="w-8 h-8 text-[#8A5CFF]" />
          </div>
          <h2 className="text-xs font-medium tracking-widest uppercase text-[#8A5CFF] mb-4">Evaluation Complete</h2>
          <h1 className="text-4xl md:text-5xl font-light mb-8">
            Your brand requires a <br/><AnimatedItalic className="text-white/70">Structural Realignment.</AnimatedItalic>
          </h1>
          
          <div className="bg-[#0A0A0F] border border-white/5 p-10 rounded-[9px] text-left mb-12 max-w-3xl">
            <p className="text-white/60 font-light leading-relaxed mb-6">
              Based on your responses, the friction lies primarily in translating complex internal depth into external clarity. We recommend establishing a formal framework before producing new assets.
            </p>
            <div className="border-t border-white/5 pt-6 flex items-start gap-4">
              <Dna className="w-6 h-6 text-[#8A5CFF] shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-lg mb-1">Recommended: SciArt Saga</h4>
                <p className="text-white/40 text-sm font-light">Focus on innovation frameworks, experience strategy, and complex idea translation.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-start gap-4">
            <PremiumButton onClick={() => onComplete('scope-builder')}>Generate Scope</PremiumButton>
            <PremiumButton variant="ghost" onClick={() => onComplete('tools')} className="px-0 sm:px-8">Return to Hub</PremiumButton>
          </div>
        </div>
      </motion.div>
    );
  }

  const q = QUIZ_QUESTIONS[currentStep];
  const progress = ((currentStep) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] flex flex-col justify-center px-[3%] pt-32 pb-24 relative overflow-hidden w-full">
      <div className="absolute top-0 left-[3%] w-[800px] h-[400px] bg-[#6D3BEF] rounded-[100%] blur-[200px] opacity-[0.08] pointer-events-none" />

      <div className="w-full relative z-10">
        <div className="mb-20 text-left">
          <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6">
            Phase 0{currentStep + 1} of 0{QUIZ_QUESTIONS.length}
          </div>
          <div className="w-full max-w-xs h-[1px] bg-white/10 relative">
            <motion.div className="absolute top-0 left-0 h-full bg-[#8A5CFF]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="text-left w-full max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-light mb-16 leading-relaxed">
              {q.text}
            </h2>
            
            <div className="grid gap-4 w-full">
              {q.options.map((opt, i) => {
                const isSelected = answers[q.id]?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(q.id, opt)}
                    className={`text-left p-6 md:p-8 rounded-[9px] border transition-all duration-300 flex items-start gap-6 w-full ${
                      isSelected ? 'border-[#8A5CFF] bg-[#8A5CFF]/10 text-white' : 'border-white/10 hover:border-white/30 text-white/60 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    <span className="font-serif italic text-white/30 text-xl shrink-0 leading-none">{String.fromCharCode(65 + i)}</span>
                    <span className="text-lg font-light leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex justify-start items-center gap-8 w-full">
          <button 
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            className={`text-sm font-medium text-white/40 hover:text-white transition-colors flex items-center gap-2 ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <button onClick={() => onComplete('tools')} className="text-sm font-medium text-white/40 hover:text-white transition-colors">
             Abort
          </button>
        </div>
      </div>
    </div>
  );
};


// --- SCOPE BUILDER ---

const ScopeBuilderApp = ({ initialData, onComplete }) => {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState('');

  return (
    <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-40 px-[3%] pb-24 relative overflow-hidden w-full">
       <div className="absolute bottom-0 right-[3%] w-[600px] h-[600px] bg-[#2563FF] rounded-[100%] blur-[200px] opacity-[0.05] pointer-events-none" />

      <div className="w-full relative z-10 text-left">
        <FadeIn>
          <div className="mb-20">
            <h2 className="text-xs font-medium text-[#2563FF] uppercase tracking-widest mb-4">Project Architecture</h2>
            <h1 className="text-4xl md:text-6xl font-light mb-6">Scope Generator</h1>
            <p className="text-xl text-white/50 font-light max-w-2xl">Configure your organizational profile to generate a tailored framework.</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {[
              'Founder-Led Startup', 'Deep-Tech / Research', 
              'Consumer / FMCG Brand', 'Institution / Policy Body',
              'Venture / Ecosystem', 'Purpose-Led Organization'
            ].map(type => (
              <button 
                key={type} 
                className={`text-left p-8 rounded-[9px] border transition-all duration-300 font-light text-lg ${
                  projectType === type ? 'border-[#2563FF] bg-[#2563FF]/10 text-white' : 'border-white/10 hover:border-white/30 text-white/60 bg-white/[0.02]'
                }`}
                onClick={() => setProjectType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <div className="mt-16 flex justify-start items-center gap-8 w-full">
            <PremiumButton onClick={() => onComplete('tools')} disabled={!projectType}>
               Generate Framework
            </PremiumButton>
            <button onClick={() => onComplete('tools')} className="text-sm font-medium text-white/40 hover:text-white transition-colors">
              Return to Hub
            </button>
          </div>
        </FadeIn>
      </div>
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
      <header className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 w-full ${scrolled ? 'bg-[#05050A]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="w-full px-[3%] flex justify-between items-center">
          <div 
            className="text-lg font-medium tracking-wide cursor-pointer flex items-center gap-3" 
            onClick={() => { navigate('home'); setMobileMenu(false); }}
          >
            <img 
              src="https://static.wixstatic.com/media/32f09f_d2e483f6417246ba946ed54bbb518bb8~mv2.png/v1/fill/w_148,h_110,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/pbh-animated-gradient-2_edited.png" 
              alt="PurpleBlue House Logo" 
              className="h-8 w-auto object-contain"
            />
            PurpleBlue House
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide">
            {['work', 'services', 'about'].map(id => (
              <span 
                key={id} onClick={() => navigate(id)} 
                className={`cursor-pointer transition-colors capitalize ${current === id ? 'text-white' : 'text-white/50 hover:text-white'}`}
              >
                {id === 'work' ? 'Archive' : id}
              </span>
            ))}
            <button onClick={() => navigate('tools')} className="px-6 py-2.5 rounded-[9px] bg-white text-[#05050A] hover:bg-white/90 transition-colors">
              Engage
            </button>
          </nav>

          <button className="md:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} 
            className="fixed inset-0 z-[80] bg-[#05050A] pt-32 px-[3%] w-full"
          >
            <div className="flex flex-col items-start gap-8 text-2xl font-light w-full">
              <span onClick={() => { navigate('home'); setMobileMenu(false); }}>Home</span>
              {['work', 'services', 'about'].map(id => (
                <span key={id} onClick={() => { navigate(id); setMobileMenu(false); }} className="capitalize text-white/70 hover:text-white">
                  {id === 'work' ? 'Archive' : id}
                </span>
              ))}
              <span onClick={() => { navigate('tools'); setMobileMenu(false); }} className="text-[#8A5CFF] mt-4">
                Access Tools
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = ({ navigate }) => (
  <footer className="bg-[#05050A] border-t border-white/5 pt-32 pb-12 text-[#F4F4F5] px-[3%] w-full">
    <div className="w-full grid md:grid-cols-2 gap-16 mb-24 text-left">
      <div>
        <h2 className="text-4xl md:text-6xl font-light mb-8">Ready to <br/><span className="font-serif italic text-white/50">illuminate?</span></h2>
        <PremiumButton variant="secondary" onClick={() => navigate('tools')}>Access Tools</PremiumButton>
      </div>
      <div className="flex flex-col justify-end items-start text-sm font-medium tracking-wide space-y-4 text-white/50 md:pl-16">
        <p className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('services')}>Brand Boulevard</p>
        <p className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('services')}>SciArt Saga</p>
        <p className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('services')}>Institutional Systems</p>
      </div>
    </div>
    <div className="w-full border-t border-white/5 pt-8 text-xs font-medium text-white/30 uppercase tracking-widest flex flex-col md:flex-row gap-8 justify-between text-left">
      <p>© {new Date().getFullYear()} PurpleBlue House.</p>
      <div className="flex gap-6 justify-start">
        <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
        <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [currentPage]);

  return (
    <div className="bg-[#05050A] min-h-screen text-[#F4F4F5] font-sans w-full selection:bg-[#6D3BEF]/30 selection:text-white overflow-x-hidden">
      {/* Global CSS injection for arbitrary text gradient animations */}
      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .animate-gradient {
          animation: gradientFlow 3s linear infinite;
        }
      `}</style>
      
      <CustomCursor />
      <Header navigate={setCurrentPage} current={currentPage} />
      <main className="w-full">
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
