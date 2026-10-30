export type VideoSource = { src: string; type: string };

const CLOUDINARY_VIDEO = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/)(.+)\.(?:mp4|mov|webm)$/i;

/**
 * Sources for a background video, best first. For a Cloudinary video this is a
 * small VP9 WebM, then a small H.264 *baseline* MP4 (decodes on every phone,
 * tablet and computer, unlike the High-profile / 10-bit / HEVC files that AI
 * generators export), then the original file as the last resort. Any other URL
 * is used as it is. The browser takes the first source it can play and moves to
 * the next one when a source fails.
 */
export function videoSources(url: string): VideoSource[] {
  const match = CLOUDINARY_VIDEO.exec(url);
  if (!match) return [{ src: url, type: 'video/mp4' }];
  const [, base, rest] = match;
  const common = 'w_1280,c_limit,ac_none,fps_30';
  return [
    {
      src: `${base}${common},vc_vp9,q_auto:good/${rest}.webm`,
      type: 'video/webm; codecs="vp9"',
    },
    {
      src: `${base}${common},vc_h264:baseline:3.1,q_auto:good/${rest}.mp4`,
      type: 'video/mp4; codecs="avc1.42E01F"',
    },
    { src: url, type: 'video/mp4' },
  ];
}
