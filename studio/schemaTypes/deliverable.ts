import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'deliverable',
  title: 'Deliverable',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Id',
      type: 'string',
    }),
    defineField({
      name: 'interdependence',
      title: 'Interdependence',
      type: 'string',
    }),
    defineField({
      name: 'lineItem',
      title: 'Line Item',
      type: 'string',
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    })
  ],
})
