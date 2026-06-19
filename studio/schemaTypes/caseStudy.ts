import { defineField, defineType } from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "caseStudy" }),
    defineField({
      name: 'challenge',
      title: 'Challenge',
      type: 'string',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'bannerImage',
      title: 'Work Page Banner Image',
      type: 'image',
      description: 'The thumbnail image displayed on the main "Selected Work" grid. If empty, defaults to a colored gradient.',
      options: { hotspot: true }
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
      title: 'Order',
      type: 'number',
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
        defineField({ name: 'heroImg', title: 'Hero Image', type: 'image' }),
        defineField({
          name: 'images',
          title: 'Images',
          type: 'array',
          of: [{ type: 'image' }],
        }),
        defineField({
          name: 'storyChapters',
          title: 'Story Chapters (Narrative Gallery)',
          type: 'array',
          description: 'Used for narrative-driven galleries like Back To Roots.',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'title', title: 'Chapter Title', type: 'string' }),
                defineField({ name: 'description', title: 'Chapter Description', type: 'text' }),
                defineField({ name: 'image', title: 'Chapter Image', type: 'image' })
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
      name: 'videoSection',
      title: 'Video Section (Optional)',
      type: 'object',
      description: 'Optional video section for the case study.',
      fields: [
        defineField({
          name: 'videoUrl',
          title: 'Video Embed URL',
          type: 'url',
          description: 'e.g., YouTube or Vimeo embed URL'
        }),
        defineField({
          name: 'videoFile',
          title: 'Video File',
          type: 'file',
          options: { accept: 'video/*' },
          description: 'Upload a video file (used if URL is not provided)'
        })
      ]
    }),
    defineField({
      name: 'videoHero',
      title: 'Video Hero Section',
      type: 'object',
      description: 'Optional cinematic video hero. Renders nothing unless "Enabled" is on.',
      options: { collapsible: true, collapsed: true },
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
          title: 'Video Title',
          type: 'string',
        }),
        defineField({
          name: 'videoSubtitle',
          title: 'Video Subtitle',
          type: 'string',
        }),
        defineField({
          name: 'thumbnail',
          title: 'Thumbnail',
          type: 'image',
          options: { hotspot: true },
          description: 'Poster image shown inside the circular play button.',
        }),
        defineField({
          name: 'embedUrl',
          title: 'Embed URL',
          type: 'url',
          description: 'YouTube/Vimeo embed URL. Takes priority over an uploaded file.',
        }),
        defineField({
          name: 'uploadedVideo',
          title: 'Uploaded Video',
          type: 'file',
          options: { accept: 'video/*' },
          description: 'Used when no Embed URL is provided.',
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
      name: 'arrivalText',
      title: 'Arrival Text',
      type: 'string',
      description: 'Used in the arrival/footer section of some case studies.'
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
