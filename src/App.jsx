import React, { useState } from 'react';

const HeroDataGrid = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className="w-full h-[400px] bg-white border border-neutral-200 rounded-sm relative overflow-hidden flex items-end p-8 group cursor-crosshair shadow-sm"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Base Grid overlay symbolizing infrastructure/policy mapping - Light Gray */}
      <div className="absolute inset-0 opacity-50 bg-[linear-gradient(90deg,#e5e5e5_1px,transparent_1px),linear-gradient(180deg,#e5e5e5_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Interactive Highlight Grid overlay - Mid Gray */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 bg-[linear-gradient(90deg,#a3a3a3_1px,transparent_1px),linear-gradient(180deg,#a3a3a3_1px,transparent_1px)] bg-[size:40px_40px]"
        style={{
          opacity: isHovering ? 0.3 : 0,
          maskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`
        }}
      ></div>

      {/* X and Y crosshair tracking lines */}
      <div
        className="absolute top-0 bottom-0 border-l border-neutral-400 border-dashed pointer-events-none transition-opacity duration-300"
        style={{ left: mousePos.x, opacity: isHovering ? 0.4 : 0 }}
      ></div>
      <div
        className="absolute left-0 right-0 border-t border-neutral-400 border-dashed pointer-events-none transition-opacity duration-300"
        style={{ top: mousePos.y, opacity: isHovering ? 0.4 : 0 }}
      ></div>

      {/* Prominent Overlay Badge */}
      <div className="relative z-10 w-[400px] h-36 bg-white border border-neutral-200 p-6 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center transition-transform duration-500 group-hover:-translate-y-2">
        <div className="flex justify-between items-center mb-6">
          <div className="w-32 h-5 bg-neutral-400 rounded-sm"></div>
          <div className="w-6 h-6 border-2 border-neutral-200 rounded-sm"></div>
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-sm mb-3"></div>
        <div className="w-2/3 h-2 bg-neutral-200 rounded-sm"></div>
      </div>

      {/* Structural accent line */}
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
    <div className="relative w-full h-[500px] bg-white rounded-sm border border-neutral-200 overflow-hidden group shadow-sm">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_#d4d4d4_2px,_transparent_2px)] bg-[size:40px_40px]"></div>
      
      <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 100 250 Q 300 150 500 300 T 1000 200" fill="transparent" stroke={hoveredNode ? "#e5e5e5" : "#d4d4d4"} strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite] transition-colors duration-500" />
        <path d="M 200 400 Q 600 500 800 150" fill="transparent" stroke={hoveredNode ? "#e5e5e5" : "#d4d4d4"} strokeWidth="2" className="transition-colors duration-500" />
      </svg>

      {nodes.map((pos) => (
        <div
          key={pos.id}
          className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-neutral-300 hover:bg-neutral-400 border-4 border-white shadow-sm cursor-pointer transition-all duration-300 hover:scale-125 z-10"
          style={{ top: pos.top, left: pos.left }}
          onMouseEnter={() => setHoveredNode(pos.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Node Tooltip */}
          <div className={`absolute -top-20 left-1/2 -translate-x-1/2 bg-white border border-neutral-200 p-3 rounded-sm shadow-sm flex flex-col gap-2 w-32 transition-all duration-300 ${hoveredNode === pos.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <div className="w-16 h-3 bg-neutral-400 rounded-sm"></div>
            <div className="w-full h-2 bg-neutral-200 rounded-sm"></div>
            <div className="w-3/4 h-2 bg-neutral-200 rounded-sm"></div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-6 bg-white border border-neutral-200 p-5 rounded-sm shadow-sm pointer-events-none">
        <div className="w-32 h-3 bg-neutral-300 rounded-sm mb-4"></div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-neutral-300"></div><div className="w-20 h-2 bg-neutral-200 rounded-sm"></div></div>
          <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-neutral-200"></div><div className="w-16 h-2 bg-neutral-100 rounded-sm"></div></div>
        </div>
      </div>
    </div>
  );
};

const InteractiveBarChart = () => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const data = [40, 70, 45, 90, 65, 30, 80, 55, 100, 60, 20, 85];

  return (
    <div className="flex-1 flex items-end gap-4 pt-4 relative w-full">
      {/* Background tracking line */}
      {hoveredBar !== null && (
        <div
          className="absolute left-0 right-0 border-t border-neutral-300 border-dashed pointer-events-none transition-all duration-300 z-0"
          style={{ bottom: `${data[hoveredBar]}%` }}
        ></div>
      )}
      
      {data.map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-sm transition-all duration-300 cursor-pointer relative z-10 ${hoveredBar === i ? 'bg-neutral-400 scale-y-105 origin-bottom' : 'bg-neutral-200 hover:bg-neutral-300'}`}
          style={{ height: `${h}%` }}
          onMouseEnter={() => setHoveredBar(i)}
          onMouseLeave={() => setHoveredBar(null)}
        >
          {/* Bar Tooltip */}
          <div className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-white border border-neutral-200 p-2 rounded-sm shadow-sm transition-all duration-300 flex flex-col items-center gap-1.5 ${hoveredBar === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <div className="w-8 h-2.5 bg-neutral-400 rounded-sm"></div>
            <div className="w-5 h-1.5 bg-neutral-200 rounded-sm"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [activeRationale, setActiveRationale] = useState(null);

  const rationales = {
    hero: {
      title: "01. Hero Section",
      whyExists: "To immediately establish authority, scope, and institutional mandate.",
      whyHere: "This is the 3-second hook. Before a user cares about your data, research, or team, they need to know exactly what you do and if they are in the right place. It sits at the absolute top because without immediate clarity, the user bounces."
    },
    partners: {
      title: "02. Trusted Partners Strip",
      whyExists: "To trigger the 'Halo Effect' and borrow credibility from established entities.",
      whyHere: "Once the user knows WHAT you do (Hero), their subconscious immediately asks, 'Who trusts you to do this?'. Placing this right after the Hero validates your institution before the user dives into your complex research."
    },
    pillars: {
      title: "03. Core Pillars / Focus Areas",
      whyExists: "To provide a mental framework for the CoE's complex operations.",
      whyHere: "Now that trust is established, the user is ready to understand your scope. Placing this high up categorizes your massive regulatory mandate into 4 neat, digestible boxes, making the rest of the page easier to navigate."
    },
    about: {
      title: "04. About / Institutional Relevance",
      whyExists: "To explain the deeper mission, history, and 'the why' behind the CoE.",
      whyHere: "If you put heavy text at the top of the page, users leave. They must first buy into your value (Hero) and credibility (Partners) before they care about your story. This is the exact psychological moment they are ready to read it."
    },
    impact: {
      title: "05. Metrics / Impact",
      whyExists: "To provide objective, quantifiable proof of the CoE's work.",
      whyHere: "The 'About' section above is subjective storytelling. This section follows immediately to back up that story with hard, indisputable data. Narrative + Data = Unshakable Trust."
    },
    map: {
      title: "06. Interactive Regional Impact Map",
      whyExists: "Visualizes the physical and jurisdictional reach of the CoE.",
      whyHere: "Follows impact metrics to ground those abstract numbers in geographical reality. Once they see the 'how much', they need to see the 'where'."
    },
    data: {
      title: "07. Featured Data & Analytics Preview",
      whyExists: "To flex the institution's capability in handling complex systems and grids.",
      whyHere: "Placed after the impact and map. You just told them you have impact and scale; now you literally show them the complex interfaces and models you use to generate it."
    },
    projects: {
      title: "08. Active Projects & Sandboxes",
      whyExists: "Shows the CoE is actively testing and implementing, not just theorizing.",
      whyHere: "Bridges the gap between raw data capabilities (above) and published academic research (below). It proves you build real-world solutions."
    },
    research: {
      title: "09. Latest Research / Knowledge Hub",
      whyExists: "This is the intellectual payload and primary output of the institution.",
      whyHere: "Placed in the exact middle of the page. The user has been fully educated on your value, trust, and capabilities. Their cognitive load is primed to actually interact with deep regulatory literature."
    },
    archive: {
      title: "10. Policy Archive & Database",
      whyExists: "Provides a heavy-duty utilitarian search tool for researchers and policymakers.",
      whyHere: "Sits immediately after highlighted 'Latest Research' to offer the 'deep dive' full database for users who want to search beyond the highlights."
    },
    events: {
      title: "11. Upcoming Events & Webinars",
      whyExists: "To prove the CoE is a living, breathing, and active community.",
      whyHere: "Flows naturally from the Research and Archive sections. The psychological progression is: 'You just read our paper, now come attend the discussion about it'."
    },
    experts: {
      title: "12. Our Experts & Leadership",
      whyExists: "To humanize the data and show the prestigious minds behind the institution.",
      whyHere: "In regulatory spaces, institutional weight matters more initially than individual faces. Once the institution is trusted, revealing the elite team seals the deal."
    },
    fellowships: {
      title: "13. Fellowships & Grants",
      whyExists: "Attracts top-tier academic talent and funds ongoing critical research.",
      whyHere: "Strategically placed right after 'Our Experts' so prospective applicants see the caliber of people they will be working with before they apply."
    },
    testimonials: {
      title: "14. Ecosystem Voices / Testimonials",
      whyExists: "Peer validation from external industry leaders.",
      whyHere: "Placed after the team and fellowships. It's a powerful trust multiplier: 'Don't just take our word that our experts are great—look at what the rest of the industry says'."
    },
    media: {
      title: "15. In the Media / Press",
      whyExists: "Third-party validation from authoritative news sources.",
      whyHere: "Pairs perfectly with industry testimonials to provide a complete 360-degree credibility wrap-up before moving to the final conversion elements."
    },
    news: {
      title: "16. News & Announcements",
      whyExists: "A recency indicator for PR and media.",
      whyHere: "Assures visitors the CoE is actively making waves in the current news cycle. It's placed lower because it's secondary to evergreen research, but necessary for stakeholders."
    },
    cta: {
      title: "17. Final Call To Action",
      whyExists: "The ultimate conversion net (Newsletter subscribe, Partnership inquiry).",
      whyHere: "Placed at the absolute end of the psychological journey. The user has seen the mandate, the proof, the team, and peer validation. They are at peak readiness to commit."
    },
    footer: {
      title: "18. Footer / Directory",
      whyExists: "The utilitarian architectural anchor of the site.",
      whyHere: "Standard UX practice. It sits at the bottom to catch users who bypassed the narrative journey because they are looking for specific links (compliance, careers, legal)."
    }
  };

  const SectionHeader = ({ id }) => (
    <div className="mb-12 relative z-20">
      <button
        onClick={() => setActiveRationale(activeRationale === id ? null : id)}
        className="group flex items-center gap-4 w-full text-left pb-4 border-b border-neutral-200 transition-all duration-300 hover:border-neutral-300"
      >
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 group-hover:text-neutral-500 transition-colors duration-300">
          {rationales[id].title}
        </h2>
        <div className={`px-2 py-1 rounded-sm text-[10px] font-bold tracking-wider transition-all duration-500 flex items-center gap-1 ${
          activeRationale === id 
            ? 'bg-neutral-300 text-white'
            : 'bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200 group-hover:text-neutral-500'
        }`}>
          {activeRationale === id ? 'Close Rationale ✕' : 'Why is this here? ✦'}
        </div>
      </button>

      {/* Rationale Expansion Panel - Light Gray */}
      <div className={`grid transition-all duration-[500ms] ease-in-out ${activeRationale === id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="pt-6 pb-2">
            <div className={`p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-neutral-200 bg-white transform transition-all duration-[500ms] ease-out ${
              activeRationale === id ? 'translate-y-0' : '-translate-y-8'
            }`}>
              <div className="grid md:grid-cols-2 gap-8">
                <div className={`transform transition-all duration-700 delay-100 ${activeRationale === id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold mb-2 text-neutral-400">The Purpose</h4>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    {rationales[id].whyExists}
                  </p>
                </div>
                <div className={`transform transition-all duration-700 delay-200 ${activeRationale === id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold mb-2 text-neutral-400">The Strategic Placement</h4>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    {rationales[id].whyHere}
                  </p>
                </div>
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
        @keyframes subtleShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .magical-shimmer {
          background: linear-gradient(90deg, #d4d4d4 25%, #e5e5e5 50%, #d4d4d4 75%);
          background-size: 200% 100%;
          animation: subtleShimmer 8s infinite linear;
        }
        .bg-dot-pattern {
          background-image: radial-gradient(#e5e5e5 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}} />

      <div className="min-h-screen bg-neutral-50 bg-dot-pattern font-sans selection:bg-neutral-200 text-neutral-600 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white/90 pointer-events-none fixed"></div>

        <div className="relative z-10">
          {/* 0. Header */}
          <header className="sticky top-0 z-50 bg-white/90 border-b border-neutral-200 transition-all shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4 cursor-pointer group">
                {/* Formal squared institutional crest placeholder */}
                <div className="w-12 h-12 bg-neutral-300 rounded-sm group-hover:bg-neutral-400 transition-colors duration-300 flex items-center justify-center">
                   <div className="w-6 h-6 border-2 border-neutral-100 rounded-sm"></div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="w-32 h-3 bg-neutral-400 rounded-sm group-hover:bg-neutral-500 transition-colors duration-300"></div>
                  <div className="w-20 h-2 bg-neutral-200 rounded-sm"></div>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-10">
                <ul className="flex gap-8">
                  {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <li key={idx} className="relative group p-2">
                      <div className="w-16 h-2 bg-neutral-200 group-hover:bg-neutral-400 rounded-sm transition-colors duration-300 cursor-pointer"></div>
                    </li>
                  ))}
                </ul>
                <div className="w-36 h-10 bg-neutral-400 hover:bg-neutral-500 rounded-sm transition-colors duration-300 cursor-pointer flex items-center justify-center border border-neutral-400">
                  <div className="w-16 h-2 bg-white rounded-sm"></div>
                </div>
              </nav>
            </div>
          </header>

          {/* 1. Hero Section */}
          <section className="relative pt-16 pb-24 border-b border-neutral-200 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <SectionHeader id="hero" />
              
              <div className="flex flex-col gap-12 mt-4">
                <div className="max-w-4xl flex flex-col items-start w-full">
                  <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-neutral-400">
                    <div className="w-24 h-4 bg-neutral-200 rounded-sm"></div>
                  </div>
                  
                  <div className="w-full h-14 bg-neutral-400 rounded-sm mb-4"></div>
                  <div className="w-5/6 h-14 bg-neutral-400 rounded-sm mb-10"></div>
                  
                  <div className="w-3/4 h-3 bg-neutral-200 rounded-sm mb-4"></div>
                  <div className="w-2/3 h-3 bg-neutral-200 rounded-sm mb-4"></div>
                  <div className="w-4/5 h-3 bg-neutral-200 rounded-sm mb-12"></div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="w-48 h-12 bg-neutral-400 hover:bg-neutral-500 rounded-sm transition-colors duration-300 cursor-pointer border border-neutral-400 shadow-sm flex items-center justify-center gap-2">
                       <div className="w-20 h-2 bg-white rounded-sm"></div>
                    </div>
                    <div className="w-48 h-12 bg-white hover:bg-neutral-50 rounded-sm transition-colors duration-300 cursor-pointer border-2 border-neutral-200 shadow-sm flex items-center justify-center gap-2">
                       <div className="w-20 h-2 bg-neutral-300 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                
                {/* Interactive Data Grid */}
                <HeroDataGrid />
              </div>
            </div>
          </section>

          {/* 2. Trusted Partners Strip */}
          <section className="border-y border-neutral-200/50 bg-neutral-50 pt-8 pb-14">
            <div className="max-w-7xl mx-auto px-6">
              <SectionHeader id="partners" />
              <div className="flex flex-wrap justify-center items-center gap-16 lg:gap-32 mt-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-32 h-8 bg-neutral-200 hover:bg-neutral-300 rounded-sm transition-colors duration-300 cursor-pointer"></div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Core Pillars / Services */}
          <section className="py-24 max-w-7xl mx-auto px-6">
            <SectionHeader id="pillars" />
            <div className="mb-20 flex flex-col md:flex-row md:justify-between md:items-end w-full">
              <div className="flex flex-col gap-5">
                <div className="w-32 h-4 bg-neutral-200 rounded-sm"></div>
                <div className="w-72 h-12 bg-neutral-400 rounded-sm shadow-sm"></div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="group bg-white p-8 rounded-sm border border-neutral-200 hover:border-neutral-300 transition-colors duration-300 cursor-pointer flex flex-col h-[300px]">
                  <div className="w-14 h-14 bg-neutral-100 group-hover:bg-neutral-200 rounded-sm mb-8 transition-colors duration-300 shadow-sm"></div>
                  <div className="w-3/4 h-6 bg-neutral-300 group-hover:bg-neutral-400 rounded-sm mb-5 transition-colors"></div>
                  <div className="w-full h-2 bg-neutral-100 group-hover:bg-neutral-200 rounded-sm mb-3 transition-colors"></div>
                  <div className="w-full h-2 bg-neutral-100 group-hover:bg-neutral-200 rounded-sm mb-3 transition-colors"></div>
                  <div className="w-2/3 h-2 bg-neutral-100 group-hover:bg-neutral-200 rounded-sm mb-6 transition-colors"></div>
                  <div className="mt-auto w-24 h-3 bg-neutral-200 group-hover:bg-neutral-300 rounded-sm transition-colors"></div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. About / Institutional Relevance */}
          <section className="bg-neutral-100 py-32 border-y border-neutral-200">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <SectionHeader id="about" />
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="relative h-[500px] w-full bg-white border border-neutral-200 transition-all duration-700 rounded-sm flex items-center justify-center cursor-pointer shadow-sm group overflow-hidden">
                  <div className="w-40 h-40 border-[6px] border-neutral-200 rounded-sm rotate-12 group-hover:rotate-90 group-hover:scale-110 transition-all duration-1000 ease-out"></div>
                  <div className="absolute w-24 h-24 bg-neutral-200 rounded-sm -rotate-12 group-hover:-rotate-45 transition-all duration-1000"></div>
                </div>
                <div className="flex flex-col gap-8 w-full">
                  <div className="w-40 h-4 bg-neutral-300 rounded-sm"></div>
                  <div className="flex flex-col gap-4">
                    <div className="w-full h-12 bg-neutral-400 rounded-sm"></div>
                    <div className="w-4/5 h-12 bg-neutral-400 rounded-sm"></div>
                  </div>
                  <div className="flex flex-col gap-4 mt-2">
                    <div className="w-full h-3 bg-neutral-200 rounded-sm"></div>
                    <div className="w-full h-3 bg-neutral-200 rounded-sm"></div>
                    <div className="w-3/4 h-3 bg-neutral-200 rounded-sm mb-4"></div>
                  </div>
                  <div className="flex flex-col gap-5 mt-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center gap-5 group cursor-pointer">
                        <div className="w-8 h-8 bg-neutral-200 group-hover:bg-neutral-300 rounded-sm flex-shrink-0 transition-colors duration-300"></div>
                        <div className="w-3/4 h-3 bg-neutral-300 group-hover:bg-neutral-400 rounded-sm transition-colors duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Metrics / Impact */}
          <section className="py-24 border-b border-neutral-200 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <SectionHeader id="impact" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-neutral-200">
                {[1, 2, 3, 4].map((metric) => (
                  <div key={metric} className="text-center px-4 group cursor-default flex flex-col items-center">
                    <div className="w-28 h-14 bg-neutral-400 rounded-sm mb-6 transition-transform duration-500 group-hover:scale-105 shadow-sm"></div>
                    <div className="w-32 h-3 bg-neutral-200 group-hover:bg-neutral-300 rounded-sm transition-colors duration-500"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. Interactive Network / Regional Impact Map */}
          <section className="py-32 border-b border-neutral-200 bg-neutral-50">
            <div className="max-w-7xl mx-auto px-6">
              <SectionHeader id="map" />
              <InteractiveMap />
            </div>
          </section>

          {/* 7. Featured Data & Analytics Preview */}
          <section className="py-32 max-w-7xl mx-auto px-6">
            <SectionHeader id="data" />
            <div className="mb-16 flex flex-col gap-5">
              <div className="w-32 h-4 bg-neutral-200 rounded-sm"></div>
              <div className="w-72 h-12 bg-neutral-400 rounded-sm shadow-sm"></div>
            </div>
            <div className="w-full h-[450px] bg-white rounded-sm border border-neutral-200 p-10 flex flex-col gap-8 shadow-sm">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-6 z-10 relative">
                <div className="w-56 h-8 bg-neutral-300 rounded-sm"></div>
                <div className="w-32 h-8 bg-neutral-200 rounded-sm"></div>
              </div>
              <InteractiveBarChart />
            </div>
          </section>

          {/* 8. Active Projects & Sandboxes */}
          <section className="py-32 bg-neutral-100 border-y border-neutral-200 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <SectionHeader id="projects" />
              
              <div className="flex gap-8 overflow-x-auto pb-8 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {[1, 2, 3, 4, 5].map((proj) => (
                  <div key={proj} className="min-w-[350px] sm:min-w-[420px] bg-white border border-neutral-200 p-8 rounded-sm snap-center hover:border-neutral-300 transition-colors duration-300 group cursor-pointer shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                      <div className="w-28 h-7 bg-neutral-300 rounded-sm group-hover:bg-neutral-400 transition-colors"></div>
                      <div className="w-8 h-8 bg-neutral-200 rounded-sm group-hover:bg-neutral-300 transition-colors"></div>
                    </div>
                    <div className="w-full h-5 bg-neutral-200 rounded-sm mb-3 group-hover:bg-neutral-300 transition-colors"></div>
                    <div className="w-4/5 h-5 bg-neutral-200 rounded-sm mb-8 group-hover:bg-neutral-300 transition-colors"></div>
                    
                    <div className="w-full h-24 bg-neutral-50 rounded-sm mb-8 border border-neutral-200 border-dashed"></div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="w-20 h-3 bg-neutral-300 rounded-sm"></div>
                        <div className="w-12 h-3 bg-neutral-200 rounded-sm"></div>
                      </div>
                      <div className="w-full h-2 bg-neutral-100 rounded-sm overflow-hidden">
                        <div className={`h-full bg-neutral-400 rounded-sm transition-all duration-1000 ${proj % 2 === 0 ? 'w-3/4' : 'w-1/3'}`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 9. Latest Research / Knowledge Hub */}
          <section className="py-32 max-w-7xl mx-auto px-6 border-b border-neutral-200 bg-white">
            <SectionHeader id="research" />
            <div className="flex flex-col items-center mb-20 gap-5">
              <div className="w-32 h-4 bg-neutral-200 rounded-sm"></div>
              <div className="w-72 h-12 bg-neutral-400 rounded-sm shadow-sm"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {[1, 2, 3].map((pub) => (
                <div key={pub} className="bg-neutral-50 rounded-sm p-8 border border-neutral-200 group hover:border-neutral-300 transition-colors duration-300 flex flex-col h-[260px]">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-28 h-7 bg-neutral-200 group-hover:bg-neutral-300 rounded-sm transition-colors"></div>
                    <div className="w-8 h-8 bg-neutral-200 group-hover:bg-neutral-300 rounded-sm transition-colors"></div>
                  </div>
                  <div className="w-full h-6 bg-neutral-300 rounded-sm mb-3 group-hover:bg-neutral-400 transition-colors"></div>
                  <div className="w-3/4 h-6 bg-neutral-300 rounded-sm mb-8 group-hover:bg-neutral-400 transition-colors"></div>
                  <div className="w-32 h-3 bg-neutral-200 mt-auto mb-5 transition-colors"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-4 bg-neutral-300 group-hover:bg-neutral-400 rounded-sm transition-colors"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 10. Policy Archive & Database */}
          <section className="py-32 border-b border-neutral-200 bg-neutral-50">
            <div className="max-w-7xl mx-auto px-6">
              <SectionHeader id="archive" />
              
              <div className="grid lg:grid-cols-4 gap-12">
                <div className="lg:col-span-1 flex flex-col gap-8">
                  <div className="w-full h-12 bg-white border border-neutral-200 rounded-sm mb-4 flex items-center px-4 shadow-sm"><div className="w-5 h-5 rounded-sm bg-neutral-200"></div><div className="w-24 h-3 bg-neutral-200 rounded-sm ml-3"></div></div>
                  {[1, 2, 3].map((filterGroup) => (
                    <div key={filterGroup} className="flex flex-col gap-5 border-b border-neutral-200 pb-6">
                      <div className="w-28 h-4 bg-neutral-300 rounded-sm mb-2"></div>
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="flex items-center gap-4 group cursor-pointer">
                          <div className="w-5 h-5 border-2 border-neutral-200 rounded-sm group-hover:border-neutral-400 transition-colors bg-white"></div>
                          <div className="w-32 h-3 bg-neutral-200 group-hover:bg-neutral-300 rounded-sm transition-colors"></div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                
                <div className="lg:col-span-3 flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-48 h-4 bg-neutral-300 rounded-sm"></div>
                    <div className="w-40 h-10 bg-neutral-200 rounded-sm"></div>
                  </div>
                  
                  {[1, 2, 3, 4, 5, 6].map((doc) => (
                    <div key={doc} className="bg-white border border-neutral-200 p-5 rounded-sm flex items-center justify-between hover:border-neutral-300 transition-colors duration-300 group cursor-pointer shadow-sm">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="w-12 h-14 bg-neutral-100 rounded-sm border border-neutral-200 group-hover:bg-neutral-200 transition-colors flex-shrink-0"></div>
                        <div className="flex flex-col gap-3 flex-1">
                          <div className="w-3/4 h-5 bg-neutral-300 rounded-sm group-hover:bg-neutral-400 transition-colors"></div>
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-3 bg-neutral-200 rounded-sm"></div>
                            <div className="w-2 h-2 rounded-sm bg-neutral-100"></div>
                            <div className="w-24 h-3 bg-neutral-200 rounded-sm"></div>
                          </div>
                        </div>
                      </div>
                      <div className="w-28 h-10 bg-neutral-100 group-hover:bg-neutral-200 transition-colors duration-300 rounded-sm flex items-center justify-center">
                        <div className="w-16 h-2 bg-neutral-300 group-hover:bg-neutral-400 rounded-sm"></div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="w-full h-14 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors rounded-sm mt-6 cursor-pointer flex items-center justify-center shadow-sm">
                    <div className="w-32 h-3 bg-neutral-300 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 11. Upcoming Events & Webinars */}
          <section className="py-32 border-b border-neutral-200 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <SectionHeader id="events" />
              <div className="mb-16 flex justify-between items-end">
                <div className="flex flex-col gap-5">
                  <div className="w-24 h-4 bg-neutral-200 rounded-sm"></div>
                  <div className="w-64 h-12 bg-neutral-400 rounded-sm shadow-sm"></div>
                </div>
                <div className="w-32 h-4 bg-neutral-200 hover:bg-neutral-300 rounded-sm cursor-pointer transition-colors"></div>
              </div>
              <div className="flex flex-col gap-6">
                {[1, 2, 3].map((event) => (
                  <div key={event} className="flex flex-col md:flex-row gap-8 p-6 border border-neutral-200 rounded-sm transition-colors duration-300 group cursor-pointer bg-neutral-50 hover:border-neutral-300 hover:bg-white shadow-sm">
                    <div className="w-28 h-28 bg-white rounded-sm flex-shrink-0 flex flex-col items-center justify-center border border-neutral-200 transition-colors">
                      <div className="w-10 h-3 bg-neutral-200 rounded-sm mb-3"></div>
                      <div className="w-14 h-8 bg-neutral-300 rounded-sm"></div>
                    </div>
                    <div className="flex flex-col justify-center flex-1 gap-4">
                      <div className="w-3/4 h-7 bg-neutral-300 rounded-sm group-hover:bg-neutral-400 transition-colors"></div>
                      <div className="w-full h-3 bg-neutral-200 rounded-sm"></div>
                      <div className="w-2/3 h-3 bg-neutral-200 rounded-sm"></div>
                    </div>
                    <div className="flex items-center justify-end md:w-40">
                       <div className="w-32 h-12 bg-white border border-neutral-200 group-hover:bg-neutral-100 rounded-sm transition-colors duration-300 flex items-center justify-center">
                         <div className="w-16 h-2 bg-neutral-300 group-hover:bg-neutral-400 rounded-sm"></div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 12. Our Experts & Leadership */}
          <section className="py-32 border-b border-neutral-200 bg-neutral-50">
            <div className="max-w-7xl mx-auto px-6">
              <SectionHeader id="experts" />
              <div className="mb-20 flex flex-col md:flex-row md:justify-between md:items-end w-full">
                <div className="flex flex-col gap-5">
                  <div className="w-24 h-4 bg-neutral-200 rounded-sm"></div>
                  <div className="w-64 h-12 bg-neutral-400 rounded-sm shadow-sm"></div>
                </div>
                <div className="w-40 h-4 bg-neutral-200 hover:bg-neutral-300 rounded-sm mt-6 md:mt-0 cursor-pointer transition-colors"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-10">
                {[1, 2, 3].map((expert) => (
                  <div key={expert} className="group flex gap-6 items-center p-5 rounded-sm hover:bg-white border border-transparent hover:border-neutral-200 hover:shadow-sm transition-all duration-300 cursor-pointer">
                    <div className="w-24 h-24 bg-neutral-200 group-hover:bg-neutral-300 rounded-sm flex-shrink-0 transition-colors duration-300"></div>
                    <div className="flex flex-col gap-3">
                      <div className="w-40 h-5 bg-neutral-300 rounded-sm group-hover:bg-neutral-400 transition-colors"></div>
                      <div className="w-28 h-3 bg-neutral-200 rounded-sm"></div>
                      <div className="w-24 h-2 bg-neutral-100 rounded-sm mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 13. Fellowships & Grants */}
          <section className="py-32 bg-neutral-100 border-b border-neutral-200 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <SectionHeader id="fellowships" />
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((grant) => (
                  <div key={grant} className={`p-8 rounded-sm border flex flex-col h-[400px] transition-colors duration-300 group cursor-pointer shadow-sm ${grant === 1 ? 'bg-white border-neutral-300' : 'bg-neutral-50 border-neutral-200 hover:bg-white hover:border-neutral-300'}`}>
                    <div className="flex justify-between items-start mb-10">
                      <div className="w-16 h-16 bg-neutral-200 rounded-sm group-hover:bg-neutral-300 transition-colors border border-neutral-200"></div>
                      <div className="px-4 py-2 border border-neutral-200 bg-white rounded-sm flex items-center gap-3">
                         <div className="w-2 h-2 rounded-sm bg-neutral-300"></div>
                         <div className="w-16 h-2 bg-neutral-200 rounded-sm"></div>
                      </div>
                    </div>
                    
                    <div className="w-full h-6 bg-neutral-300 rounded-sm mb-4 group-hover:bg-neutral-400 transition-colors"></div>
                    <div className="w-2/3 h-6 bg-neutral-300 rounded-sm mb-8 group-hover:bg-neutral-400 transition-colors"></div>
                    
                    <div className="w-full h-3 bg-neutral-200 rounded-sm mb-3"></div>
                    <div className="w-4/5 h-3 bg-neutral-200 rounded-sm mb-auto"></div>
                    
                    <div className={`w-full h-14 rounded-sm mt-8 transition-colors duration-300 flex items-center justify-center border ${grant === 1 ? 'bg-neutral-400 hover:bg-neutral-500 border-neutral-400' : 'bg-white hover:bg-neutral-100 border-neutral-200'}`}>
                      <div className={`w-32 h-3 rounded-sm ${grant === 1 ? 'bg-white' : 'bg-neutral-300'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 14. Ecosystem Voices / Testimonials */}
          <section className="bg-white py-32 border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <SectionHeader id="testimonials" />
              <div className="mb-20 text-center flex flex-col items-center">
                <div className="w-32 h-4 bg-neutral-200 rounded-sm mb-5"></div>
                <div className="w-72 h-12 bg-neutral-400 rounded-sm shadow-sm"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                {[1, 2].map((testimonial) => (
                  <div key={testimonial} className="bg-neutral-50 p-10 rounded-sm border border-neutral-200 hover:border-neutral-300 hover:bg-white transition-colors duration-300 shadow-sm">
                    <div className="w-14 h-14 bg-neutral-200 rounded-sm mb-8"></div>
                    <div className="w-full h-4 bg-neutral-300 rounded-sm mb-4"></div>
                    <div className="w-11/12 h-4 bg-neutral-300 rounded-sm mb-4"></div>
                    <div className="w-3/4 h-4 bg-neutral-300 rounded-sm mb-10"></div>
                    <div className="flex items-center gap-5 border-t border-neutral-200 pt-6">
                      <div className="w-12 h-12 bg-neutral-200 rounded-sm"></div>
                      <div>
                        <div className="w-32 h-4 bg-neutral-300 rounded-sm mb-3"></div>
                        <div className="w-24 h-3 bg-neutral-200 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 15. In the Media / Press */}
          <section className="py-32 border-b border-neutral-200 bg-neutral-50">
            <div className="max-w-7xl mx-auto px-6">
              <SectionHeader id="media" />
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((article) => (
                  <div key={article} className="p-8 rounded-sm bg-white border border-neutral-200 hover:border-neutral-300 transition-colors duration-300 group cursor-pointer flex flex-col shadow-sm">
                    <div className="w-28 h-8 bg-neutral-100 group-hover:bg-neutral-200 rounded-sm mb-8 transition-colors"></div>
                    <div className="w-full h-4 bg-neutral-300 rounded-sm mb-3 group-hover:bg-neutral-400 transition-colors"></div>
                    <div className="w-full h-4 bg-neutral-300 rounded-sm mb-3 group-hover:bg-neutral-400 transition-colors"></div>
                    <div className="w-2/3 h-4 bg-neutral-300 rounded-sm mb-10 group-hover:bg-neutral-400 transition-colors"></div>
                    
                    <div className="mt-auto flex items-center gap-4">
                      <div className="w-8 h-[2px] bg-neutral-200 group-hover:bg-neutral-300 transition-colors"></div>
                      <div className="w-20 h-3 bg-neutral-200 group-hover:bg-neutral-300 transition-colors rounded-sm"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 16. News & Announcements */}
          <section className="py-32 max-w-7xl mx-auto px-6 bg-white border-b border-neutral-200">
            <SectionHeader id="news" />
            <div className="mb-16 flex flex-col gap-5">
               <div className="w-24 h-4 bg-neutral-200 rounded-sm"></div>
               <div className="w-64 h-12 bg-neutral-400 rounded-sm shadow-sm"></div>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((news) => (
                <div key={news} className="bg-neutral-50 p-6 rounded-sm border border-neutral-200 hover:border-neutral-300 hover:bg-white transition-colors duration-300 group cursor-pointer shadow-sm">
                   <div className="w-full h-36 bg-white border border-neutral-200 rounded-sm mb-6 group-hover:border-neutral-300 transition-colors"></div>
                   <div className="w-24 h-3 bg-neutral-200 rounded-sm mb-4"></div>
                   <div className="w-full h-5 bg-neutral-300 rounded-sm mb-3 group-hover:bg-neutral-400 transition-colors"></div>
                   <div className="w-4/5 h-5 bg-neutral-300 rounded-sm mb-6 group-hover:bg-neutral-400 transition-colors"></div>
                   <div className="w-16 h-3 bg-neutral-200 rounded-sm mt-auto"></div>
                </div>
              ))}
            </div>
          </section>

          {/* 17. Final Call To Action */}
          <section className="bg-neutral-100 py-32 border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-6">
              <SectionHeader id="cta" />
              <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-sm mb-10 flex-shrink-0 border border-neutral-200 shadow-sm"></div>
                <div className="w-4/5 h-12 bg-neutral-400 rounded-sm mb-5 shadow-sm"></div>
                <div className="w-3/5 h-12 bg-neutral-400 rounded-sm mb-10 shadow-sm"></div>
                <div className="w-full h-3 bg-neutral-200 rounded-sm mb-4"></div>
                <div className="w-2/3 h-3 bg-neutral-200 rounded-sm mb-12"></div>
                <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                  <div className="w-52 h-16 bg-white border border-neutral-300 hover:border-neutral-400 rounded-sm shadow-sm transition-colors duration-300 cursor-pointer flex items-center justify-center">
                    <div className="w-24 h-2 bg-neutral-300 rounded-sm"></div>
                  </div>
                  <div className="w-52 h-16 bg-neutral-400 hover:bg-neutral-500 rounded-sm transition-colors duration-300 shadow-sm cursor-pointer flex items-center justify-center">
                    <div className="w-24 h-2 bg-white rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 18. Footer / Directory */}
          <footer className="bg-white pt-24 pb-12 border-t border-neutral-200">
            <div className="max-w-7xl mx-auto px-6">
              <SectionHeader id="footer" />
              <div className="flex flex-col lg:flex-row justify-between items-start gap-20 mb-20 mt-8">
                <div className="flex flex-col w-full max-w-sm gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-200 rounded-sm border border-neutral-300"></div>
                    <div className="w-32 h-6 bg-neutral-300 rounded-sm"></div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="w-full h-2 bg-neutral-200 rounded-sm"></div>
                    <div className="w-5/6 h-2 bg-neutral-200 rounded-sm"></div>
                    <div className="w-4/5 h-2 bg-neutral-200 rounded-sm"></div>
                  </div>
                  <div className="flex gap-4 mt-4">
                     <div className="w-12 h-12 rounded-sm bg-neutral-100 hover:bg-neutral-200 transition-colors duration-300 cursor-pointer border border-neutral-200"></div>
                     <div className="w-12 h-12 rounded-sm bg-neutral-100 hover:bg-neutral-200 transition-colors duration-300 cursor-pointer border border-neutral-200"></div>
                  </div>
                </div>
                <div className="flex gap-20 flex-wrap">
                  <div className="flex flex-col gap-6">
                    <div className="w-28 h-4 bg-neutral-300 rounded-sm mb-4"></div>
                    {[1, 2, 3, 4].map((link) => (
                      <div key={link} className="w-32 h-3 bg-neutral-200 hover:bg-neutral-300 rounded-sm cursor-pointer transition-colors duration-300"></div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="w-28 h-4 bg-neutral-300 rounded-sm mb-4"></div>
                    {[1, 2, 3, 4].map((link) => (
                      <div key={link} className="w-36 h-3 bg-neutral-200 hover:bg-neutral-300 rounded-sm cursor-pointer transition-colors duration-300"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-neutral-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="w-72 h-2 bg-neutral-200 rounded-sm"></div>
                <div className="flex gap-8">
                  <div className="w-20 h-2 bg-neutral-200 hover:bg-neutral-300 rounded-sm cursor-pointer transition-colors"></div>
                  <div className="w-24 h-2 bg-neutral-200 hover:bg-neutral-300 rounded-sm cursor-pointer transition-colors"></div>
                  <div className="w-20 h-2 bg-neutral-200 hover:bg-neutral-300 rounded-sm cursor-pointer transition-colors"></div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}