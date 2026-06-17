import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'routeInfo',
  title: 'Route Info',
  type: 'document',
  fields: [
    defineField({
      name: 'bestFor',
      title: 'Best For',
      type: 'string',
    }),
    defineField({
      name: 'desc',
      title: 'Desc',
      type: 'string',
    }),
    defineField({
      name: 'iconName',
      title: 'Icon Name',
      type: 'string',
    }),
    defineField({
      name: 'id',
      title: 'Id',
      type: 'string',
    }),
    defineField({
      name: 'lineItems',
      title: 'Line Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', type: 'string', title: 'ID' },
            { name: 'name', type: 'string', title: 'Name' }
          ]
        }
      ],
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
