import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'problemData',
  title: 'Problem Data',
  type: 'document',
  fields: [
    defineField({
      name: 'iconName',
      title: 'Icon Name',
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
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
    })
  ],
})
