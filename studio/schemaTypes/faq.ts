import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'Faq',
  type: 'document',
  fields: [
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
    })
  ],
})
