import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'home', title: 'Home Page' },
    { name: 'about', title: 'About Us Page' },
    { name: 'story', title: 'Our Story Page' },
    { name: 'team', title: 'Team Page' },
    { name: 'method', title: 'Method Page' },
    { name: 'services', title: 'Services Page' },
    { name: 'journal', title: 'Journal Page' },
    { name: 'work', title: 'Work Page' },
    { name: 'footer', title: 'Footer & Contact' },
    { name: 'caseStudies', title: 'Case Studies UI' },
  ],
  fields: [
    // ── HOME PAGE ──
    defineField({ name: 'homeHeroTitle', title: 'Hero Title', type: 'string', group: 'home' }),
    defineField({ name: 'homeHeroSubtitle', title: 'Hero Subtitle', type: 'text', group: 'home' }),
    defineField({ name: 'homeExploreButton', title: 'Explore Button', type: 'string', group: 'home' }),
    defineField({ name: 'marqueeText', title: 'Marquee Text', type: 'string', group: 'home' }),
    defineField({ name: 'assessmentButton', title: 'Assessment Button', type: 'string', group: 'home' }),
    defineField({ name: 'homeSection3Subtitle', title: 'Section 3 Subtitle (Old vs New Way)', type: 'text', group: 'home' }),
    defineField({
      name: 'homePage',
      title: 'Home Page — Section Copy & Labels',
      type: 'object',
      group: 'home',
      description: 'All remaining editable text on the home page. Leave a field blank to use the built-in default.',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'heroEyebrow', title: 'Hero — Eyebrow Badge', type: 'string' }),
        defineField({ name: 'problemTitle', title: 'Problem Section — Title', type: 'string' }),
        defineField({ name: 'problemTitleItalic', title: 'Problem Section — Title (italic part)', type: 'string' }),
        defineField({ name: 'problemBody', title: 'Problem Section — Body', type: 'text' }),
        defineField({ name: 'modelTitle', title: 'New Model Section — Title', type: 'string' }),
        defineField({ name: 'modelTitleItalic', title: 'New Model Section — Title (italic part)', type: 'string' }),
        defineField({ name: 'oldWayLabel', title: 'Old Way — Label', type: 'string' }),
        defineField({ name: 'pbhWayLabel', title: 'PBH Way — Label', type: 'string' }),
        defineField({ name: 'exploreRouteLabel', title: 'Service Card — Button Label', type: 'string' }),
        defineField({ name: 'howItWorksTitle', title: 'How It Works — Title', type: 'string' }),
        defineField({ name: 'howItWorksTitleItalic', title: 'How It Works — Title (italic part)', type: 'string' }),
        defineField({ name: 'selectedWorkTitle', title: 'Selected Work — Title', type: 'string' }),
        defineField({ name: 'selectedWorkTitleItalic', title: 'Selected Work — Title (italic part)', type: 'string' }),
        defineField({ name: 'selectedWorkCta', title: 'Selected Work — Link Label', type: 'string' }),
        defineField({ name: 'journalTitle', title: 'Journal Section — Title', type: 'string' }),
        defineField({ name: 'journalTitleItalic', title: 'Journal Section — Title (italic part)', type: 'string' }),
        defineField({ name: 'journalCta', title: 'Journal Section — Link Label', type: 'string' }),
        defineField({ name: 'finalCtaEyebrow', title: 'Final CTA — Eyebrow', type: 'string' }),
        defineField({ name: 'finalCtaTitle', title: 'Final CTA — Title', type: 'string' }),
        defineField({ name: 'finalCtaTitleItalic', title: 'Final CTA — Title (italic part)', type: 'string' }),
        defineField({ name: 'finalCtaButton', title: 'Final CTA — Button', type: 'string' }),
      ],
    }),
    defineField({ name: 'backToHomeLabel', title: 'Back-to-Home Button Label (all pages)', type: 'string', group: 'footer' }),
    // ── ABOUT US PAGE ──
    defineField({
      name: 'aboutPage',
      title: 'About Us Page Content',
      type: 'object',
      group: 'about',
      fields: [
        defineField({ name: 'pageLabel', title: 'Page Label', type: 'string' }),
        defineField({ name: 'heroTitle', title: 'Hero Title', type: 'text' }),
        defineField({ name: 'visionLabel', title: 'Vision Label', type: 'string' }),
        defineField({ name: 'visionText', title: 'Vision Text', type: 'text' }),
        defineField({ name: 'missionLabel', title: 'Mission Label', type: 'string' }),
        defineField({ name: 'missionText', title: 'Mission Text', type: 'text' }),
        defineField({ name: 'purposeLabel', title: 'Purpose Label', type: 'string' }),
        defineField({ name: 'purposeText', title: 'Purpose Text', type: 'text' }),
        defineField({ name: 'philosophyLabel', title: 'Philosophy Label', type: 'string' }),
        defineField({ name: 'philosophyTitle', title: 'Philosophy Title', type: 'string' }),
        defineField({ name: 'philosophyText', title: 'Philosophy Text', type: 'text' }),
        defineField({ name: 'globalTitle', title: 'Global Section Title', type: 'text' }),
        defineField({ name: 'globalText', title: 'Global Section Text', type: 'text' }),
        defineField({ name: 'ctaButton', title: 'CTA Button Text', type: 'string' }),
      ],
    }),

    // ── OUR STORY PAGE ──
    defineField({
      name: 'storyPage',
      title: 'Our Story Page Content',
      type: 'object',
      group: 'story',
      fields: [
        defineField({ name: 'pageLabel', title: 'Page Label', type: 'string' }),
        defineField({ name: 'heroTitle', title: 'Hero Title', type: 'string' }),
        defineField({ name: 'sparkPara1', title: 'Spark Paragraph 1 (lead)', type: 'text' }),
        defineField({ name: 'sparkPara2', title: 'Spark Paragraph 2', type: 'text' }),
        defineField({ name: 'sparkPara3', title: 'Spark Paragraph 3', type: 'text' }),
        defineField({ name: 'sparkPara4', title: 'Spark Paragraph 4', type: 'text' }),
        defineField({ name: 'nameSectionTitle', title: 'Name Section Title', type: 'string' }),
        defineField({ name: 'purpleDesc', title: 'Purple Description', type: 'text' }),
        defineField({ name: 'blueDesc', title: 'Blue Description', type: 'text' }),
        defineField({ name: 'houseDesc', title: 'House Description', type: 'text' }),
        defineField({ name: 'lookingAheadTitle', title: 'Looking Ahead Title', type: 'string' }),
        defineField({ name: 'lookingAheadText', title: 'Looking Ahead Text', type: 'text' }),
        defineField({ name: 'ctaButton', title: 'CTA Button Text', type: 'string' }),
      ],
    }),

    // ── TEAM PAGE ──
    defineField({
      name: 'teamPage',
      title: 'Team Page Content',
      type: 'object',
      group: 'team',
      fields: [
        defineField({ name: 'pageLabel', title: 'Page Label', type: 'string' }),
        defineField({ name: 'heroTitle', title: 'Hero Title', type: 'string' }),
        defineField({ name: 'leadershipLabel', title: 'Leadership Section Title', type: 'string' }),
        defineField({ name: 'coreHouseLabel', title: 'Core House Section Title', type: 'string' }),
        defineField({ name: 'cultureTitle', title: 'Culture Section Title', type: 'string' }),
        defineField({
          name: 'cultureItems',
          title: 'Culture Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'string' }),
                defineField({ name: 'description', title: 'Description', type: 'text' }),
              ],
            },
          ],
        }),
        defineField({ name: 'joinTitle', title: 'Join CTA Title', type: 'string' }),
        defineField({ name: 'joinSubtext', title: 'Join CTA Subtext', type: 'string' }),
        defineField({ name: 'joinButton', title: 'Join Button Text', type: 'string' }),
      ],
    }),

    // ── METHOD PAGE ──
    defineField({
      name: 'methodPage',
      title: 'Method Page Content',
      type: 'object',
      group: 'method',
      fields: [
        defineField({ name: 'pageLabel', title: 'Page Label', type: 'string' }),
        defineField({ name: 'heroTitle', title: 'Hero Title', type: 'text' }),
        defineField({
          name: 'traditionalModel',
          title: 'Traditional Model Bullet Points',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({
          name: 'pbhMethod',
          title: 'PBH Method Bullet Points',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({ name: 'appliedSciArtTitle', title: 'Applied SciArt Title', type: 'string' }),
        defineField({ name: 'appliedSciArtText', title: 'Applied SciArt Text', type: 'text' }),
        defineField({
          name: 'timelinePhases',
          title: 'Timeline Phases',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'phase', title: 'Phase', type: 'string' }),
                defineField({ name: 'focus', title: 'Focus', type: 'string' }),
              ],
            },
          ],
        }),
        defineField({ name: 'finalCTA', title: 'Final CTA Text', type: 'string' }),
        defineField({ name: 'ctaButton', title: 'CTA Button Text', type: 'string' }),
      ],
    }),

    // ── SERVICES PAGE ──
    defineField({ name: 'servicesHeader', title: 'Services Header', type: 'text', group: 'services' }),
    defineField({ name: 'servicesSubtext', title: 'Services Subtext', type: 'text', group: 'services' }),
    defineField({ name: 'servicesExploreButton', title: 'Services Explore Button', type: 'string', group: 'services' }),
    defineField({
      name: 'serviceFaqs',
      title: 'Service FAQs',
      type: 'array',
      group: 'services',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string' }),
            defineField({ name: 'answer', title: 'Answer', type: 'text' }),
          ],
        },
      ],
    }),

    // ── JOURNAL PAGE ──
    defineField({ name: 'journalHeader', title: 'Journal Header', type: 'string', group: 'journal' }),
    defineField({ name: 'journalSubtext', title: 'Journal Subtext', type: 'text', group: 'journal' }),

    // ── WORK PAGE ──
    defineField({ name: 'workPageHeader', title: 'Work Page Header', type: 'string', group: 'work' }),
    defineField({ name: 'workPageSubtext', title: 'Work Page Subtext', type: 'text', group: 'work' }),
    defineField({ name: 'allProjectsButton', title: 'All Projects Button', type: 'string', group: 'work' }),

    // ── FOOTER & CONTACT ──
    defineField({ name: 'footerTagline', title: 'Footer Tagline', type: 'text', group: 'footer' }),
    defineField({ name: 'footerCopyright', title: 'Footer Copyright', type: 'string', group: 'footer' }),
    defineField({ name: 'footerCTA', title: 'Footer CTA', type: 'string', group: 'footer' }),
    defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string', group: 'footer' }),
    defineField({ name: 'contactPhone', title: 'Contact Phone', type: 'string', group: 'footer' }),
    defineField({ name: 'contactAddress', title: 'Contact Address', type: 'string', group: 'footer' }),

    // ── CASE STUDIES UI ──
    defineField({ name: 'csBackToWork', title: 'Back to Work Text', type: 'string', group: 'caseStudies' }),
    defineField({ name: 'csSeeMoreWork', title: 'See More Work Text', type: 'string', group: 'caseStudies' }),
    defineField({ name: 'csAllProjects', title: 'All Projects Text', type: 'string', group: 'caseStudies' }),
    defineField({ name: 'csScrollStory', title: 'Scroll Story Text', type: 'string', group: 'caseStudies' }),
    defineField({ name: 'csTheApproach', title: 'The Approach Text', type: 'string', group: 'caseStudies' }),
    
    // Global Fallbacks for Storytelling Chapters
    defineField({ 
      name: 'defaultStoryChapters', 
      title: 'Default Story Chapters (The Seed, The Soil, etc.)', 
      type: 'array', 
      group: 'caseStudies',
      description: 'These will be used automatically as the story text if a case study does not define its own custom story chapters.',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'chapterLabel', title: 'Chapter Label (e.g. "Phase 1", Optional)', type: 'string' }),
          defineField({ name: 'title', title: 'Title (e.g. "The Seed")', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'text' }),
        ]
      }]
    }),
    
    // Global Fallbacks for Case Study Text
    defineField({ name: 'csCarouselFallbackTitle', title: 'Carousel Fallback Title (e.g. "The Unfolding Story")', type: 'string', group: 'caseStudies' }),
    defineField({ name: 'csCarouselFallbackSubtitle', title: 'Carousel Fallback Subtitle (e.g. "Scroll or drag to explore")', type: 'string', group: 'caseStudies' }),
    defineField({ name: 'csOurRole', title: '"Our Role" Label', type: 'string', group: 'caseStudies' }),
    defineField({ name: 'csTheProcess', title: '"The Process" Label', type: 'string', group: 'caseStudies' }),
    defineField({ name: 'csResults', title: '"Results" Label', type: 'string', group: 'caseStudies' }),
    defineField({ name: 'csAboutTheBrand', title: '"About the Brand" Label', type: 'string', group: 'caseStudies' }),
    defineField({ name: 'csTheProblem', title: '"The Problem" Label', type: 'string', group: 'caseStudies' }),
    defineField({ name: 'csCreativeSolution', title: '"Creative Solution" Label', type: 'string', group: 'caseStudies' }),
    defineField({ name: 'csEcosystemHighlights', title: '"Ecosystem Highlights" Label', type: 'string', group: 'caseStudies' }),


    // ── PRESERVED EXISTING FIELDS ──
    defineField({ name: 'coreValuesHeader', title: 'Core Values Header', type: 'string', group: 'about' }),
    defineField({ name: 'frameworkHeader', title: 'Framework Header', type: 'string', group: 'method' }),
    defineField({ name: 'timelineHeader', title: 'Timeline Header', type: 'string', group: 'method' }),
    defineField({ name: 'ourJourneyHeader', title: 'Our Journey Header', type: 'string', group: 'story' }),
    defineField({ name: 'teamPageHeader', title: 'Team Page Header (legacy)', type: 'string', group: 'team' }),
    defineField({ name: 'teamPageSubtext', title: 'Team Page Subtext (legacy)', type: 'string', group: 'team' }),
    defineField({ name: 'methodPageHeader', title: 'Method Page Header (legacy)', type: 'string', group: 'method' }),
    defineField({ name: 'methodPageSubtext', title: 'Method Page Subtext (legacy)', type: 'string', group: 'method' }),
  ],
})
