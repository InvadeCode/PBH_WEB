import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'coreValue',
  title: 'Core Value',
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
      name: 'title',
      title: 'Title',
      type: 'string',
    })
  ],
})
