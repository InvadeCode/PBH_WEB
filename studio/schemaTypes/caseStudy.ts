import { defineField, defineType } from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  orderings: [orderRankOrdering],
  preview: {
    select: {
      title: 'client',
      sector: 'sector',
      workPageOrder: 'workPageOrder',
      legacyOrder: 'order',
    },
    prepare({title, sector, workPageOrder, legacyOrder}) {
      const sequence = workPageOrder ?? legacyOrder
      return {
        title,
        subtitle: sequence === undefined ? sector : `Work page #${sequence}${sector ? ` · ${sector}` : ''}`,
      }
    },
  },
  fields: [
    orderRankField({ type: "caseStudy" }),
    defineField({
      name: 'workPageOrder',
      title: 'Work Page Position',
      type: 'number',
      description:
        'Controls the sequence on the Work page. Lower numbers appear first. Leave blank to use the legacy display order and then the draggable Sanity order.',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'challenge',
      title: 'Challenge',
      type: 'text',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'template',
      title: 'Experience Template',
      type: 'string',
      description: 'Choose the visual layout template for this case study. If none is selected, the system will attempt to automatically route based on the client name.',
      options: {
        list: [
          { title: 'Arise Ventures (Modern & Technical)', value: 'arise' },
          { title: 'Sci-Art Saga / Snow Leopard (Abstract & Research)', value: 'snow-leopard' },
          { title: 'Param Innovation (Dark & Technical)', value: 'param' },
          { title: 'Back To Roots (Earthy & Grounded)', value: 'back-to-roots' },
          { title: 'Legacy (Classic PBH Layout)', value: 'legacy' },
          { title: 'Storytelling Corner (Editorial)', value: 'storytelling' }
        ],
      }
    }),
    defineField({
      name: 'bannerImage',
      title: 'Work Page Thumbnail (1600 x 1200 px — 4:3)',
      type: 'image',
      description: 'Thumbnail displayed on the "Our Work" grid. Upload at 1600 × 1200 px (4:3 landscape) for the best fit — the card crops to this ratio. Hotspot lets you control which part of the image stays centred.',
      options: { hotspot: true }
    }),
    defineField({
      name: 'bannerVideo',
      title: 'Work Page Banner Video (Fallback for Image)',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'Upload a video to be used as the banner. If provided, the video will take precedence over the Banner Image.'
    }),
    defineField({
      name: 'worldMapImage',
      title: 'Planetary Swarm Background Map (Sci-Art Saga Template Only)',
      type: 'image',
      description: 'Upload a custom world map or background image for the planetary swarm component. If left blank, it will default to the standard globe map.',
      options: { hotspot: true }
    }),
    defineField({
      name: 'overviewHeading',
      title: 'Overview Heading',
      type: 'string',
      description: 'Defaults to "The Brand" if left blank.'
    }),
    defineField({
      name: 'challengeHeading',
      title: 'Challenge Heading',
      type: 'string',
      description: 'Defaults to "The Challenge" if left blank.'
    }),
    defineField({
      name: 'solutionHeading',
      title: 'Solution Heading',
      type: 'string',
      description: 'Defaults to "The PBH Solution" if left blank.'
    }),
    defineField({
      name: 'deliverablesHeading',
      title: 'Deliverables Heading',
      type: 'string',
      description: 'Defaults to "Core Deliverables" if left blank.'
    }),
    defineField({
      name: 'carouselTitle',
      title: 'Image Gallery Title',
      type: 'string',
      description: 'Title shown above the image carousel on the case study page. Defaults to "The Unfolding Story".'
    }),
    defineField({
      name: 'carouselSubtext',
      title: 'Image Gallery Subtext',
      type: 'string',
      description: 'Subtitle shown below the gallery title. Defaults to "Scroll or drag to explore".'
    }),
    defineField({
      name: 'reachHeading',
      title: 'Interactive Reach Section Heading',
      type: 'string',
      description: 'Optional heading for the Snow Leopard-style interactive map/gallery section. Leave blank to hide the heading.'
    }),
    defineField({
      name: 'reachSubtext',
      title: 'Interactive Reach Section Subtext',
      type: 'string',
      description: 'Optional subtext for the Snow Leopard-style interactive map/gallery section.'
    }),
    defineField({
      name: 'outcomeHeading',
      title: 'Outcome Section Heading',
      type: 'string',
      description: 'Optional heading shown near the end of Snow Leopard-style case studies. Leave blank to hide this section heading.'
    }),
    defineField({
      name: 'outcomeText',
      title: 'Outcome Section Body',
      type: 'text',
      description: 'Optional body copy shown near the end of Snow Leopard-style case studies. Leave blank to hide the outcome copy.'
    }),
    defineField({
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'id',
      title: 'Id',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Legacy Display Order (Fallback)',
      type: 'number',
      description:
        'Older ordering field kept so the current Work page order does not jump. Use Work Page Position for new sequencing changes.',
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'text',
    }),
    defineField({
      name: 'results',
      title: 'Results',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'roles',
      title: 'Roles',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'route',
      title: 'Route',
      type: 'string',
    }),
    defineField({
      name: 'sector',
      title: 'Sector',
      type: 'string',
      description: 'Select the sector this case study belongs to. Choose "Other" if none fit.',
      options: {
        layout: 'dropdown',
        list: [
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
          'Other',
        ],
      },
    }),
    defineField({
      name: 'customSector',
      title: 'Custom Sector',
      type: 'string',
      description: 'Please specify the sector.',
      hidden: ({document}) => document?.sector !== 'Other',
    }),
    defineField({
      name: 'teamCredits',
      title: 'Team Credits',
      type: 'object',
      description:
        'The people who worked on this project. Shown as a credits section at the bottom of the case study. Add as many members as you like — each has an editable Name and Title/Role.',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'The Minds Behind the Magic',
        }),
        defineField({
          name: 'subtext',
          title: 'Subtext (optional)',
          type: 'string',
        }),
        defineField({
          name: 'members',
          title: 'Team Members',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'member',
              title: 'Member',
              fields: [
                {
                  name: 'name',
                  title: 'Name',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {name: 'title', title: 'Title / Role', type: 'string'},
              ],
              preview: {
                select: {title: 'name', subtitle: 'title'},
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'solution',
      title: 'Solution',
      type: 'text',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
    }),
    defineField({
      name: 'fullStory',
      title: 'Full Story',
      type: 'object',
      fields: [
        defineField({ name: 'challenge', title: 'Challenge', type: 'text' }),
        defineField({ name: 'execution', title: 'Execution', type: 'text' }),
        defineField({ name: 'strategy', title: 'Strategy', type: 'text' }),
        defineField({ 
          name: 'heroImg', 
          title: 'Hero Image (2560 x 1440 px)', 
          type: 'image',
          description: 'Spans the top of the case study. Recommended size: 2560 x 1440 px (16:9 Landscape).' 
        }),
        defineField({ 
          name: 'heroVideo', 
          title: 'Hero Video (Fallback for Image)', 
          type: 'file',
          options: { accept: 'video/*' },
          description: 'Spans the top of the case study. If provided, this video takes precedence over the Hero Image.' 
        }),
        defineField({
          name: 'images',
          title: 'Gallery Media (Images, GIFs, Videos)',
          type: 'array',
          description: 'Supports static images, GIFs, and videos. For Masonry Grids (Arise/Leverage): Mix 1200x1200 and 1920x1080. For Carousels (Albatross): Strictly Portrait 1080x1440.',
          of: [
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
                defineField({ name: 'caption', title: 'Caption', type: 'string' }),
              ],
            },
            {
              type: 'file',
              name: 'videoFile',
              title: 'Video File',
              options: { accept: 'video/*' },
              fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
                defineField({ name: 'caption', title: 'Caption', type: 'string' }),
              ],
            }
          ],
        }),
        defineField({
          name: 'storyChapters',
          title: 'Story Chapters (Narrative Gallery)',
          type: 'array',
          description: 'Used for narrative-driven galleries like Back To Roots.',
          of: [
            {
              type: 'object',
              name: 'storyChapter',
              fields: [
                defineField({ name: 'chapterLabel', title: 'Chapter Label (e.g. "Chapter 1", "Phase One")', type: 'string' }),
                defineField({ name: 'title', title: 'Chapter Title', type: 'string' }),
                defineField({ name: 'description', title: 'Chapter Description', type: 'text' }),
                defineField({ 
                  name: 'image', 
                  title: 'Chapter Image', 
                  type: 'image',
                  description: 'Supports both Portrait and Landscape. The UI will automatically adjust to prevent cropping.'
                }),
                defineField({ 
                  name: 'video', 
                  title: 'Chapter Video (Fallback for Image)', 
                  type: 'file',
                  options: { accept: 'video/*' },
                  description: 'If provided, this video takes precedence over the Chapter Image.'
                })
              ]
            }
          ]
        }),
        defineField({
          name: 'stats',
          title: 'Stats',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'statItem',
              fields: [
                defineField({ name: 'label', title: 'Label', type: 'string' }),
                defineField({ name: 'value', title: 'Value', type: 'string' }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'preVideoMedia',
      title: '🖼️ Pre-Video Hero Media (Optional)',
      type: 'object',
      description: 'An optional full-width media block (image, GIF, or video) that sits right above the video section.',
      fields: [
        defineField({
          name: 'mediaType',
          title: 'Media Type',
          type: 'string',
          options: {
            list: [
              { title: 'Image / GIF', value: 'image' },
              { title: 'Video File (MP4/WebM)', value: 'video' },
            ],
            layout: 'radio',
          },
          initialValue: 'image',
        }),
        defineField({
          name: 'image',
          title: 'Image or GIF',
          type: 'image',
          options: { hotspot: true, accept: 'image/*' },
          description: 'Upload a JPG, PNG, WebP, or GIF file.',
          hidden: ({ parent }) => parent?.mediaType === 'video',
        }),
        defineField({
          name: 'video',
          title: 'Video File',
          type: 'file',
          options: { accept: 'video/mp4,video/webm' },
          description: 'Upload an MP4 or WebM video file. It will autoplay muted and loop.',
          hidden: ({ parent }) => parent?.mediaType !== 'video',
        }),
        defineField({
          name: 'alt',
          title: 'Alt Text / Caption (Optional)',
          type: 'string',
        }),
      ],
    }),
    // Keep old field name as hidden alias for backward compat
    defineField({
      name: 'preVideoImage',
      title: 'Pre-Video Image (Legacy)',
      type: 'image',
      options: { hotspot: true },
      hidden: true,
    }),
    defineField({
      name: 'videoSection',
      title: '📽️ Add Simple Video (Square/Rectangle)',
      type: 'object',
      description: 'Use this to add a standard video anywhere in the case study.',
      fields: [
        defineField({
          name: 'videoTitle',
          title: 'Preface Title (Fallback)',
          type: 'string',
          description: 'Optional title for the Kanti-style video preface when the first video has no title.',
        }),
        defineField({
          name: 'videoSubtitle',
          title: 'Preface Subtitle (Fallback)',
          type: 'string',
          description: 'Optional subtitle for the Kanti-style video preface when the first video has no subtitle.',
        }),
        defineField({
          name: 'thumbnail',
          title: 'Preface Thumbnail (Fallback)',
          type: 'image',
          options: { hotspot: true },
          description: 'Optional circular preface image when the first video has no thumbnail.',
        }),
        defineField({
          name: 'videos',
          title: 'Videos',
          type: 'array',
          description: 'Add your videos here. They will appear as circles that expand to fullscreen. 1 video = Centered. 2+ = Side-by-Side.',
          of: [
            {
              type: 'object',
              validation: (Rule) =>
                Rule.custom((value) => {
                  if (!value?.videoUrl && !value?.videoFile) {
                    return 'Add a Video Embed URL or Uploaded Video, or remove this empty video row.'
                  }
                  return true
                }),
              fields: [
                defineField({ name: 'videoTitle', title: 'Video Title', type: 'string' }),
                defineField({ name: 'videoSubtitle', title: 'Video Subtitle', type: 'string' }),
                defineField({ 
                  name: 'thumbnail', 
                  title: 'Thumbnail (Square)', 
                  type: 'image', 
                  options: { hotspot: true }
                }),
                defineField({ name: 'videoUrl', title: 'Video Embed URL', type: 'url' }),
                defineField({ name: 'videoFile', title: 'Uploaded Video', type: 'file', options: { accept: 'video/*' } }),
              ]
            }
          ]
        })
      ]
    }),
    defineField({
      name: 'videoHero',
      title: '🎬 Add Cinematic Fullscreen Video (Premium)',
      type: 'object',
      description: 'Use this for massive screen-spanning videos like Arise Ventures.',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enabled',
          type: 'boolean',
          description: 'If off, this section renders nothing at all (no DOM, no spacing).',
          initialValue: false,
        }),
        defineField({
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          description: 'Hex color for the section background, e.g. #010836.',
        }),
        defineField({
          name: 'backgroundText',
          title: 'Oversized Background Text',
          type: 'string',
          description: 'Large text behind the video (usually the case study name). Defaults to the client name.',
        }),
        defineField({
          name: 'videoTitle',
          title: 'Preface Title (Fallback)',
          type: 'string',
          description: 'Optional title for the Kanti-style video preface when the first video has no title.',
        }),
        defineField({
          name: 'videoSubtitle',
          title: 'Preface Subtitle (Fallback)',
          type: 'string',
          description: 'Optional subtitle for the Kanti-style video preface when the first video has no subtitle.',
        }),
        defineField({
          name: 'thumbnail',
          title: 'Preface Thumbnail (Fallback)',
          type: 'image',
          options: { hotspot: true },
          description: 'Optional circular preface image when the first video has no thumbnail.',
        }),
        defineField({
          name: 'videos',
          title: 'Videos',
          type: 'array',
          description: 'Add your videos here. 1 video = Centered. 2+ videos = Side-by-Side.',
          of: [
            {
              type: 'object',
              validation: (Rule) =>
                Rule.custom((value) => {
                  if (!value?.embedUrl && !value?.uploadedVideo) {
                    return 'Add an Embed URL or Uploaded Video, or remove this empty video row.'
                  }
                  return true
                }),
              fields: [
                defineField({ name: 'videoTitle', title: 'Video Title', type: 'string' }),
                defineField({ name: 'videoSubtitle', title: 'Video Subtitle', type: 'string' }),
                defineField({ 
                  name: 'thumbnail', 
                  title: 'Thumbnail (1200 x 1200 px Square)', 
                  type: 'image', 
                  options: { hotspot: true },
                  description: 'Must be exactly Square (1200 x 1200 px).'
                }),
                defineField({ name: 'embedUrl', title: 'Embed URL', type: 'url' }),
                defineField({ name: 'uploadedVideo', title: 'Uploaded Video', type: 'file', options: { accept: 'video/*' } }),
              ]
            }
          ]
        }),
      ],
    }),
    defineField({
      name: 'heroTypography',
      title: 'Hero Typography',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Used for specialized hero sections (e.g. Leverage Edu letters)'
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Format: Primary Keyword + Use Case / Buyer Intent + Location. Max 60 characters.',
      validation: Rule => Rule.max(60).warning('SEO Titles should be under 60 characters for best Google display.')
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'One sentence. No keyword stuffing. Keep it under 155 characters.',
      validation: Rule => Rule.max(155).warning('Meta descriptions should be under 155 characters.')
    }),
    defineField({
      name: 'focusKeyword',
      title: 'Primary Keyword',
      type: 'string',
      description: 'The single phrase this page must rank for.'
    }),
    defineField({
      name: 'firefoxSections',
      title: '🦊 Firefox Editorial Sections (Firefox Only)',
      type: 'array',
      description: 'Optional content blocks for the Firefox case study. Each section has a title, body, images, layout variant, and section type. Only used by the Firefox experience template.',
      of: [
        {
          type: 'object',
          name: 'firefoxSection',
          title: 'Section',
          fields: [
            defineField({ name: 'sectionType', title: 'Section Type', type: 'string', options: { list: ['intro', 'challenge', 'outcome', 'strategy', 'insightMapping', 'themeMapping', 'sciart', 'closing', 'finalOutcome'] } }),
            defineField({ name: 'title', title: 'Section Title', type: 'string' }),
            defineField({ name: 'body', title: 'Section Body', type: 'text' }),
            defineField({ name: 'layoutVariant', title: 'Layout Variant', type: 'string', options: { list: ['text-first', 'visual-first', 'text-left-image-right', 'text-right-image-left', 'full-width-visual'] }, initialValue: 'text-first' }),
            defineField({
              name: 'images',
              title: 'Section Images',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' }), defineField({ name: 'caption', title: 'Caption', type: 'string' })] }]
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'sectionType' } }
        }
      ],
    }),
    defineField({
      name: 'firefoxAssets',
      title: '🦊 Firefox Assets (Strict UI Mapping)',
      type: 'object',
      description: 'Upload exactly the images needed for the Firefox UI layout. Leave empty to fallback to default static assets.',
      fields: [
        defineField({ name: 'imgStrategy', title: 'Strategy / Observation Map (1 Image) [Rec: 16:9, e.g. 1920x1080]', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'imgInsight', title: 'Insight Mapping (1 Image) [Rec: 16:9, e.g. 1920x1080]', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'imgTheme', title: 'Theme Mapping (1 Image) [Rec: 16:9, e.g. 1920x1080]', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'imgStargazerSketch', title: 'Standalone Stargazer Sketch (1 Image) [Rec: 16:9, e.g. 1920x1080]', type: 'image', options: { hotspot: true } }),
        defineField({
          name: 'sketchesGrid',
          title: '4-Image Sketches Masonry Grid (Exactly 4 Images) [Rec: 4:3 or Square, e.g. 1440x1080]',
          type: 'array',
          validation: (Rule) => Rule.max(4),
          of: [{ type: 'image', options: { hotspot: true } }]
        }),
        defineField({
          name: 'dreamerImages',
          title: 'Dreamer World (2 Images: Left & Right) [Rec: 4:3 or Square, e.g. 1440x1080]',
          type: 'array',
          validation: (Rule) => Rule.max(2),
          of: [{ type: 'image', options: { hotspot: true } }]
        }),
        defineField({
          name: 'stargazerImages',
          title: 'Stargazer World (2 Images: Left & Right) [Rec: 4:3 or Square, e.g. 1440x1080]',
          type: 'array',
          validation: (Rule) => Rule.max(2),
          of: [{ type: 'image', options: { hotspot: true } }]
        }),
        defineField({
          name: 'stellarImages',
          title: 'Stellar World (2 Images: Left & Right) [Rec: 4:3 or Square, e.g. 1440x1080]',
          type: 'array',
          validation: (Rule) => Rule.max(2),
          of: [{ type: 'image', options: { hotspot: true } }]
        }),
        defineField({
          name: 'ecosystemImages',
          title: 'Ecosystem (3 Images) [Rec: 4:3 or Square, e.g. 1440x1080]',
          type: 'array',
          validation: (Rule) => Rule.max(3),
          of: [{ type: 'image', options: { hotspot: true } }]
        })
      ]
    }),
    defineField({
      name: 'pageFaqs',
      title: 'Page-Specific FAQs',
      type: 'array',
      description: 'Select 5-8 specific FAQs related to this case study. If left blank, the global FAQs will be used.',
      of: [{type: 'reference', to: [{type: 'faq'}]}]
    })
  ],
  preview: {
    select: {
      title: 'client',
      subtitle: 'challenge',
      media: 'bannerImage'
    }
  }
})
