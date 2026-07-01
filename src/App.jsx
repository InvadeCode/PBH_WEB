import React, { useState, useEffect, useRef, createContext, useContext, lazy, Suspense, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { jsPDF } from 'jspdf';
import ExcelJS from 'exceljs';
import { useSanity } from './lib/useSanity';
import { useEditableUiCopy } from './lib/useEditableUiCopy';
import { CASE_STUDIES_QUERY, GET_JOURNAL_ARTICLES, GET_PROBLEM_DATA, GET_QUIZ_QUESTIONS, GET_ROUTES_INFO, GET_DELIVERABLES, GET_SITE_SETTINGS, GET_TEAM_MEMBERS, GET_CORE_VALUES, GET_TIMELINE, GET_FRAMEWORK, GET_FAQS } from './lib/sanityQueries';
import { normalizeCaseStudyUrlId, orderCaseStudies } from './lib/caseStudyOrdering';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring, useMotionValue, useMotionTemplate, useAnimationFrame } from 'framer-motion';
import {
  ArrowRight, Sparkles, Zap, CheckCircle2,
  ArrowLeft, ArrowDown, Menu, X, Globe, MoveRight,
  Lightbulb, BookOpen, Fingerprint, Dna, Rocket,
  Mail, MessageSquare, Terminal, Layers, Compass, PenTool,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Check, Briefcase, FileText, User, Users, Activity,
  Shield, Lock, Scale, Target, BarChart2, Command, ArrowUpRight, CheckSquare,
  Quote, Printer, Download, MonitorPlay, MapPin, Phone, Clock, Plus, Loader2, AlertCircle,
  UploadCloud, Paperclip
} from 'lucide-react';
const BackToRootsExperience = lazy(() => import('./components/case-studies/BackToRootsExperience'));
const ParamInnovationExperience = lazy(() => import('./components/case-studies/ParamInnovationExperience'));
const SnowLeopardExperience = lazy(() => import('./components/case-studies/SnowLeopardExperience'));
const AriseVenturesExperience = lazy(() => import('./components/case-studies/AriseVenturesExperience'));
const FirefoxExperience = lazy(() => import('./components/case-studies/FirefoxExperience'));
const LegacyExperience = lazy(() => import('./components/case-studies/LegacyExperience'));
const GenericStorytellingExperience = lazy(() => import('./components/case-studies/GenericStorytellingExperience'));
import CaseStudyTeamCredits from './components/case-studies/CaseStudyTeamCredits';
import CaseStudyMedia from './components/case-studies/CaseStudyMedia';

import PremiumLogoMarquee from './components/PremiumLogoMarquee';

export const GlobalContext = createContext(null);

const normalizeCaseStudyTags = (value) => {
  const values = Array.isArray(value) ? value : [value];
  const seen = new Set();

  return values.flatMap((tag) => {
    const raw = typeof tag === 'string'
      ? tag
      : tag?.title || tag?.label || tag?.name || tag?.value || tag?.tag || '';

    return String(raw)
      .split(/[,;\n]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }).filter((tag) => {
    const key = tag.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getVisibleCaseStudyTags = (caseStudy, limit = 3) => (
  normalizeCaseStudyTags(caseStudy?.tags).slice(0, limit)
);

const isSnowLeopardCaseStudy = (caseStudy) => (
  /snow\s*leopard/i.test(`${caseStudy?.client || ''} ${caseStudy?.id || ''}`)
);

const getCaseStudyThumbnailMediaProps = (caseStudy) => {
  const clientName = (caseStudy?.client || '').toLowerCase();
  const isSamskara = clientName.includes('observer research') || clientName.includes('samskara');
  const isSLT = isSnowLeopardCaseStudy(caseStudy);
  
  return {
    className: `w-full h-full object-cover transition-transform duration-1000 ease-out ${isSamskara ? 'scale-[1.7] group-hover:scale-[1.8]' : 'group-hover:scale-105'}`,
    style: isSLT ? { objectPosition: '14% center' } : undefined,
  };
};

// --- RESEND CONFIGURATION ---
// Configuration moved to Vercel environment variables securely.
// See api/send-email.js

const sendEmailViaResend = async (subject, htmlContent, attachments = [], toEmail = null) => {
  try {
    const payload = {
      subject: subject,
      htmlContent: htmlContent,
      to: toEmail
    };

    if (attachments && attachments.length > 0) {
      payload.attachments = attachments;
    }

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// --- NEW CAREERS MODAL COMPONENT ---
// --- NEW CAREERS MODAL COMPONENT ---
const CareersModal = ({ onClose, formDataSettings }) => {
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  // New state for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    summary: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file (.pdf only).");
      e.target.value = null;
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please attach your CV (PDF).");
      return;
    }
    setIsSubmitting(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Content = reader.result.split(',')[1];

      // Beautifully formatted email body with all the new data
      const htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #6865FA;">New Profile Submission</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>LinkedIn:</strong> <a href="${formData.linkedin}">${formData.linkedin}</a></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
          <h3 style="color: #333;">Summary:</h3>
          <p style="white-space: pre-wrap; color: #555; line-height: 1.6;">${formData.summary}</p>
        </div>
      `;

      const result = await sendEmailViaResend(
        `New Application: ${formData.name}`,
        htmlContent,
        [{ filename: file.name, content: base64Content }]
      );

      setIsSubmitting(false);
      if (result.success) {
        setStatus('success');
        setTimeout(() => onClose(), 3000);
      } else {
        setStatus('error');
      }
    };
  };

  return (
    <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0A103D] border border-white/10 p-8 sm:p-10 rounded-[24px] max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <h3 className="text-xl md:text-2xl font-light mb-2 text-white font-primary">{formDataSettings?.careersModalTitle || 'Want to work with us?'}</h3>
        <p className="text-white/50 mb-8 font-secondary text-[17px] md:text-[19px] leading-relaxed">
          {formDataSettings?.careersModalText || 'We are always looking for visionary strategists and artists. Send us your profile below.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder={formDataSettings?.namePlaceholder || 'Full Name'} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-4 py-3 text-white text-[17px] md:text-[19px] focus:outline-none transition-colors focus:border-white/30 font-secondary" />
            <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder={formDataSettings?.phonePlaceholder || 'Phone Number'} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-4 py-3 text-white text-[17px] md:text-[19px] focus:outline-none transition-colors focus:border-white/30 font-secondary" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder={formDataSettings?.emailPlaceholder || 'Email Address'} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-4 py-3 text-white text-[17px] md:text-[19px] focus:outline-none transition-colors focus:border-white/30 font-secondary" />
            <input required name="linkedin" value={formData.linkedin} onChange={handleInputChange} type="url" placeholder={formDataSettings?.linkedinPlaceholder || 'LinkedIn Profile URL'} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-4 py-3 text-white text-[17px] md:text-[19px] focus:outline-none transition-colors focus:border-white/30 font-secondary" />
          </div>

          <textarea required name="summary" value={formData.summary} onChange={handleInputChange} placeholder={formDataSettings?.summaryPlaceholder || 'Tell us about yourself and what you do best...'} rows="4" className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-4 py-3 text-white text-[17px] md:text-[19px] focus:outline-none transition-colors focus:border-white/30 font-secondary resize-none custom-scrollbar" />

          <div className="border border-white/10 bg-white/[0.02] rounded-[16px] p-2 overflow-hidden focus-within:border-white/30 transition-colors mt-2">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
              className="w-full text-[17px] md:text-[19px] text-white/60 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer font-secondary cursor-pointer"
            />
          </div>

          <div className="pt-4">
            {status === 'success' ? (
              <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-[12px] text-center font-secondary text-[17px] md:text-[19px]">
                Profile sent successfully!
              </div>
            ) : status === 'error' ? (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-[12px] text-center font-secondary text-[17px] md:text-[19px]">
                Failed to send. Please try again or email us directly.
              </div>
            ) : (
              <button
                disabled={!file || isSubmitting}
                type="submit"
                className="w-full py-4 rounded-[12px] bg-white text-black font-medium text-[17px] md:text-[19px] font-secondary hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {formDataSettings?.sendingText || 'Sending...'}</> : (formDataSettings?.sendProfileBtn || 'Send Profile')}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};



const palette = {
  // ── Primary Colours ──
  bg: '#010d54',        // 30% Navy
  bgDeep: '#010d54',    // Navy (solid, no fake shadows)
  panel: '#0c185c',     // Elevated Navy for cards
  primary: '#6865fa',   // 60% Purple — dominant surfaces, buttons, key UI
  secondary: '#d4cefc', // 30% Light Purple — soft backgrounds, text highlights
  blue: '#2a97d9',      // Secondary: Medium Blue — links, interactive accents
  accent: '#ffcd00',    // 10% Yellow — notification dots, tiny badges only
  // ── Secondary Colours ──
  purple: '#a173dd',    // Lavender Purple — hover states, tags, soft accents
  green: '#93d435',     // Lime Green — success indicators, status badges
  orange: '#b9d5ff',    // Light Blue — section tints, card borders, subtle fills
  text: '#F4F4F5',
  charcoal: '#302f2f',  // Dark Charcoal — footer, deep contrast sections
  lightBlue: '#b9d5ff', // Light Blue alias
  medBlue: '#2a97d9',   // Medium Blue alias
  lavender: '#af73dd',  // Lavender alias
  lime: '#93d435',      // Lime alias
  fonts: {
    primary: "'Space Grotesk', sans-serif",
    secondary: "'Karla', sans-serif"
  }
};

// ─── FRONT-PAGE 60·30·10 COLOR DISTRIBUTION ──────────────────────────────
// The brand palette, beautifully divided across the homepage:
//   • 60% Purple   #6865fa  — dominant. Carries the largest surfaces (hero, key sections, CTA).
//   • 30% Navy + Lavender   #010d54 / #d4cefc  — supporting bands that frame the purple.
//   • 10% Yellow   #ffcd00  — accents only (dots, labels, CTA glow, one divider).
// Applied PER SECTION on the front page; the global `palette` is left unchanged
// so every sub-page keeps its current look.
const SURFACE = {
  purple:     '#6865fa',  // solid statement surfaces — white text reads at AA here
  // content sections: a visible #6865fa band at the top melting into deep indigo,
  // so dominant purple stays on screen while muted white copy remains readable.
  purpleDeep: 'linear-gradient(180deg, #6865fa 0%, #2e2b96 34%, #131258 100%)',
  navy:       '#010d54',
  lavender:   '#d4cefc',
  ink:        '#010d54',  // dark text for light (lavender) sections
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
  {
    id: 'q1_stage',
    title: 'What stage is your brand currently in?',
    multiSelect: false,
    options: [
      { id: 'q1_s1', label: 'We are launching a new brand', routes: [{ id: 'BB', weight: 3 }, { id: 'SAS', weight: 1 }] },
      { id: 'q1_s2', label: 'We are refreshing an existing brand', routes: [{ id: 'BB', weight: 2 }, { id: 'STC', weight: 1 }] },
      { id: 'q1_s3', label: 'We are scaling into new markets or audiences', routes: [{ id: 'BB', weight: 2 }, { id: 'SAS', weight: 2 }, { id: 'STC', weight: 1 }] },
      { id: 'q1_s4', label: 'We have multiple offerings and need more clarity', routes: [{ id: 'SAS', weight: 2 }, { id: 'BB', weight: 2 }] },
      { id: 'q1_s5', label: 'We have a brand, but it does not feel aligned anymore', routes: [{ id: 'BB', weight: 3 }] },
    ]
  },
  {
    id: 'q2_unclear',
    title: 'What feels unclear or inconsistent right now?',
    multiSelect: true,
    options: [
      { id: 'q2_o1', label: 'Our messaging changes across platforms', routes: [{ id: 'BB', weight: 2 }, { id: 'STC', weight: 1 }] },
      { id: 'q2_o2', label: 'Our internal teams interpret the brand differently', routes: [{ id: 'BB', weight: 3 }] },
      { id: 'q2_o3', label: 'Our logo, colours, or visuals do not feel strong enough', routes: [{ id: 'BB', weight: 3 }] },
      { id: 'q2_o4', label: 'Our brand story is not clear', routes: [{ id: 'SAS', weight: 3 }] },
      { id: 'q2_o5', label: 'Our decks, templates, and collaterals are inconsistent', routes: [{ id: 'BB', weight: 2 }] },
      { id: 'q2_o6', label: 'Our audience does not fully understand what we do', routes: [{ id: 'SAS', weight: 2 }, { id: 'STC', weight: 1 }] },
    ]
  },
  {
    id: 'q3_build',
    title: 'What are you trying to build or improve?',
    multiSelect: true,
    options: [
      { id: 'q3_o1', label: 'A full brand identity', routes: [{ id: 'BB', weight: 3 }] },
      { id: 'q3_o2', label: 'A stronger story for our product, innovation, or institution', routes: [{ id: 'SAS', weight: 3 }] },
      { id: 'q3_o3', label: 'A scalable design system', routes: [{ id: 'BB', weight: 3 }] },
      { id: 'q3_o4', label: 'Website structure and content', routes: [{ id: 'STC', weight: 2 }, { id: 'SAS', weight: 1 }] },
      { id: 'q3_o5', label: 'Social media and content direction', routes: [{ id: 'STC', weight: 3 }] },
      { id: 'q3_o6', label: 'Launch or go-to-market communication', routes: [{ id: 'SAS', weight: 2 }, { id: 'STC', weight: 1 }] },
      { id: 'q3_o7', label: 'Event, experience, or on-ground branding', routes: [{ id: 'STC', weight: 2 }, { id: 'BB', weight: 1 }] },
      { id: 'q3_o8', label: 'Merchandise, kits, or brand collectibles', routes: [{ id: 'SAS', weight: 2 }, { id: 'BB', weight: 1 }] },
    ]
  },
  {
    id: 'q4_showup',
    title: 'Where will this brand need to show up?',
    multiSelect: true,
    options: [
      { id: 'q4_o1', label: 'Website', routes: [{ id: 'STC', weight: 2 }] },
      { id: 'q4_o2', label: 'Social media', routes: [{ id: 'STC', weight: 2 }] },
      { id: 'q4_o3', label: 'Investor or stakeholder decks', routes: [{ id: 'SAS', weight: 2 }, { id: 'BB', weight: 1 }] },
      { id: 'q4_o4', label: 'Internal teams', routes: [{ id: 'BB', weight: 2 }] },
      { id: 'q4_o5', label: 'Events or conferences', routes: [{ id: 'STC', weight: 2 }] },
      { id: 'q4_o6', label: 'Physical spaces', routes: [{ id: 'BB', weight: 2 }] },
      { id: 'q4_o7', label: 'Product packaging', routes: [{ id: 'BB', weight: 1 }, { id: 'SAS', weight: 2 }] },
      { id: 'q4_o8', label: 'Creator or community activations', routes: [{ id: 'SAS', weight: 2 }, { id: 'STC', weight: 1 }] },
      { id: 'q4_o9', label: 'Policy, research, or knowledge platforms', routes: [{ id: 'SAS', weight: 3 }] },
    ]
  },
  {
    id: 'q5_support',
    title: 'What kind of support are you expecting from PBH?',
    multiSelect: true,
    options: [
      { id: 'q5_o1', label: 'Help us diagnose what is missing', routes: [{ id: 'BB', weight: 2 }] },
      { id: 'q5_o2', label: 'Help us build the brand foundation', routes: [{ id: 'BB', weight: 3 }] },
      { id: 'q5_o3', label: 'Help us explain a complex idea simply', routes: [{ id: 'SAS', weight: 3 }] },
      { id: 'q5_o4', label: 'Help us create a complete visual system', routes: [{ id: 'BB', weight: 3 }] },
      { id: 'q5_o5', label: 'Help us prepare for launch or scale', routes: [{ id: 'SAS', weight: 2 }, { id: 'STC', weight: 1 }] },
      { id: 'q5_o6', label: 'Help us create content and communication systems', routes: [{ id: 'STC', weight: 3 }] },
      { id: 'q5_o7', label: 'Help us create brand experiences or events', routes: [{ id: 'SAS', weight: 2 }, { id: 'STC', weight: 2 }] },
    ]
  },
  {
    id: 'q6_duration',
    title: 'What kind of engagement are you looking for?',
    multiSelect: false,
    hint: 'At PBH, meaningful brand-building usually needs a medium to long-term process. Choose the engagement window closest to your current need.',
    options: [
      { id: 'q6_o1', label: '6-month engagement', desc: 'Best for a focused but complete brand-building process across strategy, identity, and communication systems.' },
      { id: 'q6_o2', label: '1-year engagement', desc: 'Best for long-term brand transformation, rollout, ecosystem storytelling, and sustained communication.' },
      { id: 'q6_o3', label: '3-month focused engagement', desc: 'Best for limited-scope interventions with fewer deliverables.' },
    ]
  },
];

// Default blueprint deliverables auto-selected per route
const ROUTE_BLUEPRINTS = {
  'BB':  ['D001','D002','D003','D004','D005','D006','D007','D008','D009','D010','D011','D012','D013','D014','D015','D016','D017','D018','D019','D020','D021','D022','D023','D024','D025','D026','D027'],
  'SAS': ['D037','D038','D039','D040','D041','D042','D043','D044','D045','D046','D047','D048','D049','D050','D051','D054','D055','D056','D057','D058','D059','D060','D061','D062','D063','D064','D065'],
  'STC': ['D066','D067','D068','D069','D070','D071','D072','D073','D074','D075','D077','D078','D079','D080','D081','D082','D083','D084','D087','D088','D089','D090','D091','D092','D094'],
};

// 3-month: foundational deliverables only (one route, max 8 items)
const ROUTE_BLUEPRINTS_3M = {
  'BB':  ['D001','D002','D003','D004','D005','D006','D007','D008'],
  'SAS': ['D037','D038','D039','D040','D041','D042','D043','D058'],
  'STC': ['D066','D067','D068','D069','D070','D071','D087','D088'],
};

const TEAM_MEMBERS_MASTER = [
  { id: "leader_1", name: "Founder Name", role: "Chief Executive Officer", bio: "Visionary leader driving the SciArt philosophy and global strategy.", image: null },
  { id: "leader_2", name: "Partner Name", role: "Creative Director", bio: "The artistic force translating complex logic into stunning visual narratives.", image: null },
  { id: "creator_1", name: "Creator 1", role: "Brand Strategist", image: null },
  { id: "creator_2", name: "Creator 2", role: "Lead Designer", image: null },
  { id: "creator_3", name: "Creator 3", role: "Storyteller", image: null },
  { id: "creator_4", name: "Creator 4", role: "Digital Architect", image: null }
];

const CORE_VALUES_MASTER = [
  { id: "cv_1", title: "Collaboration", desc: "We co-create with you, not for you." },
  { id: "cv_2", title: "Science & Art", desc: "We bridge the divide between logic and imagination." },
  { id: "cv_3", title: "Creator Empowerment", desc: "We ignite your vision with the fuel of science and art." },
  { id: "cv_4", title: "Future-Oriented", desc: "We don't just build brands, we build legacies for the future." }
];

const TIMELINE_MASTER = [
  { id: "tl_1", year: "The Inception", title: "Identifying the Gap", desc: "Recognizing that Indian innovators lacked a premium voice on the global stage, the foundation of PBH was conceptualized." },
  { id: "tl_2", year: "The Framework", title: "Building the SciArt Method", desc: "Developing our proprietary framework that ensures every aesthetic decision is backed by strategic logic." },
  { id: "tl_3", year: "The Expansion", title: "The Global Shift", desc: "Co-creating with breakthrough brands worldwide, establishing the House as a premium strategic partner." }
];

const FRAMEWORK_MASTER = [
  { id: "fw_1", stepNumber: "1", title: "Discovery", description: "We begin by understanding the business, audience, market, internal teams, communication gaps, and growth context. We dig deep into the core mechanics of your innovation.", outputs: ["Brand Audit", "Stakeholder Interviews", "Competitor Landscape Mapping"] },
  { id: "fw_2", stepNumber: "2", title: "Clarity & Alignment", description: "We identify exactly where the brand is breaking — whether it's messaging, identity, storytelling, systems, campaigns, or internal execution pipelines.", outputs: ["Problem Clusters Identified", "Gap Analysis Document"] },
  { id: "fw_3", stepNumber: "3", title: "Route Mapping", description: "Based on these insights, we recommend one or more dedicated service ecosystems: Brand Boulevard (Identity), SciArt Saga (Innovation Story), or Storytelling Corner (Campaigns).", outputs: ["Strategic Route Assignment", "Resource Allocation"] },
  { id: "fw_4", stepNumber: "4", title: "Scope Building", description: "We lock in the foundation. Each route is broken down into specific line items, deliverables, priorities, dependencies, and precise timelines.", outputs: ["Custom Scope Blueprint", "Project Roadmap"] }
];

const FAQS_MASTER = [
  { id: "faq_1", question: "Do you work with international clients?", answer: "Yes. While our roots and Global HQ are in India, we co-create with breakthrough innovators all over the world." },
  { id: "faq_2", question: "Do you take on execution-only work?", answer: "Rarely. We believe execution without strategy is bound to fail. We prefer to build the strategic foundation first." }
];

const ROUTES_INFO = {
  'BB': { id: 'BB', title: 'Brand Boulevard', desc: 'Identity, positioning, messaging, and comprehensive brand systems.', expandedDesc: `You know that moment when your website says one thing, your pitch says another, and your product feels like a third story altogether.\n\nAnd somewhere in between, you're still trying to explain what you really do.\n\nThat feeling doesn't go away by designing one more thing.\n\nBrand Boulevard is where we sit with that discomfort.\n\nWe ask what hasn't been asked.\nWe align what your brand actually stands for.\nAnd then we build systems that carry that clarity everywhere.\n\nFrom Brand Workshops & Audits to Identity Systems to Design Systems to Collaterals that don't feel like an afterthought.\n\nFor Firefox Bicycles, this didn't stay on paper. It became a toddler product universe, where the brand started shaping the product itself.\n\nBecause when things align, you don't have to keep explaining. People just get it.`, icon: <Fingerprint className="w-6 h-6" />, type: 'primary', bestFor: 'Companies seeking a complete structural overhaul, from foundational positioning to a scalable visual identity system.', lineItems: [{ id: 'BB1', name: 'Brand workshop and Audit', desc: 'In-depth collaborative sessions to uncover core business gaps.' }, { id: 'BB2', name: 'Brand identity system', desc: 'Comprehensive visual and verbal identity creation.' }, { id: 'BB3', name: 'Design system', desc: 'Scalable component libraries for consistent execution.' }, { id: 'BB4', name: 'Giveaways, and collaterals', desc: 'Physical touchpoints that reinforce brand presence.' }] },
  'SAS': { id: 'SAS', title: 'Sci- Art Saga', desc: 'Storytelling, innovation communication, and experience-led narratives.', expandedDesc: `You know that kind of work people find fascinating but can't fully hold on to?\n\nThey understand it in the meeting. They nod. They ask the right questions.\n\nBut a few days later, the idea hasn't travelled.\n\nNot because the work isn't strong. Because it hasn't found its breakthrough expression yet.\n\nThat's where SciArt Saga comes in.\n\nWe bring logic and imagination together. Structure and story. Complex thinking and human feeling.\n\nWe take your work apart carefully through Innovation & Science Frameworks, then rebuild it into something people can understand, remember, and respond to.\n\nWe shape experiences and IP, build product stories that stay, and define Go-To-Market communication that carries the idea forward.\n\nFor Snow Leopard Trust, this meant making conservation feel closer, not distant.\n\nFor IIT Delhi's Centre of Excellence in Regulatory Affairs, it means translating electricity regulation into something people can navigate, not just read.\n\nBecause when something is truly understood, it doesn't need to be simplified.\n\nIt needs the right expression.`, icon: <Lightbulb className="w-6 h-6" />, type: 'blue', bestFor: 'Deep-tech or highly complex innovations needing to translate technical features into compelling, human-centric stories.', lineItems: [{ id: 'SS1', name: 'Innovation frameworks', desc: 'Structuring complex ideas into digestible core concepts.' }, { id: 'SS2', name: 'Experience and IP strategy', desc: 'Mapping user journeys and protecting core narratives.' }, { id: 'SS3', name: 'Product storytelling', desc: 'Translating technical features into compelling human stories.' }, { id: 'SS4', name: 'GTM communication', desc: 'Strategic messaging for successful market entry.' }] },
  'STC': { id: 'STC', title: 'Storytelling corner', desc: 'Campaign ideas, creative direction, and execution-ready content.', expandedDesc: `You're showing up everywhere. But it doesn't feel like the same brand.\n\nYour social feels one way. Your website, another. Your events feel like they belong to a different world.\n\nAnd you can sense it. Even if you can't fully explain it.\n\nThat gap? That's where trust quietly drops.\n\nStorytelling Corner is where we bring it all together.\n\nWe define how your brand should feel - through Creative Direction\n- shape how it speaks through Social & Influencer Strategy\n- structure how it's experienced through Website Frameworks\n- and carry it into the real world through Event Branding\n\nFor Observer Research Foundation's Raisina Dialogue 2026, this meant creating a single, cohesive experience across a global stage.\n\nFor National Stock Exchange of India, our work focuses on building design and information systems across collaterals, so everything feels like it comes from one place.\n\nBecause people don't remember isolated moments. They remember how consistently you showed up.`, icon: <Rocket className="w-6 h-6" />, type: 'purple', bestFor: 'Established brands looking for high-impact campaign execution, continuous content systems, and creative direction.', lineItems: [{ id: 'SC1', name: 'Creative direction', desc: 'Guiding the overarching artistic vision for campaigns.' }, { id: 'SC2', name: 'Social and influencer website framework', desc: 'Dynamic content strategies and digital home structuring.' }, { id: 'SC4', name: 'Event branding', desc: 'Immersive environmental design for physical activations.' }] }
};

const DELIVERABLES_MASTER = [
  { id: 'D001', lineItem: 'BB1', name: 'Brand Discovery Workshop', interdependence: 'None' },
  { id: 'D002', lineItem: 'BB1', name: 'Brand Audit', interdependence: 'None' },
  { id: 'D003', lineItem: 'BB1', name: 'Stakeholder Interviews Summary', interdependence: 'D001' },
  { id: 'D004', lineItem: 'BB1', name: 'Competitor Landscape Mapping', interdependence: 'D002' },
  { id: 'D005', lineItem: 'BB1', name: 'Audience Understanding Snapshot', interdependence: 'D001' },
  { id: 'D006', lineItem: 'BB1', name: 'Brand Gap Analysis', interdependence: 'D002, D003, D004' },
  { id: 'D007', lineItem: 'BB1', name: 'Positioning Territories', interdependence: 'D006' },
  { id: 'D008', lineItem: 'BB1', name: 'Workshop Summary Deck', interdependence: 'D001, D006' },
  { id: 'D009', lineItem: 'BB2', name: 'Logo (Primary)', interdependence: 'D007' },
  { id: 'D010', lineItem: 'BB2', name: 'Logo Variations', interdependence: 'D009' },
  { id: 'D011', lineItem: 'BB2', name: 'Logo Usage Guidelines', interdependence: 'D009' },
  { id: 'D012', lineItem: 'BB2', name: 'Typography System', interdependence: 'D007' },
  { id: 'D013', lineItem: 'BB2', name: 'Color Palette', interdependence: 'D007' },
  { id: 'D014', lineItem: 'BB2', name: 'Visual Language', interdependence: 'D009, D013' },
  { id: 'D015', lineItem: 'BB2', name: 'Iconography Style', interdependence: 'D014' },
  { id: 'D016', lineItem: 'BB2', name: 'Imagery Direction', interdependence: 'D014' },
  { id: 'D017', lineItem: 'BB2', name: 'Brand Guidelines', interdependence: 'D009, D012, D013, D014' },
  { id: 'D018', lineItem: 'BB2', name: 'Quick Brand Reference Sheet', interdependence: 'D017' },
  { id: 'D019', lineItem: 'BB3', name: 'Layout Grid System', interdependence: 'D017' },
  { id: 'D020', lineItem: 'BB3', name: 'Typography Hierarchy', interdependence: 'D012' },
  { id: 'D021', lineItem: 'BB3', name: 'Color Application Rules', interdependence: 'D013' },
  { id: 'D022', lineItem: 'BB3', name: 'Visual Consistency Rules', interdependence: 'D014' },
  { id: 'D023', lineItem: 'BB3', name: 'Social Templates', interdependence: 'D019, D021' },
  { id: 'D024', lineItem: 'BB3', name: 'Presentation Templates', interdependence: 'D019' },
  { id: 'D025', lineItem: 'BB3', name: 'Document Templates', interdependence: 'D019' },
  { id: 'D026', lineItem: 'BB3', name: 'UI Components', interdependence: 'D019, D014' },
  { id: 'D027', lineItem: 'BB3', name: 'Design System Manual', interdependence: 'D019-D026' },
  { id: 'D028', lineItem: 'BB4', name: 'Visiting Cards', interdependence: 'D017' },
  { id: 'D029', lineItem: 'BB4', name: 'Letterheads', interdependence: 'D017' },
  { id: 'D030', lineItem: 'BB4', name: 'Email Signatures', interdependence: 'D017' },
  { id: 'D031', lineItem: 'BB4', name: 'Merchandise', interdependence: 'D014' },
  { id: 'D032', lineItem: 'BB4', name: 'Brochures / Flyers', interdependence: 'D017' },
  { id: 'D033', lineItem: 'BB4', name: 'Lanyards / Badges', interdependence: 'D034' },
  { id: 'D034', lineItem: 'BB4', name: 'Event Collaterals', interdependence: 'D014' },
  { id: 'D035', lineItem: 'BB4', name: 'Packaging Design', interdependence: 'D013, D014' },
  { id: 'D036', lineItem: 'BB4', name: 'Packaging System', interdependence: 'D035' },
  { id: 'D037', lineItem: 'SS1', name: 'Innovation Framework', interdependence: 'None' },
  { id: 'D038', lineItem: 'SS1', name: 'Concept Simplification Models', interdependence: 'D037' },
  { id: 'D039', lineItem: 'SS1', name: 'Science-to-Human Translation', interdependence: 'D038' },
  { id: 'D040', lineItem: 'SS1', name: 'Narrative Framework', interdependence: 'D037' },
  { id: 'D041', lineItem: 'SS1', name: 'Metaphor Systems', interdependence: 'D040' },
  { id: 'D042', lineItem: 'SS1', name: 'Knowledge Architecture', interdependence: 'D037' },
  { id: 'D043', lineItem: 'SS1', name: 'Framework Deck', interdependence: 'D037-D042' },
  { id: 'D044', lineItem: 'SS2', name: 'Brand IP Concepts', interdependence: 'D040' },
  { id: 'D045', lineItem: 'SS2', name: 'Experience Concepts', interdependence: 'D044' },
  { id: 'D046', lineItem: 'SS2', name: 'Signature Properties', interdependence: 'D044' },
  { id: 'D047', lineItem: 'SS2', name: 'Campaignable Formats', interdependence: 'D044' },
  { id: 'D048', lineItem: 'SS2', name: 'Ecosystem Hooks', interdependence: 'D044' },
  { id: 'D049', lineItem: 'SS2', name: 'Story Arcs', interdependence: 'D040' },
  { id: 'D050', lineItem: 'SS2', name: 'IP Strategy Document', interdependence: 'D044-D049' },
  { id: 'D051', lineItem: 'SS3', name: 'Product Narrative', interdependence: 'D040' },
  { id: 'D052', lineItem: 'SS3', name: 'Feature-Benefit Mapping', interdependence: 'D051' },
  { id: 'D053', lineItem: 'SS3', name: 'Use-case Storytelling', interdependence: 'D052' },
  { id: 'D054', lineItem: 'SS3', name: 'Product Positioning', interdependence: 'D051' },
  { id: 'D055', lineItem: 'SS3', name: 'Product Naming', interdependence: 'D054' },
  { id: 'D056', lineItem: 'SS3', name: 'Packaging Story', interdependence: 'D051' },
  { id: 'D057', lineItem: 'SS3', name: 'Product Story Deck', interdependence: 'D051-D056' },
  { id: 'D058', lineItem: 'SS4', name: 'GTM Narrative', interdependence: 'D051' },
  { id: 'D059', lineItem: 'SS4', name: 'Messaging Framework', interdependence: 'D058' },
  { id: 'D060', lineItem: 'SS4', name: 'Audience Segmentation', interdependence: 'D058' },
  { id: 'D061', lineItem: 'SS4', name: 'Campaign Hooks', interdependence: 'D059' },
  { id: 'D062', lineItem: 'SS4', name: 'Launch Concepts', interdependence: 'D061' },
  { id: 'D063', lineItem: 'SS4', name: 'Content Direction', interdependence: 'D059' },
  { id: 'D064', lineItem: 'SS4', name: 'Rollout Plan', interdependence: 'D058' },
  { id: 'D065', lineItem: 'SS4', name: 'GTM Playbook', interdependence: 'D058-D064' },
  { id: 'D066', lineItem: 'SC1', name: 'Campaign Concepts', interdependence: 'D061' },
  { id: 'D067', lineItem: 'SC1', name: 'Visual Direction Boards', interdependence: 'D014' },
  { id: 'D068', lineItem: 'SC1', name: 'Content Themes', interdependence: 'D072' },
  { id: 'D069', lineItem: 'SC1', name: 'Art Direction', interdependence: 'D067' },
  { id: 'D070', lineItem: 'SC1', name: 'Shoot Direction', interdependence: 'D069' },
  { id: 'D071', lineItem: 'SC1', name: 'Creative Deck', interdependence: 'D066-D070' },
  { id: 'D072', lineItem: 'SC2', name: 'Content Strategy', interdependence: 'D059' },
  { id: 'D073', lineItem: 'SC2', name: 'Content Buckets', interdependence: 'D072' },
  { id: 'D074', lineItem: 'SC2', name: 'Monthly Plan', interdependence: 'D073' },
  { id: 'D075', lineItem: 'SC2', name: 'Influencer Strategy', interdependence: 'D072' },
  { id: 'D076', lineItem: 'SC2', name: 'Campaign Ideas', interdependence: 'D061' },
  { id: 'D077', lineItem: 'SC2', name: 'Post/Reel Directions', interdependence: 'D072' },
  { id: 'D078', lineItem: 'SC2', name: 'Engagement Hooks', interdependence: 'D072' },
  { id: 'D079', lineItem: 'SC2', name: 'Social Playbook', interdependence: 'D072-D078' },
  { id: 'D080', lineItem: 'SC2', name: 'Information Architecture', interdependence: 'D058' },
  { id: 'D081', lineItem: 'SC2', name: 'Page Flow', interdependence: 'D080' },
  { id: 'D082', lineItem: 'SC2', name: 'User Journey Mapping', interdependence: 'D080' },
  { id: 'D083', lineItem: 'SC2', name: 'Copy Direction', interdependence: 'D058' },
  { id: 'D084', lineItem: 'SC2', name: 'Interaction Ideas', interdependence: 'D081' },
  { id: 'D085', lineItem: 'SC2', name: 'CTA Strategy', interdependence: 'D058' },
  { id: 'D086', lineItem: 'SC2', name: 'Developer Brief', interdependence: 'D080-D085' },
  { id: 'D087', lineItem: 'SC4', name: 'Event Theme', interdependence: 'D058' },
  { id: 'D088', lineItem: 'SC4', name: 'Event Identity', interdependence: 'D087' },
  { id: 'D089', lineItem: 'SC4', name: 'Stage Design', interdependence: 'D088' },
  { id: 'D090', lineItem: 'SC4', name: 'Collateral System', interdependence: 'D088' },
  { id: 'D091', lineItem: 'SC4', name: 'Delegate Kits', interdependence: 'D090' },
  { id: 'D092', lineItem: 'SC4', name: 'Signage System', interdependence: 'D090' },
  { id: 'D093', lineItem: 'SC4', name: 'Hybrid Integration', interdependence: 'D088' },
  { id: 'D094', lineItem: 'SC4', name: 'Event Toolkit', interdependence: 'D087-D093' }
];

// O(1) lookup map — avoids repeated .find() across renders
const DELIVERABLES_BY_ID = new Map(DELIVERABLES_MASTER.map(d => [d.id, d]));

const CASE_STUDIES = [
  {
    id: 'cs0',
    client: 'Arise Ventures',
    sector: 'Venture Capital',
    challenge: 'Designing a fearless identity for bold capital and visionary founders.',
    route: 'Brand Boulevard',
    tags: ['Venture Capital', 'Brand Identity', 'Visual System'],
    type: 'accent',
    overview: 'Arise Ventures is a global early-stage venture capital firm investing in transformative tech startups across Consumer, Climate, and Enterprise sectors. The brand needed to move from a functional identity to a sharper, more unified presence that could carry its ambition, founder-first philosophy, and global outlook.',
    solution: 'We translated the idea of “backing the bold” into a living brand system built around movement, momentum, and moonshots. The identity uses a ripple-inspired logomark, constellation-led visual language, and high-energy gradients to create a future-ready venture capital brand with confidence and depth.',
    roles: [
      'Brand Strategy',
      'Visual Identity System',
      'Logo & Logomark Design',
      'Investor Communication',
      'Social & Event Collaterals'
    ],
    results: [
      'Unified identity across India, US, and Singapore presence',
      'Sharper founder-facing brand narrative for Consumer, Climate, and Enterprise sectors',
      'Scalable brand ecosystem across decks, social templates, banners, and digital touchpoints'
    ],
    colors: ['#FFCD00', '#6865FA', '#010D54', '#F4F4F5'],
    fullStory: {
      heroImg: 'https://static.wixstatic.com/media/32f09f_075a9f91e6064746bf9f928ac934a255~mv2.png?q=80&w=2564&auto=format&fit=crop',
      challenge: 'Arise Ventures entered a critical growth phase where its brand needed to evolve to reflect its ambition and values. The existing visual identity lacked the coherence required to unify its presence across platforms and did not fully express its legacy.',
      strategy: 'The rebrand began with one strategic question: what does it mean to back the bold? PBH translated that into a living visual identity rooted in movement, momentum, and moonshots.',
      execution: 'Grounded in stakeholder conversations, we built a design system of gradients, ripple logic, and constellation-inspired elements reflecting scale and interconnectedness. From stage banners to social templates, the visual language is built to travel.',
      stats: [
        { label: 'Global Presence', val: 'IN, US, SG' },
        { label: 'Sectors', val: 'Consumer, Climate, Enterprise' },
        { label: 'Brand Ecosystem', val: 'Unified' }
      ],
      images: [
        'https://static.wixstatic.com/media/32f09f_28b10af106e84cbfbbf05ba35bf0d70d~mv2.png?q=80&w=2000&auto=format&fit=crop',
        'https://static.wixstatic.com/media/32f09f_02f0028942054129a7b05d02cebc118a~mv2.png?q=80&w=2000&auto=format&fit=crop',
        'https://static.wixstatic.com/media/32f09f_f393263a5ec54885b6b72f37efaf2bf6~mv2.png?q=80&w=2000&auto=format&fit=crop'
      ]
    }
  },
  {
    id: 'cs1', client: 'Aura Skincare', sector: 'Beauty', challenge: 'Elevating a cult favorite skincare line into a globally recognized luxury lifestyle brand.', route: 'Visual Identity', tags: ['Beauty', 'Packaging', 'Identity'], type: 'primary',
    overview: 'Aura Skincare was beloved by dermatologists but ignored by the luxury lifestyle market. Their clinical aesthetic was highly functional but lacked the emotional resonance required to compete on a global stage.',
    solution: 'We stripped away the clinical sterility and introduced a warm, ethereal aesthetic. The new system relies on subtle gradients, elegant serif typography, and tactile, sustainable packaging that feels like a premium lifestyle choice rather than a medical prescription.',
    roles: ['Brand Strategy', 'Visual Identity System', 'Packaging Design', 'E-commerce UI'],
    results: ['400% increase in D2C sales in Q1', 'Stocked in 50+ premium retail locations', 'Awarded "Best Rebrand" at Beauty Innovator Awards'],
    colors: ['#6865FA', '#E8E7FF', '#010D54', '#FFFFFF']
  },
  {
    id: 'cs2', client: 'Lumina Tech', sector: 'Technology', challenge: 'Humanizing a complex AI platform through an approachable, vibrant, and modern design system.', route: 'Digital Experience', tags: ['Tech', 'UI/UX', 'Digital'], type: 'blue',
    overview: 'Lumina’s AI engine was incredibly powerful, but their enterprise interface was intimidating and overly technical, causing high drop-off rates during initial user onboarding.',
    solution: 'We designed a "SciArt" interface that uses dynamic data visualizations as art. We replaced dense tables with fluid, color-coded components, turning complex data processing into an intuitive, visually stunning user experience.',
    roles: ['UX/UI Design', 'Data Visualization', 'Digital Brand Guidelines', 'Interaction Design'],
    results: ['Reduced onboarding time by 65%', 'Increased daily active users by 210%', 'Secured Series B funding post-launch'],
    colors: ['#2A97D9', '#051838', '#FFCD00', '#F4F4F5']
  },
  {
    id: 'cs3', client: 'Novus Fin', sector: 'Finance', challenge: 'Transforming a legacy financial institution into a modern, creator-led fintech platform.', route: 'Brand Strategy', tags: ['Fintech', 'Positioning', 'Campaign'], type: 'purple',
    overview: 'Novus Fin was seen as a traditional, slow-moving bank. To capture the next generation of wealth creators, they needed a radical departure from corporate finance tropes.',
    solution: 'We rebuilt the Novus narrative around "Empowered Creation." The visual identity was shifted to high-contrast neon on dark mode backgrounds, speaking the language of modern tech rather than legacy banking.',
    roles: ['Brand Repositioning', 'Tone of Voice', 'Launch Campaign', 'App Design'],
    results: ['Acquired 100k+ new Gen-Z users in 3 months', 'Ranked Top 3 Fintech Apps on App Store', 'Viral social media launch campaign'],
    colors: ['#AF73DD', '#111111', '#93D435', '#FFFFFF']
  },
  {
    id: 'cs4', client: 'Aero Dynamics', sector: 'Aviation', challenge: 'Communicating sustainable aviation solutions through powerful SciArt storytelling.', route: 'Narrative', tags: ['Sustainability', 'Storytelling', 'B2B'], type: 'green',
    overview: 'Aero Dynamics engineered a zero-emission propulsion system, but their B2B marketing material was bogged down in engineering specs, failing to communicate the global impact.',
    solution: 'We crafted the "Blue Sky Protocol" narrative. Moving away from technical jargon, we built an immersive B2B digital experience that visualized the environmental and economic impact of their engines through striking 3D web experiences.',
    roles: ['Strategic Narrative', '3D Web Experience', 'Investor Deck Design', 'B2B Storytelling'],
    results: ['$50M+ in pre-orders secured', 'Featured in top global sustainability summits', 'Brand adopted as industry standard case study'],
    colors: ['#93D435', '#012015', '#2A97D9', '#E8F5E9']
  },
  {
    id: 'back-to-roots', client: 'Back To Roots', sector: 'Wellness', challenge: 'Building an Ayurvedic wellness brand that speaks to a modern audience without losing its roots.', route: 'Brand Boulevard', tags: ['Wellness', 'Identity', 'Packaging'], type: 'accent',
    overview: 'Back To Roots needed a brand system that honored its Ayurvedic heritage while feeling completely contemporary — warm, precise, and deeply human.',
    solution: 'A craft-forward identity rooted in earthy warmth, editorial restraint, and system-led packaging that travels across retail and digital touchpoints.',
    roles: ['Brand Identity', 'Packaging Design', 'Visual System', 'Collaterals'],
    results: ['Unified packaging language across 30+ SKUs', 'Retail-ready identity system', 'Digital and offline presence aligned'],
    colors: ['#C4793A', '#1A0F0A', '#F5E6C8', '#2C1A10']
  },
  {
    id: 'param-innovation', client: 'Param Innovation', sector: 'Deep Tech', challenge: 'Making quantum computing intelligence accessible and credible to enterprise decision-makers.', route: 'Sci-Art Saga', tags: ['Deep Tech', 'B2B', 'SciArt'], type: 'blue',
    overview: 'Param Innovation operates at the frontier of quantum computing. The challenge was translating extreme technical depth into a brand that commands authority without sacrificing human clarity.',
    solution: 'A laboratory-precision visual language — clinical, confident, and kinetic — built for decks, web, and investor communication.',
    roles: ['Brand Strategy', 'Visual Identity', 'Investor Deck', 'Web Direction'],
    results: ['Investor-ready brand presence', 'Identity adopted across all B2B touchpoints', 'Science-forward narrative framework'],
    colors: ['#00E5FF', '#030C1A', '#1A3A4A', '#F4F4F5']
  },
  {
    id: 'snow-leopard-trust', client: 'Snow Leopard Trust', sector: 'Conservation', challenge: 'Creating a global conservation narrative that mobilises action across governments, institutions, and the public.', route: 'Sci-Art Saga', tags: ['Conservation', 'Storytelling', 'Global'], type: 'purple',
    overview: 'Snow Leopard Trust needed a story infrastructure that could travel — across South Asia, Central Asia, Europe, and the UK — and move governments, NGOs, and cultural voices to act.',
    solution: 'A SciArt narrative system that bridges institutional authority with human emotion, activating conservation through cultural reach and scientific rigour.',
    roles: ['Strategic Narrative', 'Experience Design', 'GTM Communication', 'Cultural Outreach'],
    results: ['Engagement from governments of Kyrgyzstan and Bhutan', 'Cultural voices including Dia Mirza and Jubin Nautiyal', 'Narrative reached across 12+ countries'],
    colors: ['#6865fa', '#010d54', '#d4cefc', '#F4F4F5']
  },
];

const JOURNAL_ARTICLES = [
  { id: 'a1', tag: "Framework", title: "The Anatomy of a Breakthrough Brand.", time: "5 min read", type: "primary", excerpt: "Why some brands become movements while others remain just products.", author: "PBH Strategy", date: "Oct 12, 2025" },
  { id: 'a2', tag: "Perspective", title: "Why Aesthetics Cannot Save a Bad Strategy.", time: "4 min read", type: "blue", excerpt: "Design without direction is just decoration. Here is why strategy must lead.", author: "PBH Design", date: "Sep 28, 2025" },
  { id: 'a3', tag: "Analysis", title: "Humanizing Complex Tech for the Enterprise.", time: "6 min read", type: "purple", excerpt: "How to tell a compelling story when your product is highly technical.", author: "PBH Content", date: "Sep 15, 2025" },
  { id: 'a4', tag: "Culture", title: "The SciArt Approach in Practice.", time: "8 min read", type: "accent", excerpt: "A behind-the-scenes look at how our hybrid teams co-create.", author: "PBH Culture", date: "Aug 30, 2025" },
  { id: 'a5', tag: "Trend", title: "Scaling for the Next Decade.", time: "5 min read", type: "orange", excerpt: "Why sustainable growth requires a unified brand ecosystem.", author: "PBH Leadership", date: "Aug 12, 2025" },
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

// --- UTILITIES FOR DEPENDENCY PARSING (TEMPLATE 2/3/5) ---
const parsePrerequisites = (field) => {
  if (field === "None" || !field) return [];
  const results = [];
  const parts = field.split(",");
  for (let part of parts) {
    part = part.trim();
    const rangeMatch = part.match(/^D(\d{3})[–-]D(\d{3})$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = parseInt(rangeMatch[2]);
      for (let n = start; n <= end; n++) {
        results.push("D" + String(n).padStart(3, "0"));
      }
    } else if (part.match(/^D\d{3}$/)) {
      results.push(part);
    }
  }
  return results;
};

const findUnmetPrerequisites = (deliverableId, currentSelections, deliverablesList = DELIVERABLES_MASTER) => {
  const unmet = [];
  const queue = [deliverableId];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.pop();
    if (visited.has(current)) continue;
    visited.add(current);

    const deliv = deliverablesList.find(d => d.id === current);
    if (!deliv || deliv.interdependence === "None") continue;

    const prerequisites = parsePrerequisites(deliv.interdependence);
    for (const prereq of prerequisites) {
      if (!currentSelections.includes(prereq) && !unmet.includes(prereq)) {
        unmet.push(prereq);
        queue.push(prereq);
      }
    }
  }
  return unmet;
};

const findAllDependents = (deliverableId, currentSelections, deliverablesList = DELIVERABLES_MASTER) => {
  const dependents = [];
  for (const sel of currentSelections) {
    if (sel === deliverableId) continue;
    const unmet = findUnmetPrerequisites(sel, currentSelections.filter(x => x !== deliverableId), deliverablesList);
    if (unmet.includes(deliverableId)) {
      dependents.push(sel);
    }
  }
  return dependents;
};

const computeSuggestedStartingPoint = (selectedDelivs, priorities, deliverablesList = DELIVERABLES_MASTER) => {
  const fullScope = [...new Set(selectedDelivs)];
  for (const d of selectedDelivs) {
    const unmet = findUnmetPrerequisites(d, fullScope, deliverablesList);
    fullScope.push(...unmet);
  }

  const uniqueScope = [...new Set(fullScope)];
  const scopeObjects = uniqueScope.map(id => deliverablesList.find(x => x.id === id)).filter(Boolean);

  // Layer 0 and 1 items
  const layer01Ids = ['D001', 'D002', 'D003', 'D004', 'D005', 'D006', 'D007', 'D008', 'D037', 'D038', 'D039', 'D040', 'D041', 'D042', 'D043'];
  const foundations = scopeObjects.filter(d => layer01Ids.includes(d.id));

  if (foundations.length === 0) return scopeObjects[0]?.name || "N/A";
  if (foundations.length === 1) return foundations[0].name;

  const highPriorityPicks = selectedDelivs.filter(id => priorities[id] === 'High' || priorities[id] === 'Critical');
  if (highPriorityPicks.length > 0) {
    return foundations[0].name; // Simplified resolution for demo
  }
  return foundations[0].name;
};

// --- ANIMATION UTILITIES ---
const FadeUp = ({ children, delay = 0, className = "", style = {}, ...props }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }} transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }} className={className} style={style} {...props}>
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

/* Site-wide brand atmosphere — soft purple / periwinkle / yellow blooms that
   tint EVERY page (screen-blend only lightens, so white text stays crisp).
   Fixed + pointer-events-none; sits above the navy page surfaces (z<30) but
   below the header (z-10000) and modals (z-100000). */
const BrandAura = () => (
  <div className="pointer-events-none fixed inset-0 z-[30] overflow-hidden mix-blend-screen" aria-hidden="true">
    <motion.div
      animate={{ x: ['-4%', '4%', '-4%'], y: ['-3%', '3%', '-3%'] }}
      transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -top-[18%] -left-[12%] w-[60vw] h-[60vw] rounded-full blur-[170px]"
      style={{ background: 'radial-gradient(circle, rgba(104,101,250,0.34) 0%, transparent 70%)', willChange: 'transform' }}
    />
    <motion.div
      animate={{ x: ['4%', '-4%', '4%'], y: ['3%', '-3%', '3%'] }}
      transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      className="absolute top-[16%] -right-[16%] w-[55vw] h-[55vw] rounded-full blur-[180px]"
      style={{ background: 'radial-gradient(circle, rgba(212,206,252,0.30) 0%, transparent 70%)', willChange: 'transform' }}
    />
    <motion.div
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      className="absolute -bottom-[20%] left-[24%] w-[42vw] h-[42vw] rounded-full blur-[170px]"
      style={{ background: 'radial-gradient(circle, rgba(255,205,0,0.16) 0%, transparent 70%)', willChange: 'transform' }}
    />
  </div>
);

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isPointer, setIsPointer] = useState(false);
  useEffect(() => {
    const handleMouseMove = (e) => { cursorX.set(e.clientX - 8); cursorY.set(e.clientY - 8); };
    const handleMouseOver = (e) => setIsPointer(window.getComputedStyle(e.target).cursor === 'pointer' || e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'a');
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseover', handleMouseOver); };
  }, [cursorX, cursorY]);
  return (
    <motion.div className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[999] mix-blend-difference hidden md:flex items-center justify-center" style={{ x: cursorX, y: cursorY }} animate={{ scale: isPointer ? 3 : 1, backgroundColor: isPointer ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,1)', border: isPointer ? '0.5px solid rgba(255,255,255,0.5)' : 'none' }} transition={{ type: 'spring', stiffness: 700, damping: 40, mass: 0.1 }} />
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
    window.addEventListener('resize', updateDims, { passive: true }); return () => window.removeEventListener('resize', updateDims);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', handleMouseMove, { passive: true }); return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const lastFrameT = useRef(0);
  useAnimationFrame((t) => {
    if (t - lastFrameT.current < 33) return; // cap at ~30fps
    lastFrameT.current = t;
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
    <div className={`relative overflow-hidden group w-full ${className}`} onMouseMove={handleMouseMove}>
      <motion.div className={`pointer-events-none absolute -inset-px rounded-[inherit] transition duration-500 z-0 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ background: useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(${rgbPrimary}, 0.12), transparent 80%)` }} />
      {children}
    </div>
  );
};

const ProblemHoverCard = ({ title, icon, type }) => {
  const color = palette[type] || palette.primary; 
  return (
    <motion.div initial="initial" whileHover="hover" className="group relative cursor-default p-6 rounded-[16px] flex flex-col justify-center h-44 overflow-hidden transition-all duration-500 shadow-lg hover:-translate-y-1 w-full" style={{ backgroundColor: palette.secondary, border: `1px solid ${hexToRgba(palette.primary, 0.1)}` }}>
      <motion.div variants={{ initial: { opacity: 0 }, hover: { opacity: 0.05 } }} transition={{ duration: 0.4 }} className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: palette.bgDeep }} />
      <div className="relative z-10 flex flex-col items-start gap-4">
        <motion.div variants={{ initial: { y: 0, opacity: 1, scale: 1 }, hover: { y: -2, scale: 1.05 } }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="flex items-center justify-center w-10 h-10 rounded-[10px] shadow-sm" style={{ backgroundColor: color, color: 'white' }}>{icon}</motion.div>
        <motion.span variants={{ initial: { y: 0 }, hover: { y: 0 } }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="text-[17px] md:text-[19px] font-medium leading-snug font-primary transition-colors" style={{ color: palette.bgDeep }}>{title}</motion.span>
      </div>
    </motion.div>
  );
};

const DiagnoseVisual = () => {
  const rgbPrimary = hexToRgbStr(palette.primary);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="absolute inset-0 flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0" style={{  }} />
      <div className="border border-white/10 rounded-[16px] p-6 w-full max-w-sm mb-4 shadow-2xl relative z-10" style={{ backgroundColor: palette.bgDeep }}>
        <div className="w-1/2 h-2 bg-white/10 rounded-full mb-8" />
        <div className="space-y-4">
          <motion.div animate={{ borderColor: ['rgba(255,255,255,0.05)', `rgba(${rgbPrimary},0.6)`, 'rgba(255,255,255,0.05)'] }} transition={{ duration: 2, repeat: Infinity }} className="h-12 bg-white/[0.02] border rounded-[8px] flex items-center px-4"><div className="w-4 h-4 rounded-full border border-white/20 mr-4" /><div className="w-2/3 h-2 bg-white/20 rounded-full" /></motion.div>
          <div className="h-12 bg-white/[0.02] border border-white/5 rounded-[8px] flex items-center px-4"><div className="w-4 h-4 rounded-full border border-white/20 mr-4" /><div className="w-1/2 h-2 bg-white/10 rounded-full" /></div>
          <div className="h-12 bg-white/[0.02] border border-white/5 rounded-[8px] flex items-center px-4"><div className="w-4 h-4 rounded-full border border-white/20 mr-4" /><div className="w-3/4 h-2 bg-white/10 rounded-full" /></div>
        </div>
      </div>
    </motion.div>
  );
};

const MapVisual = () => {
  const rgbBlue = hexToRgbStr(palette.blue);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="absolute inset-0 flex items-center justify-center p-8">
      <div className="absolute inset-0" style={{  }} />
      <div className="flex items-center gap-6 relative z-10 w-full max-w-md">
        <div className="flex flex-col gap-4 flex-1">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="px-4 py-3 bg-white/5 border border-white/10 rounded-[8px] text-[17px] md:text-[19px] text-white/50 text-center uppercase tracking-widest font-primary">Inconsistent Identity</motion.div>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="px-4 py-3 bg-white/5 border border-white/10 rounded-[8px] text-[17px] md:text-[19px] text-white/50 text-center uppercase tracking-widest font-primary">Weak Narrative</motion.div>
        </div>
        <div className="flex-1 flex flex-col items-center"><motion.div className="h-[2px] w-full"  animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} /></div>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="flex-1 border p-6 rounded-[16px] text-center flex flex-col items-center justify-center aspect-square shadow-2xl" style={{ background: `linear-gradient(to bottom right, rgba(${rgbBlue},0.2), transparent)`, borderColor: `rgba(${rgbBlue},0.3)` }}>
          <Layers className="w-8 h-8 mb-3" style={{ color: palette.blue }} />
          <div className="text-[17px] md:text-[19px] text-white font-medium tracking-wide font-primary">Brand<br />Boulevard</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const BuildVisual = () => {
  const rgbPrimary = hexToRgbStr(palette.primary);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="absolute inset-0 flex items-center justify-center p-8">
      <div className="absolute inset-0" style={{  }} />
      <div className="border border-white/10 rounded-[16px] p-8 w-full max-w-sm shadow-2xl relative z-10" style={{ backgroundColor: palette.bgDeep }}>
        <h4 className="text-[17px] md:text-[19px] uppercase tracking-widest mb-6 flex items-center gap-2 font-primary" style={{ color: palette.primary }}><PenTool className="w-4 h-4" /> Scope Blueprint</h4>
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
      <div className="absolute inset-0" style={{  }} />
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="w-24 h-24 border rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg" style={{ backgroundColor: `${palette.green}1A`, borderColor: `${palette.green}4D` }}>
        <CheckCircle2 className="w-12 h-12" style={{ color: palette.green }} />
      </motion.div>
      <motion.h4 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-xl md:text-2xl font-light text-white mb-2 relative z-10 font-primary">Brief Generated</motion.h4>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="px-8 py-3 bg-white text-black text-[17px] md:text-[19px] font-medium uppercase tracking-widest rounded-full relative z-10 mt-6 cursor-pointer hover:scale-105 transition-transform font-primary">Schedule Discovery</motion.div>
    </motion.div>
  );
};

const InteractiveHowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { num: '01', title: 'Discover', desc: 'Answer focused questions about your brand, teams, communication, and growth stage.', color: palette.primary },
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
            
            animate={{ top: `${activeStep * 33.33}%`, height: '33.33%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
        {steps.map((s, i) => {
          const isActive = activeStep === i;
          return (
            <div key={i} onMouseEnter={() => setActiveStep(i)} className={`relative flex items-start gap-8 p-6 rounded-[16px] cursor-pointer transition-all duration-500 w-full ${isActive ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'}`}>
              <div className={`relative z-10 w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500`} style={{ borderColor: isActive ? palette.primary : 'rgba(255,255,255,0.1)', backgroundColor: isActive ? hexToRgba(palette.primary, 0.3) : palette.panel }}>
                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isActive ? 'scale-100' : 'bg-white/20 scale-50'}`} style={{ backgroundColor: isActive ? 'white' : '' }} />
              </div>
              <div className="w-full">
                <h3 className={`t-subtitle mb-2 transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/40'}`}>{s.num}. {s.title}</h3>
                <AnimatePresence>
                  {isActive && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="t-body text-white/50 overflow-hidden">{s.desc}</motion.p>}
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
      className={`brand-italic inline-block font-primary italic cursor-default transition-all duration-500 pr-2 ${className}`}
      style={{ '--hover-shadow': `0 0 20px ${hexToRgba(palette.primary, 0.6)}` }}
      onMouseEnter={(e) => e.currentTarget.style.filter = `drop-shadow(0 0 20px ${hexToRgba(palette.primary, 0.6)})`}
      onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
    >{children}</span>
  );
};

// Helper: renders *text* as <AnimatedItalic> from CMS strings
const renderWithItalics = (text, italicClassName = "") => {
  if (!text) return null;
  
  let processedText = text;
  // Automatically italicize 'move as one' if it's missing asterisks from CMS
  if (!processedText.includes('*move as one')) {
    processedText = processedText.replace(/move as one\./gi, '*move as one.*');
    if (!processedText.includes('*move as one')) {
      processedText = processedText.replace(/move as one/gi, '*move as one*');
    }
  }

  const parts = processedText.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <AnimatedItalic key={i} className={italicClassName}>{part.slice(1, -1)}</AnimatedItalic>;
    }
    return part;
  });
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
  const btnStyle = isPrimary ? { backgroundColor: '#6865fa', color: 'white', x: smoothX, y: smoothY, boxShadow: '0 0 20px rgba(104, 101, 250, 0.4)', ...style } : { x: smoothX, y: smoothY, ...style };
  const baseClasses = isPrimary ? `hover:brightness-110 font-bold border border-white/20` : (variant === "secondary" ? "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20" : "text-white/70 hover:text-white hover:bg-white/5");

  return (
    <motion.button ref={buttonRef} type={type} onClick={onClick} disabled={disabled} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={btnStyle} className={`group relative inline-flex items-center justify-center px-8 py-4 tracking-wide transition-all duration-500 overflow-hidden rounded-[9px] text-[17px] md:text-[19px] hover:scale-[1.02] w-auto ${baseClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''} font-primary`}>
      <span className="relative z-10 flex items-center gap-2 w-full justify-center">{children}</span>
      {isPrimary && !disabled && <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out skew-x-12 w-full" />}
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


const SECTORS = [
  'Architecture & Urban Design',
  'Education & Research Institutions',
  'Universities & Centres of Excellence',
  'Financial Services',
  'Food & Nutrition',
  'Ayurveda, Yoga & Wellness',
  'Personal Care & Beauty',
  'Mother & Baby Care',
  'Health & Medical',
  'Biotechnology',
  'Pharmaceutical',
  'Cognitive Science & Neuroscience',
  'Agri-tech',
  'Vertical / Urban Farming',
  'Environmental Science',
  'Sustainability & Conservation',
  'Renewable Energy',
  'EV & Clean Transport',
  'Advanced Manufacturing',
  '3D Printing',
  'Chemical Industries',
  'Nanotechnology',
  'Artificial Intelligence',
  'Emerging Technology',
  'Information Technology',
  'Defence',
  'Aviation & Aerospace',
  'Geology & Earth Sciences',
  'Sports & Fitness',
  'Fashion & Textile',
  'Consumer Products',
  'Public Policy & Think Tanks',
  'Media, Events & Knowledge Platforms',
  'Spiritual Tech / Faith Tech',
  'Other'
];

// --- STRATEGIC ENGINE (SCOPE BUILDER) ---
const StrategicEngine = ({ navigate }) => {
  const { QUIZ_QUESTIONS, ROUTES_INFO, DELIVERABLES_MASTER, SITE_SETTINGS } = useContext(GlobalContext);
  const finalSettings = SITE_SETTINGS || {};
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [clusters, setClusters] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [selectedDeliverables, setSelectedDeliverables] = useState([]);
  const [priorities, setPriorities] = useState({});
  const [warnings, setWarnings] = useState([]);
  const [context, setContext] = useState({ depth: '', timeline: '', duration: 'Deep Dive- Branding (minimum 6 months)' });
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- LocalStorage Persistence ---
  useEffect(() => {
    const savedState = localStorage.getItem('pbh_scope_builder_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Clear saved state if the user already reached the final submission/results screen
        if (parsed.step && parsed.step >= QUIZ_QUESTIONS.length + 1) {
          localStorage.removeItem('pbh_scope_builder_state');
        } else {
          if (parsed.step) setStep(parsed.step);
          if (parsed.answers) setAnswers(parsed.answers);
          if (parsed.comments) setComments(parsed.comments);
          if (parsed.clusters) setClusters(parsed.clusters);
          if (parsed.routes) setRoutes(parsed.routes);
          if (parsed.selectedRoutes) setSelectedRoutes(parsed.selectedRoutes);
          if (parsed.selectedDeliverables) setSelectedDeliverables(parsed.selectedDeliverables);
          if (parsed.priorities) setPriorities(parsed.priorities);
          if (parsed.context) setContext(parsed.context);
          if (parsed.leadForm) setLeadForm(parsed.leadForm);
        }
      } catch (e) {
        console.error("Failed to load saved progress", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pbh_scope_builder_state', JSON.stringify({
        step, answers, comments, clusters, routes, selectedRoutes, 
        selectedDeliverables, priorities, context, leadForm
      }));
    }
  }, [step, answers, comments, clusters, routes, selectedRoutes, selectedDeliverables, priorities, context, leadForm, isLoaded]);
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [readMorePopup, setReadMorePopup] = useState(null);
  const [dependencyModal, setDependencyModal] = useState(null);

  const formatInterdependence = (interdepString) => {
    if (!interdepString || interdepString === 'None') return null;
    if (interdepString.includes('-')) return "Complete Previous Phase";
    let formatted = interdepString;
    DELIVERABLES_MASTER.forEach(deliv => {
      formatted = formatted.replace(new RegExp(deliv.id, 'g'), deliv.name);
    });
    return formatted;
  };

  const N_QUIZ = QUIZ_QUESTIONS.length;

  const handleQuizSelect = (questionId, option, isMultiSelect) => {
    if (isMultiSelect) {
      setAnswers(prev => {
        const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
        if (option.id.startsWith('none')) {
          return { ...prev, [questionId]: [option] };
        }
        const withoutNone = current.filter(ans => !ans.id.startsWith('none'));
        if (withoutNone.some(ans => ans.id === option.id)) {
          return { ...prev, [questionId]: withoutNone.filter(ans => ans.id !== option.id) };
        } else {
          return { ...prev, [questionId]: [...withoutNone, option] };
        }
      });
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: option }));
    }
  };

  const handleContinue = () => {
    if (step < N_QUIZ) { setStep(step + 1); } else { processDiagnosis(answers); }
  };

  const processDiagnosis = (finalAnswers) => {
    // Accumulate route scores from all answers
    const routeScores = { BB: 0, SAS: 0, STC: 0 };
    Object.values(finalAnswers).forEach(ans => {
      const opts = Array.isArray(ans) ? ans : [ans];
      opts.forEach(opt => {
        if (opt && opt.routes) {
          opt.routes.forEach(r => {
            routeScores[r.id] = (routeScores[r.id] || 0) + (r.weight || 1);
          });
        }
      });
    });

    // Get duration from Q6 answer
    const durationAns = finalAnswers['q6_duration'];
    const durationId = durationAns?.id || 'q6_o1';

    // Sort routes by score descending, filter out zero scores
    const sortedRoutes = Object.entries(routeScores)
      .filter(([, score]) => score > 0)
      .sort(([, a], [, b]) => b - a);

    const maxScore = sortedRoutes[0]?.[1] || 0;

    let recRoutes;
    if (durationId === 'q6_o3') {
      // 3-month: top route only, focused blueprint
      recRoutes = sortedRoutes.slice(0, 1).map(([id]) => id);
    } else if (durationId === 'q6_o1') {
      // 6-month: primary + supporting routes (score >= 30% of max)
      recRoutes = sortedRoutes.filter(([, score]) => score >= maxScore * 0.3).map(([id]) => id);
    } else {
      // 1-year: all routes with meaningful scores
      recRoutes = sortedRoutes.map(([id]) => id);
    }

    if (recRoutes.length === 0) recRoutes = ['BB'];

    // Auto-select deliverables based on routes and duration
    const blueprintMap = durationId === 'q6_o3' ? ROUTE_BLUEPRINTS_3M : ROUTE_BLUEPRINTS;
    const autoSelected = new Set();
    recRoutes.forEach(r => {
      (blueprintMap[r] || []).forEach(d => autoSelected.add(d));
    });

    setRoutes(recRoutes);
    setSelectedRoutes(recRoutes);
    setSelectedDeliverables(Array.from(autoSelected));
    setClusters(recRoutes.map(r => ROUTES_INFO[r]?.title || r));
    setStep(N_QUIZ + 1);
  };

  const handleDeliverableToggle = (dId) => {
    const isSelected = selectedDeliverables.includes(dId);
    if (isSelected) {
      const dependents = findAllDependents(dId, selectedDeliverables);
      if (dependents.length > 0) {
        setDependencyModal({ type: 'remove', deliverable: dId, related: dependents });
      } else {
        setSelectedDeliverables(prev => prev.filter(x => x !== dId));
        setWarnings(prev => prev.filter(x => x !== dId));
      }
    } else {
      const unmet = findUnmetPrerequisites(dId, selectedDeliverables);
      if (unmet.length > 0) {
        setDependencyModal({ type: 'add', deliverable: dId, related: unmet });
      } else {
        setSelectedDeliverables(prev => [...prev, dId]);
      }
    }
  };

  const submitLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const startingPoint = computeSuggestedStartingPoint(selectedDeliverables, priorities);

    const finalIndustry = leadForm.industry === 'Other' ? (leadForm.otherIndustry || 'Other') : leadForm.industry;
    const leadData = { ...leadForm, industry: finalIndustry, clusters, routes, deliverables: selectedDeliverables, ...context, startingPoint, date: new Date().toISOString(), status: 'New', score: Math.floor(Math.random() * 40) + 60 };
    GLOBAL_LEADS.push(leadData);

    // Group deliverables by Route and LineItem for both Email and PDF
    const groupedDeliverables = {};
    const groupedIds = new Set();

    selectedDeliverables.forEach(d => {
      const deliv = DELIVERABLES_BY_ID.get(d);
      if (!deliv) return;

      const lineItemId = deliv.lineItem;
      let routeId = null;
      let lineItemName = '';

      for (const [rId, route] of Object.entries(ROUTES_INFO)) {
        const li = route.lineItems.find(x => x.id === lineItemId);
        if (li) {
          routeId = rId;
          lineItemName = li.name;
          break;
        }
      }

      if (routeId) {
        if (!groupedDeliverables[routeId]) {
          groupedDeliverables[routeId] = { title: ROUTES_INFO[routeId].title, lineItems: {} };
        }
        if (!groupedDeliverables[routeId].lineItems[lineItemId]) {
          groupedDeliverables[routeId].lineItems[lineItemId] = { name: lineItemName, items: [] };
        }
        groupedDeliverables[routeId].lineItems[lineItemId].items.push(deliv);
        groupedIds.add(d);
      }
    });
    const ungroupedIds = selectedDeliverables.filter(d => !groupedIds.has(d));

    const subject = `New Lead: ${leadForm.company} - Scope Builder`;
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F4F6; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <div style="background-color: #121228; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">New Scope Builder Lead</h1>
            <p style="color: #a0a0c0; margin: 8px 0 0 0; font-size: 14px;">PurpleBlue House Strategy Blueprint</p>
          </div>

          <div style="padding: 30px;">
            <!-- Intro -->
            <div style="margin-bottom: 25px; color: #475569; line-height: 1.6; font-size: 15px;">
              <p>Hi Team,</p>
              <p>A new Scope of Work has been generated by <strong>${leadForm.name}</strong> from <strong>${leadForm.company}</strong>.</p>
              <p>Please find their detailed diagnostic responses and selected deliverables attached in both PDF and Excel formats.</p>
            </div>

            <!-- Client Details -->
            <h2 style="color: #6366f1; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; border-bottom: 2px solid #eef2f6; padding-bottom: 10px;">Client Details</h2>
            <div style="margin-bottom: 30px;">
              <p style="margin: 8px 0; color: #374151;"><strong>Name:</strong> ${leadForm.name}</p>
              <p style="margin: 8px 0; color: #374151;"><strong>Email:</strong> <a href="mailto:${leadForm.email}" style="color: #6366f1; text-decoration: none;">${leadForm.email}</a></p>
              <p style="margin: 8px 0; color: #374151;"><strong>Company:</strong> ${leadForm.company}</p>
            </div>
            
            <!-- Context -->
            <h2 style="color: #6366f1; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; border-bottom: 2px solid #eef2f6; padding-bottom: 10px;">Context & Timeline</h2>
            <div style="margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div style="background: #f8fafc; padding: 12px; border-radius: 6px;">
                <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase;">Industry / Sector</p>
                <p style="margin: 4px 0 0 0; color: #0f172a; font-weight: 600;">${leadData.industry || 'N/A'}</p>
              </div>
              <div style="background: #f8fafc; padding: 12px; border-radius: 6px;">
                <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase;">Project Duration</p>
                <p style="margin: 4px 0 0 0; color: #0f172a; font-weight: 600;">${leadData.timeline || 'N/A'}</p>
              </div>
              <div style="background: #f8fafc; padding: 12px; border-radius: 6px; grid-column: span 2;">
                <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase;">Starting Point</p>
                <p style="margin: 4px 0 0 0; color: #0f172a; font-weight: 600;">${startingPoint}</p>
              </div>
            </div>
            
            <!-- Deliverables -->
            <h2 style="color: #6366f1; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; border-bottom: 2px solid #eef2f6; padding-bottom: 10px;">Selected Deliverables (${selectedDeliverables.length})</h2>
            <div style="margin-bottom: 30px;">
              ${selectedDeliverables.length === 0 ? '<p style="color: #6b7280; font-style: italic;">No deliverables selected.</p>' : ''}
              ${Object.keys(groupedDeliverables).map(routeId => {
      const route = groupedDeliverables[routeId];
      return `
                  <div style="margin-bottom: 20px;">
                    <h3 style="color: #1e1e38; font-size: 14px; text-transform: uppercase; margin: 0 0 10px 0;">${route.title}</h3>
                    ${Object.keys(route.lineItems).map(liId => {
        const li = route.lineItems[liId];
        return `
                        <div style="margin-bottom: 12px; padding-left: 10px; border-left: 2px solid #eef2f6;">
                          <h4 style="color: #64748b; font-size: 13px; font-weight: 600; margin: 0 0 6px 0;">${li.name}</h4>
                          <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 13px;">
                            ${li.items.map(d => `<li style="margin-bottom: 4px;">${d.name}</li>`).join('')}
                          </ul>
                        </div>
                      `;
      }).join('')}
                  </div>
                `;
    }).join('')}
              ${ungroupedIds.length > 0 ? `
                  <div style="margin-bottom: 20px;">
                    <h3 style="color: #1e1e38; font-size: 14px; text-transform: uppercase; margin: 0 0 10px 0;">Other Deliverables</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 13px;">
                      ${ungroupedIds.map(d => {
      const deliv = DELIVERABLES_BY_ID.get(d);
      return `<li style="margin-bottom: 4px;">${deliv ? deliv.name : d}</li>`;
    }).join('')}
                    </ul>
                  </div>
              ` : ''}
            </div>
            
            <!-- Quiz Responses -->
            <h2 style="color: #6366f1; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; border-bottom: 2px solid #eef2f6; padding-bottom: 10px;">Diagnostic Responses</h2>
            <div>
              ${QUIZ_QUESTIONS.map((q, i) => {
      const ans = answers[q.id];
      if (!ans || (Array.isArray(ans) && ans.length === 0)) return '';
      const labels = Array.isArray(ans) ? ans.map(a => a.label).join(', ') : ans.label;
      const notes = Array.isArray(ans) ? ans.map(a => a.desc).filter(Boolean).join(', ') : ans.desc;
      return `
                    <div style="margin-bottom: 16px; background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 3px solid #6366f1;">
                      <p style="margin: 0 0 8px 0; color: #0f172a; font-weight: 600; font-size: 14px;">${q.title}</p>
                      <p style="margin: 0; color: #475569; font-size: 13px;">${labels} ${notes ? `<br/><span style="color: #94a3b8; font-size: 12px;">Notes: ${notes}</span>` : ''}</p>
                    </div>
                  `;
    }).join('')}
            </div>

          </div>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #eef2f6;">
             <p style="color: #94a3b8; font-size: 12px; margin: 0;">See attached PDF for detailed report.</p>
          </div>
        </div>
      </div>
    `;

    // Generate Comprehensive PDF Attachment
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 50;
    const usableW = pageW - margin * 2;
    let y = 60;

    const checkPage = (heightNeeded) => {
      if (y + heightNeeded > pageH - 50) {
        doc.addPage();
        y = 60;
      }
    };

    const addText = (text, size, color, bold = false, indent = 0) => {
      doc.setFontSize(size);
      doc.setTextColor(...color);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, usableW - indent);
      checkPage(lines.length * size * 1.5);
      doc.text(lines, margin + indent, y);
      y += lines.length * size * 1.5;
    };

    const addSectionHeader = (title) => {
      checkPage(60);
      y += 10;
      doc.setDrawColor(230, 230, 240);
      doc.line(margin, y, pageW - margin, y);
      y += 20;
      doc.setFontSize(12);
      doc.setTextColor(90, 90, 160);
      doc.setFont('helvetica', 'bold');
      doc.text(title.toUpperCase(), margin, y);
      y += 20;
    };

    // Beautiful Modern Header
    doc.setFillColor(18, 18, 40); // Dark Purple/Blue PBH color
    doc.rect(0, 0, pageW, 110, 'F');

    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Brand Scope Report', margin, 55);

    doc.setFontSize(11);
    doc.setTextColor(150, 150, 200);
    doc.setFont('helvetica', 'normal');
    doc.text('CONFIDENTIAL & PROPRIETARY', margin, 75);
    doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageW - margin, 75, { align: 'right' });

    y = 140;

    // Client Details
    addText(`Client: ${leadForm.name}`, 14, [40, 40, 40], true);
    addText(`Company: ${leadForm.company}`, 12, [80, 80, 80]);
    addText(`Email: ${leadForm.email}`, 12, [80, 80, 80]);

    // Detailed Diagnostic Responses
    addSectionHeader('Diagnostic Responses');
    QUIZ_QUESTIONS.forEach((q, i) => {
      const ans = answers[q.id];
      if (ans) {
        // Calculate height
        const titleLines = doc.splitTextToSize(`Q${i + 1}. ${q.title}`, usableW - 20);
        const ansLines = doc.splitTextToSize(`${ans.label}`, usableW - 40);
        let notesLines = [];
        let blockHeight = 15 + (titleLines.length * 14) + (ansLines.length * 12) + 15;
        if (ans.desc) {
          notesLines = doc.splitTextToSize(`Notes: ${ans.desc}`, usableW - 40);
          blockHeight += (notesLines.length * 12) + 5;
        }

        checkPage(blockHeight + 15);

        // Draw Background Block
        doc.setFillColor(252, 252, 254);
        doc.setDrawColor(225, 225, 235);
        doc.roundedRect(margin, y, usableW, blockHeight, 6, 6, 'FD');

        let currentY = y + 20;

        // Question Title
        doc.setFontSize(11);
        doc.setTextColor(20, 20, 40);
        doc.setFont('helvetica', 'bold');
        doc.text(titleLines, margin + 15, currentY);
        currentY += titleLines.length * 14 + 5;

        // Answer
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 100);
        doc.setFont('helvetica', 'bold');
        doc.text(ansLines, margin + 35, currentY);

        // Accent Arrow (Changed from ↳ to • to fix font rendering issue)
        doc.setTextColor(99, 102, 241); // Indigo
        doc.text("•", margin + 18, currentY);

        currentY += ansLines.length * 12 + 2;

        // Notes
        if (ans.desc) {
          currentY += 5;
          doc.setFontSize(9);
          doc.setTextColor(130, 130, 140);
          doc.setFont('helvetica', 'normal');
          doc.text(notesLines, margin + 35, currentY);
        }

        y += blockHeight + 12;
      }
    });

    // Strategy Blueprint
    addSectionHeader('Strategy Blueprint');
    const blueprintItems = [

      { label: 'Engagement Depth', val: leadData.depth },
      { label: 'Timeline', val: leadData.timeline },
      { label: 'Suggested Starting Point', val: startingPoint }
    ];
    blueprintItems.forEach(item => {
      addText(`${item.label}:`, 10, [100, 100, 100], true);
      y -= 14;
      addText(`${item.val}`, 11, [40, 40, 50], false, 150);
      y += 4;
    });

    // Selected Deliverables
    addSectionHeader('Selected Deliverables');

    console.log('[PDF DEBUG] selectedDeliverables:', selectedDeliverables);
    console.log('[PDF DEBUG] Total selected:', selectedDeliverables.length);

    // Grouping is now done above for the email as well
    console.log('[PDF DEBUG] groupedDeliverables:', JSON.stringify(groupedDeliverables, null, 2));
    console.log('[PDF DEBUG] ungroupedIds:', ungroupedIds);

    const colWidth = (usableW - 15) / 2;

    // 2. Render the grouped deliverables
    Object.keys(groupedDeliverables).forEach(routeId => {
      const routeData = groupedDeliverables[routeId];

      // Draw Route Title (e.g. SCIART SAGA)
      checkPage(40);
      y += 10;
      doc.setFontSize(14);
      doc.setTextColor(30, 30, 60);
      doc.setFont('helvetica', 'bold');
      doc.text(routeData.title.toUpperCase(), margin, y);
      y += 20;

      Object.keys(routeData.lineItems).forEach(liId => {
        const liData = routeData.lineItems[liId];

        // Draw Line Item Title (e.g. Innovation Frameworks)
        checkPage(35);
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 140);
        doc.setFont('helvetica', 'bold');
        doc.text(liData.name, margin + 5, y);
        y += 15;

        // Determine route colors - strictly shades of purple
        let fillColor = [248, 245, 255]; // Lightest purple (STC)
        let strokeColor = [220, 215, 240];

        if (routeId === 'BB') {
          fillColor = [240, 235, 255]; // Slightly deeper light purple
          strokeColor = [210, 200, 240];
        } else if (routeId === 'SAS') {
          fillColor = [244, 240, 255]; // Mid light purple
          strokeColor = [215, 205, 240];
        }

        // Draw 2-column grid of deliverables for this line item
        const items = liData.items;
        for (let i = 0; i < items.length; i += 2) {
          checkPage(45);

          // Draw Left Card
          const d1 = items[i];
          doc.setFillColor(...fillColor);
          doc.setDrawColor(...strokeColor);
          doc.roundedRect(margin, y, colWidth, 34, 4, 4, 'FD');

          doc.setTextColor(99, 102, 241); // Indigo
          doc.setFontSize(14);
          doc.text("•", margin + 12, y + 22);

          doc.setTextColor(40, 40, 50);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          const lines1 = doc.splitTextToSize(d1.name, colWidth - 35);
          doc.text(lines1[0] + (lines1.length > 1 ? '...' : ''), margin + 28, y + 21);

          // Draw Right Card (if it exists)
          if (i + 1 < items.length) {
            const d2 = items[i + 1];
            const rightX = margin + colWidth + 15;

            doc.setFillColor(...fillColor);
            doc.setDrawColor(...strokeColor);
            doc.roundedRect(rightX, y, colWidth, 34, 4, 4, 'FD');

            doc.setTextColor(99, 102, 241);
            doc.setFontSize(14);
            doc.text("•", rightX + 12, y + 22);

            doc.setTextColor(40, 40, 50);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            const lines2 = doc.splitTextToSize(d2.name, colWidth - 35);
            doc.text(lines2[0] + (lines2.length > 1 ? '...' : ''), rightX + 28, y + 21);
          }

          y += 44;
        }
        y += 10; // Space after a line item
      });
      y += 10; // Space after a route
    });

    // Fallback: render any deliverables that were NOT grouped (safety net)
    const ungrouped = selectedDeliverables.filter(d => !groupedIds.has(d));
    if (ungrouped.length > 0) {
      checkPage(40);
      y += 10;
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 60);
      doc.setFont('helvetica', 'bold');
      doc.text('OTHER DELIVERABLES', margin, y);
      y += 20;

      for (let i = 0; i < ungrouped.length; i += 2) {
        checkPage(45);
        const d1 = DELIVERABLES_BY_ID.get(ungrouped[i]);
        const name1 = d1 ? d1.name : ungrouped[i];

        doc.setFillColor(248, 245, 255);
        doc.setDrawColor(220, 215, 240);
        doc.roundedRect(margin, y, colWidth, 34, 4, 4, 'FD');
        doc.setTextColor(99, 102, 241);
        doc.setFontSize(14);
        doc.text("•", margin + 12, y + 22);
        doc.setTextColor(40, 40, 50);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(name1, margin + 28, y + 21);

        if (i + 1 < ungrouped.length) {
          const d2 = DELIVERABLES_BY_ID.get(ungrouped[i + 1]);
          const name2 = d2 ? d2.name : ungrouped[i + 1];
          const rightX = margin + colWidth + 15;
          doc.setFillColor(248, 245, 255);
          doc.setDrawColor(220, 215, 240);
          doc.roundedRect(rightX, y, colWidth, 34, 4, 4, 'FD');
          doc.setTextColor(99, 102, 241);
          doc.setFontSize(14);
          doc.text("•", rightX + 12, y + 22);
          doc.setTextColor(40, 40, 50);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(name2, rightX + 28, y + 21);
        }
        y += 44;
      }
    }

    // Add footers to all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`PurpleBlue House - Scope Builder Report`, margin, pageH - 25);
      doc.text(`Page ${i} of ${pageCount}`, pageW - margin, pageH - 25, { align: 'right' });
    }

    const safeCompanyName = leadForm.company ? leadForm.company.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'client';
    const pdfBase64 = doc.output('datauristring').split(',')[1];
    const attachments = [{ filename: `PBH_ScopeOfWork_${safeCompanyName}.pdf`, content: pdfBase64 }];

    // Generate Comprehensive Excel Sheet Attachment
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'PurpleBlue House';
      const sheet = workbook.addWorksheet('Scope of Work', { views: [{ showGridLines: false }] });

      // Column Widths
      sheet.getColumn(1).width = 4;
      sheet.getColumn(2).width = 8;
      sheet.getColumn(3).width = 35;
      sheet.getColumn(4).width = 50;

      // Count total deliverables
      const totalDeliverables = selectedDeliverables.length;
      const totalRoutes = Object.keys(groupedDeliverables).length;
      const generatedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

      // 1. Title Header
      const headerRow = sheet.addRow(["", "SCOPE OF WORK", "", ""]);
      headerRow.font = { name: 'Arial', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF121228' } };
      headerRow.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF121228' } };
      headerRow.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF121228' } };
      sheet.mergeCells('B1:D1');
      headerRow.height = 40;
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      // Subtitle
      const subtitleRow = sheet.addRow(["", `PurpleBlue House - Brand Strategy Deliverables for ${leadForm.company || 'Client'}`, "", ""]);
      subtitleRow.font = { name: 'Arial', size: 11, italic: true, color: { argb: 'FFA5B4FC' } };
      subtitleRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF121228' } };
      subtitleRow.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF121228' } };
      subtitleRow.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF121228' } };
      sheet.mergeCells(`B${subtitleRow.number}:D${subtitleRow.number}`);
      subtitleRow.height = 22;
      subtitleRow.alignment = { vertical: 'middle', horizontal: 'center' };

      sheet.addRow([]);

      // Summary Strip - Date | Deliverables Count | Routes
      const summaryRow = sheet.addRow(["", `Generated: ${generatedDate}`, `${totalDeliverables} Deliverables Selected`, `Across ${totalRoutes} Route${totalRoutes !== 1 ? 's' : ''}`]);
      summaryRow.height = 24;
      [2, 3, 4].forEach(colIdx => {
        const cell = summaryRow.getCell(colIdx);
        cell.font = { size: 10, bold: true, color: { argb: 'FF4C1D95' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEDE9FE' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { bottom: { style: 'thin', color: { argb: 'FFDDD6FE' } } };
      });

      sheet.addRow([]);

      // Helper function to add key-value rows
      const addField = (label, value) => {
        const row = sheet.addRow(["", label, "", value]);
        sheet.mergeCells(`B${row.number}:C${row.number}`);
        row.getCell(2).font = { bold: true, color: { argb: 'FF475569' } };
        row.getCell(4).font = { color: { argb: 'FF0F172A' } };
        row.getCell(2).border = { bottom: { style: 'thin', color: { argb: 'FFEEF2F6' } } };
        row.getCell(3).border = { bottom: { style: 'thin', color: { argb: 'FFEEF2F6' } } };
        row.getCell(4).border = { bottom: { style: 'thin', color: { argb: 'FFEEF2F6' } } };
      };

      // 2. Client Details Section
      const clientHeader = sheet.addRow(["", "CLIENT DETAILS", "", ""]);
      clientHeader.font = { size: 12, bold: true, color: { argb: 'FF6366F1' } };
      sheet.mergeCells(`B${clientHeader.number}:D${clientHeader.number}`);

      addField("Name", leadForm.name);
      addField("Company", leadForm.company);
      addField("Email", leadForm.email);

      sheet.addRow([]);

      // 3. Context & Timeline Section
      const contextHeader = sheet.addRow(["", "CONTEXT & TIMELINE", "", ""]);
      contextHeader.font = { size: 12, bold: true, color: { argb: 'FF6366F1' } };
      sheet.mergeCells(`B${contextHeader.number}:D${contextHeader.number}`);


      addField("Engagement Depth", leadData.depth || 'N/A');
      addField("Project Duration", leadData.timeline || 'N/A');
      addField("Suggested Starting Point", startingPoint);

      sheet.addRow([]);

      // 4. Diagnostic Responses (Quiz Q&A) - This is what the PDF shows
      const quizHeader = sheet.addRow(["", "DIAGNOSTIC RESPONSES", "", ""]);
      quizHeader.font = { size: 12, bold: true, color: { argb: 'FF6366F1' } };
      sheet.mergeCells(`B${quizHeader.number}:D${quizHeader.number}`);

      // Table header for Q&A
      const qaHeaderRow = sheet.addRow(["", "No.", "Question", "Client's Answer"]);
      qaHeaderRow.height = 22;
      [2, 3, 4].forEach(colIdx => {
        const cell = qaHeaderRow.getCell(colIdx);
        cell.font = { bold: true, size: 10, color: { argb: 'FF4C1D95' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEDE9FE' } };
        cell.alignment = { vertical: 'middle' };
        cell.border = { bottom: { style: 'thin', color: { argb: 'FFDDD6FE' } } };
      });

      let qNo = 1;
      QUIZ_QUESTIONS.forEach(q => {
        const ans = answers[q.id];
        if (ans) {
          const row = sheet.addRow(["", qNo, q.title, ans.label]);
          const isEven = qNo % 2 === 0;
          row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
          row.getCell(3).alignment = { wrapText: true, vertical: 'middle' };
          row.getCell(4).alignment = { wrapText: true, vertical: 'middle' };
          [2, 3, 4].forEach(colIdx => {
            const cell = row.getCell(colIdx);
            cell.font = { color: { argb: 'FF334155' } };
            if (isEven) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F3FF' } };
            }
            cell.border = {
              bottom: { style: 'thin', color: { argb: 'FFEDE9FE' } },
              left: { style: 'thin', color: { argb: 'FFEDE9FE' } },
              right: { style: 'thin', color: { argb: 'FFEDE9FE' } }
            };
          });
          qNo++;
        }
      });

      sheet.addRow([]);

      // 5. Deliverables Section Title
      const tableTitleRow = sheet.addRow(["", "SELECTED DELIVERABLES", "", ""]);
      tableTitleRow.font = { size: 12, bold: true, color: { argb: 'FF6366F1' } };
      sheet.mergeCells(`B${tableTitleRow.number}:D${tableTitleRow.number}`);

      // 5. Grouped Deliverables - Each route is a section header
      let serialNo = 1;

      Object.keys(groupedDeliverables).forEach(routeId => {
        const route = groupedDeliverables[routeId];

        // Route Header Row (purple band)
        const routeRow = sheet.addRow(["", route.title, "", ""]);
        routeRow.height = 24;
        sheet.mergeCells(`B${routeRow.number}:D${routeRow.number}`);
        routeRow.getCell(2).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
        routeRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7C3AED' } };
        routeRow.getCell(2).alignment = { vertical: 'middle' };

        // Column sub-headers for this route
        const subHeaderRow = sheet.addRow(["", "No.", "Line Item / Category", "Deliverable"]);
        subHeaderRow.height = 22;
        [2, 3, 4].forEach(colIdx => {
          const cell = subHeaderRow.getCell(colIdx);
          cell.font = { bold: true, size: 10, color: { argb: 'FF4C1D95' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEDE9FE' } };
          cell.alignment = { vertical: 'middle' };
          cell.border = { bottom: { style: 'thin', color: { argb: 'FFDDD6FE' } } };
        });

        // Data rows under this route
        let rowIdx = 0;
        let categoryIdx = 0;
        Object.keys(route.lineItems).forEach(liId => {
          const li = route.lineItems[liId];
          const startRow = sheet.rowCount + 1;
          const isEvenCategory = categoryIdx % 2 === 0;

          li.items.forEach((d, idx) => {
            const liName = idx === 0 ? li.name : "";
            const row = sheet.addRow(["", serialNo, liName, d.name]);

            [2, 3, 4].forEach(colIdx => {
              const cell = row.getCell(colIdx);
              cell.font = { color: { argb: 'FF334155' } };
              if (isEvenCategory) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F3FF' } };
              } else {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
              }
              cell.border = {
                bottom: { style: 'thin', color: { argb: 'FFEDE9FE' } },
                left: { style: 'thin', color: { argb: 'FFEDE9FE' } },
                right: { style: 'thin', color: { argb: 'FFEDE9FE' } }
              };
            });
            // Number column alignment
            row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };

            // Deliverable column alignment
            row.getCell(4).alignment = { vertical: 'middle', wrapText: true };

            serialNo++;
            rowIdx++;
          });

          const endRow = sheet.rowCount;
          if (endRow > startRow) {
            sheet.mergeCells(`C${startRow}:C${endRow}`);
          }
          const groupCell = sheet.getCell(`C${startRow}`);
          groupCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          // Keep the background consistent for the merged cell
          if (isEvenCategory) {
            groupCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F3FF' } };
          } else {
            groupCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
          }
          categoryIdx++;
        });

        // Spacer row between routes
        sheet.addRow([]);
      });

      // Ungrouped Data (if any)
      if (ungroupedIds.length > 0) {
        const otherRow = sheet.addRow(["", "Other Deliverables", "", ""]);
        otherRow.height = 24;
        sheet.mergeCells(`B${otherRow.number}:D${otherRow.number}`);
        otherRow.getCell(2).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
        otherRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7C3AED' } };

        const otherSubHeader = sheet.addRow(["", "No.", "Category", "Deliverable"]);
        [2, 3, 4].forEach(colIdx => {
          const cell = otherSubHeader.getCell(colIdx);
          cell.font = { bold: true, size: 10, color: { argb: 'FF4C1D95' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEDE9FE' } };
          cell.border = { bottom: { style: 'thin', color: { argb: 'FFDDD6FE' } } };
        });

        ungroupedIds.forEach((dId, idx) => {
          const deliv = DELIVERABLES_BY_ID.get(dId);
          const row = sheet.addRow(["", serialNo, "Ungrouped", deliv ? deliv.name : dId]);
          row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
          [2, 3, 4].forEach(colIdx => {
            const cell = row.getCell(colIdx);
            cell.font = { color: { argb: 'FF334155' } };
            if (idx % 2 === 0) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F3FF' } };
            }
            cell.border = {
              bottom: { style: 'thin', color: { argb: 'FFEDE9FE' } },
              left: { style: 'thin', color: { argb: 'FFEDE9FE' } },
              right: { style: 'thin', color: { argb: 'FFEDE9FE' } }
            };
          });
          serialNo++;
        });
      }

      // Write to ArrayBuffer and convert to Base64 in browser
      const buffer = await workbook.xlsx.writeBuffer();
      let binary = '';
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const excelBase64 = window.btoa(binary);

      attachments.push({ filename: `PBH_ScopeOfWork_${safeCompanyName}.xlsx`, content: excelBase64 });
    } catch (err) {
      console.error("Failed to generate Excel attachment:", err);
    }

    // Beautifully format the Quiz Answers for Supabase storage
    const formattedAnswers = QUIZ_QUESTIONS.map(q => {
      const ans = answers[q.id];
      const comment = comments[q.id] || "";
      
      let type = q.multiSelect ? "Multiple Choice (MCQ)" : "Single Choice";
      if (q.options && q.options.length === 2 && (q.options[0].label.toLowerCase() === 'yes' || q.options[0].label.toLowerCase() === 'no')) {
        type = "Binary (Yes/No)";
      }

      let selectedLabels = [];
      if (ans) {
        if (Array.isArray(ans)) {
          selectedLabels = ans.map(a => a.label);
        } else {
          selectedLabels = [ans.label];
        }
      }

      return {
        question_id: q.id,
        question_text: q.title,
        question_type: type,
        selected_answers: selectedLabels,
        user_comments: comment
      };
    });

    const saveLeadPromise = fetch('/api/save-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadForm,
        answers,
        formattedAnswers,
        selectedDeliverables,
        startingPoint,
        clusters,
        routes,
        selectedRoutes,
        priorities,
        context
      })
    }).then(res => res.json()).catch(err => ({ success: false, error: err.message }));

    const emailPromise = sendEmailViaResend(subject, htmlContent, attachments);

    // Send a copy to the respondent as well
    // Send a highly professional, dedicated copy to the respondent
    const clientSubject = `Your Scope Snapshot | PurpleBlue House`;
    const clientHtmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background-color: #010836; padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Your Strategic Scope Snapshot</h1>
            <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 14px;">Customized Blueprint for ${leadForm.company}</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="color: #334155; font-size: 16px; margin-bottom: 20px;">Hi ${leadForm.name},</p>
            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for completing the PurpleBlue House Scope Builder. Based on your diagnostic responses, we have compiled a customized Scope Snapshot outlining your brand's current positioning and recommended strategic deliverables.
            </p>
            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
              Please find your detailed Scope Snapshot attached as a PDF. This document serves as a factual, actionable blueprint for your brand's growth trajectory.
            </p>
            
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} PurpleBlue House. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    // The client only gets the beautiful PDF, not the raw Excel
    const clientAttachments = attachments.filter(a => a.filename.endsWith('.pdf'));
    const clientEmailPromise = sendEmailViaResend(clientSubject, clientHtmlContent, clientAttachments, leadForm.email);

    const [saveLeadResult, result, clientResult] = await Promise.all([saveLeadPromise, emailPromise, clientEmailPromise]);
    setIsSubmitting(false);

    if (result && result.success) {
      if (!saveLeadResult.success) {
        console.warn("Failed to save lead to Sanity:", saveLeadResult.error);
      }
      setStep(N_QUIZ + 5);
    } else {
      alert("Failed to send the email report. Error: " + (result?.error || "Unknown Error from Resend API"));
    }
  };

  const calculateCompleteness = () => {
    let score = 50;
    if (answers.stage && answers.stage.length > 0) score += 20;
    if (clusters.length > 0) score += 15;
    if (selectedDeliverables.length > 0) score += 15;
    return score;
  };

  const LiveScopePreview = () => {
    const completeness = calculateCompleteness();
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (completeness / 100) * circumference;

    return (
    <div className="border border-white/20 rounded-[24px] flex flex-col h-full shadow-[0_40px_80px_rgba(0,0,0,0.6),_inset_0_0_40px_rgba(255,255,255,0.05)] relative overflow-hidden w-full print-blueprint-container backdrop-blur-3xl" style={{ backgroundColor: hexToRgba(palette.orange, 0.15) }}>
      
      {/* Tech Grid Background overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

      {/* Moving Light Reflections & Ambient Gradients using PBH palette */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-20 pointer-events-none print:hidden"
        style={{
          
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

      {/* Edge Glow Sweeper */}
      <motion.div
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 w-[2px] h-[30%] opacity-80"
        style={{ background: `linear-gradient(to bottom, transparent, ${palette.orange}, transparent)`, boxShadow: `0 0 20px ${palette.orange}` }}
      />

      <div className="relative z-10 p-8 pt-12 md:pt-8 flex flex-col h-full">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/20 pb-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-4 h-4">
              <motion.div 
                animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: palette.accent }}
              />
              <div className="w-2.5 h-2.5 rounded-full z-10" style={{ backgroundColor: palette.accent, boxShadow: `0 0 15px ${palette.accent}` }} />
            </div>
            <h3 className="text-[13px] md:text-[15px] font-medium uppercase tracking-widest text-white drop-shadow-md pt-1 font-primary">
              Live Blueprint
            </h3>
          </div>

        </div>
        
        <div className="relative flex-grow flex min-h-0">
          {/* Connection Lines Spine */}
          <div className="absolute left-[11px] top-4 bottom-10 w-[2px] bg-white/20 overflow-hidden rounded-full shadow-[0_0_5px_rgba(255,255,255,0.1)]">
            <motion.div
              animate={{ y: [-100, 800] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-[80px]"
              style={{ background: `linear-gradient(to bottom, transparent, ${palette.primary}, #fff, transparent)`, boxShadow: `0 0 15px ${palette.primary}` }}
            />
          </div>

          <div className="pl-10 space-y-10 w-full overflow-y-auto pr-2 custom-scrollbar pb-8 relative">
            
            {/* 1. CURRENT STATE */}
            <div className="group relative">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -left-10 top-1 w-[6px] h-[6px] rounded-full bg-white border z-10" style={{ borderColor: palette.primary, boxShadow: `0 0 12px ${palette.primary}` }} />
              <div className="text-[13px] md:text-[15px] font-medium uppercase tracking-widest mb-3 font-primary flex items-center gap-2 drop-shadow-md text-white">
                <Terminal className="w-4 h-4" style={{ color: palette.primary }} />
                System State
              </div>
              <div className="relative bg-white/[0.03] border border-white/10 rounded-[16px] overflow-hidden p-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-colors duration-500 hover:bg-white/[0.05]">
                {/* Scanning line */}
                <motion.div
                  animate={{ y: ['0%', '200%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] z-0"
                  style={{ top: '0%', background: `linear-gradient(to right, transparent, ${hexToRgba(palette.primary, 0.8)}, transparent)`, boxShadow: `0 0 15px ${palette.primary}` }}
                />
                
                <AnimatePresence mode="popLayout">
                  {answers.stage && answers.stage.length > 0 ? (
                    <motion.div 
                      key="stage-selected"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative z-10"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-[17px] md:text-[19px] text-white font-primary tracking-tight">Active Profile</div>
                        <div className="text-[13px] md:text-[15px] font-secondary text-white/40 tracking-widest uppercase">ID: {(Array.isArray(answers.stage) && answers.stage.length > 0) ? answers.stage[0].id : 'SYS-001'}</div>
                      </div>
                      <div className="text-[17px] md:text-[19px] font-light text-white/70 font-secondary leading-snug drop-shadow-sm">{(Array.isArray(answers.stage) && answers.stage.length > 0) ? answers.stage.map(s => s.label).join(', ') : 'Evaluating profile metrics...'}</div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="stage-pending"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center gap-3 relative z-10"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: palette.primary }} />
                      <div className="text-[17px] md:text-[19px] font-semibold text-white/70 tracking-widest uppercase font-secondary">Awaiting Initialization...</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 2. STRATEGIC GAPS */}
            <div className="group relative">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="absolute -left-10 top-1 w-[6px] h-[6px] rounded-full bg-white border z-10" style={{ borderColor: palette.orange, boxShadow: `0 0 12px ${palette.orange}` }} />
              <div className="text-[13px] md:text-[15px] font-medium uppercase tracking-widest mb-3 font-primary flex items-center gap-2 text-white drop-shadow-md">
                <AlertCircle className="w-4 h-4" style={{ color: palette.orange }} />
                Strategic Gaps
              </div>
              <div className="relative bg-white/[0.03] border border-white/10 rounded-[16px] p-6 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-colors duration-500 hover:bg-white/[0.05]" style={{ boxShadow: `0 10px 30px rgba(0,0,0,0.2), inset 0 0 30px ${hexToRgba(palette.orange, 0.05)}` }}>
                {clusters.length > 0 && (
                  <motion.div 
                    className="absolute inset-0 border rounded-[16px]"
                    style={{ borderColor: hexToRgba(palette.orange, 0.6) }}
                    animate={{ opacity: [0.1, 0.8, 0.1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                )}
                <div className="flex flex-wrap gap-3 relative z-10 min-h-[40px]">
                  <AnimatePresence>
                    {clusters.length > 0 ? clusters.map((c, i) => (
                      <motion.div 
                        key={c} 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                        className="px-4 py-2 text-[13px] md:text-[15px] font-medium uppercase tracking-widest rounded-[8px] font-primary flex items-center gap-2 group/chip cursor-default" 
                        style={{ 
                          backgroundColor: hexToRgba(palette.orange, 0.2), 
                          color: '#FFF', 
                          border: `1px solid ${hexToRgba(palette.orange, 0.6)}`,
                          boxShadow: `0 0 20px ${hexToRgba(palette.orange, 0.3)}`,
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <Zap className="w-4 h-4" style={{ color: '#FFD700' }} />
                        {c}
                      </motion.div>
                    )) : (
                      <motion.span 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-[13px] md:text-[15px] font-medium text-white/50 tracking-widest uppercase font-primary flex items-center gap-3"
                      >
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: palette.orange }}/>
                        Analyzing Vulnerabilities...
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* 3. DELIVERABLES SCOPE */}
            <div className="group relative">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="absolute -left-10 top-1 w-[6px] h-[6px] rounded-full bg-white border border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10" />
              <div className="text-[13px] md:text-[15px] font-medium text-white uppercase tracking-widest mb-3 font-primary flex items-center gap-2 drop-shadow-md">
                <Layers className="w-4 h-4" style={{ color: palette.blue }} />
                Active Directives
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-[16px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)] min-h-[140px] backdrop-blur-xl transition-colors duration-500 hover:bg-white/[0.05]">
                {selectedDeliverables.length > 0 ? (
                  <ul className="space-y-4">
                    <AnimatePresence>
                      {selectedDeliverables.map(id => DELIVERABLES_BY_ID.get(id)).filter(Boolean).map((d, i) => (
                        <motion.li 
                          layout
                          initial={{ opacity: 0, x: -20, backgroundColor: hexToRgba(palette.blue, 0.2) }}
                          animate={{ opacity: 1, x: 0, backgroundColor: hexToRgba(palette.blue, 0.05) }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          key={d.id} 
                          className="flex items-start gap-4 rounded-[12px] -mx-2 px-3 py-3 border border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <div className="mt-0.5 shrink-0 bg-white/10 rounded-full p-1 border border-white/20">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={palette.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <motion.path 
                                d="M20 6L9 17l-5-5" 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, delay: i * 0.05 + 0.2 }}
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="text-[15px] font-bold text-white tracking-wide font-secondary drop-shadow-sm">{d.name}</div>
                            <div className="text-[17px] md:text-[19px] font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5" style={{ color: palette.blue }}>
                              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: palette.blue }} />
                              Directive Verified
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-70">
                    <Target className="w-10 h-10 mb-5 text-white/30" />
                    <div className="text-[13px] md:text-[15px] font-medium text-white/50 uppercase tracking-widest font-primary flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse"/>
                      Standby for Directives
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. HEALTH SCORE */}
            <div className="group relative">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }} className="absolute -left-10 top-10 w-[6px] h-[6px] rounded-full bg-white border z-10" style={{ borderColor: palette.green, boxShadow: `0 0 12px ${palette.green}` }} />
              <div className="bg-gradient-to-br border border-white/20 rounded-[16px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center justify-between backdrop-blur-xl border-t-white/30" >
                <div>
                  <div className="text-[13px] md:text-[15px] font-medium uppercase tracking-widest mb-2 font-primary flex items-center gap-2 text-white">
                    <Activity className="w-4 h-4" style={{ color: palette.green }} />
                    System Health
                  </div>
                  <div className="text-[17px] md:text-[19px] font-bold text-white/90 tracking-widest font-secondary drop-shadow-md">STRATEGIC COMPLETENESS</div>
                </div>
                
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="rgba(255,255,255,0.1)" 
                      strokeWidth="8"
                    />
                    <motion.circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke={completeness === 100 ? palette.green : palette.blue} 
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.5, ease: "easeOut", type: "spring" }}
                      strokeLinecap="round"
                      style={{ filter: `drop-shadow(0 0 12px ${hexToRgba(completeness === 100 ? palette.green : palette.blue, 0.8)})` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <motion.span 
                      key={completeness}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[17px] md:text-[19px] font-bold text-white font-secondary drop-shadow-md"
                    >
                      {completeness}%
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    );
  };

  const stepsArray = [
    // 0: Opening Question (Replacing Welcome Splash)
    <div key="s0" className="flex flex-col justify-center h-full text-left w-full mx-auto md:mx-0">
      <FadeUp>
        <div className="text-[13px] md:text-[15px] font-medium text-white/50 uppercase tracking-widest mb-6 font-primary">{finalSettings.assessmentPage?.phase1Label || 'Phase 1 / Discovery'} (0/{N_QUIZ})</div>
        <h2 className="text-3xl md:text-5xl font-light mb-4 font-primary leading-tight">{finalSettings.assessmentPage?.welcomeTitle || "Let's start with the basics."}</h2>
        <p className="text-[17px] md:text-[19px] text-white/50 mb-10 font-secondary max-w-2xl">{finalSettings.assessmentPage?.welcomeText || "Before we map your strategic gaps, please tell us who we are building this scope for."}</p>
        
        <div className="space-y-6 max-w-xl">
          <div>
            <label className="block text-[13px] md:text-[15px] font-medium text-white/50 uppercase tracking-widest mb-3 font-primary">{finalSettings.assessmentPage?.companyInputLabel || 'Brand / Business Name'}</label>
            <input 
              type="text" 
              value={leadForm.company}
              onChange={(e) => setLeadForm({...leadForm, company: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-[12px] px-5 py-4 text-[17px] md:text-[19px] font-light text-white font-secondary focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all"
              placeholder="e.g. PurpleBlue House"
            />
          </div>
          <div className="relative z-50">
            <label className="block text-[13px] md:text-[15px] font-medium text-white/50 uppercase tracking-widest mb-3 font-primary">{finalSettings.assessmentPage?.industryInputLabel || 'Industry / Sector'}</label>
            <div 
              onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)}
              className="w-full bg-black/40 border border-white/10 rounded-[12px] px-5 py-4 text-[17px] md:text-[19px] font-light text-white font-secondary focus:outline-none hover:border-cyan-400 focus:bg-white/5 transition-all cursor-pointer flex justify-between items-center"
            >
              <span className={leadForm.industry ? "text-white" : "text-white/50"}>{leadForm.industry || 'Select your sector'}</span>
              <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${isSectorDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {isSectorDropdownOpen && (
              <>
                <div className="fixed inset-0 z-[90]" onClick={() => setIsSectorDropdownOpen(false)}></div>
                <div className="absolute top-full left-0 mt-2 w-full md:top-0 md:left-[calc(100%+24px)] md:mt-0 md:w-[400px] bg-[#0a1028] border border-white/10 rounded-[16px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[100] overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10 bg-white/[0.02]">
                    <span className="text-[13px] text-white/50 uppercase tracking-widest font-primary">Select Sector</span>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto custom-scrollbar py-2">
                    {SECTORS.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setLeadForm({...leadForm, industry: s});
                          setIsSectorDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 hover:bg-white/5 transition-colors font-secondary text-[16px] md:text-[17px] font-light flex items-center justify-between ${leadForm.industry === s ? 'text-cyan-400 bg-white/[0.03]' : 'text-white/80'}`}
                      >
                        {s}
                        {leadForm.industry === s && <Check className="w-4 h-4 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {leadForm.industry === 'Other' && (
              <input 
                type="text" 
                value={leadForm.otherIndustry || ''}
                onChange={(e) => setLeadForm({...leadForm, otherIndustry: e.target.value})}
                className="w-full mt-4 bg-black/40 border border-white/10 rounded-[12px] px-5 py-4 text-[17px] md:text-[19px] font-light text-white font-secondary focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all"
                placeholder="Please specify your sector"
              />
            )}
          </div>
          
          <PremiumButton 
            onClick={() => {
              if (leadForm.company) setStep(1);
            }} 
            className={`w-full sm:w-auto px-10 py-4 mt-4 ${!leadForm.company ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {finalSettings.assessmentPage?.startBtn || 'Start Scope Builder'}
          </PremiumButton>
        </div>
      </FadeUp>
    </div>,

    // 1 to N: Quiz Questions
    ...QUIZ_QUESTIONS.map((q, i) => {
      const isMultiSelect = q.multiSelect;
      const currentAnswer = answers[q.id];
      const hasAnswer = isMultiSelect ? (Array.isArray(currentAnswer) && currentAnswer.length > 0) : !!currentAnswer;

      return (
      <div key={`q${i}`} className="flex flex-col justify-center h-full w-full text-left mx-auto md:mx-0">
        <FadeUp>
          <div className="text-[13px] md:text-[15px] font-medium text-white/50 uppercase tracking-widest mb-6 font-primary">{finalSettings.assessmentPage?.phase1Label || 'Phase 1 / Discovery'} ({i + 1}/{N_QUIZ})</div>
          <h2 className="text-3xl md:text-5xl font-light mb-4 font-primary leading-tight">{q.title}</h2>
          {isMultiSelect && <p className="text-[17px] md:text-[19px] text-cyan-400 mb-8 font-secondary font-light">{finalSettings.assessmentPage?.multiSelectHint || 'Select all that apply.'}</p>}
          {!isMultiSelect && <p className="text-[17px] md:text-[19px] text-white/40 mb-8 font-secondary font-light">{q.hint || finalSettings.assessmentPage?.singleSelectHint || 'Select the most accurate statement.'}</p>}
          
          <StaggerGroup className="space-y-3 w-full max-w-3xl">
            {q.options.map((opt, j) => {
              const isSelected = isMultiSelect 
                ? (Array.isArray(currentAnswer) && currentAnswer.some(a => a.id === opt.id))
                : (currentAnswer?.id === opt.id);
              
              return (
                <StaggerItem key={opt.id}>
                  <button
                    onClick={() => handleQuizSelect(q.id, opt, isMultiSelect)}
                    className="w-full text-left p-5 rounded-[12px] border transition-all duration-300 flex items-center gap-4 font-secondary hover:translate-x-1"
                    style={{ borderColor: isSelected ? palette.primary : 'rgba(255,255,255,0.1)', backgroundColor: isSelected ? hexToRgba(palette.primary, 0.1) : 'rgba(255,255,255,0.02)', color: isSelected ? 'white' : 'rgba(255,255,255,0.6)' }}
                  >
                    <span className="font-secondary italic opacity-40 text-[17px] md:text-[19px] w-6 shrink-0">0{j + 1}</span>
                    <span className="flex-1">
                      <span className="text-[17px] md:text-[19px] font-light block">{opt.label}</span>
                      {opt.desc && <span className="text-[17px] md:text-[19px] text-white/40 mt-1 block font-light leading-snug">{opt.desc}</span>}
                    </span>
                    {isMultiSelect && isSelected && <Check className="w-5 h-5 shrink-0" style={{ color: palette.primary }} />}
                  </button>
                </StaggerItem>
              )
            })}
          </StaggerGroup>

          <StaggerGroup className="mt-6 w-full max-w-3xl">
            <StaggerItem>
              <textarea
                placeholder="Add any additional context or comments (optional)..."
                value={comments[q.id] || ''}
                onChange={(e) => setComments(prev => ({ ...prev, [q.id]: e.target.value }))}
                className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] p-4 text-white/80 font-secondary focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all text-[17px] md:text-[19px] resize-none"
                rows={2}
              />
            </StaggerItem>
          </StaggerGroup>

          <div className="mt-10 flex flex-wrap gap-4 items-center">
            <PremiumButton 
              onClick={hasAnswer ? handleContinue : undefined} 
              className={`px-10 py-4 ${!hasAnswer ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {finalSettings.assessmentPage?.continueBtn || 'Continue'} <ArrowRight className="w-5 h-5 ml-2" />
            </PremiumButton>
            {isMultiSelect && (
              <button 
                onClick={() => {
                  const allValidOptions = q.options.filter(o => !o.id.startsWith('none'));
                  setAnswers(prev => ({ ...prev, [q.id]: allValidOptions }));
                }}
                className="px-6 py-4 border border-white/20 rounded-[12px] text-white/60 hover:text-white hover:bg-white/5 transition-colors font-secondary text-[17px] md:text-[19px] font-medium"
              >
                {finalSettings.assessmentPage?.selectAllBtn || 'Select All'}
              </button>
            )}
          </div>
        </FadeUp>
      </div>
      );
    }),

    // N+1: Diagnosis Result
    <div key="diag" className="flex flex-col justify-center h-full w-full text-left mx-auto md:mx-0">
      <FadeUp>
        <div className="text-[13px] md:text-[15px] font-medium text-white/50 uppercase tracking-widest mb-6 flex items-center gap-2 font-primary" style={{ color: palette.primary }}><Sparkles className="w-4 h-4" /> {finalSettings.assessmentPage?.diagPhaseLabel || 'Discovery Insights'}</div>
        <h2 className="text-3xl md:text-5xl font-light mb-6 font-primary leading-tight">{finalSettings.assessmentPage?.diagTitle || 'Your brand opportunity areas.'}</h2>
        <p className="text-[17px] md:text-[19px] text-white/50 font-light mb-12 font-secondary max-w-3xl">{finalSettings.assessmentPage?.diagPrefixText || 'Based on your responses, we recommend building your brand through'} <strong className="text-white">{clusters.join(' & ')}</strong>. Your suggested blueprint has been pre-selected below.</p>
        <StaggerGroup className="grid sm:grid-cols-2 gap-4 mb-12 w-full max-w-4xl">
          {routes.map(r => {
            const rColor = palette[ROUTES_INFO[r].type] || palette.primary;
            return (
              <StaggerItem key={r}>
                <div className="border border-white/10 rounded-[16px] p-6 text-left flex flex-col h-full w-full" style={{ backgroundColor: palette.panel }}>
                  <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center mb-6 shadow-sm`} style={{ backgroundColor: rColor, color: palette.bgDeep }}>{ROUTES_INFO[r].icon}</div>
                  <h4 className="text-xl font-medium mb-2 font-primary">{ROUTES_INFO[r].title}</h4>
                  <p className="text-[17px] md:text-[19px] text-white/40 font-light leading-relaxed font-secondary">{ROUTES_INFO[r].desc}</p>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setReadMorePopup(ROUTES_INFO[r]);
                    }}
                    className="text-[17px] md:text-[19px] uppercase tracking-wider font-medium text-cyan-400 hover:text-cyan-300 transition-colors mt-4 self-start"
                  >
                    {finalSettings.assessmentPage?.readMoreBtn || 'Read More'}
                  </button>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
        <div className="flex gap-6 items-center">
          <PremiumButton onClick={() => setStep(N_QUIZ + 2)}>{finalSettings.assessmentPage?.selectDeliverablesBtn || 'Select Deliverables'}</PremiumButton>
          <button onClick={() => setStep(N_QUIZ)} className="text-white/40 hover:text-white text-[17px] md:text-[19px] transition-colors font-secondary">Back</button>
        </div>
      </FadeUp>
    </div>,

    // N+3: Deliverables Selection
    <div key="delivSel" className="flex flex-col h-full w-full py-10 text-left mx-auto md:mx-0">
      <FadeUp>
        <div className="text-[13px] md:text-[15px] font-medium text-white/50 uppercase tracking-widest mb-6 font-primary">{finalSettings.assessmentPage?.detailsPhaseLabel || 'Phase 3 / Details'}</div>
        <h2 className="text-3xl md:text-5xl font-light mb-2 font-primary leading-tight">{finalSettings.assessmentPage?.buildScopeTitle || 'Your Suggested PBH Blueprint'}</h2>
        <p className="text-[17px] md:text-[19px] text-white/50 font-light mb-6 font-secondary">{finalSettings.assessmentPage?.buildScopeText || 'Based on your responses, we have pre-selected the routes and deliverables that may be most relevant to your brand. You can remove anything that does not feel relevant.'}</p>
        {(() => {
          const dId = answers['q6_duration']?.id;
          const msgs = {
            q6_o1: 'This looks like a strong 6-month scope. We have prioritised the most relevant foundations and systems. PBH will refine this further in the proposal.',
            q6_o2: 'This looks suited to a long-term PBH engagement. We have kept the blueprint broad so the work can be phased thoughtfully.',
            q6_o3: 'A 3-month engagement is best suited for a focused intervention. You can keep this scope lean or choose a 6-month engagement for a fuller PBH process.',
          };
          const msg = msgs[dId];
          return msg ? (
            <p className="text-white/60 font-light mb-10 font-secondary text-[17px] md:text-[19px] border border-white/10 rounded-[10px] px-5 py-3 bg-white/[0.03]">{msg}</p>
          ) : null;
        })()}
        <StaggerGroup className="space-y-10 w-full pb-10">
          {selectedRoutes.map(rId => {
            const route = ROUTES_INFO[rId];
            const rColor = palette[route.type] || palette.primary;
            return (
              <StaggerItem key={rId}>
                <h4 className="text-[17px] md:text-[19px] font-medium tracking-widest uppercase mb-4 pb-2 border-b border-white/5 flex items-center gap-2 font-primary" style={{ color: rColor }}>{route.icon} {route.title}</h4>
                <div className="space-y-6 w-full max-w-4xl">
                  {route.lineItems.map(li => {
                    const delivs = DELIVERABLES_MASTER.filter(d => d.lineItem === li.id);
                    if (delivs.length === 0) return null;
                    return (
                      <div key={li.id} className="bg-white/[0.01] border border-white/5 rounded-[12px] w-full overflow-hidden">
                        <div className="bg-[#010D54] py-4 px-6 border-b border-white/10 mb-6 flex justify-between items-center gap-4">
                          <div>
                            <h5 className="font-medium text-white text-[17px] md:text-[19px] font-primary">{li.name}</h5>
                            {li.desc && <p className="text-white/50 text-[17px] md:text-[19px] font-secondary mt-1 font-light">{li.desc}</p>}
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const allIds = delivs.map(d => d.id);
                              setSelectedDeliverables(prev => {
                                const newSet = new Set(prev);
                                allIds.forEach(id => newSet.add(id));
                                return Array.from(newSet);
                              });
                            }}
                            className="text-[17px] md:text-[19px] uppercase tracking-widest text-white/50 hover:text-white transition-colors border border-white/20 px-3 py-1.5 rounded shrink-0"
                          >
                            Select All
                          </button>
                        </div>
                        <div className="px-6 pb-6">
                        <div className="grid gap-3 w-full">
                          {delivs.map(d => {
                            const isSelected = selectedDeliverables.includes(d.id);
                            const isWarning = warnings.includes(d.id);
                            return (
                              <div key={d.id} className={`p-4 rounded-[8px] border transition-all flex flex-col gap-3 font-secondary w-full ${isSelected ? 'border-[#2A97D9] bg-[#2A97D9]/10' : 'border-white/10 bg-white/[0.03] hover:-translate-y-[1px]'}`}>
                                <div className="flex items-start gap-4 cursor-pointer" onClick={() => handleDeliverableToggle(d.id)}>
                                  <div className={`w-4 h-4 rounded-sm border mt-1 flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#2A97D9] border-[#2A97D9]' : 'border-white/30'}`}>{isSelected && <Check className="w-3 h-3 text-white" />}</div>
                                  <div className="flex-1 text-left">
                                    <div className={`font-medium text-[17px] md:text-[19px] mb-1 ${isSelected ? 'text-white' : 'text-white/70'}`}>{d.name} {isWarning && <span className="ml-2 text-[17px] md:text-[19px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/30">Missing Prereqs</span>}</div>
                                    {d.interdependence !== 'None' && (
                                      <div className="text-[17px] md:text-[19px] text-white/40 mt-1">Requires: {formatInterdependence(d.interdependence)}</div>
                                    )}
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="pl-8 flex items-center gap-3 mt-2 border-t border-white/5 pt-3">
                                    <span className="text-[17px] md:text-[19px] uppercase tracking-widest text-white/40">Priority:</span>
                                    <select value={priorities[d.id] || 'Standard'} onChange={e => setPriorities(p => ({ ...p, [d.id]: e.target.value }))} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[17px] md:text-[19px] text-white outline-none">
                                      <option value="Standard">Standard</option>
                                      <option value="High">High</option>
                                      <option value="Critical">Critical</option>
                                    </select>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
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
          <PremiumButton disabled={selectedDeliverables.length === 0} onClick={() => setStep(N_QUIZ + 3)}>{finalSettings.assessmentPage?.nextProjectContextBtn || 'Next: Project Context'}</PremiumButton>
          <button onClick={() => setStep(N_QUIZ + 1)} className="text-white/40 hover:text-white text-[17px] md:text-[19px] transition-colors font-secondary">Back</button>
        </div>
      </FadeUp>
    </div>,

    // N+4: Context
    <div key="ctxSel" className="flex flex-col justify-center h-full w-full text-left mx-auto md:mx-0">
      <FadeUp>
        <div className="text-[13px] md:text-[15px] font-medium text-white/50 uppercase tracking-widest mb-6 font-primary">{finalSettings.assessmentPage?.execPhaseLabel || 'Phase 4 / Execution'}</div>
        <h2 className="text-3xl md:text-5xl font-light mb-10 font-primary leading-tight">{finalSettings.assessmentPage?.projectContextTitle || 'Project Context.'}</h2>
        <div className="space-y-6 w-full mb-12 max-w-3xl">
          <div className="w-full">
            <label className="block text-[13px] md:text-[15px] font-medium text-white/50 uppercase tracking-widest mb-3 font-primary">{finalSettings.assessmentPage?.commencementLabel || 'what is your expected commencement date?'}</label>
            <select value={context.duration} onChange={e => setContext({ ...context, duration: e.target.value })} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-[17px] md:text-[19px] font-light text-white focus:outline-none appearance-none font-secondary" style={{ '--tw-ring-color': palette.blue }}>
              <option value="Short term (minimum 3 months)" style={{ backgroundColor: palette.bgDeep }}>Short term (minimum 3 months)</option>
              <option value="Deep Dive- Branding (minimum 6 months)" style={{ backgroundColor: palette.bgDeep }}>Deep Dive- Branding (minimum 6 months)</option>
              <option value="Long Term Engagement (1 year- Monthly Retainer)" style={{ backgroundColor: palette.bgDeep }}>Long Term Engagement (1 year- Monthly Retainer)</option>
            </select>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <PremiumButton disabled={!context.duration} onClick={() => setStep(N_QUIZ + 4)}>{finalSettings.assessmentPage?.finalizeBlueprintBtn || 'Finalize Blueprint'}</PremiumButton>
          <button onClick={() => setStep(N_QUIZ + 2)} className="text-white/40 hover:text-white text-[17px] md:text-[19px] transition-colors font-secondary">Back</button>
        </div>
      </FadeUp>
    </div>,

    // N+5: Lead Capture
    <div key="leadCap" className="flex flex-col justify-center h-full w-full text-left mx-auto md:mx-0">
      <FadeUp>
        <div className="text-[13px] md:text-[15px] font-medium uppercase tracking-widest mb-6 font-primary" style={{ color: palette.blue }}>{finalSettings.assessmentPage?.finalStepLabel || 'Final Step'}</div>
        <h2 className="text-3xl md:text-5xl font-light mb-6 font-primary leading-tight">{finalSettings.assessmentPage?.leadTitle || 'Where should we send your Scope Snapshot?'}</h2>
        <p className="text-white/50 font-light mb-10 text-[17px] md:text-[19px] font-secondary max-w-3xl">{finalSettings.assessmentPage?.leadText || 'Enter your details below to instantly generate your strategy report and brief our consulting team.'}</p>
        <form onSubmit={submitLead} className="space-y-4 w-full font-secondary max-w-3xl">
          <input required type="text" placeholder={finalSettings.forms?.namePlaceholder || "Full Name"} value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-[17px] md:text-[19px] font-light font-secondary text-white focus:outline-none" style={{ '--tw-ring-color': palette.blue }} />
          <input required type="email" placeholder={finalSettings.forms?.emailPlaceholder || "Work Email"} value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-[17px] md:text-[19px] font-light font-secondary text-white focus:outline-none" style={{ '--tw-ring-color': palette.blue }} />
          <input required type="tel" placeholder={finalSettings.forms?.phonePlaceholder || "Phone Number"} value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-[17px] md:text-[19px] font-light font-secondary text-white focus:outline-none" style={{ '--tw-ring-color': palette.blue }} />
          <div className="pt-6 flex gap-4 items-center">
            <PremiumButton type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-10">
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {finalSettings.assessmentPage?.processingText || 'Processing...'}</> : (finalSettings.assessmentPage?.generateReportBtn || 'Generate Report & Send Brief')}
            </PremiumButton>
            <button type="button" onClick={() => setStep(N_QUIZ + 3)} disabled={isSubmitting} className="text-white/40 hover:text-white text-[17px] md:text-[19px] transition-colors disabled:opacity-50">Back</button>
          </div>
        </form>
      </FadeUp>
    </div>,

    // N+6: The Scope Snapshot Report
    <div key="snap" className="flex flex-col justify-center h-full w-full py-12 print:py-0 print:block">
      <FadeUp className="relative p-[1px] rounded-[24px] bg-gradient-to-b from-white/20 to-white/5 w-full print:p-0 print:bg-none print:rounded-none">
        <div className="rounded-[23px] p-8 md:p-14 relative overflow-hidden text-left shadow-[0_50px_100px_rgba(0,0,0,0.8)] print:p-0 print:shadow-none print:rounded-none print:overflow-visible print-blueprint-container" style={{ backgroundColor: palette.bgDeep }}>
          <div className="flex flex-col md:flex-row justify-between items-start border-b border-white/10 pb-8 mb-10 relative z-10 gap-6 w-full">
            <div>
              <div className="text-[13px] md:text-[15px] font-medium text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2 font-primary" style={{ color: palette.primary }}><FileText className="w-4 h-4" /> {finalSettings.assessmentPage?.scopeSnapshotLabel || 'Official Scope Snapshot'}</div>
              <h2 className="text-3xl md:text-5xl font-light text-white mb-2 font-primary leading-tight">{leadForm.company || 'Your Brand'}</h2>
              <p className="text-white/50 text-[17px] md:text-[19px] font-secondary">Prepared for {leadForm.name || 'Client'}</p>
            </div>
            <div className="md:text-right">
              <div className="text-[17px] md:text-[19px] text-white/30 uppercase tracking-widest mb-1 font-primary">Date Generated</div>
              <div className="text-[17px] md:text-[19px] font-medium text-white/70 font-secondary">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 relative z-10 w-full print:grid-cols-1 print:gap-8">
            <div className="space-y-10 w-full">
              <div className="bg-white/[0.02] border border-white/5 rounded-[16px] p-8 mb-8 relative overflow-hidden w-full">
                <h4 className="text-[17px] md:text-[19px] uppercase tracking-widest text-white/40 mb-8 font-primary">Brand Alignment Profile</h4>
                <BrandHealthRadar clusters={clusters} />
              </div>

              <div className="w-full">
                <h4 className="text-[17px] md:text-[19px] uppercase tracking-widest text-white/40 mb-4 border-b border-white/5 pb-2 font-primary">Recommended Ecosystems</h4>
                <div className="flex flex-wrap gap-2 w-full">
                  {selectedRoutes.map(r => <span key={r} className="px-3 py-1.5 bg-white/5 text-white/70 text-[17px] md:text-[19px] border border-white/10 rounded-full flex items-center gap-2 font-secondary">{ROUTES_INFO[r]?.icon} {ROUTES_INFO[r]?.title}</span>)}
                </div>
              </div>

              <div className="w-full">
                <h4 className="text-[17px] md:text-[19px] uppercase tracking-widest text-white/40 mb-4 border-b border-white/5 pb-2 font-primary">Execution Context</h4>
                <div className="text-[17px] md:text-[19px] text-white/70 font-light space-y-3 bg-white/[0.02] p-6 rounded-[12px] border border-white/5 font-secondary w-full">
                  <p className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Brand Stage</span> <span className="text-right">{(Array.isArray(answers.stage) && answers.stage.length > 0) ? answers.stage.map(s => s.label).join(', ') : 'Not Selected'}</span></p>
                  <p className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Expected Commencement Date</span> <span className="text-right">{context.duration}</span></p>
                  <p className="flex justify-between"><span className="text-white/40 text-left">Suggested Starting Point</span> <span className="text-right text-[#6865FA]">{computeSuggestedStartingPoint(selectedDeliverables, priorities)}</span></p>
                </div>
              </div>
            </div>

            <div className="w-full">
              <h4 className="text-[17px] md:text-[19px] uppercase tracking-widest text-white/40 mb-4 border-b border-white/5 pb-2 font-primary">Selected Deliverables Blueprint</h4>
              <ul className="space-y-3 w-full max-h-[500px] overflow-y-auto custom-scrollbar pr-3 print:max-h-none print:overflow-visible print:pr-0">
                {selectedDeliverables.map(id => DELIVERABLES_BY_ID.get(id)).filter(Boolean).map(d => (
                  <li key={d.id} className="flex items-start gap-3 bg-white/[0.02] p-4 rounded-[12px] border border-white/5 w-full print:break-inside-avoid">
                    <div className="p-1.5 rounded-md shrink-0 mt-0.5" style={{ backgroundColor: hexToRgba(palette.blue, 0.2) }}><CheckSquare className="w-4 h-4" style={{ color: palette.blue }} /></div>
                    <div className="w-full">
                      <div className="text-[17px] md:text-[19px] font-medium text-white mb-1 font-secondary flex items-center justify-between">
                        <span>{d.name} {warnings.includes(d.id) && <AlertCircle className="w-3 h-3 inline text-yellow-400 ml-1" />}</span>
                        <span className="text-[17px] md:text-[19px] uppercase tracking-widest text-white/40">{priorities[d.id] || 'Standard'}</span>
                      </div>
                      <div className="text-[17px] md:text-[19px] text-white/40 leading-relaxed font-secondary">ID: {d.id}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10 w-full">
            <p className="text-[17px] md:text-[19px] text-white/40 max-w-md leading-relaxed font-secondary">This snapshot has been securely routed to our partners. We will review your requirements and reach out within 24 hours to schedule a discovery alignment.</p>
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
    <div className="min-h-screen text-[#F4F4F5] pt-28 pb-0 relative w-full print:overflow-visible print:pt-0 print:pb-12" style={{ backgroundColor: palette.bgDeep }}>
      {readMorePopup && (
        <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm text-left">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0C185C] border border-white/10 p-8 rounded-[24px] max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setReadMorePopup(null)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center mb-6 shadow-sm`} style={{ backgroundColor: palette[readMorePopup.type] || palette.primary, color: palette.bgDeep }}>{readMorePopup.icon}</div>
            <h3 className="text-xl md:text-2xl font-light mb-4 text-white font-primary">{readMorePopup.title}</h3>
            <div className="mt-6 text-[17px] md:text-[19px] text-white/60 font-secondary font-light leading-relaxed flex flex-col gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {(readMorePopup.expandedDesc || readMorePopup.desc).split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
              ))}
            </div>
            <div className="mt-8">
              <PremiumButton onClick={() => setReadMorePopup(null)} className="w-full">Close</PremiumButton>
            </div>
          </motion.div>
        </div>
      )}

      {dependencyModal && (
        <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm text-left">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0C185C] border border-white/10 p-8 rounded-[24px] max-w-lg w-full shadow-2xl">
            {dependencyModal.type === 'add' ? (
              <>
                <h3 className="text-xl md:text-2xl font-light mb-4 text-white font-primary">Missing Prerequisites</h3>
                <p className="text-white/60 mb-6 font-secondary">This deliverable requires {dependencyModal.related.length} other foundation(s) to be executed properly:</p>
                <ul className="mb-8 space-y-2 max-h-40 overflow-y-auto custom-scrollbar font-secondary border border-white/5 bg-white/[0.02] p-4 rounded-lg">
                  {dependencyModal.related.map(id => {
                    const d = DELIVERABLES_BY_ID.get(id);
                    return <li key={id} className="text-[17px] md:text-[19px] text-white/80 flex items-center gap-2"><ArrowRight className="w-3 h-3 text-[#6865FA] shrink-0" /> {d?.name || id}</li>;
                  })}
                </ul>
                <div className="flex flex-col gap-3 font-secondary">
                  <button onClick={() => {
                    setSelectedDeliverables(prev => [...new Set([...prev, dependencyModal.deliverable, ...dependencyModal.related])]);
                    setDependencyModal(null);
                  }} className="bg-[#6865FA] text-white py-3 rounded-[8px] font-medium text-[17px] md:text-[19px] hover:brightness-110">Add all required prerequisites</button>
                  <button onClick={() => {
                    setSelectedDeliverables(prev => [...prev, dependencyModal.deliverable]);
                    setWarnings(prev => [...prev, dependencyModal.deliverable]);
                    setDependencyModal(null);
                  }} className="bg-white/5 border border-white/10 text-white py-3 rounded-[8px] font-medium text-[17px] md:text-[19px] hover:bg-white/10">Keep this deliverable with a warning</button>
                  <button onClick={() => setDependencyModal(null)} className="text-white/50 py-2 text-[17px] md:text-[19px] hover:text-white">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl md:text-2xl font-light mb-4 text-white font-primary">Warning: Breaking Dependencies</h3>
                <p className="text-white/60 mb-6 font-secondary">Removing this will also break the foundation for {dependencyModal.related.length} dependent deliverable(s):</p>
                <ul className="mb-8 space-y-2 max-h-40 overflow-y-auto custom-scrollbar font-secondary border border-white/5 bg-white/[0.02] p-4 rounded-lg">
                  {dependencyModal.related.map(id => {
                    const d = DELIVERABLES_BY_ID.get(id);
                    return <li key={id} className="text-[17px] md:text-[19px] text-white/80 flex items-center gap-2"><X className="w-3 h-3 text-red-400 shrink-0" /> {d?.name || id}</li>;
                  })}
                </ul>
                <div className="flex flex-col gap-3 font-secondary">
                  <button onClick={() => {
                    setSelectedDeliverables(prev => prev.filter(x => x !== dependencyModal.deliverable && !dependencyModal.related.includes(x)));
                    setWarnings(prev => prev.filter(x => x !== dependencyModal.deliverable && !dependencyModal.related.includes(x)));
                    setDependencyModal(null);
                  }} className="bg-red-500/20 border border-red-500/30 text-red-400 py-3 rounded-[8px] font-medium text-[17px] md:text-[19px] hover:bg-red-500/30">Remove this and all dependents</button>
                  <button onClick={() => setDependencyModal(null)} className="text-white/50 py-2 text-[17px] md:text-[19px] hover:text-white">Cancel (Keep in scope)</button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      {step === 0 && (
        <div className="fixed top-28 left-[3%] z-50 flex items-center gap-3 print:hidden">
          <button onClick={() => navigate('home')} className="flex items-center gap-2.5 text-[17px] md:text-[19px] uppercase tracking-[0.25em] font-secondary transition-colors hover:opacity-70 px-4 py-2 rounded-full border text-white/60 hover:text-white border-white/20 bg-white/5 backdrop-blur-md">
            <ArrowLeft className="w-4 h-4" /> Home
          </button>
        </div>
      )}

      {step > 0 && step < (N_QUIZ + 5) && (
        <div className="fixed top-[72px] md:top-[88px] left-0 w-full z-30 print:hidden flex items-center bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4 shadow-lg shadow-black/20">
          <button 
            onClick={() => setStep(step - 1)} 
            className="flex items-center gap-2.5 text-[17px] md:text-[19px] uppercase tracking-[0.25em] font-secondary transition-colors hover:opacity-70 px-4 py-2 rounded-full border text-white/60 hover:text-white border-white/20 bg-white/5 backdrop-blur-md shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          <div className="flex-1 ml-6 md:ml-10 flex flex-col gap-2 relative max-w-4xl">
            <div className="flex justify-between items-end px-1">
              <span className="text-[17px] md:text-[19px] uppercase tracking-[0.2em] font-bold font-secondary text-white/90 drop-shadow-md">
                {step <= N_QUIZ ? 'Phase 1 // Diagnosis' : step <= N_QUIZ + 1 ? 'Phase 2 // Scope Architecture' : step <= N_QUIZ + 3 ? 'Phase 3 // Details & Context' : 'Final Verification'}
              </span>
              <span className="text-[17px] md:text-[19px] font-bold text-white/50 font-secondary tracking-wider">
                {Math.round((step / (N_QUIZ + 4)) * 100)}%
              </span>
            </div>
            
            <div className="relative w-full h-[6px] bg-[#0A103D] rounded-full overflow-visible border border-white/5 shadow-inner">
               {/* Background Track Markers */}
               <div className="absolute inset-0 flex justify-between items-center px-1 opacity-20">
                 <div className="w-1 h-1 rounded-full bg-white" />
                 <div className="w-1 h-1 rounded-full bg-white" />
                 <div className="w-1 h-1 rounded-full bg-white" />
                 <div className="w-1 h-1 rounded-full bg-white" />
               </div>

               {/* Filled track with sweeping light */}
               <motion.div 
                 className="absolute top-0 left-0 h-full rounded-full overflow-hidden" 
                 style={{ 
                   background: `linear-gradient(90deg, ${hexToRgba(palette.blue, 0.8)}, ${palette.primary})`,
                   boxShadow: `0 0 15px ${hexToRgba(palette.primary, 0.5)}`
                 }} 
                 initial={{ width: 0 }} 
                 animate={{ width: `${(step / (N_QUIZ + 5)) * 100}%` }} 
                 transition={{ duration: 0.8, type: "spring", bounce: 0.2 }} 
               >
                 <motion.div
                   className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"
                   animate={{ left: ['-100%', '200%'] }}
                   transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                 />
               </motion.div>
               
               {/* Leading edge beacon */}
               <motion.div 
                 className="absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full bg-white z-10 flex items-center justify-center cursor-default"
                 style={{ boxShadow: `0 0 20px ${palette.primary}, 0 0 10px white` }}
                 initial={{ left: 0 }}
                 animate={{ left: `calc(${(step / (N_QUIZ + 5)) * 100}% - 7px)` }}
                 transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
               >
                 <div className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ backgroundColor: palette.primary }} />
                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: palette.primary }} />
               </motion.div>
            </div>
          </div>
        </div>
      )}
      <div className={`w-full px-[3%] flex flex-col md:flex-row justify-between relative gap-8 print:flex-col print:gap-12 ${step > 0 && step < (N_QUIZ + 5) ? 'pt-[160px]' : ''}`}>
        <div className="flex-1 flex items-center justify-start pt-12 pb-32 md:pb-12 min-h-[80vh] w-full print:min-h-0 print:pt-0 print:pb-0">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="w-full h-full flex flex-col justify-center">
              {stepsArray[step]}
            </motion.div>
          </AnimatePresence>
        </div>
        {step > 0 && step < (N_QUIZ + 5) && (
          <div className="hidden md:block w-[400px] lg:w-[550px] xl:w-[700px] shrink-0 sticky top-[180px] self-start h-[calc(100vh-200px)] pb-8 z-10 print:block print:w-full print:max-w-full print:static print:h-auto">
            <LiveScopePreview />
          </div>
        )}
      </div>
      {step > 0 && step < (N_QUIZ + 5) && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full">
          <button onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)} className="w-full border-t border-white/10 p-4 flex items-center justify-between text-[17px] md:text-[19px] font-medium backdrop-blur-xl font-secondary" style={{ backgroundColor: palette.panel }}>
            <span className="flex items-center gap-2"><FileText className="w-4 h-4" style={{ color: palette.primary }} /> View Live Scope {selectedDeliverables.length > 0 && `(${selectedDeliverables.length})`}</span>
            {isMobilePreviewOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {isMobilePreviewOpen && (
              <motion.div initial={{ height: 0 }} animate={{ height: '60vh' }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/5 w-full" style={{ backgroundColor: palette.panel }}>
                <div className="p-6 h-full overflow-y-auto pb-20 w-full"><LiveScopePreview /></div>
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
      className="group relative cursor-pointer p-6 rounded-[16px] transition-all duration-500 overflow-hidden h-full flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.45)] hover:-translate-y-1 w-full"
      style={{
        background: `linear-gradient(135deg, ${hexToRgba(palette.secondary, 0.08)} 0%, ${hexToRgba(palette.secondary, 0.02)} 100%)`,
        border: `1px solid ${hexToRgba(palette.secondary, 0.15)}`,
        borderBottom: `2px solid ${color}`,
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)'
      }}
    >
      <motion.div variants={{ initial: { opacity: 0 }, hover: { opacity: 0.95 } }} transition={{ duration: 0.4 }} className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: palette.primary }} />
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0 w-full"
        style={{ background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${hexToRgba(palette.secondary, 0.2)}, transparent 80%)` }}
      />
      <motion.div
        variants={{ initial: { scale: 0.8, opacity: 0, rotate: 0 }, hover: { scale: 1.8, opacity: 0.1, rotate: 90 } }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -right-12 -bottom-12 w-48 h-48 blur-[40px] rounded-[100%] pointer-events-none z-0"
        style={{ backgroundColor: color }}
      />
      <div className="relative z-10 flex flex-col h-full w-full">{children}</div>
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
  const { SITE_SETTINGS, ROUTES_INFO, CASE_STUDIES } = useContext(GlobalContext);
  const finalSettings = SITE_SETTINGS || {};
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
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
    <div className="flex gap-12 text-left w-full">
      <div className="w-1/3 pr-12 border-r border-white/5 flex flex-col items-start">
        <div className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-6 border" style={{ backgroundColor: palette.primary, borderColor: hexToRgba(palette.primary, 0.2), color: palette.bgDeep }}><Layers className="w-6 h-6" /></div>
        <h3 className="text-xl md:text-2xl font-light mb-4 text-white font-primary">Consulting Ecosystems</h3>
        <p className="text-white/50 text-[17px] md:text-[19px] leading-relaxed mb-8 font-secondary">We deliver across three distinct pillars depending on your growth stage and communication gaps.</p>
        <button onClick={() => { navigate('services'); setActiveMenu(null); }} className="text-[17px] md:text-[19px] text-white/70 hover:text-white flex items-center gap-2 group mt-auto font-medium font-secondary">View All Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button>
      </div>
      <div className="w-2/3 grid grid-cols-3 gap-6">
        {Object.values(ROUTES_INFO).map(route => {
          const rColor = palette[route.type] || palette.primary;
          return (
            <MenuHoverCard key={route.id} color={rColor} onClick={() => { navigate(`service-detail/${route.id.toLowerCase()}`); setActiveMenu(null); }}>
              <motion.div variants={{ initial: { y: 0, scale: 1 }, hover: { y: -4, scale: 1.05 } }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className="w-12 h-12 rounded-[12px] border border-white/10 flex items-center justify-center mb-5 shadow-inner" style={{ backgroundColor: rColor, color: palette.bgDeep, border: 'none' }}>{route.icon}</motion.div>
              <h4 className="text-xl md:text-2xl font-medium text-white mb-2 font-primary">{route.title}</h4>
              <p className="text-[17px] md:text-[19px] text-white/40 leading-relaxed font-light font-secondary">{route.desc}</p>
            </MenuHoverCard>
          )
        })}
      </div>
    </div>
  );

  const WorkMegaMenuCarousel = ({ items, onNavigate }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
      <div className="relative w-full h-[340px] flex items-center justify-center perspective-[1000px] overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.02]">
        {items.map((cs, i) => {
          const offset = i - currentIndex;
          const absOffset = Math.abs(offset);
          const isActive = offset === 0;
          
          const img = cs.bannerVideo || cs.fullStory?.heroVideo || cs.fullStory?.heroImg || cs.bannerImage || null;
          const thumbnailMediaProps = getCaseStudyThumbnailMediaProps(cs);
          
          return (
            <motion.div
              key={cs.id}
              className={`absolute top-1/2 left-1/2 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group ${isActive ? 'shadow-black/60 border border-white/10' : 'shadow-black/20'}`}
              initial={false}
              animate={{
                x: `calc(-50% + ${offset * 240}px)`,
                y: '-50%',
                scale: isActive ? 1.05 : 1,
                rotateY: offset * -12,
                zIndex: 30 - absOffset,
                opacity: absOffset > 2 ? 0 : (isActive ? 1 : 0.7)
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ width: '320px', height: '240px', transformOrigin: 'center center' }}
              onClick={(e) => {
                 if (!isActive) {
                   e.stopPropagation();
                   setCurrentIndex(i);
                 } else {
                   onNavigate(cs.id);
                 }
              }}
            >
              {img ? (
                <CaseStudyMedia 
                  src={img} 
                  className={thumbnailMediaProps.className} 
                  style={thumbnailMediaProps.style}
                  alt={cs.client} 
                />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: '#010d54' }} />
              )}
              
              {/* Default state — hidden on hover */}
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:opacity-0 transition-opacity duration-300 flex flex-col justify-end">
                 <span className="text-[13px] md:text-[15px] tracking-widest uppercase mb-1 block font-medium font-primary text-white/70">{cs.sector || cs.route}</span>
                 <h4 className="text-white font-medium text-[17px] md:text-[19px] font-secondary leading-tight">{cs.client}</h4>
              </div>
              
              {/* Hover panel — slides up from bottom */}
              <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                <div className="bg-gradient-to-t from-black/90 to-black/40 backdrop-blur-xl border-t border-white/10 px-4 py-4 text-left">
                  <h3 className="font-primary text-white text-[17px] md:text-[19px] font-semibold leading-snug mb-0.5 drop-shadow-md">{cs.client}</h3>
                  {(cs.preview || cs.challenge) && (
                    <p className="font-secondary text-white/60 text-[13px] md:text-[15px] leading-snug mb-2 line-clamp-1">{cs.preview || cs.challenge}</p>
                  )}
                  {cs.tags && cs.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {cs.tags.slice(0,2).map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full border border-white/25 bg-white/10 text-white/75 text-[11px] font-secondary tracking-wide uppercase backdrop-blur-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="inline-block px-3 py-1 rounded-full bg-[#F5C518]/90 text-black text-[13px] font-semibold font-secondary shadow-[0_4px_20px_rgba(245,197,24,0.3)]">
                    View Case Study
                  </span>
                </div>
              </div>
              
              {isActive && (
                 <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
                   <ArrowUpRight size={14} />
                 </div>
              )}
            </motion.div>
          );
        })}
        
        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-50">
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => Math.max(0, prev - 1)); }}
            className={`w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors ${currentIndex === 0 ? 'text-white/30 cursor-not-allowed' : 'text-white hover:bg-white/20'}`}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => Math.min(items.length - 1, prev + 1)); }}
            className={`w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors ${currentIndex === items.length - 1 ? 'text-white/30 cursor-not-allowed' : 'text-white hover:bg-white/20'}`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const WorkMegaMenu = () => (
    <div className="flex gap-12 text-left w-full">
      <div className="w-1/3 pr-12 border-r border-white/5 flex flex-col items-start">
        <div className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-6 border" style={{ backgroundColor: palette.blue, borderColor: hexToRgba(palette.blue, 0.2), color: palette.bgDeep }}><Briefcase className="w-6 h-6" /></div>
        <h3 className="text-xl md:text-2xl font-light mb-4 text-white font-primary">Selected Work</h3>
        <p className="text-white/50 text-[17px] md:text-[19px] leading-relaxed mb-8 font-secondary">Case studies and full visual archive proving our thinking across strategy, identity, and campaigns.</p>
        <button onClick={() => { navigate('work'); setActiveMenu(null); }} className="text-[17px] md:text-[19px] text-white/70 hover:text-white flex items-center gap-2 group mt-auto font-medium font-secondary">View Full Archive <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button>
      </div>
      <div className="w-2/3">
        <WorkMegaMenuCarousel 
          items={CASE_STUDIES.slice(0, 5)} 
          onNavigate={(id) => { navigate('work/' + id); setActiveMenu(null); }} 
        />
      </div>
    </div>
  );

  const AboutMegaMenu = () => (
    <div className="flex gap-12 text-left w-full">
      <div className="w-1/3 pr-12 border-r border-white/5 flex flex-col items-start">
        <div className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-6 border" style={{ backgroundColor: palette.primary, borderColor: hexToRgba(palette.primary, 0.2), color: palette.bgDeep }}><Dna className="w-6 h-6" /></div>
        <h3 className="text-xl md:text-2xl font-light mb-4 text-white font-primary">Who We Are</h3>
        <p className="text-white/50 text-[17px] md:text-[19px] leading-relaxed mb-8 font-secondary">A Brand Communication Studio which co-creates brands backed by cutting-edge innovation; with a SciArt-Driven Approach.</p>
      </div>
      <div className="w-2/3 grid grid-cols-2 gap-6 w-full">
        <MenuHoverCard color={palette.primary} onClick={() => { navigate('about'); setActiveMenu(null); }}>
          <h4 className="text-xl md:text-2xl font-medium text-white mb-2 font-primary">About PBH</h4>
          <p className="text-[17px] md:text-[19px] text-white/40 font-secondary">Our Vision, Mission, and Core Values.</p>
        </MenuHoverCard>
        <MenuHoverCard color={palette.blue} onClick={() => { navigate('method'); setActiveMenu(null); }}>
          <h4 className="text-xl md:text-2xl font-medium text-white mb-2 font-primary">The PBH Method</h4>
          <p className="text-[17px] md:text-[19px] text-white/40 font-secondary">Our step-by-step strategic process.</p>
        </MenuHoverCard>
        <MenuHoverCard color={palette.accent} onClick={() => { navigate('story'); setActiveMenu(null); }}>
          <h4 className="text-xl md:text-2xl font-medium text-white mb-2 font-primary">Our Story</h4>
          <p className="text-[17px] md:text-[19px] text-white/40 font-secondary">How art and science collided.</p>
        </MenuHoverCard>
        <MenuHoverCard color={palette.purple} onClick={() => { navigate('team'); setActiveMenu(null); }}>
          <h4 className="text-xl md:text-2xl font-medium text-white mb-2 font-primary">The Team</h4>
          <p className="text-[17px] md:text-[19px] text-white/40 font-secondary">The innovators behind the curtain.</p>
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
      className={`fixed top-0 left-0 right-0 z-[10000] isolate w-full transition-all duration-300 border-b ${scrolled || activeMenu
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
        <div className={`font-primary font-medium tracking-wide cursor-pointer flex items-center gap-3 hover:opacity-80 transition-all duration-300 text-white ${scrolled || activeMenu ? 'text-xl md:text-2xl' : 'text-xl'}`} onClick={() => navigate('home')}>
          <img src="https://static.wixstatic.com/media/32f09f_d2e483f6417246ba946ed54bbb518bb8~mv2.png" alt="PurpleBlue House" className={`w-auto object-contain shrink-0 transition-all duration-300 ${scrolled || activeMenu ? 'h-6' : 'h-8'}`} />
          PurpleBlue House
        </div>

        <nav className="hidden lg:flex items-center gap-2 text-[17px] md:text-[19px] font-medium tracking-wide bg-white/[0.04] border border-white/10 rounded-full px-5 py-3 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_50px_rgba(0,0,0,0.35)] font-secondary">
          <NavLink onClick={() => { navigate('work'); setActiveMenu(null); }} onMouseEnter={() => handleMouseEnter('work')} active={current.startsWith('work') || activeMenu === 'work'}>{finalSettings.navigation?.navWork || 'Work'}</NavLink>
          <NavLink onClick={() => { navigate('services'); setActiveMenu(null); }} onMouseEnter={() => handleMouseEnter('services')} active={current.startsWith('services') || activeMenu === 'services'}>{finalSettings.navigation?.navServices || 'Services'}</NavLink>
          <NavLink onClick={() => { navigate('about'); setActiveMenu(null); }} onMouseEnter={() => handleMouseEnter('about')} active={['about', 'method', 'story', 'team'].includes(current) || activeMenu === 'about'}>{finalSettings.navigation?.navAbout || 'About Us'}</NavLink>
          <NavLink onClick={() => { navigate('journal'); setActiveMenu(null); }} onMouseEnter={() => setActiveMenu(null)} active={current.startsWith('journal') || current.startsWith('article')}>{finalSettings.navigation?.navJournal || 'Journal'}</NavLink>
          <NavLink onClick={() => { navigate('contact'); setActiveMenu(null); }} onMouseEnter={() => setActiveMenu(null)} active={current === 'contact'}>{finalSettings.navigation?.navContact || 'Contact Us'}</NavLink>
        </nav>

        <div className="hidden lg:flex items-center">
          <PremiumButton onClick={() => { navigate('assessment'); setActiveMenu(null); }} className="px-6 py-2.5 rounded-[9px] text-[17px] md:text-[19px] font-secondary shadow-lg">{finalSettings.navigation?.navCtaDesktop || 'Build My Brand Scope'}</PremiumButton>
        </div>

        <div className="lg:hidden flex items-center">
          <button onClick={() => navigate('assessment')} className="text-[17px] md:text-[19px] font-medium text-white px-4 py-2 rounded-[6px] uppercase tracking-widest shadow-md font-secondary" style={{ backgroundColor: '#6865fa' }}>{finalSettings.navigation?.navCtaMobile || 'Build Scope'}</button>
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
            className="fixed inset-0 z-[10000] pointer-events-auto w-full"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            {/* Strong glass backdrop */}
            <div
              className="absolute inset-0 w-full"
              style={{
                backgroundColor: `${palette.bgDeep}B8`,
                backdropFilter: 'blur(26px) saturate(160%)',
                WebkitBackdropFilter: 'blur(26px) saturate(160%)'
              }}
            />

            {/* Soft premium gradient wash */}
            <div
              className="absolute inset-0 pointer-events-none opacity-100 w-full"
              style={{
                background: `
                  radial-gradient(circle at 20% 10%, ${hexToRgba(palette.primary, 0.15)}, transparent 40%),
                  radial-gradient(circle at 80% 20%, ${hexToRgba(palette.secondary, 0.12)}, transparent 40%),
                  linear-gradient(180deg, ${hexToRgba(palette.bgDeep, 0.55)}, ${hexToRgba(palette.bg, 0.75)})
                `
              }}
            />

            {/* Invisible hover bridge between nav and mega menu */}
            <div className="absolute top-[64px] left-0 right-0 h-[48px] w-full" />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.985 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-[92px] left-[3%] right-[3%] origin-top w-[94%]"
            >
              <div
                className="relative overflow-hidden rounded-[28px] border p-10 shadow-[0_80px_180px_rgba(0,0,0,0.95)] w-full"
                style={{
                  backgroundColor: `${palette.panel}FC`,
                  borderColor: 'rgba(255,255,255,0.16)',
                  backdropFilter: 'blur(28px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(180%)'
                }}
              >
                {/* Solid base so content behind never bleeds through */}
                <div
                  className="absolute inset-0 pointer-events-none w-full"
                  style={{
                    background: `
                      linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)),
                      ${palette.panel}
                    `
                  }}
                />

                {/* Glass highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-80 pointer-events-none w-full" />

                {/* Inner glow */}
                <div
                  className="absolute -top-40 right-10 w-[420px] h-[420px] rounded-full blur-[120px] opacity-25 pointer-events-none"
                  style={{ backgroundColor: palette.primary }}
                />

                <div className="relative z-10 w-full">
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

const SelectedCollaboratorsSection = () => {
  const logos = [
    { name: "Hero Lectro",               src: "/clients/logos/hero_lectro/hero_lectro_transparent.png" },
    { name: "Firefox",                   src: "/clients/logos/firefox/1_firefox.png" },
    { name: "IIT Delhi",                 src: "/clients/logos/iit/iitd_raw_images_01.png", centerCrop: true },
    { name: "Arise Ventures",            src: "/clients/logos/arise_ventures/Asset 3@4x.png" },
    { name: "Navankur",                  src: "/clients/logos/navankur/5_navankur.png" },
    { name: "Earthy Souls",              src: "/clients/logos/earthy_souls/6_earthy.png" },
    { name: "EBT",                       src: "/clients/logos/ebt/7_ebt.png" },
    { name: "Snow Leopard Trust",        src: "/clients/logos/snow_leopard_trust/SLT-Logo-2016-300ppi-Transparent-BlackText-01.png", invert: true },
    { name: "Back To Roots",             src: "/clients/logos/back_to_roots/back_to_roots_logo.png" },
    { name: "Observer Research Found.",  src: "/clients/logos/orf/ORF_Logo_CMYK-2.png" },
    { name: "Param Innovation",          src: "/clients/logos/param/9_param.png" },
    { name: "Veauli",                    src: "/clients/logos/veauli_techniks/10_veauli.png" },
    { name: "IGF",                       src: "/clients/logos/igf/3_igf.png" },
  ];

  const renderLogo = (logo, idx) => (
    <div key={`${logo.name}-${idx}`} className="flex items-center justify-center shrink-0 mx-4 md:mx-5 group cursor-pointer">
      <div className={`flex items-center justify-center px-8 md:px-10 py-5 md:py-6 rounded-2xl border ${logo.noContainer ? 'border-transparent bg-transparent' : 'border-white/[0.07] bg-white/[0.03]'} transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${logo.noContainer ? '' : 'group-hover:border-white/[0.18] group-hover:bg-white/[0.07]'}`}>
        {logo.centerCrop ? (
          <img
            src={logo.src}
            alt={logo.name}
            loading="lazy"
            decoding="async"
            style={{ objectFit: 'cover', objectPosition: 'center center', ...(logo.invert ? { filter: 'brightness(0) invert(1)' } : {}) }}
            className={`h-28 md:h-40 w-[260px] md:w-[360px] transition-all duration-500 opacity-80 group-hover:opacity-100 ${logo.mixBlendScreen ? 'mix-blend-screen' : ''} ${logo.mixBlendMultiply ? 'mix-blend-multiply' : ''}`}
          />
        ) : (
          <img
            src={logo.src}
            alt={logo.name}
            loading="lazy"
            decoding="async"
            style={logo.invert ? { filter: 'brightness(0) invert(1)' } : {}}
            className={`h-28 md:h-40 max-w-[260px] md:max-w-[360px] w-auto object-contain transition-all duration-500 opacity-80 group-hover:opacity-100 ${logo.mixBlendScreen ? 'mix-blend-screen' : ''} ${logo.mixBlendMultiply ? 'mix-blend-multiply' : ''}`}
          />
        )}
      </div>
    </div>
  );

  return (
    <section className="py-28 md:py-40 w-full relative overflow-hidden" style={{ background: palette.bgDeep }}>
      {/* Top rule */}
      <div className="w-full h-px mb-20 md:mb-28" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)' }} />

      <div className="w-full max-w-[90rem] mx-auto px-[5%] mb-16 md:mb-24 flex items-center gap-6">
        <h3 className="text-[17px] md:text-[19px] uppercase tracking-[0.35em] font-primary text-white/25 font-medium shrink-0">
          Selected Collaborations
        </h3>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.08), transparent)' }} />
      </div>

      <div className="relative w-full overflow-hidden z-10">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-56 z-20 pointer-events-none"  />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-56 z-20 pointer-events-none"  />

        <div className="flex w-max items-center animate-collab-marquee hover:[animation-play-state:paused]" style={{ willChange: 'transform' }}>
          {[...logos, ...logos].map(renderLogo)}
        </div>
      </div>

      {/* Bottom rule */}
      <div className="w-full h-px mt-20 md:mt-28" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)' }} />

      <style>{`
        @keyframes collab-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-collab-marquee {
          animation: collab-marquee 18s linear infinite;
        }
        .logo-item img, .logo-item div {
          filter: drop-shadow(0 0 0px transparent);
          transition: filter 0.5s ease;
        }
        .logo-item:hover img, .logo-item:hover div {
          filter: drop-shadow(0 0 18px rgba(255,255,255,0.15));
        }
      `}</style>
    </section>
  );
};

const HomePage = ({ navigate }) => {
  const { SITE_SETTINGS, ROUTES_INFO, PROBLEM_DATA, CASE_STUDIES, JOURNAL_ARTICLES } = useContext(GlobalContext);
  const finalSettings = SITE_SETTINGS || {};
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
          <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#100e46' }}></div>
          <motion.div style={{ x: gridX, y: gridY }} animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-[0.15] flex items-center justify-center origin-center">
            <svg className="w-full max-w-[1000px] h-auto" viewBox="0 0 1000 1000" fill="none">
              <circle cx="500" cy="500" r="300" stroke="url(#paint0_linear)" strokeWidth="0.5" strokeDasharray="4 8" /><circle cx="500" cy="500" r="450" stroke="url(#paint1_linear)" strokeWidth="0.5" /><circle cx="500" cy="500" r="200" stroke="url(#paint0_linear)" strokeWidth="1" strokeDasharray="1 16" />
              <defs><linearGradient id="paint0_linear" x1="200" y1="200" x2="800" y2="800" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity="0.5" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient><linearGradient id="paint1_linear" x1="500" y1="50" x2="500" y2="950" gradientUnits="userSpaceOnUse"><stop stopColor={palette.primary} stopOpacity="0.4" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient></defs>
            </svg>
          </motion.div>
          <InteractiveFlowingLines />
        </motion.div>

        {/* Brand geometric accents */}
        <div className="geo-circle hidden md:block" style={{ top: '16%', right: '6%' }} />
        <div className="geo-diamond hidden md:block" style={{ bottom: '26%', right: '20%' }} />

        <div className="flex-1 flex flex-col justify-center w-full relative z-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.05 }}
            className="mb-7 inline-flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#ffcd00', boxShadow: '0 0 10px #ffcd00' }} />
            <span className="t-label text-white/70">{SITE_SETTINGS?.homePage?.heroEyebrow || "Strategy · Story · Systems"}</span>
          </motion.div>
          <RevealText delay={0.1}>
            <h1 className="text-[clamp(3.2rem,8vw,7rem)] font-light tracking-[-0.06em] leading-[0.95] text-white drop-shadow-lg pb-2 font-primary whitespace-pre-wrap">
              {renderWithItalics(SITE_SETTINGS?.homeHeroTitle || "Breakthroughs happen when strategy and execution *move as one.*", "text-white/60 mx-2 whitespace-nowrap")}
            </h1>
          </RevealText>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="mt-8 t-body text-white/60 max-w-3xl">{SITE_SETTINGS?.homeHeroSubtitle || "PurpleBlue House partners with visionary teams to build clear, scalable brand systems that turn complex innovations into market breakthroughs."}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7 }} className="mt-12 flex flex-col sm:flex-row gap-6">
            <PremiumButton onClick={() => navigate('assessment')} className="min-w-[240px]" style={{ boxShadow: `0 0 40px rgba(255, 205, 0, 0.28)` }}>{SITE_SETTINGS.assessmentButton || 'Build My Brand Scope'} <Sparkles className="w-4 h-4 ml-2" style={{ color: '#ffcd00' }} /></PremiumButton>
            <PremiumButton variant="secondary" onClick={() => navigate('work')} className="min-w-[240px]">{SITE_SETTINGS.homeExploreButton || 'Explore Our Work'}</PremiumButton>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-[3%] relative w-full text-left overflow-hidden" style={{ background: `linear-gradient(to bottom, #100e46, ${SURFACE.purpleDeep})` }}>
        {/* Ambient Mesh Glow (Primary Purple) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div animate={{ x: ['-5%', '5%', '-5%'], y: ['-5%', '5%', '-5%'] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vh] rounded-full blur-[140px] opacity-40 mix-blend-screen" style={{ backgroundColor: palette.primary }} />
        </div>
        <div className="relative z-10 w-full">
        <div className="geo-diamond hidden md:block" style={{ top: '12%', right: '8%' }} />
        <RevealText><h2 className="t-display mb-16">{SITE_SETTINGS?.homePage?.problemTitle || "Scaling a breakthrough"} <br /><AnimatedItalic className="text-white/50">{SITE_SETTINGS?.homePage?.problemTitleItalic || "requires deep alignment."}</AnimatedItalic></h2></RevealText>
        <FadeUp><p className="t-body text-white/50 max-w-3xl mb-16">{SITE_SETTINGS?.homePage?.problemBody || "Low engagement, inconsistent visuals, and scattered teams aren't just creative issues—they are strategic bottlenecks. We align your brand thinking with execution to drive sustainable, long-term growth."}</p></FadeUp>
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
          {PROBLEM_DATA.map((prob, i) => (
            <StaggerItem key={i}><ProblemHoverCard title={prob.title} icon={prob.icon} type={prob.type} /></StaggerItem>
          ))}
        </StaggerGroup>
        </div>
      </section>

      <section className="py-32 px-[3%] w-full text-left" style={{ background: `linear-gradient(to bottom, ${SURFACE.purpleDeep}, ${palette.bgDeep})` }}>
        <div className="max-w-4xl mb-24">
          <RevealText><h2 className="t-display mb-6">{SITE_SETTINGS?.homePage?.modelTitle || "Breakthrough innovation"} <br /><AnimatedItalic className="text-white/50">{SITE_SETTINGS?.homePage?.modelTitleItalic || "demands a new model."}</AnimatedItalic></h2></RevealText>
          <FadeUp><p className="t-body text-white/50">{SITE_SETTINGS?.homeSection3Subtitle || "Traditional execution models struggle to translate complex ideas into scalable systems. We build a strategic foundation first, ensuring every asset accelerates your 5-year vision and market impact."}</p></FadeUp>
        </div>
        <StaggerGroup className="grid md:grid-cols-2 gap-8 w-full">
          <StaggerItem>
            <div className="border border-white/10 rounded-[24px] p-10 md:p-14 h-full w-full backdrop-blur-3xl" style={{ background: `linear-gradient(135deg, ${hexToRgba(palette.panel, 0.5)} 0%, ${hexToRgba(palette.bgDeep, 0.5)} 100%)`, boxShadow: `inset 0 1px 0 ${hexToRgba(palette.secondary, 0.1)}` }}>
              <h3 className="t-label text-white/40 mb-10">{SITE_SETTINGS?.homePage?.oldWayLabel || "The Old Way"}</h3>
              <ul className="space-y-8">
                <li className="flex gap-5 t-body text-white/50"><X className="w-6 h-6 shrink-0 text-red-500/50 mt-1" /> <span>{SITE_SETTINGS?.methodPage?.traditionalModel?.[0] || "Execution disconnected from core business objectives."}</span></li>
                <li className="flex gap-5 t-body text-white/50"><X className="w-6 h-6 shrink-0 text-red-500/50 mt-1" /> <span>{SITE_SETTINGS?.methodPage?.traditionalModel?.[1] || "Short-term aesthetic fixes over long-term strategic systems."}</span></li>
                <li className="flex gap-5 t-body text-white/50"><X className="w-6 h-6 shrink-0 text-red-500/50 mt-1" /> <span>{SITE_SETTINGS?.methodPage?.traditionalModel?.[2] || "Disjointed touchpoints that dilute the brand's potential."}</span></li>
              </ul>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="border rounded-[24px] p-10 md:p-14 relative overflow-hidden h-full w-full backdrop-blur-3xl" style={{ background: `linear-gradient(to bottom right, rgba(${rgbPrimary},0.2), rgba(${rgbPrimary},0.05))`, borderColor: `rgba(${rgbPrimary},0.4)`, boxShadow: `0 30px 60px ${hexToRgba(palette.primary, 0.1)}, inset 0 1px 0 ${hexToRgba(palette.secondary, 0.3)}` }}>
              <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 opacity-[0.35] blur-[100px] pointer-events-none" style={{ backgroundColor: palette.primary }} />
              <div className="absolute top-[-10%] left-[-10%] w-64 h-64 opacity-[0.25] blur-[80px] pointer-events-none" style={{ backgroundColor: palette.secondary }} />
              <h3 className="t-label mb-10 relative z-10" style={{ color: palette.primary }}>{SITE_SETTINGS?.homePage?.pbhWayLabel || "The PBH Way"}</h3>
              <ul className="space-y-8 relative z-10">
                <li className="flex gap-5 t-body text-white/90"><Check className="w-6 h-6 shrink-0 mt-1" style={{ color: palette.primary }} /> <span>{SITE_SETTINGS?.methodPage?.pbhMethod?.[0] || "Mapping the root business gap before designing anything."}</span></li>
                <li className="flex gap-5 t-body text-white/90"><Check className="w-6 h-6 shrink-0 mt-1" style={{ color: palette.primary }} /> <span>{SITE_SETTINGS?.methodPage?.pbhMethod?.[1] || "Modular scoping based on exact strategic requirements."}</span></li>
                <li className="flex gap-5 t-body text-white/90"><Check className="w-6 h-6 shrink-0 mt-1" style={{ color: palette.primary }} /> <span>{SITE_SETTINGS?.methodPage?.pbhMethod?.[2] || "Building connected systems where strategy dictates execution."}</span></li>
              </ul>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </section>

      {/* SciArt Philosophy */}
      <section className="py-32 px-[3%] relative w-full text-left" style={{ background: `linear-gradient(to bottom, ${palette.bgDeep}, ${SURFACE.purpleDeep})` }}>
        <div className="grid md:grid-cols-2 gap-16 items-center w-full">
          <FadeUp>
            <h3 className="t-label mb-6" style={{ color: palette.primary }}>{SITE_SETTINGS?.aboutPage?.philosophyLabel || "Our Philosophy"}</h3>
            <h2 className="t-display mb-6" style={{ color: 'white' }}>{SITE_SETTINGS?.aboutPage?.philosophyTitle || "Engineering breakthroughs with the SciArt framework."}</h2>
            <p className="t-body" style={{ color: 'rgba(255,255,255,0.7)' }}>{SITE_SETTINGS?.aboutPage?.philosophyText || "We bridge the divide between rigorous strategic logic and intense imagination. Science gives us the framework, the data, and the scalable systems. Art gives us the empathy, the visual impact, and the connection. Together, they create brands engineered for the future."}</p>
          </FadeUp>
          <FadeUp delay={0.2} className="relative h-[300px] md:h-[400px] flex items-center justify-center rounded-[32px] border border-black/5 overflow-hidden shadow-2xl w-full" style={{ backgroundColor: palette.secondary }}>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" style={{ mixBlendMode: 'multiply' }} />
            <div className="absolute inset-0" style={{  }} />
            <div className="flex gap-6 items-center z-10">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-2xl" style={{ backgroundColor: palette.bgDeep, border: `1px solid rgba(255,255,255,0.1)`, boxShadow: `0 0 40px rgba(42,151,217,0.4)` }}>
                <span className="t-subtitle tracking-widest text-white/90">SCI</span>
              </div>
              <Plus className="w-6 h-6 md:w-8 md:h-8 opacity-40" style={{ color: palette.bgDeep }} />
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-2xl" style={{ backgroundColor: palette.bgDeep, border: `1px solid rgba(255,255,255,0.1)`, boxShadow: `0 0 40px rgba(104,101,250,0.4)` }}>
                <span className="t-subtitle tracking-widest text-white/90">ART</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-32 px-[3%] relative w-full text-left overflow-hidden" style={{ background: `linear-gradient(to bottom, ${SURFACE.purpleDeep}, #100e46)` }}>
        {/* Ambient Mesh Glow (Light Purple) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div animate={{ x: ['5%', '-5%', '5%'], y: ['5%', '-5%', '5%'] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] rounded-full blur-[140px] opacity-30 mix-blend-screen" style={{ backgroundColor: palette.secondary }} />
        </div>
        <div className="relative z-10 w-full">
          <RevealText><h2 className="t-display mb-20">{SITE_SETTINGS?.servicesHeader || "We connect strategy, story, and execution."}</h2></RevealText>
        <StaggerGroup className="grid md:grid-cols-3 gap-6 w-full">
          {Object.values(ROUTES_INFO).map((route, i) => {
            const rColor = palette[route.type] || palette.primary;
            return (
              <StaggerItem key={route.id}>
                <SpotlightCard className="rounded-[24px] h-full w-full backdrop-blur-2xl">
                  <div className="border rounded-[24px] p-10 h-full flex flex-col hover:border-black/10 transition-all duration-500 w-full" style={{ backgroundColor: palette.secondary, borderColor: hexToRgba(palette.primary, 0.15) }}>
                    <div className="w-14 h-14 rounded-[12px] flex items-center justify-center mb-8 shadow-lg" style={{ backgroundColor: rColor, color: 'white' }}>{route.icon}</div>
                    <h4 className="t-subtitle mb-4" style={{ color: palette.bgDeep }}>{route.title}</h4>
                    <p className="t-body mb-10 flex-grow" style={{ color: hexToRgba(palette.bgDeep, 0.7) }}>{route.desc}</p>
                    <PremiumButton variant="ghost" onClick={() => navigate(`service-modal/${route.id.toLowerCase()}`)} className="self-start px-0 group hover:bg-transparent" style={{ color: palette.bgDeep }}>{SITE_SETTINGS?.homePage?.exploreRouteLabel || "Explore Route"} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></PremiumButton>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
        </div>
      </section>

      <section className="py-32 px-[3%] relative w-full text-left overflow-hidden" style={{ background: `linear-gradient(to bottom, #100e46, ${palette.bgDeep})` }}>
        {/* Ambient Mesh Glow (Light Purple) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-[30%] w-[40vw] h-[40vh] rounded-full blur-[140px] opacity-20 mix-blend-screen" style={{ backgroundColor: palette.secondary }} />
        </div>
        <div className="relative z-10 w-full">
          <RevealText><h2 className="t-display mb-20">{SITE_SETTINGS?.homePage?.howItWorksTitle || "How It"} <AnimatedItalic>{SITE_SETTINGS?.homePage?.howItWorksTitleItalic || "Works."}</AnimatedItalic></h2></RevealText>
          <InteractiveHowItWorks />
        </div>
      </section>

      <PremiumLogoMarquee navigate={navigate} caseStudies={CASE_STUDIES} clientLogos={finalSettings.clientLogos} />

      {/* Global Mission */}
      <section className="py-32 px-[3%] text-center relative overflow-hidden w-full" style={{ backgroundColor: palette.bgDeep }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.05] blur-[100px] pointer-events-none rounded-full" style={{ backgroundColor: palette.blue }} />
        <FadeUp>
          <Globe className="w-12 h-12 mx-auto mb-8 opacity-40" style={{ color: palette.blue }} />
          <h2 className="t-display mb-8 max-w-4xl mx-auto">{SITE_SETTINGS?.aboutPage?.globalTitle || "Elevating Indian Innovation to the Global Stage."}</h2>
          <p className="t-body text-white/50 max-w-2xl mx-auto">{SITE_SETTINGS?.aboutPage?.globalText || "Championing the rise of breakthrough ideas, fostering a future where creativity and ingenuity fuel human progress on a worldwide scale."}</p>
        </FadeUp>
      </section>

      <section className="py-32 px-[3%] relative w-full" style={{ backgroundColor: palette.bgDeep }}>
        {/* Decorative geometric shapes — reduced & intentional */}
        <div className="absolute top-16 right-[8%] w-[100px] h-[100px] rounded-full border-[3px] opacity-[0.06] pointer-events-none" style={{ borderColor: palette.primary }} />
        <div className="absolute bottom-24 left-[5%] w-[60px] h-[60px] rounded-[14px] border-[3px] opacity-[0.05] pointer-events-none rotate-45" style={{ borderColor: palette.accent }} />

        <div className="flex flex-col sm:flex-row justify-between items-end mb-24 gap-6 w-full text-left">
          <RevealText delay={0.1}><h2 className="t-display">{SITE_SETTINGS?.homePage?.selectedWorkTitle || "Selected"} <AnimatedItalic className="text-white/50">{SITE_SETTINGS?.homePage?.selectedWorkTitleItalic || "Work."}</AnimatedItalic></h2></RevealText>
          <PremiumButton variant="ghost" onClick={() => navigate('work')} className="px-0 py-0 group" style={{ color: palette.primary }}>{SITE_SETTINGS?.homePage?.selectedWorkCta || "View Archive"} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></PremiumButton>
        </div>
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {CASE_STUDIES.slice(0, 4).map((cs, i) => {
            const hexColor = palette[cs.type] || palette.primary;
            const visibleTags = getVisibleCaseStudyTags(cs);
            const thumbnailMediaProps = getCaseStudyThumbnailMediaProps(cs);
            return (
              <StaggerItem key={i}>
                <div data-pbh-copy-ignore onClick={() => navigate('work/' + cs.id)} className="group relative border border-white/10 rounded-[24px] overflow-hidden cursor-pointer w-full aspect-[4/3] bg-[#0a0a0a] shadow-2xl transition-all duration-700 hover:border-white/30 hover:translate-y-[-4px]">

                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    {(cs.bannerVideo || cs.fullStory?.heroVideo || cs.bannerImage || cs.fullStory?.heroImg || cs.imageUrl) ? (
                      <CaseStudyMedia
                        src={cs.bannerVideo || cs.fullStory?.heroVideo || cs.bannerImage || cs.fullStory?.heroImg || cs.imageUrl}
                        alt={cs.client}
                        className={thumbnailMediaProps.className}
                        style={thumbnailMediaProps.style}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-primary italic text-white/10 text-5xl">{cs.client ? cs.client.split(' ')[0] : 'Work'}</span>
                      </div>
                    )}
                  </div>

                  {/* Hover panel — slides up from bottom */}
                  <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                    <div className="bg-gradient-to-t from-black/80 to-black/40 backdrop-blur-xl border-t border-white/10 px-7 py-6 text-left">
                      <h3 className="font-primary text-white text-lg md:text-xl font-semibold leading-snug mb-1 drop-shadow-md">{cs.client}</h3>
                      {(cs.preview || cs.challenge) && (
                        <p className="font-secondary text-white/60 text-sm md:text-[15px] leading-snug mb-3 line-clamp-2">{cs.preview || cs.challenge}</p>
                      )}
                      {visibleTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {visibleTags.map(t => (
                            <span key={t} className="px-3 py-1 rounded-full border border-white/25 bg-white/10 text-white/75 text-[11px] md:text-xs font-secondary tracking-wide uppercase backdrop-blur-sm">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="inline-block px-5 py-2 rounded-full bg-[#F5C518]/90 text-black text-sm font-semibold font-secondary shadow-[0_4px_20px_rgba(245,197,24,0.3)]">
                        View Case Study
                      </span>
                    </div>
                  </div>

                </div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </section>

      {/* Latest Thinking (Journal) */}
      <section className="py-32 px-[3%] relative w-full text-left" style={{ background: `linear-gradient(to bottom, ${palette.bgDeep}, ${palette.panel})` }}>
        {/* Decorative geometric accent — intentional, reduced */}
        <div className="absolute top-12 left-[6%] w-[70px] h-[70px] rounded-full border-[3px] opacity-[0.05] pointer-events-none" style={{ borderColor: palette.accent }} />

        <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6 w-full text-left">
          <RevealText delay={0.1}><h2 className="t-display">{SITE_SETTINGS?.homePage?.journalTitle || "From the"} <AnimatedItalic className="text-white/50">{SITE_SETTINGS?.homePage?.journalTitleItalic || "House."}</AnimatedItalic></h2></RevealText>
          <span onClick={() => navigate('journal')} className="t-label text-white/40 hover:text-white cursor-pointer transition-colors flex items-center gap-2 group">{SITE_SETTINGS?.homePage?.journalCta || "View Journal"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
        </div>
        <StaggerGroup className="grid md:grid-cols-3 gap-6 w-full">
          {JOURNAL_ARTICLES.slice(0, 3).map((article, i) => {
            const articleColor = palette[article.type] || palette.primary;
            return (
            <StaggerItem key={i}>
              <div onClick={() => navigate('article/' + article.id)} className="relative rounded-[24px] p-8 h-full flex flex-col hover:-translate-y-2 transition-all duration-300 cursor-pointer group w-full" style={{ backgroundColor: palette.bgDeep, border: `2px solid rgba(104, 101, 250, 0.15)`, boxShadow: `5px 5px 0px 0px rgba(104, 101, 250, 0.08)` }}>
                {/* Hatching texture overlay */}
                <div className="absolute inset-0 rounded-[24px] pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 10px)', mixBlendMode: 'overlay' }} />
                <div className="relative z-10 flex flex-col h-full">
                  <span className="t-label mb-6 px-3 py-1 rounded-full w-fit" style={{ color: articleColor, border: `2px solid ${articleColor}30`, backgroundColor: `${articleColor}10` }}>{article.tag}</span>
                  <h4 className="t-subtitle text-white mb-12 group-hover:text-white/80 transition-colors">{article.title}</h4>
                  <div className="mt-auto flex justify-between items-center t-label text-white/40 pt-6 w-full" style={{ borderTop: `2px solid rgba(104, 101, 250, 0.1)` }}>
                    <span>{article.time}</span>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-all" style={{ border: `2px solid rgba(255,255,255,0.15)` }}>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
            )
          })}
        </StaggerGroup>
      </section>

      <section className="py-32 px-[3%] w-full text-center flex items-center justify-center overflow-hidden relative" style={{ background: `linear-gradient(to bottom, ${palette.panel}, ${palette.primary})` }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 w-full overflow-hidden flex whitespace-nowrap">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 20 }} className="flex gap-16 opacity-90" style={{ color: palette.bgDeep }}>
            <span className="t-display uppercase">{SITE_SETTINGS?.marqueeText || "3 Ecosystems. 1 Connected System. Infinite Breakthroughs."}</span>
            <span className="t-display uppercase">{SITE_SETTINGS?.marqueeText || "3 Ecosystems. 1 Connected System. Infinite Breakthroughs."}</span>
          </motion.div>
        </div>
      </section>

      <section className="py-32 md:py-48 px-[3%] relative w-full flex flex-col items-center justify-center text-center overflow-hidden" style={{ background: `linear-gradient(to bottom, ${palette.primary}, ${SURFACE.purple})` }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-[100%] blur-[200px] opacity-[0.22] pointer-events-none" style={{ backgroundColor: SURFACE.lavender }} />
        <div className="absolute top-[-10%] left-[-5%] w-[420px] h-[420px] rounded-full blur-[160px] opacity-[0.18] pointer-events-none" style={{ backgroundColor: '#ffffff' }} />
        <FadeUp className="relative z-10 w-full flex flex-col items-center">
          <h2 className="t-label mb-6" style={{ color: '#ffcd00' }}>{SITE_SETTINGS?.homePage?.finalCtaEyebrow || "Start with clarity."}</h2>
          <h1 className="t-display mb-12">{SITE_SETTINGS?.homePage?.finalCtaTitle || "Build your brand scope"} <br /><AnimatedItalic className="text-white/60">{SITE_SETTINGS?.homePage?.finalCtaTitleItalic || "before the first call."}</AnimatedItalic></h1>
          <PremiumButton onClick={() => navigate('assessment')} className="px-12 py-6 t-subtitle w-full sm:w-auto">{SITE_SETTINGS?.homePage?.finalCtaButton || "Begin Brand Discovery"}</PremiumButton>
        </FadeUp>
      </section>
    </motion.div>
  );
};

const BrandBoulevardMarquee = ({ images, client, bgHex }) => {
  if (!images || images.length === 0) return null;

  // Duplicate the array enough times to ensure it fills ultra-wide screens seamlessly
  let displayImages = [...images];
  while (displayImages.length < 12) {
    displayImages = [...displayImages, ...images];
  }

  // Animation variants for smooth pausing on hover
  const marqueeVariants = {
    animate: {
      x: ["0%", "-50%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: displayImages.length * 5, // Speed scales with content
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="w-full overflow-hidden relative py-16 flex flex-col bg-[#010626]">
      {/* Edge Fades for seamless looping */}
      <div className="absolute inset-y-0 left-0 w-[5%] md:w-[15%] z-10 pointer-events-none"  />
      <div className="absolute inset-y-0 right-0 w-[5%] md:w-[15%] z-10 pointer-events-none"  />
      
      {/* Single Marquee Row */}
      <motion.div
        className="flex w-max group/row"
        variants={marqueeVariants}
        animate="animate"
        whileHover={{ animationPlayState: "paused" }}
        style={{ animationPlayState: "running" }}
      >
        <div className="flex gap-6 px-3">
          {displayImages.map((img, idx) => (
             <div key={`set1-${idx}`} className="h-[45vh] md:h-[55vh] lg:h-[60vh] shrink-0 rounded-[16px] overflow-hidden border border-white/5 relative group/card bg-white/5 transition-all duration-700 hover:scale-[1.02] hover:-translate-y-1">
               <div className="h-full w-auto group-hover/row:opacity-50 group-hover/card:opacity-100 transition-opacity duration-500">
                 <img src={img} alt={`${client} showcase`} loading="lazy" decoding="async" className="h-full w-auto object-cover md:object-contain rounded-[16px]" />
               </div>
             </div>
          ))}
        </div>
        <div className="flex gap-6 px-3">
          {displayImages.map((img, idx) => (
             <div key={`set2-${idx}`} className="h-[45vh] md:h-[55vh] lg:h-[60vh] shrink-0 rounded-[16px] overflow-hidden border border-white/5 relative group/card bg-white/5 transition-all duration-700 hover:scale-[1.02] hover:-translate-y-1">
               <div className="h-full w-auto group-hover/row:opacity-50 group-hover/card:opacity-100 transition-opacity duration-500">
                 <img src={img} alt={`${client} showcase`} loading="lazy" decoding="async" className="h-full w-auto object-cover md:object-contain rounded-[16px]" />
               </div>
             </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const WorkDetailPage = ({ navigate, projectId }) => {
  const { CASE_STUDIES, FAQS } = useContext(GlobalContext);



  const caseStudies = CASE_STUDIES;
  let projectIndex = caseStudies.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1 && projectId) {
    const searchStr = projectId.replace(/-/g, ' ').toLowerCase();
    projectIndex = caseStudies.findIndex(p => (p.client || '').toLowerCase().includes(searchStr));
  }
  
  const safeProjectIndex = projectIndex !== -1 ? projectIndex : 0;
  const project = caseStudies[safeProjectIndex];
  const nextProject = caseStudies[(safeProjectIndex + 1) % caseStudies.length];
  const prevProject = caseStudies[(safeProjectIndex - 1 + caseStudies.length) % caseStudies.length];
  const hexColor = palette[project.type] || palette.primary;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [projectId]);

  const clientName = (project.client || project.title || projectId || '').toLowerCase();
  const projectString = JSON.stringify(project).toLowerCase();

  // Pick the experience template for this client, then append the shared,
  // CMS-driven Team Credits section so it appears under EVERY case study.
  const experience = (() => {
    const ariseClients = [
      'ega wellness',
      'arise ventures',
      'bellavita',
      'chien de luxe',
      'earthy souls',
      'hero lectro',
      'leverage edu',
      'param innovation',
      'piston des sports',
      'sayre therapeutics',
      'veauli',
      'world forum',
      'best iu',
      'best innovation university'
    ];

    if (ariseClients.some(target => clientName.includes(target))) {
      return <AriseVenturesExperience navigate={navigate} project={project} />;
    }

    if (clientName.includes('firefox')) {
      return <FirefoxExperience navigate={navigate} project={project} />;
    }

    const snowLeopardClients = [
      'snow leopard',
      'albatross energetics',
      'american chemical',
      'hale',
      'india global forum',
      'observation research',
      'observer research'
    ];

    if (snowLeopardClients.some(target => clientName.includes(target)) || project?.route === 'Sci-Art Saga') {
      return <SnowLeopardExperience navigate={navigate} project={project} />;
    }

    const kantiSweetsClients = [
      'back to roots',
      'kafe 57',
      'fermentech',
      'kanti sweets',
      'navankur',
      'sunburst',
      'leading business family'
    ];

    if (kantiSweetsClients.some(target => clientName.includes(target))) {
      return <BackToRootsExperience navigate={navigate} project={project} />;
    }

    const legacyClients = [
      'aura skincare',
      'lumina tech',
      'novus fin',
      'aero dynamics'
    ];

    if (legacyClients.some(target => clientName.includes(target))) {
      return <LegacyExperience navigate={navigate} project={project} palette={palette} />;
    }

    if (project.template) {
      switch (project.template) {
        case 'firefox':
          return <FirefoxExperience navigate={navigate} project={project} />;
        case 'arise':
          return <AriseVenturesExperience navigate={navigate} project={project} />;
        case 'snow-leopard':
          return <SnowLeopardExperience navigate={navigate} project={project} />;
        case 'param':
          return <AriseVenturesExperience navigate={navigate} project={project} />;
        case 'back-to-roots':
        case 'kanti-sweets':
          return <BackToRootsExperience navigate={navigate} project={project} />;
        case 'storytelling':
          return <GenericStorytellingExperience navigate={navigate} project={project} />;
        case 'legacy':
          return <LegacyExperience navigate={navigate} project={project} palette={palette} />;
      }
    }

    return <GenericStorytellingExperience navigate={navigate} project={project} />;
  })();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: palette.bgDeep }}><div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" /></div>}>
      {experience}
      <CaseStudyTeamCredits project={project} />
    </Suspense>
  );
};


const AboutPage = ({ navigate }) => {
  const { SITE_SETTINGS, CORE_VALUES, TIMELINE } = useContext(GlobalContext);
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left">
        <button onClick={() => navigate('home')} className="pointer-events-auto flex items-center w-fit gap-2 text-[17px] md:text-[19px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white mb-12 group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {SITE_SETTINGS?.backToHomeLabel || "Back to Home"}</button>

        {/* Section 1: Hero */}
        <FadeUp>
          <h2 className="text-[17px] md:text-[19px] font-medium uppercase tracking-widest mb-6 font-primary" style={{ color: palette.primary }}>{SITE_SETTINGS?.aboutPage?.pageLabel || "About PurpleBlue House"}</h2>
          <h1 className="text-5xl md:text-5xl md:text-7xl lg:text-8xl font-light mb-12 tracking-tight max-w-5xl font-primary">{renderWithItalics(SITE_SETTINGS?.aboutPage?.heroTitle || "We build breakthrough brands backed by cutting-edge innovation, powered by a *SciArt approach.*")}</h1>
        </FadeUp>

        {/* Section 2: Vision & Mission */}
        <FadeUp delay={0.2} className="grid md:grid-cols-2 gap-16 border-t border-white/10 pt-24 mb-24 w-full">
          <div>
            <h3 className="text-[17px] md:text-[19px] tracking-widest uppercase mb-6 font-primary text-white/40">{SITE_SETTINGS?.aboutPage?.visionLabel || "Our Vision"}</h3>
            <h2 className="text-xl md:text-2xl font-light font-primary leading-tight text-white/90">{SITE_SETTINGS?.aboutPage?.visionText || "To be the defining strategic partner for the world's most ambitious breakthrough innovations, shaping the next era of global progress."}</h2>
          </div>
          <div>
            <h3 className="text-[17px] md:text-[19px] tracking-widest uppercase mb-6 font-primary text-white/40">{SITE_SETTINGS?.aboutPage?.missionLabel || "Our Mission"}</h3>
            <p className="text-xl text-white/60 font-light font-secondary leading-relaxed">{SITE_SETTINGS?.aboutPage?.missionText || "We empower forward-thinking organizations globally, translating complex capabilities into compelling narratives. By championing breakthrough ideas, we build resilient brand systems that scale across the next decade and beyond."}</p>
          </div>
        </FadeUp>

        {/* Section 3: Purpose */}
        <FadeUp className="border border-white/10 rounded-[24px] p-12 md:p-16 mb-24 text-center relative overflow-hidden w-full" style={{ backgroundColor: palette.panel }}>
          <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none w-full" style={{  }} />
          <h3 className="text-[17px] md:text-[19px] tracking-widest uppercase mb-6 font-primary" style={{ color: palette.blue }}>{SITE_SETTINGS?.aboutPage?.purposeLabel || "Our Purpose"}</h3>
          <h2 className="text-xl md:text-2xl md:text-5xl font-light font-primary leading-tight max-w-4xl mx-auto text-white/90">{renderWithItalics(SITE_SETTINGS?.aboutPage?.purposeText || "We exist to turn complex innovations into undeniable *market breakthroughs.*")}</h2>
        </FadeUp>

        {/* Section 4: Core Values */}
        <FadeUp><h3 className="text-xl md:text-2xl font-light mb-12 font-primary border-b border-white/10 pb-6">{SITE_SETTINGS?.coreValuesHeader || "Our Core Values"}</h3></FadeUp>
        <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32 w-full">
          {CORE_VALUES.map((v, i) => {
            const Icon = i === 0 ? <Users /> : i === 1 ? <Dna /> : i === 2 ? <Zap /> : <Globe />;
            return (
              <StaggerItem key={i}>
                <div className="bg-white/[0.02] border border-white/5 rounded-[16px] p-8 hover:bg-white/[0.04] transition-colors h-full w-full">
                  <div className="mb-6 w-12 h-12 rounded-[12px] flex items-center justify-center bg-white/5" style={{ color: palette.primary }}>{Icon}</div>
                  <h4 className="text-xl font-medium mb-4 text-white font-primary">{v.title}</h4>
                  <p className="text-white/50 font-light font-secondary leading-relaxed">{v.description}</p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>

        {/* Section 5: The SciArt Philosophy */}
        <FadeUp className="border border-white/5 rounded-[32px] overflow-hidden grid md:grid-cols-2 mb-32 bg-[#050B2E] w-full">
          <div className="p-12 md:p-16 flex flex-col justify-center w-full">
            <h3 className="text-[17px] md:text-[19px] tracking-widest uppercase mb-6 font-primary" style={{ color: palette.accent }}>{SITE_SETTINGS?.aboutPage?.philosophyLabel || "Our Philosophy"}</h3>
            <h2 className="text-xl md:text-2xl font-light mb-6 font-primary">{SITE_SETTINGS?.aboutPage?.philosophyTitle || "The Fusion of Logic and Aesthetics."}</h2>
            <p className="text-xl md:text-2xl text-white/60 font-light font-secondary leading-relaxed mb-8">
              {SITE_SETTINGS?.aboutPage?.philosophyText || "True innovation requires more than a beautiful facade. It demands rigorous strategic thinking coupled with compelling emotional resonance. Science gives us the framework, the data, and the logic. Art gives us the empathy, the visual impact, and the connection. Together, they create brands that are unbreakable."}
            </p>
          </div>
          <div className="relative min-h-[400px] flex items-center justify-center bg-[#010825] overflow-hidden w-full">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="flex gap-4 items-center z-10">
              <div className="w-32 h-32 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md" >
                <span className="font-primary text-xl tracking-widest text-white/80">SCI</span>
              </div>
              <Plus className="w-8 h-8 text-white/20" />
              <div className="w-32 h-32 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md" >
                <span className="font-primary text-xl tracking-widest text-white/80">ART</span>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Section 6: Indian Heritage on a Global Stage */}
        <FadeUp className="text-center w-full mb-32">
          <Globe className="w-12 h-12 mx-auto mb-8 opacity-40" style={{ color: palette.blue }} />
          <h2 className="text-xl md:text-2xl md:text-5xl font-light mb-8 font-primary leading-tight max-w-4xl mx-auto">{SITE_SETTINGS?.aboutPage?.globalTitle || "Elevating Indian Innovation to the Global Stage."}</h2>
          <p className="text-xl text-white/50 font-secondary font-light leading-relaxed max-w-3xl mx-auto">
            {SITE_SETTINGS?.aboutPage?.globalText || "We are rooted in the rich scientific and artistic heritage of India. Our ambition is to help local breakthrough innovators communicate with the precision and premium aesthetic required to compete and lead globally."}
          </p>
        </FadeUp>

        {/* Section 7: Final CTA */}
        <FadeUp className="text-center pt-16 border-t border-white/10 w-full">
          <PremiumButton onClick={() => navigate('assessment')} className="px-12 py-5 text-xl md:text-2xl">{SITE_SETTINGS?.aboutPage?.ctaButton || "Co-create your brand scope"}</PremiumButton>
        </FadeUp>
      </div>
    </div>
  )
};

const OurStoryPage = ({ navigate }) => {
  const { SITE_SETTINGS, TIMELINE } = useContext(GlobalContext);
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left">
        <button onClick={() => navigate('home')} className="pointer-events-auto flex items-center w-fit gap-2 text-[17px] md:text-[19px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white mb-12 group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {SITE_SETTINGS?.backToHomeLabel || "Back to Home"}</button>

        {/* Section 1: Hero */}
        <FadeUp>
          <h2 className="text-[17px] md:text-[19px] font-medium uppercase tracking-widest mb-6 font-primary" style={{ color: palette.primary }}>{SITE_SETTINGS?.storyPage?.pageLabel || "Our Story"}</h2>
          <h1 className="text-5xl md:text-5xl md:text-7xl lg:text-8xl font-light mb-16 tracking-tight font-primary">{SITE_SETTINGS?.storyPage?.heroTitle || "Where Science Meets Art."}</h1>
        </FadeUp>

        {/* Section 2: The Spark */}
        <StaggerGroup className="space-y-8 text-xl md:text-2xl font-light text-white/70 font-secondary leading-relaxed mb-32 w-full">
          <StaggerItem><p className="text-xl md:text-2xl text-white mb-10 leading-tight max-w-4xl">{SITE_SETTINGS?.storyPage?.sparkPara1 || "PurpleBlue House was founded to solve a critical bottleneck: breakthrough innovations were failing to reach their market potential due to fragmented communication."}</p></StaggerItem>
          <StaggerItem><p className="max-w-4xl">{SITE_SETTINGS?.storyPage?.sparkPara2 || "We observed that visionary teams often struggle to translate complex, cutting-edge technology into clear, scalable narratives. They engineer incredible products, but the strategic story gets lost in execution."}</p></StaggerItem>
          <StaggerItem><p className="max-w-4xl">{SITE_SETTINGS?.storyPage?.sparkPara3 || "Meanwhile, standard creative approaches focus heavily on surface-level aesthetics without grasping the underlying functional truths. This disconnect limits long-term growth and dilutes the breakthrough."}</p></StaggerItem>
          <StaggerItem><p className="max-w-4xl">{SITE_SETTINGS?.storyPage?.sparkPara4 || "We built a collaborative ecosystem where rigorous logic and strategic imagination drive every decision, ensuring tomorrow's breakthroughs communicate with clarity today."}</p></StaggerItem>
        </StaggerGroup>

        {/* Section 3: The Meaning Behind the Name */}
        <FadeUp className="border border-white/5 rounded-[24px] p-12 md:p-16 mb-32 flex flex-col md:flex-row gap-12 items-center w-full" style={{ backgroundColor: palette.panel }}>
          <div className="flex gap-4 md:w-1/3 justify-center">
            <div className="w-16 h-32 rounded-full" style={{ backgroundColor: palette.primary }} />
            <div className="w-16 h-32 rounded-full" style={{ backgroundColor: palette.blue }} />
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl md:text-2xl font-light mb-6 font-primary">{SITE_SETTINGS?.storyPage?.nameSectionTitle || "Why Purple and Blue?"}</h3>
            <p className="font-secondary font-light text-white/70 leading-relaxed mb-4">
              <strong className="text-white">Purple</strong> {SITE_SETTINGS?.storyPage?.purpleDesc || "represents Art. It is the color of imagination, creativity, emotion, and the boundless creator spirit."}
            </p>
            <p className="font-secondary font-light text-white/70 leading-relaxed mb-4">
              <strong className="text-white">Blue</strong> {SITE_SETTINGS?.storyPage?.blueDesc || "represents Science. It is the color of depth, logic, technology, truth, and structural foundation."}
            </p>
            <p className="font-secondary font-light text-white/70 leading-relaxed">
              The <strong className="text-white">House</strong> {SITE_SETTINGS?.storyPage?.houseDesc || "is where they live together. A collaborative ecosystem built for the future."}
            </p>
          </div>
        </FadeUp>

        {/* Section 4: The Timeline */}
        <div className="mb-32 w-full">
          <FadeUp><h3 className="text-xl md:text-2xl font-light mb-16 font-primary text-center">{SITE_SETTINGS?.ourJourneyHeader || "Our Journey"}</h3></FadeUp>
          <StaggerGroup className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent w-full">
            {TIMELINE.map((milestone, idx) => (
              <StaggerItem key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active w-full">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#05050A] text-white/50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow" style={{ color: palette.primary }}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-[16px] border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-primary text-[17px] md:text-[19px] tracking-widest uppercase" style={{ color: palette.primary }}>{milestone.year}</span>
                  </div>
                  <h4 className="text-xl font-medium text-white mb-2 font-primary">{milestone.title}</h4>
                  <p className="text-white/50 text-[17px] md:text-[19px] font-secondary font-light leading-relaxed">{milestone.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        {/* Section 5: The Future */}
        <FadeUp className="text-center mb-24 w-full">
          <h3 className="text-xl md:text-2xl font-light mb-8 font-primary">{SITE_SETTINGS?.storyPage?.lookingAheadTitle || "Looking Ahead"}</h3>
          <p className="text-xl md:text-2xl text-white/60 font-secondary font-light leading-relaxed max-w-3xl mx-auto">
            {SITE_SETTINGS?.storyPage?.lookingAheadText || "Our story is just beginning. We will continue to champion creators, disrupt traditional agency models, and build visual expressions that bridge the past and the future."}
          </p>
        </FadeUp>

        {/* Section 6: CTA */}
        <FadeUp className="text-center pt-16 border-t border-white/10 w-full">
          <PremiumButton onClick={() => navigate('contact')} className="px-12 py-5 text-xl md:text-2xl">{SITE_SETTINGS?.storyPage?.ctaButton || "Be part of our story"}</PremiumButton>
        </FadeUp>
      </div>
    </div>
  );
};

const TeamPage = ({ navigate }) => {
  const { TEAM_MEMBERS, SITE_SETTINGS } = useContext(GlobalContext);
  const finalSettings = SITE_SETTINGS || {};
  const [showCareers, setShowCareers] = useState(false);
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left">
        <button onClick={() => navigate('home')} className="pointer-events-auto flex items-center w-fit gap-2 text-[17px] md:text-[19px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white mb-12 group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {SITE_SETTINGS?.backToHomeLabel || "Back to Home"}</button>

        {/* Section 1: Hero */}
        <FadeUp>
          <h2 className="text-[17px] md:text-[19px] font-medium uppercase tracking-widest mb-6 font-primary" style={{ color: palette.primary }}>{SITE_SETTINGS?.teamPage?.pageLabel || "The Team"}</h2>
          <h1 className="text-5xl md:text-5xl md:text-7xl lg:text-8xl font-light mb-16 tracking-tight font-primary">{renderWithItalics(SITE_SETTINGS?.teamPage?.heroTitle || "The minds behind the magic.")}</h1>
        </FadeUp>

        {/* Section 2: Leadership */}
        <FadeUp><h3 className="text-xl md:text-2xl font-light mb-12 font-primary">{SITE_SETTINGS?.teamPage?.leadershipLabel || "Leadership"}</h3></FadeUp>
        <StaggerGroup className="grid md:grid-cols-2 gap-8 mb-32 w-full">
          {TEAM_MEMBERS.filter(m => m.id && m.id.startsWith('leader')).map((leader, i) => (
            <StaggerItem key={i}>
              <div className="border border-white/5 rounded-[24px] overflow-hidden flex flex-col sm:flex-row h-full w-full" style={{ backgroundColor: palette.panel }}>
                <div className="sm:w-1/2 aspect-square bg-white/5 relative flex items-center justify-center border-r border-white/5">
                  {leader.image ? <img src={leader.image} alt={leader.name} loading="lazy" decoding="async" className="w-full h-full object-cover" /> : <User className="w-16 h-16 text-white/10" />}
                </div>
                <div className="p-8 sm:w-1/2 flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-medium text-white mb-2 font-primary">{leader.name}</h3>
                  <p className="text-[17px] md:text-[19px] tracking-widest uppercase mb-4 font-primary" style={{ color: palette.blue }}>{leader.role}</p>
                  <p className="text-[17px] md:text-[19px] text-white/50 font-secondary leading-relaxed">{leader.bio || leader.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Section 3: The Innovators (Grid) */}
        <FadeUp><h3 className="text-xl md:text-2xl font-light mb-12 font-primary">{SITE_SETTINGS?.teamPage?.coreHouseLabel || "The Core House"}</h3></FadeUp>
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32 w-full">
          {TEAM_MEMBERS.filter(m => m.id && m.id.startsWith('creator')).map((member, idx) => (
            <StaggerItem key={idx}>
              <div className="border border-white/5 rounded-[16px] overflow-hidden group h-full w-full" style={{ backgroundColor: palette.panel }}>
                <div className="aspect-square bg-white/[0.02] relative overflow-hidden flex items-center justify-center transition-colors group-hover:bg-white/[0.05]">
                  {member.image ? <img src={member.image} alt={member.name} loading="lazy" decoding="async" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-white/10" />}
                </div>
                <div className="p-5">
                  <h3 className="text-xl md:text-2xl font-medium text-white mb-1 font-primary">{member.name}</h3>
                  <p className="text-[17px] md:text-[19px] text-white/50 font-secondary">{member.role}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Section 4: Our Culture */}
        <FadeUp className="border border-white/10 rounded-[32px] p-12 md:p-16 mb-32 w-full" >
          <h3 className="text-xl md:text-2xl font-light mb-10 font-primary text-center">{SITE_SETTINGS?.teamPage?.cultureTitle || "Our Culture"}</h3>
          <StaggerGroup className="grid md:grid-cols-3 gap-8 w-full">
            <StaggerItem className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center bg-white/5"><Globe className="w-5 h-5 text-white/70" /></div>
              <h4 className="text-xl md:text-2xl font-medium text-white mb-3 font-primary">{SITE_SETTINGS?.teamPage?.cultureItems?.[0]?.title || "No Silos"}</h4>
              <p className="text-[17px] md:text-[19px] text-white/50 font-secondary leading-relaxed">{SITE_SETTINGS?.teamPage?.cultureItems?.[0]?.description || "Strategy, design, and execution sit at the same table. We believe in cross-pollination of ideas."}</p>
            </StaggerItem>
            <StaggerItem className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center bg-white/5"><Zap className="w-5 h-5 text-white/70" /></div>
              <h4 className="text-xl md:text-2xl font-medium text-white mb-3 font-primary">{SITE_SETTINGS?.teamPage?.cultureItems?.[1]?.title || "Creator-First"}</h4>
              <p className="text-[17px] md:text-[19px] text-white/50 font-secondary leading-relaxed">{SITE_SETTINGS?.teamPage?.cultureItems?.[1]?.description || "We empower our team to take ownership, innovate fearlessly, and challenge the status quo."}</p>
            </StaggerItem>
            <StaggerItem className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center bg-white/5"><BookOpen className="w-5 h-5 text-white/70" /></div>
              <h4 className="text-xl md:text-2xl font-medium text-white mb-3 font-primary">{SITE_SETTINGS?.teamPage?.cultureItems?.[2]?.title || "Continuous Learning"}</h4>
              <p className="text-[17px] md:text-[19px] text-white/50 font-secondary leading-relaxed">{SITE_SETTINGS?.teamPage?.cultureItems?.[2]?.description || "In a world driven by rapid innovation, we are perpetual students of science, art, and human behavior."}</p>
            </StaggerItem>
          </StaggerGroup>
        </FadeUp>


        {/* Section 5: Join the House CTA */}
        <FadeUp className="text-center pt-32 pb-16 border-t border-white/10 w-full flex flex-col items-center">
          {/* Little glowing dot from the design */}
          <div className="w-3 h-3 rounded-full bg-[#FDE68A] mb-8 shadow-[0_0_20px_#FDE68A]" />

          <h3 className="text-xl md:text-2xl font-light mb-6 font-primary text-white">{SITE_SETTINGS?.teamPage?.joinTitle || "Want to join the House?"}</h3>
          <p className="text-xl md:text-2xl text-white/50 font-secondary mb-10 max-w-2xl mx-auto">{SITE_SETTINGS?.teamPage?.joinSubtext || "We are always looking for visionary strategists and artists."}</p>

          <button
            onClick={() => setShowCareers(true)}
            className="px-8 py-3 rounded-[12px] border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] transition-all text-white text-[17px] md:text-[19px] font-medium font-secondary"
          >
            {SITE_SETTINGS?.teamPage?.joinButton || "View Open Roles"}
          </button>
        </FadeUp>
        <AnimatePresence>
          {showCareers && <CareersModal onClose={() => setShowCareers(false)} formDataSettings={finalSettings.forms} />}
        </AnimatePresence>

      </div>
    </div>
  );
};

const MethodPage = ({ navigate }) => {
  const { SITE_SETTINGS, FRAMEWORK } = useContext(GlobalContext);
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left">
        <button onClick={() => navigate('home')} className="pointer-events-auto flex items-center w-fit gap-2 text-[17px] md:text-[19px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white mb-12 group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {SITE_SETTINGS?.backToHomeLabel || "Back to Home"}</button>

        {/* Section 1: Hero */}
        <FadeUp>
          <h2 className="text-[17px] md:text-[19px] font-medium uppercase tracking-widest mb-6 font-primary" style={{ color: palette.primary }}>{SITE_SETTINGS?.methodPage?.pageLabel || "The PBH Method"}</h2>
          <h1 className="text-5xl md:text-5xl md:text-7xl lg:text-8xl font-light mb-24 tracking-tight font-primary max-w-4xl">{renderWithItalics(SITE_SETTINGS?.methodPage?.heroTitle || "The blueprint for *breakthrough brands.*")}</h1>
        </FadeUp>

        {/* Section 2: Traditional vs PBH */}
        <FadeUp className="grid md:grid-cols-2 gap-8 w-full mb-32">
          <div className="border border-white/5 rounded-[24px] p-10 relative overflow-hidden w-full" style={{ backgroundColor: palette.panel }}>
            <h3 className="text-white/40 text-[17px] md:text-[19px] tracking-widest uppercase mb-8 font-primary">{SITE_SETTINGS?.methodPage?.traditionalTitle || "The Traditional Model"}</h3>
            <ul className="space-y-6 font-secondary">
              <li className="flex gap-4 text-white/50 font-light text-[17px] md:text-[19px]"><X className="w-5 h-5 shrink-0 text-red-500/50 mt-0.5" /> <span>{SITE_SETTINGS?.methodPage?.traditionalModel?.[0] || "Execution disconnected from core business objectives."}</span></li>
              <li className="flex gap-4 text-white/50 font-light text-[17px] md:text-[19px]"><X className="w-5 h-5 shrink-0 text-red-500/50 mt-0.5" /> <span>{SITE_SETTINGS?.methodPage?.traditionalModel?.[1] || "Short-term aesthetic fixes over long-term systems."}</span></li>
              <li className="flex gap-4 text-white/50 font-light text-[17px] md:text-[19px]"><X className="w-5 h-5 shrink-0 text-red-500/50 mt-0.5" /> <span>{SITE_SETTINGS?.methodPage?.traditionalModel?.[2] || "Disjointed touchpoints that dilute brand potential."}</span></li>
            </ul>
          </div>
          <div className="border rounded-[24px] p-10 relative overflow-hidden w-full" style={{ background: `linear-gradient(to bottom right, ${hexToRgba(palette.primary, 0.1)}, transparent)`, borderColor: hexToRgba(palette.primary, 0.2) }}>
            <h3 className="text-[17px] md:text-[19px] tracking-widest uppercase mb-8 font-medium relative z-10 font-primary" style={{ color: palette.primary }}>{SITE_SETTINGS?.methodPage?.pbhMethodTitle || "The PBH Method"}</h3>
            <ul className="space-y-6 relative z-10 font-secondary">
              <li className="flex gap-4 text-white/90 font-light text-[17px] md:text-[19px]"><Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: palette.primary }} /> <span>{SITE_SETTINGS?.methodPage?.pbhMethod?.[0] || "Mapping the root business gap before designing anything."}</span></li>
              <li className="flex gap-4 text-white/90 font-light text-[17px] md:text-[19px]"><Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: palette.primary }} /> <span>{SITE_SETTINGS?.methodPage?.pbhMethod?.[1] || "Modular scoping based on exact strategic requirements."}</span></li>
              <li className="flex gap-4 text-white/90 font-light text-[17px] md:text-[19px]"><Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: palette.primary }} /> <span>{SITE_SETTINGS?.methodPage?.pbhMethod?.[2] || "Building connected systems where strategy dictates execution."}</span></li>
            </ul>
          </div>
        </FadeUp>

        {/* Section 3: The 4 Steps */}
        <FadeUp><h3 className="text-xl md:text-2xl font-light mb-16 font-primary text-center">{SITE_SETTINGS?.frameworkHeader || "Our 4-Step Framework"}</h3></FadeUp>
        <StaggerGroup className="space-y-24 mb-32 w-full">
          {FRAMEWORK.map((s, i) => (
            <StaggerItem key={i}>
              <div className="grid md:grid-cols-12 gap-8 border-t border-white/5 pt-12 relative w-full">
                <div className="absolute top-0 left-0 w-1/4 h-[1px]"  />
                <div className="md:col-span-1 text-xl md:text-2xl font-primary italic text-white/30">0{s.stepNumber}</div>
                <div className="md:col-span-6 pr-8">
                  <h3 className="text-xl md:text-2xl font-light mb-4 font-primary">{s.title}</h3>
                  <p className="text-white/50 font-light text-xl md:text-2xl leading-relaxed font-secondary max-w-2xl">{s.description}</p>
                </div>
                <div className="md:col-span-5 md:pl-12 border-l border-white/5">
                  <h4 className="text-[17px] md:text-[19px] font-medium text-white/30 uppercase tracking-widest mb-6 font-primary">Key Outputs</h4>
                  <ul className="space-y-3 font-secondary">
                    {s.outputs?.map((out, j) => <li key={j} className="flex items-center gap-3 text-white/70 font-light text-[17px] md:text-[19px] bg-white/[0.02] border border-white/5 px-4 py-3 rounded-[8px]"><Check className="w-4 h-4 shrink-0" style={{ color: palette.accent }} /> {out}</li>)}
                  </ul>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Section 4: The SciArt Application */}
        <FadeUp className="border border-white/10 rounded-[24px] p-12 mb-32 text-center w-full" style={{ backgroundColor: palette.panel }}>
          <h3 className="text-xl md:text-2xl font-light mb-6 font-primary">{SITE_SETTINGS?.methodPage?.appliedSciArtTitle || "Applied SciArt"}</h3>
          <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-secondary">
            {SITE_SETTINGS?.methodPage?.appliedSciArtText || "Throughout every step of this method, we apply the SciArt filter. Does the strategy hold up to logical scrutiny (Science)? Does the execution evoke the right human emotion (Art)? If an output fails either test, it does not leave the House."}
          </p>
        </FadeUp>

        {/* Section 5: Timeline Overview */}
        <FadeUp><h3 className="text-xl md:text-2xl font-light mb-12 font-primary text-center">{SITE_SETTINGS?.timelineHeader || "Typical Engagement Timeline"}</h3></FadeUp>
        <StaggerGroup className="grid md:grid-cols-4 gap-4 mb-32 w-full">
          {[
            { phase: "Weeks 1-2", focus: "Discovery & Alignment", color: palette.primary },
            { phase: "Weeks 3-4", focus: "Strategy & Narrative", color: palette.blue },
            { phase: "Weeks 5-7", focus: "Design & Systems", color: palette.purple },
            { phase: "Week 8+", focus: "Handoff & Execution", color: palette.accent }
          ].map((t, idx) => (
            <StaggerItem key={idx}>
              <div className="p-6 border border-white/5 rounded-[16px] text-center h-full w-full" style={{ backgroundColor: palette.bgDeep }}>
                <div className="text-[17px] md:text-[19px] uppercase tracking-widest mb-3 font-primary font-medium" style={{ color: t.color }}>{t.phase}</div>
                <div className="text-white font-secondary font-light">{t.focus}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Section 6: Final CTA */}
        <FadeUp className="pt-16 border-t border-white/10 text-center w-full">
          <h2 className="text-xl md:text-2xl font-light mb-8 font-primary">{SITE_SETTINGS?.methodPage?.finalCTA || "Experience the method yourself."}</h2>
          <PremiumButton onClick={() => navigate('assessment')}>Build My Brand Scope</PremiumButton>
        </FadeUp>
      </div>
    </div>
  )
};

const ServicesPage = ({ navigate }) => {
  const { SITE_SETTINGS, ROUTES_INFO, CASE_STUDIES } = useContext(GlobalContext);
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left">
        <button onClick={() => navigate('home')} className="pointer-events-auto flex items-center w-fit gap-2 text-[17px] md:text-[19px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white mb-12 group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {SITE_SETTINGS?.backToHomeLabel || "Back to Home"}</button>
        <RevealText><h1 className="text-5xl md:text-5xl md:text-7xl lg:text-8xl font-light mb-6 tracking-tight max-w-4xl font-primary whitespace-pre-wrap">{renderWithItalics(SITE_SETTINGS?.servicesHeader || "Three strategic routes.\n*One connected brand system.*")}</h1></RevealText>
        <FadeUp><p className="text-xl text-white/50 font-light mb-24 max-w-3xl leading-relaxed font-secondary">{SITE_SETTINGS?.servicesSubtext || "PBH services are not isolated offerings. They are designed as connected routes that help brands move from clarity to communication to execution."}</p></FadeUp>

        <StaggerGroup className="grid gap-12 mb-32 w-full">
          {Object.values(ROUTES_INFO).map((route, i) => {
            const rColor = palette[route.type] || palette.primary;
            return (
              <StaggerItem key={route.id}>
                <SpotlightCard className="rounded-[32px] w-full">
                  <div className="border rounded-[32px] p-10 md:p-16 flex flex-col lg:flex-row gap-12 lg:gap-16 transition-colors w-full relative overflow-hidden" style={{ backgroundColor: palette.lightBlue, borderColor: hexToRgba(palette.primary, 0.15) }}>
                    <div className="lg:w-5/12 flex flex-col">
                      <div className="w-20 h-20 rounded-[20px] flex items-center justify-center mb-8 lg:mb-10 shadow-lg shrink-0" style={{ backgroundColor: rColor, color: 'white' }}>{route.icon}</div>
                      <h3 className="text-xl md:text-2xl font-light mb-4 lg:mb-6 font-primary" style={{ color: palette.bgDeep }}>{route.title}</h3>
                      <p className="font-light leading-relaxed mb-8 lg:mb-10 font-secondary text-[17px] md:text-[19px] max-w-md" style={{ color: hexToRgba(palette.bgDeep, 0.7) }}>{route.desc}</p>

                      <div className="mt-auto pt-4 border-t border-black/10 lg:border-none lg:pt-0">
                        <PremiumButton variant="ghost" onClick={() => navigate(`service-modal/${route.id.toLowerCase()}`)} className="px-0 py-0 hover:bg-transparent group font-secondary text-[17px] md:text-[19px]" style={{ color: palette.bgDeep }}>{SITE_SETTINGS?.servicesExploreButton || "Explore Route Details"} <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" /></PremiumButton>
                      </div>
                    </div>

                    <div className="lg:w-7/12 flex flex-col gap-10 font-secondary">
                      <div>
                        <h4 className="text-[17px] md:text-[19px] font-medium uppercase tracking-widest mb-6 font-primary flex items-center gap-3" style={{ color: hexToRgba(palette.bgDeep, 0.6) }}><Layers className="w-4 h-4" /> Core Line Items</h4>
                        <ul className="grid sm:grid-cols-2 gap-4">
                          {route.lineItems.map(li => (
                            <li key={li.id} className="text-[17px] md:text-[19px] font-medium flex items-start gap-3 border p-5 rounded-[16px] shadow-sm" style={{ backgroundColor: hexToRgba(palette.bgDeep, 0.02), borderColor: hexToRgba(palette.bgDeep, 0.05), color: palette.bgDeep }}>
                              <Check className="w-5 h-5 shrink-0 mt-[2px]" style={{ color: rColor }} />
                              <span className="leading-snug">{li.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border rounded-[24px] p-8 flex flex-col h-full relative overflow-hidden mt-auto shadow-inner" style={{ backgroundColor: hexToRgba(palette.bgDeep, 0.03), borderColor: hexToRgba(palette.bgDeep, 0.05) }}>
                        <h4 className="text-[17px] md:text-[19px] font-medium uppercase tracking-widest mb-4 font-primary flex items-center gap-3 relative z-10" style={{ color: hexToRgba(palette.bgDeep, 0.6) }}><Target className="w-4 h-4" /> Best For</h4>
                        <p className="text-[17px] md:text-[19px] font-light leading-relaxed relative z-10" style={{ color: hexToRgba(palette.bgDeep, 0.8) }}>{route.bestFor}</p>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>

        {/* FAQ for Services */}
        <div className="w-full border-t border-white/10 pt-16 mb-24">
          <FadeUp><h3 className="text-xl md:text-2xl font-light mb-8 font-primary text-center">{SITE_SETTINGS?.serviceFaqs?.title || "Service FAQs"}</h3></FadeUp>
          <StaggerGroup className="space-y-4 font-secondary max-w-4xl mx-auto">
            <StaggerItem>
              <div className="p-8 rounded-[24px] border border-white/5 relative group overflow-hidden" style={{ backgroundColor: palette.panel }}>
                <h4 className="font-medium text-white mb-2">{SITE_SETTINGS?.serviceFaqs?.[0]?.question || "Can we choose just one deliverable?"}</h4>
                <p className="text-[17px] md:text-[19px] text-white/50">{SITE_SETTINGS?.serviceFaqs?.[0]?.answer || "We strongly recommend going through our assessment first. If a single deliverable solves the root problem, yes. If not, we will recommend a connected system."}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-8 rounded-[24px] border border-white/5 relative group overflow-hidden" style={{ backgroundColor: palette.panel }}>
                <h4 className="font-medium text-white mb-2">{SITE_SETTINGS?.serviceFaqs?.[1]?.question || "How do we know which route is right for us?"}</h4>
                <p className="text-[17px] md:text-[19px] text-white/50">{SITE_SETTINGS?.serviceFaqs?.[1]?.answer || 'You don\'t need to guess. Use our "Build My Brand Scope" tool, and our strategic engine will diagnose your gaps and assign the perfect route automatically.'}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>

        <FadeUp className="text-center w-full">
          <PremiumButton onClick={() => navigate('assessment')} className="px-12 py-5 text-xl md:text-2xl">Build Your Scope</PremiumButton>
        </FadeUp>
      </div>
    </div>
  )
};

const ServiceDetailPage = ({ navigate, routeId }) => {
  const { ROUTES_INFO, DELIVERABLES_MASTER } = useContext(GlobalContext);
  const route = ROUTES_INFO[routeId?.toUpperCase()] || ROUTES_INFO['BB'];
  const rColor = palette[route.type] || palette.primary;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [routeId]);

  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left">
        <button onClick={() => navigate('services')} className="text-white/40 hover:text-white text-[17px] md:text-[19px] transition-colors flex items-center gap-2 group mb-12 font-secondary"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Services</button>
        <FadeUp>
          <div className="w-20 h-20 rounded-[20px] flex items-center justify-center mb-10 shadow-lg" style={{ backgroundColor: rColor, color: palette.bgDeep }}>{route.icon}</div>
          <h1 className="text-5xl md:text-5xl md:text-7xl lg:text-8xl font-light mb-6 tracking-tight font-primary text-white">{route.title}</h1>
          <p className="text-xl text-white/50 font-light mb-12 max-w-3xl leading-relaxed font-secondary">{route.desc}</p>
        </FadeUp>

        <FadeUp className="bg-white/[0.03] border border-white/10 rounded-[24px] p-8 mb-16 max-w-4xl relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] opacity-10 pointer-events-none" style={{ backgroundColor: rColor }} />
          <h4 className="text-[17px] md:text-[19px] font-medium text-white/40 uppercase tracking-widest mb-4 font-primary flex items-center gap-3 relative z-10"><Target className="w-5 h-5" /> Best For</h4>
          <p className="text-xl font-light text-white/90 leading-relaxed relative z-10">{route.bestFor}</p>
        </FadeUp>

        <FadeUp><h3 className="text-xl md:text-2xl font-light mb-10 border-b border-white/10 pb-6 font-primary text-white">What's Included</h3></FadeUp>
        <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 w-full">
          {route.lineItems.map((li, i) => (
            <StaggerItem key={li.id}>
              <div className="border border-white/5 rounded-[24px] p-8 h-full w-full bg-white/[0.02] hover:bg-white/[0.04] transition-colors shadow-lg">
                <h4 className="text-xl md:text-2xl font-medium mb-8 text-white font-primary">{li.name}</h4>
                <ul className="space-y-4 font-secondary">
                  {DELIVERABLES_MASTER.filter(d => d.lineItem === li.id).map(d => (
                    <li key={d.id} className="text-[17px] md:text-[19px] font-light text-white/80 flex items-start gap-3"><Check className="w-5 h-5 shrink-0 mt-[2px]" style={{ color: rColor }} /> <span className="leading-snug">{d.name}</span></li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <FadeUp className="border border-white/10 rounded-[24px] p-12 text-center w-full relative overflow-hidden" >
          <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: rColor }} />
          <h2 className="text-xl md:text-2xl font-light mb-6 font-primary relative z-10 text-white">Find the right scope for your breakthrough.</h2>
          <PremiumButton onClick={() => navigate('assessment')} className="relative z-10">Build A Scope</PremiumButton>
        </FadeUp>
      </div>
    </div>
  );
};

const ServiceModal = ({ navigate, routeId, onClose }) => {
  const route = ROUTES_INFO[routeId.toUpperCase()] || ROUTES_INFO['BB'];
  const rColor = palette[route.type] || palette.primary;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 md:p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/10 relative custom-scrollbar text-left shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-gradient-to-b"
        style={{ backgroundColor: palette.bgDeep, backgroundImage: `linear-gradient(180deg, ${palette.panel}, ${palette.bgDeep})` }}
      >
        <div className="sticky top-0 right-0 w-full flex justify-end p-6 z-50 pointer-events-none">
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all pointer-events-auto border border-white/10 shadow-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 md:px-16 pb-16 -mt-10 relative z-10">
          <div className="w-20 h-20 rounded-[20px] flex items-center justify-center mb-10 shadow-lg" style={{ backgroundColor: rColor, color: palette.bgDeep }}>{route.icon}</div>
          <h2 className="text-xl md:text-2xl md:text-5xl md:text-5xl md:text-7xl lg:text-8xl lg:text-8xl font-light mb-6 tracking-tight font-primary text-white">{route.title}</h2>
          <p className="text-xl text-white/50 font-light mb-12 max-w-3xl leading-relaxed font-secondary">{route.desc}</p>

          <div className="bg-white/[0.03] border border-white/10 rounded-[24px] p-8 mb-16 max-w-4xl relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] opacity-10 pointer-events-none" style={{ backgroundColor: rColor }} />
            <h4 className="text-[17px] md:text-[19px] font-medium text-white/40 uppercase tracking-widest mb-4 font-primary flex items-center gap-3 relative z-10"><Target className="w-5 h-5" /> Best For</h4>
            <p className="text-xl font-light text-white/90 leading-relaxed relative z-10">{route.bestFor}</p>
          </div>

          <h3 className="text-xl md:text-2xl font-light mb-10 border-b border-white/10 pb-6 font-primary text-white">What's Included</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 w-full">
            {route.lineItems.map((li, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} key={li.id} className="border border-white/5 rounded-[24px] p-8 h-full w-full bg-white/[0.02] hover:bg-white/[0.04] transition-colors shadow-lg">
                <h4 className="text-xl md:text-2xl font-medium mb-8 text-white font-primary">{li.name}</h4>
                <ul className="space-y-4 font-secondary">
                  {DELIVERABLES_MASTER.filter(d => d.lineItem === li.id).map(d => (
                    <li key={d.id} className="text-[17px] md:text-[19px] font-light text-white/80 flex items-start gap-3"><Check className="w-5 h-5 shrink-0 mt-[2px]" style={{ color: rColor }} /> <span className="leading-snug">{d.name}</span></li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="border border-white/10 rounded-[24px] p-12 text-center w-full relative overflow-hidden" >
            <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: rColor }} />
            <h2 className="text-xl md:text-2xl font-light mb-6 font-primary relative z-10 text-white">Find the right scope for your breakthrough.</h2>
            <PremiumButton onClick={() => { onClose(); navigate('assessment'); }} className="relative z-10">Build A Scope</PremiumButton>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const WorkPage = ({ navigate }) => {
  const { SITE_SETTINGS, CASE_STUDIES } = useContext(GlobalContext);
  const caseStudies = [
    ...CASE_STUDIES
  ];
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left">
        <button onClick={() => navigate('home')} className="pointer-events-auto flex items-center w-fit gap-2 text-[17px] md:text-[19px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white mb-12 group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {SITE_SETTINGS?.backToHomeLabel || "Back to Home"}</button>
        <RevealText><h1 className="t-display mb-6 whitespace-pre-wrap">{renderWithItalics(SITE_SETTINGS?.workPageHeader || "Our Work.")}</h1></RevealText>
        <FadeUp><p className="t-body text-white/50 mb-16 max-w-2xl">{SITE_SETTINGS?.workPageSubtext || "Case studies and full visual archive proving our thinking across strategy, identity, and campaigns."}</p></FadeUp>

        {/* Featured Case Study Hero */}
        <FadeUp delay={0.1} className="mb-24 w-full">
          <div data-pbh-copy-ignore onClick={() => navigate('work/' + caseStudies[0].id)} className="group relative border border-white/10 rounded-[32px] overflow-hidden flex flex-col lg:flex-row h-auto cursor-pointer w-full shadow-2xl transition-all duration-700 hover:border-white/30" style={{ backgroundColor: palette.panel }}>
            <div className="w-full lg:w-[55%] shrink-0 relative overflow-hidden bg-[#0a0a0a]">
              {(caseStudies[0].bannerVideo || caseStudies[0].fullStory?.heroVideo || caseStudies[0].bannerImage || caseStudies[0].fullStory?.heroImg || caseStudies[0].imageUrl) ? (
                <CaseStudyMedia 
                  src={caseStudies[0].bannerVideo || caseStudies[0].fullStory?.heroVideo || caseStudies[0].bannerImage || caseStudies[0].fullStory?.heroImg || caseStudies[0].imageUrl} 
                  alt={caseStudies[0].client} 
                  className="w-full h-full min-h-[350px] object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  style={isSnowLeopardCaseStudy(caseStudies[0]) ? { objectPosition: '14% center' } : undefined}
                />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-30 mix-blend-screen transition-transform duration-1000 ease-out group-hover:scale-105"  />
                  <div className="absolute inset-0 flex items-center justify-center"><span className="t-display italic text-white/10">{caseStudies[0].client ? caseStudies[0].client.split(' ')[0] : 'Work'}</span></div>
                </>
              )}
            </div>
            <div className="w-full lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/5">
              <span className="t-label block mb-4" style={{ color: palette.primary }}>Featured Case Study • {caseStudies[0].sector}</span>
              <h3 className="t-display mb-6">{caseStudies[0].client}</h3>
              <p className="t-body text-white/50 mb-10 max-w-lg">{caseStudies[0].challenge}</p>
              <div className="flex gap-4 mb-12 flex-wrap">
                {getVisibleCaseStudyTags(caseStudies[0]).map(t => <span key={t} className="t-label px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/70">{t}</span>)}
              </div>
              <div className="mt-auto flex items-center gap-2 t-body text-white/70 group-hover:text-white transition-colors font-medium">Read Full Study <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" /></div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="flex gap-4 mb-12 border-b border-white/10 pb-6 overflow-x-auto font-secondary w-full custom-scrollbar">
          <button className="px-4 py-2 rounded-full border border-white text-white text-[12px] md:text-[13px] tracking-[0.3em] uppercase shrink-0">{SITE_SETTINGS?.allProjectsButton || "All Projects"}</button>
          <button className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-[12px] md:text-[13px] tracking-[0.3em] uppercase shrink-0 hover:bg-white/5">Brand Boulevard</button>
          <button className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-[12px] md:text-[13px] tracking-[0.3em] uppercase shrink-0 hover:bg-white/5">SciArt Saga</button>
          <button className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-[12px] md:text-[13px] tracking-[0.3em] uppercase shrink-0 hover:bg-white/5">Storytelling Corner</button>
        </FadeUp>

        <StaggerGroup className="grid-brick-center gap-8 w-full mb-32">
          {caseStudies.slice(1).map((cs, i) => {
            const secondaryColors = [palette.lavender, palette.medBlue, palette.lightBlue, palette.primary];
            const hexColor = secondaryColors[i % secondaryColors.length];
            const visibleTags = getVisibleCaseStudyTags(cs);
            const thumbnailMediaProps = getCaseStudyThumbnailMediaProps(cs);
            return (
              <StaggerItem key={i} className="w-full">
                <div data-pbh-copy-ignore onClick={() => navigate('work/' + cs.id)} className="group relative border border-white/10 rounded-[24px] overflow-hidden cursor-pointer w-full aspect-[4/3] bg-[#0a0a0a] shadow-2xl transition-all duration-700 hover:border-white/30">

                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    {(cs.bannerVideo || cs.fullStory?.heroVideo || cs.bannerImage || cs.fullStory?.heroImg || cs.imageUrl) ? (
                      <CaseStudyMedia
                        src={cs.bannerVideo || cs.fullStory?.heroVideo || cs.bannerImage || cs.fullStory?.heroImg || cs.imageUrl}
                        alt={cs.client}
                        className={thumbnailMediaProps.className}
                        style={thumbnailMediaProps.style}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-primary italic text-white/10 text-5xl">{cs.client ? cs.client.split(' ')[0] : 'Work'}</span>
                      </div>
                    )}
                  </div>

                  {/* Hover panel — slides up from bottom */}
                  <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                    <div className="bg-gradient-to-t from-black/80 to-black/40 backdrop-blur-xl border-t border-white/10 px-7 py-6 text-left">
                      <h3 className="font-primary text-white text-lg md:text-xl font-semibold leading-snug mb-1 drop-shadow-md">{cs.client}</h3>
                      {(cs.preview || cs.challenge) && (
                        <p className="font-secondary text-white/60 text-sm md:text-[15px] leading-snug mb-3 line-clamp-2">{cs.preview || cs.challenge}</p>
                      )}
                      {visibleTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {visibleTags.map(t => (
                            <span key={t} className="px-3 py-1 rounded-full border border-white/25 bg-white/10 text-white/75 text-[11px] md:text-xs font-secondary tracking-wide uppercase backdrop-blur-sm">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="inline-block px-5 py-2 rounded-full bg-[#F5C518]/90 text-black text-sm font-semibold font-secondary shadow-[0_4px_20px_rgba(245,197,24,0.3)]">
                        View Case Study
                      </span>
                    </div>
                  </div>

                </div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>

        <FadeUp className="border border-white/10 rounded-[32px] p-16 text-center bg-[#010825] relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20" style={{ backgroundColor: palette.blue }} />
          <h3 className="text-xl md:text-2xl font-light mb-6 font-primary text-white">Ready to start your project?</h3>
          <p className="text-xl md:text-2xl text-white/50 font-secondary mb-10 max-w-xl mx-auto">Skip the generic agency pitch. Map your brand needs instantly using our Scope Builder.</p>
          <PremiumButton onClick={() => navigate('assessment')} className="px-10 py-4">Build My Brand Scope</PremiumButton>
        </FadeUp>
      </div>
    </div>
  )
};

const JournalPage = ({ navigate }) => {
  const { JOURNAL_ARTICLES, SITE_SETTINGS } = useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState('All Perspectives');

  const tabs = ['All Perspectives', 'Frameworks', 'Culture', 'Design Systems'];

  const filteredArticles = JOURNAL_ARTICLES.slice(1).filter(article => {
    if (activeTab === 'All Perspectives') return true;
    if (activeTab === 'Frameworks') return article.tag.toLowerCase().includes('framework');
    if (activeTab === 'Culture') return article.tag.toLowerCase().includes('culture');
    if (activeTab === 'Design Systems') return article.tag.toLowerCase().includes('design') || article.title.toLowerCase().includes('design system') || article.tag.toLowerCase().includes('guide');
    return true;
  });

  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left">
        <button onClick={() => navigate('home')} className="pointer-events-auto flex items-center w-fit gap-2 text-[17px] md:text-[19px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white mb-12 group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {SITE_SETTINGS?.backToHomeLabel || "Back to Home"}</button>
        <RevealText><h1 className="text-5xl md:text-5xl md:text-7xl lg:text-8xl font-light mb-6 tracking-tight font-primary whitespace-pre-wrap">{renderWithItalics(SITE_SETTINGS?.journalHeader || "The Journal.")}</h1></RevealText>
        <FadeUp><p className="text-xl text-white/50 font-light mb-16 max-w-2xl font-secondary">{SITE_SETTINGS?.journalSubtext || "Essays, frameworks, and perspectives on building brands that matter."}</p></FadeUp>

        {/* Featured Article */}
        <FadeUp delay={0.1} className="mb-24 w-full">
          <div onClick={() => navigate('article/' + JOURNAL_ARTICLES[0].id)} className="group relative border border-white/10 rounded-[32px] overflow-hidden flex flex-col md:flex-row h-auto md:h-[500px] cursor-pointer w-full" style={{ backgroundColor: palette.panel }}>
            <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10 w-full">
              <span className="text-[17px] md:text-[19px] font-medium tracking-widest uppercase block mb-6 font-primary" style={{ color: palette.primary }}>Featured • {JOURNAL_ARTICLES[0].tag}</span>
              <h3 className="text-xl md:text-2xl font-light mb-8 font-primary group-hover:text-white/80 transition-colors leading-tight max-w-2xl">{JOURNAL_ARTICLES[0].title}</h3>
              <p className="text-white/50 font-light mb-10 text-xl md:text-2xl leading-relaxed font-secondary line-clamp-3 max-w-xl">{JOURNAL_ARTICLES[0].excerpt}</p>
              <div className="mt-auto flex items-center justify-between font-secondary text-[17px] md:text-[19px] border-t border-white/5 pt-6 text-white/40">
                <span>{JOURNAL_ARTICLES[0].author}</span>
                <span>{JOURNAL_ARTICLES[0].time}</span>
              </div>
            </div>
            <div className="md:w-1/2 relative overflow-hidden h-[300px] md:h-full bg-[#05050A] w-full">
              <div className="absolute inset-0 opacity-40 mix-blend-screen transition-transform duration-1000 ease-out group-hover:scale-105" style={{  }} />
              <div className="absolute inset-0 flex items-center justify-center"><BookOpen className="w-32 h-32 text-white/10 transition-transform duration-700 group-hover:rotate-12" /></div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="flex gap-4 mb-12 border-b border-white/10 pb-6 overflow-x-auto font-secondary w-full custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full border text-[12px] md:text-[13px] tracking-[0.3em] uppercase shrink-0 transition-colors ${activeTab === tab ? 'border-white text-white' : 'border-white/10 text-white/50 hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </FadeUp>

        <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-32">
          {filteredArticles.length > 0 ? filteredArticles.map((article, i) => (
            <StaggerItem key={i}>
              <div onClick={() => navigate('article/' + article.id)} className="border border-white/10 rounded-[24px] p-8 h-[380px] flex flex-col hover:-translate-y-2 transition-transform cursor-pointer group shadow-xl w-full" style={{ backgroundColor: palette.panel }}>
                <div className="t-label mb-6" style={{ color: palette[article.type] || palette.primary }}>{article.tag}</div>
                <h4 className="t-subtitle text-white mb-6 group-hover:text-white/80 transition-colors leading-snug font-primary">{article.title}</h4>
                <p className="t-body text-white/50 line-clamp-3 mb-8">{article.excerpt}</p>
                <div className="mt-auto flex justify-between items-center text-[17px] md:text-[19px] text-white/40 font-secondary pt-6 border-t border-white/5">
                  <span>{article.time}</span>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all">
                    <ArrowRight className="w-3 h-3 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </StaggerItem>
          )) : (
            <div className="col-span-full py-12 text-center text-white/40 font-secondary">
              No articles found in this category.
            </div>
          )}
        </StaggerGroup>

        {/* Newsletter CTA */}
        <FadeUp className="border border-white/10 rounded-[32px] p-12 md:p-16 flex flex-col md:flex-row gap-12 items-center w-full" >
          <div className="md:w-1/2">
            <h3 className="text-xl md:text-2xl font-light mb-4 font-primary text-white">Get insights in your inbox.</h3>
            <p className="text-white/50 font-secondary text-xl md:text-2xl leading-relaxed max-w-lg">Join innovators receiving our monthly digest on brand strategy, SciArt philosophy, and design thinking.</p>
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
  const { JOURNAL_ARTICLES, FAQS } = useContext(GlobalContext);
  const article = JOURNAL_ARTICLES.find(a => a.id === articleId) || JOURNAL_ARTICLES[0];
  const artColor = palette[article.type] || palette.primary;

  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left">
        <button onClick={() => navigate('journal')} className="text-white/40 hover:text-white text-[17px] md:text-[19px] transition-colors flex items-center gap-2 group mb-16 font-secondary"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Journal</button>

        <FadeUp className="w-full max-w-4xl mx-auto">
          <div className="text-[17px] md:text-[19px] tracking-widest uppercase mb-6 font-primary font-medium" style={{ color: artColor }}>{article.tag}</div>
          <h1 className="text-xl md:text-2xl md:text-5xl md:text-5xl md:text-7xl lg:text-8xl lg:text-8xl font-light tracking-tight mb-8 font-primary leading-tight">{article.title}</h1>
          <div className="flex items-center gap-6 text-white/40 font-secondary text-[17px] md:text-[19px] mb-16 pb-8 border-b border-white/10">
            <span>By {article.author}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{article.date}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{article.time}</span>
          </div>
        </FadeUp>

        <FadeUp delay={0.1} className="w-full h-[300px] md:h-[400px] rounded-[24px] mb-16 overflow-hidden relative border border-white/5 max-w-5xl mx-auto" style={{ backgroundColor: palette.panel }}>
          <div className="absolute inset-0 opacity-30 mix-blend-screen" style={{  }} />
          <div className="absolute inset-0 flex items-center justify-center"><BookOpen className="w-24 h-24 text-white/5" /></div>
        </FadeUp>

        <StaggerGroup className="space-y-8 text-xl md:text-2xl font-light text-white/70 font-secondary leading-relaxed mb-32 max-w-3xl mx-auto w-full">
          <StaggerItem><p className="text-xl md:text-2xl text-white font-medium mb-10 leading-snug">{article.excerpt}</p></StaggerItem>
          <StaggerItem>
            <p>This is a placeholder for the rich text content of the article. In a fully implemented CMS, this section would parse Markdown or HTML blocks representing the body of the perspective.</p>
          </StaggerItem>
          <StaggerItem>
            <h3 className="text-xl md:text-2xl font-primary text-white mt-12 mb-6">The Strategic Imperative</h3>
            <p>Every brand faces a moment where aesthetics alone are no longer enough to carry the narrative. This is where the structural integrity of science—the underlying logic of your product—must marry the emotional resonance of art.</p>
          </StaggerItem>
          <StaggerItem>
            <div className="p-8 border-l-4 border-white/20 bg-white/5 rounded-r-[16px] my-10 italic text-white">
              "Design without direction is just decoration. The truest form of innovation is making complex things feel inevitable."
            </div>
          </StaggerItem>
          <StaggerItem>
            <p>As we continue to co-create with breakthrough innovators, the methodology remains the same: uncover the root cause, map the correct ecosystem, and execute with relentless precision.</p>
          </StaggerItem>
        </StaggerGroup>

        <div className="border-t border-white/10 pt-16 mt-16 w-full">
          <h3 className="text-xl md:text-2xl font-light mb-8 font-primary text-center">More from the Journal</h3>
          <div className="grid sm:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
            {JOURNAL_ARTICLES.filter(a => a.id !== article.id).slice(0, 2).map((a, i) => (
              <div key={i} onClick={() => navigate('article/' + a.id)} className="border border-white/10 rounded-[16px] p-6 flex flex-col hover:-translate-y-1 transition-transform cursor-pointer group w-full" style={{ backgroundColor: palette.panel }}>
                <div className="text-[17px] md:text-[19px] tracking-widest uppercase mb-4 font-primary" style={{ color: palette[a.type] || palette.primary }}>{a.tag}</div>
                <h4 className="text-xl md:text-2xl font-medium text-white mb-6 font-primary group-hover:text-white/80">{a.title}</h4>
                <div className="mt-auto flex justify-between items-center text-[17px] md:text-[19px] text-white/40 font-secondary">
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
  const { SITE_SETTINGS, FAQS } = useContext(GlobalContext);
  const finalSettings = SITE_SETTINGS || {};
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const subject = `New Client Inquiry: ${formData.name}`;
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; background-color: #f9fafb; padding: 40px 20px;">
        
        <div style="background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <div style="background-color: #0A103D; padding: 25px 30px;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 500; letter-spacing: 0.5px;">New Client Inquiry</h2>
          </div>

          <!-- Body -->
          <div style="padding: 30px;">
            
            <!-- Contact Info -->
            <div style="margin-bottom: 30px;">
              <p style="margin: 0 0 10px 0; font-size: 14px;">
                <span style="color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: inline-block; width: 60px;">Name:</span> 
                <strong style="color: #111827; font-size: 16px;">${formData.name}</strong>
              </p>
              <p style="margin: 0; font-size: 14px;">
                <span style="color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: inline-block; width: 60px;">Email:</span> 
                <a href="mailto:${formData.email}" style="color: #6865FA; text-decoration: none; font-size: 16px;">${formData.email}</a>
              </p>
            </div>

            <!-- Message Box -->
            <div>
              <p style="color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; font-size: 13px; margin: 0 0 10px 0;">Message</p>
              <div style="background-color: #f8fafc; border-left: 3px solid #6865FA; padding: 20px; border-radius: 0 6px 6px 0;">
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${formData.message}</p>
              </div>
            </div>

          </div>
          
          <!-- Footer -->
          <div style="background-color: #f3f4f6; padding: 15px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 13px; color: #6b7280;">Reply directly to this email to respond to ${formData.name}.</p>
          </div>

        </div>
      </div>
    `;

    // 2. Client auto-responder email
    const clientSubject = `We've received your message | PurpleBlue House`;
    const clientHtmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <!-- Header -->
        <div style="text-align: center; padding: 40px 0 30px 0;">
          <h1 style="color: #6865FA; font-weight: 300; letter-spacing: -0.5px; margin: 0; font-size: 24px;">PurpleBlue House</h1>
        </div>

        <!-- Body -->
        <div style="background: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #eaeaea;">
          <p style="font-size: 16px; margin-top: 0;">Hi ${formData.name},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a;">
            Thank you for reaching out to PurpleBlue House.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a;">
            Our team is reviewing the details you shared, and we will get back to you shortly.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a;">
            For your reference, here is a copy of your message:
          </p>
          
          <div style="margin: 35px 0; padding-top: 25px; border-top: 1px solid #f0f0f0;">
            <div style="background: #fafafa; padding: 20px; border-radius: 6px; border-left: 3px solid #6865FA;">
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #333; white-space: pre-wrap; font-style: italic;">"${formData.message}"</p>
            </div>
          </div>
          
          <p style="font-size: 16px; color: #4a4a4a; margin-bottom: 0;">
            <strong style="color: #1a1a1a;">The PurpleBlue House Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 30px 0; color: #999; font-size: 12px;">
          <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} PurpleBlue House. All rights reserved.</p>
          <p style="margin: 0;">
            <a href="https://purplebluehouse.com" style="color: #6865FA; text-decoration: none;">purplebluehouse.com</a>
          </p>
        </div>
      </div>
    `;

    // Fire emails + Supabase save in parallel so no data is lost
    const saveInquiryPromise = fetch('/api/save-contact-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formData.name, email: formData.email, message: formData.message })
    }).then(r => r.json()).catch(err => ({ success: false, error: err.message }));

    const [result, clientResult, saveResult] = await Promise.all([
      sendEmailViaResend(subject, htmlContent), // Internal notification
      sendEmailViaResend(clientSubject, clientHtmlContent, [], formData.email), // To the client
      saveInquiryPromise
    ]);

    setIsSubmitting(false);

    if (!saveResult.success) {
      console.warn("Failed to save inquiry to Supabase:", saveResult.error);
    }

    if (result.success) {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(null), 5000);
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full text-left">
        <button onClick={() => navigate('home')} className="pointer-events-auto flex items-center w-fit gap-2 text-[17px] md:text-[19px] backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white mb-12 group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {SITE_SETTINGS?.backToHomeLabel || "Back to Home"}</button>

        {/* Section 1: Hero */}
        <FadeUp>
          <h1 className="text-5xl md:text-5xl md:text-7xl lg:text-8xl font-light mb-6 tracking-tight font-primary">{finalSettings.forms?.contactFormTitle || 'Start with a conversation.'} <br /><AnimatedItalic className="text-white/50">{finalSettings.forms?.contactFormTitleItalic || 'Or start with clarity.'}</AnimatedItalic></h1>
          <p className="text-white/50 mb-20 text-xl font-light font-secondary max-w-2xl">{finalSettings.forms?.contactFormText || 'Have a project in mind? Choose how you want to begin your journey with PurpleBlue House.'}</p>
        </FadeUp>

        {/* Section 2: Contact Options */}
        <FadeUp className="grid md:grid-cols-2 gap-8 mb-24 w-full">
          <div className="border border-white/10 rounded-[24px] p-10 flex flex-col justify-between w-full" style={{ backgroundColor: palette.panel }}>
            <div>
              <h3 className="text-xl md:text-2xl font-light mb-4 font-primary">{finalSettings.forms?.directContactTitle || 'I know what I need.'}</h3>
              <p className="text-white/50 font-light mb-8 font-secondary max-w-md">{finalSettings.forms?.directContactText || 'Skip the discovery flow and send us a direct message outlining your requirements.'}</p>
            </div>
            <form className="space-y-4 text-left w-full font-secondary" onSubmit={handleSubmit}>
              <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder={finalSettings.forms?.namePlaceholder || "Your Name"} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none transition-colors focus:border-white/30" />
              <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder={finalSettings.forms?.emailPlaceholder || "Work Email"} className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none transition-colors focus:border-white/30" />
              <textarea required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder={finalSettings.forms?.messagePlaceholder || "Tell us about your project..."} rows="4" className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-5 py-4 text-white focus:outline-none transition-colors focus:border-white/30 resize-none custom-scrollbar" />

              {status === 'success' && <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-[12px] text-[17px] md:text-[19px]">{finalSettings.forms?.successMessage || "Message sent successfully! We'll be in touch soon."}</div>}
              {status === 'error' && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-[12px] text-[17px] md:text-[19px]">{finalSettings.forms?.errorMessage || "Failed to send message. Please try again."}</div>}

              <PremiumButton type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : (finalSettings.forms?.submitButtonText || 'Send Message')}
              </PremiumButton>
            </form>
          </div>
          <div className="border rounded-[24px] p-10 flex flex-col justify-center text-center items-center relative overflow-hidden w-full" style={{ background: `linear-gradient(to bottom right, ${hexToRgba(palette.primary, 0.1)}, transparent)`, borderColor: hexToRgba(palette.primary, 0.2) }}>
            <div className="w-16 h-16 rounded-[16px] flex items-center justify-center mb-6" style={{ backgroundColor: hexToRgba(palette.primary, 0.2), color: palette.primary }}><Fingerprint className="w-8 h-8" /></div>
            <h3 className="text-xl md:text-2xl font-light mb-4 text-white font-primary">{finalSettings.forms?.scopeTitle || 'I need help defining the scope.'}</h3>
            <p className="text-white/70 font-light mb-8 max-w-sm font-secondary">{finalSettings.forms?.scopeText || 'Use our strategic tool to map your exact deliverables before the first call.'}</p>
            <PremiumButton onClick={() => navigate('assessment')} className="w-full font-secondary">{finalSettings.navigation?.navCtaDesktop || 'Build My Brand Scope'}</PremiumButton>
          </div>
        </FadeUp>

        {/* Section 3 & 4: Direct Info & Map */}
        <FadeUp className="grid md:grid-cols-2 gap-8 mb-24 h-[400px] w-full">
          <div className="border border-white/10 rounded-[24px] p-10 flex flex-col justify-center w-full" style={{ backgroundColor: palette.panel }}>
            <h3 className="text-xl md:text-2xl font-light mb-8 font-primary">{finalSettings.forms?.directContactSectionTitle || 'Direct Contact'}</h3>
            <div className="space-y-6 font-secondary">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Mail className="w-4 h-4 text-white/70" /></div>
                <div>
                  <p className="text-[17px] md:text-[19px] text-white/40 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-xl md:text-2xl text-white">{SITE_SETTINGS?.contactEmail || 'hello@purplebluehouse.com'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Phone className="w-4 h-4 text-white/70" /></div>
                <div>
                  <p className="text-[17px] md:text-[19px] text-white/40 uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-xl md:text-2xl text-white">{SITE_SETTINGS?.contactPhone || '+91 (123) 456-7890'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-white/70" /></div>
                <div>
                  <p className="text-[17px] md:text-[19px] text-white/40 uppercase tracking-widest mb-1">Global HQ</p>
                  <p className="text-xl md:text-2xl text-white">{SITE_SETTINGS?.contactAddress || 'Nehru Place, Delhi, IN'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[24px] overflow-hidden border border-white/10 relative shadow-2xl h-full w-full bg-[#05050A]">
            <LeafletMap />
          </div>
        </FadeUp>

        {/* Section 5: What Happens Next */}
        <div className="mb-24 w-full">
          <FadeUp><h3 className="text-xl md:text-2xl font-light mb-12 font-primary text-center">What happens next?</h3></FadeUp>
          <StaggerGroup className="grid md:grid-cols-3 gap-6 w-full">
            {[
              { num: "01", title: "Review", desc: "Our strategy team reviews your message or Scope Blueprint within 24 hours.", icon: <CheckSquare /> },
              { num: "02", title: "Alignment Call", desc: "We schedule a 30-minute discovery session to ensure mutual fit and understanding.", icon: <Phone /> },
              { num: "03", title: "Custom Proposal", desc: "You receive a detailed roadmap, timeline, and resource allocation plan.", icon: <FileText /> }
            ].map((step, idx) => (
              <StaggerItem key={idx}>
                <div className="border border-white/5 bg-white/[0.02] rounded-[16px] p-8 text-center relative overflow-hidden group h-full w-full">
                  <div className="absolute top-0 right-0 p-4 text-5xl md:text-5xl md:text-7xl lg:text-8xl lg:text-8xl font-primary italic text-white/5 group-hover:text-white/10 transition-colors">{step.num}</div>
                  <div className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center bg-white/5 relative z-10" style={{ color: palette.primary }}>{step.icon}</div>
                  <h4 className="text-xl font-medium text-white mb-3 font-primary relative z-10">{step.title}</h4>
                  <p className="text-white/50 font-secondary text-[17px] md:text-[19px] leading-relaxed relative z-10 max-w-sm mx-auto">{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        {/* Section 6: FAQ */}
        <div className="w-full border-t border-white/10 pt-16">
          <FadeUp><h3 className="text-xl md:text-2xl font-light mb-8 font-primary text-center">Frequently Asked Questions</h3></FadeUp>
          <StaggerGroup className="space-y-4 font-secondary max-w-4xl mx-auto w-full">
            {FAQS.map((faq, i) => (
              <StaggerItem key={i}>
                <div className="p-6 border border-white/10 rounded-[12px] bg-white/[0.01] w-full">
                  <h4 className="font-medium text-white mb-2">{faq.question}</h4>
                  <p className="text-[17px] md:text-[19px] text-white/50">{faq.answer}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

      </div>
    </div>
  )
};

const AdminDashboard = ({ navigate }) => {
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-32 pb-24 w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full px-[3%]">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-xl md:text-2xl font-light mb-2 font-primary">Lead Intelligence Dashboard</h1>
            <p className="text-white/40 text-[17px] md:text-[19px] font-secondary">Brand discoveries captured via Brand Scope Builder.</p>
          </div>
          <PremiumButton variant="ghost" onClick={() => navigate('home')} className="px-0 font-secondary">Exit System <ArrowRight className="w-4 h-4 ml-2" /></PremiumButton>
        </div>
        <div className="border border-white/10 rounded-[16px] overflow-hidden" style={{ backgroundColor: palette.panel }}>
          <div className="overflow-x-auto font-secondary">
            <table className="w-full text-left text-[17px] md:text-[19px]">
              <thead className="bg-white/[0.02] border-b border-white/10 text-white/40 uppercase tracking-widest text-[17px] md:text-[19px]">
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
                  <tr><td colSpan="6" className="p-12 text-center text-white/30 italic">No leads captured yet. Run the discovery flow to see data.</td></tr>
                ) : (
                  GLOBAL_LEADS.map((lead, i) => (
                    <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="p-6"><div className="font-medium text-white mb-1">{lead.company}</div><div className="text-[17px] md:text-[19px] text-white/50 flex items-center gap-2"><User className="w-3 h-3" /> {lead.name}</div></td>
                      <td className="p-6 text-white/70 font-light">{lead.stage}</td>
                      <td className="p-6"><span className="px-3 py-1 rounded-full text-[17px] md:text-[19px] border" style={{ backgroundColor: hexToRgba(palette.primary, 0.1), color: palette.primary, borderColor: hexToRgba(palette.primary, 0.2) }}>{lead.clusters[0]}</span></td>
                      <td className="p-6 text-[17px] md:text-[19px] text-white/60 font-light">{lead.routes.join(', ')}</td>
                      <td className="p-6 text-center"><span className={`font-secondary ${lead.score > 80 ? 'text-green-400' : 'text-yellow-400'}`}>{lead.score}</span></td>
                      <td className="p-6"><span className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-[17px] md:text-[19px] uppercase tracking-widest border border-white/10">New</span></td>
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

const LatestCredentialsPage = ({ navigate }) => {
  const { CASE_STUDIES } = useContext(GlobalContext);
  
  return (
    <div className="min-h-screen text-[#F4F4F5] pt-40 pb-32 px-[3%] w-full" style={{ backgroundColor: palette.bgDeep }}>
      <div className="w-full max-w-5xl mx-auto text-left">
        <FadeUp>
          <div className="w-16 h-16 border border-white/10 rounded-[16px] flex items-center justify-center mb-8 bg-white/5"><Fingerprint className="w-8 h-8 text-white" /></div>
          <h1 className="text-xl md:text-2xl md:text-5xl md:text-5xl md:text-7xl lg:text-8xl lg:text-8xl font-light tracking-tight mb-6 font-primary leading-tight">Credentials & Selected Work.</h1>
          <p className="text-xl text-white/50 font-light mb-16 leading-relaxed font-secondary max-w-2xl">A curated selection of breakthroughs. How we partner with visionary teams to build clear, scalable brand systems.</p>
        </FadeUp>

        <StaggerGroup className="space-y-12">
          {CASE_STUDIES.map((study, i) => (
            <StaggerItem key={study.id}>
              <div data-pbh-copy-ignore onClick={() => navigate('work/' + study.id)} className="group cursor-pointer border border-white/10 rounded-[24px] overflow-hidden flex flex-col md:flex-row bg-[#0A0A10] hover:border-white/20 transition-colors">
                <div className="md:w-1/3 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center">
                  <div className="text-[17px] md:text-[19px] tracking-widest uppercase mb-4 font-primary" style={{ color: palette[study.category] || palette.primary }}>{study.category}</div>
                  <h3 className="text-xl md:text-2xl font-light mb-4 text-white group-hover:text-white/80 transition-colors font-primary">{study.client}</h3>
                  <p className="text-white/50 text-[17px] md:text-[19px] font-secondary font-light line-clamp-3">{study.preview}</p>
                  <div className="mt-8 flex items-center gap-2 text-[17px] md:text-[19px] text-white/40 group-hover:text-white transition-colors font-secondary">View Case Study <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></div>
                </div>
                <div className="md:w-2/3 h-[250px] md:h-[350px] relative overflow-hidden bg-[#05050A]">
                  {(study.bannerVideo || study.fullStory?.heroVideo || study.bannerImage || study.fullStory?.heroImg || study.imageUrl) ? (
                    <CaseStudyMedia src={study.bannerVideo || study.fullStory?.heroVideo || study.bannerImage || study.fullStory?.heroImg || study.imageUrl} alt={study.client} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out" />
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-20 mix-blend-screen transition-transform duration-1000 ease-out group-hover:scale-105" style={{  }} />
                      <div className="absolute inset-0 flex items-center justify-center"><Fingerprint className="w-24 h-24 text-white/5 transition-transform duration-700 group-hover:rotate-12" /></div>
                    </>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <FadeUp delay={0.2} className="mt-32 pt-16 border-t border-white/10 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6 bg-white/5">
            <Mail className="w-5 h-5 text-white/70" />
          </div>
          <h3 className="text-xl md:text-2xl font-light mb-4 font-primary text-white">Ready to start?</h3>
          <p className="text-white/50 font-secondary text-xl md:text-2xl mb-8">You can reach out <a href="mailto:prerita@purplebluehouse.com" className="text-white hover:underline transition-all">prerita@purplebluehouse.com</a></p>
          <button onClick={() => navigate('assessment')} className="px-8 py-4 border border-white/20 rounded-full text-white/80 hover:bg-white hover:text-black transition-colors text-[17px] md:text-[19px] font-medium font-secondary">Build Your Brand Scope</button>
        </FadeUp>
      </div>
    </div>
  );
};

const Footer = ({ navigate }) => {
  const { SITE_SETTINGS } = useContext(GlobalContext);
  return (
    <footer className="border-t border-white/5 pt-20 pb-12 px-[3%] relative z-10 w-full text-left overflow-hidden" style={{ backgroundColor: palette.bgDeep }}>
      {/* Decorative geometric shapes — Flat illustration accent */}
      <div className="absolute top-8 right-[4%] w-[90px] h-[90px] rounded-full border-[3px] opacity-[0.04] pointer-events-none" style={{ borderColor: palette.primary }} />
      <div className="absolute bottom-12 right-[12%] w-[50px] h-[50px] rounded-[12px] border-[3px] opacity-[0.04] pointer-events-none rotate-45" style={{ borderColor: palette.accent }} />
      <div className="absolute top-1/2 left-[2%] w-[40px] h-[40px] rounded-full border-[2px] opacity-[0.03] pointer-events-none" style={{ borderColor: palette.blue }} />
      {/* Subtle hatching texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 12px)', mixBlendMode: 'overlay' }} />
      <div className="relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 mb-16 w-full">
          <div className="md:col-span-2 flex flex-col items-start pr-8">
            <div className="font-primary flex items-center gap-3 text-xl font-medium tracking-wide mb-6 cursor-pointer" onClick={() => navigate('home')}>
              <img src="https://static.wixstatic.com/media/32f09f_d2e483f6417246ba946ed54bbb518bb8~mv2.png" alt="PurpleBlue House" className="h-8 w-auto object-contain shrink-0" />
              {SITE_SETTINGS?.title || "PurpleBlue House"}
            </div>
            <p className="text-white/40 font-light text-[17px] md:text-[19px] leading-relaxed mb-6 font-secondary max-w-sm">{SITE_SETTINGS?.footerTagline || SITE_SETTINGS?.description || "A premium brand, storytelling, and communication studio that understands your brand problem before you even speak to them."}</p>
            <div className="flex gap-4 mb-6">
              {SITE_SETTINGS?.contactEmail && (
                <a href={`mailto:${SITE_SETTINGS.contactEmail}`} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 cursor-pointer transition-all"><Mail className="w-3 h-3" /></a>
              )}
              {SITE_SETTINGS?.contactPhone && (
                <a href={`tel:${SITE_SETTINGS.contactPhone}`} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 cursor-pointer transition-all"><Globe className="w-3 h-3" /></a>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start font-secondary md:col-span-1">
            <h4 className="text-white/80 font-medium mb-6 text-[17px] md:text-[19px]">{SITE_SETTINGS?.navigation?.footerStudioLabel || 'Studio'}</h4>
            <div className="flex flex-col space-y-4 text-white/40 text-[17px] md:text-[19px] font-light">
              <button onClick={() => navigate('home')} className="hover:text-white transition-colors text-left">{SITE_SETTINGS?.navigation?.navHome || 'Home'}</button>
              <button onClick={() => navigate('about')} className="hover:text-white transition-colors text-left">{SITE_SETTINGS?.navigation?.navAbout || 'About Us'}</button>
              <button onClick={() => navigate('method')} className="hover:text-white transition-colors text-left">The PBH Method</button>
              <button onClick={() => navigate('story')} className="hover:text-white transition-colors text-left">Our Story</button>
              <button onClick={() => navigate('team')} className="hover:text-white transition-colors text-left">The Team</button>
              <button onClick={() => navigate('journal')} className="hover:text-white transition-colors text-left">{SITE_SETTINGS?.navigation?.navJournal || 'The Journal'}</button>
            </div>
          </div>
          <div className="flex flex-col items-start font-secondary md:col-span-1">
            <h4 className="text-white/80 font-medium mb-6 text-[17px] md:text-[19px]">{SITE_SETTINGS?.navigation?.footerServicesLabel || 'Services'}</h4>
            <div className="flex flex-col space-y-4 text-white/40 text-[17px] md:text-[19px] font-light">
              <button onClick={() => navigate('services')} className="hover:text-white transition-colors text-left">Overview</button>
              <button onClick={() => navigate('service-detail/bb')} className="hover:text-white transition-colors text-left">Brand Boulevard</button>
              <button onClick={() => navigate('service-detail/sas')} className="hover:text-white transition-colors text-left">SciArt Saga</button>
              <button onClick={() => navigate('service-detail/stc')} className="hover:text-white transition-colors text-left">Storytelling Corner</button>
            </div>
          </div>
          <div className="flex flex-col items-start font-secondary md:col-span-1">
            <h4 className="text-white/80 font-medium mb-6 text-[17px] md:text-[19px]">{SITE_SETTINGS?.navigation?.footerConnectLabel || 'Connect'}</h4>
            <div className="flex flex-col space-y-4 text-white/40 text-[17px] md:text-[19px] font-light">
              <button onClick={() => navigate('contact')} className="hover:text-white transition-colors text-left">{SITE_SETTINGS?.navigation?.navContact || 'Contact Us'}</button>
              <button onClick={() => navigate('assessment')} className="hover:text-white transition-colors text-left">{SITE_SETTINGS?.navigation?.navCtaDesktop || 'Build Brand Scope'}</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[17px] md:text-[19px] sm:text-[17px] md:text-[19px] font-medium text-white/30 uppercase tracking-widest gap-4 font-secondary w-full">
          <p>{SITE_SETTINGS?.footerCopyright || `© ${new Date().getFullYear()} PurpleBlue House. All rights reserved.`}</p>
          <div className="flex gap-6"><span className="cursor-pointer hover:text-white">{SITE_SETTINGS?.navigation?.footerPrivacyPolicy || 'Privacy Policy'}</span><span className="cursor-pointer hover:text-white">{SITE_SETTINGS?.navigation?.footerTerms || 'Terms'}</span></div>
        </div>
      </div>
    </footer>
  )
};

const sortByRef = (array, referenceArray, key = 'id') => {
  if (!array || !referenceArray) return array;
  const orderMap = new Map(referenceArray.map((item, index) => [item[key], index]));
  return [...array].sort((a, b) => {
    const indexA = orderMap.has(a[key]) ? orderMap.get(a[key]) : Infinity;
    const indexB = orderMap.has(b[key]) ? orderMap.get(b[key]) : Infinity;
    return indexA - indexB;
  });
};

const mergeWithFallback = (masterArray, sanityArray, sectionName) => {
  if (!masterArray) return [];

  // Unknown-Entry Detection
  if (process.env.NODE_ENV === 'development' && sanityArray) {
    sanityArray.forEach(sItem => {
      const match = masterArray.find(mItem => mItem.id === sItem.id);
      if (!match) {
        console.warn(`[Parity Audit] Unknown or un-ID'd CMS item in ${sectionName}:`, sItem.id || sItem.name || sItem.title || sItem.question);
      }
    });
  }

  return masterArray.map(masterItem => {
    let sanityItem = (sanityArray || []).find(item => item.id && item.id === masterItem.id);

    // Fuzzy matching fallback
    if (!sanityItem && sanityArray) {
      if (masterItem.name) sanityItem = sanityArray.find(item => item.name === masterItem.name);
      else if (masterItem.title) sanityItem = sanityArray.find(item => item.title === masterItem.title);
      else if (masterItem.question) sanityItem = sanityArray.find(item => item.question === masterItem.question);
    }

    if (!sanityItem) return masterItem;

    const merged = { ...masterItem, ...sanityItem };
    Object.keys(masterItem).forEach(key => {
      const isCoreField = ['id', 'route', 'type', 'order', 'name', 'title', 'question'].includes(key);
      
      if (sanityItem[key] === undefined && !isCoreField) {
        // If Sanity omits the content field, it means the user deleted it in the CMS.
        // We must set it to null so the frontend hides the section, rather than falling back to dummy data.
        merged[key] = null;
      }
    });
    return merged;
  });
};

const assertParity = (masterArray, finalArray, sectionName) => {
  if (process.env.NODE_ENV === 'development') {
    if (masterArray.length !== finalArray.length) {
      console.error(`[Parity Audit] Length mismatch in ${sectionName}. Expected ${masterArray.length}, got ${finalArray.length}`);
    }
    masterArray.forEach((item, index) => {
      if (finalArray[index]?.id !== item.id) {
        console.error(`[Parity Audit] Order/ID mismatch in ${sectionName} at index ${index}. Expected ${item.id}, got ${finalArray[index]?.id}`);
      }
    });
  }
};


const renderHeroHeading = (sanityText, defaultText, animatedRenderer, plainRenderer) => {
  if (!sanityText || sanityText.trim() === defaultText.trim()) {
    return animatedRenderer();
  }
  return plainRenderer(sanityText);
};

// Removed FloatingBackButton component

export default function App() {
  const [routeState, setRouteState] = useState(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (!path) return { page: 'home', data: null };
    
    if (path.startsWith('article/')) return { page: 'article-detail', data: path.split('/')[1] };
    if (path.startsWith('work/') && path !== 'work') return { page: 'work-detail', data: path.split('/')[1] };
    if (path.startsWith('service-detail/')) return { page: 'service-detail', data: path.split('/')[1] };
    
    const validPages = ['home', 'about', 'method', 'story', 'team', 'services', 'work', 'journal', 'contact', 'assessment', 'admin', 'latest'];
    if (validPages.includes(path)) return { page: path, data: null };
    
    return { page: 'home', data: null };
  });
  const [activeServiceModal, setActiveServiceModal] = useState(null);

  const { data: sanityJournal } = useSanity(GET_JOURNAL_ARTICLES);
  const finalJournal = sanityJournal?.length > 0 ? sortByRef(sanityJournal, JOURNAL_ARTICLES) : JOURNAL_ARTICLES;

  const { data: sanityProblems } = useSanity(GET_PROBLEM_DATA);
  const finalProblems = sanityProblems?.length > 0 ? sortByRef(sanityProblems, PROBLEM_DATA, 'title').map(p => ({
    ...p,
    icon: p.iconName === 'MessageSquare' ? <MessageSquare className="w-5 h-5" /> :
      p.iconName === 'Fingerprint' ? <Fingerprint className="w-5 h-5" /> :
        p.iconName === 'Activity' ? <Activity className="w-5 h-5" /> :
          p.iconName === 'Layers' ? <Layers className="w-5 h-5" /> : <Command className="w-5 h-5" />
  })) : PROBLEM_DATA;

  const { data: sanitySettings } = useSanity(GET_SITE_SETTINGS);
  const finalSettings = sanitySettings || {
    homeHeroTitle: "Breakthroughs happen when strategy and execution move as one.",
    homeHeroSubtitle: "PurpleBlue House partners with visionary teams to build clear, scalable brand systems that turn complex innovations into market breakthroughs.",
    servicesHeader: "Three strategic routes.\nOne connected brand system.",
    servicesSubtext: "PBH services are not isolated offerings. They are designed as connected routes that help brands move from clarity to communication to execution.",
    journalHeader: "Thoughts, theories, and unpolished truths.",
    journalSubtext: "Explore our latest essays on brand building, deep-tech storytelling, and the SciArt methodology.",
    footerCTA: "Experience the method yourself."
  };
  useEditableUiCopy(finalSettings?.uiCopy);

  const { data: sanityRoutes } = useSanity(GET_ROUTES_INFO);
  const finalRoutes = sanityRoutes?.length > 0 ? (() => {
    const sortedAcc = {};
    Object.keys(ROUTES_INFO).forEach(key => {
      const r = sanityRoutes.find(sr => sr.id === key);
      if (r) {
        sortedAcc[key] = {
          ...ROUTES_INFO[key],
          ...r,
          icon: r.iconName === 'Fingerprint' ? <Fingerprint className="w-6 h-6" /> :
            r.iconName === 'Lightbulb' ? <Lightbulb className="w-6 h-6" /> : <Rocket className="w-6 h-6" />
        };
      } else {
        sortedAcc[key] = ROUTES_INFO[key];
      }
    });
    sanityRoutes.forEach(r => {
      if (!sortedAcc[r.id]) {
        sortedAcc[r.id] = {
          ...ROUTES_INFO[r.id],
          ...r,
          icon: r.iconName === 'Fingerprint' ? <Fingerprint className="w-6 h-6" /> :
            r.iconName === 'Lightbulb' ? <Lightbulb className="w-6 h-6" /> : <Rocket className="w-6 h-6" />
        };
      }
    });
    return sortedAcc;
  })() : ROUTES_INFO;

  const { data: sanityDeliverables } = useSanity(GET_DELIVERABLES);
  const finalDeliverables = sanityDeliverables?.length > 0 ? sortByRef(sanityDeliverables, DELIVERABLES_MASTER) : DELIVERABLES_MASTER;

  const { data: sanityQuiz } = useSanity(GET_QUIZ_QUESTIONS);
  const finalQuiz = sanityQuiz?.length > 0 ? sortByRef(sanityQuiz, QUIZ_QUESTIONS).map((q, index) => {
    const fallbackQ = QUIZ_QUESTIONS.find(fq => fq.id === q.id || fq.title === q.title) || QUIZ_QUESTIONS[index];
    if (!fallbackQ) return q;
    return {
      ...q,
      multiSelect: q.multiSelect ?? fallbackQ.multiSelect,
      options: fallbackQ.options
    };
  }) : QUIZ_QUESTIONS;

  const { data: sanityCaseStudies } = useSanity(CASE_STUDIES_QUERY);
  const finalCaseStudiesSource = sanityCaseStudies?.length > 0 ? sanityCaseStudies : CASE_STUDIES;
  const finalCaseStudies = finalCaseStudiesSource
    .filter(cs => cs && cs.client && String(cs.client).trim().length > 0)
    .map(cs => {
      const id = normalizeCaseStudyUrlId(cs, CASE_STUDIES);
      const fallbackCaseStudy = CASE_STUDIES.find((item) => (
        item.id === id ||
        String(item.client || '').trim().toLowerCase() === String(cs.client || '').trim().toLowerCase()
      ));
      const tags = normalizeCaseStudyTags(cs.tags);

      return {
        ...cs,
        id,
        tags: tags.length > 0 ? tags : normalizeCaseStudyTags(fallbackCaseStudy?.tags),
      };
    });

  const { data: sanityTeamMembers } = useSanity(GET_TEAM_MEMBERS);
  const finalTeamMembers = mergeWithFallback(TEAM_MEMBERS_MASTER, sanityTeamMembers, "Team");
  assertParity(TEAM_MEMBERS_MASTER, finalTeamMembers, "Team");

  const { data: sanityCoreValues } = useSanity(GET_CORE_VALUES);
  const finalCoreValues = mergeWithFallback(CORE_VALUES_MASTER, sanityCoreValues, "Core Values");
  assertParity(CORE_VALUES_MASTER, finalCoreValues, "Core Values");

  const { data: sanityTimeline } = useSanity(GET_TIMELINE);
  const finalTimeline = mergeWithFallback(TIMELINE_MASTER, sanityTimeline, "Timeline");
  assertParity(TIMELINE_MASTER, finalTimeline, "Timeline");

  const { data: sanityFramework } = useSanity(GET_FRAMEWORK);
  const finalFramework = mergeWithFallback(FRAMEWORK_MASTER, sanityFramework, "Framework");
  assertParity(FRAMEWORK_MASTER, finalFramework, "Framework");

  const { data: sanityFaqs } = useSanity(GET_FAQS);
  const finalFaqs = sanityFaqs?.length > 0 ? sanityFaqs : FAQS_MASTER;

  const globalData = {
    JOURNAL_ARTICLES: finalJournal,
    PROBLEM_DATA: finalProblems,
    SITE_SETTINGS: finalSettings,
    ROUTES_INFO: finalRoutes,
    DELIVERABLES_MASTER: finalDeliverables,
    QUIZ_QUESTIONS: finalQuiz,
    CASE_STUDIES: finalCaseStudies,
    TEAM_MEMBERS: finalTeamMembers,
    CORE_VALUES: finalCoreValues,
    TIMELINE: finalTimeline,
    FRAMEWORK: finalFramework,
    FAQS: finalFaqs
  };

  const navigate = (path, data = null) => {
    let urlPath = path;
    if (path.startsWith('service-modal/')) {
      setActiveServiceModal(path.split('/')[1]);
      return; // Do not push state for modals
    } else if (path.startsWith('service-detail/')) {
      setRouteState({ page: 'service-detail', data: path.split('/')[1] });
      setActiveServiceModal(null);
    } else if (path.startsWith('services/') && path !== 'services') {
      setActiveServiceModal(path.split('/')[1]);
      return; // Do not push state for modals
    } else if (path.startsWith('article/')) {
      setRouteState({ page: 'article-detail', data: path.split('/')[1] });
      setActiveServiceModal(null);
    } else if (path.startsWith('work/') && path !== 'work') {
      setRouteState({ page: 'work-detail', data: path.split('/')[1] });
      setActiveServiceModal(null);
    } else {
      setRouteState({ page: path, data });
      setActiveServiceModal(null);
      if (path === 'home') urlPath = '/';
    }
    
    // Update the browser URL without refreshing so the links are shareable
    if (urlPath !== '/') {
      window.history.pushState({}, '', `/${urlPath}`);
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    let title = "PurpleBlue House | Breakthrough Brand Communication";
    let description = "We co-create breakthrough brands backed by strategic logic and SciArt execution.";

    switch (routeState.page) {
      case 'about':
        title = "About Us | PurpleBlue House";
        description = "Discover our SciArt philosophy, vision, and mission to elevate innovation globally.";
        break;
      case 'method':
        title = "The PBH Method | PurpleBlue House";
        description = "Explore our 4-step strategic framework: Discovery, Diagnosis, Route Mapping, and Scope Building.";
        break;
      case 'story':
        title = "Our Story | PurpleBlue House";
        description = "The journey of PurpleBlue House: Where science meets art to build unbreakable breakthrough brands.";
        break;
      case 'team':
        title = "The Team | PurpleBlue House";
        description = "Meet the innovators, strategists, and artists behind PurpleBlue House.";
        break;
      case 'services':
        title = "Consulting Ecosystems | PurpleBlue House";
        description = "Three strategic routes. One connected brand system. Discover Brand Boulevard, SciArt Saga, and Storytelling Corner.";
        break;
      case 'work':
        title = "Selected Work | PurpleBlue House";
        description = "Case studies and full visual archive proving our thinking across strategy, identity, and campaigns.";
        break;
      case 'work-detail': {
        const cStudy = finalCaseStudies.find(c => c.id === routeState.data);
        title = cStudy?.seoTitle || (cStudy?.client ? `${cStudy.client} | PurpleBlue House Work` : "Case Study | PurpleBlue House");
        description = cStudy?.metaDescription || description;
        break;
      }
      case 'journal':
        title = "The Journal | PurpleBlue House";
        description = "Essays, frameworks, and perspectives on building breakthrough brands that matter.";
        break;
      case 'article-detail': {
        const article = finalJournal.find(a => a.id === routeState.data);
        title = article?.seoTitle || (article?.title ? `${article.title} | PurpleBlue House Journal` : "Journal Article | PurpleBlue House");
        description = article?.metaDescription || description;
        break;
      }
      case 'contact':
        title = "Contact Us | PurpleBlue House";
        description = "Start with a conversation. Or start with clarity. Reach out to the PurpleBlue House team.";
        break;
      case 'assessment':
        title = "Build Your Brand Scope | PurpleBlue House";
        description = "Map your brand gaps and build a strategic scope before the first call.";
        break;
      case 'admin':
        title = "Lead Intelligence | PBH Admin";
        break;
      default:
        break;
    }

    document.title = title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Inject JSON-LD Schema for SEO/AIO/GEO
    let existingSchema = document.getElementById('pbh-schema-markup');
    if (existingSchema) existingSchema.remove();

    if (routeState.page === 'work-detail' || routeState.page === 'article-detail') {
      const dataObj = routeState.page === 'work-detail'
        ? finalCaseStudies.find(c => c.id === routeState.data)
        : finalJournal.find(a => a.id === routeState.data);

      if (dataObj) {
        const faqs = dataObj.pageFaqs || []; // Fallback to empty if not set, preventing generic FAQ pollution
        const schemaObj = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": routeState.page === 'work-detail' ? "ItemPage" : "Article",
              "headline": dataObj.seoTitle || dataObj.title || dataObj.client,
              "description": dataObj.metaDescription || description,
              "keywords": dataObj.focusKeyword || ""
            }
          ]
        };

        // If page-specific FAQs exist, inject FAQ schema
        if (faqs.length > 0) {
          schemaObj["@graph"].push({
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          });
        }

        const script = document.createElement('script');
        script.id = 'pbh-schema-markup';
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schemaObj);
        document.head.appendChild(script);
      }
    }

  }, [routeState.page, routeState.data, finalCaseStudies, finalJournal]);

  return (
    <GlobalContext.Provider value={globalData}>
      <div className="min-h-screen text-[#F4F4F5] w-full selection:text-white font-secondary" style={{ backgroundColor: palette.bgDeep, scrollBehavior: 'smooth', '--tw-selection-color': palette.primary + '4D' }}>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=Space+Grotesk:wght@300..700&display=swap');
        
        body { overflow-x: clip; }

        .font-primary { font-family: ${palette.fonts.primary} !important; }
        .font-secondary { font-family: ${palette.fonts.secondary} !important; }
        
        h1, h2, h3, h4, h5, h6 {
            font-family: ${palette.fonts.primary};
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
        <BrandAura />
        <CustomCursor />
        {routeState.page !== 'admin' && <Header navigate={navigate} current={routeState.page} />}
        {/* Removed FloatingBackButton */}

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
              {routeState.page === 'work-detail' && <WorkDetailPage key="work-detail" navigate={navigate} projectId={routeState.data} />}
              {routeState.page === 'journal' && <JournalPage key="journal" navigate={navigate} />}
              {routeState.page === 'article-detail' && <ArticlePage key="article-detail" navigate={navigate} articleId={routeState.data} />}
              {routeState.page === 'contact' && <ContactPage key="contact" navigate={navigate} />}
              {routeState.page === 'assessment' && <StrategicEngine key="engine" navigate={navigate} />}
              {routeState.page === 'latest' && <LatestCredentialsPage key="latest" navigate={navigate} />}
              {routeState.page === 'admin' && <AdminDashboard key="admin" navigate={navigate} />}
            </AnimatePresence>
          </main>

          {routeState.page !== 'admin' && routeState.page !== 'assessment' && <Footer navigate={navigate} />}
        </div>

        <AnimatePresence>
          {activeServiceModal && <ServiceModal routeId={activeServiceModal} onClose={() => setActiveServiceModal(null)} navigate={navigate} />}
        </AnimatePresence>
      </div>
    </GlobalContext.Provider>
  );
}
