import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from 'framer-motion';

/**
 * PremiumLogoMarquee — cinematic, seamless client-logo showcase.
 *
 * Assets: ONLY the files in /public/pbh-logos (copied verbatim from "PBH LOGOS").
 *
 * • Sits on the existing dark page background (no white strip).
 * • Logos are OPTICALLY normalized: each `h` (px) is tuned per asset so the
 *   *visible* mark lands ~52–64px regardless of the transparent padding baked
 *   into the source file (height also reserves correct horizontal space, so
 *   nothing overlaps). Equal CSS sizes ≠ equal perceived size — hence per-logo h.
 * • Default = uniform white monochrome @ 0.7 (elegant on dark). Hover restores
 *   full brand colour + lift + scale + soft radial glow.
 * • Motion = Framer Motion frame loop (no CSS marquee hacks): infinite, seamless,
 *   extremely slow, eases to ~70% on hover (never pauses).
 */

const EASE = [0.16, 1, 0.3, 1];

// Uniform sizing — every logo rendered at the same height (object-contain).
const LOGOS = [
  { src: '/clients/logos/hero_lectro/hero_lectro_transparent.png', name: 'Hero Lectro' },
  { src: '/pbh-logos/arise-ventures.png',     name: 'Arise Ventures' },
  { src: '/pbh-logos/firefox.png',            name: 'Firefox' },
  { src: '/pbh-logos/leverage-edu.png',       name: 'Leverage Edu' },
  { src: '/pbh-logos/ebt.png',                name: 'EcoBiotraps' },
  { src: '/pbh-logos/nse.png',                name: 'NSE' },
  { src: '/pbh-logos/earthy-souls.png',       name: 'Earthy Souls' },
  { src: '/pbh-logos/navankur.png',           name: 'Navankur' },
  { src: '/pbh-logos/snow-leopard-trust.png', name: 'Snow Leopard Trust' },
  { src: '/pbh-logos/back-to-roots.png',      name: 'Back To Roots' },
  { src: '/pbh-logos/orf.png',                name: 'ORF' },
  { src: '/pbh-logos/param.png',              name: 'Param Science Centre' },
  { src: '/pbh-logos/veauli.png',             name: 'Veauli Techniks' },
  { src: '/pbh-logos/igf.png',                name: 'India Global Forum' },
  { src: '/pbh-logos/sayre.png',              name: 'Sayre Therapeutics' },
  { src: '/pbh-logos/kanti-sweets.png',       name: 'Kanti Sweets' },
  { src: '/pbh-logos/artboard6.png',          name: 'Bella Vita' },
  { src: '/pbh-logos/novus.png',              name: 'IIT Delhi' },
];

const BASE_SPEED = 140;   // px / second — faster cinematic pace
const SLOW_FACTOR = 0.4; // Slower on hover for readability

const Logo = ({ logo, i, reduce }) => {
  const getSizeClass = (name) => {
    const customSizes = {
      // BUMPED UP further per request
      'Sayre Therapeutics': 'h-[200px] md:h-[280px]',
      'IIT Delhi': 'h-[240px] md:h-[320px]',
      'Navankur': 'h-[160px] md:h-[220px]',
      
      'Kanti Sweets': 'h-[180px] md:h-[260px]',
      'Hero Lectro': 'h-[180px] md:h-[260px]',
      
      'Param Science Centre': 'h-[170px] md:h-[240px]',
      'Back To Roots': 'h-[170px] md:h-[240px]',
      'Bella Vita': 'h-[170px] md:h-[240px]',

      'Firefox': 'h-[145px] md:h-[200px]',
      'Leverage Edu': 'h-[145px] md:h-[200px]',
      'Veauli Techniks': 'h-[145px] md:h-[200px]',

      'Snow Leopard Trust': 'h-[130px] md:h-[180px]',
      'Earthy Souls': 'h-[130px] md:h-[180px]',
      'India Global Forum': 'h-[130px] md:h-[180px]',

      // REDUCED per request
      'EcoBiotraps': 'h-[100px] md:h-[130px]',

      'Arise Ventures': 'h-[65px] md:h-[85px]',
      'ORF': 'h-[65px] md:h-[85px]',
      'NSE': 'h-[50px] md:h-[70px]',
    };

    return (customSizes[name] || 'h-[75px] md:h-[100px]');
  };

  const getFilterClass = (name) => {
    if (name === 'Firefox') {
      return 'pbh-logo-vector-black-cutout';
    }
    if (['NSE', 'Arise Ventures'].includes(name)) {
      return 'pbh-logo-grayscale';
    }
    if (['Param Science Centre'].includes(name)) {
      return 'pbh-logo-vector-white-cutout';
    }
    return 'pbh-logo';
  };

  return (
    <motion.div
      className="pbh-slot group relative shrink-0 flex items-center justify-center h-full"
      animate={reduce ? undefined : { y: [0, i % 2 ? -3.5 : 3.5, 0] }}
      transition={{ duration: 5.5 + (i % 5) * 0.6, repeat: Infinity, ease: 'easeInOut', delay: (i % 6) * 0.4 }}
    >
      <div className="pbh-hover relative flex items-center justify-center">
        <span className="pbh-glow" aria-hidden="true" />
        <img
          src={logo.src}
          alt={logo.name}
          loading="lazy"
          decoding="async"
          draggable="false"
          className={`relative z-10 w-auto max-w-none select-none object-contain ${getSizeClass(logo.name)} ${getFilterClass(logo.name)}`}
        />
      </div>
    </motion.div>
  );
};

const PremiumLogoMarquee = () => {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const setWidth = useRef(0);
  const firstSet = useRef(null);

  const speedTarget = useRef(1);
  const speedCurrent = useRef(1);

  useEffect(() => {
    const measure = () => { if (firstSet.current) setWidth.current = firstSet.current.offsetWidth; };
    measure();
    const ro = new ResizeObserver(measure);
    if (firstSet.current) ro.observe(firstSet.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const w = setWidth.current;
    if (!w) return;
    speedCurrent.current += (speedTarget.current - speedCurrent.current) * Math.min(1, delta / 260);
    let next = x.get() - (BASE_SPEED * speedCurrent.current * delta) / 1000;
    if (next <= -w) next += w;      // seamless wrap
    else if (next > 0) next -= w;
    x.set(next);
  });

  return (
    <motion.section
      className="relative w-full overflow-hidden py-20 md:py-28"
      initial={{ opacity: 0, y: 40, filter: 'blur(16px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <svg className="hidden absolute w-0 h-0" aria-hidden="true">
        <filter id="pbh-smart-white-cutout">
          <feColorMatrix type="matrix" values="
            0.2126 0.7152 0.0722 0 0
            0.2126 0.7152 0.0722 0 0
            0.2126 0.7152 0.0722 0 0
            0 0 0 1 0
          " />
          <feComponentTransfer>
            <feFuncR type="linear" slope="20" intercept="-19" />
            <feFuncG type="linear" slope="20" intercept="-19" />
            <feFuncB type="linear" slope="20" intercept="-19" />
          </feComponentTransfer>
        </filter>
        <filter id="pbh-smart-black-cutout">
          <feColorMatrix type="matrix" values="
            0.2126 0.7152 0.0722 0 0
            0.2126 0.7152 0.0722 0 0
            0.2126 0.7152 0.0722 0 0
            0 0 0 1 0
          " />
          <feComponentTransfer>
            <feFuncR type="linear" slope="-10" intercept="1.5" />
            <feFuncG type="linear" slope="-10" intercept="1.5" />
            <feFuncB type="linear" slope="-10" intercept="1.5" />
          </feComponentTransfer>
        </filter>
      </svg>

      {/* Heading */}
      <motion.div
        className="text-center mb-12 md:mb-16 px-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
      >
        <p className="t-label text-white/40">
          Our Partners
        </p>
        <div className="mx-auto mt-5 h-px w-16 bg-white/10" />
      </motion.div>

      {/* Marquee — contained light panel so the logos read clearly */}
      <div className="w-full border-y border-black/10">
        <div
          className="relative w-full h-[160px] md:h-[190px] overflow-hidden"
          style={{ backgroundColor: '#d4cefc' }}
          onMouseEnter={() => { speedTarget.current = SLOW_FACTOR; }}
          onMouseLeave={() => { speedTarget.current = 1; }}
        >
          {/* Edge fades into the panel */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 md:w-40" style={{ background: 'linear-gradient(to right, #d4cefc, transparent)' }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 md:w-40" style={{ background: 'linear-gradient(to left, #d4cefc, transparent)' }} />

          {/* Track — two identical sets translated by a single motion value */}
          <motion.div className="absolute top-0 left-0 h-full flex w-max items-center will-change-transform gap-16 md:gap-28" style={{ x }}>
            <div ref={firstSet} className="flex items-center gap-16 md:gap-28 shrink-0 pl-16 md:pl-28">
              {LOGOS.map((logo, i) => <Logo key={`a-${i}`} logo={logo} i={i} reduce={reduce} />)}
            </div>
            <div className="flex items-center gap-16 md:gap-28 shrink-0 pl-16 md:pl-28" aria-hidden="true">
              {LOGOS.map((logo, i) => <Logo key={`b-${i}`} logo={logo} i={i} reduce={reduce} />)}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .pbh-logo {
          filter: brightness(0);
          opacity: 0.7;
          transition: filter 520ms cubic-bezier(0.16,1,0.3,1), opacity 520ms cubic-bezier(0.16,1,0.3,1);
        }
        .pbh-slot:hover .pbh-logo { 
          filter: brightness(1);
          opacity: 1; 
        }

        .pbh-logo-vector-white-cutout {
          filter: url(#pbh-smart-white-cutout);
          opacity: 0.7;
          transition: filter 520ms cubic-bezier(0.16,1,0.3,1), opacity 520ms cubic-bezier(0.16,1,0.3,1);
        }
        .pbh-slot:hover .pbh-logo-vector-white-cutout { 
          filter: none;
          opacity: 1;
        }

        .pbh-logo-grayscale {
          filter: grayscale(100%) contrast(1.5) brightness(0.6);
          opacity: 0.8;
          transition: filter 520ms cubic-bezier(0.16,1,0.3,1), opacity 520ms cubic-bezier(0.16,1,0.3,1);
        }
        .pbh-slot:hover .pbh-logo-grayscale { 
          filter: grayscale(0%) contrast(1) brightness(1);
          opacity: 1;
        }

        .pbh-logo-vector-black-cutout {
          filter: url(#pbh-smart-black-cutout);
          opacity: 0.7;
          transition: filter 520ms cubic-bezier(0.16,1,0.3,1), opacity 520ms cubic-bezier(0.16,1,0.3,1);
        }
        .pbh-slot:hover .pbh-logo-vector-black-cutout { 
          filter: none;
          opacity: 1;
        }

        .pbh-hover {
          transition: transform 0.3s ease;
        }
        .pbh-slot:hover .pbh-hover { transform: translateY(-5px) scale(1.06); }

        .pbh-glow {
          position: absolute;
          left: 50%; top: 50%;
          width: 200px; height: 130px;
          transform: translate(-50%,-50%) scale(0.7);
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
          filter: blur(26px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 520ms cubic-bezier(0.16,1,0.3,1),
                      transform 520ms cubic-bezier(0.16,1,0.3,1);
        }
        .pbh-slot:hover .pbh-glow { opacity: 1; transform: translate(-50%,-50%) scale(1); }

        @media (prefers-reduced-motion: reduce) {
          .pbh-logo, .pbh-hover, .pbh-glow { transition: none; }
        }
      `}</style>
    </motion.section>
  );
};

export default PremiumLogoMarquee;
