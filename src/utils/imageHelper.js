// Helper to resolve images bundled by Vite
const imageModules = import.meta.glob('../assets/images/*', {
  eager: true,
  import: 'default',
});

export function getProductImage(path) {
  if (!path) return '';
  // Extract filename from path e.g. "/src/assets/images/wyze-cam-v4-white.png" -> "wyze-cam-v4-white.png"
  const filename = path.split('/').pop();
  const entry = Object.entries(imageModules).find(([key]) =>
    key.endsWith(`/${filename}`)
  );
  if (entry) {
    return entry[1];
  }
  return path;
}
