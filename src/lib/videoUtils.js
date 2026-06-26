export const getSafeEmbedUrl = (url) => {
  if (!url) return url;
  try {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    if (url.includes('instagram.com/')) {
      // Instagram embeds require /embed at the end
      if (!url.includes('/embed')) {
        const baseUrl = url.split('?')[0].replace(/\/+$/, '');
        return `${baseUrl}/embed`;
      }
    }
  } catch (e) {
    return url;
  }
  return url;
};

export const getEmbedThumbnailUrl = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    const pathParts = parsed.pathname.split('/').filter(Boolean);

    if (host === 'youtu.be') {
      const videoId = pathParts[0];
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
    }

    if (host.endsWith('youtube.com')) {
      const videoId = parsed.searchParams.get('v')
        || (pathParts[0] === 'embed' ? pathParts[1] : null)
        || (pathParts[0] === 'shorts' ? pathParts[1] : null);
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
    }

    if (host.endsWith('vimeo.com')) {
      const videoId = pathParts.find(part => /^\d+$/.test(part));
      return videoId ? `https://vumbnail.com/${videoId}.jpg` : null;
    }
  } catch {
    return null;
  }

  return null;
};
