import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
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
    })
  ],
})
