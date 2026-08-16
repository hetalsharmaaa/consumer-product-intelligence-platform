export const CATEGORY_COLORS = {
  Skincare: { bg: '#e0f2fe', accent: '#0ea5e9' },
  'Hair Care': { bg: '#fdf4ff', accent: '#d946ef' },
  Makeup: { bg: '#ffe4e6', accent: '#f43f5e' },
  'Body Care': { bg: '#ecfdf5', accent: '#10b981' },
  'Sun Care': { bg: '#fef3c7', accent: '#f59e0b' },
  'Lip Care': { bg: '#fce7f3', accent: '#db2777' },
  'Eye Care': { bg: '#e0e7ff', accent: '#6366f1' },
  'Hand Care': { bg: '#f3f4f6', accent: '#6b7280' },
  'Foot Care': { bg: '#fff7ed', accent: '#f97316' },
  'Personal Care': { bg: '#f0fdf4', accent: '#22c55e' },
  "Men's Grooming": { bg: '#1e293b', accent: '#94a3b8' },
  default: { bg: '#f3f4f6', accent: '#6b7280' },
};

export const getCategoryColors = (category) => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
};
