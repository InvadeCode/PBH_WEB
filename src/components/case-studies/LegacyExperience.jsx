import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CaseStudyVideoHero, { hasVideoHeroSource } from './CaseStudyVideoHero';
import CaseStudyMedia, { normalizeMediaItems } from './CaseStudyMedia';
import CaseStudySectorPill from './CaseStudySectorPill';
import { getSafeEmbedUrl } from '../../lib/videoUtils';

const LegacyExperience = ({ project, navigate, palette }) => {
  const hexColor = palette[project.type] || palette.primary;
  const mediaItems = normalizeMediaItems(project.fullStory?.media || project.fullStory?.images, project.client || 'Case study media');
  const heroImage = project.bannerVideo || project.fullStory?.heroVideo || project.bannerImage || project.fullStory?.heroImg || project.imageUrl;

  return (
    <div className="min-h-screen text-[#F4F4F5] w-full" style={{ backgroundColor: hexColor }}>
      {/* Global Top Navigation */}
      <div className="fixed top-0 left-0 w-full z-[100] px-6 pt-28 pb-6 md:px-12 md:pt-32 md:pb-8 flex flex-wrap items-center gap-3 pointer-events-none">
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2 text-[17px] md:text-[19px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>
      {/* Fallback old UI */}
      {/* Hero Section - Cinematic Boxed Layout */}
      <section className="relative w-full flex flex-col items-center justify-start z-10 pb-32 md:pb-40 pt-10 px-4 md:px-8">
        {heroImage ? (
          <div className="w-full max-w-7xl mx-auto aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-2xl relative">
            <div className="absolute inset-0 bg-black/20 mix-blend-overlay z-10 pointer-events-none"></div>
            <CaseStudyMedia
              src={heroImage}
              alt={`${project.client} Hero`}
              className="w-full h-full object-cover"
              priority
              sizes="(min-width: 1280px) 1280px, 100vw"
            />
            <div className="pointer-events-none absolute left-1/2 top-24 z-20 -translate-x-1/2 px-3 md:top-28">
              <CaseStudySectorPill
                sector={project?.sector}
                className="border border-white/15 bg-black/35 text-white/85 shadow-[0_14px_40px_rgba(0,0,0,0.24)] backdrop-blur-md"
              />
            </div>
          </div>
        ) : (
          <div className="relative w-full h-24 md:h-32 mb-8">
            <div className="pointer-events-none absolute left-1/2 top-24 z-20 -translate-x-1/2 px-3 md:top-28">
              <CaseStudySectorPill
                sector={project?.sector}
                className="border border-white/15 bg-black/35 text-white/85 shadow-[0_14px_40px_rgba(0,0,0,0.24)] backdrop-blur-md"
              />
            </div>
          </div>
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
            className="flex flex-wrap items-center justify-center gap-3 md:gap-4 font-secondary uppercase tracking-widest text-[17px] md:text-[19px] text-white/80"
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
              <h3 className="text-[17px] md:text-[19px] uppercase tracking-widest text-white/60 mb-4 font-secondary">The Challenge</h3>
              <p className="text-xl md:text-2xl font-primary leading-snug">{project.challenge}</p>
            </div>
            {project.route && (
              <div>
                <h3 className="text-[17px] md:text-[19px] uppercase tracking-widest text-white/60 mb-3 font-secondary">Strategy Route</h3>
                <p className="text-[17px] md:text-[19px] font-secondary">{project.route}</p>
              </div>
            )}
            {project.roles && (
              <div>
                <h3 className="text-[17px] md:text-[19px] uppercase tracking-widest text-white/60 mb-3 font-secondary">Capabilities</h3>
                <ul className="flex flex-col gap-2">
                  {project.roles.map((r, i) => (
                    <li key={i} className="text-[17px] md:text-[19px] font-secondary border-l-2 pl-3 border-white/20">{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-8 flex flex-col gap-16">
            <div className="flex flex-col gap-6 text-[17px] md:text-[19px] font-secondary leading-relaxed max-w-none text-white/90">
              <h2 className="text-xl md:text-2xl font-primary font-semibold">Overview</h2>
              <p>{project.overview}</p>
              
              <div className="h-px w-24 bg-white/20 my-2" />
              
              <h2 className="text-xl md:text-2xl font-primary font-semibold">The Approach</h2>
              <p>{project.solution}</p>
            </div>
            
            {mediaItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {mediaItems.map((media, index) => (
                  <div
                    key={media.key}
                    className={`${index % 3 === 0 ? 'sm:col-span-2' : ''} rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-black/20 flex items-center justify-center p-2`}
                  >
                    <CaseStudyMedia
                      item={media}
                      alt={media.alt || `${project.client} Visual ${index + 1}`}
                      className="w-full h-auto max-h-[80vh] object-contain transition-transform duration-700 group-hover:scale-105"
                      sizes={index % 3 === 0 ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 640px) 50vw, 100vw'}
                    />
                  </div>
                ))}
              </div>
            ) : project.imageUrl && !heroImage && (
              <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group flex items-center justify-center p-2 bg-black/20">
                <CaseStudyMedia
                  src={project.imageUrl}
                  alt={`${project.client} Visuals`}
                  className="w-full h-auto max-h-[80vh] object-contain transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── OPTIONAL HUGE PRE-VIDEO MEDIA (Image / GIF / Video) ── */}
      {(() => {
        const media = project?.preVideoMedia;
        const legacyImage = project?.preVideoImage;
        const hasMedia = media?.imageUrl || media?.videoUrl || legacyImage;
        if (!hasMedia) return null;

        const altText = media?.alt || 'Pre-video hero media';
        const isVideo = media?.mediaType === 'video' && media?.videoUrl;

        return (
          <section className="relative w-full z-10 pb-16 pt-8">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-center">
              {isVideo ? (
                <video
                  src={media.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
                  aria-label={altText}
                />
              ) : (
                <CaseStudyMedia
                  src={media?.imageUrl || legacyImage}
                  alt={altText}
                  className="w-full h-auto object-cover rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
                />
              )}
            </div>
          </section>
        );
      })()}

      {/* ── CINEMATIC VIDEO HERO & ADDITIONAL VIDEOS ── */}
      {(() => {
        const hasVideoHero = project?.videoHero?.enabled || hasVideoHeroSource(project?.videoHero);
        
        const allVideos = [];
        if (project?.videoSection?.videoUrl || project?.videoSection?.videoFileUrl) {
          allVideos.push({
            videoTitle: project.videoSection.videoTitle,
            videoSubtitle: project.videoSection.videoSubtitle,
            thumbnailUrl: project.videoSection.thumbnailUrl,
            videoUrl: getSafeEmbedUrl(project.videoSection.videoUrl),
            videoFileUrl: project.videoSection.videoFileUrl,
            orientation: project.videoSection.orientation
          });
        }
        if (project?.videoSection?.videos?.length > 0) {
          project.videoSection.videos.forEach(v => {
            allVideos.push({
              videoTitle: v.videoTitle,
              videoSubtitle: v.videoSubtitle,
              thumbnailUrl: v.thumbnailUrl,
              videoUrl: getSafeEmbedUrl(v.videoUrl),
              videoFileUrl: v.videoFileUrl,
              orientation: project.videoSection.orientation
            });
          });
        }

        if (!hasVideoHero && allVideos.length === 0) return null;
        
        const mainVideoData = hasVideoHero ? project.videoHero : {
          enabled: true,
          backgroundColor: hexColor,
          backgroundText: project.client || 'Case Study',
          videoTitle: allVideos[0]?.videoTitle || 'Watch Video',
          videoSubtitle: allVideos[0]?.videoSubtitle || 'Experience the story in motion.',
          embedUrl: allVideos[0]?.videoUrl,
          uploadedVideoUrl: allVideos[0]?.videoFileUrl,
          thumbnailUrl: allVideos[0]?.thumbnailUrl
        };
        
        return (
          <CaseStudyVideoHero videoHero={mainVideoData} fallbackName={project.client} allVideos={allVideos} />
        );
      })()}

      {/* Footer Navigation */}
      <section className="px-4 md:px-12 py-20 border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <button 
            onClick={() => navigate('work')}
            className="group flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-secondary uppercase tracking-widest text-[17px] md:text-[19px]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            All Case Studies
          </button>
        </div>
      </section>
    </div>
  );
};

export default LegacyExperience;
