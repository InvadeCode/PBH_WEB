import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export default defineConfig({
  name: 'default',
  title: 'pbh-web',

  projectId: '5nzj8z3i',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) => {
        return S.list()
          .title('Content')
          .items([
            // Add the orderable list for case studies
            orderableDocumentListDeskItem({
              type: 'caseStudy',
              title: 'Case Studies',
              S,
              context,
            }),
            // Add all other document types, filtering out caseStudy so it doesn't appear twice
            ...S.documentTypeListItems().filter(
              (listItem) => !['caseStudy'].includes(listItem.getId() as string)
            ),
          ])
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
