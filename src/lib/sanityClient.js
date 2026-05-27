import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: '5nzj8z3i',
  dataset: 'production',
  apiVersion: '2024-05-27',
  useCdn: true,
});
