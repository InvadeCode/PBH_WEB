import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'lead',
  title: 'Lead',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    defineField({
      name: 'startingPoint',
      title: 'Suggested Starting Point',
      type: 'string',
    }),
    defineField({
      name: 'answers',
      title: 'Diagnostic Answers (JSON)',
      type: 'text',
    }),
    defineField({
      name: 'selectedDeliverables',
      title: 'Selected Deliverables',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
    })
  ],
  preview: {
    select: {
      title: 'company',
      subtitle: 'name',
    }
  }
})
