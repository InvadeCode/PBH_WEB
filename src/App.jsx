import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring, useMotionValue, useMotionTemplate, useAnimationFrame } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Zap, CheckCircle2, 
  ArrowLeft, ArrowDown, Menu, X, Globe, MoveRight,
  Lightbulb, BookOpen, Fingerprint, Dna, Rocket,
  Mail, MessageSquare, Terminal, Layers, Compass, PenTool,
  ChevronUp, ChevronDown, Check, Briefcase, FileText, User, Users, Activity,
  Shield, Lock, Scale, Target, BarChart2, Command, ArrowUpRight, CheckSquare,
  Quote, Printer, Download, MonitorPlay, MapPin, Phone, Clock, Plus
} from 'lucide-react';

// --- GLOBAL PALETTE & TYPOGRAPHY (V2) ---
const palette = {
  bg: '#010D54',        // PBH official navy
  bgDeep: '#010836',    // Darker navy for depth
  panel: '#0C185C',     // Elevated panel navy
  primary: '#6865FA',   // PBH primary purple
  secondary: '#D4CEFC', // Light purple
  blue: '#2A97D9',      // Bright blue
  accent: '#FFCD00',    // Yellow for high-contrast accents/buttons
  purple: '#AF73DD',    // Secondary purple
  green: '#93D435',     // Secondary green
  orange: '#ED7E18',    // Secondary orange
  text: '#F4F4F5',
  fonts: {
    primary: "'Space Grotesk', sans-serif",
    secondary: "'Karla', sans-serif"
  }
};

const hexToRgba = (hex, alpha) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})` : `rgba(138, 92, 255, ${alpha})`;
};

const hexToRgbStr = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '104, 101, 250';
};

// --- STRATEGIC DATA DICTIONARY ---

const QUIZ_QUESTIONS = [
  { id: 'stage', title: 'Where is your brand right now?', options: [ { id: 's1', label: 'We are launching a new brand' }, { id: 's2', label: 'We are repositioning an existing brand' }, { id: 's3', label: 'We have grown, but our brand has not evolved' }, { id: 's4', label: 'We need better campaigns and communication' }, { id: 's5', label: 'We need a full strategic reset' } ] },
  { id: 'messaging', title: 'What feels most inconsistent about your brand right now?', options: [ { id: 'm1', label: 'Different teams communicate differently', cluster: 'Messaging Inconsistency', routes: ['BB'] }, { id: 'm2', label: 'Our message changes across platforms', cluster: 'Messaging Inconsistency', routes: ['BB'] }, { id: 'm3', label: 'Our brand story lacks depth or emotional pull', cluster: 'Weak Narrative', routes: ['SAS', 'STC'] }, { id: 'm4', label: 'Our visual identity feels generic or outdated', cluster: 'Generic Identity', routes: ['BB'] } ] },
  { id: 'execution', title: 'How does your team currently execute brand communication?', options: [ { id: 'e1', label: 'Everyone creates things differently', cluster: 'Lack of Systems', routes: ['BB'] }, { id: 'e2', label: 'There are no reusable design templates or playbooks', cluster: 'Lack of Systems', routes: ['BB', 'STC'] }, { id: 'e3', label: 'Campaigns do not create enough response', cluster: 'Execution Gap', routes: ['STC'] }, { id: 'e4', label: 'Translating complex ideas to market is difficult', cluster: 'Execution Gap', routes: ['SAS'] } ] }
];

const ROUTES_INFO = {
  'BB': { id: 'BB', title: 'Brand Boulevard', desc: 'Identity, positioning, messaging, and comprehensive brand systems.', icon: <Fingerprint className="w-6 h-6" />, type: 'primary', lineItems: [ { id: 'BB1', name: 'Brand Workshop & Audit' }, { id: 'BB2', name: 'Brand Identity System' }, { id: 'BB3', name: 'Design Systems' } ] },
  'SAS': { id: 'SAS', title: 'SciArt Saga', desc: 'Storytelling, innovation communication, and experience-led narratives.', icon: <Lightbulb className="w-6 h-6" />, type: 'blue', lineItems: [ { id: 'SAS1', name: 'Innovation Frameworks' }, { id: 'SAS2', name: 'Product Storytelling' }, { id: 'SAS3', name: 'GTM Communication' } ] },
  'STC': { id: 'STC', title: 'Storytelling Corner', desc: 'Campaign ideas, creative direction, and execution-ready content.', icon: <Rocket className="w-6 h-6" />, type: 'purple', lineItems: [ { id: 'STC1', name: 'Creative Direction' }, { id: 'STC2', name: 'Campaign Storytelling' }, { id: 'STC3', name: 'Content Systems' } ] }
};

const DELIVERABLES_MASTER = [
  { id: 'd1', lineItem: 'BB1', name: 'Brand Audit', priority: 'Strategic Foundation', desc: 'Diagnostic review of current brand assets.' },
  { id: 'd2', lineItem: 'BB1', name: 'Positioning Territories', priority: 'Strategic Foundation', desc: 'Defining the strategic market gap.' },
  { id: 'd3', lineItem: 'BB2', name: 'Visual Identity System', priority: 'Core', desc: 'Logos, colors, typography, and visual language.' },
  { id: 'd4', lineItem: 'BB3', name: 'Brand Guidelines', priority: 'Execution Support', desc: 'Scalable rules for your internal teams.' },
  { id: 'd5', lineItem: 'SAS1', name: 'Innovation Narrative', priority: 'Strategic Foundation', desc: 'The overarching story of your innovation.' },
  { id: 'd6', lineItem: 'SAS2', name: 'Use Case Stories', priority: 'Core', desc: 'Translating features into human benefits.' },
  { id: 'd7', lineItem: 'SAS3', name: 'Launch Strategy', priority: 'Launch Critical', desc: 'GTM messaging and channel communication plan.' },
  { id: 'd8', lineItem: 'STC1', name: 'Creative Strategy & Moodboard', priority: 'Strategic Foundation', desc: 'Visual direction for shoots and assets.' },
  { id: 'd9', lineItem: 'STC2', name: 'Campaign Idea & Narrative', priority: 'Launch Critical', desc: 'The big idea for your next launch.' },
  { id: 'd10', lineItem: 'STC3', name: 'Content Playbook & Templates', priority: 'Execution Support', desc: 'Recurring formats and publishing workflow.' }
];

const CASE_STUDIES = [
  { id: 'cs1', client: 'Aura Skincare', sector: 'Beauty', challenge: 'Elevating a cult favorite skincare line into a globally recognized luxury lifestyle brand.', route: 'Visual Identity', tags: ['Beauty', 'Packaging'], type: 'primary' },
  { id: 'cs2', client: 'Lumina Tech', sector: 'Technology', challenge: 'Humanizing a complex AI platform through an approachable, vibrant, and modern design system.', route: 'Digital Experience', tags: ['Tech', 'UI/UX'], type: 'blue' },
  { id: 'cs3', client: 'Novus Fin', sector: 'Finance', challenge: 'Transforming a legacy financial institution into a modern, creator-led fintech platform.', route: 'Brand Strategy', tags: ['Fintech', 'Positioning'], type: 'purple' },
  { id: 'cs4', client: 'Aero Dynamics', sector: 'Aviation', challenge: 'Communicating sustainable aviation solutions through powerful SciArt storytelling.', route: 'Narrative', tags: ['Sustainability', 'Storytelling'], type: 'green' },
];

const JOURNAL_ARTICLES = [
  { id: 'a1', tag: "Framework", title: "The Anatomy of a Breakthrough Brand.", time: "5 min read", type: "primary", excerpt: "Why some brands become movements while others remain just products.", author: "PBH Strategy", date: "Oct 12, 2025" },
  { id: 'a2', tag: "Perspective", title: "Why Aesthetics Cannot Save a Bad Strategy.", time: "4 min read", type: "blue", excerpt: "Design without direction is just decoration. Here is why strategy must lead.", author: "PBH Design", date: "Sep 28, 2025" },
  { id: 'a3', tag: "Analysis", title: "Humanizing Complex Tech for the Enterprise.", time: "6 min read", type: "purple", excerpt: "How to tell a compelling story when your product is highly technical.", author: "PBH Content", date: "Sep 15, 2025" },
  { id: 'a4', tag: "Culture", title: "The SciArt Approach in Practice.", time: "8 min read", type: "accent", excerpt: "A behind-the-scenes look at how our hybrid teams co-create.", author: "PBH Culture", date: "Aug 30, 2025" },
  { id: 'a5', tag: "Trend", title: "The End of the Traditional Agency Model.", time: "5 min read", type: "orange", excerpt: "Why the retainer model is dying and what replaces it.", author: "PBH Leadership", date: "Aug 12, 2025" },
  { id: 'a6', tag: "Guide", title: "Building a Repeatable Design System.", time: "7 min read", type: "green", excerpt: "Stop recreating the wheel. How to build systems that scale.", author: "PBH Systems", date: "Jul 22, 2025" }
];

const PROBLEM_DATA = [
  { title: "Unclear messaging", icon: <MessageSquare className="w-5 h-5" />, type: 'primary' },
  { title: "Generic visual identity", icon: <Fingerprint className="w-5 h-5" />, type: 'blue' },
  { title: "Low campaign engagement", icon: <Activity className="w-5 h-5" />, type: 'secondary' },
  { title: "Disconnected teams", icon: <Layers className="w-5 h-5" />, type: 'purple' },
  { title: "No repeatable brand system", icon: <Command className="w-5 h-5" />, type: 'primary' }
];

let GLOBAL_LEADS = [];

// --- ANIMATION UTILITIES ---
const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }} transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

const StaggerGroup = ({ children, className = "", staggerDelay = 0.1 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={{ visible: { transition: { staggerChildren: staggerDelay } } }} className={className}>
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children, className = "" }) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }} className={className}>
    {children}
  </motion.div>
);

const RevealText = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div initial={{ y: "100%", opacity: 0, rotateZ: 2 }} animate={isInView ? { y: 0, opacity: 1, rotateZ: 0 } : { y: "100%", opacity: 0, rotateZ: 2 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay }} className="origin-bottom">{children}</motion.div>
    </div>
  );
};

// --- UTILITIES & UI COMPONENTS ---

const GlobalFilmGrain = () => (
  <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.035] mix-blend-screen">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" /></filter>
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
    window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseover', handleMouseOver);
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseover', handleMouseOver); };
  }, []);
  return (
    <motion.div className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[999] mix-blend-difference hidden md:flex items-center justify-center" animate={{ x: position.x - 8, y: position.y - 8, scale: isPointer ? 3 : 1, backgroundColor: isPointer ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,1)', border: isPointer ? '0.5px solid rgba(255,255,255,0.5)' : 'none' }} transition={{ type: 'spring', stiffness: 700, damping: 40, mass: 0.1 }} />
  );
};

const InteractiveFlowingLines = () => {
  const [dimensions, setDimensions] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 1000, height: typeof window !== 'undefined' ? window.innerHeight : 800 });
  const mouseX = useMotionValue(dimensions.width / 2);
  const mouseY = useMotionValue(dimensions.height / 2);
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 20, mass: 2 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 20, mass: 2 });
  const path1 = useMotionValue(""); const path2 = useMotionValue(""); const path3 = useMotionValue("");

  useEffect(() => {
    const updateDims = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', updateDims); return () => window.removeEventListener('resize', updateDims);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', handleMouseMove); return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useAnimationFrame((t) => {
    const w = dimensions.width; const h = dimensions.height; const cx = smoothX.get(); const cy = smoothY.get();
    const wave1 = Math.sin(t / 2000) * 150; const wave2 = Math.cos(t / 3000) * 150; const wave3 = Math.sin(t / 4000) * 150;
    path1.set(`M -200 ${h * 0.4 + wave1} Q ${cx + wave2} ${cy + wave3} ${w + 200} ${h * 0.6 - wave1}`);
    path2.set(`M -200 ${h * 0.8 + wave2} Q ${cx + wave3} ${cy - wave1} ${w + 200} ${h * 0.2 - wave2}`);
    path3.set(`M -200 ${h * 0.2 + wave3} Q ${cx - wave1} ${cy + wave2} ${w + 200} ${h * 0.8 - wave3}`);
  });

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
      <svg width="100%" height="100%" className="absolute inset-0 mix-blend-screen">
        <motion.path d={path1} fill="none" stroke={palette.primary} strokeWidth="1.5" opacity="0.7" />
        <motion.path d={path2} fill="none" stroke={palette.blue} strokeWidth="1" opacity="0.6" />
        <motion.path d={path3} fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
      </svg>
    </div>
  );
};

const SpotlightCard = ({ children, className = "", isActive = false }) => {
  const mouseX = useMotionValue(0); const mouseY = useMotionValue(0); const rgbPrimary = hexToRgbStr(palette.primary);
  function handleMouseMove({ currentTarget, clientX, clientY }) { const { left, top } = currentTarget.getBoundingClientRect(); mouseX.set(clientX - left); mouseY.set(clientY - top); }
  return (
    <div className={`relative overflow-hidden group ${className}`} onMouseMove={handleMouseMove}>
      <motion.div className={`pointer-events-none absolute -inset-px rounded-[inherit] transition duration-500 z-0 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ background: useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(${rgbPrimary}, 0.12), transparent 80%)` }} />
      {children}
    </div>
  );
};

const ProblemHoverCard = ({ title, icon, type }) => {
  const color = palette[type] || palette.primary; const mouseX = useMotionValue(0); const mouseY = useMotionValue(0);
  function handleMouseMove({ currentTarget, clientX, clientY }) { const { left, top } = currentTarget.getBoundingClientRect(); mouseX.set(clientX - left); mouseY.set(clientY - top); }
  return (
    <motion.div onMouseMove={handleMouseMove} initial="initial" whileHover="hover" className="group relative cursor-default p-6 border rounded-[16px] flex flex-col justify-center h-44 overflow-hidden transition-all duration-500 shadow-lg hover:-translate-y-1" style={{ backgroundColor: palette.panel, borderColor: 'rgba(255,255,255,0.05)', borderBottom: `3px solid ${color}` }}>
      <motion.div className="pointer-events-none absolute -inset-px rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" style={{ background: useMotionTemplate`radial-gradient(150px circle at ${mouseX}px ${mouseY}px, ${color}15, transparent 80%)` }} />
      <motion.div variants={{ initial: { scale: 0.5, opacity: 0, x: -30, y: 30 }, hover: { scale: 2, opacity: 0.15, x: 0, y: 0 } }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="absolute -right-4 -bottom-4 w-28 h-28 blur-[25px] rounded-full pointer-events-none z-0" style={{ backgroundColor: color }} />
      <motion.div variants={{ initial: { scale: 0.5, opacity: 0, x: 30, y: -30 }, hover: { scale: 1.5, opacity: 0.1, x: 0, y: 0 } }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }} className="absolute -left-4 -top-4 w-20 h-20 blur-[20px] rounded-full pointer-events-none z-0" style={{ backgroundColor: color }} />
      <div className="relative z-10 flex flex-col items-start gap-4">
        <motion.div variants={{ initial: { y: 15, opacity: 0, scale: 0.5 }, hover: { y: 0, opacity: 1, scale: 1 } }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="flex items-center justify-center w-10 h-10 rounded-[10px] shadow-sm" style={{ backgroundColor: color, color: palette.bgDeep }}>{icon}</motion.div>
        <motion.span variants={{ initial: { y: -8 }, hover: { y: 0 } }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="text-sm font-medium text-white/70 group-hover:text-white leading-snug font-primary">{title}</motion.span>
      </div>
    </motion.div>
  );
};

const DiagnoseVisual = () => {
  const rgbPrimary = hexToRgbStr(palette.primary);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="absolute inset-0 flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, rgba(${rgbPrimary},0.15) 0%, transparent 60%)` }} />
      <div className="border border-white/10 rounded-[16px] p-6 w-full max-w-sm mb-4 shadow-2xl relative z-10" style={{ backgroundColor: palette.bgDeep }}>
        <div className="w-1/2 h-2 bg-white/10 rounded-full mb-8" />
        <div className="space-y-4">
          <motion.div animate={{ borderColor: ['rgba(255,255,255,0.05)', `rgba(${rgbPrimary},0.6)`, 'rgba(255,255,255,0.05)'] }} transition={{ duration: 2, repeat: Infinity }} className="h-12 bg-white/[0.02] border rounded-[8px] flex items-center px-4"><div className="w-4 h-4 rounded-full border border-white/20 mr-4"/><div className="w-2/3 h-2 bg-white/20 rounded-full"/></motion.div>
          <div className="h-12 bg-white/[0.02] border border-white/5 rounded-[8px] flex items-center px-4"><div className="w-4 h-4 rounded-full border border-white/20 mr-4"/><div className="w-1/2 h-2 bg-white/10 rounded-full"/></div>
          <div className="h-12 bg-white/[0.02] border border-white/5 rounded-[8px] flex items-center px-4"><div className="w-4 h-4 rounded-full border border-white/20 mr-4"/><div className="w-3/4 h-2 bg-white/10 rounded-full"/></div>
        </div>
      </div>
    </motion.div>
  );
};

const MapVisual = () => {
  const rgbBlue = hexToRgbStr(palette.blue);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="absolute inset-0 flex items-center justify-center p-8">
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, rgba(${rgbBlue},0.15) 0%, transparent 60%)` }} />
      <div className="flex items-center gap-6 relative z-10 w-full max-w-md">
        <div className="flex flex-col gap-4 flex-1">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="px-4 py-3 bg-white/5 border border-white/10 rounded-[8px] text-[10px] text-white/50 text-center uppercase tracking-widest font-primary">Inconsistent Identity</motion.div>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="px-4 py-3 bg-white/5 border border-white/10 rounded-[8px] text-[10px] text-white/50 text-center uppercase tracking-widest font-primary">Weak Narrative</motion.div>
        </div>
        <div className="flex-1 flex flex-col items-center"><motion.div className="h-[2px] w-full" style={{ background: `linear-gradient(to right, transparent, ${palette.blue}, transparent)` }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} /></div>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="flex-1 border p-6 rounded-[16px] text-center flex flex-col items-center justify-center aspect-square shadow-2xl" style={{ background: `linear-gradient(to bottom right, rgba(${rgbBlue},0.2), transparent)`, borderColor: `rgba(${rgbBlue},0.3)` }}>
          <Layers className="w-8 h-8 mb-3" style={{ color: palette.blue }} />
          <div className="text-xs text-white font-medium tracking-wide font-primary">Brand<br/>Boulevard</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const BuildVisual = () => {
  const rgbPrimary = hexToRgbStr(palette.primary);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="absolute inset-0 flex items-center justify-center p-8">
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, rgba(${rgbPrimary},0.15) 0%, transparent 60%)` }} />
      <div className="border border-white/10 rounded-[16px] p-8 w-full max-w-sm shadow-2xl relative z-10" style={{ backgroundColor: palette.bgDeep }}>
        <h4 className="text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2 font-primary" style={{ color: palette.primary }}><PenTool className="w-4 h-4"/> Scope Blueprint</h4>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="flex items-center gap-4">
              <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 border" style={{ backgroundColor: `rgba(${rgbPrimary},0.2)`, borderColor: `rgba(${rgbPrimary},0.4)` }}><Check className="w-3 h-3" style={{ color: palette.primary }} /></div>
              <div className="flex-1 h-2.5 bg-white/10 rounded-full" />
              <div className="w-1/4 h-2.5 bg-white/5 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const StartVisual = () => {
  const rgbBlue = hexToRgbStr(palette.blue);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="absolute inset-0 flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, rgba(${rgbBlue},0.15) 0%, transparent 60%)` }} />
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="w-24 h-24 border rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg" style={{ backgroundColor: `${palette.green}1A`, borderColor: `${palette.green}4D` }}>
        <CheckCircle2 className="w-12 h-12" style={{ color: palette.green }} />
      </motion.div>
      <motion.h4 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-light text-white mb-2 relative z-10 font-primary">Brief Generated</motion.h4>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="px-8 py-3 bg-white text-black text-xs font-medium uppercase tracking-widest rounded-full relative z-10 mt-6 cursor-pointer hover:scale-105 transition-transform font-primary">Schedule Discovery</motion.div>
    </motion.div>
  );
};

const InteractiveHowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { num: '01', title: 'Diagnose', desc: 'Answer focused questions about your brand, teams, communication, and growth stage.', color: palette.primary },
    { num: '02', title: 'Map', desc: 'We identify your problem clusters and route you to the right strategic service paths.', color: palette.blue },
    { num: '03', title: 'Build', desc: 'Select priorities, deliverables, timelines, and depth to create a custom scope.', color: palette.primary },
    { num: '04', title: 'Start', desc: 'Submit your scope and begin the first conversation with clarity, not guesswork.', color: palette.blue }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-16 items-center w-full relative z-10 text-left">
      <div className="w-full lg:w-5/12 flex flex-col relative">
        <div className="absolute left-[47px] top-12 bottom-12 w-[2px] bg-white/5 overflow-hidden">
          <motion.div 
             className="absolute left-0 w-full rounded-full" 
             style={{ background: `linear-gradient(to bottom, ${palette.primary}, ${palette.blue})` }} 
             animate={{ top: `${activeStep * 33.33}%`, height: '33.33%' }} 
             transition={{ type: 'spring', stiffness: 300, damping: 30 }} 
          />
        </div>
        {steps.map((s, i) => {
            const isActive = activeStep === i;
            return (
              <div key={i} onMouseEnter={() => setActiveStep(i)} className={`relative flex items-start gap-8 p-6 rounded-[16px] cursor-pointer transition-all duration-500 ${isActive ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'}`}>
                <div className={`relative z-10 w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500`} style={{ borderColor: isActive ? palette.primary : 'rgba(255,255,255,0.1)', backgroundColor: isActive ? hexToRgba(palette.primary, 0.3) : palette.panel }}>
                  <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isActive ? 'scale-100' : 'bg-white/20 scale-50'}`} style={{ backgroundColor: isActive ? 'white' : '' }} />
                </div>
                <div>
                  <h3 className={`text-2xl font-light mb-2 transition-colors duration-500 font-primary ${isActive ? 'text-white' : 'text-white/40'}`}>{s.num}. {s.title}</h3>
                  <AnimatePresence>
                    {isActive && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm font-light text-white/50 leading-relaxed overflow-hidden font-secondary">{s.desc}</motion.p>}
                  </AnimatePresence>
                </div>
              </div>
            );
        })}
      </div>
      <div className="w-full lg:w-7/12 h-[450px] border border-white/10 rounded-[24px] relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]" style={{ backgroundColor: palette.panel }}>
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

const AnimatedItalic = ({ children, className = "" }) => {
  return (
    <span 
      className={`inline-block font-serif italic cursor-default transition-all duration-500 pr-2 ${className}`}
      style={{ '--hover-shadow': `0 0 20px ${hexToRgba(palette.primary, 0.6)}` }}
      onMouseEnter={(e) => e.currentTarget.style.filter = `drop-shadow(0 0 20px ${hexToRgba(palette.primary, 0.6)})`}
      onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
    >{children}</span>
  );
};

const PremiumButton = ({ children, onClick, variant = "primary", className = "", type = "button", disabled = false, style }) => {
  const buttonRef = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 }); const smoothY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    if (disabled || !buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    x.set((e.clientX - (left + width / 2)) * 0.15); y.set((e.clientY - (top + height / 2)) * 0.15);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const isPrimary = variant === "primary";
  const btnStyle = isPrimary ? { background: `linear-gradient(to right, ${palette.primary}, ${palette.blue})`, color: 'white', x: smoothX, y: smoothY, boxShadow: `0 0 20px rgba(104, 101, 250, 0.4)`, ...style } : { x: smoothX, y: smoothY, ...style };
  const baseClasses = isPrimary ? `hover:brightness-110 font-bold border border-white/20` : (variant === "secondary" ? "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20" : "text-white/70 hover:text-white hover:bg-white/5");

  return (
    <motion.button ref={buttonRef} type={type} onClick={onClick} disabled={disabled} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={btnStyle} className={`group relative inline-flex items-center justify-center px-8 py-4 tracking-wide transition-all duration-500 overflow-hidden rounded-[9px] text-sm hover:scale-[1.02] ${baseClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''} font-primary`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {isPrimary && !disabled && <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out skew-x-12" />}
    </motion.button>
  );
};

const BrandHealthRadar = ({ clusters }) => {
  const data = [
    { label: 'Messaging', score: clusters.includes('Messaging Inconsistency') ? 35 : 90 },
    { label: 'Identity', score: clusters.includes('Generic Identity') ? 40 : 85 },
    { label: 'Narrative', score: clusters.includes('Weak Narrative') ? 30 : 85 },
    { label: 'Systems', score: clusters.includes('Lack of Systems') ? 25 : 80 },
    { label: 'Execution', score: clusters.includes('Execution Gap') ? 45 : 85 },
  ];

  const overallScore = Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / data.length);
  const size = 300; const center = size / 2; const radius = 100; const levels = [0.2, 0.4, 0.6, 0.8, 1];
  const getPoint = (value, index, total) => { const angle = (Math.PI * 2 * index) / total - Math.PI / 2; return { x: center + radius * value * Math.cos(angle), y: center + radius * value * Math.sin(angle) }; };
  const dataPoints = data.map((d, i) => { const p = getPoint(d.score / 100, i, data.length); return `${p.x},${p.y}`; }).join(' ');
  const rgbPrimary = hexToRgbStr(palette.primary);

  return (
    <div className="relative w-full max-w-[340px] aspect-square mx-auto flex items-center justify-center">
      <div className="absolute inset-0 opacity-10 blur-[60px] rounded-full pointer-events-none" style={{ backgroundColor: palette.primary }} />
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible drop-shadow-2xl">
        {levels.map((level, i) => <polygon key={i} points={data.map((_, j) => `${getPoint(level, j, data.length).x},${getPoint(level, j, data.length).y}`).join(' ')} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />)}
        {data.map((_, i) => <line key={i} x1={center} y1={center} x2={getPoint(1, i, data.length).x} y2={getPoint(1, i, data.length).y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />)}
        <motion.polygon points={dataPoints} fill={`rgba(${rgbPrimary},0.2)`} stroke={palette.primary} strokeWidth="2" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.2 }} style={{ transformOrigin: `${center}px ${center}px` }} className="mix-blend-screen" />
        {data.map((d, i) => <motion.circle key={i} cx={getPoint(d.score / 100, i, data.length).x} cy={getPoint(d.score / 100, i, data.length).y} r="4" fill="#ffffff" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }} />)}
        {data.map((d, i) => <motion.text key={i} x={getPoint(1.25, i, data.length).x} y={getPoint(1.25, i, data.length).y} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle" alignmentBaseline="middle" className="uppercase tracking-widest font-medium font-primary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>{d.label}</motion.text>)}
      </svg>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center backdrop-blur-md w-16 h-16 rounded-full justify-center border border-white/10 shadow-xl" style={{ backgroundColor: `${palette.bgDeep}CC` }}>
        <span className="text-xl font-light text-white leading-none font-primary">{overallScore}</span><span className="text-[8px] uppercase tracking-widest" style={{ color: palette.primary }}>Index</span>
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
    setTimeout(() => { if (step < QUIZ_QUESTIONS.length) { setStep(step + 1); } else { processDiagnosis(newAnswers); } }, 400);
  };

  const processDiagnosis = (finalAnswers) => {
    const foundClusters = new Set(); const foundRoutes = new Set();
    Object.values(finalAnswers).forEach(opt => { if (opt.cluster) foundClusters.add(opt.cluster); if (opt.routes) opt.routes.forEach(r => foundRoutes.add(r)); });
    setClusters(Array.from(foundClusters));
    const recRoutes = Array.from(foundRoutes).length > 0 ? Array.from(foundRoutes) : ['BB'];
    setRoutes(recRoutes); setSelectedRoutes(recRoutes); setStep(4);
  };

  const submitLead = (e) => {
    e.preventDefault();
    GLOBAL_LEADS.push({ ...leadForm, stage: answers.stage?.label, clusters, routes, deliverables: selectedDeliverables, ...context, date: new Date().toISOString(), status: 'New', score: Math.floor(Math.random() * 40) + 60 });
    setStep(9);
  };

  const LiveScopePreview = () => (
    <div className="border border-white/10 rounded-[24px] p-8 flex flex-col h-full shadow-2xl relative overflow-hidden" style={{ backgroundColor: palette.panel }}>
      <div className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.03] blur-[100px] pointer-events-none" style={{ backgroundColor: palette.primary }} />
      <h3 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-8 border-b border-white/5 pb-4 font-primary">Live Blueprint</h3>
      <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
        <div className={`transition-opacity duration-500 ${answers.stage ? 'opacity-100' : 'opacity-20'}`}>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1 font-primary">Brand Stage</div>
          <div className="text-sm font-light text-white font-secondary">{answers.stage ? answers.stage.label : 'Pending...'}</div>
        </div>
        <div className={`transition-opacity duration-500 ${clusters.length > 0 ? 'opacity-100' : 'opacity-20'}`}>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2 font-primary">Identified Gaps</div>
          <div className="flex flex-wrap gap-2">
            {clusters.map(c => <span key={c} className="px-2 py-1 text-[10px] uppercase tracking-widest rounded border font-secondary" style={{ backgroundColor: hexToRgba(palette.primary, 0.1), color: palette.primary, borderColor: hexToRgba(palette.primary, 0.2) }}>{c}</span>)}
          </div>
        </div>
        <div className={`transition-opacity duration-500 ${selectedDeliverables.length > 0 ? 'opacity-100' : 'opacity-20'}`}>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2 font-primary">Scope Blueprint</div>
          {selectedDeliverables.length > 0 ? (
            <ul className="space-y-2">
              {DELIVERABLES_MASTER.filter(d => selectedDeliverables.includes(d.id)).map(d => (
                <li key={d.id} className="text-xs font-light text-white flex items-start gap-2 font-secondary"><Check className="w-3 h-3 shrink-0 mt-[2px]" style={{ color: palette.accent }} /> {d.name}</li>
              ))}
            </ul>
          ) : <div className="text-xs font-light text-white/30 italic font-secondary">Awaiting selection...</div>}
        </div>
      </div>
    </div>
  );

  const steps = [
    // Step 0: Welcome
    <div key="s0" className="flex flex-col justify-center h-full max-w-2xl text-left">
      <FadeUp>
        <div className="w-16 h-16 border rounded-[16px] flex items-center justify-center mb-8" style={{ backgroundColor: hexToRgba(palette.primary, 0.8), borderColor: hexToRgba(palette.primary, 0.3) }}><Fingerprint className="w-8 h-8" style={{ color: palette.bgDeep }} /></div>
        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6 leading-[1.1] font-primary">Build your <AnimatedItalic>strategic</AnimatedItalic> brand scope.</h1>
        <p className="text-lg md:text-xl text-white/50 font-light mb-12 leading-relaxed font-secondary">This is not a generic form. It is a guided discovery system. We’ll map your gaps, define service priorities, and generate a customized roadmap before our first conversation.</p>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <PremiumButton onClick={() => setStep(1)} className="w-full sm:w-auto px-10 py-5">Start Assessment</PremiumButton>
          <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 py-2 font-secondary"><ArrowLeft className="w-4 h-4"/> Back to Home</button>
        </div>
      </FadeUp>
    </div>,

    // Steps 1-3: Quiz Questions
    ...QUIZ_QUESTIONS.map((q, i) => (
      <div key={`q${i}`} className="flex flex-col justify-center h-full max-w-2xl w-full text-left">
        <FadeUp>
          <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6 font-primary">Phase 1 / Diagnosis ({i+1}/3)</div>
          <h2 className="text-3xl md:text-4xl font-light mb-10 font-primary">{q.title}</h2>
          <StaggerGroup className="space-y-3 w-full">
            {q.options.map((opt, j) => {
                const isSelected = answers[q.id]?.id === opt.id;
                return (
                  <StaggerItem key={opt.id}>
                    <button 
                      onClick={() => handleQuizSelect(q.id, opt)} 
                      className="w-full text-left p-5 rounded-[12px] border transition-all duration-300 flex items-center gap-4 font-secondary hover:translate-x-1"
                      style={{ borderColor: isSelected ? palette.primary : 'rgba(255,255,255,0.1)', backgroundColor: isSelected ? hexToRgba(palette.primary, 0.1) : 'rgba(255,255,255,0.02)', color: isSelected ? 'white' : 'rgba(255,255,255,0.6)' }}
                    >
                      <span className="font-serif italic opacity-40 text-lg w-6">0{j+1}</span>
                      <span className="text-lg font-light">{opt.label}</span>
                    </button>
                  </StaggerItem>
                )
            })}
          </StaggerGroup>
          <div className="mt-8 flex"><button onClick={() => setStep(step === 1 ? 0 : step - 1)} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 font-secondary"><ArrowLeft className="w-4 h-4"/> Back</button></div>
        </FadeUp>
      </div>
    )),

    // Step 4: Diagnosis Result
    <div key="s4" className="flex flex-col justify-center h-full max-w-3xl w-full text-left">
      <FadeUp>
        <div className="text-xs font-medium uppercase tracking-widest mb-6 flex items-center gap-2 font-primary" style={{ color: palette.primary }}><Sparkles className="w-4 h-4"/> Strategic Diagnosis</div>
        <h2 className="text-3xl md:text-4xl font-light mb-6 font-primary">Your brand opportunity areas.</h2>
        <p className="text-white/50 font-light mb-12 text-lg font-secondary">Based on your answers, your communication is currently breaking due to <strong className="text-white">{clusters.join(' & ')}</strong>. We recommend structuring your project around these core ecosystems:</p>
        <StaggerGroup className="grid sm:grid-cols-2 gap-4 mb-12 w-full">
          {routes.map(r => {
            const rColor = palette[ROUTES_INFO[r].type] || palette.primary;
            return (
              <StaggerItem key={r}>
                <div className="border border-white/10 rounded-[16px] p-6 text-left flex flex-col h-full" style={{ backgroundColor: palette.panel }}>
                  <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center mb-6 shadow-sm`} style={{ backgroundColor: rColor, color: palette.bgDeep }}>{ROUTES_INFO[r].icon}</div>
                  <h4 className="text-xl font-medium mb-2 font-primary">{ROUTES_INFO[r].title}</h4>
                  <p className="text-sm text-white/40 font-light leading-relaxed font-secondary">{ROUTES_INFO[r].desc}</p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
        <div className="flex gap-6 items-center">
          <PremiumButton onClick={() => setStep(5)}>Customize Scope</PremiumButton>
          <button onClick={() => setStep(3)} className="text-white/40 hover:text-white text-sm transition-colors font-secondary">Back</button>
        </div>
      </FadeUp>
    </div>,

    // Step 5: Route Selection
    <div key="s5" className="flex flex-col justify-center h-full max-w-2xl w-full text-left">
      <FadeUp>
        <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6 font-primary">Phase 2 / Architecture</div>
        <h2 className="text-3xl md:text-4xl font-light mb-6 font-primary">Select your service routes.</h2>
        <p className="text-white/50 font-light mb-10 font-secondary">We pre-selected routes based on your diagnosis. Add or remove routes to define your scope foundation.</p>
        <StaggerGroup className="space-y-4 w-full mb-12">
          {Object.values(ROUTES_INFO).map(route => {
            const isSelected = selectedRoutes.includes(route.id);
            return (
              <StaggerItem key={route.id}>
                <button onClick={() => setSelectedRoutes(prev => isSelected ? prev.filter(r => r !== route.id) : [...prev, route.id])} className="w-full text-left p-6 rounded-[16px] border transition-all duration-300 flex items-center gap-6" style={{ borderColor: isSelected ? palette.blue : 'rgba(255,255,255,0.1)', backgroundColor: isSelected ? hexToRgba(palette.blue, 0.1) : 'rgba(255,255,255,0.02)' }}>
                  <div className="w-6 h-6 rounded flex items-center justify-center border" style={{ backgroundColor: isSelected ? palette.blue : 'transparent', borderColor: isSelected ? palette.blue : 'rgba(255,255,255,0.3)' }}>{isSelected && <Check className="w-4 h-4 text-white"/>}</div>
                  <div>
                    <div className={`text-lg font-medium mb-1 font-primary ${isSelected ? 'text-white' : 'text-white/70'}`}>{route.title}</div>
                    <div className="text-sm font-light text-white/40 font-secondary">{route.desc}</div>
                  </div>
                </button>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
        <div className="flex gap-6 items-center">
          <PremiumButton disabled={selectedRoutes.length === 0} onClick={() => setStep(6)}>Select Deliverables</PremiumButton>
          <button onClick={() => setStep(4)} className="text-white/40 hover:text-white text-sm transition-colors font-secondary">Back</button>
        </div>
      </FadeUp>
    </div>,

    // Step 6: Deliverables Selection
    <div key="s6" className="flex flex-col h-full max-w-3xl w-full py-10 text-left">
      <FadeUp>
        <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6 font-primary">Phase 3 / Details</div>
        <h2 className="text-3xl md:text-4xl font-light mb-2 font-primary">Build Your Scope</h2>
        <p className="text-white/50 font-light mb-10 font-secondary">Select the specific deliverables you need across your chosen routes.</p>
        <StaggerGroup className="space-y-10 w-full pb-10">
          {selectedRoutes.map(rId => {
            const route = ROUTES_INFO[rId];
            const rColor = palette[route.type] || palette.primary;
            return (
              <StaggerItem key={rId}>
                <h4 className="text-sm font-medium tracking-widest uppercase mb-4 pb-2 border-b border-white/5 flex items-center gap-2 font-primary" style={{ color: rColor }}>{route.icon} {route.title}</h4>
                <div className="space-y-6">
                  {route.lineItems.map(li => {
                    const delivs = DELIVERABLES_MASTER.filter(d => d.lineItem === li.id);
                    if (delivs.length === 0) return null;
                    return (
                      <div key={li.id} className="bg-white/[0.01] border border-white/5 rounded-[12px] p-6">
                        <h5 className="font-medium text-white/80 mb-4 font-primary">{li.name}</h5>
                        <div className="grid gap-3">
                          {delivs.map(d => {
                            const isSelected = selectedDeliverables.includes(d.id);
                            return (
                              <button key={d.id} onClick={() => setSelectedDeliverables(prev => isSelected ? prev.filter(x => x !== d.id) : [...prev, d.id])} className="p-4 rounded-[8px] border text-left transition-all flex items-start gap-4 font-secondary hover:translate-x-1" style={{ borderColor: isSelected ? palette.blue : 'rgba(255,255,255,0.1)', backgroundColor: isSelected ? hexToRgba(palette.blue, 0.1) : 'rgba(255,255,255,0.03)' }}>
                                <div className="w-4 h-4 rounded-sm border mt-1 flex items-center justify-center shrink-0" style={{ backgroundColor: isSelected ? palette.blue : 'transparent', borderColor: isSelected ? palette.blue : 'rgba(255,255,255,0.3)' }}>{isSelected && <Check className="w-3 h-3 text-white" />}</div>
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
              </StaggerItem>
            )
          })}
        </StaggerGroup>
        <div className="pt-8 border-t border-white/10 mt-auto flex gap-6 items-center">
          <PremiumButton disabled={selectedDeliverables.length === 0} onClick={() => setStep(7)}>Next: Project Context</PremiumButton>
          <button onClick={() => setStep(5)} className="text-white/40 hover:text-white text-sm transition-colors font-secondary">Back</button>
        </div>
      </FadeUp>
    </div>,

    // Step 7: Context
    <div key="s7" className="flex flex-col justify-center h-full max-w-2xl w-full text-left">
      <FadeUp>
        <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6 font-primary">Phase 4 / Execution</div>
        <h2 className="text-3xl md:text-4xl font-light mb-10 font-primary">Project Context.</h2>
        <div className="space-y-6 w-full mb-12">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-3 font-secondary">What level of support are you looking for?</label>
            <select value={context.depth} onChange={e=>setContext({...context, depth: e.target.value})} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none appearance-none font-secondary" style={{ '--tw-ring-color': palette.blue }}>
              <option value="" style={{ backgroundColor: palette.bgDeep }}>Select depth...</option>
              <option value="Light-touch consulting" style={{ backgroundColor: palette.bgDeep }}>Light-touch consulting</option>
              <option value="Strategic direction + selected assets" style={{ backgroundColor: palette.bgDeep }}>Strategic direction + selected assets</option>
              <option value="End-to-end brand transformation" style={{ backgroundColor: palette.bgDeep }}>End-to-end brand transformation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-3 font-secondary">When do you want to begin?</label>
            <select value={context.timeline} onChange={e=>setContext({...context, timeline: e.target.value})} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none appearance-none font-secondary" style={{ '--tw-ring-color': palette.blue }}>
              <option value="" style={{ backgroundColor: palette.bgDeep }}>Select timeline...</option>
              <option value="Immediately" style={{ backgroundColor: palette.bgDeep }}>Immediately</option>
              <option value="Within 2-4 weeks" style={{ backgroundColor: palette.bgDeep }}>Within 2–4 weeks</option>
              <option value="This quarter" style={{ backgroundColor: palette.bgDeep }}>This quarter</option>
            </select>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <PremiumButton disabled={!context.depth || !context.timeline} onClick={() => setStep(8)}>Finalize Blueprint</PremiumButton>
          <button onClick={() => setStep(6)} className="text-white/40 hover:text-white text-sm transition-colors font-secondary">Back</button>
        </div>
      </FadeUp>
    </div>,

    // Step 8: Lead Capture
    <div key="s8" className="flex flex-col justify-center h-full max-w-2xl w-full text-left">
      <FadeUp>
        <div className="text-xs font-medium uppercase tracking-widest mb-6 font-primary" style={{ color: palette.blue }}>Final Step</div>
        <h2 className="text-3xl md:text-4xl font-light mb-6 font-primary">Where should we send your Scope Snapshot?</h2>
        <p className="text-white/50 font-light mb-10 text-lg font-secondary">Enter your details below to instantly generate your strategy report and brief our consulting team.</p>
        <form onSubmit={submitLead} className="space-y-4 w-full font-secondary">
          <input required type="text" placeholder="Full Name" value={leadForm.name} onChange={e=>setLeadForm({...leadForm, name: e.target.value})} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none" style={{ '--tw-ring-color': palette.blue }} />
          <input required type="email" placeholder="Work Email" value={leadForm.email} onChange={e=>setLeadForm({...leadForm, email: e.target.value})} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none" style={{ '--tw-ring-color': palette.blue }} />
          <input required type="text" placeholder="Company / Brand Name" value={leadForm.company} onChange={e=>setLeadForm({...leadForm, company: e.target.value})} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none" style={{ '--tw-ring-color': palette.blue }} />
          <div className="pt-6 flex gap-4 items-center">
            <PremiumButton type="submit" className="w-full sm:w-auto px-10">Generate Report & Send Brief</PremiumButton>
            <button type="button" onClick={() => setStep(7)} className="text-white/40 hover:text-white text-sm transition-colors">Back</button>
          </div>
        </form>
      </FadeUp>
    </div>,

    // Step 9: The Scope Snapshot Report
    <div key="s9" className="flex flex-col justify-center h-full w-full py-12">
      <FadeUp className="relative p-[1px] rounded-[24px] bg-gradient-to-b from-white/20 to-white/5 max-w-5xl w-full mx-auto">
        <div className="rounded-[23px] p-8 md:p-14 relative overflow-hidden text-left shadow-[0_50px_100px_rgba(0,0,0,0.8)]" style={{ backgroundColor: palette.bgDeep }}>
          <div className="flex flex-col md:flex-row justify-between items-start border-b border-white/10 pb-8 mb-10 relative z-10 gap-6">
            <div>
              <div className="text-xs uppercase tracking-widest mb-3 font-medium flex items-center gap-2 font-primary" style={{ color: palette.primary }}><FileText className="w-4 h-4"/> Official Scope Snapshot</div>
              <h2 className="text-4xl font-light text-white mb-2 font-primary">{leadForm.company || 'Your Brand'}</h2>
              <p className="text-white/50 text-sm font-secondary">Prepared for {leadForm.name || 'Client'}</p>
            </div>
            <div className="md:text-right">
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1 font-primary">Date Generated</div>
              <div className="text-sm font-medium text-white/70 font-secondary">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 relative z-10">
            <div className="space-y-10">
              <div className="bg-white/[0.02] border border-white/5 rounded-[16px] p-8 mb-8 relative overflow-hidden">
                 <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-8 font-primary">Diagnostic Brand Health</h4>
                 <BrandHealthRadar clusters={clusters} />
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-4 border-b border-white/5 pb-2 font-primary">Recommended Ecosystems</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoutes.map(r => <span key={r} className="px-3 py-1.5 bg-white/5 text-white/70 text-xs border border-white/10 rounded-full flex items-center gap-2 font-secondary">{ROUTES_INFO[r]?.icon} {ROUTES_INFO[r]?.title}</span>)}
                </div>
              </div>
              
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-4 border-b border-white/5 pb-2 font-primary">Execution Context</h4>
                <div className="text-sm text-white/70 font-light space-y-3 bg-white/[0.02] p-6 rounded-[12px] border border-white/5 font-secondary">
                  <p className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Brand Stage</span> <span className="text-right">{answers.stage?.label}</span></p>
                  <p className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Timeline</span> <span className="text-right">{context.timeline}</span></p>
                  <p className="flex justify-between"><span className="text-white/40">Engagement Depth</span> <span className="text-right">{context.depth}</span></p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-4 border-b border-white/5 pb-2 font-primary">Selected Deliverables Blueprint</h4>
              <ul className="space-y-4">
                {DELIVERABLES_MASTER.filter(d => selectedDeliverables.includes(d.id)).map(d => (
                  <li key={d.id} className="flex items-start gap-3 bg-white/[0.02] p-4 rounded-[12px] border border-white/5">
                    <div className="p-1.5 rounded-md shrink-0" style={{ backgroundColor: hexToRgba(palette.blue, 0.2) }}><CheckSquare className="w-4 h-4" style={{ color: palette.blue }} /></div>
                    <div>
                      <div className="text-sm font-medium text-white mb-1 font-secondary">{d.name}</div>
                      <div className="text-xs text-white/40 leading-relaxed font-secondary">{d.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
            <p className="text-xs text-white/40 max-w-md leading-relaxed font-secondary">This snapshot has been securely routed to our partners. We will review your requirements and reach out within 24 hours to schedule a discovery alignment.</p>
            <div className="flex gap-4 w-full sm:w-auto">
              <PremiumButton onClick={() => window.print()} variant="secondary" className="w-full sm:w-auto px-6 py-3"><Printer className="w-4 h-4 mr-2" /> Print</PremiumButton>
              <PremiumButton onClick={() => navigate('home')} className="w-full sm:w-auto px-6 py-3">Return to Website</PremiumButton>
            </div>
          </div>
        </div>
      </FadeUp>
    </div>
  ];

  return (
    <div className="min-h-screen text-[#F4F4F5] pt-28 pb-0 relative overflow-hidden w-full" style={{ backgroundColor: palette.bgDeep }}>
      {step > 0 && step < 9 && (
        <div className="fixed top-[72px] md:top-[88px] left-0 w-full h-[2px] bg-white/10 z-20">
          <motion.div className="h-full" style={{ backgroundColor: palette.primary }} initial={{ width: 0 }} animate={{ width: `${(step / 8) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      )}
      <div className="w-full px-[3%] flex flex-col md:flex-row justify-between relative gap-8">
        <div className="flex-1 flex items-center justify-start pt-12 pb-32 md:pb-12 min-h-[80vh] w-full">
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
          <button onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)} className="w-full border-t border-white/10 p-4 flex items-center justify-between text-sm font-medium backdrop-blur-xl font-secondary" style={{ backgroundColor: palette.panel }}>
            <span className="flex items-center gap-2"><FileText className="w-4 h-4" style={{ color: palette.primary }}/> View Live Scope {selectedDeliverables.length > 0 && `(${selectedDeliverables.length})`}</span>
            {isMobilePreviewOpen ? <ChevronDown className="w-4 h-4"/> : <ChevronUp className="w-4 h-4"/>}
          </button>
          <AnimatePresence>
            {isMobilePreviewOpen && (
              <motion.div initial={{ height: 0 }} animate={{ height: '60vh' }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/5" style={{ backgroundColor: palette.panel }}>
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
      className="group relative cursor-pointer p-6 rounded-[16px] border border-white/15 hover:border-white/30 transition-all duration-500 overflow-hidden h-full flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.45)] hover:-translate-y-1"
      style={{ 
        backgroundColor: `${palette.bgDeep}`,
        borderBottom: `4px solid ${color}`,
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)'
      }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"
        style={{ background: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, ${color}15, transparent 80%)` }}
      />
      <motion.div 
        variants={{ initial: { scale: 0.8, opacity: 0, rotate: 0 }, hover: { scale: 1.8, opacity: 0.1, rotate: 90 } }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -right-12 -bottom-12 w-48 h-48 blur-[40px] rounded-[100%] pointer-events-none z-0"
        style={{ backgroundColor: color }}
      />
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </motion.div>
  );
};

const NavLink = ({ children, onClick, active, onMouseEnter, onMouseLeave }) => {
  return (
    <span
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative px-5 py-2.5 cursor-pointer transition-colors capitalize rounded-full overflow-hidden font-secondary ${active ? 'text-white' : 'text-white/50 hover:text-white'}`}
    >
      {active && <motion.div layoutId="nav-indicator" className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/10 z-0" />}
      <span className="relative z-10">{children}</span>
    </span>
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

  useEffect(() => {
    if (activeMenu) {
      document.documentElement.classList.add('mega-menu-open');
    } else {
      document.documentElement.classList.remove('mega-menu-open');
    }

    return () => {
      document.documentElement.classList.remove('mega-menu-open');
    };
  }, [activeMenu]);

  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 260);
  };

  const ServicesMegaMenu = () => (
    <div className="flex gap-12 text-left">
      <div className="w-1/3 pr-12 border-r border-white/5 flex flex-col items-start">
        <div className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-6 border" style={{ backgroundColor: palette.primary, borderColor: hexToRgba(palette.primary, 0.2), color: palette.bgDeep }}><Layers className="w-6 h-6" /></div>
        <h3 className="text-2xl font-light mb-4 text-white font-primary">Consulting Ecosystems</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-8 font-secondary">We deliver across three distinct pillars depending on your growth stage and communication gaps.</p>
        <button onClick={() => { navigate('services'); setActiveMenu(null); }} className="text-sm text-white/70 hover:text-white flex items-center gap-2 group mt-auto font-medium font-secondary">View All Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></button>
      </div>
      <div className="w-2/3 grid grid-cols-3 gap-6">
        {Object.values(ROUTES_INFO).map(route => {
          const rColor = palette[route.type] || palette.primary;
          return (
            <MenuHoverCard key={route.id} color={rColor} onClick={() => { navigate(`services/${route.id.toLowerCase()}`); setActiveMenu(null); }}>
              <motion.div variants={{ initial: { y: 0, scale: 1 }, hover: { y: -4, scale: 1.05 } }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className="w-12 h-12 rounded-[12px] border border-white/10 flex items-center justify-center mb-5 shadow-inner" style={{ backgroundColor: rColor, color: palette.bgDeep, border: 'none' }}>{route.icon}</motion.div>
              <h4 className="text-lg font-medium text-white mb-2 font-primary">{route.title}</h4>
              <p className="text-xs text-white/40 leading-relaxed font-light font-secondary">{route.desc}</p>
            </MenuHoverCard>
          )
        })}
      </div>
    </div>
  );

  const WorkMegaMenu = () => (
    <div className="flex gap-12 text-left">
      <div className="w-1/3 pr-12 border-r border-white/5 flex flex-col items-start">
        <div className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-6 border" style={{ backgroundColor: palette.blue, borderColor: hexToRgba(palette.blue, 0.2), color: palette.bgDeep }}><Briefcase className="w-6 h-6" /></div>
        <h3 className="text-2xl font-light mb-4 text-white font-primary">Selected Work</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-8 font-secondary">Case studies and full visual archive proving our thinking across strategy, identity, and campaigns.</p>
        <button onClick={() => { navigate('work'); setActiveMenu(null); }} className="text-sm text-white/70 hover:text-white flex items-center gap-2 group mt-auto font-medium font-secondary">View Full Archive <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></button>
      </div>
      <div className="w-2/3 grid grid-cols-2 gap-6">
        {CASE_STUDIES.slice(0, 2).map((cs, i) => {
          const hexColor = palette[cs.type] || palette.primary;
          return (
            <MenuHoverCard key={i} color={hexColor} onClick={() => { navigate('work'); setActiveMenu(null); }}>
              <div className="flex gap-6 items-center">
                <div className="w-24 h-24 rounded-[12px] bg-white/5 relative overflow-hidden shrink-0 border border-white/10">
                  <motion.div variants={{ initial: { scale: 1, opacity: 0.2 }, hover: { scale: 1.2, opacity: 0.4 } }} transition={{ duration: 0.7, ease: "easeOut" }} className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${hexColor}, transparent)` }} />
                  <div className="absolute inset-0 flex items-center justify-center"><span className="font-serif italic text-white/40 text-2xl">{cs.client.split(' ')[0]}</span></div>
                </div>
                <div>
                  <motion.span variants={{ initial: { x: 0 }, hover: { x: 4 } }} transition={{ duration: 0.3 }} className="text-[10px] tracking-widest uppercase mb-2 block font-medium font-primary" style={{ color: hexColor }}>{cs.sector}</motion.span>
                  <h4 className="text-white font-medium mb-1 text-lg font-secondary">{cs.client}</h4>
                  <p className="text-xs text-white/40 line-clamp-2 leading-relaxed font-light font-secondary">{cs.challenge}</p>
                </div>
              </div>
            </MenuHoverCard>
          );
        })}
      </div>
    </div>
  );

  const AboutMegaMenu = () => (
    <div className="flex gap-12 text-left">
      <div className="w-1/3 pr-12 border-r border-white/5 flex flex-col items-start">
        <div className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-6 border" style={{ backgroundColor: palette.primary, borderColor: hexToRgba(palette.primary, 0.2), color: palette.bgDeep }}><Dna className="w-6 h-6" /></div>
        <h3 className="text-2xl font-light mb-4 text-white font-primary">Who We Are</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-8 font-secondary">A Brand Communication Studio which co-creates brands backed by cutting-edge innovation; with a SciArt-Driven Approach.</p>
      </div>
      <div className="w-2/3 grid grid-cols-2 gap-6">
         <MenuHoverCard color={palette.primary} onClick={() => { navigate('about'); setActiveMenu(null); }}>
           <h4 className="text-lg font-medium text-white mb-2 font-primary">About PBH</h4>
           <p className="text-xs text-white/40 font-secondary">Our Vision, Mission, and Core Values.</p>
         </MenuHoverCard>
         <MenuHoverCard color={palette.blue} onClick={() => { navigate('method'); setActiveMenu(null); }}>
           <h4 className="text-lg font-medium text-white mb-2 font-primary">The PBH Method</h4>
           <p className="text-xs text-white/40 font-secondary">Our step-by-step strategic process.</p>
         </MenuHoverCard>
         <MenuHoverCard color={palette.accent} onClick={() => { navigate('story'); setActiveMenu(null); }}>
           <h4 className="text-lg font-medium text-white mb-2 font-primary">Our Story</h4>
           <p className="text-xs text-white/40 font-secondary">How art and science collided.</p>
         </MenuHoverCard>
         <MenuHoverCard color={palette.purple} onClick={() => { navigate('team'); setActiveMenu(null); }}>
           <h4 className="text-lg font-medium text-white mb-2 font-primary">The Team</h4>
           <p className="text-xs text-white/40 font-secondary">The innovators behind the curtain.</p>
         </MenuHoverCard>
      </div>
    </div>
  );

  return (
    <header
      onMouseEnter={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }}
      onMouseLeave={handleMouseLeave}
      className={`fixed top-0 left-0 right-0 z-[10000] isolate w-full transition-all duration-300 border-b ${
        scrolled || activeMenu
          ? 'py-3 shadow-[0_24px_90px_rgba(0,0,0,0.85)] border-white/10'
          : 'py-6 border-transparent bg-transparent'
      }`}
      style={{
        backgroundColor: scrolled || activeMenu ? `${palette.bgDeep}FA` : 'transparent',
        backdropFilter: scrolled || activeMenu ? 'blur(18px) saturate(140%)' : 'none',
        WebkitBackdropFilter: scrolled || activeMenu ? 'blur(18px) saturate(140%)' : 'none'
      }}
    >
      <div className="w-full px-[3%] flex justify-between items-center relative z-[10001]">
        <div className={`font-medium tracking-wide cursor-pointer flex items-center gap-3 hover:opacity-80 transition-all duration-300 text-white font-primary ${scrolled || activeMenu ? 'text-base' : 'text-lg'}`} onClick={() => navigate('home')}>
          <img src="https://static.wixstatic.com/media/32f09f_d2e483f6417246ba946ed54bbb518bb8~mv2.png" alt="PurpleBlue House" className={`w-auto object-contain shrink-0 transition-all duration-300 ${scrolled || activeMenu ? 'h-5' : 'h-6'}`} />
          PurpleBlue House
        </div>
        
        <nav className="hidden lg:flex items-center gap-2 text-sm font-medium tracking-wide bg-white/[0.04] border border-white/10 rounded-full px-3 py-2 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_50px_rgba(0,0,0,0.35)] font-secondary">
          <NavLink onClick={() => {navigate('work'); setActiveMenu(null);}} onMouseEnter={() => handleMouseEnter('work')} active={current === 'work' || activeMenu === 'work'}>Work</NavLink>
          <NavLink onClick={() => {navigate('services'); setActiveMenu(null);}} onMouseEnter={() => handleMouseEnter('services')} active={current.startsWith('services') || activeMenu === 'services'}>Services</NavLink>
          <NavLink onClick={() => {navigate('about'); setActiveMenu(null);}} onMouseEnter={() => handleMouseEnter('about')} active={['about', 'method', 'story', 'team'].includes(current) || activeMenu === 'about'}>About Us</NavLink>
          <NavLink onClick={() => {navigate('journal'); setActiveMenu(null);}} onMouseEnter={() => setActiveMenu(null)} active={current.startsWith('journal') || current.startsWith('article')}>Journal</NavLink>
          <NavLink onClick={() => {navigate('contact'); setActiveMenu(null);}} onMouseEnter={() => setActiveMenu(null)} active={current === 'contact'}>Contact Us</NavLink>
        </nav>
        
        <div className="hidden lg:flex items-center">
            <PremiumButton onClick={() => {navigate('assessment'); setActiveMenu(null);}} className="px-6 py-2.5 rounded-[9px] text-xs font-secondary shadow-lg">Build My Brand Scope</PremiumButton>
        </div>
        
        <div className="lg:hidden flex items-center">
          <button onClick={() => navigate('assessment')} className="text-[10px] font-medium text-white px-4 py-2 rounded-[6px] uppercase tracking-widest shadow-md font-secondary" style={{ background: `linear-gradient(to right, ${palette.primary}, ${palette.blue})` }}>Build Scope</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeMenu && (
          <motion.div
            key="mega-menu-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[10000] pointer-events-auto"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            {/* Strong glass backdrop */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: `${palette.bgDeep}B8`,
                backdropFilter: 'blur(26px) saturate(160%)',
                WebkitBackdropFilter: 'blur(26px) saturate(160%)'
              }}
            />

            {/* Soft premium gradient wash */}
            <div
              className="absolute inset-0 pointer-events-none opacity-100"
              style={{
                background: `
                  radial-gradient(circle at 20% 10%, ${hexToRgba(palette.primary, 0.18)}, transparent 32%),
                  radial-gradient(circle at 80% 20%, ${hexToRgba(palette.blue, 0.14)}, transparent 34%),
                  linear-gradient(180deg, ${hexToRgba(palette.bgDeep, 0.98)}, ${hexToRgba(palette.bg, 0.98)})
                `
              }}
            />

            {/* Invisible hover bridge between nav and mega menu */}
            <div className="absolute top-[64px] left-0 right-0 h-[48px]" />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.985 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-[92px] left-[3%] right-[3%] origin-top"
            >
              <div
                className="relative overflow-hidden rounded-[28px] border p-10 shadow-[0_80px_180px_rgba(0,0,0,0.95)]"
                style={{
                  backgroundColor: `${palette.panel}FC`,
                  borderColor: 'rgba(255,255,255,0.16)',
                  backdropFilter: 'blur(28px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(180%)'
                }}
              >
                {/* Solid base so content behind never bleeds through */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)),
                      ${palette.panel}
                    `
                  }}
                />

                {/* Glass highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-80 pointer-events-none" />

                {/* Inner glow */}
                <div
                  className="absolute -top-40 right-10 w-[420px] h-[420px] rounded-full blur-[120px] opacity-25 pointer-events-none"
                  style={{ backgroundColor: palette.primary }}
                />

                <div className="relative z-10">
                  {activeMenu === 'services' && <ServicesMegaMenu />}
                  {activeMenu === 'work' && <WorkMegaMenu />}
                  {activeMenu === 'about' && <AboutMegaMenu />}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const HomePage = ({ navigate }) => {
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0); const mouseY = useMotionValue(0);
  const mousePx = useMotionValue(0); const mousePy = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 30, damping: 20 });
  const smoothMousePx = useSpring(mousePx, { stiffness: 100, damping: 25, mass: 0.5 });
  const smoothMousePy = useSpring(mousePy, { stiffness: 100, damping: 25, mass: 0.5 });
  
  const orbX = useTransform(smoothMouseX, v => v * -40); const orbY = useTransform(smoothMouseY, v => v * -40);
  const gridX = useTransform(smoothMouseX, v => v * 20); const gridY = useTransform(smoothMouseY, v => v * 20);
  const spotlightX = useTransform(smoothMousePx, v => v - 400); const spotlightY = useTransform(smoothMousePy, v => v - 400);

  const rgbPrimary = hexToRgbStr(palette.primary);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    mousePx.set(e.clientX - rect.left);
    mousePy.set(e.clientY - rect.top);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen text-[#F4F4F5] w-full relative" style={{ backgroundColor: palette.bgDeep }}>
      <section ref={heroRef} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="relative h-screen flex flex-col overflow-hidden w-full pt-28 pb-8 px-[3%]">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 flex justify-center items-center">
            <motion.div style={{ x: orbX, y: orbY }} className="relative w-full h-full flex justify-center items-center md:translate-x-[20%]">
              <div className="absolute w-[80vw] md:w-[600px] h-[80vw] md:h-[450px] rounded-[100%] blur-[120px] md:blur-[160px] opacity-[0.15] mix-blend-screen animate-pulse" style={{ backgroundColor: palette.primary, animationDuration: '8s' }} />
              <div className="absolute w-[60vw] md:w-[450px] h-[80vw] md:h-[600px] rounded-[100%] blur-[120px] md:blur-[160px] opacity-[0.12] mix-blend-screen translate-x-1/4" style={{ backgroundColor: palette.blue }} />
            </motion.div>
          </div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 flex justify-center items-center mix-blend-screen">
            <div className="relative w-[140%] max-w-[1200px] h-[500px] md:translate-x-[20%]"><motion.div animate={{ scale: [1, 1.5, 1], opacity: [0, 0.4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-0 right-1/4 w-72 h-72 bg-white rounded-full blur-[100px]" /></div>
          </motion.div>
          <motion.div animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.8 }} className="absolute z-[5]" style={{ width: '800px', height: '800px', left: 0, top: 0, x: spotlightX, y: spotlightY }}>
            <div className="w-full h-full rounded-full mix-blend-screen" style={{ background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(${rgbPrimary},0.03) 30%, transparent 60%)` }} />
          </motion.div>
          <motion.div style={{ x: gridX, y: gridY }} animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-[0.15] flex items-center justify-center origin-center">
            <svg className="w-full max-w-[1000px] h-auto" viewBox="0 0 1000 1000" fill="none">
              <circle cx="500" cy="500" r="300" stroke="url(#paint0_linear)" strokeWidth="0.5" strokeDasharray="4 8"/><circle cx="500" cy="500" r="450" stroke="url(#paint1_linear)" strokeWidth="0.5" /><circle cx="500" cy="500" r="200" stroke="url(#paint0_linear)" strokeWidth="1" strokeDasharray="1 16"/>
              <defs><linearGradient id="paint0_linear" x1="200" y1="200" x2="800" y2="800" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity="0.5"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient><linearGradient id="paint1_linear" x1="500" y1="50" x2="500" y2="950" gradientUnits="userSpaceOnUse"><stop stopColor={palette.primary} stopOpacity="0.4"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient></defs>
            </svg>
          </motion.div>
          <InteractiveFlowingLines />
        </motion.div>

        <div className="flex-1 flex flex-col justify-center w-full relative z-10 text-left">
          <RevealText delay={0.1}><h1 className="text-[clamp(3.2rem,8vw,7rem)] font-light tracking-[-0.06em] leading-[0.95] text-white drop-shadow-lg pb-1 font-primary">Brands break when</h1></RevealText>
          <RevealText delay={0.2}><h1 className="text-[clamp(3.2rem,8vw,7rem)] font-light tracking-[-0.06em] leading-[0.95] text-white drop-shadow-lg pb-2 flex items-baseline flex-wrap font-primary">strategy and execution <AnimatedItalic className="text-white/60 ml-4">stop talking.</AnimatedItalic></h1></RevealText>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="mt-8 text-lg md:text-xl text-white/60 font-light max-w-3xl leading-relaxed tracking-wide font-secondary">PurpleBlue House helps businesses build clearer brands, sharper narratives, and communication systems that actually move people.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7 }} className="mt-12 flex flex-col sm:flex-row gap-6">
            <PremiumButton onClick={() => navigate('assessment')} className="min-w-[240px]" style={{ boxShadow: `0 0 40px rgba(${rgbPrimary}, 0.2)` }}>Build My Brand Scope <Sparkles className="w-4 h-4 ml-2" /></PremiumButton>
            <PremiumButton variant="secondary" onClick={() => navigate('work')} className="min-w-[240px]">Explore Our Work</PremiumButton>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-[3%] relative w-full border-y border-white/5 text-left" style={{ backgroundColor: palette.bg }}>
        <RevealText><h2 className="text-4xl md:text-6xl font-light tracking-tight mb-16 font-primary">Most brand problems are <br/><AnimatedItalic className="text-white/50">not surface problems.</AnimatedItalic></h2></RevealText>
        <FadeUp><p className="text-xl text-white/50 font-light max-w-3xl mb-16 leading-relaxed font-secondary">Low engagement, inconsistent visuals, weak campaigns, unclear messaging, scattered teams — these are usually symptoms of a deeper gap between brand thinking and brand execution.</p></FadeUp>
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
          {PROBLEM_DATA.map((prob, i) => (
            <StaggerItem key={i}><ProblemHoverCard title={prob.title} icon={prob.icon} type={prob.type} /></StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="py-32 px-[3%] w-full border-b border-white/5 text-left" style={{ backgroundColor: palette.bgDeep }}>
        <div className="max-w-4xl mb-24">
          <RevealText><h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6 font-primary">The traditional agency <br/><AnimatedItalic className="text-white/50">model is broken.</AnimatedItalic></h2></RevealText>
          <FadeUp><p className="text-xl text-white/50 font-light leading-relaxed font-secondary">Most agencies execute blindly against a flawed brief. We build a strategic foundation first, ensuring every creative asset serves a core business objective.</p></FadeUp>
        </div>
        <StaggerGroup className="grid md:grid-cols-2 gap-8 w-full">
          <StaggerItem>
            <div className="border border-white/5 rounded-[24px] p-10 md:p-14 h-full" style={{ backgroundColor: palette.panel }}>
               <h3 className="text-white/40 text-sm tracking-widest uppercase mb-10 font-primary">The Old Way</h3>
               <ul className="space-y-8 font-secondary">
                 <li className="flex gap-5 text-white/50 font-light text-lg"><X className="w-6 h-6 shrink-0 text-red-500/50 mt-1" /> <span>Executing blindly on surface-level aesthetic requests.</span></li>
                 <li className="flex gap-5 text-white/50 font-light text-lg"><X className="w-6 h-6 shrink-0 text-red-500/50 mt-1" /> <span>Charging for endless revisions due to lack of clarity.</span></li>
                 <li className="flex gap-5 text-white/50 font-light text-lg"><X className="w-6 h-6 shrink-0 text-red-500/50 mt-1" /> <span>Disjointed teams producing inconsistent touchpoints.</span></li>
               </ul>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="border rounded-[24px] p-10 md:p-14 relative overflow-hidden h-full" style={{ background: `linear-gradient(to bottom right, rgba(${rgbPrimary},0.1), transparent)`, borderColor: `rgba(${rgbPrimary},0.2)` }}>
               <div className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.1] blur-[80px] pointer-events-none" style={{ backgroundColor: palette.primary }} />
               <h3 className="text-sm tracking-widest uppercase mb-10 font-medium relative z-10 font-primary" style={{ color: palette.primary }}>The PBH Way</h3>
               <ul className="space-y-8 relative z-10 font-secondary">
                 <li className="flex gap-5 text-white/90 font-light text-lg"><Check className="w-6 h-6 shrink-0 mt-1" style={{ color: palette.primary }} /> <span>Diagnosing the root business gap before designing anything.</span></li>
                 <li className="flex gap-5 text-white/90 font-light text-lg"><Check className="w-6 h-6 shrink-0 mt-1" style={{ color: palette.primary }} /> <span>Modular scoping based on exact strategic requirements.</span></li>
                 <li className="flex gap-5 text-white/90 font-light text-lg"><Check className="w-6 h-6 shrink-0 mt-1" style={{ color: palette.primary }} /> <span>Building connected systems where strategy dictates execution.</span></li>
               </ul>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </section>

      {/* SciArt Philosophy */}
      <section className="py-32 px-[3%] relative w-full border-b border-white/5 text-left" style={{ backgroundColor: palette.bg }}>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <FadeUp>
             <h3 className="text-xs font-medium uppercase tracking-widest mb-6 font-primary" style={{ color: palette.primary }}>Our Philosophy</h3>
             <h2 className="text-4xl md:text-5xl font-light tracking-tight font-primary mb-6 leading-tight">Built on the <br/><AnimatedItalic className="text-white/80">SciArt</AnimatedItalic> framework.</h2>
             <p className="text-lg text-white/60 font-light leading-relaxed font-secondary">We bridge the divide between rigorous logic and intense imagination. Science gives us the framework, the data, and the strategy. Art gives us the empathy, the visual impact, and the connection. Together, they create brands that are unbreakable.</p>
          </FadeUp>
          <FadeUp delay={0.2} className="relative h-[300px] md:h-[400px] flex items-center justify-center rounded-[32px] border border-white/10 overflow-hidden shadow-2xl" style={{ backgroundColor: palette.bgDeep }}>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${hexToRgba(palette.primary, 0.1)} 0%, transparent 70%)` }} />
            <div className="flex gap-6 items-center z-10">
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md shadow-[0_0_40px_rgba(42,151,217,0.2)]" style={{ background: `linear-gradient(135deg, ${palette.blue}4D, transparent)`}}>
                 <span className="font-primary text-base md:text-xl tracking-widest text-white/90">SCI</span>
               </div>
               <Plus className="w-6 h-6 md:w-8 md:h-8 text-white/30" />
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md shadow-[0_0_40px_rgba(104,101,250,0.2)]" style={{ background: `linear-gradient(135deg, ${palette.primary}4D, transparent)`}}>
                 <span className="font-primary text-base md:text-xl tracking-widest text-white/90">ART</span>
               </div>
             </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-32 px-[3%] relative w-full text-left" style={{ backgroundColor: palette.panel }}>
        <RevealText><h2 className="text-4xl md:text-6xl font-light tracking-tight mb-20 font-primary">We connect strategy, <br/><AnimatedItalic>story, and execution.</AnimatedItalic></h2></RevealText>
        <StaggerGroup className="grid md:grid-cols-3 gap-6">
          {Object.values(ROUTES_INFO).map((route, i) => {
            const rColor = palette[route.type] || palette.primary;
            return (
              <StaggerItem key={route.id}>
                <SpotlightCard className="rounded-[24px] h-full">
                  <div className="border border-white/10 rounded-[24px] p-10 h-full flex flex-col hover:border-white/20 transition-colors" style={{ backgroundColor: palette.bgDeep }}>
                    <div className="w-14 h-14 rounded-[12px] border border-white/10 flex items-center justify-center mb-8" style={{ backgroundColor: rColor, color: palette.bgDeep, border: 'none' }}>{route.icon}</div>
                    <h4 className="text-2xl font-light mb-4 font-primary">{route.title}</h4>
                    <p className="text-white/50 font-light leading-relaxed mb-10 flex-grow font-secondary">{route.desc}</p>
                    <PremiumButton variant="ghost" onClick={() => navigate(`services/${route.id.toLowerCase()}`)} className="self-start px-0 group hover:bg-transparent text-white/70">Explore Route <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></PremiumButton>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </section>

      <section className="py-32 px-[3%] relative w-full border-y border-white/5 text-left overflow-hidden" style={{ backgroundColor: palette.bgDeep }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-[0.03] blur-[120px] pointer-events-none rounded-[100%]" style={{ backgroundColor: palette.primary }} />
        <div className="relative z-10 w-full">
          <RevealText><h2 className="text-4xl md:text-6xl font-light tracking-tight mb-20 font-primary">How It <AnimatedItalic>Works.</AnimatedItalic></h2></RevealText>
          <InteractiveHowItWorks />
        </div>
      </section>

      <section className="py-32 px-[3%] w-full text-center flex flex-col items-center justify-center border-b border-white/5 relative overflow-hidden" style={{ backgroundColor: palette.panel }}>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03] blur-[100px] pointer-events-none rounded-full" style={{ backgroundColor: palette.primary }} />
         <FadeUp className="opacity-40 mb-10 relative z-10" style={{ color: palette.primary }}><Quote className="w-16 h-16 mx-auto" /></FadeUp>
         <FadeUp delay={0.1}>
           <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-[1.4] max-w-5xl text-white/90 relative z-10 font-primary">
             "PurpleBlue House completely rewired how we communicate. They didn't just give us a brand identity—they gave us an <AnimatedItalic>operating system for growth.</AnimatedItalic>"
           </h2>
         </FadeUp>
         <FadeUp delay={0.2} className="mt-16 flex flex-col items-center relative z-10 font-secondary">
           <div className="w-12 h-[1px] bg-white/20 mb-6" />
           <span className="text-white tracking-wide font-medium">Chief Marketing Officer</span>
           <span className="text-white/40 text-xs mt-2 uppercase tracking-widest">Global Tech Enterprise</span>
         </FadeUp>
      </section>

      {/* Global Mission */}
      <section className="py-32 px-[3%] text-center border-b border-white/5 relative overflow-hidden" style={{ backgroundColor: palette.bgDeep }}>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.05] blur-[100px] pointer-events-none rounded-full" style={{ backgroundColor: palette.blue }} />
         <FadeUp>
           <Globe className="w-12 h-12 mx-auto mb-8 opacity-40" style={{ color: palette.blue }} />
           <h2 className="text-3xl md:text-5xl font-light mb-8 font-primary max-w-4xl mx-auto leading-tight">Elevating Indian Innovation to the <AnimatedItalic className="text-white/80">Global Stage.</AnimatedItalic></h2>
           <p className="text-lg md:text-xl text-white/50 font-secondary max-w-2xl mx-auto leading-relaxed">Championing the rise of breakthrough ideas, fostering a future where creativity and ingenuity fuel human progress on a worldwide scale.</p>
         </FadeUp>
      </section>

      <section className="py-32 px-[3%] relative w-full border-b border-white/5" style={{ backgroundColor: palette.bgDeep }}>
        <div className="flex flex-col sm:flex-row justify-between items-end mb-24 gap-6 w-full text-left">
          <RevealText delay={0.1}><h2 className="text-4xl md:text-6xl font-light tracking-tight font-primary">Selected <AnimatedItalic className="text-white/50">Work.</AnimatedItalic></h2></RevealText>
          <PremiumButton variant="ghost" onClick={() => navigate('work')} className="px-0 py-0 group" style={{ color: palette.primary }}>View Archive <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></PremiumButton>
        </div>
        <StaggerGroup className="grid md:grid-cols-2 gap-8 w-full">
          {CASE_STUDIES.slice(0, 2).map((cs, i) => {
             const hexColor = palette[cs.type] || palette.primary;
             return (
              <StaggerItem key={i}>
                <div onClick={() => navigate('work')} className="group relative border border-white/5 rounded-[24px] overflow-hidden flex flex-col transition-all duration-700 cursor-pointer text-left h-[450px]" style={{ backgroundColor: palette.panel }}>
                  <div className="h-[250px] relative overflow-hidden border-b border-white/5 bg-white/[0.02]">
                    <div className={`absolute inset-0 opacity-20 mix-blend-screen group-hover:scale-110 transition-transform duration-1000 ease-out`} style={{ background: `linear-gradient(to bottom right, ${hexColor}, transparent)` }} />
                    <div className="absolute inset-0 flex items-center justify-center"><span className="font-serif italic text-white/10 group-hover:text-white/30 transition-colors duration-700 text-5xl">{cs.client.split(' ')[0]}</span></div>
                  </div>
                  <div className="p-8 flex flex-col justify-between flex-1" style={{ backgroundColor: palette.panel }}>
                    <div>
                      <span className="text-[10px] font-medium tracking-widest uppercase block mb-2 font-primary" style={{ color: hexColor }}>{cs.sector}</span>
                      <h3 className="text-2xl font-light transition-colors font-primary group-hover:opacity-80" style={{ color: 'white' }}>{cs.client}</h3>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex gap-2 font-secondary">{cs.tags.map(t => <span key={t} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-white/50 uppercase">{t}</span>)}</div>
                      <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </section>

      {/* Latest Thinking (Journal) */}
      <section className="py-32 px-[3%] relative w-full border-b border-white/5 text-left" style={{ backgroundColor: palette.panel }}>
        <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6 w-full text-left">
          <RevealText delay={0.1}><h2 className="text-4xl md:text-5xl font-light tracking-tight font-primary">From the <AnimatedItalic className="text-white/50">House.</AnimatedItalic></h2></RevealText>
          <span onClick={() => navigate('journal')} className="text-sm font-secondary text-white/40 hover:text-white cursor-pointer transition-colors flex items-center gap-2 group">View Journal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></span>
        </div>
        <StaggerGroup className="grid md:grid-cols-3 gap-6">
           {JOURNAL_ARTICLES.slice(0, 3).map((article, i) => (
              <StaggerItem key={i}>
                <div onClick={() => navigate('article/' + article.id)} className="border border-white/10 rounded-[24px] p-8 h-full flex flex-col hover:-translate-y-2 transition-transform cursor-pointer group shadow-xl" style={{ backgroundColor: palette.bgDeep }}>
                  <div className="text-[10px] tracking-widest uppercase mb-6 font-primary font-medium" style={{ color: palette[article.type] }}>{article.tag}</div>
                  <h4 className="text-2xl font-light text-white mb-12 font-primary group-hover:text-white/80 transition-colors leading-snug">{article.title}</h4>
                  <div className="mt-auto flex justify-between items-center text-xs text-white/40 font-secondary pt-6 border-t border-white/5">
                    <span>{article.time}</span>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all">
                      <ArrowRight className="w-3 h-3 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </StaggerItem>
           ))}
        </StaggerGroup>
      </section>

      <section className="py-32 px-[3%] w-full text-center flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: palette.primary }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 w-full overflow-hidden flex whitespace-nowrap">
           <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 20 }} className="flex gap-16 opacity-90 font-primary" style={{ color: palette.bgDeep }}>
             <span className="text-6xl md:text-8xl font-light tracking-tighter uppercase">3 Ecosystems. 1 Connected System. Zero Guesswork.</span>
             <span className="text-6xl md:text-8xl font-light tracking-tighter uppercase">3 Ecosystems. 1 Connected System. Zero Guesswork.</span>
           </motion.div>
        </div>
      </section>

      <section className="py-32 md:py-48 px-[3%] relative w-full flex flex-col items-center justify-center text-center overflow-hidden" style={{ backgroundColor: palette.bgDeep }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-[100%] blur-[200px] opacity-[0.08] pointer-events-none" style={{ backgroundColor: palette.blue }} />
        <FadeUp className="relative z-10 w-full flex flex-col items-center">
          <h2 className="text-xs font-medium uppercase tracking-widest mb-6 font-primary" style={{ color: palette.blue }}>Start with clarity.</h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-12 tracking-tight font-primary">Build your brand scope <br/><AnimatedItalic className="text-white/60">before the first call.</AnimatedItalic></h1>
          <PremiumButton onClick={() => navigate('assessment')} className="px-12 py-6 text-lg w-full sm:w-auto font-secondary">Start Strategic Assessment</PremiumButton>
        </FadeUp>
      </section>
    </motion.div>
  );
};

const AboutPage = ({ navigate }) => {
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left max-w-6xl mx-auto">
        <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12 font-secondary"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
        
        {/* Section 1: Hero */}
        <FadeUp>
          <h2 className="text-xs font-medium uppercase tracking-widest mb-6 font-primary" style={{ color: palette.primary }}>About PurpleBlue House</h2>
          <h1 className="text-5xl md:text-7xl font-light mb-12 tracking-tight max-w-5xl font-primary">We co-create brands backed by cutting-edge innovation, with a <AnimatedItalic>SciArt-driven approach.</AnimatedItalic></h1>
        </FadeUp>
        
        {/* Section 2: Vision & Mission */}
        <FadeUp delay={0.2} className="grid md:grid-cols-2 gap-16 border-t border-white/10 pt-24 mb-24">
          <div>
            <h3 className="text-sm tracking-widest uppercase mb-6 font-primary text-white/40">Our Vision</h3>
            <h2 className="text-3xl font-light font-primary leading-tight text-white/90">To be the catalyst igniting a global movement where communication & design illuminate innovations that matter to humanity, India, and the world.</h2>
          </div>
          <div>
            <h3 className="text-sm tracking-widest uppercase mb-6 font-primary text-white/40">Our Mission</h3>
            <p className="text-xl text-white/60 font-light font-secondary leading-relaxed">We empower innovators globally, crafting impactful communication and design that ignites conversations around groundbreaking ideas. We champion the rise of Indian innovation on the world stage, fostering a future where creativity and ingenuity fuel the progress for humanity.</p>
          </div>
        </FadeUp>

        {/* Section 3: Purpose */}
        <FadeUp className="border border-white/10 rounded-[24px] p-12 md:p-16 mb-24 text-center relative overflow-hidden" style={{ backgroundColor: palette.panel }}>
            <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${palette.primary}, transparent 70%)` }} />
            <h3 className="text-sm tracking-widest uppercase mb-6 font-primary" style={{ color: palette.blue }}>Our Purpose</h3>
            <h2 className="text-3xl md:text-5xl font-light font-primary leading-tight max-w-4xl mx-auto text-white/90">We exist to foster prosperity. To ignite a revolution of creativity, empowering creators & leaders through the transformative lens of <AnimatedItalic>SciArt.</AnimatedItalic></h2>
        </FadeUp>

        {/* Section 4: Core Values */}
        <FadeUp><h3 className="text-3xl font-light mb-12 font-primary border-b border-white/10 pb-6">Our Core Values</h3></FadeUp>
        <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
            {[
              { title: "Collaboration", desc: "We co-create with you, not for you.", icon: <Users /> },
              { title: "Science & Art", desc: "We bridge the divide between logic and imagination.", icon: <Dna /> },
              { title: "Creator Empowerment", desc: "We ignite your vision with the fuel of science and art.", icon: <Zap /> },
              { title: "Future-Oriented", desc: "We don't just build brands, we build legacies for the future.", icon: <Globe /> }
            ].map((v, i) => (
              <StaggerItem key={i}>
                <div className="bg-white/[0.02] border border-white/5 rounded-[16px] p-8 hover:bg-white/[0.04] transition-colors h-full">
                  <div className="mb-6 w-12 h-12 rounded-[12px] flex items-center justify-center bg-white/5" style={{ color: palette.primary }}>{v.icon}</div>
                  <h4 className="text-xl font-medium mb-4 text-white font-primary">{v.title}</h4>
                  <p className="text-white/50 font-light font-secondary leading-relaxed">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
        </StaggerGroup>

        {/* Section 5: The SciArt Philosophy */}
        <FadeUp className="border border-white/5 rounded-[32px] overflow-hidden grid md:grid-cols-2 mb-32 bg-[#050B2E]">
          <div className="p-12 md:p-16 flex flex-col justify-center">
            <h3 className="text-sm tracking-widest uppercase mb-6 font-primary" style={{ color: palette.accent }}>Our Philosophy</h3>
            <h2 className="text-4xl font-light mb-6 font-primary">The Fusion of Logic and Aesthetics.</h2>
            <p className="text-lg text-white/60 font-light font-secondary leading-relaxed mb-8">
              True innovation requires more than a beautiful facade. It demands rigorous strategic thinking coupled with compelling emotional resonance. Science gives us the framework, the data, and the logic. Art gives us the empathy, the visual impact, and the connection. Together, they create brands that are unbreakable.
            </p>
          </div>
          <div className="relative min-h-[400px] flex items-center justify-center bg-[#010825] overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
             <div className="flex gap-4 items-center z-10">
               <div className="w-32 h-32 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md" style={{ background: `linear-gradient(135deg, ${palette.blue}4D, transparent)`}}>
                 <span className="font-primary text-xl tracking-widest text-white/80">SCI</span>
               </div>
               <Plus className="w-8 h-8 text-white/20" />
               <div className="w-32 h-32 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md" style={{ background: `linear-gradient(135deg, ${palette.primary}4D, transparent)`}}>
                 <span className="font-primary text-xl tracking-widest text-white/80">ART</span>
               </div>
             </div>
          </div>
        </FadeUp>

        {/* Section 6: Indian Heritage on a Global Stage */}
        <FadeUp className="text-center max-w-3xl mx-auto mb-32">
          <Globe className="w-12 h-12 mx-auto mb-8 opacity-40" style={{ color: palette.blue }} />
          <h2 className="text-3xl md:text-5xl font-light mb-8 font-primary leading-tight">Elevating Indian Innovation to the Global Stage.</h2>
          <p className="text-xl text-white/50 font-secondary font-light leading-relaxed">
            We are rooted in the rich scientific and artistic heritage of India. Our ambition is to help local breakthrough innovators communicate with the precision and premium aesthetic required to compete and lead globally.
          </p>
        </FadeUp>

        {/* Section 7: Final CTA */}
        <FadeUp className="text-center pt-16 border-t border-white/10">
           <PremiumButton onClick={() => navigate('assessment')} className="px-12 py-5 text-lg">Co-create your brand scope</PremiumButton>
        </FadeUp>
      </div>
    </div>
  )
};

const OurStoryPage = ({ navigate }) => {
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left max-w-4xl mx-auto">
        <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12 font-secondary"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
        
        {/* Section 1: Hero */}
        <FadeUp>
          <h2 className="text-xs font-medium uppercase tracking-widest mb-6 font-primary" style={{ color: palette.primary }}>Our Story</h2>
          <h1 className="text-5xl md:text-7xl font-light mb-16 tracking-tight font-primary">Where Science Meets Art.</h1>
        </FadeUp>
        
        {/* Section 2: The Spark */}
        <StaggerGroup className="space-y-8 text-lg font-light text-white/70 font-secondary leading-relaxed mb-32">
            <StaggerItem><p className="text-2xl text-white mb-10 leading-tight">PurpleBlue House was born out of a desire to revive the scientific heritage of India and bridge the gap between ancient ingenuity and modern digital expression.</p></StaggerItem>
            <StaggerItem><p>We recognized that breakthrough innovators often struggle to translate complex, cutting-edge technology into narratives that resonate with humanity. They build incredible things, but the world struggles to understand them.</p></StaggerItem>
            <StaggerItem><p>On the other hand, traditional creative agencies apply surface-level aesthetics, missing the deeper functional truth of the innovation entirely. They decorate, but they do not translate.</p></StaggerItem>
            <StaggerItem><p>We realized there needed to be a place where rigorous logic and intense imagination could coexist. A place where creators could find their voice.</p></StaggerItem>
        </StaggerGroup>

        {/* Section 3: The Meaning Behind the Name */}
        <FadeUp className="border border-white/5 rounded-[24px] p-12 md:p-16 mb-32 flex flex-col md:flex-row gap-12 items-center" style={{ backgroundColor: palette.panel }}>
          <div className="flex gap-4 md:w-1/3 justify-center">
             <div className="w-16 h-32 rounded-full" style={{ backgroundColor: palette.primary }} />
             <div className="w-16 h-32 rounded-full" style={{ backgroundColor: palette.blue }} />
          </div>
          <div className="md:w-2/3">
             <h3 className="text-3xl font-light mb-6 font-primary">Why Purple and Blue?</h3>
             <p className="font-secondary font-light text-white/70 leading-relaxed mb-4">
               <strong className="text-white">Purple</strong> represents Art. It is the color of imagination, creativity, emotion, and the boundless creator spirit.
             </p>
             <p className="font-secondary font-light text-white/70 leading-relaxed mb-4">
               <strong className="text-white">Blue</strong> represents Science. It is the color of depth, logic, technology, truth, and structural foundation.
             </p>
             <p className="font-secondary font-light text-white/70 leading-relaxed">
               The <strong className="text-white">House</strong> is where they live together. A collaborative ecosystem built for the future.
             </p>
          </div>
        </FadeUp>

        {/* Section 4: The Timeline */}
        <div className="mb-32">
          <FadeUp><h3 className="text-3xl font-light mb-16 font-primary text-center">Our Journey</h3></FadeUp>
          <StaggerGroup className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {[
              { year: "The Inception", title: "Identifying the Gap", desc: "Recognizing that Indian innovators lacked a premium voice on the global stage, the foundation of PBH was conceptualized." },
              { year: "The Framework", title: "Building the SciArt Method", desc: "Developing our proprietary framework that ensures every aesthetic decision is backed by strategic logic." },
              { year: "The Expansion", title: "The Global Shift", desc: "Co-creating with breakthrough brands worldwide, establishing the House as a premium strategic partner." }
            ].map((milestone, idx) => (
              <StaggerItem key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#05050A] text-white/50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow" style={{ color: palette.primary }}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-[16px] border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-primary text-sm tracking-widest uppercase" style={{ color: palette.primary }}>{milestone.year}</span>
                  </div>
                  <h4 className="text-xl font-medium text-white mb-2 font-primary">{milestone.title}</h4>
                  <p className="text-white/50 text-sm font-secondary font-light leading-relaxed">{milestone.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        {/* Section 5: The Future */}
        <FadeUp className="text-center mb-24">
          <h3 className="text-3xl font-light mb-8 font-primary">Looking Ahead</h3>
          <p className="text-lg text-white/60 font-secondary font-light leading-relaxed max-w-2xl mx-auto">
            Our story is just beginning. We will continue to champion creators, disrupt traditional agency models, and build visual expressions that bridge the past and the future.
          </p>
        </FadeUp>

        {/* Section 6: CTA */}
        <FadeUp className="text-center pt-16 border-t border-white/10">
           <PremiumButton onClick={() => navigate('contact')} className="px-12 py-5 text-lg">Be part of our story</PremiumButton>
        </FadeUp>
      </div>
    </div>
  );
};

const TeamPage = ({ navigate }) => {
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left max-w-6xl mx-auto">
        <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12 font-secondary"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
        
        {/* Section 1: Hero */}
        <FadeUp>
          <h2 className="text-xs font-medium uppercase tracking-widest mb-6 font-primary" style={{ color: palette.primary }}>The Team</h2>
          <h1 className="text-5xl md:text-7xl font-light mb-16 tracking-tight font-primary">The minds behind the magic.</h1>
        </FadeUp>
        
        {/* Section 2: Leadership */}
        <FadeUp><h3 className="text-3xl font-light mb-12 font-primary">Leadership</h3></FadeUp>
        <StaggerGroup className="grid md:grid-cols-2 gap-8 mb-32">
          {[
            { name: "Founder Name", role: "Chief Executive Officer", desc: "Visionary leader driving the SciArt philosophy and global strategy." },
            { name: "Partner Name", role: "Creative Director", desc: "The artistic force translating complex logic into stunning visual narratives." }
          ].map((leader, i) => (
            <StaggerItem key={i}>
              <div className="border border-white/5 rounded-[24px] overflow-hidden flex flex-col sm:flex-row h-full" style={{ backgroundColor: palette.panel }}>
                <div className="sm:w-1/2 aspect-square bg-white/5 relative flex items-center justify-center border-r border-white/5">
                   <User className="w-16 h-16 text-white/10" />
                </div>
                <div className="p-8 sm:w-1/2 flex flex-col justify-center">
                   <h3 className="text-2xl font-medium text-white mb-2 font-primary">{leader.name}</h3>
                   <p className="text-sm tracking-widest uppercase mb-4 font-primary" style={{ color: palette.blue }}>{leader.role}</p>
                   <p className="text-sm text-white/50 font-secondary leading-relaxed">{leader.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Section 3: The Innovators (Grid) */}
        <FadeUp><h3 className="text-3xl font-light mb-12 font-primary">The Core House</h3></FadeUp>
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
          {[
            { name: "Creator 1", role: "Brand Strategist" },
            { name: "Creator 2", role: "Lead Designer" },
            { name: "Creator 3", role: "Storyteller" },
            { name: "Creator 4", role: "Digital Architect" }
          ].map((member, idx) => (
            <StaggerItem key={idx}>
              <div className="border border-white/5 rounded-[16px] overflow-hidden group h-full" style={{ backgroundColor: palette.panel }}>
                <div className="aspect-square bg-white/[0.02] relative overflow-hidden flex items-center justify-center transition-colors group-hover:bg-white/[0.05]">
                  <User className="w-12 h-12 text-white/10" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-medium text-white mb-1 font-primary">{member.name}</h3>
                  <p className="text-xs text-white/50 font-secondary">{member.role}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Section 4: Our Culture */}
        <FadeUp className="border border-white/10 rounded-[32px] p-12 md:p-16 mb-32" style={{ background: `linear-gradient(135deg, ${palette.panel}, ${palette.bg})` }}>
          <h3 className="text-3xl font-light mb-10 font-primary text-center">Our Culture</h3>
          <StaggerGroup className="grid md:grid-cols-3 gap-8">
            <StaggerItem className="text-center">
               <div className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center bg-white/5"><Globe className="w-5 h-5 text-white/70" /></div>
               <h4 className="text-lg font-medium text-white mb-3 font-primary">No Silos</h4>
               <p className="text-sm text-white/50 font-secondary leading-relaxed">Strategy, design, and execution sit at the same table. We believe in cross-pollination of ideas.</p>
            </StaggerItem>
            <StaggerItem className="text-center">
               <div className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center bg-white/5"><Zap className="w-5 h-5 text-white/70" /></div>
               <h4 className="text-lg font-medium text-white mb-3 font-primary">Creator-First</h4>
               <p className="text-sm text-white/50 font-secondary leading-relaxed">We empower our team to take ownership, innovate fearlessly, and challenge the status quo.</p>
            </StaggerItem>
            <StaggerItem className="text-center">
               <div className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center bg-white/5"><BookOpen className="w-5 h-5 text-white/70" /></div>
               <h4 className="text-lg font-medium text-white mb-3 font-primary">Continuous Learning</h4>
               <p className="text-sm text-white/50 font-secondary leading-relaxed">In a world driven by rapid innovation, we are perpetual students of science, art, and human behavior.</p>
            </StaggerItem>
          </StaggerGroup>
        </FadeUp>

        {/* Section 5: Join the House CTA */}
        <FadeUp className="text-center pt-16 border-t border-white/10">
           <h3 className="text-3xl font-light mb-6 font-primary">Want to join the House?</h3>
           <p className="text-lg text-white/50 font-secondary mb-10">We are always looking for visionary strategists and artists.</p>
           <PremiumButton variant="secondary" className="px-12 py-4 text-sm font-secondary">View Open Positions</PremiumButton>
        </FadeUp>
      </div>
    </div>
  );
};

const MethodPage = ({ navigate }) => {
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left max-w-5xl mx-auto">
        <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12 font-secondary"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
        
        {/* Section 1: Hero */}
        <FadeUp>
          <h2 className="text-xs font-medium uppercase tracking-widest mb-6 font-primary" style={{ color: palette.primary }}>The PBH Method</h2>
          <h1 className="text-5xl md:text-7xl font-light mb-24 tracking-tight max-w-4xl font-primary">A clear process for brands that need direction, <AnimatedItalic className="text-white/50">not decoration.</AnimatedItalic></h1>
        </FadeUp>
        
        {/* Section 2: Traditional vs PBH */}
        <FadeUp className="grid md:grid-cols-2 gap-8 w-full mb-32">
          <div className="border border-white/5 rounded-[24px] p-10 relative overflow-hidden" style={{ backgroundColor: palette.panel }}>
             <h3 className="text-white/40 text-sm tracking-widest uppercase mb-8 font-primary">The Traditional Model</h3>
             <ul className="space-y-6 font-secondary">
               <li className="flex gap-4 text-white/50 font-light text-base"><X className="w-5 h-5 shrink-0 text-red-500/50 mt-0.5" /> <span>Executing blindly on surface-level aesthetic requests.</span></li>
               <li className="flex gap-4 text-white/50 font-light text-base"><X className="w-5 h-5 shrink-0 text-red-500/50 mt-0.5" /> <span>Charging for endless revisions due to lack of clarity.</span></li>
               <li className="flex gap-4 text-white/50 font-light text-base"><X className="w-5 h-5 shrink-0 text-red-500/50 mt-0.5" /> <span>Disjointed teams producing inconsistent touchpoints.</span></li>
             </ul>
          </div>
          <div className="border rounded-[24px] p-10 relative overflow-hidden" style={{ background: `linear-gradient(to bottom right, ${hexToRgba(palette.primary, 0.1)}, transparent)`, borderColor: hexToRgba(palette.primary, 0.2) }}>
             <h3 className="text-sm tracking-widest uppercase mb-8 font-medium relative z-10 font-primary" style={{ color: palette.primary }}>The PBH Method</h3>
             <ul className="space-y-6 relative z-10 font-secondary">
               <li className="flex gap-4 text-white/90 font-light text-base"><Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: palette.primary }} /> <span>Diagnosing the root business gap before designing anything.</span></li>
               <li className="flex gap-4 text-white/90 font-light text-base"><Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: palette.primary }} /> <span>Modular scoping based on exact strategic requirements.</span></li>
               <li className="flex gap-4 text-white/90 font-light text-base"><Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: palette.primary }} /> <span>Building connected systems where strategy dictates execution.</span></li>
             </ul>
          </div>
        </FadeUp>

        {/* Section 3: The 4 Steps */}
        <FadeUp><h3 className="text-3xl font-light mb-16 font-primary text-center">Our 4-Step Framework</h3></FadeUp>
        <StaggerGroup className="space-y-24 mb-32">
          {[
            { step: "1", title: "Discovery", desc: "We begin by understanding the business, audience, market, internal teams, communication gaps, and growth context. We dig deep into the core mechanics of your innovation.", outputs: ["Brand Audit", "Stakeholder Interviews", "Competitor Landscape Mapping"] },
            { step: "2", title: "Diagnosis", desc: "We identify exactly where the brand is breaking — whether it's messaging, identity, storytelling, systems, campaigns, or internal execution pipelines.", outputs: ["Problem Clusters Identified", "Gap Analysis Document"] },
            { step: "3", title: "Route Mapping", desc: "Based on the diagnosis, we recommend one or more dedicated service ecosystems: Brand Boulevard (Identity), SciArt Saga (Innovation Story), or Storytelling Corner (Campaigns).", outputs: ["Strategic Route Assignment", "Resource Allocation"] },
            { step: "4", title: "Scope Building", desc: "We lock in the foundation. Each route is broken down into specific line items, deliverables, priorities, dependencies, and precise timelines.", outputs: ["Custom Scope Blueprint", "Project Roadmap"] }
          ].map((s, i) => (
            <StaggerItem key={i}>
              <div className="grid md:grid-cols-12 gap-8 border-t border-white/5 pt-12 relative">
                <div className="absolute top-0 left-0 w-1/4 h-[1px]" style={{ background: `linear-gradient(to right, ${palette.primary}, transparent)` }} />
                <div className="md:col-span-1 text-4xl font-serif italic text-white/30">0{s.step}</div>
                <div className="md:col-span-6 pr-8">
                   <h3 className="text-3xl font-light mb-4 font-primary">{s.title}</h3>
                   <p className="text-white/50 font-light text-lg leading-relaxed font-secondary">{s.desc}</p>
                </div>
                <div className="md:col-span-5 md:pl-12 border-l border-white/5">
                  <h4 className="text-xs font-medium text-white/30 uppercase tracking-widest mb-6 font-primary">Key Outputs</h4>
                  <ul className="space-y-3 font-secondary">
                    {s.outputs.map((out, j) => <li key={j} className="flex items-center gap-3 text-white/70 font-light text-sm bg-white/[0.02] border border-white/5 px-4 py-3 rounded-[8px]"><Check className="w-4 h-4 shrink-0" style={{ color: palette.accent }} /> {out}</li>)}
                  </ul>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Section 4: The SciArt Application */}
        <FadeUp className="border border-white/10 rounded-[24px] p-12 mb-32 text-center" style={{ backgroundColor: palette.panel }}>
          <h3 className="text-2xl font-light mb-6 font-primary">Applied SciArt</h3>
          <p className="text-white/60 font-secondary font-light max-w-2xl mx-auto leading-relaxed">
            Throughout every step of this method, we apply the SciArt filter. Does the strategy hold up to logical scrutiny (Science)? Does the execution evoke the right human emotion (Art)? If an output fails either test, it does not leave the House.
          </p>
        </FadeUp>

        {/* Section 5: Timeline Overview */}
        <FadeUp><h3 className="text-3xl font-light mb-12 font-primary text-center">Typical Engagement Timeline</h3></FadeUp>
        <StaggerGroup className="grid md:grid-cols-4 gap-4 mb-32">
            {[
              { phase: "Weeks 1-2", focus: "Discovery & Diagnosis", color: palette.primary },
              { phase: "Weeks 3-4", focus: "Strategy & Narrative", color: palette.blue },
              { phase: "Weeks 5-7", focus: "Design & Systems", color: palette.purple },
              { phase: "Week 8+", focus: "Handoff & Execution", color: palette.accent }
            ].map((t, idx) => (
              <StaggerItem key={idx}>
                <div className="p-6 border border-white/5 rounded-[16px] text-center h-full" style={{ backgroundColor: palette.bgDeep }}>
                  <div className="text-[10px] uppercase tracking-widest mb-3 font-primary font-medium" style={{ color: t.color }}>{t.phase}</div>
                  <div className="text-white font-secondary font-light">{t.focus}</div>
                </div>
              </StaggerItem>
            ))}
        </StaggerGroup>

        {/* Section 6: Final CTA */}
        <FadeUp className="pt-16 border-t border-white/10 text-center">
          <h2 className="text-4xl font-light mb-8 font-primary">Experience the method yourself.</h2>
          <PremiumButton onClick={() => navigate('assessment')}>Build My Brand Scope</PremiumButton>
        </FadeUp>
      </div>
    </div>
  )
};

const ServicesPage = ({ navigate }) => {
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left">
        <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12 font-secondary"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
        <RevealText><h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight max-w-4xl font-primary">Three strategic routes.<br/><AnimatedItalic className="text-white/50">One connected brand system.</AnimatedItalic></h1></RevealText>
        <FadeUp><p className="text-xl text-white/50 font-light mb-24 max-w-3xl leading-relaxed font-secondary">PBH services are not isolated offerings. They are designed as connected routes that help brands move from clarity to communication to execution.</p></FadeUp>
        
        <StaggerGroup className="grid gap-12 mb-32">
          {Object.values(ROUTES_INFO).map((route, i) => {
            const rColor = palette[route.type] || palette.primary;
            return (
              <StaggerItem key={route.id}>
                <SpotlightCard className="rounded-[24px]">
                  <div className="border border-white/10 rounded-[24px] p-12 md:p-16 flex flex-col md:flex-row gap-12 transition-colors" style={{ backgroundColor: palette.panel }}>
                    <div className="md:w-1/3">
                      <div className="w-16 h-16 rounded-[16px] flex items-center justify-center mb-8" style={{ backgroundColor: rColor, color: palette.bgDeep }}>{route.icon}</div>
                      <h3 className="text-3xl font-light mb-4 font-primary">{route.title}</h3>
                      <p className="text-white/50 font-light leading-relaxed mb-8 font-secondary">{route.desc}</p>
                      <PremiumButton variant="ghost" onClick={() => navigate(`services/${route.id.toLowerCase()}`)} className="px-0 py-0 hover:bg-transparent text-white group font-secondary">Explore Route Details <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/></PremiumButton>
                    </div>
                    <div className="md:w-2/3 md:pl-12 md:border-l border-white/10 grid sm:grid-cols-2 gap-8 font-secondary">
                      <div>
                        <h4 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4 font-primary">Core Line Items</h4>
                        <ul className="space-y-3">{route.lineItems.map(li => <li key={li.id} className="text-sm font-light text-white/70">{li.name}</li>)}</ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4 font-primary">Best For</h4>
                        <p className="text-sm font-light text-white/60 leading-relaxed">Brands looking for a structured approach to solving specific gaps in this domain.</p>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>

        {/* FAQ for Services */}
        <div className="max-w-4xl mx-auto border-t border-white/10 pt-16 mb-24">
          <FadeUp><h3 className="text-3xl font-light mb-8 font-primary text-center">Service FAQs</h3></FadeUp>
          <StaggerGroup className="space-y-4 font-secondary">
             <StaggerItem>
               <div className="p-6 border border-white/10 rounded-[12px] bg-white/[0.01]">
                 <h4 className="font-medium text-white mb-2">Can we choose just one deliverable?</h4>
                 <p className="text-sm text-white/50">We strongly recommend going through our assessment first. If a single deliverable solves the root problem, yes. If not, we will recommend a connected system.</p>
               </div>
             </StaggerItem>
             <StaggerItem>
               <div className="p-6 border border-white/10 rounded-[12px] bg-white/[0.01]">
                 <h4 className="font-medium text-white mb-2">How do we know which route is right for us?</h4>
                 <p className="text-sm text-white/50">You don't need to guess. Use our "Build My Brand Scope" tool, and our strategic engine will diagnose your gaps and assign the perfect route automatically.</p>
               </div>
             </StaggerItem>
          </StaggerGroup>
        </div>

        <FadeUp className="text-center">
           <PremiumButton onClick={() => navigate('assessment')} className="px-12 py-5 text-lg">Build Your Scope</PremiumButton>
        </FadeUp>
      </div>
    </div>
  )
};

const ServiceDetailPage = ({ navigate, routeId }) => {
  const route = ROUTES_INFO[routeId.toUpperCase()] || ROUTES_INFO['BB'];
  const rColor = palette[route.type] || palette.primary;

  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left max-w-6xl mx-auto">
        <button onClick={() => navigate('services')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12 font-secondary"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Services</button>
        <FadeUp>
          <div className="w-20 h-20 rounded-[20px] flex items-center justify-center mb-10 shadow-lg" style={{ backgroundColor: rColor, color: palette.bgDeep }}>{route.icon}</div>
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight font-primary">{route.title}</h1>
          <p className="text-xl text-white/50 font-light mb-24 max-w-3xl leading-relaxed font-secondary">{route.desc}</p>
        </FadeUp>
        
        <FadeUp><h3 className="text-3xl font-light mb-12 border-b border-white/10 pb-6 font-primary">What's Included</h3></FadeUp>
        <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {route.lineItems.map(li => (
            <StaggerItem key={li.id}>
              <div className="border border-white/5 rounded-[16px] p-8 h-full" style={{ backgroundColor: palette.panel }}>
                <h4 className="text-xl font-medium mb-6 text-white font-primary">{li.name}</h4>
                <ul className="space-y-3 font-secondary">
                  {DELIVERABLES_MASTER.filter(d => d.lineItem === li.id).map(d => (
                    <li key={d.id} className="text-sm font-light text-white/60 flex items-start gap-2"><Check className="w-4 h-4 shrink-0 mt-[2px]" style={{ color: rColor }}/> {d.name}</li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
        
        <FadeUp className="border border-white/10 rounded-[24px] p-12 text-center" style={{ background: `linear-gradient(to bottom right, ${palette.panel}, ${palette.bgDeep})` }}>
          <h2 className="text-3xl font-light mb-6 font-primary">Find the right scope for your brand.</h2>
          <PremiumButton onClick={() => navigate('assessment')}>Build A Scope</PremiumButton>
        </FadeUp>
      </div>
    </div>
  );
};

const WorkPage = ({ navigate }) => {
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left">
        <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12 font-secondary"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
        <RevealText><h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight font-primary">Our Work.</h1></RevealText>
        <FadeUp><p className="text-xl text-white/50 font-light mb-16 max-w-lg font-secondary">Case studies and full visual archive proving our thinking across strategy, identity, and campaigns.</p></FadeUp>
        
        {/* Featured Case Study Hero */}
        <FadeUp delay={0.1} className="mb-24">
          <div className="group relative border border-white/5 rounded-[32px] overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px] cursor-pointer" style={{ backgroundColor: palette.panel }}>
             <div className="md:w-1/2 relative overflow-hidden h-[300px] md:h-full bg-white/[0.02]">
               <div className="absolute inset-0 opacity-30 mix-blend-screen transition-transform duration-1000 ease-out group-hover:scale-105" style={{ background: `linear-gradient(to bottom right, ${palette.primary}, transparent)` }} />
               <div className="absolute inset-0 flex items-center justify-center"><span className="font-serif italic text-white/10 text-7xl md:text-9xl">{CASE_STUDIES[0].client.split(' ')[0]}</span></div>
             </div>
             <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
                <span className="text-[10px] font-medium tracking-widest uppercase block mb-4 font-primary" style={{ color: palette.primary }}>Featured Case Study • {CASE_STUDIES[0].sector}</span>
                <h3 className="text-4xl md:text-5xl font-light mb-6 font-primary">{CASE_STUDIES[0].client}</h3>
                <p className="text-white/50 font-light mb-10 text-lg leading-relaxed font-secondary">{CASE_STUDIES[0].challenge}</p>
                <div className="flex gap-4 font-secondary mb-12">
                   {CASE_STUDIES[0].tags.map(t => <span key={t} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-white/70 uppercase tracking-widest">{t}</span>)}
                </div>
                <div className="mt-auto flex items-center gap-2 text-white/70 group-hover:text-white transition-colors font-medium font-secondary">Read Full Study <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" /></div>
             </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="flex gap-4 mb-12 border-b border-white/10 pb-6 overflow-x-auto font-secondary">
          <button className="px-4 py-2 rounded-full border border-white text-white text-sm shrink-0">All Projects</button>
          <button className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-sm shrink-0 hover:bg-white/5">Brand Boulevard</button>
          <button className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-sm shrink-0 hover:bg-white/5">SciArt Saga</button>
          <button className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-sm shrink-0 hover:bg-white/5">Storytelling Corner</button>
        </FadeUp>

        <StaggerGroup className="grid md:grid-cols-2 gap-8 w-full mb-32">
          {CASE_STUDIES.slice(1).map((cs, i) => {
             const hexColor = palette[cs.type] || palette.primary;
             return (
              <StaggerItem key={i}>
                <div className="group relative border border-white/5 rounded-[24px] overflow-hidden flex flex-col transition-all duration-700 cursor-pointer text-left h-[450px]" style={{ backgroundColor: palette.panel }}>
                  <div className="h-[250px] relative overflow-hidden border-b border-white/5 bg-white/[0.02]">
                    <div className={`absolute inset-0 opacity-20 mix-blend-screen group-hover:scale-110 transition-transform duration-1000 ease-out`} style={{ background: `linear-gradient(to bottom right, ${hexColor}, transparent)` }} />
                    <div className="absolute inset-0 flex items-center justify-center"><span className="font-serif italic text-white/10 group-hover:text-white/30 transition-colors duration-700 text-5xl">{cs.client.split(' ')[0]}</span></div>
                  </div>
                  <div className="p-8 flex flex-col justify-between flex-1" style={{ backgroundColor: palette.panel }}>
                    <div>
                      <span className="text-[10px] font-medium tracking-widest uppercase block mb-2 font-primary" style={{ color: hexColor }}>{cs.sector}</span>
                      <h3 className="text-2xl font-light transition-colors font-primary group-hover:opacity-80" style={{ color: 'white' }}>{cs.client}</h3>
                    </div>
                    <div className="flex justify-between items-end font-secondary">
                      <div className="flex gap-2 flex-wrap">{cs.tags.map(t => <span key={t} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-white/50 uppercase">{t}</span>)}</div>
                      <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>

        <FadeUp className="border border-white/10 rounded-[32px] p-16 text-center bg-[#010825] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20" style={{ backgroundColor: palette.blue }} />
           <h3 className="text-4xl font-light mb-6 font-primary text-white">Ready to start your project?</h3>
           <p className="text-lg text-white/50 font-secondary mb-10 max-w-xl mx-auto">Skip the generic agency pitch. Diagnose your brand instantly using our Scope Builder.</p>
           <PremiumButton onClick={() => navigate('assessment')} className="px-10 py-4">Build My Brand Scope</PremiumButton>
        </FadeUp>
      </div>
    </div>
  )
};

const JournalPage = ({ navigate }) => {
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left max-w-7xl mx-auto">
        <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12 font-secondary"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
        <RevealText><h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight font-primary">The Journal.</h1></RevealText>
        <FadeUp><p className="text-xl text-white/50 font-light mb-16 max-w-2xl font-secondary">Essays, frameworks, and perspectives on building brands that matter.</p></FadeUp>

        {/* Featured Article */}
        <FadeUp delay={0.1} className="mb-24">
          <div onClick={() => navigate('article/' + JOURNAL_ARTICLES[0].id)} className="group relative border border-white/10 rounded-[32px] overflow-hidden flex flex-col md:flex-row h-auto md:h-[500px] cursor-pointer" style={{ backgroundColor: palette.panel }}>
             <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10">
                <span className="text-[10px] font-medium tracking-widest uppercase block mb-6 font-primary" style={{ color: palette.primary }}>Featured • {JOURNAL_ARTICLES[0].tag}</span>
                <h3 className="text-4xl md:text-5xl font-light mb-8 font-primary group-hover:text-white/80 transition-colors leading-tight">{JOURNAL_ARTICLES[0].title}</h3>
                <p className="text-white/50 font-light mb-10 text-lg leading-relaxed font-secondary line-clamp-3">{JOURNAL_ARTICLES[0].excerpt}</p>
                <div className="mt-auto flex items-center justify-between font-secondary text-sm border-t border-white/5 pt-6 text-white/40">
                   <span>{JOURNAL_ARTICLES[0].author}</span>
                   <span>{JOURNAL_ARTICLES[0].time}</span>
                </div>
             </div>
             <div className="md:w-1/2 relative overflow-hidden h-[300px] md:h-full bg-[#05050A]">
               <div className="absolute inset-0 opacity-40 mix-blend-screen transition-transform duration-1000 ease-out group-hover:scale-105" style={{ background: `radial-gradient(circle at center, ${palette.primary}, transparent)` }} />
               <div className="absolute inset-0 flex items-center justify-center"><BookOpen className="w-32 h-32 text-white/10 transition-transform duration-700 group-hover:rotate-12" /></div>
             </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="flex gap-4 mb-12 border-b border-white/10 pb-6 overflow-x-auto font-secondary">
          <button className="px-4 py-2 rounded-full border border-white text-white text-sm shrink-0">All Perspectives</button>
          <button className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-sm shrink-0 hover:bg-white/5">Frameworks</button>
          <button className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-sm shrink-0 hover:bg-white/5">Culture</button>
          <button className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-sm shrink-0 hover:bg-white/5">Design Systems</button>
        </FadeUp>

        <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-32">
          {JOURNAL_ARTICLES.slice(1).map((article, i) => (
             <StaggerItem key={i}>
               <div onClick={() => navigate('article/' + article.id)} className="border border-white/10 rounded-[24px] p-8 h-[380px] flex flex-col hover:-translate-y-2 transition-transform cursor-pointer group shadow-xl" style={{ backgroundColor: palette.panel }}>
                 <div className="text-[10px] tracking-widest uppercase mb-6 font-primary font-medium" style={{ color: palette[article.type] || palette.primary }}>{article.tag}</div>
                 <h4 className="text-2xl font-light text-white mb-6 font-primary group-hover:text-white/80 transition-colors leading-snug">{article.title}</h4>
                 <p className="text-white/50 text-sm font-secondary font-light line-clamp-3 mb-8">{article.excerpt}</p>
                 <div className="mt-auto flex justify-between items-center text-xs text-white/40 font-secondary pt-6 border-t border-white/5">
                   <span>{article.time}</span>
                   <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all">
                     <ArrowRight className="w-3 h-3 group-hover:text-white" />
                   </div>
                 </div>
               </div>
             </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Newsletter CTA */}
        <FadeUp className="border border-white/10 rounded-[32px] p-12 md:p-16 flex flex-col md:flex-row gap-12 items-center" style={{ background: `linear-gradient(135deg, ${palette.panel}, ${palette.bgDeep})` }}>
           <div className="md:w-1/2">
             <h3 className="text-3xl font-light mb-4 font-primary text-white">Get insights in your inbox.</h3>
             <p className="text-white/50 font-secondary text-lg leading-relaxed">Join innovators receiving our monthly digest on brand strategy, SciArt philosophy, and design thinking.</p>
           </div>
           <div className="md:w-1/2 w-full">
             <form className="flex gap-4 w-full" onSubmit={(e) => e.preventDefault()}>
               <input required type="email" placeholder="Email Address" className="w-full bg-white/[0.05] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none font-secondary" style={{ '--tw-ring-color': palette.primary }} />
               <PremiumButton type="submit" className="shrink-0 px-8">Subscribe</PremiumButton>
             </form>
           </div>
        </FadeUp>
      </div>
    </div>
  );
};

const ArticlePage = ({ navigate, articleId }) => {
  const article = JOURNAL_ARTICLES.find(a => a.id === articleId) || JOURNAL_ARTICLES[0];
  const artColor = palette[article.type] || palette.primary;

  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left max-w-3xl mx-auto">
        <button onClick={() => navigate('journal')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-16 font-secondary"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Journal</button>
        
        <FadeUp>
          <div className="text-[10px] tracking-widest uppercase mb-6 font-primary font-medium" style={{ color: artColor }}>{article.tag}</div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-8 font-primary leading-tight">{article.title}</h1>
          <div className="flex items-center gap-6 text-white/40 font-secondary text-sm mb-16 pb-8 border-b border-white/10">
            <span>By {article.author}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{article.date}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{article.time}</span>
          </div>
        </FadeUp>

        <FadeUp delay={0.1} className="w-full h-[300px] md:h-[400px] rounded-[24px] mb-16 overflow-hidden relative border border-white/5" style={{ backgroundColor: palette.panel }}>
           <div className="absolute inset-0 opacity-30 mix-blend-screen" style={{ background: `radial-gradient(circle at top right, ${artColor}, transparent 70%)` }} />
           <div className="absolute inset-0 flex items-center justify-center"><BookOpen className="w-24 h-24 text-white/5" /></div>
        </FadeUp>

        <StaggerGroup className="space-y-8 text-lg font-light text-white/70 font-secondary leading-relaxed mb-32">
          <StaggerItem><p className="text-2xl text-white font-medium mb-10 leading-snug">{article.excerpt}</p></StaggerItem>
          <StaggerItem>
             <p>This is a placeholder for the rich text content of the article. In a fully implemented CMS, this section would parse Markdown or HTML blocks representing the body of the perspective.</p>
          </StaggerItem>
          <StaggerItem>
             <h3 className="text-2xl font-primary text-white mt-12 mb-6">The Strategic Imperative</h3>
             <p>Every brand faces a moment where aesthetics alone are no longer enough to carry the narrative. This is where the structural integrity of science—the underlying logic of your product—must marry the emotional resonance of art.</p>
          </StaggerItem>
          <StaggerItem>
             <div className="p-8 border-l-4 border-white/20 bg-white/5 rounded-r-[16px] my-10 italic text-white">
               "Design without direction is just decoration. The truest form of innovation is making complex things feel inevitable."
             </div>
          </StaggerItem>
          <StaggerItem>
             <p>As we continue to co-create with breakthrough innovators, the methodology remains the same: diagnose the root cause, map the correct ecosystem, and execute with relentless precision.</p>
          </StaggerItem>
        </StaggerGroup>

        <div className="border-t border-white/10 pt-16 mt-16">
          <h3 className="text-2xl font-light mb-8 font-primary">More from the Journal</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {JOURNAL_ARTICLES.filter(a => a.id !== article.id).slice(0, 2).map((a, i) => (
              <div key={i} onClick={() => navigate('article/' + a.id)} className="border border-white/10 rounded-[16px] p-6 flex flex-col hover:-translate-y-1 transition-transform cursor-pointer group" style={{ backgroundColor: palette.panel }}>
                <div className="text-[10px] tracking-widest uppercase mb-4 font-primary" style={{ color: palette[a.type] || palette.primary }}>{a.tag}</div>
                <h4 className="text-lg font-medium text-white mb-6 font-primary group-hover:text-white/80">{a.title}</h4>
                <div className="mt-auto flex justify-between items-center text-xs text-white/40 font-secondary">
                  <span>{a.time}</span>
                  <ArrowRight className="w-3 h-3 group-hover:text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Leaflet Map implementation to avoid missing dependencies in this environment
const LeafletMap = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initMap = () => {
      const mapEl = document.getElementById('pbh-hq-map');
      if (mapEl && window.L && !mapEl._leaflet_id) {
        // Nehru Place, Delhi Coordinates
        const map = window.L.map('pbh-hq-map', { zoomControl: false }).setView([28.5494, 77.2517], 13);
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);

        const markerHtml = `<div style="background-color:${palette.primary}; width:16px; height:16px; border-radius:50%; border:3px solid ${palette.bgDeep}; box-shadow: 0 0 15px ${palette.primary};"></div>`;
        const customIcon = window.L.divIcon({ className: 'custom-pin', html: markerHtml, iconSize: [16, 16], iconAnchor: [8, 8] });
        window.L.marker([28.5494, 77.2517], { icon: customIcon }).addTo(map);
      }
    };

    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  return <div id="pbh-hq-map" className="w-full h-full min-h-[300px] z-0 relative" />;
};

const ContactPage = ({ navigate }) => {
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left max-w-6xl mx-auto">
        <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12 font-secondary"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
        
        {/* Section 1: Hero */}
        <FadeUp>
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight font-primary">Start with a conversation. <br/><AnimatedItalic className="text-white/50">Or start with clarity.</AnimatedItalic></h1>
          <p className="text-white/50 mb-20 text-xl font-light font-secondary max-w-2xl">Have a project in mind? Choose how you want to begin your journey with PurpleBlue House.</p>
        </FadeUp>
        
        {/* Section 2: Contact Options */}
        <FadeUp className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="border border-white/10 rounded-[24px] p-10 flex flex-col justify-between" style={{ backgroundColor: palette.panel }}>
            <div>
              <h3 className="text-2xl font-light mb-4 font-primary">I know what I need.</h3>
              <p className="text-white/50 font-light mb-8 font-secondary">Skip the assessment and send us a direct message outlining your requirements.</p>
            </div>
            <form className="space-y-4 text-left w-full font-secondary" onSubmit={(e) => e.preventDefault()}>
              <input required placeholder="Your Name" className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none transition-colors focus:border-white/30" />
              <input required type="email" placeholder="Work Email" className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none transition-colors focus:border-white/30" />
              <PremiumButton type="submit" className="w-full">Send Message</PremiumButton>
            </form>
          </div>
          <div className="border rounded-[24px] p-10 flex flex-col justify-center text-center items-center relative overflow-hidden" style={{ background: `linear-gradient(to bottom right, ${hexToRgba(palette.primary, 0.1)}, transparent)`, borderColor: hexToRgba(palette.primary, 0.2) }}>
            <div className="w-16 h-16 rounded-[16px] flex items-center justify-center mb-6" style={{ backgroundColor: hexToRgba(palette.primary, 0.2), color: palette.primary }}><Fingerprint className="w-8 h-8" /></div>
            <h3 className="text-2xl font-light mb-4 text-white font-primary">I need help defining the scope.</h3>
            <p className="text-white/70 font-light mb-8 max-w-sm font-secondary">Use our strategic tool to map your exact deliverables before the first call.</p>
            <PremiumButton onClick={() => navigate('assessment')} className="w-full font-secondary">Build My Brand Scope</PremiumButton>
          </div>
        </FadeUp>

        {/* Section 3 & 4: Direct Info & Map */}
        <FadeUp className="grid md:grid-cols-2 gap-8 mb-24 h-[400px]">
          <div className="border border-white/10 rounded-[24px] p-10 flex flex-col justify-center" style={{ backgroundColor: palette.panel }}>
            <h3 className="text-2xl font-light mb-8 font-primary">Direct Contact</h3>
            <div className="space-y-6 font-secondary">
               <div className="flex items-start gap-4">
                 <div className="mt-1 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Mail className="w-4 h-4 text-white/70" /></div>
                 <div>
                   <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Email</p>
                   <p className="text-lg text-white">hello@purplebluehouse.com</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="mt-1 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Phone className="w-4 h-4 text-white/70" /></div>
                 <div>
                   <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Phone</p>
                   <p className="text-lg text-white">+91 (123) 456-7890</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="mt-1 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-white/70" /></div>
                 <div>
                   <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Global HQ</p>
                   <p className="text-lg text-white">Nehru Place, Delhi, IN</p>
                 </div>
               </div>
            </div>
          </div>
          <div className="rounded-[24px] overflow-hidden border border-white/10 relative shadow-2xl h-full w-full bg-[#05050A]">
             <LeafletMap />
          </div>
        </FadeUp>

        {/* Section 5: What Happens Next */}
        <div className="mb-24">
          <FadeUp><h3 className="text-3xl font-light mb-12 font-primary text-center">What happens next?</h3></FadeUp>
          <StaggerGroup className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Review", desc: "Our strategy team reviews your message or Scope Blueprint within 24 hours.", icon: <CheckSquare /> },
              { num: "02", title: "Alignment Call", desc: "We schedule a 30-minute discovery session to ensure mutual fit and understanding.", icon: <Phone /> },
              { num: "03", title: "Custom Proposal", desc: "You receive a detailed roadmap, timeline, and resource allocation plan.", icon: <FileText /> }
            ].map((step, idx) => (
               <StaggerItem key={idx}>
                 <div className="border border-white/5 bg-white/[0.02] rounded-[16px] p-8 text-center relative overflow-hidden group h-full">
                   <div className="absolute top-0 right-0 p-4 text-6xl font-serif italic text-white/5 group-hover:text-white/10 transition-colors">{step.num}</div>
                   <div className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center bg-white/5 relative z-10" style={{ color: palette.primary }}>{step.icon}</div>
                   <h4 className="text-xl font-medium text-white mb-3 font-primary relative z-10">{step.title}</h4>
                   <p className="text-white/50 font-secondary text-sm leading-relaxed relative z-10">{step.desc}</p>
                 </div>
               </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        {/* Section 6: FAQ */}
        <div className="max-w-3xl mx-auto border-t border-white/10 pt-16">
          <FadeUp><h3 className="text-3xl font-light mb-8 font-primary text-center">Frequently Asked Questions</h3></FadeUp>
          <StaggerGroup className="space-y-4 font-secondary">
             <StaggerItem>
               <div className="p-6 border border-white/10 rounded-[12px] bg-white/[0.01]">
                 <h4 className="font-medium text-white mb-2">Do you work with international clients?</h4>
                 <p className="text-sm text-white/50">Yes. While our roots and Global HQ are in India, we co-create with breakthrough innovators all over the world.</p>
               </div>
             </StaggerItem>
             <StaggerItem>
               <div className="p-6 border border-white/10 rounded-[12px] bg-white/[0.01]">
                 <h4 className="font-medium text-white mb-2">Do you take on execution-only work?</h4>
                 <p className="text-sm text-white/50">Rarely. We believe execution without strategy is bound to fail. We prefer to build the strategic foundation first.</p>
               </div>
             </StaggerItem>
          </StaggerGroup>
        </div>

      </div>
    </div>
  )
};

const AdminDashboard = ({ navigate }) => {
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-32 pb-24 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-light mb-2 font-primary">Lead Intelligence Dashboard</h1>
            <p className="text-white/40 text-sm font-secondary">Strategic assessments captured via Brand Scope Builder.</p>
          </div>
          <PremiumButton variant="ghost" onClick={() => navigate('home')} className="px-0 font-secondary">Exit System <ArrowRight className="w-4 h-4 ml-2"/></PremiumButton>
        </div>
        <div className="border border-white/10 rounded-[16px] overflow-hidden" style={{ backgroundColor: palette.panel }}>
          <div className="overflow-x-auto font-secondary">
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
                      <td className="p-6"><span className="px-3 py-1 rounded-full text-xs border" style={{ backgroundColor: hexToRgba(palette.primary, 0.1), color: palette.primary, borderColor: hexToRgba(palette.primary, 0.2) }}>{lead.clusters[0]}</span></td>
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

const Footer = ({ navigate }) => {
  return (
    <footer className="border-t border-white/5 pt-20 pb-12 px-[3%] relative z-10 w-full text-left" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-2 flex flex-col items-start pr-8">
            <div className="flex items-center gap-3 text-xl font-medium tracking-wide mb-6 cursor-pointer font-primary" onClick={() => navigate('home')}>
              <img src="https://static.wixstatic.com/media/32f09f_d2e483f6417246ba946ed54bbb518bb8~mv2.png" alt="PurpleBlue House" className="h-8 w-auto object-contain shrink-0" />
              PurpleBlue House
            </div>
            <p className="text-white/40 font-light text-sm leading-relaxed mb-6 font-secondary max-w-sm">A premium brand, storytelling, and communication studio that understands your brand problem before you even speak to them.</p>
            <div className="flex gap-4 mb-6">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 cursor-pointer transition-all"><Globe className="w-3 h-3"/></div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 cursor-pointer transition-all"><Mail className="w-3 h-3"/></div>
            </div>
          </div>
          <div className="flex flex-col items-start font-secondary md:col-span-1">
            <h4 className="text-white/80 font-medium mb-6 text-sm">Studio</h4>
            <div className="flex flex-col space-y-4 text-white/40 text-sm font-light">
              <button onClick={() => navigate('home')} className="hover:text-white transition-colors text-left">Home</button>
              <button onClick={() => navigate('about')} className="hover:text-white transition-colors text-left">About Us</button>
              <button onClick={() => navigate('method')} className="hover:text-white transition-colors text-left">The PBH Method</button>
              <button onClick={() => navigate('story')} className="hover:text-white transition-colors text-left">Our Story</button>
              <button onClick={() => navigate('team')} className="hover:text-white transition-colors text-left">The Team</button>
              <button onClick={() => navigate('journal')} className="hover:text-white transition-colors text-left">The Journal</button>
            </div>
          </div>
          <div className="flex flex-col items-start font-secondary md:col-span-1">
            <h4 className="text-white/80 font-medium mb-6 text-sm">Services</h4>
            <div className="flex flex-col space-y-4 text-white/40 text-sm font-light">
              <button onClick={() => navigate('services')} className="hover:text-white transition-colors text-left">Overview</button>
              <button onClick={() => navigate('services/bb')} className="hover:text-white transition-colors text-left">Brand Boulevard</button>
              <button onClick={() => navigate('services/sas')} className="hover:text-white transition-colors text-left">SciArt Saga</button>
              <button onClick={() => navigate('services/stc')} className="hover:text-white transition-colors text-left">Storytelling Corner</button>
            </div>
          </div>
          <div className="flex flex-col items-start font-secondary md:col-span-1">
            <h4 className="text-white/80 font-medium mb-6 text-sm">Connect</h4>
            <div className="flex flex-col space-y-4 text-white/40 text-sm font-light">
              <button onClick={() => navigate('contact')} className="hover:text-white transition-colors text-left">Contact Us</button>
              <button onClick={() => navigate('assessment')} className="hover:text-white transition-colors text-left">Build Brand Scope</button>
              <span className="cursor-pointer hover:text-white flex items-center gap-2 mt-4" onClick={()=>navigate('admin')}><Lock className="w-3 h-3"/> Admin Area</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[10px] sm:text-xs font-medium text-white/30 uppercase tracking-widest gap-4 font-secondary">
          <p>© {new Date().getFullYear()} PurpleBlue House. All rights reserved.</p>
          <div className="flex gap-6"><span className="cursor-pointer hover:text-white">Privacy Policy</span><span className="cursor-pointer hover:text-white">Terms</span></div>
        </div>
      </div>
    </footer>
  )
};

export default function App() {
  const [routeState, setRouteState] = useState({ page: 'home', data: null });

  const navigate = (path, data = null) => {
    if (path.startsWith('services/')) {
      setRouteState({ page: 'service-detail', data: path.split('/')[1] });
    } else if (path.startsWith('article/')) {
      setRouteState({ page: 'article-detail', data: path.split('/')[1] });
    } else {
      setRouteState({ page: path, data });
    }
  };

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [routeState.page, routeState.data]);

  return (
    <div className="min-h-screen text-[#F4F4F5] w-full selection:text-white overflow-x-clip font-secondary" style={{ backgroundColor: palette.bgDeep, scrollBehavior: 'smooth', '--tw-selection-color': palette.primary + '4D' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&family=Space+Grotesk:wght@300..700&display=swap');
        
        .font-primary { font-family: ${palette.fonts.primary} !important; }
        .font-secondary { font-family: ${palette.fonts.secondary} !important; }
        
        h1, h2, h3, h4, h5, h6, .font-serif {
            font-family: ${palette.fonts.primary} !important;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; } 
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } 
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; } 
        html { scroll-behavior: smooth; }
        ::selection { background-color: var(--tw-selection-color); color: white; }
        
        /* Leaflet custom map tweaks */
        .leaflet-container { background: #05050A !important; font-family: ${palette.fonts.secondary} !important; }
        .leaflet-popup-content-wrapper { background: #0C185C !important; color: white !important; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px !important; }
        .leaflet-popup-tip { background: #0C185C !important; }

        html.mega-menu-open #site-blur-layer {
          filter: blur(10px) brightness(0.55) saturate(0.85);
          transform: scale(1.015);
          pointer-events: none;
          user-select: none;
        }

        html.mega-menu-open body {
          overflow-x: hidden;
        }
      `}</style>
      <GlobalFilmGrain />
      <CustomCursor />
      {routeState.page !== 'admin' && <Header navigate={navigate} current={routeState.page} />}
      
      <div id="site-blur-layer" className="transition-[filter,transform,opacity] duration-300 ease-out">
        <main className="w-full min-h-screen flex flex-col">
          <AnimatePresence mode="wait">
            {routeState.page === 'home' && <HomePage key="home" navigate={navigate} />}
            {routeState.page === 'about' && <AboutPage key="about" navigate={navigate} />}
            {routeState.page === 'method' && <MethodPage key="method" navigate={navigate} />}
            {routeState.page === 'story' && <OurStoryPage key="story" navigate={navigate} />}
            {routeState.page === 'team' && <TeamPage key="team" navigate={navigate} />}
            {routeState.page === 'services' && <ServicesPage key="services" navigate={navigate} />}
            {routeState.page === 'service-detail' && <ServiceDetailPage key="service-detail" navigate={navigate} routeId={routeState.data} />}
            {routeState.page === 'work' && <WorkPage key="work" navigate={navigate} />}
            {routeState.page === 'journal' && <JournalPage key="journal" navigate={navigate} />}
            {routeState.page === 'article-detail' && <ArticlePage key="article-detail" navigate={navigate} articleId={routeState.data} />}
            {routeState.page === 'contact' && <ContactPage key="contact" navigate={navigate} />}
            {routeState.page === 'assessment' && <StrategicEngine key="engine" navigate={navigate} />}
            {routeState.page === 'admin' && <AdminDashboard key="admin" navigate={navigate} />}
          </AnimatePresence>
        </main>

        {routeState.page !== 'admin' && routeState.page !== 'assessment' && <Footer navigate={navigate} />}
      </div>
    </div>
  );
}
