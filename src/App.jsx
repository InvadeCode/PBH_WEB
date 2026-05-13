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
    <motion.div className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[99999] mix-blend-difference hidden md:flex items-center justify-center"
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
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
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
    return { x: center + radius * value * Math.cos(angle), y: center + radius * value * Math.sin(angle) };
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
          return <polygon key={i} points={points} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
        })}
        {data.map((_, i) => {
          const p = getPoint(1, i, data.length);
          return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
        })}
        <motion.polygon 
          points={dataPoints} fill="rgba(138,92,255,0.2)" stroke="#8A5CFF" strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.2 }}
          style={{ transformOrigin: `${center}px ${center}px` }} className="mix-blend-screen"
        />
        {data.map((d, i) => {
          const p = getPoint(d.score / 100, i, data.length);
          return <motion.circle key={i} cx={p.x} cy={p.y} r="4" fill="#ffffff" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }} />;
        })}
        {data.map((d, i) => {
          const p = getPoint(1.25, i, data.length);
          return <motion.text key={i} x={p.x} y={p.y} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle" alignmentBaseline="middle" className="uppercase tracking-widest font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>{d.label}</motion.text>;
        })}
      </svg>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-[#05050A]/80 backdrop-blur-md w-16 h-16 rounded-full justify-center border border-white/10 shadow-xl">
        <span className="text-xl font-light text-white leading-none">{overallScore}</span>
        <span className="text-[8px] uppercase tracking-widest text-[#8A5CFF]">Index</span>
      </motion.div>
    </div>
  );
};

// --- CUSTOM LEAFLET MAP COMPONENT ---

const LeafletMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    let mapInstance;
    const initMap = () => {
      if (!window.L || !mapRef.current || mapRef.current._leaflet_id) return;
      mapInstance = window.L.map(mapRef.current, { zoomControl: false, scrollWheelZoom: false }).setView([28.5494, 77.2529], 2.5);
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd', maxZoom: 20
      }).addTo(mapInstance);
      const createNode = (color) => window.L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="width: 16px; height: 16px; background: ${color}; border-radius: 50%; box-shadow: 0 0 20px ${color}; animation: mapPulse 2s infinite;"></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8]
      });
      window.L.marker([28.5494, 77.2529], { icon: createNode('#8A5CFF') }).addTo(mapInstance).bindPopup('<div class="text-black font-medium px-2 py-1">PBH HQ - Nehru Place, Delhi</div>');
      window.L.marker([51.5074, -0.1278], { icon: createNode('#2563FF') }).addTo(mapInstance).bindPopup('<div class="text-black font-medium px-2 py-1">PBH - London</div>');
      window.L.marker([40.7128, -74.0060], { icon: createNode('#8A5CFF') }).addTo(mapInstance).bindPopup('<div class="text-black font-medium px-2 py-1">PBH - New York</div>');
    };
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css'; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js'; script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      if (window.L) initMap();
      else document.getElementById('leaflet-js').addEventListener('load', initMap);
    }
    return () => { if (mapInstance) mapInstance.remove(); };
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <style>{`@keyframes mapPulse { 0% { box-shadow: 0 0 0 0 rgba(138,92,255, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(138,92,255, 0); } 100% { box-shadow: 0 0 0 0 rgba(138,92,255, 0); } } .leaflet-popup-content-wrapper { background: #ffffff; color: #000; border-radius: 8px; font-family: inherit; } .leaflet-popup-tip { background: #ffffff; } .leaflet-container { background: #05050A; font-family: inherit; } .leaflet-control-attribution { opacity: 0.2; }`}</style>
      <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#05050A' }} />
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_100px_rgba(5,5,10,1)]" />
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
      if (step < QUIZ_QUESTIONS.length) setStep(step + 1);
      else processDiagnosis(newAnswers);
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
      className={`relative px-5 py-2.5 cursor-pointer transition-colors capitalize rounded-full overflow-hidden ${active ? 'text-white' : 'text-white/50 hover:text-white'}`}
    >
      {active && (
        <motion.span layoutId="nav-indicator" className="absolute inset-0 rounded-full bg-white/[0.07] z-0" transition={{ duration: 0.18, ease: 'easeOut' }} />
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

  const openMenu = (menu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 120);
  };

  const closeImmediately = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(null);
  };

  const ServicesMegaMenu = () => (
    <div className="grid md:grid-cols-3 gap-6 text-left">
      {Object.values(ROUTES_INFO).map((route) => (
        <MenuHoverCard key={route.id} color={route.color} onClick={() => { navigate(`services/${route.id.toLowerCase()}`); closeImmediately(); }}>
          <div className="w-12 h-12 rounded-[12px] bg-white/[0.04] flex items-center justify-center mb-8" style={{ color: route.color }}>{route.icon}</div>
          <h4 className="text-xl font-medium text-white mb-3">{route.title}</h4>
          <p className="text-sm text-white/45 leading-relaxed font-light">{route.desc}</p>
        </MenuHoverCard>
      ))}
    </div>
  );

  const WorkMegaMenu = () => (
    <div className="grid md:grid-cols-2 gap-6 text-left">
      {CASE_STUDIES.map((cs) => (
        <MenuHoverCard key={cs.client} color={cs.color?.includes('2563') ? '#2563FF' : '#8A5CFF'} onClick={() => { navigate('work'); closeImmediately(); }}>
          <span className="text-[10px] uppercase tracking-widest text-[#8A5CFF] mb-4">{cs.sector}</span>
          <h4 className="text-xl font-medium text-white mb-3">{cs.client}</h4>
          <p className="text-sm text-white/45 leading-relaxed font-light">{cs.challenge}</p>
        </MenuHoverCard>
      ))}
    </div>
  );

  const MethodMegaMenu = () => (
    <div className="grid md:grid-cols-4 gap-6 text-left">
      {[
        { step: 'Diagnosis', desc: 'Understand the brand problem.' },
        { step: 'Mapping', desc: 'Route the problem to the right ecosystem.' },
        { step: 'Scope Building', desc: 'Define exact deliverables and priorities.' },
        { step: 'Execution', desc: 'Move from clarity to implementation.' }
      ].map((item, i) => (
        <MenuHoverCard key={item.step} color={i % 2 === 0 ? '#8A5CFF' : '#2563FF'} onClick={() => { navigate('method'); closeImmediately(); }}>
          <span className="text-4xl font-serif italic mb-6 block text-white/10 group-hover:text-white/30 transition-colors duration-500">0{i + 1}</span>
          <h4 className="text-sm font-medium text-white mb-2">{item.step}</h4>
          <p className="text-[11px] text-white/45 leading-relaxed mt-auto font-light">{item.desc}</p>
        </MenuHoverCard>
      ))}
    </div>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[10000] h-[92px] bg-[#05050A] shadow-[0_18px_70px_rgba(0,0,0,0.55)]">
        <div className="w-full h-full px-[3%] flex justify-between items-center">
          <div className="text-lg font-medium tracking-wide cursor-pointer flex items-center gap-3 hover:opacity-80 transition-opacity text-white" onClick={() => { navigate('home'); closeImmediately(); }}>
            <img src="https://static.wixstatic.com/media/32f09f_d2e483f6417246ba946ed54bbb518bb8~mv2.png" alt="PurpleBlue House" className="h-6 w-auto object-contain shrink-0" />
            PurpleBlue House
          </div>

          <nav className="hidden lg:flex items-center gap-2 text-sm font-medium tracking-wide bg-white/[0.035] rounded-full px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_50px_rgba(0,0,0,0.35)]">
            <NavLink 
              onClick={() => {navigate('work'); setActiveMenu(null);}} 
              onMouseEnter={() => openMenu('work')} 
              onMouseLeave={closeMenu}
              active={current === 'work' || activeMenu === 'work'}
            >
              Work
            </NavLink>
            <NavLink 
              onClick={() => {navigate('services'); setActiveMenu(null);}} 
              onMouseEnter={() => openMenu('services')} 
              onMouseLeave={closeMenu}
              active={current?.startsWith('services') || activeMenu === 'services'}
            >
              Services
            </NavLink>
            <NavLink 
              onClick={() => {navigate('method'); setActiveMenu(null);}} 
              onMouseEnter={() => openMenu('method')} 
              onMouseLeave={closeMenu}
              active={current === 'method' || activeMenu === 'method'}
            >
              Method
            </NavLink>
            <NavLink 
              onClick={() => {navigate('about'); setActiveMenu(null);}} 
              onMouseEnter={closeImmediately} 
              onMouseLeave={() => {}}
              active={current === 'about'}
            >
              About
            </NavLink>
            <NavLink 
              onClick={() => {navigate('contact'); closeImmediately();}} 
              onMouseEnter={closeImmediately} 
              onMouseLeave={() => {}}
              active={current === 'contact'}
            >
              Contact
            </NavLink>
          </nav>

          <div className="hidden lg:flex items-center">
            <PremiumButton onClick={() => { navigate('assessment'); closeImmediately(); }} className="px-6 py-2.5 rounded-[9px] text-xs shadow-[0_0_20px_rgba(138,92,255,0.1)]">Build My Brand Scope</PremiumButton>
          </div>
          <div className="lg:hidden flex items-center">
            <button onClick={() => navigate('assessment')} className="text-[10px] font-medium text-white bg-gradient-to-r from-[#8A5CFF] to-[#2563FF] px-4 py-2 rounded-[6px] uppercase tracking-widest shadow-md">Build Scope</button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeMenu && (
          <motion.div key="mega-menu-shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12, ease: 'linear' }} className="fixed inset-0 z-[9998] bg-[#05050A]/88 pointer-events-none">
            <motion.div key={activeMenu} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.16, ease: 'easeOut' }} className="absolute top-[112px] left-[3%] right-[3%] pointer-events-auto" onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }} onMouseLeave={closeMenu}>
              <div className="relative overflow-hidden rounded-[24px] bg-[#05050A] p-10 shadow-[0_60px_140px_rgba(0,0,0,1)] border border-white/10">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.045),rgba(255,255,255,0.01))] pointer-events-none" />
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

      <section className="py-32 px-[3%] relative w-full bg-[#0A0A0F] border-y border-white/5">
        <SpotlightCard className="rounded-[24px]">
          <div className="bg-gradient-to-br from-[#0A0A0F] to-[#0A0A0F] relative border border-white/10 rounded-[24px] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8A5CFF] opacity-[0.05] blur-[120px] pointer-events-none" />
            <div className="flex-1 relative z-10">
              <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">Not sure what your brand <br/><AnimatedItalic className="text-white/50">needs first?</AnimatedItalic></h2>
              <p className="text-lg text-white/50 font-light leading-relaxed max-w-xl mx-auto md:mx-0 mb-4">Take a guided strategic assessment and get a custom brand scope based on your current stage, communication gaps, priorities, and growth goals.</p>
              <span className="text-xs uppercase tracking-widest text-[#8A5CFF] font-medium block">Takes 3–5 minutes. No generic form. No assumptions.</span>
            </div>
            <div className="shrink-0 relative z-10">
              <PremiumButton onClick={() => navigate('assessment')} className="px-10 py-6 text-lg shadow-[0_0_50px_rgba(138,92,255,0.15)]">Build My Brand Scope <ArrowRight className="w-5 h-5 ml-2" /></PremiumButton>
            </div>
          </div>
        </SpotlightCard>
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
  <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-40 pb-0 w-full overflow-hidden">
    <section className="px-[3%] mb-32 relative z-10 text-left">
      <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
      <RevealText><h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-light tracking-tight leading-[0.95] max-w-6xl">We build brands that <AnimatedItalic className="text-[#8A5CFF]">move culture.</AnimatedItalic></h1></RevealText>
    </section>

    <section className="py-32 px-[3%] bg-[#0A0A0F] border-y border-white/5 relative overflow-hidden text-left">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8A5CFF] opacity-[0.03] blur-[150px] pointer-events-none rounded-full" />
      <div className="grid md:grid-cols-2 gap-16 relative z-10">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-widest text-[#8A5CFF] mb-6">The Origin</h2>
          <h3 className="text-4xl md:text-5xl font-light leading-tight mb-8">We saw a massive gap between <span className="text-white/40">beautiful design and actual business strategy.</span></h3>
        </div>
        <div className="space-y-6 text-lg text-white/60 font-light leading-relaxed">
          <p>PurpleBlue House was founded to bridge the gap between creative studios that only care about aesthetics, and consulting firms that only care about spreadsheets.</p>
          <p>We realized that founders were frustrated. They would pay for gorgeous branding, but it wouldn't solve their core narrative problems. Or they would pay for heavy strategy, but couldn't execute it beautifully.</p>
          <p>We built PBH to be the synthesis. A premium creative house driven entirely by rigorous business strategy.</p>
        </div>
      </div>
    </section>

    <section className="py-24 bg-[#8A5CFF] w-full text-center flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="relative z-10 w-full overflow-hidden flex whitespace-nowrap">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 25 }} className="flex gap-16 text-[#05050A] opacity-90">
            <span className="text-6xl md:text-8xl font-light tracking-tighter uppercase">No Generic Forms. No Assumptions. No Templates.</span>
            <span className="text-6xl md:text-8xl font-light tracking-tighter uppercase">No Generic Forms. No Assumptions. No Templates.</span>
          </motion.div>
      </div>
    </section>

    <section className="py-32 px-[3%] bg-[#05050A] text-left">
      <div className="max-w-4xl mb-20">
        <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6">The PBH Triad.</h2>
        <p className="text-xl text-white/50 font-light leading-relaxed">Our entire operating model is built on three interconnected pillars. You cannot succeed without all three.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: "Strategy", icon: <Target className="w-8 h-8"/>, color: "#8A5CFF", desc: "Positioning, audience mapping, and competitive gap analysis. Knowing exactly where to strike." },
          { title: "Story", icon: <MessageSquare className="w-8 h-8"/>, color: "#2563FF", desc: "The narrative architecture. Translating complex business models into visceral human truths." },
          { title: "Systems", icon: <Layers className="w-8 h-8"/>, color: "#8A5CFF", desc: "The execution layer. Visual identities, playbooks, and templates that allow the brand to scale." }
        ].map((item, i) => (
          <div key={i} className="bg-[#0A0A0F] border border-white/5 rounded-[24px] p-12 hover:border-white/20 transition-colors">
            <div className="w-16 h-16 rounded-[16px] bg-white/5 border border-white/10 flex items-center justify-center mb-8" style={{ color: item.color }}>{item.icon}</div>
            <h3 className="text-3xl font-medium mb-4">{item.title}</h3>
            <p className="text-white/50 font-light text-lg leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="py-32 px-[3%] bg-[#0A0A0F] border-y border-white/5 relative overflow-hidden text-left">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2563FF] opacity-[0.03] blur-[150px] pointer-events-none rounded-full" />
      <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
        <div className="w-full aspect-[4/5] bg-white/[0.02] border border-white/10 rounded-[24px] overflow-hidden relative shadow-2xl">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,92,255,0.1)_0%,transparent_70%)] animate-pulse" style={{ animationDuration: '6s' }} />
           <div className="absolute inset-0 flex items-center justify-center text-white/10 font-serif italic text-4xl">Prerita</div>
        </div>
        <div>
          <h2 className="text-xs font-medium uppercase tracking-widest text-[#2563FF] mb-6">Founder & Creative Director</h2>
          <h3 className="text-5xl md:text-6xl font-light mb-8">Prerita</h3>
          <div className="space-y-6 text-lg text-white/60 font-light leading-relaxed">
            <p>Driven by an obsession with architectural design systems and human psychology, Prerita built PurpleBlue House to redefine how premium brands are constructed.</p>
            <p>Under her leadership, PBH has moved away from the traditional "design agency" model, instead operating as a strategic consultancy that uses design as its primary weapon.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="py-32 px-[3%] bg-[#05050A] text-left">
      <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-20 text-center">Studio <AnimatedItalic className="text-white/50">Values.</AnimatedItalic></h2>
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { title: "Diagnose First", desc: "Prescription without diagnosis is malpractice. We ask hard questions before we open design software." },
          { title: "Zero Fluff", desc: "No agency jargon. No vanity metrics. We focus strictly on what drives business growth and brand equity." },
          { title: "Systemic Thinking", desc: "A beautiful logo is useless if the team can't use it. We build comprehensive, scalable systems." },
          { title: "Premium Restraint", desc: "Confidence is quiet. We believe the most premium brands show immense restraint in their design." }
        ].map((v, i) => (
          <div key={i} className="p-8 border-t border-white/10">
            <span className="text-sm font-mono text-[#8A5CFF] mb-4 block">0{i+1}</span>
            <h4 className="text-xl font-medium text-white mb-4">{v.title}</h4>
            <p className="text-sm text-white/50 font-light leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="py-32 px-[3%] bg-[#0A0A0F] border-y border-white/5 text-center">
      <div className="max-w-3xl mx-auto">
        <Globe className="w-12 h-12 text-[#8A5CFF] mx-auto mb-8 opacity-50" />
        <h2 className="text-3xl md:text-5xl font-light mb-8">Rooted in Delhi. <br/>Working with the world.</h2>
        <p className="text-lg text-white/50 font-light leading-relaxed">While our physical studio operations are anchored in Delhi, India, our operating system is entirely global. We partner seamlessly with founders and teams across North America, Europe, and Asia.</p>
      </div>
    </section>

    <section className="py-32 px-[3%] bg-[#05050A] text-left">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-8">We don't sell hours. <br/><AnimatedItalic className="text-white/50">We sell outcomes.</AnimatedItalic></h2>
          <div className="space-y-6 text-lg text-white/60 font-light leading-relaxed">
            <p>Traditional agencies punish efficiency by charging hourly. The longer they take, the more they make.</p>
            <p>We use **value-based, modular scoping**. You pay for the strategic ecosystem and the exact deliverables required to solve your friction points. Transparent timelines, fixed costs, and zero billing surprises.</p>
          </div>
        </div>
        <div className="bg-[#0A0A0F] border border-white/10 rounded-[24px] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full pointer-events-none" />
          <h3 className="text-xs uppercase tracking-widest text-white/40 mb-8 font-medium">The Scope Architect</h3>
          <p className="text-white/80 font-light mb-8 text-xl">Our custom engine allows you to build your exact deliverable scope before we even sign a contract.</p>
          <PremiumButton onClick={() => navigate('assessment')} className="w-full">Try the Scope Builder</PremiumButton>
        </div>
      </div>
    </section>

    <section className="py-24 px-[3%] bg-[#0A0A0F] border-t border-white/5 text-left">
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="p-10 border border-white/10 rounded-[24px] bg-white/[0.02]">
          <h3 className="text-2xl font-light mb-8 flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-green-500" /> We are a great fit if:</h3>
          <ul className="space-y-4 text-white/60 font-light">
            <li>You value strategic thinking before design execution.</li>
            <li>You view your brand as a core driver of business equity.</li>
            <li>You are willing to collaborate deeply during discovery.</li>
            <li>You need a complete system, not just a quick logo.</li>
          </ul>
        </div>
        <div className="p-10 border border-white/10 rounded-[24px] bg-white/[0.02]">
          <h3 className="text-2xl font-light mb-8 flex items-center gap-3"><X className="w-6 h-6 text-red-500" /> We are not a fit if:</h3>
          <ul className="space-y-4 text-white/60 font-light">
            <li>You just need "someone to make it look pretty".</li>
            <li>You are looking for the cheapest, fastest offshore option.</li>
            <li>You want execution without doing the strategic groundwork.</li>
            <li>You treat design as an expense rather than an investment.</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="py-32 md:py-48 px-[3%] relative w-full bg-[#05050A] flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8A5CFF] rounded-[100%] blur-[200px] opacity-[0.08] pointer-events-none" />
      <div className="relative z-10 w-full flex flex-col items-center">
        <h2 className="text-xs font-medium text-[#8A5CFF] uppercase tracking-widest mb-6">Next Steps</h2>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-12 tracking-tight">Ready to build your <br/><AnimatedItalic className="text-white/60">brand scope?</AnimatedItalic></h1>
        <PremiumButton onClick={() => navigate('assessment')} className="px-12 py-6 text-lg w-full sm:w-auto">Start Strategic Assessment</PremiumButton>
      </div>
    </section>
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
  
  const philosophies = {
    'BB': "We don't design for aesthetic applause. We design to solve market friction and give your internal teams a scalable, undeniable visual operating system.",
    'SAS': "Complex ideas fail when they sound like engineering manuals. We translate deep technology and product innovation into visceral, human narratives.",
    'STC': "A good campaign isn't just clever copy. It's a structured deployment of narrative designed to hijack attention and demand an emotional response."
  };

  const frictions = {
    'BB': ['You look like everyone else in the category.', 'Your messaging changes depending on who you ask.', 'Your teams execute without brand guidelines.'],
    'SAS': ['Your product is amazing, but hard to explain.', 'Your GTM strategy lacks a central cohesive story.', 'Investors and users don’t understand the actual value.'],
    'STC': ['Your social media feels repetitive and dull.', 'You lack the creative direction for a major launch.', 'Your campaigns aren’t converting attention to action.']
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-40 pb-0 w-full overflow-hidden text-left">
      <section className="px-[3%] mb-32 relative z-10">
        <button onClick={() => navigate('services')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Services</button>
        <div className="absolute top-0 right-[10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.05] pointer-events-none" style={{ backgroundColor: route.color }} />
        <div className="w-24 h-24 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center mb-10 shadow-2xl relative z-10" style={{ color: route.color }}>{route.icon}</div>
        <RevealText><h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-light tracking-tight leading-[0.95] max-w-6xl relative z-10">{route.title}.</h1></RevealText>
        <p className="text-xl text-white/50 font-light mt-8 max-w-3xl leading-relaxed relative z-10">{route.desc}</p>
      </section>

      <section className="py-32 px-[3%] bg-[#0A0A0F] border-y border-white/5 text-center">
        <div className="max-w-5xl mx-auto">
          <Quote className="w-12 h-12 mx-auto mb-10 opacity-30" style={{ color: route.color }} />
          <h2 className="text-3xl md:text-5xl font-light leading-[1.4]">{philosophies[routeId.toUpperCase()] || philosophies['BB']}</h2>
        </div>
      </section>

      <section className="py-32 px-[3%] bg-[#05050A]">
        <h2 className="text-xs font-medium uppercase tracking-widest text-white/40 mb-12">The Friction: Who needs this?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(frictions[routeId.toUpperCase()] || frictions['BB']).map((f, i) => (
            <div key={i} className="p-8 border border-white/5 bg-white/[0.02] rounded-[16px] flex items-start gap-4">
              <X className="w-5 h-5 text-red-500/50 shrink-0 mt-1" />
              <p className="text-white/60 font-light text-lg">{f}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 px-[3%] bg-[#0A0A0F] border-y border-white/5">
        <div className="mb-20">
          <h2 className="text-xs font-medium uppercase tracking-widest text-white/40 mb-6">The Architecture</h2>
          <h3 className="text-4xl md:text-5xl font-light">What's included in this route.</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {route.lineItems.map(li => (
            <SpotlightCard key={li.id} className="rounded-[24px] h-full">
              <div className="bg-[#05050A] border border-white/5 rounded-[24px] p-10 h-full flex flex-col hover:border-white/10 transition-colors shadow-xl">
                <h4 className="text-2xl font-light mb-8 text-white">{li.name}</h4>
                <ul className="space-y-4 flex-grow">
                  {DELIVERABLES_MASTER.filter(d => d.lineItem === li.id).map(d => (
                    <li key={d.id} className="flex items-start gap-3 border-t border-white/5 pt-4">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: route.color }} />
                      <div>
                        <span className="text-sm font-medium text-white/90 block mb-1">{d.name}</span>
                        <span className="text-xs font-light text-white/40">{d.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      <section className="py-32 px-[3%] bg-[#05050A]">
        <h2 className="text-xs font-medium uppercase tracking-widest text-white/40 mb-16">The Process Workflow</h2>
        <div className="grid md:grid-cols-4 gap-8">
           {[
             { step: 'Phase 1', title: 'Discovery & Audit', desc: 'We review existing materials and diagnose exactly what is breaking.' },
             { step: 'Phase 2', title: 'Strategic Definition', desc: 'We build the foundational positioning and narrative architecture.' },
             { step: 'Phase 3', title: 'Creative Execution', desc: 'We translate the strategy into a final, undeniable visual and written system.' },
             { step: 'Phase 4', title: 'Handover & Governance', desc: 'We deploy the playbooks so your internal team can scale the output.' }
           ].map((s, i) => (
             <div key={i} className="border-t border-white/10 pt-8">
               <span className="text-[10px] font-medium tracking-widest uppercase mb-4 block" style={{ color: route.color }}>{s.step}</span>
               <h4 className="text-xl font-medium mb-4 text-white">{s.title}</h4>
               <p className="text-white/50 font-light leading-relaxed">{s.desc}</p>
             </div>
           ))}
         </div>
      </section>

      <section className="py-32 md:py-48 px-[3%] relative w-full bg-[#05050A] border-t border-white/5 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-[100%] blur-[200px] opacity-[0.06] pointer-events-none" style={{ backgroundColor: route.color }} />
        <div className="relative z-10 w-full flex flex-col items-center">
          <h2 className="text-xs font-medium uppercase tracking-widest mb-6" style={{ color: route.color }}>The Scope Architect</h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-12 tracking-tight">Configure your exact <br/><AnimatedItalic className="text-white/60">deliverables.</AnimatedItalic></h1>
          <p className="text-lg text-white/50 font-light mb-12 max-w-xl leading-relaxed">Don't guess what you need. Use our interactive builder to select the specific line items from {route.title} and generate a live project blueprint.</p>
          <PremiumButton onClick={() => navigate('assessment')} className="px-12 py-6 text-lg w-full sm:w-auto">Build This Scope</PremiumButton>
        </div>
      </section>
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
  <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-40 pb-0 w-full overflow-hidden text-left">
    <section className="px-[3%] mb-32 relative z-10">
      <button onClick={() => navigate('home')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2 group mb-12"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Home</button>
      <RevealText><h1 className="text-5xl md:text-7xl lg:text-[7rem] font-light mb-6 tracking-tight leading-none">Start a conversation.<br/><AnimatedItalic className="text-white/50">Or start with clarity.</AnimatedItalic></h1></RevealText>
      <p className="text-white/50 text-xl font-light max-w-2xl mt-8">We partner with founders and marketing teams who understand that execution without strategy is just noise. Choose how you'd like to begin.</p>
    </section>

    <section className="px-[3%] mb-32 relative z-10">
      <div className="grid md:grid-cols-2 gap-8 w-full">
        <div className="bg-[#0A0A0F] border border-white/10 rounded-[24px] p-10 md:p-14 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-3xl font-light mb-4">I know what I need.</h3>
            <p className="text-white/50 font-light mb-12">Skip the assessment and send us a direct message outlining your requirements or RFP.</p>
          </div>
          <form className="space-y-4 text-left w-full relative z-10" onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Your Name" className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none focus:border-white/30 transition-colors" />
              <input required type="email" placeholder="Work Email" className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none focus:border-white/30 transition-colors" />
            </div>
            <textarea required rows={3} placeholder="How can we help?" className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none focus:border-white/30 transition-colors resize-none" />
            <PremiumButton type="submit" variant="secondary" className="w-full border-white/20">Send Inquiry</PremiumButton>
          </form>
        </div>

        <div className="bg-gradient-to-br from-[#8A5CFF]/10 to-[#2563FF]/5 border border-[#8A5CFF]/20 rounded-[24px] p-10 md:p-14 flex flex-col justify-center text-center items-center relative overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,92,255,0.15)_0%,transparent_60%)] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="w-20 h-20 rounded-[20px] bg-[#8A5CFF]/20 flex items-center justify-center mb-8 relative z-10 border border-[#8A5CFF]/30"><Fingerprint className="w-10 h-10 text-[#8A5CFF]"/></div>
          <h3 className="text-3xl font-light mb-4 text-white relative z-10">I need help defining the scope.</h3>
          <p className="text-white/70 font-light mb-12 max-w-sm relative z-10">Use our strategic tool to map your exact deliverables, priorities, and gaps before the first call.</p>
          <PremiumButton onClick={() => navigate('assessment')} className="w-full max-w-sm shadow-[0_0_40px_rgba(138,92,255,0.3)] relative z-10">Build My Brand Scope</PremiumButton>
        </div>
      </div>
    </section>

    <section className="w-full h-[600px] border-y border-white/10 relative bg-[#05050A] overflow-hidden">
      <div className="absolute top-10 left-[3%] z-20 pointer-events-none">
        <h2 className="text-4xl md:text-5xl font-light drop-shadow-2xl">Global Reach. <br/><AnimatedItalic className="text-[#8A5CFF]">Delhi Roots.</AnimatedItalic></h2>
      </div>
      <LeafletMap />
    </section>

    <section className="py-24 px-[3%] bg-[#0A0A0F] border-b border-white/5">
      <div className="grid md:grid-cols-3 gap-12 w-full">
        <div className="flex flex-col items-start border-l border-white/10 pl-8">
          <span className="text-[10px] text-[#8A5CFF] uppercase tracking-widest font-medium mb-4 block">Headquarters</span>
          <h3 className="text-2xl font-light mb-2">Delhi, India</h3>
          <p className="text-white/50 font-light leading-relaxed">Our main strategic design studio and operational hub.</p>
        </div>
        <div className="flex flex-col items-start border-l border-white/10 pl-8">
          <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium mb-4 block">Client Hub</span>
          <h3 className="text-2xl font-light mb-2">London, UK</h3>
          <p className="text-white/50 font-light leading-relaxed">Local partners for UK and European client alignment.</p>
        </div>
        <div className="flex flex-col items-start border-l border-white/10 pl-8">
          <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium mb-4 block">Client Hub</span>
          <h3 className="text-2xl font-light mb-2">New York, USA</h3>
          <p className="text-white/50 font-light leading-relaxed">Local partners for North American strategy execution.</p>
        </div>
      </div>
    </section>

    <section className="py-32 px-[3%] bg-[#05050A]">
      <div className="max-w-4xl mb-16">
        <h2 className="text-xs font-medium uppercase tracking-widest text-[#8A5CFF] mb-6">The Process</h2>
        <h3 className="text-4xl md:text-5xl font-light">What happens after you reach out?</h3>
      </div>
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { time: "0-24 Hours", title: "Review", desc: "A partner reviews your inquiry or generated scope snapshot." },
          { time: "Day 2", title: "Discovery Call", desc: "We schedule a 30-minute alignment call to dive deep into the gaps." },
          { time: "Day 5", title: "Proposal", desc: "We present a custom SOW with exact timelines, deliverables, and costs." },
          { time: "Day 10", title: "Kickoff", desc: "Contracts signed. Strategy workshops scheduled. Work begins." }
        ].map((step, i) => (
          <div key={i} className="p-8 bg-[#0A0A0F] border border-white/5 rounded-[16px] relative overflow-hidden group hover:border-white/20 transition-colors">
            <span className="absolute top-0 right-8 w-1 h-8 bg-[#8A5CFF] opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-[10px] font-medium text-white/30 tracking-widest uppercase mb-6 block">{step.time}</span>
            <h4 className="text-xl font-medium text-white mb-3">{step.title}</h4>
            <p className="text-sm text-white/50 font-light leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="py-32 px-[3%] bg-[#0A0A0F] border-t border-white/5">
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h3 className="text-3xl font-light mb-10">Direct Channels</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 border border-white/10 rounded-[16px] bg-white/[0.02]">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center"><Mail className="w-5 h-5 text-white/50" /></div>
              <div>
                <h4 className="text-white font-medium mb-1">New Business</h4>
                <a href="mailto:hello@purplebluehouse.com" className="text-[#8A5CFF] hover:underline text-sm">hello@purplebluehouse.com</a>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 border border-white/10 rounded-[16px] bg-white/[0.02]">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center"><Briefcase className="w-5 h-5 text-white/50" /></div>
              <div>
                <h4 className="text-white font-medium mb-1">Careers & Talent</h4>
                <a href="mailto:careers@purplebluehouse.com" className="text-white/50 hover:text-white transition-colors text-sm">careers@purplebluehouse.com</a>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-light mb-10">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {[
              { q: "Do you take on execution-only projects?", a: "Rarely. We believe execution without strategy is a waste of capital. We prefer to build the system first, then execute it." },
              { q: "What is your typical project timeline?", a: "Brand identity and strategy projects typically run 6-12 weeks. End-to-end ecosystems take 3-5 months." },
              { q: "Do you work with startups?", a: "Yes. We frequently partner with seed and Series A founders to build their foundational GTM narrative and identity." }
            ].map((faq, i) => (
              <div key={i} className="border-b border-white/10 pb-6">
                <h4 className="text-lg font-medium text-white mb-2">{faq.q}</h4>
                <p className="text-white/50 font-light text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);

const AdminDashboard = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-[#05050A] text-[#F4F4F5] pt-32 pb-24 px-[3%] w-full text-left">
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
const Footer = ({ navigate }) => {
  return (
    <footer className="relative bg-[#05050A] border-t border-white/[0.06] px-[3%] py-16 text-white">
      <div className="grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="text-lg font-medium mb-4">PurpleBlue House</div>
          <p className="max-w-md text-sm text-white/45 leading-relaxed font-light">
            Strategic brand systems, storytelling, campaign thinking, and design-led consulting for brands that need clarity before execution.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/35 mb-5">Explore</h4>
          <div className="space-y-3 text-sm text-white/55">
            <button onClick={() => navigate('work')} className="block hover:text-white transition-colors">Work</button>
            <button onClick={() => navigate('services')} className="block hover:text-white transition-colors">Services</button>
            <button onClick={() => navigate('method')} className="block hover:text-white transition-colors">Method</button>
            <button onClick={() => navigate('about')} className="block hover:text-white transition-colors">About</button>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/35 mb-5">Start</h4>
          <button
            onClick={() => navigate('assessment')}
            className="text-sm text-white/55 hover:text-white transition-colors"
          >
            Build My Brand Scope
          </button>
        </div>
      </div>

      <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between gap-4 text-xs text-white/30">
        <span>© {new Date().getFullYear()} PurpleBlue House. All rights reserved.</span>
        <span>Built for clarity, restraint, and strategic brand execution.</span>
      </div>
    </footer>
  );
};
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
        </AnimatePresence>
      </main>

      {routeState.page !== 'admin' && routeState.page !== 'assessment' && <Footer navigate={navigate} />}
    </div>
  );
}
