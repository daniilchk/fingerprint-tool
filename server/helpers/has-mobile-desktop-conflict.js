export const hasMobileDesktopConflict = (fingerprint) => {
  const isMobileUA = /android|iphone|ipad|ipod|mobile/i.test(fingerprint.user_agent);

  const [width, height] = fingerprint.available_resolution.split('x').map(Number);
  const realWidth = width * fingerprint.pixel_ratio;
  const realHeight = height * fingerprint.pixel_ratio;
  const looksLikeDesktopResolution = realWidth > 1024 && realHeight > 700;

  return isMobileUA && looksLikeDesktopResolution;
};
