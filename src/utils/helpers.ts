export const getImageUrl = (url: string): string => {
  if (url.startsWith('http')) {
    return url;
  }
  return `https://phimimg.com/${url}`;
};

export const formatYear = (year: number): string => {
  return year.toString();
};

export const formatEpisode = (current: string, total: string): string => {
  if (total === 'Full' || current === 'Full') {
    return 'Full';
  }
  return `${current}/${total}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};
