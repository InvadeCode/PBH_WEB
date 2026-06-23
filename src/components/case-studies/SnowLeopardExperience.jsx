import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import createGlobe from 'cobe';
import CaseStudyVideoHero from './CaseStudyVideoHero';

// --- PLANETARY SWARM COMPONENT (World Map Background, Full Screen, Tap to cycle) ---
const PlanetarySwarm = ({ images, currentAssetIndex, setCurrentAssetIndex }) => {

  return (
    <div className="w-[100vw] relative left-1/2 -translate-x-1/2 mt-32 z-20">
      
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Global Reach</h2>
        <div className="w-12 h-[1px] bg-white/30 mx-auto" />
      </div>

      <div 
        onClick={() => setCurrentAssetIndex(prev => (prev + 1) % images.length)}
        className="w-full h-[100vh] relative bg-[#0A0514] overflow-hidden border-t border-b border-white/5 shadow-2xl flex items-center justify-center cursor-pointer group"
      >
        {/* SciArt HUD Architectural Grid & Radar Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#22d3ee05_1px,transparent_1px),linear-gradient(to_bottom,#22d3ee05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(34,211,238,0.02)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none" />

        {/* World Map Background (SciArt Glowing Edition) */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')",
            backgroundSize: '90%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            // Turn black map white, then tint it cyan/blue with a massive glow drop-shadow
            filter: 'invert(1) sepia(1) hue-rotate(180deg) saturate(5) opacity(0.15) drop-shadow(0 0 30px rgba(34,211,238,0.6))'
          }}
        />

        {/* Ambient Core Energy Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none" />

        {/* The Orbiting Image Nodes */}
        {images.map((img, i) => {
          const isActive = i === currentAssetIndex;
          
          // Calculate elliptical orbital positions across the full width screen
          const angle = (i / images.length) * Math.PI * 2;
          const radiusX = 35 + (i % 3) * 10; // X spread (35% to 55% from center)
          const radiusY = 25 + (i % 3) * 10; // Y spread (25% to 45% from center)
          const swarmX = `calc(50% + ${Math.cos(angle) * radiusX}%)`;
          const swarmY = `calc(50% + ${Math.sin(angle) * radiusY}%)`;

          return (
            <motion.div
              key={img}
              layout
              initial={false}
              animate={{
                left: isActive ? '50%' : swarmX,
                top: isActive ? '50%' : swarmY,
                x: '-50%',
                y: '-50%',
                scale: isActive ? 1 : 0.4,
                opacity: isActive ? 1 : 0.4,
                filter: isActive ? 'blur(0px)' : 'blur(5px)',
                zIndex: isActive ? 50 : 10,
                rotateZ: isActive ? 0 : (i % 2 === 0 ? 5 : -5)
              }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 15,
                mass: 1.2,
              }}
              className={`absolute overflow-hidden ${isActive ? 'p-4 bg-black/60 backdrop-blur-3xl rounded-2xl border border-white/20 shadow-2xl' : 'bg-transparent border border-white/10 rounded-lg'}`}
              style={{
                 // Guaranteed not to crop when active!
                 width: isActive ? 'auto' : '200px',
                 height: isActive ? 'auto' : 'auto',
                 maxWidth: isActive ? '80vw' : '200px',
                 maxHeight: isActive ? '75vh' : '200px',
              }}
            >
              <img 
                 src={img} 
                 alt={`Memory Node ${i}`}
                 className={`w-full h-full object-contain ${isActive ? 'max-h-[70vh] rounded-xl drop-shadow-2xl' : 'rounded-md opacity-80 mix-blend-screen'}`} 
                 draggable="false"
              />
            </motion.div>
          );
        })}

        {/* Click to Cycle Hint */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-black/50 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Tap to cycle planetary nodes</span>
           <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
// --- SVG CONNECTION PATH ---
// Draws a glowing bezier curve between points when scrolled into view
const FlowConnection = ({ d }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10%", once: true });

  return (
    <g ref={ref}>
      {/* Base faint line */}
      <path d={d} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      {/* Animated glowing line */}
      <motion.path
        d={d}
        fill="none"
        stroke="url(#glowGradient)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ filter: 'drop-shadow(0 0 8px rgba(200,100,255,0.8))' }}
      />
      {/* Flowing particle */}
      {isInView && (
        <motion.circle r="3" fill="#fff" style={{ filter: 'drop-shadow(0 0 10px #fff)' }}>
          <animateMotion dur="3s" repeatCount="indefinite" path={d} />
        </motion.circle>
      )}
    </g>
  );
};

// --- BENTO DASHBOARD LAYOUT ---
const SnowLeopardExperience = ({ navigate, project }) => {
  const images = (project.fullStory?.images || []).map(img => 
    typeof img === 'string' ? img : (img.url || img.imageUrl || img)
  ).filter(Boolean);

  const heroImage = project.bannerImage || project.fullStory?.heroImg || project.imageUrl;

  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);

  const { scrollYProgress } = useScroll();
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, 400]);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentAssetIndex((prev) => (prev + 1) % images.length);
    }, 4500); // Cycles every 4.5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const content = {
    about: project.client === 'Snow Leopard Trust' 
      ? "Snow Leopard Trust is a global conservation organisation working to protect snow leopards and the fragile mountain ecosystems they inhabit. Its work extends beyond species protection, addressing the interdependence of wildlife, climate, water systems, and mountain communities across some of the world's most remote regions."
      : (project.overview || project.challenge || "Information not available."),
    problem: project.client === 'Snow Leopard Trust' 
      ? "While Snow Leopard Trust had strong credibility and impact on the ground, its digital presence was largely centred around awareness moments tied to key calendar days. The opportunity was to move beyond event-led visibility and build a clear, participatory brand narrative, one that could engage younger audiences, mobilise institutions, and translate conservation from a distant cause into a shared, actionable responsibility."
      : (project.fullStory?.challenge || project.challenge || "Challenge information not available."),
    solution1: project.client === 'Snow Leopard Trust'
      ? "We repositioned how Snow Leopard Trust shows up digitally, shifting from moment-led awareness to a participatory, ecosystem-driven brand narrative. Our work combined content strategy, science communication, design, messaging architecture, and community participation, translating complex conservation science into clear, action-oriented storytelling."
      : (project.fullStory?.strategy || project.solution || "Strategy information not available."),
    solution2: project.client === 'Snow Leopard Trust'
      ? "At the core was #23for23, a Snow Leopard Day campaign built on low-barrier participation. The campaign activated a diverse coalition of stakeholders, governments, multilateral institutions, conservation bodies, armed forces personnel, wildlife experts, and public voices, driving meaningful cross-border engagement. Amplification from the Ministry of Environment, Forest and Climate Change (India), Press Information Bureau (India), the United Nations, and UN Environment Programme (UNEP) anchored the narrative within global policy and climate conversations."
      : (project.fullStory?.execution || ""),
    nodeA: project.client === 'Snow Leopard Trust'
      ? "The narrative travelled across South Asia, Central Asia, Europe, and the UK, with engagement from the Governments of Kyrgyzstan and Bhutan, the Embassy of India in Bishkek, and the UK Embassy in Mongolia, alongside conservation organisations including NABU (Germany), WWF Mongolia, and the Global Snow Leopard & Ecosystem Protection Program."
      : (project.fullStory?.stats && project.fullStory.stats[0] ? `${project.fullStory.stats[0].label}: ${project.fullStory.stats[0].val}` : "Strategic deployment across touchpoints."),
    nodeB: project.client === 'Snow Leopard Trust'
      ? "Cultural voices such as Dia Mirza and Jubin Nautiyal helped bridge institutional authority with public participation."
      : (project.fullStory?.stats && project.fullStory.stats[1] ? `${project.fullStory.stats[1].label}: ${project.fullStory.stats[1].val}` : "Meaningful engagement and amplification."),
    outcome: project.client === 'Snow Leopard Trust'
      ? "Through human-centred design and responsible science communication, we moved away from crisis-led messaging toward conservation as an everyday practice, expanding the story from species protection to the mountain ecosystem as a living system, and building a cohesive digital presence that sustains relevance beyond campaign moments."
      : (project.results?.join(' ') || "Successful project delivery.")
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#0A0514] text-[#F4F4F5] font-primary selection:bg-purple-500/30">
      
      {/* --- AMBIENT MESH GRADIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: ['-10%', '10%', '-10%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-purple-900/40 mix-blend-screen blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], y: ['-10%', '20%', '-10%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/30 mix-blend-screen blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: ['20%', '-20%', '20%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-blue-500/20 mix-blend-screen blur-[100px]" 
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* --- NAVIGATION --- */}
      <div className="fixed top-8 left-8 z-50">
        <button onClick={() => navigate('work')} className="text-white/60 hover:text-white flex items-center gap-2 text-sm backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10">
          <ArrowLeft className="w-4 h-4" /> Exit Environment
        </button>
      </div>

      {/* --- TIGHT BENTO DASHBOARD --- */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-4 md:px-8 py-24 flex flex-col gap-6">

        {/* ROW 1: HERO (Main Character) */}
        <div className="w-full min-h-[60vh] md:min-h-[70vh] relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(129,140,248,0.2)] flex flex-col justify-between">
          {heroImage && (
            <div className="absolute inset-0 z-0">
              <motion.img 
                initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: "easeOut" }}
                src={heroImage} alt="Hero" className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0514] via-[#0A0514]/40 to-transparent" />
            </div>
          )}
          <div className="relative z-10 w-full p-6 md:p-10 flex justify-between items-start">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
              <h1 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-white">{project.client}</h1>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 hidden md:block">
              <span className="text-[10px] uppercase tracking-widest text-white/70">{project.sector || "Conservation"}</span>
            </motion.div>
          </div>
          
          <div className="relative z-10 w-full p-6 md:p-10 flex flex-col items-end justify-end">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl max-w-xl shadow-2xl">
              <p className="text-sm md:text-base text-white/90 leading-relaxed font-secondary">{content.about}</p>
            </motion.div>
          </div>
        </div>

        {/* ROW 2: CHALLENGE & STRATEGY (Cinematic Parallax Typography) */}
        <div className="w-full mt-40 relative z-20 flex flex-col gap-40 md:gap-64 px-4 md:px-0">
          
          {/* Challenge Parallax Node */}
          <div className="relative w-full min-h-[50vh] flex items-center">
            {/* Massive Parallax Watermark */}
            <motion.div 
               style={{ y: parallaxY1 }}
               className="absolute left-[-5%] md:left-[-10%] top-[-20%] text-[12vw] font-serif font-bold text-white/[0.03] leading-none whitespace-nowrap pointer-events-none uppercase tracking-tighter"
            >
               Challenge
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20%", once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-2xl pl-8 md:pl-16 border-l-[1px] border-cyan-500/50"
            >
              <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.5em] text-cyan-400 mb-12 flex items-center gap-4">
                 <span className="w-8 h-[1px] bg-cyan-400/50" />
                 Context
              </h3>
              <p className="text-xl md:text-2xl lg:text-3xl font-serif text-white leading-[1.6] tracking-tight drop-shadow-2xl">
                {content.problem}
              </p>
            </motion.div>
          </div>

          {/* Strategic Shift Parallax Node */}
          <div className="relative w-full min-h-[50vh] flex items-center justify-end mt-16 md:mt-32">
            <motion.div 
               style={{ y: parallaxY2 }}
               className="absolute right-[-5%] md:right-[-10%] top-[-20%] text-[12vw] font-serif font-bold text-white/[0.03] leading-none whitespace-nowrap pointer-events-none uppercase tracking-tighter"
            >
               Evolution
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20%", once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-4xl pr-8 md:pr-16 border-r-[1px] border-indigo-500/50 text-right"
            >
              <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.5em] text-indigo-400 mb-12 flex items-center justify-end gap-4">
                 Strategic Shift
                 <span className="w-8 h-[1px] bg-indigo-400/50" />
              </h3>
              <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-white leading-[1.3] mb-8 tracking-tight drop-shadow-2xl">
                {content.solution1}
              </p>
              <p className="text-base md:text-lg font-secondary text-white/60 leading-relaxed font-light max-w-2xl ml-auto">
                {content.solution2}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ROW 3: SATELLITES (Editorial Grid) */}
        <div className="w-full mt-40 mb-20 relative z-20">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
              
              {/* Massive 01 / 02 typography acting as dividers */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ margin: "-20%", once: true }}
                transition={{ duration: 1.5 }}
                className="col-span-1 lg:col-span-5 flex flex-col justify-center border-t border-white/10 pt-12"
              >
                 <div className="flex items-baseline gap-6 mb-6">
                    <span className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-transparent opacity-80 drop-shadow-2xl">01</span>
                    <h4 className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-white/80">Institutional Reach</h4>
                 </div>
                 <p className="text-sm md:text-base text-white/60 font-secondary leading-relaxed font-light">{content.nodeA}</p>
              </motion.div>

              <div className="hidden lg:block col-span-1 lg:col-span-2 flex justify-center">
                 <div className="w-[1px] h-64 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ margin: "-20%", once: true }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="col-span-1 lg:col-span-5 flex flex-col justify-center border-t border-white/10 pt-12 lg:mt-32"
              >
                 <div className="flex items-baseline gap-6 mb-6">
                    <span className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-transparent opacity-80 drop-shadow-2xl">02</span>
                    <h4 className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-white/80">Cultural Voices</h4>
                 </div>
                 <p className="text-sm md:text-base text-white/60 font-secondary leading-relaxed font-light">{content.nodeB}</p>
              </motion.div>
           </div>
        </div>

        {/* ROW 4: INTERACTIVE 3D GLOBE ARCHIVE */}
        {images.length > 0 && (
          <PlanetarySwarm 
            images={images} 
            currentAssetIndex={currentAssetIndex} 
            setCurrentAssetIndex={setCurrentAssetIndex} 
          />
        )}

        {/* ── CINEMATIC VIDEO HERO ── */}
        {(() => {
          const hasVideoHero = project?.videoHero?.enabled;
          const hasVideoSection = project?.videoSection?.videoUrl || project?.videoSection?.videoFileUrl;
          
          if (!hasVideoHero && !hasVideoSection) return null;
          
          const videoData = hasVideoHero ? project.videoHero : {
            enabled: true,
            backgroundColor: '#0A0514', // Match SnowLeopard bg
            backgroundText: project.client || 'Case Study',
            videoTitle: 'Watch Video',
            videoSubtitle: 'Experience the story in motion.',
            embedUrl: project.videoSection?.videoUrl,
            uploadedVideoUrl: project.videoSection?.videoFileUrl,
            thumbnailUrl: null
          };
          
          return <CaseStudyVideoHero videoHero={videoData} fallbackName={project.client} />;
        })()}

        {/* ROW 5: OUTCOME */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ margin: "-20%", once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full text-center mt-40 mb-32 relative z-20"
        >
          <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-white/30 mx-auto mb-12" />
          <h3 className="text-2xl md:text-4xl font-serif text-white mb-6 leading-tight max-w-4xl mx-auto drop-shadow-2xl">
            Conservation as an Everyday Practice
          </h3>
          <p className="text-base md:text-lg text-white/70 font-secondary max-w-3xl mx-auto leading-relaxed font-light">
            {content.outcome}
          </p>
          <div className="w-[1px] h-24 bg-gradient-to-t from-transparent to-white/30 mx-auto mt-12" />
        </motion.div>

      </div>
    </div>
  );
};

export default SnowLeopardExperience;
