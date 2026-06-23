import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CaseStudyVideoHero from './CaseStudyVideoHero';

const LegacyExperience = ({ project, navigate, palette }) => {
  const hexColor = palette[project.type] || palette.primary;
  return (
    <div className="min-h-screen text-[#F4F4F5] w-full" style={{ backgroundColor: hexColor }}>
      {/* Fallback old UI */}
      {/* Hero Section - Cinematic Boxed Layout */}
      <section className="relative w-full flex flex-col items-center justify-start z-10 pb-32 md:pb-40 pt-10 px-4 md:px-8">
        {project.bannerImage ? (
          <div className="w-full max-w-7xl mx-auto aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-2xl relative">
            <div className="absolute inset-0 bg-black/20 mix-blend-overlay z-10 pointer-events-none"></div>
            <img src={project.bannerImage} alt={`${project.client} Hero`} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-24 md:h-32 mb-8"></div>
        )}

        <div className="text-center max-w-5xl mx-auto mt-4 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-primary tracking-tight leading-none mb-6 font-semibold"
          >
            {project.client}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 md:gap-4 font-secondary uppercase tracking-widest text-xs md:text-sm text-white/80"
          >
            {project.tags.map((tag, i) => (
              <React.Fragment key={i}>
                <span>{tag}</span>
                {i < project.tags.length - 1 && <span className="w-1.5 h-1.5 rounded-full bg-white/40" />}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="relative w-full px-4 md:px-12 py-20 bg-white/5 backdrop-blur-3xl border-t border-white/10 rounded-t-[3rem] z-20 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-4 flex flex-col gap-12">
            <div className="p-8 rounded-2xl bg-black/20 border border-white/10 shadow-inner">
              <h3 className="text-sm uppercase tracking-widest text-white/60 mb-4 font-secondary">The Challenge</h3>
              <p className="text-xl md:text-2xl font-primary leading-snug">{project.challenge}</p>
            </div>
            {project.route && (
              <div>
                <h3 className="text-sm uppercase tracking-widest text-white/60 mb-3 font-secondary">Strategy Route</h3>
                <p className="text-lg font-primary">{project.route}</p>
              </div>
            )}
            {project.roles && (
              <div>
                <h3 className="text-sm uppercase tracking-widest text-white/60 mb-3 font-secondary">Capabilities</h3>
                <ul className="flex flex-col gap-2">
                  {project.roles.map((r, i) => (
                    <li key={i} className="text-base font-primary border-l-2 pl-3 border-white/20">{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-8 flex flex-col gap-16">
            <div className="prose prose-invert prose-lg md:prose-xl font-primary leading-relaxed max-w-none text-white/90">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">Overview</h2>
              <p>{project.overview}</p>
              
              <div className="h-px w-24 bg-white/20 my-12" />
              
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">The Approach</h2>
              <p>{project.solution}</p>
            </div>
            
            {project.imageUrl && !project.bannerImage && (
              <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <div className="aspect-[4/3] w-full relative">
                  <img src={project.imageUrl} alt={`${project.client} Visuals`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CINEMATIC VIDEO HERO ── */}
      {(() => {
        const hasVideoHero = project?.videoHero?.enabled;
        const hasVideoSection = project?.videoSection?.videoUrl || project?.videoSection?.videoFileUrl;
        
        if (!hasVideoHero && !hasVideoSection) return null;
        
        const videoData = hasVideoHero ? project.videoHero : {
          enabled: true,
          backgroundColor: hexColor,
          backgroundText: project.client || 'Case Study',
          videoTitle: 'Watch Video',
          videoSubtitle: 'Experience the story in motion.',
          embedUrl: project.videoSection?.videoUrl,
          uploadedVideoUrl: project.videoSection?.videoFileUrl,
          thumbnailUrl: null
        };
        
        return <CaseStudyVideoHero videoHero={videoData} fallbackName={project.client} />;
      })()}

      {/* Footer Navigation */}
      <section className="px-4 md:px-12 py-20 border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <button 
            onClick={() => navigate('work')}
            className="group flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-secondary uppercase tracking-widest text-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to All Work
          </button>
        </div>
      </section>
    </div>
  );
};

export default LegacyExperience;
