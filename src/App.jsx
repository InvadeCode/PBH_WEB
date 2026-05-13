import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring, useMotionValue, useMotionTemplate, useAnimationFrame } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Zap, CheckCircle2, 
  ArrowLeft, ArrowDown, Menu, X, Globe, MoveRight,
  Lightbulb, BookOpen, Fingerprint, Dna, Rocket,
  Mail, MessageSquare, Terminal, Layers, Compass, PenTool,
  ChevronUp, ChevronDown, Check, Briefcase, FileText, User, Activity,
  Shield, Lock, Scale, Target, BarChart2, Command, ArrowUpRight, CheckSquare,
  Quote, Printer, Download
} from 'lucide-react';


const QUIZ_QUESTIONS = [
  {
    id: 'stage',
    title: 'Where is your brand right now?',
    options: [
      { id: 's1', label: 'We are launching a new brand' },
      { id: 's2', label: 'We are repositioning an existing brand' },
      { id: 's3', label: 'We have grown, but our brand has not evolved' },
      { id: 's4', label: 'We need better campaigns and communication' },
      { id: 's5', label: 'We need a full strategic reset' }
    ]
  },
  {
    id: 'messaging',
    title: 'What feels most inconsistent about your brand right now?',
    options: [
      { id: 'm1', label: 'Different teams communicate differently', cluster: 'Messaging Inconsistency', routes: ['BB'] },
      { id: 'm2', label: 'Our message changes across platforms', cluster: 'Messaging Inconsistency', routes: ['BB'] },
      { id: 'm3', label: 'Our brand story lacks depth or emotional pull', cluster: 'Weak Narrative', routes: ['SAS', 'STC'] },
      { id: 'm4', label: 'Our visual identity feels generic or outdated', cluster: 'Generic Identity', routes: ['BB'] }
    ]
  },
  {
    id: 'execution',
    title: 'How does your team currently execute brand communication?',
    options: [
      { id: 'e1', label: 'Everyone creates things differently', cluster: 'Lack of Systems', routes: ['BB'] },
      { id: 'e2', label: 'There are no reusable design templates or playbooks', cluster: 'Lack of Systems', routes: ['BB', 'STC'] },
      { id: 'e3', label: 'Campaigns do not create enough response', cluster: 'Execution Gap', routes: ['STC'] },
      { id: 'e4', label: 'Translating complex ideas to market is difficult', cluster: 'Execution Gap', routes: ['SAS'] }
    ]
  }
];

const ROUTES_INFO = {
  'BB': { 
    id: 'BB', title: 'Brand Boulevard', 
    desc: 'Identity, positioning, messaging, and comprehensive brand systems.', 
    icon: <Fingerprint className="w-6 h-6" />, color: '#8A5CFF',
    lineItems: [
      { id: 'BB1', name: 'Brand Workshop & Audit' },
      { id: 'BB2', name: 'Brand Identity System' },
      { id: 'BB3', name: 'Design Systems' }
    ]
  },
  'SAS': { 
    id: 'SAS', title: 'SciArt Saga', 
    desc: 'Storytelling, innovation communication, and experience-led narratives.', 
    icon: <Lightbulb className="w-6 h-6" />, color: '#2563FF',
    lineItems: [
      { id: 'SAS1', name: 'Innovation Frameworks' },
      { id: 'SAS2', name: 'Product Storytelling' },
      { id: 'SAS3', name: 'GTM Communication' }
    ]
  },
  'STC': { 
    id: 'STC', title: 'Storytelling Corner', 
    desc: 'Campaign ideas, creative direction, and execution-ready content.', 
    icon: <Rocket className="w-6 h-6" />, color: '#F4F4F5',
    lineItems: [
      { id: 'STC1', name: 'Creative Direction' },
      { id: 'STC2', name: 'Campaign Storytelling' },
      { id: 'STC3', name: 'Content Systems' }
    ]
  }
};

const DELIVERABLES_MASTER = [
  // Brand Boulevard
  { id: 'd1', lineItem: 'BB1', name: 'Brand Audit', priority: 'Strategic Foundation', desc: 'Diagnostic review of current brand assets.' },
  { id: 'd2', lineItem: 'BB1', name: 'Positioning Territories', priority: 'Strategic Foundation', desc: 'Defining the strategic market gap.' },
  { id: 'd3', lineItem: 'BB2', name: 'Visual Identity System', priority: 'Core', desc: 'Logos, colors, typography, and visual language.' },
  { id: 'd4', lineItem: 'BB3', name: 'Brand Guidelines', priority: 'Execution Support', desc: 'Scalable rules for your internal teams.' },
  // SciArt Saga
  { id: 'd5', lineItem: 'SAS1', name: 'Innovation Narrative', priority: 'Strategic Foundation', desc: 'The overarching story of your innovation.' },
  { id: 'd6', lineItem: 'SAS2', name: 'Use Case Stories', priority: 'Core', desc: 'Translating features into human benefits.' },
  { id: 'd7', lineItem: 'SAS3', name: 'Launch Strategy', priority: 'Launch Critical', desc: 'GTM messaging and channel communication plan.' },
  // Storytelling Corner
  { id: 'd8', lineItem: 'STC1', name: 'Creative Strategy & Moodboard', priority: 'Strategic Foundation', desc: 'Visual direction for shoots and assets.' },
  { id: 'd9', lineItem: 'STC2', name: 'Campaign Idea & Narrative', priority: 'Launch Critical', desc: 'The big idea for your next launch.' },
  { id: 'd10', lineItem: 'STC3', name: 'Content Playbook & Templates', priority: 'Execution Support', desc: 'Recurring formats and publishing workflow.' }
];

const CASE_STUDIES = [
  { client: 'Aura Skincare', sector: 'Beauty', challenge: 'Elevating a cult favorite skincare line into a globally recognized luxury lifestyle brand.', route: 'Visual Identity', tags: ['Beauty', 'Packaging'], color: 'from-[#8A5CFF]' },
  { client: 'Lumina Tech', sector: 'Technology', challenge: 'Humanizing a complex AI platform through an approachable, vibrant, and modern design system.', route: 'Digital Experience', tags: ['Tech', 'UI/UX'], color: 'from-[#2563FF]' },
];

const PROBLEM_DATA = [
  { title: "Unclear messaging", icon: <MessageSquare className="w-6 h-6" />, color: "#8A5CFF" },
  { title: "Generic visual identity", icon: <Fingerprint className="w-6 h-6" />, color: "#2563FF" },
  { title: "Low campaign engagement", icon: <Activity className="w-6 h-6" />, color: "#8A5CFF" },
  { title: "Disconnected teams", icon: <Layers className="w-6 h-6" />, color: "#2563FF" },
  { title: "No repeatable brand system", icon: <Command className="w-6 h-6" />, color: "#8A5CFF" }
];

let GLOBAL_LEADS = [];


const GlobalFilmGrain = () => (
  <div className="pointer-events-none fixed inset-0 z-[50] opacity-[0.025] mix-blend-screen">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  useEffect(() => {
    const handleMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => setIsPointer(window.getComputedStyle(e.target).cursor === 'pointer' || e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'a');
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseover', handleMouseOver); };
  }, []);
  return (
    <motion.div className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[999] mix-blend-difference hidden md:flex items-center justify-center"
      animate={{ x: position.x - 8, y: position.y - 8, scale: isPointer ? 3 : 1, backgroundColor: isPointer ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,1)', border: isPointer ? '0.5px solid rgba(255,255,255,0.5)' : 'none' }}
      transition={{ type: 'spring', stiffness: 700, damping: 40, mass: 0.1 }} />
  );
};

const InteractiveFlowingLines = () => {
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1000, 
    height: typeof window !== 'undefined' ? window.innerHeight : 800 
  });
  
  const mouseX = useMotionValue(dimensions.width / 2);
  const mouseY = useMotionValue(dimensions.height / 2);

  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 20, mass: 2 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 20, mass: 2 });

  const path1 = useMotionValue("");
  const path2 = useMotionValue("");
  const path3 = useMotionValue("");

  useEffect(() => {
    const updateDims = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useAnimationFrame((t) => {
    const w = dimensions.width;
    const h = dimensions.height;
    
    const cx = smoothX.get();
    const cy = smoothY.get();

    const wave1 = Math.sin(t / 2000) * 150;
    const wave2 = Math.cos(t / 3000) * 150;
    const wave3 = Math.sin(t / 4000) * 150;

    const p1 = `M -200 ${h * 0.4 + wave1} Q ${cx + wave2} ${cy + wave3} ${w + 200} ${h * 0.6 - wave1}`;
    const p2 = `M -200 ${h * 0.8 + wave2} Q ${cx + wave3} ${cy - wave1} ${w + 200} ${h * 0.2 - wave2}`;
    const p3 = `M -200 ${h * 0.2 + wave3} Q ${cx - wave1} ${cy + wave2} ${w + 200} ${h * 0.8 - wave3}`;

    path1.set(p1);
    path2.set(p2);
    path3.set(p3);
  });

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
      <svg width="100%" height="100%" className="absolute inset-0 mix-blend-screen">
        <motion.path d={path1} fill="none" stroke="#8A5CFF" strokeWidth="1.5" opacity="0.7" />
        <motion.path d={path2} fill="none" stroke="#2563FF" strokeWidth="1" opacity="0.6" />
        <motion.path d={path3} fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
      </svg>
    </div>
  );
};

const SpotlightCard = ({ children, className = "", isActive = false }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <div className={`relative overflow-hidden group ${className}`} onMouseMove={handleMouseMove}>
      <motion.div className={`pointer-events-none absolute -inset-px rounded-[inherit] transition duration-500 z-0 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ background: useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(138, 92, 255, 0.12), transparent 80%)` }} />
      {children}
    </div>
  );
};


const ProblemHoverCard = ({ title, icon, color }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial="initial"
      whileHover="hover"
      className="group relative cursor-default p-6 bg-[#0A0A0F] border border-white/5 hover:border-white/10 rounded-[16px] flex flex-col justify-center h-40 overflow-hidden transition-colors duration-500 shadow-lg"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
        style={{ background: useMotionTemplate`radial-gradient(150px circle at ${mouseX}px ${mouseY}px, ${color}15, transparent 80%)` }}
      />
      <motion.div 
        variants={{ initial: { scale: 0.5, opacity: 0, x: -30, y: 30 }, hover: { scale: 2, opacity: 0.15, x: 0, y: 0 } }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -right-4 -bottom-4 w-28 h-28 blur-[25px] rounded-full pointer-events-none z-0"
        style={{ backgroundColor: color }}
      />
      <motion.div 
        variants={{ initial: { scale: 0.5, opacity: 0, x: 30, y: -30 }, hover: { scale: 1.5, opacity: 0.1, x: 0, y: 0 } }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="absolute -left-4 -top-4 w-20 h-20 blur-[20px] rounded-full pointer-events-none z-0"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10 flex flex-col items-start gap-4">
        <motion.div 
          variants={{ initial: { y: 15, opacity: 0, scale: 0.5 }, hover: { y: 0, opacity: 1, scale: 1 } }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="text-white drop-shadow-md"
          style={{ color: color === '#F4F4F5' ? '#FFFFFF' : color }}
        >
          {icon}
        </motion.div>
        <motion.span 
          variants={{ initial: { y: -8 }, hover: { y: 0 } }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="text-sm font-medium text-white/70 group-hover:text-white leading-snug"
        >
          {title}
        </motion.span>
      </div>
    </motion.div>
  );
};

const StepHoverCard = ({ num, title, desc, icon, color, isHovered, onHover, onLeave }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      animate={{ opacity: isHovered === false ? 0.4 : 1, y: isHovered === true ? -10 : 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative cursor-default p-8 bg-[#0A0A0F] border border-white/10 hover:border-white/20 rounded-[24px] flex flex-col min-h-[300px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-colors"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
        style={{ background: useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, ${color}15, transparent 80%)` }}
      />
      <motion.div 
        variants={{ initial: { scale: 0.8, opacity: 0 }, hover: { scale: 2, opacity: 0.1 } }}
        initial="initial" whileHover="hover" transition={{ duration: 0.7 }}
        className="absolute -right-10 -top-10 w-32 h-32 blur-[30px] rounded-full pointer-events-none z-0"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-12">
          <div className="w-14 h-14 rounded-[16px] bg-white/[0.03] border border-white/10 flex items-center justify-center transition-colors duration-500 group-hover:bg-white/[0.08]" style={{ color: color }}>
            {icon}
          </div>
          <span className="text-5xl font-serif italic text-white/5 group-hover:text-white/20 transition-colors duration-500">{num}</span>
        </div>
        <h4 className="text-2xl font-light mb-4 text-white mt-auto">{title}</h4>
        <p className="text-sm text-white/50 font-light leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
};

const DiagnoseVisual = () => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="absolute inset-0 flex flex-col items-center justify-center p-8">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,92,255,0.15)_0%,transparent_60%)]" />
    <div className="bg-[#05050A] border border-white/10 rounded-[16px] p-6 w-full max-w-sm mb-4 shadow-2xl relative z-10">
      <div className="w-1/2 h-2 bg-white/10 rounded-full mb-8" />
      <div className="space-y-4">
        <motion.div animate={{ borderColor: ['rgba(255,255,255,0.05)', 'rgba(138,92,255,0.6)', 'rgba(255,255,255,0.05)'] }} transition={{ duration: 2, repeat: Infinity }} className="h-12 bg-white/[0.02] border rounded-[8px] flex items-center px-4"><div className="w-4 h-4 rounded-full border border-white/20 mr-4"/><div className="w-2/3 h-2 bg-white/20 rounded-full"/></motion.div>
        <div className="h-12 bg-white/[0.02] border border-white/5 rounded-[8px] flex items-center px-4"><div className="w-4 h-4 rounded-full border border-white/20 mr-4"/><div className="w-1/2 h-2 bg-white/10 rounded-full"/></div>
        <div className="h-12 bg-white/[0.02] border border-white/5 rounded-[8px] flex items-center px-4"><div className="w-4 h-4 rounded-full border border-white/20 mr-4"/><div className="w-3/4 h-2 bg-white/10 rounded-full"/></div>
      </div>
    </div>
  </motion.div>
);

const MapVisual = () => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="absolute inset-0 flex items-center justify-center p-8">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,255,0.15)_0%,transparent_60%)]" />
    <div className="flex items-center gap-6 relative z-10 w-full max-w-md">
      <div className="flex flex-col gap-4 flex-1">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="px-4 py-3 bg-white/5 border border-white/10 rounded-[8px] text-[10px] text-white/50 text-center uppercase tracking-widest">Inconsistent Identity</motion.div>
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="px-4 py-3 bg-white/5 border border-white/10 rounded-[8px] text-[10px] text-white/50 text-center uppercase tracking-widest">Weak Narrative</motion.div>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <motion.div className="h-[2px] bg-gradient-to-r from-transparent via-[#2563FF] to-transparent w-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
      </div>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="flex-1 bg-gradient-to-br from-[#2563FF]/20 to-transparent border border-[#2563FF]/30 p-6 rounded-[16px] text-center flex flex-col items-center justify-center aspect-square shadow-[0_0_30px_rgba(37,99,255,0.2)]">
        <Layers className="w-8 h-8 text-[#2563FF] mb-3" />
        <div className="text-xs text-white font-medium tracking-wide">Brand<br/>Boulevard</div>
      </motion.div>
    </div>
  </motion.div>
);

const BuildVisual = () => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="absolute inset-0 flex items-center justify-center p-8">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,92,255,0.15)_0%,transparent_60%)]" />
    <div className="bg-[#05050A] border border-white/10 rounded-[16px] p-8 w-full max-w-sm shadow-2xl relative z-10">
      <h4 className="text-[10px] uppercase tracking-widest text-[#8A5CFF] mb-6 flex items-center gap-2"><PenTool className="w-4 h-4"/> Scope Blueprint</h4>
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="flex items-center gap-4">
            <div className="w-5 h-5 rounded bg-[#8A5CFF]/20 flex items-center justify-center shrink-0 border border-[#8A5CFF]/40"><Check className="w-3 h-3 text-[#8A5CFF]" /></div>
            <div className="flex-1 h-2.5 bg-white/10 rounded-full" />
            <div className="w-1/4 h-2.5 bg-white/5 rounded-full" />
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

const StartVisual = () => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="absolute inset-0 flex flex-col items-center justify-center p-8">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,255,0.15)_0%,transparent_60%)]" />
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="w-24 h-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
      <CheckCircle2 className="w-12 h-12 text-green-500" />
    </motion.div>
    <motion.h4 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-light text-white mb-2 relative z-10">Brief Generated</motion.h4>
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="px-8 py-3 bg-white text-black text-xs font-medium uppercase tracking-widest rounded-full relative z-10 mt-6 cursor-pointer hover:scale-105 transition-transform">Schedule Discovery</motion.div>
  </motion.div>
);


const InteractiveHowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { num: '01', title: 'Diagnose', desc: 'Answer focused questions about your brand, teams, communication, and growth stage.', icon: <Target className="w-6 h-6" />, color: '#8A5CFF' },
    { num: '02', title: 'Map', desc: 'We identify your problem clusters and route you to the right strategic service paths.', icon: <Compass className="w-6 h-6" />, color: '#2563FF' },
    { num: '03', title: 'Build', desc: 'Select priorities, deliverables, timelines, and depth to create a custom scope.', icon: <Layers className="w-6 h-6" />, color: '#8A5CFF' },
    { num: '04', title: 'Start', desc: 'Submit your scope and begin the first conversation with clarity, not guesswork.', icon: <Rocket className="w-6 h-6" />, color: '#2563FF' }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-16 items-center w-full relative z-10 text-left">
      <div className="w-full lg:w-5/12 flex flex-col relative">
        <div className="absolute left-[23px] top-8 bottom-8 w-[2px] bg-white/5" />
        <motion.div
          className="absolute left-[23px] w-[2px] bg-gradient-to-b from-[#8A5CFF] to-[#2563FF]"
          animate={{ top: `${activeStep * 33}%`, height: '33%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        {steps.map((s, i) => {
            const isActive = activeStep === i;
            return (
              <div key={i} onMouseEnter={() => setActiveStep(i)} className={`relative flex items-start gap-8 p-6 rounded-[16px] cursor-pointer transition-all duration-500 ${isActive ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'}`}>
                <div className={`relative z-10 w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500 ${isActive ? 'border-[#8A5CFF] bg-[#8A5CFF]/10' : 'border-white/10 bg-[#0A0A0F]'}`}>
                  <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isActive ? 'bg-[#8A5CFF] scale-100' : 'bg-white/20 scale-50'}`} />
                </div>
                <div>
                  <h3 className={`text-2xl font-light mb-2 transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/40'}`}>{s.num}. {s.title}</h3>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm font-light text-white/50 leading-relaxed overflow-hidden">
                        {s.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
        })}
      </div>
      <div className="w-full lg:w-7/12 h-[450px] bg-[#0A0A0F] border border-white/10 rounded-[24px] relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <AnimatePresence mode="wait">
            {activeStep === 0 && <DiagnoseVisual key="diag" />}
            {activeStep === 1 && <MapVisual key="map" />}
            {activeStep === 2 && <BuildVisual key="build" />}
            {activeStep === 3 && <StartVisual key="start" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

const RevealText = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div initial={{ y: "100%", opacity: 0, rotateZ: 2 }} animate={isInView ? { y: 0, opacity: 1, rotateZ: 0 } : { y: "100%", opacity: 0, rotateZ: 2 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay }} className="origin-bottom">{children}</motion.div>
    </div>
  );
};

const AnimatedItalic = ({ children, className = "" }) => (
  <span className={`inline-block font-serif italic cursor-default transition-all duration-500 hover:drop-shadow-[0_0_20px_rgba(138,92,255,0.6)] pr-2 ${className}`}>{children}</span>
);

const PremiumButton = ({ children, onClick, variant = "primary", className = "", type = "button", disabled = false }) => {
  const buttonRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const smoothY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    if (disabled || !buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    x.set(distanceX * 0.15); 
    y.set(distanceY * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variants = {
    primary: "bg-white text-[#05050A] hover:bg-white/90",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20",
    ghost: "text-white/70 hover:text-white hover:bg-white/5"
  };

  return (
    <motion.button 
      ref={buttonRef}
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: smoothX, y: smoothY }}
      className={`group relative inline-flex items-center justify-center px-8 py-4 font-medium tracking-wide transition-all duration-500 overflow-hidden rounded-[9px] text-sm hover:scale-[1.02] ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && !disabled && <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out skew-x-12" />}
    </motion.button>
  );
};

// --- DATA VISUALIZATION: BRAND HEALTH RADAR ---

const BrandHealthRadar = ({ clusters }) => {
  const data = [
    { label: 'Messaging', score: clusters.includes('Messaging Inconsistency') ? 35 : 90 },
    { label: 'Identity', score: clusters.includes('Generic Identity') ? 40 : 85 },
    { label: 'Narrative', score: clusters.includes('Weak Narrative') ? 30 : 85 },
    { label: 'Systems', score: clusters.includes('Lack of Systems') ? 25 : 80 },
    { label: 'Execution', score: clusters.includes('Execution Gap') ? 45 : 85 },
  ];

  const overallScore = Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / data.length);
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const levels = [0.2, 0.4, 0.6, 0.8, 1];

  const getPoint = (value, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    return {
      x: center + radius * value * Math.cos(angle),
      y: center + radius * value * Math.sin(angle)
    };
  };

  const dataPoints = data.map((d, i) => {
    const p = getPoint(d.score / 100, i, data.length);
    return `${p.x},${p.y}`;
  }).join(' ');

  return (
    <div className="relative w-full max-w-[340px] aspect-square mx-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-[#8A5CFF] opacity-10 blur-[60px] rounded-full pointer-events-none" />
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible drop-shadow-2xl">
        {levels.map((level, i) => {
          const points = data.map((_, j) => {
            const p = getPoint(level, j, data.length);
            return `${p.x},${p.y}`;
          }).join(' ');
          return (
            <polygon key={i} points={points} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          );
        })}
        {data.map((_, i) => {
          const p = getPoint(1, i, data.length);
          return (
            <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          );
        })}
        <motion.polygon 
          points={dataPoints}
          fill="rgba(138,92,255,0.2)"
          stroke="#8A5CFF"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.2 }}
          style={{ transformOrigin: `${center}px ${center}px` }}
          className="mix-blend-screen"
        />
        {data.map((d, i) => {
          const p = getPoint(d.score / 100, i, data.length);
          return (
            <motion.circle 
              key={i} cx={p.x} cy={p.y} r="4" fill="#ffffff" 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }}
            />
          );
        })}
        {data.map((d, i) => {
          const p = getPoint(1.25, i, data.length);
          return (
            <motion.text 
              key={i} x={p.x} y={p.y} 
              fill="rgba(255,255,255,0.5)" 
              fontSize="10" 
              textAnchor="middle" 
              alignmentBaseline="middle"
              className="uppercase tracking-widest font-medium"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            >
              {d.label}
            </motion.text>
          );
        })}
      </svg>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-[#05050A]/80 backdrop-blur-md w-16 h-16 rounded-full justify-center border border-white/10 shadow-xl"
      >
        <span className="text-xl font-light text-white leading-none">{overallScore}</span>
        <span className="text-[8px] uppercase tracking-widest text-[#8A5CFF]">Index</span>
      </motion.div>
    </div>
  );
};


// --- STRATEGIC ENGINE (SCOPE BUILDER) ---

const StrategicEngine = ({ navigate }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [clusters, setClusters] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [selectedDeliverables, setSelectedDeliverables] = useState([]);
  const [context, setContext] = useState({ depth: '', timeline: '' });
  const [leadForm, setLeadForm] = useState({ name: '', email: '', company: '' });
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  const handleQuizSelect = (questionId, option) => {
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (step < QUIZ_QUESTIONS.length) {
        setStep(step + 1);
      } else {
        processDiagnosis(newAnswers);
      }
    }, 400);
  };

  const processDiagnosis = (finalAnswers) => {
    const foundClusters = new Set();
    const foundRoutes = new Set();
    Object.values(finalAnswers).forEach(opt => {
      if (opt.cluster) foundClusters.add(opt.cluster);
      if (opt.routes) opt.routes.forEach(r => foundRoutes.add(r));
    });
    setClusters(Array.from(foundClusters));
    const recRoutes = Array.from(foundRoutes).length > 0 ? Array.from(foundRoutes) : ['BB'];
    setRoutes(recRoutes);
    setSelectedRoutes(recRoutes);
    setStep(4);
  };

  const submitLead = (e) => {
    e.preventDefault();
    GLOBAL_LEADS.push({
      ...leadForm, stage: answers.stage?.label, clusters, routes,
      deliverables: selectedDeliverables, ...context,
      date: new Date().toISOString(), status: 'New', score: Math.floor(Math.random() * 40) + 60
    });
    setStep(9);
  };

  const LiveScopePreview = () => (
    <div className="bg-[#0A0A0F] border border-white/10 rounded-[24px] p-8 flex flex-col h-full shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#8A5CFF] opacity-[0.03] blur-[100px] pointer-events-none" />
      <h3 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Live Blueprint</h3>
      <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
        <div className={`transition-opacity duration-500 ${answers.stage ? 'opacity-100' : 'opacity-20'}`}>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Brand Stage</div>
          <div className="text-sm font-light text-white">{answers.stage ? answers.stage.label : 'Pending...'}</div>
        </div>
        <div className={`transition-opacity duration-500 ${clusters.length > 0 ? 'opacity-100' : 'opacity-20'}`}>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Identified Gaps</div>
          <div className="flex flex-wrap gap-2">
            {clusters.map(c => <span key={c} className="px-2 py-1 bg-[#8A5CFF]/10 text-[#8A5CFF] text-[10px] uppercase tracking-widest rounded border border-[#8A5CFF]/20">{c}</span>)}
          </div>
        </div>
        <div className={`transition-opacity duration-500 ${selectedDeliverables.length > 0 ? 'opacity-100' : 'opacity-20'}`}>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Scope Blueprint</div>
          {selectedDeliverables.length > 0 ? (
            <ul className="space-y-2">
              {DELIVERABLES_MASTER.filter(d => selectedDeliverables.includes(d.id)).map(d => (
                <li key={d.id} className="text-xs font-light text-white flex items-start gap-2">
                  <Check className="w-3 h-3 text-[#2563FF] shrink-0 mt-[2px]" /> {d.name}
                </li>
              ))}
            </ul>
          ) : <div className="text-xs font-light text-white/30 italic">Awaiting selection...</div>}
        </div>
      </div>
    </div>
  );

  const steps = [
    // Step 0: Welcome
    <div key="s0" className="flex flex-col justify-center h-full max-w-2xl text-left">
      <div className="w-16 h-16 bg-[#8A5CFF]/10 border border-[#8A5CFF]/30 rounded-[16px] flex items-center justify-center mb-8"><Fingerprint className="w-8 h-8 text-[#8A5CFF]" /></div>
      <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6 leading-[1.1]">Build your <AnimatedItalic className="text-[#8A5CFF]">strategic</AnimatedItalic> brand scope.</h1>
      <p className="text-lg md:text-xl text-white/50 font-light mb-12 leading-relaxed">This is not a generic form. It is a guided discovery system. We’ll map your gaps, define service priorities, and generate a customized roadmap before our first conversation.</p>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <PremiumButton onClick={() => setStep(1)} className="w-full sm:w-auto px-10 py-5">Start Assessment</PremiumButton>
        <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 py-2"><ArrowLeft className="w-4 h-4"/> Back to Home</button>
      </div>
    </div>,

    // Steps 1-3: Quiz Questions
    ...QUIZ_QUESTIONS.map((q, i) => (
      <div key={`q${i}`} className="flex flex-col justify-center h-full max-w-2xl w-full text-left">
        <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6">Phase 1 / Diagnosis ({i+1}/3)</div>
        <h2 className="text-3xl md:text-4xl font-light mb-10">{q.title}</h2>
        <div className="space-y-3 w-full">
          {q.options.map((opt, j) => (
            <button key={opt.id} onClick={() => handleQuizSelect(q.id, opt)} className={`w-full text-left p-5 rounded-[12px] border transition-all duration-300 flex items-center gap-4 ${answers[q.id]?.id === opt.id ? 'border-[#8A5CFF] bg-[#8A5CFF]/10 text-white' : 'border-white/10 hover:border-white/30 text-white/60 bg-white/[0.02]'}`}>
              <span className="font-serif italic opacity-40 text-lg w-6">0{j+1}</span>
              <span className="text-lg font-light">{opt.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-8 flex"><button onClick={() => setStep(step === 1 ? 0 : step - 1)} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Back</button></div>
      </div>
    )),

    // Step 4: Diagnosis Result
    <div key="s4" className="flex flex-col justify-center h-full max-w-3xl w-full text-left">
      <div className="text-xs font-medium text-[#8A5CFF] uppercase tracking-widest mb-6 flex items-center gap-2"><Sparkles className="w-4 h-4"/> Strategic Diagnosis</div>
      <h2 className="text-3xl md:text-4xl font-light mb-6">Your brand opportunity areas.</h2>
      <p className="text-white/50 font-light mb-12 text-lg">Based on your answers, your communication is currently breaking due to <strong className="text-white">{clusters.join(' & ')}</strong>. We recommend structuring your project around these core ecosystems:</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-12 w-full">
        {routes.map(r => (
          <div key={r} className="bg-white/[0.02] border border-white/10 rounded-[16px] p-6 text-left flex flex-col">
            <div className="w-12 h-12 rounded-[12px] bg-white/5 border border-white/10 flex items-center justify-center mb-6" style={{ color: ROUTES_INFO[r].color }}>{ROUTES_INFO[r].icon}</div>
            <h4 className="text-xl font-medium mb-2">{ROUTES_INFO[r].title}</h4>
            <p className="text-sm text-white/40 font-light leading-relaxed">{ROUTES_INFO[r].desc}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-6 items-center">
        <PremiumButton onClick={() => setStep(5)}>Customize Scope</PremiumButton>
        <button onClick={() => setStep(3)} className="text-white/40 hover:text-white text-sm transition-colors">Back</button>
      </div>
    </div>,

    // Step 5: Route Selection
    <div key="s5" className="flex flex-col justify-center h-full max-w-2xl w-full text-left">
      <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6">Phase 2 / Architecture</div>
      <h2 className="text-3xl md:text-4xl font-light mb-6">Select your service routes.</h2>
      <p className="text-white/50 font-light mb-10">We pre-selected routes based on your diagnosis. Add or remove routes to define your scope foundation.</p>
      <div className="space-y-4 w-full mb-12">
        {Object.values(ROUTES_INFO).map(route => {
          const isSelected = selectedRoutes.includes(route.id);
          return (
            <button key={route.id} onClick={() => setSelectedRoutes(prev => isSelected ? prev.filter(r => r !== route.id) : [...prev, route.id])} className={`w-full text-left p-6 rounded-[16px] border transition-all duration-300 flex items-center gap-6 ${isSelected ? 'border-[#2563FF] bg-[#2563FF]/10' : 'border-white/10 hover:border-white/30 bg-white/[0.02]'}`}>
              <div className={`w-6 h-6 rounded flex items-center justify-center border ${isSelected ? 'bg-[#2563FF] border-[#2563FF]' : 'border-white/30'}`}>{isSelected && <Check className="w-4 h-4 text-white"/>}</div>
              <div>
                <div className={`text-lg font-medium mb-1 ${isSelected ? 'text-white' : 'text-white/70'}`}>{route.title}</div>
                <div className="text-sm font-light text-white/40">{route.desc}</div>
              </div>
            </button>
          )
        })}
      </div>
      <div className="flex gap-6 items-center">
        <PremiumButton disabled={selectedRoutes.length === 0} onClick={() => setStep(6)}>Select Deliverables</PremiumButton>
        <button onClick={() => setStep(4)} className="text-white/40 hover:text-white text-sm transition-colors">Back</button>
      </div>
    </div>,

    // Step 6: Deliverables Selection
    <div key="s6" className="flex flex-col h-full max-w-3xl w-full py-10 text-left">
      <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6">Phase 3 / Details</div>
      <h2 className="text-3xl md:text-4xl font-light mb-2">Build Your Scope</h2>
      <p className="text-white/50 font-light mb-10">Select the specific deliverables you need across your chosen routes.</p>
      <div className="space-y-10 w-full pb-10">
        {selectedRoutes.map(rId => {
          const route = ROUTES_INFO[rId];
          return (
            <div key={rId}>
              <h4 className="text-sm font-medium text-[#8A5CFF] tracking-widest uppercase mb-4 pb-2 border-b border-white/5 flex items-center gap-2">{route.icon} {route.title}</h4>
              <div className="space-y-6">
                {route.lineItems.map(li => {
                  const delivs = DELIVERABLES_MASTER.filter(d => d.lineItem === li.id);
                  if (delivs.length === 0) return null;
                  return (
                    <div key={li.id} className="bg-white/[0.01] border border-white/5 rounded-[12px] p-6">
                      <h5 className="font-medium text-white/80 mb-4">{li.name}</h5>
                      <div className="grid gap-3">
                        {delivs.map(d => {
                          const isSelected = selectedDeliverables.includes(d.id);
                          return (
                            <button key={d.id} onClick={() => setSelectedDeliverables(prev => isSelected ? prev.filter(x => x !== d.id) : [...prev, d.id])} className={`p-4 rounded-[8px] border text-left transition-all flex items-start gap-4 ${isSelected ? 'border-[#2563FF] bg-[#2563FF]/10' : 'border-white/10 hover:border-white/30 bg-white/[0.03]'}`}>
                              <div className={`w-4 h-4 rounded-sm border mt-1 flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#2563FF] border-[#2563FF]' : 'border-white/30'}`}>{isSelected && <Check className="w-3 h-3 text-white" />}</div>
                              <div>
                                <div className={`font-medium text-sm mb-1 ${isSelected ? 'text-white' : 'text-white/70'}`}>{d.name}</div>
                                <div className="text-xs text-white/40">{d.desc}</div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <div className="pt-8 border-t border-white/10 mt-auto flex gap-6 items-center">
        <PremiumButton disabled={selectedDeliverables.length === 0} onClick={() => setStep(7)}>Next: Project Context</PremiumButton>
        <button onClick={() => setStep(5)} className="text-white/40 hover:text-white text-sm transition-colors">Back</button>
      </div>
    </div>,

    // Step 7: Context
    <div key="s7" className="flex flex-col justify-center h-full max-w-2xl w-full text-left">
      <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6">Phase 4 / Execution</div>
      <h2 className="text-3xl md:text-4xl font-light mb-10">Project Context.</h2>
      <div className="space-y-6 w-full mb-12">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-3">What level of support are you looking for?</label>
          <select value={context.depth} onChange={e=>setContext({...context, depth: e.target.value})} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none focus:border-[#2563FF] appearance-none">
            <option value="" className="bg-[#05050A]">Select depth...</option>
            <option value="Light-touch consulting" className="bg-[#05050A]">Light-touch consulting</option>
            <option value="Strategic direction + selected assets" className="bg-[#05050A]">Strategic direction + selected assets</option>
            <option value="End-to-end brand transformation" className="bg-[#05050A]">End-to-end brand transformation</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/60 mb-3">When do you want to begin?</label>
          <select value={context.timeline} onChange={e=>setContext({...context, timeline: e.target.value})} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none focus:border-[#2563FF] appearance-none">
            <option value="" className="bg-[#05050A]">Select timeline...</option>
            <option value="Immediately" className="bg-[#05050A]">Immediately</option>
            <option value="Within 2-4 weeks" className="bg-[#05050A]">Within 2–4 weeks</option>
            <option value="This quarter" className="bg-[#05050A]">This quarter</option>
          </select>
        </div>
      </div>
      <div className="flex gap-6 items-center">
        <PremiumButton disabled={!context.depth || !context.timeline} onClick={() => setStep(8)}>Finalize Blueprint</PremiumButton>
        <button onClick={() => setStep(6)} className="text-white/40 hover:text-white text-sm transition-colors">Back</button>
      </div>
    </div>,

    // Step 8: Lead Capture
    <div key="s8" className="flex flex-col justify-center h-full max-w-2xl w-full text-left">
      <div className="text-xs font-medium text-[#2563FF] uppercase tracking-widest mb-6">Final Step</div>
      <h2 className="text-3xl md:text-4xl font-light mb-6">Where should we send your Scope Snapshot?</h2>
      <p className="text-white/50 font-light mb-10 text-lg">Enter your details below to instantly generate your strategy report and brief our consulting team.</p>
      <form onSubmit={submitLead} className="space-y-4 w-full">
        <input required type="text" placeholder="Full Name" value={leadForm.name} onChange={e=>setLeadForm({...leadForm, name: e.target.value})} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none focus:border-[#2563FF]" />
        <input required type="email" placeholder="Work Email" value={leadForm.email} onChange={e=>setLeadForm({...leadForm, email: e.target.value})} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none focus:border-[#2563FF]" />
        <input required type="text" placeholder="Company / Brand Name" value={leadForm.company} onChange={e=>setLeadForm({...leadForm, company: e.target.value})} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none focus:border-[#2563FF]" />
        <div className="pt-6 flex gap-4 items-center">
          <PremiumButton type="submit" className="w-full sm:w-auto px-10">Generate Report & Send Brief</PremiumButton>
          <button type="button" onClick={() => setStep(7)} className="text-white/40 hover:text-white text-sm transition-colors">Back</button>
        </div>
      </form>
    </div>,

    // Step 9: The Scope Snapshot Report (WITH RADAR CHART)
    <div key="s9" className="flex flex-col justify-center h-full w-full py-12">
      <div className="relative p-[1px] rounded-[24px] bg-gradient-to-b from-white/20 to-white/5 max-w-5xl w-full mx-auto">
        <div className="bg-[#05050A] rounded-[23px] p-8 md:p-14 relative overflow-hidden text-left shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col md:flex-row justify-between items-start border-b border-white/10 pb-8 mb-10 relative z-10 gap-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#8A5CFF] mb-3 font-medium flex items-center gap-2"><FileText className="w-4 h-4"/> Official Scope Snapshot</div>
              <h2 className="text-4xl font-light text-white mb-2">{leadForm.company || 'Your Brand'}</h2>
              <p className="text-white/50 text-sm">Prepared for {leadForm.name || 'Client'}</p>
            </div>
            <div className="md:text-right">
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Date Generated</div>
              <div className="text-sm font-medium text-white/70">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 relative z-10">
            {/* Left Side: Data & Strategy */}
            <div className="space-y-10">
              {/* Radar Chart Data Visualization */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[16px] p-8 mb-8 relative overflow-hidden">
                 <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-8">Diagnostic Brand Health</h4>
                 <BrandHealthRadar clusters={clusters} />
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-4 border-b border-white/5 pb-2">Recommended Ecosystems</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoutes.map(r => <span key={r} className="px-3 py-1.5 bg-white/5 text-white/70 text-xs border border-white/10 rounded-full flex items-center gap-2">{ROUTES_INFO[r]?.icon} {ROUTES_INFO[r]?.title}</span>)}
                </div>
              </div>
              
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-4 border-b border-white/5 pb-2">Execution Context</h4>
                <div className="text-sm text-white/70 font-light space-y-3 bg-white/[0.02] p-6 rounded-[12px] border border-white/5">
                  <p className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Brand Stage</span> <span className="text-right">{answers.stage?.label}</span></p>
                  <p className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Timeline</span> <span className="text-right">{context.timeline}</span></p>
                  <p className="flex justify-between"><span className="text-white/40">Engagement Depth</span> <span className="text-right">{context.depth}</span></p>
                </div>
              </div>
            </div>
            
            {/* Right Side: Execution Blueprint */}
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-4 border-b border-white/5 pb-2">Selected Deliverables Blueprint</h4>
              <ul className="space-y-4">
                {DELIVERABLES_MASTER.filter(d => selectedDeliverables.includes(d.id)).map(d => (
                  <li key={d.id} className="flex items-start gap-3 bg-white/[0.02] p-4 rounded-[12px] border border-white/5">
                    <div className="bg-[#2563FF]/20 p-1.5 rounded-md shrink-0"><CheckSquare className="w-4 h-4 text-[#2563FF]" /></div>
                    <div>
                      <div className="text-sm font-medium text-white mb-1">{d.name}</div>
                      <div className="text-xs text-white/40 leading-relaxed">{d.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
            <p className="text-xs text-white/40 max-w-md leading-relaxed">This snapshot has been securely routed to our partners. We will review your requirements and reach out within 24 hours to schedule a discovery alignment.</p>
            <div className="flex gap-4 w-full sm:w-auto">
              <PremiumButton onClick={() => window.print()} variant="secondary" className="w-full sm:w-auto px-6 py-3"><Printer className="w-4 h-4 mr-2" /> Print</PremiumButton>
              <PremiumButton onClick={() => navigate('home')} className="w-full sm:w-auto px-6 py-3">Return to Website</PremiumButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  ];

  return (
    <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-28 pb-0 relative overflow-hidden w-full">
      {step > 0 && step < 9 && (
        <div className="fixed top-[72px] md:top-[88px] left-0 w-full h-[2px] bg-white/10 z-20">
          <motion.div className="h-full bg-[#8A5CFF]" initial={{ width: 0 }} animate={{ width: `${(step / 8) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      )}
      <div className="w-full px-[3%] flex flex-col md:flex-row justify-between relative gap-8 max-w-7xl mx-auto">
        <div className="flex-1 flex items-center justify-start md:pr-12 pt-12 pb-32 md:pb-12 min-h-[80vh] w-full">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="w-full h-full flex flex-col justify-center">
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>
        {step > 0 && step < 9 && (
          <div className="hidden md:block w-[350px] lg:w-[450px] shrink-0 sticky top-32 h-[calc(100vh-160px)] pb-8 z-10">
             <LiveScopePreview />
          </div>
        )}
      </div>
      {step > 0 && step < 9 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <button onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)} className="w-full bg-[#0A0A0F] border-t border-white/10 p-4 flex items-center justify-between text-sm font-medium backdrop-blur-xl">
            <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#8A5CFF]"/> View Live Scope {selectedDeliverables.length > 0 && `(${selectedDeliverables.length})`}</span>
            {isMobilePreviewOpen ? <ChevronDown className="w-4 h-4"/> : <ChevronUp className="w-4 h-4"/>}
          </button>
          <AnimatePresence>
            {isMobilePreviewOpen && (
              <motion.div initial={{ height: 0 }} animate={{ height: '60vh' }} exit={{ height: 0 }} className="bg-[#0A0A0F] overflow-hidden border-t border-white/5">
                <div className="p-6 h-full overflow-y-auto pb-20"><LiveScopePreview /></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};


const MenuHoverCard = ({ children, color, onClick }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      initial="initial"
      whileHover="hover"
      className="group relative cursor-pointer p-6 rounded-[16px] bg-[#0A0A0F] overflow-hidden h-full flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{ background: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, ${color}18, transparent 80%)` }}
      />
      <motion.div 
        variants={{ initial: { scale: 1, opacity: 0 }, hover: { scale: 1.6, opacity: 0.08 } }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="absolute -right-12 -bottom-12 w-48 h-48 blur-[40px] rounded-full pointer-events-none z-0"
        style={{ backgroundColor: color }}
      />
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>
    </motion.div>
  );
};

const NavLink = ({ children, onClick, active, onMouseEnter, onMouseLeave }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative px-5 py-2.5 cursor-pointer transition-colors capitalize rounded-full overflow-hidden ${
        active ? 'text-white' : 'text-white/50 hover:text-white'
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute inset-0 rounded-full bg-white/[0.07] z-0"
          transition={{ duration: 0.18, ease: 'easeOut' }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

const Header = ({ navigate, current }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 120);
  };

  const closeImmediately = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(null);
  };

  const ServicesMegaMenu = () => (
    <div className="grid md:grid-cols-3 gap-6">
      {Object.values(ROUTES_INFO).map((route) => (
        <MenuHoverCard
          key={route.id}
          color={route.color}
          onClick={() => {
            navigate(`services/${route.id.toLowerCase()}`);
            closeImmediately();
          }}
        >
          <div
            className="w-12 h-12 rounded-[12px] bg-white/[0.04] flex items-center justify-center mb-8"
            style={{ color: route.color }}
          >
            {route.icon}
          </div>
          <h4 className="text-xl font-medium text-white mb-3">{route.title}</h4>
          <p className="text-sm text-white/45 leading-relaxed font-light">{route.desc}</p>
        </MenuHoverCard>
      ))}
    </div>
  );

  const WorkMegaMenu = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {CASE_STUDIES.map((cs) => (
        <MenuHoverCard
          key={cs.client}
          color={cs.color?.includes('2563') ? '#2563FF' : '#8A5CFF'}
          onClick={() => {
            navigate('work');
            closeImmediately();
          }}
        >
          <span className="text-[10px] uppercase tracking-widest text-[#8A5CFF] mb-4 block">
            {cs.sector}
          </span>
          <h4 className="text-xl font-medium text-white mb-3">{cs.client}</h4>
          <p className="text-sm text-white/45 leading-relaxed font-light">{cs.challenge}</p>
        </MenuHoverCard>
      ))}
    </div>
  );

  const MethodMegaMenu = () => (
    <div className="grid md:grid-cols-4 gap-6">
      {[
        { step: 'Diagnosis', desc: 'Understand the brand problem.' },
        { step: 'Mapping', desc: 'Route the problem to the right ecosystem.' },
        { step: 'Scope Building', desc: 'Define exact deliverables and priorities.' },
        { step: 'Execution', desc: 'Move from clarity to implementation.' }
      ].map((item, i) => (
        <MenuHoverCard
          key={item.step}
          color={i % 2 === 0 ? '#8A5CFF' : '#2563FF'}
          onClick={() => {
            navigate('method');
            closeImmediately();
          }}
        >
          <span className="text-4xl font-serif italic mb-6 block text-white/20">
            0{i + 1}
          </span>
          <h4 className="text-sm font-medium text-white mb-2">{item.step}</h4>
          <p className="text-[11px] text-white/45 leading-relaxed mt-auto font-light">
            {item.desc}
          </p>
        </MenuHoverCard>
      ))}
    </div>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[9999] isolate w-full transition-all duration-300 border-b border-white/10 ${
          scrolled || activeMenu
            ? 'bg-[#05050A] py-4 shadow-[0_24px_90px_rgba(0,0,0,0.85)]'
            : 'bg-[#05050A]/98 backdrop-blur-[40px] py-6 shadow-[0_18px_70px_rgba(0,0,0,0.55)]'
        }`}
      >
        <div className="w-full px-[3%] flex justify-between items-center relative z-10">
          <div
            className="text-lg font-medium tracking-wide cursor-pointer flex items-center gap-3 hover:opacity-80 transition-opacity text-white"
            onClick={() => {
              navigate('home');
              closeImmediately();
            }}
          >
            <img
              src="https://static.wixstatic.com/media/32f09f_d2e483f6417246ba946ed54bbb518bb8~mv2.png"
              alt="PurpleBlue House"
              className="h-6 w-auto object-contain shrink-0"
            />
            PurpleBlue House
          </div>

          <nav className="hidden lg:flex items-center gap-2 text-sm font-medium tracking-wide bg-white/[0.035] rounded-full px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_50px_rgba(0,0,0,0.35)]">
            <NavLink
              onClick={() => {
                navigate('work');
                closeImmediately();
              }}
              onMouseEnter={() => handleMouseEnter('work')}
              onMouseLeave={handleMouseLeave}
              active={current === 'work' || activeMenu === 'work'}
            >
              Work
            </NavLink>

            <NavLink
              onClick={() => {
                navigate('services');
                closeImmediately();
              }}
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
              active={current?.startsWith('services') || activeMenu === 'services'}
            >
              Services
            </NavLink>

            <NavLink
              onClick={() => {
                navigate('method');
                closeImmediately();
              }}
              onMouseEnter={() => handleMouseEnter('method')}
              onMouseLeave={handleMouseLeave}
              active={current === 'method' || activeMenu === 'method'}
            >
              Method
            </NavLink>

            <NavLink
              onClick={() => {
                navigate('about');
                closeImmediately();
              }}
              onMouseEnter={closeImmediately}
              onMouseLeave={() => {}}
              active={current === 'about'}
            >
              About
            </NavLink>
          </nav>

          <div className="hidden lg:flex items-center">
            <PremiumButton
              onClick={() => {
                navigate('assessment');
                closeImmediately();
              }}
              className="px-6 py-2.5 rounded-[9px] text-xs shadow-[0_0_20px_rgba(138,92,255,0.1)]"
            >
              Build My Brand Scope
            </PremiumButton>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => navigate('assessment')}
              className="text-[10px] font-medium text-white bg-gradient-to-r from-[#8A5CFF] to-[#2563FF] px-4 py-2 rounded-[6px] uppercase tracking-widest shadow-md"
            >
              Build Scope
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="sync">
        {activeMenu && (
          <motion.div
            key="mega-menu-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9998] pointer-events-none"
          >
            {/* Page veil */}
            <div className="absolute inset-0 bg-[#05050A]/82 backdrop-blur-[10px]" />

            {/* Mega menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.985 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-[96px] left-[3%] right-[3%] z-[2] pointer-events-auto origin-top"
              onMouseEnter={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
              }}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative overflow-hidden rounded-[24px] border border-white/12 bg-[#05050A] p-10 shadow-[0_60px_140px_rgba(0,0,0,1)]">
                <div className="absolute inset-0 bg-[#05050A] opacity-100 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70" />

                <div className="relative z-10">
                  {activeMenu === 'services' && <ServicesMegaMenu />}
                  {activeMenu === 'work' && <WorkMegaMenu />}
                  {activeMenu === 'method' && <MethodMegaMenu />}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


const HomePage = ({ navigate }) => {
  const heroRef = useRef(null);
  const manifestoRef = useRef(null);
  const { scrollYProgress: manifestoProgress } = useScroll({ target: manifestoRef, offset: ["start end", "center center"] });
  const manifestoOpacity = useTransform(manifestoProgress, [0, 1], [0.1, 1]);
  const manifestoY = useTransform(manifestoProgress, [0, 1], [50, 0]);

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  // --- Mouse Tracking for Hero Orbs & Spotlight ---
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mousePx = useMotionValue(0);
  const mousePy = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 30, damping: 20 });
  const smoothMousePx = useSpring(mousePx, { stiffness: 100, damping: 25, mass: 0.5 });
  const smoothMousePy = useSpring(mousePy, { stiffness: 100, damping: 25, mass: 0.5 });
  
  const orbX = useTransform(smoothMouseX, v => v * -40);
  const orbY = useTransform(smoothMouseY, v => v * -40);
  const gridX = useTransform(smoothMouseX, v => v * 20);
  const gridY = useTransform(smoothMouseY, v => v * 20);
  const spotlightX = useTransform(smoothMousePx, v => v - 400);
  const spotlightY = useTransform(smoothMousePy, v => v - 400);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    mouseX.set(px / rect.width - 0.5);
    mouseY.set(py / rect.height - 0.5);
    mousePx.set(px);
    mousePy.set(py);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#05050A] min-h-screen text-[#F4F4F5] w-full relative">
      <section 
        ref={heroRef} 
        onMouseMove={handleMouseMove} 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-screen flex flex-col overflow-hidden w-full pt-28 pb-8 px-[3%]"
      >
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 flex justify-center items-center">
            <motion.div style={{ x: orbX, y: orbY }} className="relative w-full h-full flex justify-center items-center md:translate-x-[20%]">
              <div className="absolute w-[80vw] md:w-[600px] h-[80vw] md:h-[450px] bg-[#6D3BEF] rounded-[100%] blur-[120px] md:blur-[160px] opacity-[0.15] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute w-[60vw] md:w-[450px] h-[80vw] md:h-[600px] bg-[#2563FF] rounded-[100%] blur-[120px] md:blur-[160px] opacity-[0.12] mix-blend-screen translate-x-1/4" />
            </motion.div>
          </div>

          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 flex justify-center items-center mix-blend-screen">
            <div className="relative w-[140%] max-w-[1200px] h-[500px] md:translate-x-[20%]">
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0, 0.4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-0 right-1/4 w-72 h-72 bg-white rounded-full blur-[100px]" />
            </div>
          </motion.div>

          <motion.div animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.8 }} className="absolute z-[5]" style={{ width: '800px', height: '800px', left: 0, top: 0, x: spotlightX, y: spotlightY }}>
            <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,rgba(138,92,255,0.03)_30%,transparent_60%)] mix-blend-screen" />
          </motion.div>

          <motion.div style={{ x: gridX, y: gridY }} animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-[0.15] flex items-center justify-center origin-center">
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

          <InteractiveFlowingLines />
        </motion.div>

        <div className="flex-1 flex flex-col justify-center w-full relative z-10 text-left">
          <RevealText delay={0.1}><h1 className="text-[clamp(3.2rem,8vw,7rem)] font-light tracking-[-0.06em] leading-[0.95] text-white drop-shadow-lg pb-1">Brands break when</h1></RevealText>
          <RevealText delay={0.2}><h1 className="text-[clamp(3.2rem,8vw,7rem)] font-light tracking-[-0.06em] leading-[0.95] text-white drop-shadow-lg pb-2 flex items-baseline flex-wrap">strategy and execution <AnimatedItalic className="text-white/60 ml-4">stop talking.</AnimatedItalic></h1></RevealText>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="mt-8 text-lg md:text-xl text-white/60 font-light max-w-3xl leading-relaxed tracking-wide">PurpleBlue House helps businesses build clearer brands, sharper narratives, and communication systems that actually move people.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7 }} className="mt-12 flex flex-col sm:flex-row gap-6">
            <PremiumButton onClick={() => navigate('assessment')} className="min-w-[240px] shadow-[0_0_40px_rgba(138,92,255,0.2)]">Build My Brand Scope <Sparkles className="w-4 h-4 ml-2" /></PremiumButton>
            <PremiumButton variant="secondary" onClick={() => navigate('work')} className="min-w-[240px]">Explore Our Work</PremiumButton>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-[3%] relative w-full bg-[#0A0A0F] border-y border-white/5 text-left">
        <RevealText><h2 className="text-4xl md:text-6xl font-light tracking-tight mb-16">Most brand problems are <br/><AnimatedItalic className="text-white/50">not surface problems.</AnimatedItalic></h2></RevealText>
        <p className="text-xl text-white/50 font-light max-w-3xl mb-16 leading-relaxed">Low engagement, inconsistent visuals, weak campaigns, unclear messaging, scattered teams — these are usually symptoms of a deeper gap between brand thinking and brand execution.</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
          {PROBLEM_DATA.map((prob, i) => (
            <ProblemHoverCard key={i} title={prob.title} icon={prob.icon} color={prob.color} />
          ))}
        </div>
      </section>

      <section className="py-32 px-[3%] w-full bg-[#05050A] border-b border-white/5 text-left">
        <div className="max-w-4xl mb-24">
          <RevealText><h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6">The traditional agency <br/><AnimatedItalic className="text-white/50">model is broken.</AnimatedItalic></h2></RevealText>
          <p className="text-xl text-white/50 font-light leading-relaxed">Most agencies execute blindly against a flawed brief. We build a strategic foundation first, ensuring every creative asset serves a core business objective.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 w-full">
          <div className="bg-[#0A0A0F] border border-white/5 rounded-[24px] p-10 md:p-14">
             <h3 className="text-white/40 text-sm tracking-widest uppercase mb-10">The Old Way</h3>
             <ul className="space-y-8">
               <li className="flex gap-5 text-white/50 font-light text-lg"><X className="w-6 h-6 shrink-0 text-red-500/50 mt-1" /> <span>Executing blindly on surface-level aesthetic requests.</span></li>
               <li className="flex gap-5 text-white/50 font-light text-lg"><X className="w-6 h-6 shrink-0 text-red-500/50 mt-1" /> <span>Charging for endless revisions due to lack of clarity.</span></li>
               <li className="flex gap-5 text-white/50 font-light text-lg"><X className="w-6 h-6 shrink-0 text-red-500/50 mt-1" /> <span>Disjointed teams producing inconsistent touchpoints.</span></li>
             </ul>
          </div>
          <div className="bg-gradient-to-br from-[#8A5CFF]/10 to-transparent border border-[#8A5CFF]/20 rounded-[24px] p-10 md:p-14 relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#8A5CFF] opacity-[0.1] blur-[80px] pointer-events-none" />
             <h3 className="text-[#8A5CFF] text-sm tracking-widest uppercase mb-10 font-medium relative z-10">The PBH Way</h3>
             <ul className="space-y-8 relative z-10">
               <li className="flex gap-5 text-white/90 font-light text-lg"><Check className="w-6 h-6 shrink-0 text-[#8A5CFF] mt-1" /> <span>Diagnosing the root business gap before designing anything.</span></li>
               <li className="flex gap-5 text-white/90 font-light text-lg"><Check className="w-6 h-6 shrink-0 text-[#8A5CFF] mt-1" /> <span>Modular scoping based on exact strategic requirements.</span></li>
               <li className="flex gap-5 text-white/90 font-light text-lg"><Check className="w-6 h-6 shrink-0 text-[#8A5CFF] mt-1" /> <span>Building connected systems where strategy dictates execution.</span></li>
             </ul>
          </div>
        </div>
      </section>

      <section className="py-32 px-[3%] relative w-full bg-[#0A0A0F] text-left">
        <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-20">We connect strategy, <br/><AnimatedItalic className="text-[#8A5CFF]">story, and execution.</AnimatedItalic></h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.values(ROUTES_INFO).map((route, i) => (
            <SpotlightCard key={route.id} className="rounded-[24px] h-full">
              <div className="bg-[#05050A] border border-white/10 rounded-[24px] p-10 h-full flex flex-col hover:border-white/20 transition-colors">
                <div className="w-14 h-14 rounded-[12px] bg-white/5 border border-white/10 flex items-center justify-center mb-8" style={{ color: route.color }}>{route.icon}</div>
                <h4 className="text-2xl font-light mb-4">{route.title}</h4>
                <p className="text-white/50 font-light leading-relaxed mb-10 flex-grow">{route.desc}</p>
                <PremiumButton variant="ghost" onClick={() => navigate(`services/${route.id.toLowerCase()}`)} className="self-start px-0 group hover:bg-transparent text-white/70">Explore Route <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></PremiumButton>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      <section className="py-32 px-[3%] relative w-full bg-[#05050A] border-y border-white/5 text-left overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#8A5CFF] opacity-[0.03] blur-[120px] pointer-events-none rounded-[100%]" />
        <div className="relative z-10 w-full">
          <RevealText><h2 className="text-4xl md:text-6xl font-light tracking-tight mb-20">How It <AnimatedItalic className="text-[#8A5CFF]">Works.</AnimatedItalic></h2></RevealText>
          <InteractiveHowItWorks />
        </div>
      </section>

      <section className="py-32 px-[3%] w-full bg-[#0A0A0F] text-center flex flex-col items-center justify-center border-b border-white/5 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8A5CFF] opacity-[0.03] blur-[100px] pointer-events-none rounded-full" />
         <div className="text-[#8A5CFF] opacity-40 mb-10 relative z-10"><Quote className="w-16 h-16 mx-auto" /></div>
         <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-[1.4] max-w-5xl text-white/90 relative z-10">
           "PurpleBlue House completely rewired how we communicate. They didn't just give us a brand identity—they gave us an <AnimatedItalic className="text-[#8A5CFF]">operating system for growth.</AnimatedItalic>"
         </h2>
         <div className="mt-16 flex flex-col items-center relative z-10">
           <div className="w-12 h-[1px] bg-white/20 mb-6" />
           <span className="text-white tracking-wide font-medium">Chief Marketing Officer</span>
           <span className="text-white/40 text-xs mt-2 uppercase tracking-widest">Global Tech Enterprise</span>
         </div>
      </section>

      <section className="py-32 px-[3%] relative w-full bg-[#05050A] border-b border-white/5">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-24 gap-6 w-full text-left">
          <RevealText delay={0.1}><h2 className="text-4xl md:text-6xl font-light tracking-tight">Selected <AnimatedItalic className="text-white/50">Work.</AnimatedItalic></h2></RevealText>
          <PremiumButton variant="ghost" onClick={() => navigate('work')} className="px-0 py-0 text-[#8A5CFF] group">View Archive <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></PremiumButton>
        </div>
        <div className="grid md:grid-cols-2 gap-8 w-full">
          {CASE_STUDIES.map((cs, i) => (
            <div key={i} onClick={() => navigate('work')} className="group relative bg-[#0A0A0F] border border-white/5 rounded-[24px] overflow-hidden flex flex-col transition-all duration-700 cursor-pointer text-left h-[450px]">
              <div className="h-[250px] relative overflow-hidden border-b border-white/5 bg-white/[0.02]">
                <div className={`absolute inset-0 bg-gradient-to-br ${cs.color} to-transparent opacity-20 mix-blend-screen group-hover:scale-110 transition-transform duration-1000 ease-out`} />
                <div className="absolute inset-0 flex items-center justify-center"><span className="text-5xl font-serif italic text-white/10 group-hover:text-white/30 transition-colors duration-700">{cs.client.split(' ')[0]}</span></div>
              </div>
              <div className="p-8 flex flex-col justify-between flex-1 bg-[#0A0A0F]">
                <div>
                  <span className="text-[10px] font-medium text-[#8A5CFF] tracking-widest uppercase block mb-2">{cs.sector}</span>
                  <h3 className="text-2xl font-light group-hover:text-[#8A5CFF] transition-colors">{cs.client}</h3>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex gap-2">{cs.tags.map(t => <span key={t} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-white/50 uppercase">{t}</span>)}</div>
                  <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 px-[3%] bg-[#8A5CFF] w-full text-center flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 w-full overflow-hidden flex whitespace-nowrap">
           <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 20 }} className="flex gap-16 text-[#05050A] opacity-90">
             <span className="text-6xl md:text-8xl font-light tracking-tighter uppercase">3 Ecosystems. 1 Connected System. Zero Guesswork.</span>
             <span className="text-6xl md:text-8xl font-light tracking-tighter uppercase">3 Ecosystems. 1 Connected System. Zero Guesswork.</span>
           </motion.div>
        </div>
      </section>

      <section className="py-32 md:py-48 px-[3%] relative w-full bg-[#05050A] flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2563FF] rounded-[100%] blur-[200px] opacity-[0.08] pointer-events-none" />
        <div className="relative z-10 w-full flex flex-col items-center">
          <h2 className="text-xs font-medium text-[#2563FF] uppercase tracking-widest mb-6">Start with clarity.</h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-12 tracking-tight">Build your brand scope <br/><AnimatedItalic className="text-white/60">before the first call.</AnimatedItalic></h1>
          <PremiumButton onClick={() => navigate('assessment')} className="px-12 py-6 text-lg w-full sm:w-auto">Start Strategic Assessment</PremiumButton>
        </div>
      </section>
    </motion.div>
  );
};

const AboutPage = ({ navigate }) => (
  <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full">
    <div className="w-full text-left">
      <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
      <RevealText><h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight max-w-5xl">We are a strategy-led creative house built for brands that need more than <AnimatedItalic className="text-[#8A5CFF]">good-looking communication.</AnimatedItalic></h1></RevealText>
      <p className="text-xl text-white/50 font-light mb-24 max-w-3xl leading-relaxed">PurpleBlue House works at the intersection of brand thinking, storytelling, design, and execution. We help businesses understand what they stand for, how they should speak, and how their communication should work across every touchpoint.</p>
      
      <div className="grid md:grid-cols-2 gap-16 border-t border-white/10 pt-24">
        <div><h2 className="text-3xl font-light">We do not begin with logos.<br/>We begin with clarity.</h2></div>
        <div className="space-y-8 text-lg font-light text-white/60">
          <p><strong className="text-white font-medium">Before design, there is positioning.</strong> We map the market gap before we draw a single pixel.</p>
          <p><strong className="text-white font-medium">Before campaigns, there is narrative.</strong> We architect the core story before we script the ad.</p>
          <p><strong className="text-white font-medium">Before content, there is a system.</strong> We build playbooks and templates so your execution scales seamlessly.</p>
        </div>
      </div>
    </div>
  </div>
);

const MethodPage = ({ navigate }) => (
  <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full">
    <div className="w-full text-left">
      <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
      <h2 className="text-xs font-medium text-[#8A5CFF] uppercase tracking-widest mb-6">The PBH Method</h2>
      <RevealText><h1 className="text-5xl md:text-7xl font-light mb-24 tracking-tight max-w-4xl">A clear process for brands that need direction, <AnimatedItalic className="text-white/50">not decoration.</AnimatedItalic></h1></RevealText>
      
      <div className="space-y-32">
        {[
          { step: "1", title: "Discovery", desc: "We begin by understanding the business, audience, market, internal teams, communication gaps, and growth context.", outputs: ["Brand Audit", "Stakeholder Interviews", "Competitor Landscape Mapping"] },
          { step: "2", title: "Diagnosis", desc: "We identify where the brand is breaking — messaging, identity, storytelling, systems, campaigns, or execution.", outputs: ["Problem Clusters Identified", "Gap Analysis"] },
          { step: "3", title: "Route Mapping", desc: "Based on the diagnosis, we recommend one or more service routes: Brand Boulevard, SciArt Saga, or Storytelling Corner.", outputs: ["Strategic Route Assignment"] },
          { step: "4", title: "Scope Building", desc: "Each route is broken into line items, deliverables, priorities, dependencies, timelines, and depth.", outputs: ["Custom Scope Blueprint"] }
        ].map((s, i) => (
          <div key={i} className="grid md:grid-cols-12 gap-8 border-t border-white/10 pt-12">
            <div className="md:col-span-1 text-4xl font-serif italic text-white/30">0{s.step}</div>
            <div className="md:col-span-5"><h3 className="text-3xl font-light mb-4">{s.title}</h3><p className="text-white/50 font-light text-lg leading-relaxed">{s.desc}</p></div>
            <div className="md:col-span-6 md:pl-12">
              <h4 className="text-xs font-medium text-white/30 uppercase tracking-widest mb-4">Key Outputs</h4>
              <ul className="space-y-2">{s.outputs.map((out, j) => <li key={j} className="flex items-center gap-3 text-white/70 font-light bg-white/[0.02] border border-white/5 px-4 py-3 rounded-[8px]"><Check className="w-4 h-4 text-[#8A5CFF]" /> {out}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-32 pt-16 border-t border-white/10 flex flex-col items-center text-center">
        <h2 className="text-4xl font-light mb-8">Experience the method yourself.</h2>
        <PremiumButton onClick={() => navigate('assessment')}>Build My Brand Scope</PremiumButton>
      </div>
    </div>
  </div>
);

const ServicesPage = ({ navigate }) => (
  <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full">
    <div className="w-full text-left">
      <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
      <RevealText><h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight max-w-4xl">Three strategic routes.<br/><AnimatedItalic className="text-white/50">One connected brand system.</AnimatedItalic></h1></RevealText>
      <p className="text-xl text-white/50 font-light mb-24 max-w-3xl leading-relaxed">PBH services are not isolated offerings. They are designed as connected routes that help brands move from clarity to communication to execution.</p>
      
      <div className="grid gap-12">
        {Object.values(ROUTES_INFO).map((route, i) => (
          <SpotlightCard key={route.id} className="rounded-[24px]">
            <div className="bg-[#0A0A0F] border border-white/10 rounded-[24px] p-12 md:p-16 flex flex-col md:flex-row gap-12 hover:border-[#8A5CFF]/30 transition-colors">
              <div className="md:w-1/3">
                <div className="w-16 h-16 rounded-[16px] bg-white/5 border border-white/10 flex items-center justify-center mb-8" style={{ color: route.color }}>{route.icon}</div>
                <h3 className="text-3xl font-light mb-4">{route.title}</h3>
                <p className="text-white/50 font-light leading-relaxed mb-8">{route.desc}</p>
                <PremiumButton variant="ghost" onClick={() => navigate(`services/${route.id.toLowerCase()}`)} className="px-0 py-0 hover:bg-transparent text-white group">Explore Route Details <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/></PremiumButton>
              </div>
              <div className="md:w-2/3 md:pl-12 md:border-l border-white/10 grid sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4">Core Line Items</h4>
                  <ul className="space-y-3">{route.lineItems.map(li => <li key={li.id} className="text-sm font-light text-white/70">{li.name}</li>)}</ul>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4">Best For</h4>
                  <p className="text-sm font-light text-white/60 leading-relaxed">Brands looking for a structured approach to solving specific gaps in this domain.</p>
                </div>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  </div>
);

const ServiceDetailPage = ({ navigate, routeId }) => {
  const route = ROUTES_INFO[routeId.toUpperCase()] || ROUTES_INFO['BB'];
  return (
    <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full">
      <div className="w-full text-left">
        <button onClick={() => navigate('services')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Services</button>
        <div className="w-20 h-20 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center mb-10" style={{ color: route.color }}>{route.icon}</div>
        <RevealText><h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">{route.title}</h1></RevealText>
        <p className="text-xl text-white/50 font-light mb-24 max-w-3xl leading-relaxed">{route.desc}</p>
        
        <h3 className="text-3xl font-light mb-12 border-b border-white/10 pb-6">What's Included</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {route.lineItems.map(li => (
            <div key={li.id} className="bg-[#0A0A0F] border border-white/5 rounded-[16px] p-8">
              <h4 className="text-xl font-medium mb-6 text-white">{li.name}</h4>
              <ul className="space-y-3">
                {DELIVERABLES_MASTER.filter(d => d.lineItem === li.id).map(d => (
                  <li key={d.id} className="text-sm font-light text-white/60 flex items-start gap-2"><Check className="w-4 h-4 shrink-0 mt-[2px]" style={{ color: route.color }}/> {d.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-br from-[#0A0A0F] to-[#05050A] border border-white/10 rounded-[24px] p-12 text-center">
          <h2 className="text-3xl font-light mb-6">Find the right scope for your brand.</h2>
          <PremiumButton onClick={() => navigate('assessment')}>Build A Scope</PremiumButton>
        </div>
      </div>
    </div>
  );
};

const WorkPage = ({ navigate }) => (
  <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full">
    <div className="w-full text-left">
      <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
      <RevealText><h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">Our Work.</h1></RevealText>
      <p className="text-xl text-white/50 font-light mb-16 max-w-lg">Case studies and full visual archive proving our thinking across strategy, identity, and campaigns.</p>
      
      <div className="flex gap-4 mb-16 border-b border-white/10 pb-6 overflow-x-auto">
        <button className="px-4 py-2 rounded-full border border-white text-white text-sm shrink-0">All Projects</button>
        <button className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-sm shrink-0">Brand Boulevard</button>
        <button className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-sm shrink-0">SciArt Saga</button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full">
        {CASE_STUDIES.map((cs, i) => (
          <div key={i} className="group relative bg-[#0A0A0F] border border-white/5 rounded-[24px] overflow-hidden flex flex-col transition-all duration-700 cursor-pointer text-left h-auto">
            <div className="h-[300px] relative overflow-hidden border-b border-white/5 bg-white/[0.02]">
              <div className={`absolute inset-0 bg-gradient-to-br ${cs.color} to-transparent opacity-20 mix-blend-screen group-hover:scale-110 transition-transform duration-1000 ease-out`} />
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-5xl font-serif italic text-white/10 group-hover:text-white/30 transition-colors duration-700">{cs.client.split(' ')[0]}</span></div>
            </div>
            <div className="p-8">
              <span className="text-[10px] font-medium text-[#8A5CFF] tracking-widest uppercase block mb-2">{cs.sector}</span>
              <h3 className="text-3xl font-light mb-4">{cs.client}</h3>
              <p className="text-white/50 font-light mb-8 text-sm leading-relaxed">{cs.challenge}</p>
              <div className="flex justify-between items-end">
                <div className="flex gap-2 flex-wrap">{cs.tags.map(t => <span key={t} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-white/50 uppercase">{t}</span>)}</div>
                <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContactPage = ({ navigate }) => (
  <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full">
    <div className="w-full text-left">
      <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
      <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">Start with a conversation. <br/><AnimatedItalic className="text-white/50">Or start with clarity.</AnimatedItalic></h1>
      <p className="text-white/50 mb-16 text-lg font-light">Have a project in mind? Choose how you want to begin.</p>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
        <div className="bg-[#0A0A0F] border border-white/10 rounded-[24px] p-10 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-light mb-4">I know what I need.</h3>
            <p className="text-white/50 font-light mb-8">Skip the assessment and send us a direct message outlining your requirements.</p>
          </div>
          <form className="space-y-4 text-left w-full" onSubmit={(e) => e.preventDefault()}>
            <input required placeholder="Your Name" className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none focus:border-[#8A5CFF]/50 transition-colors" />
            <input required type="email" placeholder="Work Email" className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none focus:border-[#8A5CFF]/50 transition-colors" />
            <PremiumButton type="submit" className="w-full">Contact PBH</PremiumButton>
          </form>
        </div>
        <div className="bg-gradient-to-br from-[#8A5CFF]/10 to-transparent border border-[#8A5CFF]/20 rounded-[24px] p-10 flex flex-col justify-center text-center items-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-[16px] bg-[#8A5CFF]/20 flex items-center justify-center mb-6"><Fingerprint className="w-8 h-8 text-[#8A5CFF]"/></div>
          <h3 className="text-2xl font-light mb-4 text-white">I need help defining the scope.</h3>
          <p className="text-white/70 font-light mb-8 max-w-sm">Use our strategic tool to map your exact deliverables before the first call.</p>
          <PremiumButton onClick={() => navigate('assessment')} className="w-full shadow-[0_0_30px_rgba(138,92,255,0.2)]">Build My Brand Scope</PremiumButton>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-32 pb-24 px-[3%] w-full">
      <div className="w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-light mb-2">Lead Intelligence Dashboard</h1>
            <p className="text-white/40 text-sm">Strategic assessments captured via Brand Scope Builder.</p>
          </div>
          <PremiumButton variant="ghost" onClick={() => navigate('home')} className="px-0">Exit System <ArrowRight className="w-4 h-4 ml-2"/></PremiumButton>
        </div>
        <div className="bg-[#0A0A0F] border border-white/10 rounded-[16px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] border-b border-white/10 text-white/40 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="p-6 font-medium">Lead Context</th>
                  <th className="p-6 font-medium">Brand Stage</th>
                  <th className="p-6 font-medium">Core Gap</th>
                  <th className="p-6 font-medium">Routes</th>
                  <th className="p-6 font-medium text-center">Score</th>
                  <th className="p-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {GLOBAL_LEADS.length === 0 ? (
                  <tr><td colSpan="6" className="p-12 text-center text-white/30 italic">No leads captured yet. Run the assessment to see data.</td></tr>
                ) : (
                  GLOBAL_LEADS.map((lead, i) => (
                    <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="p-6"><div className="font-medium text-white mb-1">{lead.company}</div><div className="text-xs text-white/50 flex items-center gap-2"><User className="w-3 h-3"/> {lead.name}</div></td>
                      <td className="p-6 text-white/70 font-light">{lead.stage}</td>
                      <td className="p-6"><span className="px-3 py-1 rounded-full bg-[#8A5CFF]/10 text-[#8A5CFF] text-xs border border-[#8A5CFF]/20">{lead.clusters[0]}</span></td>
                      <td className="p-6 text-xs text-white/60 font-light">{lead.routes.join(', ')}</td>
                      <td className="p-6 text-center"><span className={`font-mono ${lead.score > 80 ? 'text-green-400' : 'text-yellow-400'}`}>{lead.score}</span></td>
                      <td className="p-6"><span className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-[10px] uppercase tracking-widest border border-white/10">New</span></td>
                    </tr>
                  )).reverse()
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


const LegalPage = ({ title, lastUpdated, navigate, children }) => (
  <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full">
    <div className="w-full max-w-4xl text-left">
      <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home
      </button>
      <div className="mb-16 border-b border-white/10 pb-12">
        <h1 className="text-4xl md:text-6xl font-light mb-4 tracking-tight">{title}</h1>
        <p className="text-white/40 uppercase tracking-widest text-xs font-medium">Last Updated: {lastUpdated}</p>
      </div>
      <div className="prose prose-invert prose-p:text-white/60 prose-p:font-light prose-p:leading-relaxed prose-headings:font-light prose-headings:text-white prose-a:text-[#8A5CFF] max-w-none">
        {children}
      </div>
    </div>
  </div>
);

const PrivacyPage = ({ navigate }) => (
  <LegalPage title="Privacy Policy" lastUpdated="May 12, 2026" navigate={navigate}>
    <h2>1. Introduction</h2>
    <p>At PurpleBlue House, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
    
    <h2>2. Data We Collect</h2>
    <p>When you use our Strategic Brand Scope Builder, we collect the information you voluntarily provide, including your name, corporate email address, company name, and the strategic answers you provide regarding your brand's current stage and challenges. This allows us to generate accurate scope recommendations.</p>
    
    <h2>3. How We Use Your Data</h2>
    <p>We use the data captured through our assessment engine to pre-qualify consulting leads, generate custom project scopes, and prepare for initial discovery calls. We do not sell your data to third parties under any circumstances.</p>

    <h2>4. Data Security</h2>
    <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. Access to your personal data is limited to those employees and partners who have a business need to know.</p>

    <h2>5. Your Legal Rights</h2>
    <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, or to object to processing. To exercise these rights, please contact us at privacy@purplebluehouse.com.</p>
  </LegalPage>
);

const TermsPage = ({ navigate }) => (
  <LegalPage title="Terms of Service" lastUpdated="May 12, 2026" navigate={navigate}>
    <h2>1. Agreement to Terms</h2>
    <p>By accessing our website and utilizing our Strategic Brand Scope Builder, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

    <h2>2. Intellectual Property</h2>
    <p>The strategic frameworks, diagnostic logic, code, design, and content of this website are the intellectual property of PurpleBlue House. The project scopes generated by the engine are for discussion purposes and do not constitute a legally binding contract until a formal Statement of Work (SOW) is signed.</p>

    <h2>3. Disclaimer of Warranties</h2>
    <p>The materials on PurpleBlue House's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

    <h2>4. Limitations</h2>
    <p>In no event shall PurpleBlue House or its partners be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.</p>

    <h2>5. Modifications</h2>
    <p>We may revise these terms of service for our website at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.</p>
  </LegalPage>
);

const Footer = ({ navigate }) => (
  <footer className="bg-[#05050A] border-t border-white/5 pt-20 pb-12 px-[3%] relative z-10 w-full text-left">
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
        <div className="md:col-span-1 flex flex-col items-start">
          <div className="flex items-center gap-3 text-xl font-medium tracking-wide mb-6 cursor-pointer" onClick={() => navigate('home')}>
            <img src="https://static.wixstatic.com/media/32f09f_d2e483f6417246ba946ed54bbb518bb8~mv2.png" alt="PurpleBlue House" className="h-8 w-auto object-contain shrink-0" />
            PurpleBlue House
          </div>
          <p className="text-white/40 font-light text-sm leading-relaxed mb-6">A premium brand, storytelling, and communication studio that understands your brand problem before you even speak to them.</p>
        </div>
        <div className="flex flex-col items-start md:pl-12">
          <h4 className="text-white/80 font-medium mb-6 text-sm">Studio</h4>
          <div className="flex flex-col space-y-4 text-white/40 text-sm font-light">
            <button onClick={() => navigate('home')} className="hover:text-white transition-colors text-left">Home</button>
            <button onClick={() => navigate('about')} className="hover:text-white transition-colors text-left">About</button>
            <button onClick={() => navigate('method')} className="hover:text-white transition-colors text-left">The PBH Method</button>
            <button onClick={() => navigate('work')} className="hover:text-white transition-colors text-left">Selected Work</button>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <h4 className="text-white/80 font-medium mb-6 text-sm">Services</h4>
          <div className="flex flex-col space-y-4 text-white/40 text-sm font-light">
            <button onClick={() => navigate('services')} className="hover:text-white transition-colors text-left">Overview</button>
            <button onClick={() => navigate('services/bb')} className="hover:text-white transition-colors text-left">Brand Boulevard</button>
            <button onClick={() => navigate('services/sas')} className="hover:text-white transition-colors text-left">SciArt Saga</button>
            <button onClick={() => navigate('services/stc')} className="hover:text-white transition-colors text-left">Storytelling Corner</button>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <h4 className="text-white/80 font-medium mb-6 text-sm">Connect</h4>
          <div className="flex flex-col space-y-4 text-white/40 text-sm font-light">
            <button onClick={() => navigate('contact')} className="hover:text-white transition-colors text-left">Contact Us</button>
            <button onClick={() => navigate('assessment')} className="hover:text-white transition-colors text-left">Build Brand Scope</button>
            <span className="cursor-pointer hover:text-white flex items-center gap-2 mt-4" onClick={()=>navigate('admin')}><Lock className="w-3 h-3"/> Admin Area</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[10px] sm:text-xs font-medium text-white/30 uppercase tracking-widest gap-4">
        <p>© {new Date().getFullYear()} PurpleBlue House. All rights reserved.</p>
        <div className="flex gap-6"><span onClick={() => navigate('privacy')} className="cursor-pointer hover:text-white">Privacy Policy</span><span onClick={() => navigate('terms')} className="cursor-pointer hover:text-white">Terms</span></div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [routeState, setRouteState] = useState({ page: 'home', data: null });
  
  const navigate = (path, data = null) => {
    if (path.startsWith('services/')) {
      setRouteState({ page: 'service-detail', data: path.split('/')[1] });
    } else {
      setRouteState({ page: path, data });
    }
  };

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [routeState.page]);

  return (
    <div className="bg-[#05050A] min-h-screen text-[#F4F4F5] font-sans w-full selection:bg-[#6D3BEF]/30 selection:text-white overflow-x-clip" style={{ scrollBehavior: 'smooth' }}>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; } html { scroll-behavior: smooth; }`}</style>
      <GlobalFilmGrain />
      <CustomCursor />
      {routeState.page !== 'admin' && <Header navigate={navigate} current={routeState.page} />}
      
      <main className="w-full min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {routeState.page === 'home' && <HomePage key="home" navigate={navigate} />}
          {routeState.page === 'about' && <AboutPage key="about" navigate={navigate} />}
          {routeState.page === 'method' && <MethodPage key="method" navigate={navigate} />}
          {routeState.page === 'services' && <ServicesPage key="services" navigate={navigate} />}
          {routeState.page === 'service-detail' && <ServiceDetailPage key="service-detail" navigate={navigate} routeId={routeState.data} />}
          {routeState.page === 'work' && <WorkPage key="work" navigate={navigate} />}
          {routeState.page === 'contact' && <ContactPage key="contact" navigate={navigate} />}
          {routeState.page === 'assessment' && <StrategicEngine key="engine" navigate={navigate} />}
          {routeState.page === 'admin' && <AdminDashboard key="admin" navigate={navigate} />}
          {routeState.page === 'privacy' && <PrivacyPage key="privacy" navigate={navigate} />}
          {routeState.page === 'terms' && <TermsPage key="terms" navigate={navigate} />}
        </AnimatePresence>
      </main>

      {routeState.page !== 'admin' && routeState.page !== 'assessment' && <Footer navigate={navigate} />}
    </div>
  );
}
