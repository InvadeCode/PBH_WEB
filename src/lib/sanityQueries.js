export const CASE_STUDIES_QUERY = `*[_type == "caseStudy"] | order(coalesce(order, 999999), orderRank, _createdAt) {
  _id,
  _createdAt,
  "cmsId": _id,
  id,
  orderRank,
  client,
  template,
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
  "preVideoImage": preVideoImage.asset->url,
  "preVideoMedia": {
    "mediaType": preVideoMedia.mediaType,
    "imageUrl": preVideoMedia.image.asset->url,
    "videoUrl": preVideoMedia.video.asset->url,
    "alt": preVideoMedia.alt
  },
  "bannerImage": bannerImage.asset->url,
  "worldMapImage": worldMapImage.asset->url,
  "bannerVideo": bannerVideo.asset->url,
  "bannerImageDimensions": bannerImage.asset->metadata.dimensions,
  challengeHeading,
  solutionHeading,
  deliverablesHeading,
  overviewHeading,
  carouselTitle,
  carouselSubtext,
  reachHeading,
  reachSubtext,
  outcomeHeading,
  outcomeText,
  teamCredits,
  "fullStory": {
    "challenge": fullStory.challenge,
    "strategy": fullStory.strategy,
    "execution": fullStory.execution,
    "stats": fullStory.stats,
    "heroImg": fullStory.heroImg.asset->url,
    "heroVideo": fullStory.heroVideo.asset->url,
    "heroImgDimensions": fullStory.heroImg.asset->metadata.dimensions,
    "images": fullStory.images[].asset->url,
    "media": fullStory.images[] {
      _key,
      alt,
      caption,
      "url": asset->url,
      "originalFilename": asset->originalFilename,
      "mimeType": asset->mimeType,
      "extension": asset->extension,
      "metadata": asset->metadata {
        lqip,
        "dimensions": dimensions {
          width,
          height,
          aspectRatio
        }
      }
    },
    "storyChapters": fullStory.storyChapters[] {
      chapterLabel,
      title,
      description,
      "imageUrl": image.asset->url,
      "videoUrl": video.asset->url,
      "image": {
        "url": image.asset->url,
        "mimeType": image.asset->mimeType,
        "extension": image.asset->extension
      },
      "video": {
        "url": video.asset->url
      }
    }
  },
  "videoSection": videoSection {
    orientation,
    videoTitle,
    videoSubtitle,
    videoUrl,
    "thumbnailUrl": thumbnail.asset->url,
    "videoFileUrl": videoFile.asset->url,
    "videos": videos[] {
      videoTitle,
      videoSubtitle,
      "thumbnailUrl": thumbnail.asset->url,
      "videoUrl": videoUrl,
      "videoFileUrl": videoFile.asset->url
    }
  },
  "videoHero": videoHero {
    enabled,
    backgroundColor,
    backgroundText,
    videoTitle,
    videoSubtitle,
    embedUrl,
    "thumbnailUrl": thumbnail.asset->url,
    "uploadedVideoUrl": uploadedVideo.asset->url,
    "videos": videos[] {
      videoTitle,
      videoSubtitle,
      embedUrl,
      "thumbnailUrl": thumbnail.asset->url,
      "uploadedVideoUrl": uploadedVideo.asset->url
    }
  },
  heroTypography,
  seoTitle,
  metaDescription,
  focusKeyword,
  "firefoxSections": firefoxSections[] {
    _key,
    sectionType,
    title,
    body,
    layoutVariant,
    "images": images[] {
      _key,
      alt,
      caption,
      "url": asset->url,
      "metadata": asset->metadata {
        lqip,
        "dimensions": dimensions { width, height, aspectRatio }
      }
    }
  },
  "universeCards": universeCards[] {
    _key,
    title,
    description,
    "imageUrl": image.asset->url
  },
  "pageFaqs": pageFaqs[]->{ id, question, answer, category }
}`;

export const GET_JOURNAL_ARTICLES = `*[_type == "journalArticle"] | order(date desc) { id, tag, title, time, type, excerpt, author, date, seoTitle, metaDescription, focusKeyword, "pageFaqs": pageFaqs[]->{id, question, answer, category} }`;

export const GET_PROBLEM_DATA = `*[_type == "problemData"] | order(order asc) { title, type, iconName }`;

export const GET_QUIZ_QUESTIONS = `*[_type == "quizQuestion"] { id, title, options, multiSelect }`;

export const GET_ROUTES_INFO = `*[_type == "routeInfo"] { id, title, desc, iconName, type, bestFor, lineItems }`;

export const GET_DELIVERABLES = `*[_type == "deliverable"] { id, lineItem, name, interdependence }`;

export const GET_SITE_SETTINGS = `*[_type == "siteSettings"][0] { 
  homeHeroTitle, homeHeroSubtitle, servicesHeader, servicesSubtext, journalHeader, journalSubtext, footerCTA, marqueeText,
  contactEmail, contactPhone, contactAddress,
  homeExploreButton, servicesExploreButton, assessmentButton, allProjectsButton, homeSection3Subtitle, homePage, backToHomeLabel,
  workPageHeader, workPageSubtext, methodPageHeader, methodPageSubtext, teamPageHeader, teamPageSubtext,
  coreValuesHeader, ourJourneyHeader, frameworkHeader, timelineHeader,
  aboutPage, storyPage, teamPage, methodPage, serviceFaqs, footerTagline, footerCopyright,
  csBackToWork, csSeeMoreWork, csAllProjects, csScrollStory, csTheApproach,
  defaultStoryChapters, csCarouselFallbackTitle, csCarouselFallbackSubtitle, csOurRole, csTheProcess, csResults,
  csAboutTheBrand, csTheProblem, csCreativeSolution, csEcosystemHighlights,
  assessmentPage, forms, navigation,
  "clientLogos": clientLogos[] {
    name,
    "src": image.asset->url,
    invert,
    centerCrop
  }
}`;

export const GET_TEAM_MEMBERS = `*[_type == "teamMember"] | order(order asc) { id, name, role, bio }`;

export const GET_CORE_VALUES = `*[_type == "coreValue"] | order(order asc) { id, title, description }`;

export const GET_TIMELINE = `*[_type == "timelineEvent"] | order(order asc) { id, year, title, description }`;

export const GET_FRAMEWORK = `*[_type == "frameworkStep"] | order(order asc) { id, stepNumber, title, description, outputs }`;

export const GET_FAQS = `*[_type == "faq"] | order(order asc) { id, question, answer, category }`;
