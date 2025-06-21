

export const getGridColumns = (imageCount: number) => {
    if (imageCount <= 2) return "grid-cols-2";
    if (imageCount <= 6) return "grid-cols-3";
    return "grid-cols-4";
  };