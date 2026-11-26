export function shouldAutoplayHomeVideo(prefersReducedMotion: boolean): boolean {
  if (prefersReducedMotion || !matchMedia('(min-width: 768px)').matches) {
    return false;
  }

  const { connection } = navigator as Navigator & { connection?: { saveData?: boolean } };

  return !connection?.saveData;
}
