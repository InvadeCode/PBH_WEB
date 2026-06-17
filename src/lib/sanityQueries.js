export const CASE_STUDIES_QUERY = `*[_type == "caseStudy"] | order(orderRank) {
  "id": coalesce(id, _id),
  client,
  sector,
  challenge,
  overview,
  solution,
  route,
  type,
  tags,
  roles,
  results,
  colors,
  order,
  "imageUrl": image.asset->url,
  "bannerImage": bannerImage.asset->url,
  challengeHeading,
  solutionHeading,
  deliverablesHeading,
  "fullStory": {
    "challenge": fullStory.challenge,
    "strategy": fullStory.strategy,
    "execution": fullStory.execution,
    "stats": fullStory.stats,
    "heroImg": fullStory.heroImg.asset->url,
    "images": fullStory.images[].asset->url
  },
  seoTitle,
  metaDescription,
  focusKeyword,
  "pageFaqs": pageFaqs[]->{id, question, answer, category}
}`;

export const GET_JOURNAL_ARTICLES = `*[_type == "journalArticle"] | order(date desc) { id, tag, title, time, type, excerpt, author, date, seoTitle, metaDescription, focusKeyword, "pageFaqs": pageFaqs[]->{id, question, answer, category} }`;

export const GET_PROBLEM_DATA = `*[_type == "problemData"] | order(order asc) { title, type, iconName }`;

export const GET_QUIZ_QUESTIONS = `*[_type == "quizQuestion"] { id, title, options, multiSelect }`;

export const GET_ROUTES_INFO = `*[_type == "routeInfo"] { id, title, desc, iconName, type, bestFor, lineItems }`;

export const GET_DELIVERABLES = `*[_type == "deliverable"] { id, lineItem, name, interdependence }`;

export const GET_SITE_SETTINGS = `*[_type == "siteSettings"][0] { 
  homeHeroTitle, homeHeroSubtitle, servicesHeader, servicesSubtext, journalHeader, journalSubtext, footerCTA, marqueeText,
  contactEmail, contactPhone, contactAddress,
  homeExploreButton, servicesExploreButton, assessmentButton, allProjectsButton, homeSection3Subtitle,
  workPageHeader, workPageSubtext, methodPageHeader, methodPageSubtext, teamPageHeader, teamPageSubtext,
  coreValuesHeader, ourJourneyHeader, frameworkHeader, timelineHeader,
  aboutPage, storyPage, teamPage, methodPage, serviceFaqs, footerTagline, footerCopyright
}`;

export const GET_TEAM_MEMBERS = `*[_type == "teamMember"] | order(order asc) { id, name, role, bio }`;

export const GET_CORE_VALUES = `*[_type == "coreValue"] | order(order asc) { id, title, description }`;

export const GET_TIMELINE = `*[_type == "timelineEvent"] | order(order asc) { id, year, title, description }`;

export const GET_FRAMEWORK = `*[_type == "frameworkStep"] | order(order asc) { id, stepNumber, title, description, outputs }`;

export const GET_FAQS = `*[_type == "faq"] | order(order asc) { id, question, answer, category }`;
