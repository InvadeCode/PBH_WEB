import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlobalContext } from '../../App';
import CaseStudyVideoHero from './CaseStudyVideoHero';
import CaseStudyMedia, { normalizeMediaItems } from './CaseStudyMedia';

// Helper for alpha colors
const hexToRgba = (hex, alpha) => {
  if (!hex) return 'rgba(0,0,0,1)';
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ── 3D BOOK FLIPPING COMPONENTS (DESKTOP) ───────────────────────────────────

// A single physical leaf of paper (has a front and a back)
const BookLeaf = ({ index, currentIndex, frontContent, backContent, c, zIndexOffset }) => {
  // If this leaf's index is less than the currentIndex, it has been flipped (is on the left).
  const isFlipped = index < currentIndex;
  
  return (
    <motion.div
      className="absolute top-0 right-0 w-1/2 h-full origin-left"
      style={{ transformStyle: 'preserve-3d', zIndex: isFlipped ? 50 - index : 50 + zIndexOffset }}
      initial={false}
      animate={{
        rotateY: isFlipped ? -180 : 0,
      }}
      transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* FRONT SIDE (Visible when book is open on the right) */}
      <div 
        className="absolute inset-0 w-full h-full bg-[#f4f1ea] border-r border-y border-[#d5d0c0] shadow-sm overflow-hidden flex flex-col"
        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)', borderLeft: '1px solid #00000010' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 5%)' }} />
        {frontContent}
      </div>

      {/* BACK SIDE (Visible when flipped to the left) */}
      <div 
        className="absolute inset-0 w-full h-full bg-[#f0ebd9] border-l border-y border-[#d5d0c0] shadow-sm overflow-hidden flex flex-col"
        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRight: '1px solid #00000010' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(270deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 8%)' }} />
        {backContent}
      </div>
    </motion.div>
  );
};

// The Hardcover Front
const BookCover = ({ isFlipped, project, c, zIndex }) => {
  return (
    <motion.div
      className="absolute top-0 right-0 w-1/2 h-full origin-left"
      style={{ transformStyle: 'preserve-3d', zIndex: isFlipped ? 10 : zIndex }}
      initial={false}
      animate={{ rotateY: isFlipped ? -180 : 0 }}
      transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* Front Cover */}
      <div 
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-12 overflow-hidden shadow-2xl"
        style={{ backfaceVisibility: 'hidden', backgroundColor: c.soilDeep, border: `1px solid ${c.cream}20`, borderLeft: '4px solid #111' }}
      >
        {/* Binder Spine Shadow */}
        <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)' }} />
        <h1 className="text-5xl md:text-7xl font-light font-primary text-center tracking-tight" style={{ color: c.cream }}>
          {(project.client || project.title || 'Case Study').toUpperCase()}
        </h1>
        <p className="mt-8 text-sm uppercase tracking-widest font-secondary opacity-50" style={{ color: c.terra }}>
          An Editorial Story
        </p>
      </div>

      {/* Inside Cover */}
      <div 
        className="absolute inset-0 w-full h-full p-12"
        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', backgroundColor: c.soilDeep, borderRight: '4px solid #111' }}
      >
        <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none" style={{ background: 'linear-gradient(270deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)' }} />
        <div className="w-full h-full border border-white/10 opacity-30 bg-repeat" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>
    </motion.div>
  );
};


// The Hardcover Back
const BookBackCover = ({ c }) => {
  return (
    <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center" style={{ backgroundColor: c.soilDeep, zIndex: 5, borderRight: `1px solid ${c.cream}20`, boxShadow: '20px 0 50px rgba(0,0,0,0.5)' }}>
      <p className="text-xs font-secondary uppercase tracking-widest opacity-30" style={{ color: c.cream }}>The End</p>
    </div>
  );
}


const DesktopStorybook = ({ project, c, navigate }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Extract images
  const mediaItems = normalizeMediaItems(project);
  
  // Format content chunks
  const about = project.overview || "Overview not provided.";
  const problem = project.challenge || "Challenge not provided.";
  const solution = project.solution || "Solution not provided.";

  // Create Book Leaves (Pages). Each leaf has a front and back.
  // Leaf 0: Front = About, Back = Problem
  // Leaf 1: Front = Solution, Back = Image 1
  // Leaf 2: Front = Image 2, Back = Image 3 (etc)
  
  const contentStack = [
    { type: 'text', title: project.overviewHeading || 'The Brand', text: about },
    { type: 'text', title: project.challengeHeading || 'The Question', text: problem },
    { type: 'text', title: project.solutionHeading || 'The Answer', text: solution }
  ];

  mediaItems.forEach(m => {
    contentStack.push({ type: 'image', media: m });
  });

  // Ensure even number of pages by adding a blank if needed
  if (contentStack.length % 2 !== 0) {
    contentStack.push({ type: 'blank' });
  }

  const leaves = [];
  for (let i = 0; i < contentStack.length; i += 2) {
    leaves.push({ front: contentStack[i], back: contentStack[i+1] });
  }

  const totalFlips = leaves.length + 1; // Cover + all leaves

  const flipNext = () => setCurrentPage(p => Math.min(totalFlips, p + 1));
  const flipPrev = () => setCurrentPage(p => Math.max(0, p - 1));

  // Render a Page's Content
  const renderPageContent = (item, isLeft) => {
    if (item.type === 'blank') return <div className="w-full h-full flex items-center justify-center opacity-20"><div className="w-16 border-t border-[#111]"></div></div>;
    
    if (item.type === 'text') {
      return (
        <div className={`w-full h-full p-12 md:p-16 flex flex-col justify-center text-left ${isLeft ? 'items-end text-right' : 'items-start text-left'}`}>
          <h2 className="text-sm font-primary uppercase tracking-widest mb-12" style={{ color: c.terra }}>{item.title}</h2>
          <p className="text-2xl md:text-3xl font-light font-primary leading-[1.6] text-[#222]" dangerouslySetInnerHTML={{ __html: item.text }} />
        </div>
      );
    }

    if (item.type === 'image') {
      return (
        <div className="w-full h-full p-8 flex items-center justify-center">
          <div className="w-full h-full relative overflow-hidden bg-black/5 shadow-inner">
             {item.media.type === 'video' ? (
                <video src={item.media.src} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
             ) : (
                <img src={item.media.src} alt="Case Study" className="absolute inset-0 w-full h-full object-cover" />
             )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center" style={{ backgroundColor: '#1a1a1a', backgroundImage: 'radial-gradient(circle at 50% 50%, #2a2a2a 0%, #111 100%)' }}>
      
      {/* Navigation UI */}
      <div className="absolute top-10 left-10 z-[100]">
        <button onClick={() => navigate('home')} className="flex items-center gap-2 text-sm backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="absolute bottom-10 inset-x-0 flex justify-center gap-6 z-[100]">
        <button onClick={flipPrev} disabled={currentPage === 0} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:pointer-events-none">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center text-xs font-secondary tracking-widest text-white/40 uppercase">
          {currentPage === 0 ? 'Cover' : `Page ${currentPage} of ${totalFlips}`}
        </div>
        <button onClick={flipNext} disabled={currentPage === totalFlips} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:pointer-events-none">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* The 3D Book Container */}
      <div 
        className="relative w-full max-w-5xl h-[70vh] cursor-pointer" 
        style={{ perspective: '2500px' }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          if (clickX > rect.width / 2) flipNext(); else flipPrev();
        }}
      >
        {/* Book Positioning Wrapper */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          animate={{ x: currentPage === 0 ? '-25%' : currentPage === totalFlips ? '25%' : '0%' }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Back Cover (Always stays on right) */}
          <BookBackCover c={c} />

          {/* Leaves (Pages) */}
          {leaves.map((leaf, idx) => (
            <BookLeaf 
              key={`leaf-${idx}`}
              index={idx + 1} 
              currentIndex={currentPage} 
              frontContent={renderPageContent(leaf.front, false)}
              backContent={renderPageContent(leaf.back, true)}
              c={c}
              zIndexOffset={leaves.length - idx}
            />
          ))}

          {/* Front Cover */}
          <BookCover isFlipped={currentPage > 0} project={project} c={c} zIndex={100} />
          
        </motion.div>
      </div>

    </div>
  );
};


// ── MOBILE FALLBACK (STANDARD SCROLL) ───────────────────────────────────────

const MobileFallback = ({ project, c, navigate }) => {
  const mediaItems = normalizeMediaItems(project);
  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: c.soilDeep }}>
      <div className="pt-8 px-[5%]">
         <button onClick={() => navigate('home')} className="flex items-center gap-2 text-sm backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white mb-12">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
      </div>
      
      {/* Cover Header */}
      <div className="px-[7%] py-20 border-b border-white/10">
        <h1 className="text-4xl font-light font-primary tracking-tight mb-4" style={{ color: c.cream }}>
          {(project.client || project.title || 'Case Study').toUpperCase()}
        </h1>
        <p className="text-xs uppercase tracking-widest font-secondary opacity-50" style={{ color: c.terra }}>An Editorial Story</p>
      </div>

      {/* Narrative Blocks */}
      <div className="px-[7%] py-16 space-y-16">
        {[
          { k: project.overviewHeading || 'The Brand', v: project.overview },
          { k: project.challengeHeading || 'The Question', v: project.challenge },
          { k: project.solutionHeading || 'The Answer', v: project.solution }
        ].filter(b => b.v).map((block, i) => (
          <div key={i} className="bg-[#f4f1ea] p-8 shadow-lg border border-[#e5e0d0]">
            <h2 className="text-xs font-primary uppercase tracking-widest mb-6" style={{ color: c.terra }}>{block.k}</h2>
            <p className="text-lg font-light font-primary leading-relaxed text-[#222]" dangerouslySetInnerHTML={{ __html: block.v }} />
          </div>
        ))}
      </div>

      {/* Gallery */}
      <div className="px-[7%] space-y-8">
        {mediaItems.map((m, i) => (
          <div key={i} className="w-full bg-[#111] border border-white/10 overflow-hidden relative" style={{ aspectRatio: m.aspectRatio || '1/1' }}>
             {m.type === 'video' ? (
                <video src={m.src} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
             ) : (
                <img src={m.src} alt="Case Study" className="absolute inset-0 w-full h-full object-cover" />
             )}
          </div>
        ))}
      </div>
    </div>
  );
};


// ── MAIN EXPERIENCE COMPONENT ───────────────────────────────────────────────

const StorybookExperience = ({ project, navigate }) => {
  // Extract theme
  const brandColor = project.brandColor?.hex || '#C27357';
  const c = {
    soilDeep: '#0D0D0D',
    soil: '#1A1A1A',
    terra: brandColor,
    cream: '#FFFFFF',
  };

  return (
    <>
      <div className="hidden md:block">
        <DesktopStorybook project={project} c={c} navigate={navigate} />
      </div>
      <div className="block md:hidden">
        <MobileFallback project={project} c={c} navigate={navigate} />
      </div>
    </>
  );
};

export default StorybookExperience;
