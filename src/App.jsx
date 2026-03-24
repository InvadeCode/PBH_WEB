import React, { useState, useEffect } from 'react';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    let completed = false; // strict guard to prevent any loops

    const timer = setInterval(() => {
      if (completed) return;
      const elapsed = Date.now() - startTime;
      let newProgress = 0;

      if (elapsed < 600) {
        // 1. Fast to 12%
        newProgress = (elapsed / 600) * 12;
      } else if (elapsed < 1600) {
        // 2. Stuck at 12% for 1 second
        newProgress = 12;
      } else if (elapsed < 2400) {
        // 3. Whoosh to 99%
        const p = (elapsed - 1600) / 800;
        // easeOutCubic function for the whoosh effect
        const easeOut = 1 - Math.pow(1 - p, 3);
        newProgress = 12 + (easeOut * 87);
      } else if (elapsed < 3600) {
        // 4. Stuck at 99% for 1.2 seconds
        newProgress = 99;
      } else if (elapsed < 3800) {
        // 5. Final jump to 100%
        newProgress = 100;
      } else {
        newProgress = 100;
        completed = true;
        clearInterval(timer);
        setTimeout(() => onComplete(), 100);
      }
      
      setProgress(Math.min(newProgress, 100));
    }, 16); // Run at ~60fps for buttery smooth numbers

    return () => clearInterval(timer);
  }, [onComplete]); // Empty dependency array mathematically guarantees it only runs once

  return (
    <div className="absolute inset-0 bg-neutral-50 flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Background Fill loading from bottom to top */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-neutral-200"
        style={{ height: `${progress}%` }}
      ></div>

      <div className="relative z-10 w-full max-w-4xl px-8 flex flex-col items-center text-center">
        {/* Massive Percentage Counter - Thinned out to 15% weight */}
        <div className="text-[120px] md:text-[180px] font-thin text-neutral-800 tracking-tighter leading-none mb-12 drop-shadow-sm">
          {Math.floor(progress)}<span className="text-[60px] md:text-[90px] font-thin text-neutral-400">%</span>
        </div>

        {/* Lo-Fi Placeholder Text Bars matching the main site aesthetic */}
        <div className="flex flex-col items-center gap-3 md:gap-4 w-full max-w-md opacity-60">
          <div className="w-full h-4 md:h-5 bg-neutral-400 rounded-xl"></div>
          <div className="w-10/12 h-4 md:h-5 bg-neutral-400 rounded-xl"></div>
          <div className="w-4/5 h-4 md:h-5 bg-neutral-400 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

const HeroDataGrid = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMove = (clientX, clientY, currentTarget) => {
    const rect = currentTarget.getBoundingClientRect();
    setMousePos({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  };

  return (
    <div
      className="w-full h-[300px] md:h-[400px] xl:h-[500px] bg-white border border-neutral-200 rounded-xl relative overflow-hidden flex items-end p-4 md:p-8 group cursor-crosshair shadow-sm touch-none"
      onMouseMove={(e) => handleMove(e.clientX, e.clientY, e.currentTarget)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget)}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={() => setIsHovering(false)}
    >
      <div className="absolute inset-0 opacity-50 bg-[linear-gradient(90deg,#e5e5e5_1px,transparent_1px),linear-gradient(180deg,#e5e5e5_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px]"></div>

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 bg-[linear-gradient(90deg,#a3a3a3_1px,transparent_1px),linear-gradient(180deg,#a3a3a3_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px]"
        style={{
          opacity: isHovering ? 0.3 : 0,
          maskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`
        }}
      ></div>

      <div
        className="absolute top-0 bottom-0 border-l border-neutral-400 border-dashed pointer-events-none transition-opacity duration-300"
        style={{ left: mousePos.x, opacity: isHovering ? 0.4 : 0 }}
      ></div>
      <div
        className="absolute left-0 right-0 border-t border-neutral-400 border-dashed pointer-events-none transition-opacity duration-300"
        style={{ top: mousePos.y, opacity: isHovering ? 0.4 : 0 }}
      ></div>

      <div className="relative z-10 w-full md:w-[400px] h-32 md:h-36 bg-white border border-neutral-200 p-5 md:p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center transition-transform duration-500 md:group-hover:-translate-y-2">
        <div className="flex justify-between items-center mb-6">
          <div className="w-24 md:w-32 h-5 bg-neutral-400 rounded-xl"></div>
          <div className="w-6 h-6 border-2 border-neutral-200 rounded-xl"></div>
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-xl mb-3"></div>
        <div className="w-2/3 h-2 bg-neutral-200 rounded-xl"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-300 z-10"></div>
    </div>
  );
};

const InteractiveMap = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const nodes = [
    { id: 1, top: '30%', left: '20%' },
    { id: 2, top: '40%', left: '45%' },
    { id: 3, top: '70%', left: '35%' },
    { id: 4, top: '50%', left: '75%' },
    { id: 5, top: '20%', left: '60%' },
  ];

  return (
    <div className="relative w-full h-[300px] md:h-[500px] bg-white rounded-xl border border-neutral-200 overflow-hidden group shadow-sm touch-none">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_#d4d4d4_2px,_transparent_2px)] bg-[size:30px_30px] md:bg-[size:40px_40px]"></div>
      
      <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 150 Q 150 100 250 200 T 500 150" fill="transparent" stroke={hoveredNode ? "#e5e5e5" : "#d4d4d4"} strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite] transition-colors duration-500 md:hidden" />
        <path d="M 100 250 Q 300 150 500 300 T 1000 200" fill="transparent" stroke={hoveredNode ? "#e5e5e5" : "#d4d4d4"} strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite] transition-colors duration-500 hidden md:block" />
        <path d="M 200 400 Q 600 500 800 150" fill="transparent" stroke={hoveredNode ? "#e5e5e5" : "#d4d4d4"} strokeWidth="2" className="transition-colors duration-500 hidden md:block" />
      </svg>

      {nodes.map((pos) => (
        <div
          key={pos.id}
          className="absolute w-5 h-5 md:w-6 md:h-6 -ml-2.5 -mt-2.5 md:-ml-3 md:-mt-3 rounded-full bg-neutral-300 hover:bg-neutral-400 border-[3px] md:border-4 border-white shadow-sm cursor-pointer transition-all duration-300 hover:scale-125 z-10"
          style={{ top: pos.top, left: pos.left }}
          onMouseEnter={() => setHoveredNode(pos.id)}
          onMouseLeave={() => setHoveredNode(null)}
          onTouchStart={() => setHoveredNode(pos.id)}
        >
          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-neutral-200 p-2 md:p-3 rounded-xl shadow-sm flex flex-col gap-1.5 md:gap-2 w-24 md:w-32 transition-all duration-300 ${hoveredNode === pos.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <div className="w-12 md:w-16 h-2 md:h-3 bg-neutral-400 rounded-xl"></div>
            <div className="w-full h-1.5 md:h-2 bg-neutral-200 rounded-xl"></div>
            <div className="w-3/4 h-1.5 md:h-2 bg-neutral-200 rounded-xl"></div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white border border-neutral-200 p-3 md:p-5 rounded-xl shadow-sm pointer-events-none">
        <div className="w-24 md:w-32 h-2 md:h-3 bg-neutral-300 rounded-xl mb-3 md:mb-4"></div>
        <div className="flex flex-col gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-3"><div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-neutral-300"></div><div className="w-16 md:w-20 h-1.5 md:h-2 bg-neutral-200 rounded-xl"></div></div>
          <div className="flex items-center gap-2 md:gap-3"><div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-neutral-200"></div><div className="w-12 md:w-16 h-1.5 md:h-2 bg-neutral-100 rounded-xl"></div></div>
        </div>
      </div>
    </div>
  );
};

const InteractiveBarChart = () => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const data = [40, 70, 45, 90, 65, 30, 80, 55, 100, 60, 20, 85];

  return (
    <div className="flex-1 flex items-end gap-2 md:gap-4 pt-4 relative w-full touch-none">
      {hoveredBar !== null && (
        <div
          className="absolute left-0 right-0 border-t border-neutral-300 border-dashed pointer-events-none transition-all duration-300 z-0"
          style={{ bottom: `${data[hoveredBar]}%` }}
        ></div>
      )}
      {data.map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-xl transition-all duration-300 cursor-pointer relative z-10 ${hoveredBar === i ? 'bg-neutral-400 scale-y-105 origin-bottom' : 'bg-neutral-200 hover:bg-neutral-300'}`}
          style={{ height: `${h}%` }}
          onMouseEnter={() => setHoveredBar(i)}
          onMouseLeave={() => setHoveredBar(null)}
          onTouchStart={() => setHoveredBar(i)}
        >
          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-neutral-200 p-1.5 md:p-2 rounded-xl shadow-sm transition-all duration-300 flex flex-col items-center gap-1.5 ${hoveredBar === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <div className="w-6 md:w-8 h-2 md:h-2.5 bg-neutral-400 rounded-xl"></div>
            <div className="w-4 md:w-5 h-1 md:h-1.5 bg-neutral-200 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const InteractiveLineChart = () => {
  const [hoverX, setHoverX] = useState(null);
  const points = [20, 45, 30, 60, 40, 80, 55, 90];
  
  return (
    <div 
      className="flex-1 relative w-full h-full touch-none border-b border-l border-neutral-200 overflow-hidden"
      onMouseLeave={() => setHoverX(null)}
      onTouchEnd={() => setHoverX(null)}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 100" preserveAspectRatio="none">
        <path 
          d="M 0,80 C 100,55 200,70 300,40 C 400,60 500,20 600,45 C 700,10 800,10" 
          vectorEffect="non-scaling-stroke"
          fill="transparent" 
          stroke="#d4d4d4" 
          strokeWidth="3" 
        />
      </svg>
      <div className="absolute inset-0 flex justify-between">
        {points.map((val, i) => (
          <div 
            key={i} 
            className="h-full flex-1 relative cursor-crosshair group"
            onMouseEnter={() => setHoverX(i)}
            onTouchStart={() => setHoverX(i)}
          >
            <div className={`absolute left-1/2 top-0 bottom-0 w-px bg-neutral-300 transition-opacity duration-200 ${hoverX === i ? 'opacity-100' : 'opacity-0'}`}></div>
            <div 
              className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white bg-neutral-400 shadow-md transition-all duration-300 ${hoverX === i ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
              style={{ top: `${100 - val}%` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [activeRationale, setActiveRationale] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    document.title = "IIT Delhi LoFI Wireframe";
  }, []);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    // Allow animation to complete before removing from DOM
    setTimeout(() => {
      setShowPreloader(false);
    }, 800);
  };

  const rationales = {
    hero: {
      title: "01. Hero Section",
      whyExists: "To immediately establish the apex authority and comprehensive scope of the IIT Delhi Centre of Excellence in Regulatory Affairs (CoE RA). In the fast-evolving power sector, stakeholders require instant reassurance that they are accessing verified, institution-grade intelligence. This section serves as the digital front door, instantly validating our mandate to shape national regulatory frameworks.",
      whyHere: "This is the 3-second hook to show stakeholders, policymakers, and academics they are looking at the apex regulatory research body. Without immediate clarity of the CoE RA's mandate, users bounce."
    },
    partners: {
      title: "02. Trusted Partners Strip",
      whyExists: "To borrow and amplify credibility through strategic association with key government bodies, industry leaders, and elite academic peers. Demonstrating a robust network of trust validates the CoE RA as the central node of regulatory innovation, bridging the gap between academia and practical policy implementation.",
      whyHere: "Showing who trusts the IIT Delhi CoE RA validates the institution instantly. Placing this directly below the hero builds unshakable trust before users dive into complex regulatory data."
    },
    pillars: {
      title: "03. Core Pillars / Focus Areas",
      whyExists: "To systematically categorize the massive, complex regulatory mandate of the IIT Delhi CoE RA into actionable and navigable domains. Policymakers and researchers arrive with specific agendas; this structural breakdown ensures they immediately find their relevant focus areas, such as Grid Modernization or Market Design, without cognitive overload.",
      whyHere: "Now that trust is established, users are ready to understand the scope. This categorizes your research into digestible focus areas for easy navigation."
    },
    about: {
      title: "04. About / Institutional Relevance",
      whyExists: "To provide the historical context, intellectual foundation, and deeper national mission driving the IIT Delhi CoE RA. It shifts the narrative from 'what we do' to 'why our work is critically important for the future of India's energy security and market equity.'",
      whyHere: "Placing this after the hero and pillars ensures users have bought into the core value before reading the longer institutional narrative. It perfectly bridges the gap to hard metrics."
    },
    impact: {
      title: "05. Metrics / Impact",
      whyExists: "To provide irrefutable, objective, and quantifiable proof of the IIT Delhi CoE RA's systemic interventions in the power sector. It replaces qualitative claims with hard numbers, proving the tangible footprint of the institution's advisory and research outputs.",
      whyHere: "Subjective storytelling must be immediately backed up by hard data (e.g., papers published, policies drafted). Narrative plus hard numbers equals institutional authority."
    },
    map: {
      title: "06. Interactive Regional Impact Map",
      whyExists: "To geographically visualize the physical and jurisdictional reach of the IIT Delhi CoE RA across state grids and national policy arenas. It proves that the institution's work transcends theoretical models and physically impacts national infrastructure.",
      whyHere: "Follows impact metrics to ground those abstract numbers in geographical reality. It proves the CoE's influence across regional grids and state policies."
    },
    data: {
      title: "07. Featured Data & Analytics Preview",
      whyExists: "To publicly flex the high-end computational and analytical capabilities of the IIT Delhi CoE RA. By previewing interactive datasets, it proves the institution possesses the rigorous technological infrastructure required to manage complex modern power systems.",
      whyHere: "It shows, rather than tells, the technical rigor of IIT Delhi. Placed after the metrics, it visually demonstrates the advanced models used to generate that impact."
    },
    projects: {
      title: "08. Active Projects & Sandboxes",
      whyExists: "To demonstrate that the IIT Delhi CoE RA is actively testing live regulatory sandboxes and deploying pilot projects. This confirms the institution is dynamically shaping future policy rather than just analyzing past data in a static academic vacuum.",
      whyHere: "Proves the Centre is implementing pilot projects in the real world. It bridges the gap between theoretical data modeling and the final published academic research."
    },
    research: {
      title: "09. Latest Research / Knowledge Hub",
      whyExists: "To distribute the primary intellectual payload of the IIT Delhi CoE RA. This acts as the central dissemination point for peer-reviewed papers, policy briefs, and working models that fundamentally influence market design and regulatory directives.",
      whyHere: "Placed in the exact middle of the page. The user has been educated on capabilities and scale. Their cognitive load is now primed for deep, peer-reviewed regulatory literature."
    },
    archive: {
      title: "10. Policy Archive & Database",
      whyExists: "To offer a comprehensive, utilitarian search interface for researchers, legal teams, and policymakers requiring historical continuity. It ensures the vast intellectual property of the IIT Delhi CoE RA remains highly accessible and systematically indexed.",
      whyHere: "Sits immediately after 'Latest Research' to offer the deep-dive functionality for users who want to search beyond the recent highlights."
    },
    events: {
      title: "11. Upcoming Events & Webinars",
      whyExists: "To showcase the IIT Delhi CoE RA as a vibrant, convening power within the energy sector. It highlights ongoing symposiums and stakeholder consultations, transitioning the user from passive consumption of research to active participation in policy discourse.",
      whyHere: "Flows naturally from the Research section. The progression is seamless: 'You just read our policy paper, now come attend the national symposium about it'."
    },
    experts: {
      title: "12. Our Experts & Leadership",
      whyExists: "To attach faces and formidable academic pedigrees to the regulatory data. By showcasing the prestigious IIT Delhi faculty and industry veterans leading the CoE, it humanizes the institution while simultaneously reinforcing its elite intellectual capital.",
      whyHere: "In regulatory spaces, institutional weight matters more initially than individual faces. Once the institution is trusted, revealing the elite team seals the deal."
    },
    fellowships: {
      title: "13. Fellowships & Grants",
      whyExists: "To secure the future pipeline of regulatory thought leaders. By advertising grants and fellowships, the CoE RA positions itself as an incubator for top-tier academic talent, ensuring continuous, high-quality research output.",
      whyHere: "Strategically placed right after 'Our Experts' so prospective applicants, scholars, and post-docs see the caliber of mentorship available before they apply."
    },
    testimonials: {
      title: "14. Ecosystem Voices / Testimonials",
      whyExists: "To deliver high-impact peer validation from external energy sector titans, grid operators, and regulatory commissioners. This external advocacy acts as the ultimate trust multiplier, proving that the industry actively relies on the CoE RA's guidance.",
      whyHere: "A powerful trust multiplier placed after the team. It tells visitors: 'Don't just take our word that our faculty is great—look at what national grid operators say about us'."
    },
    media: {
      title: "15. In the Media / Press",
      whyExists: "To aggregate third-party validation from authoritative news and policy media platforms. Public relations visibility reinforces the national relevance of the CoE RA, assuring stakeholders that its interventions are shaping mainstream industry narratives.",
      whyHere: "Pairs perfectly with industry testimonials to provide a complete, 360-degree credibility wrap-up regarding the CoE RA's policy interventions."
    },
    news: {
      title: "16. News & Announcements",
      whyExists: "To serve as a recency indicator, proving the IIT Delhi CoE RA is highly active in the current policy cycle. It broadcasts immediate institutional updates, MOUs, and rapid responses to sudden regulatory shifts in the broader market.",
      whyHere: "Placed lower because it's secondary to evergreen academic research, but absolutely vital for journalists and current stakeholders."
    },
    cta: {
      title: "17. Final Call To Action",
      whyExists: "To capture high-intent users who have completed the digital journey. This is the ultimate conversion net, designed to turn convinced stakeholders into active subscribers, collaborative partners, or policy consults for the CoE RA.",
      whyHere: "Placed at the absolute end of the psychological journey. The user has seen the mandate, the proof, the team, and peer validation. They are at peak readiness to subscribe or collaborate."
    },
    footer: {
      title: "18. Footer / Directory",
      whyExists: "To provide the essential utilitarian architectural anchor for the entire platform. It houses critical compliance data, exhaustive directory links, and legal frameworks, ensuring the complex IIT Delhi CoE RA ecosystem remains fully navigable.",
      whyHere: "Standard UX practice. It sits at the bottom to catch users who bypassed the narrative journey looking for specific institutional links (compliance, faculty directory, legal)."
    }
  };

  const SectionHeader = ({ id, dark = false }) => (
    <div className="mb-8 md:mb-12 relative z-20">
      <button
        onClick={() => setActiveRationale(activeRationale === id ? null : id)}
        className={`group flex flex-col md:flex-row md:items-center justify-between gap-3 w-full text-left pb-4 border-b transition-colors duration-300 ${dark ? 'border-neutral-700 hover:border-neutral-500' : 'border-neutral-200 hover:border-neutral-300'}`}
      >
        <h2 className={`text-[11px] md:text-[12px] font-bold uppercase tracking-widest transition-colors duration-300 ${dark ? 'text-neutral-300 group-hover:text-white' : 'text-neutral-400 group-hover:text-neutral-600'}`}>
          {rationales[id].title}
        </h2>
        <div className={`px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-bold tracking-wider transition-all duration-500 flex items-center gap-1 w-fit ${
          activeRationale === id 
            ? (dark ? 'bg-white text-neutral-900' : 'bg-neutral-800 text-white')
            : (dark ? 'bg-neutral-800 text-neutral-400 group-hover:bg-neutral-600' : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200 group-hover:text-neutral-700')
        }`}>
          {activeRationale === id ? 'Close Rationale ✕' : 'Why is this here?'}
        </div>
      </button>

      {/* BULLETPROOF ANIMATION USING MAX-HEIGHT */}
      <div 
        className="transition-all duration-[600ms] ease-in-out overflow-hidden"
        style={{
          maxHeight: activeRationale === id ? '600px' : '0px',
          opacity: activeRationale === id ? 1 : 0
        }}
      >
        <div className="pt-4 pb-2 md:pt-6">
          <div className={`p-6 md:p-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border transform transition-all duration-[600ms] ease-out ${
            activeRationale === id ? 'translate-y-0' : '-translate-y-6'
          } ${dark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}`}>
            <div className="grid md:grid-cols-2 gap-6 md:gap-10">
              <div className={`transform transition-all duration-[600ms] delay-100 ${activeRationale === id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <h4 className={`text-[10px] uppercase tracking-widest font-bold mb-2 md:mb-3 ${dark ? 'text-neutral-400' : 'text-neutral-400'}`}>The Purpose</h4>
                <p className={`text-[11px] md:text-[12px] leading-relaxed font-medium ${dark ? 'text-neutral-200' : 'text-neutral-600'}`}>
                  {rationales[id].whyExists}
                </p>
              </div>
              <div className={`transform transition-all duration-[600ms] delay-200 ${activeRationale === id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <h4 className={`text-[10px] uppercase tracking-widest font-bold mb-2 md:mb-3 ${dark ? 'text-neutral-400' : 'text-neutral-400'}`}>The Strategic Placement</h4>
                <p className={`text-[11px] md:text-[12px] leading-relaxed font-medium ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {rationales[id].whyHere}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* UPDATED IMPORT TO INCLUDE WEIGHTS 100 (Thin) and 200 (Extra Light) */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }

        .bg-dot-pattern {
          background-image: radial-gradient(#e5e5e5 1px, transparent 1px);
          background-size: 24px 24px;
        }
        
        .bg-dot-pattern-dark {
          background-image: radial-gradient(#404040 1px, transparent 1px);
          background-size: 24px 24px;
        }

        @keyframes scan {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: scroll 30s linear infinite;
        }
        .hover-pause:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* --- PRELOADER --- */}
      {showPreloader && (
        <div className={`fixed inset-0 z-[9999] transition-opacity duration-700 ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <Preloader onComplete={handlePreloaderComplete} />
        </div>
      )}

      {/* MAIN APP CONTAINER */}
      <div className={`min-h-screen bg-neutral-50 bg-dot-pattern selection:bg-neutral-200 text-neutral-600 relative overflow-x-hidden transition-opacity duration-1000 ${isLoading ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white/90 pointer-events-none fixed"></div>

        <div className="relative z-10">
          {/* 0. Header */}
          <header className="sticky top-0 z-50 bg-white/90 border-b border-neutral-200 transition-all shadow-sm backdrop-blur-md">
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4 cursor-pointer group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-300 rounded-xl group-hover:bg-neutral-400 transition-colors duration-300 flex items-center justify-center">
                   <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-neutral-100 rounded-xl"></div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="w-24 md:w-32 h-2.5 md:h-3 bg-neutral-400 rounded-xl group-hover:bg-neutral-500 transition-colors duration-300"></div>
                  <div className="w-16 md:w-20 h-1.5 md:h-2 bg-neutral-200 rounded-xl"></div>
                </div>
              </div>
              <nav className="hidden lg:flex items-center gap-10">
                <ul className="flex gap-8">
                  {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <li key={idx} className="relative group p-2">
                      <div className="w-16 h-2 bg-neutral-200 group-hover:bg-neutral-400 rounded-xl transition-colors duration-300 cursor-pointer"></div>
                    </li>
                  ))}
                </ul>
                <div className="w-36 h-10 bg-neutral-400 hover:bg-neutral-500 rounded-xl transition-colors duration-300 cursor-pointer flex items-center justify-center border border-neutral-400">
                  <div className="w-16 h-2 bg-white rounded-xl"></div>
                </div>
              </nav>
              {/* Mobile Nav Toggle */}
              <div className="lg:hidden w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-col gap-1.5">
                 <div className="w-5 h-0.5 bg-neutral-400 rounded-xl"></div>
                 <div className="w-5 h-0.5 bg-neutral-400 rounded-xl"></div>
              </div>
            </div>
          </header>

          {/* 1. Hero Section */}
          <section className="relative pt-12 md:pt-16 pb-20 md:pb-24 border-b border-neutral-200 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-center">
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16 w-full">
              <SectionHeader id="hero" />
              
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mt-4 items-center">
                <div className="flex flex-col items-start w-full order-2 lg:order-1">
                  <div className="flex items-center gap-3 mb-6 md:mb-8 pl-4 border-l-4 border-neutral-400">
                    <div className="w-24 h-3 md:h-4 bg-neutral-200 rounded-xl"></div>
                  </div>
                  
                  <div className="w-full h-10 md:h-14 bg-neutral-400 rounded-xl mb-4"></div>
                  <div className="w-5/6 h-10 md:h-14 bg-neutral-400 rounded-xl mb-8 md:mb-10"></div>
                  
                  <div className="w-3/4 h-2 md:h-3 bg-neutral-200 rounded-xl mb-3 md:mb-4"></div>
                  <div className="w-2/3 h-2 md:h-3 bg-neutral-200 rounded-xl mb-3 md:mb-4"></div>
                  <div className="w-4/5 h-2 md:h-3 bg-neutral-200 rounded-xl mb-10 md:mb-12"></div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="w-full sm:w-48 h-12 bg-neutral-400 hover:bg-neutral-500 rounded-xl transition-colors duration-300 cursor-pointer border border-neutral-400 shadow-sm flex items-center justify-center gap-2">
                       <div className="w-20 h-2 bg-white rounded-xl"></div>
                    </div>
                    <div className="w-full sm:w-48 h-12 bg-white hover:bg-neutral-50 rounded-xl transition-colors duration-300 cursor-pointer border-2 border-neutral-200 shadow-sm flex items-center justify-center gap-2">
                       <div className="w-20 h-2 bg-neutral-300 rounded-xl"></div>
                    </div>
                  </div>
                </div>
                
                {/* Interactive Data Grid */}
                <div className="order-1 lg:order-2 w-full">
                  <HeroDataGrid />
                </div>
              </div>
            </div>
          </section>

          {/* 2. Trusted Partners Strip - LEFT ALIGNED MARQUEE */}
          <section className="border-y border-neutral-200/50 bg-neutral-50 py-10 md:py-16 overflow-hidden">
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16">
              <SectionHeader id="partners" />
            </div>
            {/* Scroller Container */}
            <div className="mt-8 flex w-full overflow-hidden">
              <div className="flex animate-marquee hover-pause whitespace-nowrap min-w-full">
                {/* First Set */}
                <div className="flex gap-10 md:gap-16 lg:gap-32 px-5 md:px-8 lg:px-16 items-center w-full justify-start">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={`set1-${i}`} className="w-24 md:w-32 h-6 md:h-8 bg-neutral-200 hover:bg-neutral-300 rounded-xl transition-colors duration-300 cursor-pointer flex-shrink-0"></div>
                  ))}
                </div>
                {/* Duplicate Set for Infinite Loop */}
                <div className="flex gap-10 md:gap-16 lg:gap-32 px-5 md:px-8 lg:px-16 items-center w-full justify-start">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={`set2-${i}`} className="w-24 md:w-32 h-6 md:h-8 bg-neutral-200 hover:bg-neutral-300 rounded-xl transition-colors duration-300 cursor-pointer flex-shrink-0"></div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3. Core Pillars / Services */}
          <section className="py-20 md:py-32 max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16">
            <SectionHeader id="pillars" />
            <div className="mb-12 md:mb-20 flex flex-col items-start w-full">
              <div className="flex flex-col gap-4 md:gap-5">
                <div className="w-24 md:w-32 h-3 md:h-4 bg-neutral-200 rounded-xl"></div>
                <div className="w-64 md:w-72 h-10 md:h-12 bg-neutral-400 rounded-xl shadow-sm"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="group bg-white p-6 md:p-8 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors duration-300 cursor-pointer flex flex-col h-[280px] md:h-[300px]">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-neutral-100 group-hover:bg-neutral-200 rounded-xl mb-6 md:mb-8 transition-colors duration-300 shadow-sm"></div>
                  <div className="w-3/4 h-5 md:h-6 bg-neutral-300 group-hover:bg-neutral-400 rounded-xl mb-4 md:mb-5 transition-colors"></div>
                  <div className="w-full h-1.5 md:h-2 bg-neutral-100 group-hover:bg-neutral-200 rounded-xl mb-2 md:mb-3 transition-colors"></div>
                  <div className="w-full h-1.5 md:h-2 bg-neutral-100 group-hover:bg-neutral-200 rounded-xl mb-2 md:mb-3 transition-colors"></div>
                  <div className="w-2/3 h-1.5 md:h-2 bg-neutral-100 group-hover:bg-neutral-200 rounded-xl mb-6 transition-colors"></div>
                  <div className="mt-auto w-20 md:w-24 h-2 md:h-3 bg-neutral-200 group-hover:bg-neutral-300 rounded-xl transition-colors"></div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. About / Institutional Relevance - DARK SECTION */}
          <section className="bg-neutral-900 py-20 md:py-32 border-y border-neutral-800 relative bg-dot-pattern-dark">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/80 via-neutral-900/90 to-neutral-900"></div>
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16 relative z-10">
              <SectionHeader id="about" dark={true} />
              <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center mt-8">
                <div className="relative h-[300px] md:h-[500px] w-full bg-neutral-800 border border-neutral-700 transition-all duration-700 rounded-xl flex items-center justify-center cursor-pointer shadow-lg group overflow-hidden">
                  <div className="w-32 h-32 md:w-40 md:h-40 border-[4px] md:border-[6px] border-neutral-700 rounded-xl rotate-12 group-hover:rotate-90 group-hover:scale-110 transition-all duration-1000 ease-out"></div>
                  <div className="absolute w-20 h-20 md:w-24 md:h-24 bg-neutral-700 rounded-xl -rotate-12 group-hover:-rotate-45 transition-all duration-1000"></div>
                </div>
                <div className="flex flex-col gap-6 md:gap-8 w-full items-start">
                  <div className="w-32 md:w-40 h-3 md:h-4 bg-neutral-700 rounded-xl"></div>
                  <div className="flex flex-col gap-3 md:gap-4 w-full">
                    <div className="w-full h-10 md:h-12 bg-neutral-300 rounded-xl"></div>
                    <div className="w-4/5 h-10 md:h-12 bg-neutral-300 rounded-xl"></div>
                  </div>
                  <div className="flex flex-col gap-3 md:gap-4 mt-2 w-full">
                    <div className="w-full h-2 md:h-3 bg-neutral-700 rounded-xl"></div>
                    <div className="w-full h-2 md:h-3 bg-neutral-700 rounded-xl"></div>
                    <div className="w-3/4 h-2 md:h-3 bg-neutral-700 rounded-xl mb-4"></div>
                  </div>
                  <div className="flex flex-col gap-4 md:gap-5 mt-2 md:mt-4 w-full items-start">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center gap-4 md:gap-5 group cursor-pointer w-full">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-neutral-800 group-hover:bg-neutral-700 border border-neutral-700 rounded-xl flex-shrink-0 transition-colors duration-300"></div>
                        <div className="w-3/4 h-2 md:h-3 bg-neutral-600 group-hover:bg-neutral-500 rounded-xl transition-colors duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Metrics / Impact */}
          <section className="py-16 md:py-24 border-b border-neutral-200 bg-white">
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16">
              <SectionHeader id="impact" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-x divide-neutral-200 mt-8">
                {[1, 2, 3, 4].map((metric) => (
                  <div key={metric} className="text-left px-4 md:px-8 group cursor-default flex flex-col items-start border-l-0 first:border-none">
                    <div className="w-20 h-10 md:w-28 md:h-14 bg-neutral-400 rounded-xl mb-4 md:mb-6 transition-transform duration-500 md:group-hover:translate-x-2 shadow-sm"></div>
                    <div className="w-24 md:w-32 h-2 md:h-3 bg-neutral-200 group-hover:bg-neutral-300 rounded-xl transition-colors duration-500"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. Interactive Network / Regional Impact Map */}
          <section className="py-20 md:py-32 border-b border-neutral-200 bg-neutral-50">
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16">
              <SectionHeader id="map" />
              <div className="mt-8">
                 <InteractiveMap />
              </div>
            </div>
          </section>

          {/* 7. Featured Data & Analytics Preview */}
          <section className="py-20 md:py-32 max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16">
            <SectionHeader id="data" />
            <div className="mb-12 md:mb-16 flex flex-col items-start gap-4 md:gap-5 mt-8">
              <div className="w-24 md:w-32 h-3 md:h-4 bg-neutral-200 rounded-xl"></div>
              <div className="w-64 md:w-72 h-10 md:h-12 bg-neutral-400 rounded-xl shadow-sm"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="w-full h-[300px] md:h-[450px] bg-white rounded-xl border border-neutral-200 p-6 md:p-10 flex flex-col gap-6 md:gap-8 shadow-sm">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-4 md:pb-6 z-10 relative">
                  <div className="w-40 md:w-56 h-6 md:h-8 bg-neutral-300 rounded-xl"></div>
                  <div className="w-24 md:w-32 h-6 md:h-8 bg-neutral-200 rounded-xl"></div>
                </div>
                <InteractiveBarChart />
              </div>
              
              <div className="w-full h-[300px] md:h-[450px] bg-white rounded-xl border border-neutral-200 p-6 md:p-10 flex flex-col gap-6 md:gap-8 shadow-sm">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-4 md:pb-6 z-10 relative">
                  <div className="w-40 md:w-56 h-6 md:h-8 bg-neutral-300 rounded-xl"></div>
                  <div className="w-24 md:w-32 h-6 md:h-8 bg-neutral-200 rounded-xl"></div>
                </div>
                <InteractiveLineChart />
              </div>
            </div>
          </section>

          {/* 8. Active Projects & Sandboxes - DARK SECTION */}
          <section className="py-20 md:py-32 bg-neutral-900 border-y border-neutral-800 relative overflow-hidden bg-dot-pattern-dark">
            <div className="absolute inset-0 bg-neutral-900/90"></div>
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16 relative z-10">
              <SectionHeader id="projects" dark={true} />
              
              <div className="flex gap-6 md:gap-8 overflow-x-auto pb-8 snap-x mt-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {[1, 2, 3, 4, 5].map((proj) => (
                  <div key={proj} className="min-w-[300px] sm:min-w-[350px] md:min-w-[420px] bg-neutral-800 border border-neutral-700 p-6 md:p-8 rounded-xl snap-center hover:border-neutral-600 transition-colors duration-300 group cursor-pointer shadow-sm">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                      <div className="w-24 md:w-28 h-5 md:h-7 bg-neutral-600 rounded-xl group-hover:bg-neutral-500 transition-colors"></div>
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-neutral-700 rounded-xl group-hover:bg-neutral-600 transition-colors"></div>
                    </div>
                    <div className="w-full h-4 md:h-5 bg-neutral-300 rounded-xl mb-3 group-hover:bg-white transition-colors"></div>
                    <div className="w-4/5 h-4 md:h-5 bg-neutral-300 rounded-xl mb-6 md:mb-8 group-hover:bg-white transition-colors"></div>
                    
                    <div className="w-full h-20 md:h-24 bg-neutral-900/50 rounded-xl mb-6 md:mb-8 border border-neutral-700 border-dashed"></div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2 md:mb-3">
                        <div className="w-16 md:w-20 h-2 md:h-3 bg-neutral-500 rounded-xl"></div>
                        <div className="w-10 md:w-12 h-2 md:h-3 bg-neutral-600 rounded-xl"></div>
                      </div>
                      <div className="w-full h-1.5 md:h-2 bg-neutral-700 rounded-xl overflow-hidden">
                        <div className={`h-full bg-neutral-400 rounded-xl transition-all duration-1000 ${proj % 2 === 0 ? 'w-3/4' : 'w-1/3'}`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 9. Latest Research / Knowledge Hub - LEFT ALIGNED */}
          <section className="py-20 md:py-32 max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16 border-b border-neutral-200 bg-white">
            <SectionHeader id="research" />
            <div className="flex flex-col items-start mb-12 md:mb-20 gap-4 md:gap-5 mt-8">
              <div className="w-24 md:w-32 h-3 md:h-4 bg-neutral-200 rounded-xl"></div>
              <div className="w-64 md:w-72 h-10 md:h-12 bg-neutral-400 rounded-xl shadow-sm"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-10">
              {[1, 2, 3].map((pub) => (
                <div key={pub} className="bg-neutral-50 rounded-xl p-6 md:p-8 border border-neutral-200 group hover:border-neutral-300 transition-colors duration-300 flex flex-col h-[240px] md:h-[260px]">
                  <div className="flex justify-between items-start mb-6 md:mb-8">
                    <div className="w-24 md:w-28 h-5 md:h-7 bg-neutral-200 group-hover:bg-neutral-300 rounded-xl transition-colors"></div>
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-neutral-200 group-hover:bg-neutral-300 rounded-xl transition-colors"></div>
                  </div>
                  <div className="w-full h-5 md:h-6 bg-neutral-300 rounded-xl mb-3 group-hover:bg-neutral-400 transition-colors"></div>
                  <div className="w-3/4 h-5 md:h-6 bg-neutral-300 rounded-xl mb-6 md:mb-8 group-hover:bg-neutral-400 transition-colors"></div>
                  <div className="w-24 md:w-32 h-2 md:h-3 bg-neutral-200 mt-auto mb-4 md:mb-5 transition-colors"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 md:w-24 h-3 md:h-4 bg-neutral-300 group-hover:bg-neutral-400 rounded-xl transition-colors"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 10. Policy Archive & Database */}
          <section className="py-20 md:py-32 border-b border-neutral-200 bg-neutral-50">
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16">
              <SectionHeader id="archive" />
              
              <div className="grid lg:grid-cols-4 gap-8 md:gap-12 mt-8">
                <div className="lg:col-span-1 flex flex-col gap-6 md:gap-8 items-start w-full">
                  <div className="w-full h-10 md:h-12 bg-white border border-neutral-200 rounded-xl mb-2 md:mb-4 flex items-center px-4 shadow-sm"><div className="w-4 h-4 md:w-5 md:h-5 rounded-xl bg-neutral-200"></div><div className="w-20 md:w-24 h-2 md:h-3 bg-neutral-200 rounded-xl ml-3"></div></div>
                  {[1, 2, 3].map((filterGroup) => (
                    <div key={filterGroup} className="flex flex-col gap-4 md:gap-5 border-b border-neutral-200 pb-5 md:pb-6 w-full items-start">
                      <div className="w-24 md:w-28 h-3 md:h-4 bg-neutral-300 rounded-xl mb-1 md:mb-2"></div>
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="flex items-center gap-3 md:gap-4 group cursor-pointer">
                          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-neutral-200 rounded-xl group-hover:border-neutral-400 transition-colors bg-white"></div>
                          <div className="w-28 md:w-32 h-2 md:h-3 bg-neutral-200 group-hover:bg-neutral-300 rounded-xl transition-colors"></div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                
                <div className="lg:col-span-3 flex flex-col gap-4 w-full">
                  <div className="flex justify-between items-center mb-4 md:mb-6">
                    <div className="w-36 md:w-48 h-3 md:h-4 bg-neutral-300 rounded-xl"></div>
                    <div className="w-32 md:w-40 h-8 md:h-10 bg-neutral-200 rounded-xl"></div>
                  </div>
                  
                  {[1, 2, 3, 4, 5, 6].map((doc) => (
                    <div key={doc} className="bg-white border border-neutral-200 p-4 md:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-300 transition-colors duration-300 group cursor-pointer shadow-sm">
                      <div className="flex items-center gap-4 md:gap-6 flex-1">
                        <div className="w-10 h-12 md:w-12 md:h-14 bg-neutral-100 rounded-xl border border-neutral-200 group-hover:bg-neutral-200 transition-colors flex-shrink-0"></div>
                        <div className="flex flex-col gap-2 md:gap-3 flex-1 items-start">
                          <div className="w-full sm:w-3/4 h-4 md:h-5 bg-neutral-300 rounded-xl group-hover:bg-neutral-400 transition-colors"></div>
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-16 md:w-20 h-2 md:h-3 bg-neutral-200 rounded-xl"></div>
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-xl bg-neutral-100"></div>
                            <div className="w-20 md:w-24 h-2 md:h-3 bg-neutral-200 rounded-xl"></div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full sm:w-28 h-10 bg-neutral-100 group-hover:bg-neutral-200 transition-colors duration-300 rounded-xl flex items-center justify-start sm:justify-center px-4 sm:px-0">
                        <div className="w-16 h-2 bg-neutral-300 group-hover:bg-neutral-400 rounded-xl"></div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="w-full h-12 md:h-14 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors rounded-xl mt-4 md:mt-6 cursor-pointer flex items-center justify-center shadow-sm">
                    <div className="w-24 md:w-32 h-2 md:h-3 bg-neutral-300 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 11. Upcoming Events & Webinars */}
          <section className="py-20 md:py-32 border-b border-neutral-200 bg-white">
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16">
              <SectionHeader id="events" />
              <div className="mb-12 md:mb-16 flex flex-col items-start gap-4 mt-8 w-full">
                <div className="w-24 h-3 md:h-4 bg-neutral-200 rounded-xl"></div>
                <div className="w-56 md:w-64 h-10 md:h-12 bg-neutral-400 rounded-xl shadow-sm"></div>
              </div>
              <div className="flex flex-col gap-4 md:gap-6">
                {[1, 2, 3].map((event) => (
                  <div key={event} className="flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-6 border border-neutral-200 rounded-xl transition-colors duration-300 group cursor-pointer bg-neutral-50 hover:border-neutral-300 hover:bg-white shadow-sm">
                    <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-xl flex-shrink-0 flex flex-col items-center justify-center border border-neutral-200 transition-colors">
                      <div className="w-8 md:w-10 h-2 md:h-3 bg-neutral-200 rounded-xl mb-2 md:mb-3"></div>
                      <div className="w-10 md:w-14 h-6 md:h-8 bg-neutral-300 rounded-xl"></div>
                    </div>
                    <div className="flex flex-col justify-center flex-1 gap-3 md:gap-4 items-start">
                      <div className="w-full md:w-3/4 h-5 md:h-7 bg-neutral-300 rounded-xl group-hover:bg-neutral-400 transition-colors"></div>
                      <div className="w-4/5 md:w-full h-2 md:h-3 bg-neutral-200 rounded-xl"></div>
                      <div className="w-2/3 h-2 md:h-3 bg-neutral-200 rounded-xl"></div>
                    </div>
                    <div className="flex items-center justify-start md:justify-end md:w-40 mt-2 md:mt-0">
                       <div className="w-full md:w-32 h-10 md:h-12 bg-white border border-neutral-200 group-hover:bg-neutral-100 rounded-xl transition-colors duration-300 flex items-center justify-center">
                         <div className="w-16 h-2 bg-neutral-300 group-hover:bg-neutral-400 rounded-xl"></div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 12. Our Experts & Leadership */}
          <section className="py-20 md:py-32 border-b border-neutral-200 bg-neutral-50">
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16">
              <SectionHeader id="experts" />
              <div className="mb-12 md:mb-20 flex flex-col items-start gap-4 md:gap-5 mt-8 w-full">
                <div className="w-24 h-3 md:h-4 bg-neutral-200 rounded-xl"></div>
                <div className="w-56 md:w-64 h-10 md:h-12 bg-neutral-400 rounded-xl shadow-sm"></div>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                {[1, 2, 3, 4, 5, 6].map((expert) => (
                  <div key={expert} className="group flex gap-4 md:gap-6 items-center p-4 md:p-5 rounded-xl hover:bg-white border border-transparent hover:border-neutral-200 hover:shadow-sm transition-all duration-300 cursor-pointer">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-neutral-200 group-hover:bg-neutral-300 rounded-xl flex-shrink-0 transition-colors duration-300"></div>
                    <div className="flex flex-col gap-2 md:gap-3 items-start">
                      <div className="w-32 md:w-40 h-4 md:h-5 bg-neutral-300 rounded-xl group-hover:bg-neutral-400 transition-colors"></div>
                      <div className="w-24 md:w-28 h-2 md:h-3 bg-neutral-200 rounded-xl"></div>
                      <div className="w-20 md:w-24 h-1.5 md:h-2 bg-neutral-100 rounded-xl mt-1 md:mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 13. Fellowships & Grants */}
          <section className="py-20 md:py-32 bg-neutral-100 border-b border-neutral-200 relative overflow-hidden">
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16 relative z-10">
              <SectionHeader id="fellowships" />
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
                {[1, 2, 3].map((grant) => (
                  <div key={grant} className={`p-6 md:p-8 rounded-xl border flex flex-col h-[350px] md:h-[400px] transition-colors duration-300 group cursor-pointer shadow-sm items-start ${grant === 1 ? 'bg-white border-neutral-300' : 'bg-neutral-50 border-neutral-200 hover:bg-white hover:border-neutral-300'}`}>
                    <div className="flex justify-between items-start mb-8 md:mb-10 w-full">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-neutral-200 rounded-xl group-hover:bg-neutral-300 transition-colors border border-neutral-200"></div>
                      <div className="px-3 py-1.5 md:px-4 md:py-2 border border-neutral-200 bg-white rounded-xl flex items-center gap-2 md:gap-3">
                         <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-xl bg-neutral-300"></div>
                         <div className="w-12 md:w-16 h-1.5 md:h-2 bg-neutral-200 rounded-xl"></div>
                      </div>
                    </div>
                    
                    <div className="w-full h-5 md:h-6 bg-neutral-300 rounded-xl mb-3 md:mb-4 group-hover:bg-neutral-400 transition-colors"></div>
                    <div className="w-2/3 h-5 md:h-6 bg-neutral-300 rounded-xl mb-6 md:mb-8 group-hover:bg-neutral-400 transition-colors"></div>
                    
                    <div className="w-full h-2 md:h-3 bg-neutral-200 rounded-xl mb-2 md:mb-3"></div>
                    <div className="w-4/5 h-2 md:h-3 bg-neutral-200 rounded-xl mb-auto"></div>
                    
                    <div className={`w-full h-12 md:h-14 rounded-xl mt-6 md:mt-8 transition-colors duration-300 flex items-center justify-center border w-full ${grant === 1 ? 'bg-neutral-400 hover:bg-neutral-500 border-neutral-400' : 'bg-white hover:bg-neutral-100 border-neutral-200'}`}>
                      <div className={`w-24 md:w-32 h-2 md:h-3 rounded-xl ${grant === 1 ? 'bg-white' : 'bg-neutral-300'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 14. Ecosystem Voices / Testimonials - DARK SECTION - LEFT ALIGNED */}
          <section className="bg-neutral-900 py-20 md:py-32 border-y border-neutral-800 bg-dot-pattern-dark relative">
            <div className="absolute inset-0 bg-neutral-900/80"></div>
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16 relative z-10">
              <SectionHeader id="testimonials" dark={true} />
              <div className="mb-16 md:mb-20 flex flex-col items-start mt-8 w-full">
                <div className="w-24 md:w-32 h-3 md:h-4 bg-neutral-700 rounded-xl mb-4 md:mb-5"></div>
                <div className="w-64 md:w-72 h-10 md:h-12 bg-neutral-300 rounded-xl shadow-sm"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                {[1, 2].map((testimonial) => (
                  <div key={testimonial} className="bg-neutral-800 p-8 md:p-10 rounded-xl border border-neutral-700 hover:border-neutral-600 transition-colors duration-300 shadow-sm flex flex-col items-start">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-neutral-700 rounded-xl mb-6 md:mb-8"></div>
                    <div className="w-full h-3 md:h-4 bg-neutral-500 rounded-xl mb-3 md:mb-4"></div>
                    <div className="w-11/12 h-3 md:h-4 bg-neutral-500 rounded-xl mb-3 md:mb-4"></div>
                    <div className="w-3/4 h-3 md:h-4 bg-neutral-500 rounded-xl mb-8 md:mb-10"></div>
                    <div className="flex items-center gap-4 md:gap-5 border-t border-neutral-700 pt-5 md:pt-6 w-full">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-700 rounded-xl flex-shrink-0"></div>
                      <div className="flex flex-col items-start">
                        <div className="w-24 md:w-32 h-3 md:h-4 bg-neutral-400 rounded-xl mb-2 md:mb-3"></div>
                        <div className="w-20 md:w-24 h-2 md:h-3 bg-neutral-600 rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 15. In the Media / Press */}
          <section className="py-20 md:py-32 border-b border-neutral-200 bg-neutral-50">
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16">
              <SectionHeader id="media" />
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[1, 2, 3, 4].map((article) => (
                  <div key={article} className="p-6 md:p-8 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition-colors duration-300 group cursor-pointer flex flex-col shadow-sm items-start">
                    <div className="w-24 md:w-28 h-6 md:h-8 bg-neutral-100 group-hover:bg-neutral-200 rounded-xl mb-6 md:mb-8 transition-colors"></div>
                    <div className="w-full h-3 md:h-4 bg-neutral-300 rounded-xl mb-2 md:mb-3 group-hover:bg-neutral-400 transition-colors"></div>
                    <div className="w-full h-3 md:h-4 bg-neutral-300 rounded-xl mb-2 md:mb-3 group-hover:bg-neutral-400 transition-colors"></div>
                    <div className="w-2/3 h-3 md:h-4 bg-neutral-300 rounded-xl mb-8 md:mb-10 group-hover:bg-neutral-400 transition-colors"></div>
                    
                    <div className="mt-auto flex items-center gap-3 md:gap-4 w-full">
                      <div className="w-6 md:w-8 h-[2px] bg-neutral-200 group-hover:bg-neutral-300 transition-colors"></div>
                      <div className="w-16 md:w-20 h-2 md:h-3 bg-neutral-200 group-hover:bg-neutral-300 transition-colors rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 16. News & Announcements */}
          <section className="py-20 md:py-32 max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16 bg-white border-b border-neutral-200">
            <SectionHeader id="news" />
            <div className="mb-12 md:mb-16 flex flex-col gap-4 md:gap-5 mt-8 items-start">
               <div className="w-20 md:w-24 h-3 md:h-4 bg-neutral-200 rounded-xl"></div>
               <div className="w-56 md:w-64 h-10 md:h-12 bg-neutral-400 rounded-xl shadow-sm"></div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4].map((news) => (
                <div key={news} className="bg-neutral-50 p-5 md:p-6 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-white transition-colors duration-300 group cursor-pointer shadow-sm flex flex-col h-full items-start">
                   <div className="w-full h-32 md:h-36 bg-white border border-neutral-200 rounded-xl mb-5 md:mb-6 group-hover:border-neutral-300 transition-colors"></div>
                   <div className="w-20 md:w-24 h-2 md:h-3 bg-neutral-200 rounded-xl mb-3 md:mb-4"></div>
                   <div className="w-full h-4 md:h-5 bg-neutral-300 rounded-xl mb-2 md:mb-3 group-hover:bg-neutral-400 transition-colors"></div>
                   <div className="w-4/5 h-4 md:h-5 bg-neutral-300 rounded-xl mb-5 md:mb-6 group-hover:bg-neutral-400 transition-colors"></div>
                   <div className="w-14 md:w-16 h-2 md:h-3 bg-neutral-200 rounded-xl mt-auto"></div>
                </div>
              ))}
            </div>
          </section>

          {/* 17. Final Call To Action - DARK GREY SECTION - LEFT ALIGNED */}
          <section className="bg-neutral-800 py-24 md:py-32 border-y border-neutral-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-dot-pattern-dark opacity-50"></div>
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16 relative z-10">
              <SectionHeader id="cta" dark={true} />
              <div className="max-w-4xl flex flex-col items-start mt-8 w-full">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-neutral-700 rounded-xl mb-8 md:mb-10 flex-shrink-0 border border-neutral-600 shadow-sm"></div>
                <div className="w-full sm:w-4/5 h-10 md:h-12 bg-neutral-300 rounded-xl mb-4 md:mb-5 shadow-sm"></div>
                <div className="w-5/6 sm:w-3/5 h-10 md:h-12 bg-neutral-300 rounded-xl mb-8 md:mb-10 shadow-sm"></div>
                <div className="w-full sm:w-2/3 h-2 md:h-3 bg-neutral-600 rounded-xl mb-3 md:mb-4"></div>
                <div className="w-2/3 sm:w-1/2 h-2 md:h-3 bg-neutral-600 rounded-xl mb-10 md:mb-12"></div>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto">
                  <div className="w-full sm:w-52 h-14 md:h-16 bg-white border border-transparent hover:bg-neutral-200 rounded-xl shadow-sm transition-colors duration-300 cursor-pointer flex items-center justify-center">
                    <div className="w-20 md:w-24 h-2 bg-neutral-800 rounded-xl"></div>
                  </div>
                  <div className="w-full sm:w-52 h-14 md:h-16 bg-neutral-900 hover:bg-neutral-950 border border-neutral-700 rounded-xl transition-colors duration-300 shadow-sm cursor-pointer flex items-center justify-center">
                    <div className="w-20 md:w-24 h-2 bg-neutral-300 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 18. Footer / Directory - DARKEST GREY SECTION */}
          <footer className="bg-neutral-950 pt-20 md:pt-24 pb-10 md:pb-12">
            <div className="max-w-[90rem] mx-auto px-5 md:px-12 lg:px-16">
              <SectionHeader id="footer" dark={true} />
              <div className="flex flex-col lg:flex-row justify-between items-start gap-12 md:gap-20 mb-16 md:mb-20 mt-8">
                <div className="flex flex-col w-full max-w-sm gap-6 md:gap-8 items-start">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-neutral-800 rounded-xl border border-neutral-700"></div>
                    <div className="w-28 md:w-32 h-5 md:h-6 bg-neutral-700 rounded-xl"></div>
                  </div>
                  <div className="flex flex-col gap-2 md:gap-3 w-full items-start">
                    <div className="w-full h-1.5 md:h-2 bg-neutral-800 rounded-xl"></div>
                    <div className="w-5/6 h-1.5 md:h-2 bg-neutral-800 rounded-xl"></div>
                    <div className="w-4/5 h-1.5 md:h-2 bg-neutral-800 rounded-xl"></div>
                  </div>
                  <div className="flex gap-3 md:gap-4 mt-2 md:mt-4 w-full">
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors duration-300 cursor-pointer border border-neutral-800"></div>
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors duration-300 cursor-pointer border border-neutral-800"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-10 md:gap-20 w-full lg:w-auto">
                  <div className="flex flex-col gap-4 md:gap-6 items-start">
                    <div className="w-24 md:w-28 h-3 md:h-4 bg-neutral-600 rounded-xl mb-2 md:mb-4"></div>
                    {[1, 2, 3, 4].map((link) => (
                      <div key={link} className="w-28 md:w-32 h-2 md:h-3 bg-neutral-800 hover:bg-neutral-600 rounded-xl cursor-pointer transition-colors duration-300"></div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4 md:gap-6 items-start">
                    <div className="w-24 md:w-28 h-3 md:h-4 bg-neutral-600 rounded-xl mb-2 md:mb-4"></div>
                    {[1, 2, 3, 4].map((link) => (
                      <div key={link} className="w-32 md:w-36 h-2 md:h-3 bg-neutral-800 hover:bg-neutral-600 rounded-xl cursor-pointer transition-colors duration-300"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-neutral-900 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
                <div className="w-64 md:w-72 h-1.5 md:h-2 bg-neutral-800 rounded-xl"></div>
                <div className="flex gap-6 md:gap-8">
                  <div className="w-16 md:w-20 h-1.5 md:h-2 bg-neutral-800 hover:bg-neutral-600 rounded-xl cursor-pointer transition-colors"></div>
                  <div className="w-20 md:w-24 h-1.5 md:h-2 bg-neutral-800 hover:bg-neutral-600 rounded-xl cursor-pointer transition-colors"></div>
                  <div className="w-16 md:w-20 h-1.5 md:h-2 bg-neutral-800 hover:bg-neutral-600 rounded-xl cursor-pointer transition-colors"></div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
