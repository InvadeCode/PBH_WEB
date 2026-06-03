import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'frameworkStep',
  title: 'Framework Step',
  type: 'document',
  fields: [
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
    defineField({
      name: 'outputs',
      title: 'Outputs',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'stepNumber',
      title: 'Step Number',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    })
  ],
})
