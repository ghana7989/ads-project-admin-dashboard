import { VideoSource } from '../types';

export function detectVideoSource(url: string): VideoSource {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return VideoSource.YOUTUBE;
  }
  if (url.includes('vimeo.com')) {
    return VideoSource.VIMEO;
  }
  if (url.includes('facebook.com')) {
    return VideoSource.FACEBOOK;
  }
  if (url.includes('soundcloud.com')) {
    return VideoSource.SOUNDCLOUD;
  }
  if (url.includes('streamable.com')) {
    return VideoSource.STREAMABLE;
  }
  if (url.includes('wistia.com')) {
    return VideoSource.WISTIA;
  }
  if (url.includes('twitch.tv')) {
    return VideoSource.TWITCH;
  }
  if (url.includes('dailymotion.com')) {
    return VideoSource.DAILYMOTION;
  }
  if (url.includes('mixcloud.com')) {
    return VideoSource.MIXCLOUD;
  }
  if (url.includes('vidyard.com')) {
    return VideoSource.VIDYARD;
  }
  if (url.includes('kaltura.com')) {
    return VideoSource.KALTURA;
  }
  if (url.match(/\.(mp4|webm|ogg|m3u8|mpd)$/i)) {
    return VideoSource.FILE;
  }
  return VideoSource.FILE;
}

export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function getYouTubeThumbnail(
  url: string,
  quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'mqdefault'
): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  }
  return null;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function isValidVideoUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
