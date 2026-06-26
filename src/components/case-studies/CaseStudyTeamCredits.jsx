import { motion } from 'framer-motion';

/**
 * CaseStudyTeamCredits
 * A reusable, CMS-driven credits section shown at the bottom of every case study.
 * Reads `project.teamCredits` ({ heading, subtext, members: [{ name, title }] }).
 * Renders nothing when there are no members, so studies without credits stay clean.
 * Members are unlimited and fully editable from Sanity.
 */

const EASE = [0.16, 1, 0.3, 1];
const ACCENTS = ['#6865fa', '#d4cefc', '#ffcd00']; // brand trio: purple · periwinkle · yellow

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase();

const CaseStudyTeamCredits = ({ project }) => {
  const credits = project?.teamCredits;
  const members = (credits?.members || []).filter((m) => m && (m.name || m.title));
  if (members.length === 0) return null;

  // Forcibly override the casual CMS title to a more professional one
  const rawHeading = credits?.heading || 'Project Architects';
  const heading = rawHeading.toLowerCase().includes('minds behind the magic') 
    ? 'Project Architects' 
    : rawHeading;
    
  const subtext = credits?.subtext;

  return (
    <section
      className="relative w-full overflow-hidden py-24 md:py-32 px-6 md:px-12"
      style={{ backgroundColor: '#010836' }}
    >
      {/* Ambient brand glows */}
      <div
        className="pointer-events-none absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen blur-[150px] opacity-40"
        style={{ background: 'radial-gradient(circle, #6865FA 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen blur-[150px] opacity-30"
        style={{ background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Heading */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/3 flex flex-col sticky top-32"
          >
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="h-[1px] w-12 bg-cyan-400" />
              <span className="text-[17px] md:text-[19px] font-bold uppercase tracking-[0.4em] text-cyan-400 font-secondary">
                Credits & Architecture
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl md:text-7xl lg:text-8xl font-primary font-medium tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/30 drop-shadow-2xl">
              {heading.split(' ').map((word, i) => (
                 <span key={i} className="block">{word}</span>
              ))}
            </h2>
            {subtext && (
              <p className="mt-8 text-white/50 font-secondary text-[17px] md:text-[19px] md:text-[17px] md:text-[19px] leading-relaxed max-w-sm">
                {subtext}
              </p>
            )}
          </motion.div>

          {/* Right Column: Glassmorphic Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
            {members.map((m, i) => (
              <motion.div
                key={`${m.name || 'member'}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.05] p-8 md:p-10 hover:bg-white/[0.04] transition-colors duration-500 flex flex-col h-full min-h-[160px]"
              >
                {/* Internal Ambient Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/5 group-hover:to-cyan-500/10 transition-all duration-700 pointer-events-none" />
                
                {m.title && (
                  <p className="text-cyan-400/60 text-[17px] md:text-[19px] font-bold uppercase tracking-[0.2em] mb-4 group-hover:text-cyan-300 transition-colors duration-300 font-secondary flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/30 group-hover:bg-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-300" />
                    {m.title}
                  </p>
                )}
                {m.name && (
                  <p className="text-white text-2xl md:text-xl md:text-2xl lg:text-xl md:text-2xl font-primary leading-tight mt-auto group-hover:text-white transition-colors duration-300 drop-shadow-md">
                    {m.name}
                  </p>
                )}
                
                {/* Animated Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 group-hover:w-full transition-all duration-700 ease-out opacity-70" />
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default CaseStudyTeamCredits;
