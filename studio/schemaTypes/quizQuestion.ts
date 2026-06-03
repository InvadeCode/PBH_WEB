import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'quizQuestion',
  title: 'Quiz Question',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Id',
      type: 'string',
    }),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    })
  ],
})
