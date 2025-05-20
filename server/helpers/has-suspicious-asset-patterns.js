export const hasSuspiciousAssetPatterns = (fingerprint) => {
  const standardMimes = [
    'application/pdf',
    'application/x-shockwave-flash',
    'video/webm',
  ];
  const mimeTypes = Array.isArray(fingerprint.mime_types)
    ? fingerprint.mime_types
    : [];
  const plugins = Array.isArray(fingerprint.plugins)
    ? fingerprint.plugins
    : [];

  const hasAnyStandardMime = mimeTypes.some(mt =>
    standardMimes.includes(mt)
  );
  const missingStandardMimes = !hasAnyStandardMime;

  const noPlugins = plugins.length === 0;

  const hasVlcPlugin = plugins.includes('application/x-vlc-plugin');

  return missingStandardMimes || noPlugins || hasVlcPlugin;
};
