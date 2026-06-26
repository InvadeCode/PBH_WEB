import React from 'react';
import { motion } from 'framer-motion';

const RESPONSIVE_WIDTHS = [480, 768, 1024, 1440, 1920];

export const getMediaUrl = (item) => {
  if (!item) return null;
  if (typeof item === 'string') return item;
  return (
    item.url ||
    item.imageUrl ||
    item.src ||
    item.asset?.url ||
    item.image?.url ||
    item.image?.asset?.url ||
    null
  );
};

const getMediaMimeType = (item) => {
  if (!item || typeof item === 'string') return '';
  return item.mimeType || item.asset?.mimeType || item.image?.mimeType || item.image?.asset?.mimeType || '';
};

const getMediaAlt = (item, fallback = '') => {
  if (!item || typeof item === 'string') return fallback;
  return item.alt || item.altText || item.caption || item.title || fallback;
};

const isGifUrl = (url) => {
  if (!url) return false;
  try {
    return new URL(url, 'https://local.invalid').pathname.toLowerCase().endsWith('.gif');
  } catch {
    return /\.gif(?:$|\?)/i.test(url);
  }
};

export const isGifMedia = (item) => {
  if (item && typeof item === 'object' && item.isGif) return true;
  const mimeType = getMediaMimeType(item).toLowerCase();
  return mimeType === 'image/gif' || isGifUrl(getMediaUrl(item));
};

const isVideoUrl = (url) => {
  if (!url) return false;
  try {
    return /\.(mp4|webm|ogg|mov)(?:$|\?)/i.test(new URL(url, 'https://local.invalid').pathname);
  } catch {
    return /\.(mp4|webm|ogg|mov)(?:$|\?)/i.test(url);
  }
};

export const isVideoMedia = (item) => {
  if (item && typeof item === 'object' && item.isVideo) return true;
  const mimeType = getMediaMimeType(item).toLowerCase();
  if (mimeType.startsWith('video/')) return true;
  return isVideoUrl(getMediaUrl(item));
};

const canResizeUrl = (url, isGif) => {
  if (!url || isGif || /\.svg(?:$|\?)/i.test(url)) return false;
  return /^https?:\/\//i.test(url);
};

const withImageWidth = (url, width) => {
  try {
    const nextUrl = new URL(url);
    nextUrl.searchParams.set('w', String(width));
    nextUrl.searchParams.set('fit', 'max');
    nextUrl.searchParams.set('auto', 'format');
    if (!nextUrl.searchParams.has('q')) nextUrl.searchParams.set('q', '82');
    return nextUrl.toString();
  } catch {
    return null;
  }
};

export const buildResponsiveSrcSet = (url, isGif = false) => {
  if (!canResizeUrl(url, isGif)) return undefined;
  return RESPONSIVE_WIDTHS
    .map((width) => {
      const sizedUrl = withImageWidth(url, width);
      return sizedUrl ? `${sizedUrl} ${width}w` : null;
    })
    .filter(Boolean)
    .join(', ');
};

export const normalizeMediaItems = (items, fallbackAlt = 'Case study media') => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item, index) => {
      const url = getMediaUrl(item);
      if (!url) return null;
      const isGif = isGifMedia(item);
      const isVideo = isVideoMedia(item);
      // If item is an object from storyChapters with both image and video
      const finalUrl = (item && typeof item === 'object' && item.video?.url) ? item.video.url : url;
      const finalIsVideo = (item && typeof item === 'object' && item.video?.url) ? true : isVideo;
      
      return {
        key: (typeof item === 'object' && item?._key) || `${finalUrl}-${index}`,
        source: item,
        url: finalUrl,
        alt: getMediaAlt(item, `${fallbackAlt} ${index + 1}`),
        isGif,
        isVideo: finalIsVideo,
      };
    })
    .filter(Boolean);
};

export const repeatMediaItems = (items, minimumCount) => {
  if (!Array.isArray(items) || items.length === 0) return [];
  const repeated = [...items];
  while (repeated.length < minimumCount) repeated.push(...items);
  return repeated;
};

import { getSafeEmbedUrl } from '../../lib/videoUtils';

const isIframeEmbedUrl = (url) => {
  if (!url) return false;
  return /(youtube\.com|youtu\.be|vimeo\.com|instagram\.com)/i.test(url);
};

const CaseStudyMedia = ({
  item,
  src,
  alt,
  className,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
  motionProps,
  ...props
}) => {
  const media = item || src;
  let url = getMediaUrl(media);
  
  // Handle coalesced objects from Sanity where we have a video and image field
  let isVideo = isVideoMedia(media);
  if (typeof media === 'object' && media?.videoUrl) {
    url = media.videoUrl;
    isVideo = true;
  } else if (typeof media === 'object' && media?.video?.url) {
    url = media.video.url;
    isVideo = true;
  }

  if (!url) return null;

  const isEmbed = isIframeEmbedUrl(url);

  if (isEmbed) {
    const Iframe = motionProps ? motion.iframe : 'iframe';
    const safeUrl = getSafeEmbedUrl(url);
    const iframeProps = {
      src: safeUrl,
      className,
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
      allowFullScreen: true,
      style: { border: 'none' },
      ...props,
      ...(motionProps || {}),
    };
    return <Iframe {...iframeProps} />;
  }

  if (isVideo) {
    const Video = motionProps ? motion.video : 'video';
    const videoProps = {
      src: url,
      className,
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      ...props,
      ...(motionProps || {}),
    };
    return <Video {...videoProps} />;
  }

  const gif = isGifMedia(media);
  const Img = motionProps ? motion.img : 'img';
  const imageProps = {
    src: url,
    alt: alt ?? getMediaAlt(media, ''),
    className,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    fetchPriority: priority ? 'high' : undefined,
    srcSet: buildResponsiveSrcSet(url, gif),
    sizes: gif ? undefined : sizes,
    ...props,
    ...(motionProps || {}),
  };

  return <Img {...imageProps} />;
};

export default CaseStudyMedia;
