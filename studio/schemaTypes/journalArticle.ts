import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'journalArticle',
  title: 'Journal Article',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'string',
    }),
    defineField({
      name: 'id',
      title: 'Id',
      type: 'string',
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
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
      description: 'Select 5-8 specific FAQs related to this article. If left blank, the global FAQs will be used.',
      of: [{type: 'reference', to: [{type: 'faq'}]}]
    })
  ],
})
