const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface ThemeItem {
  themeId: number;
  name: string;
  image: string;
}

export const fetchThemes = async (): Promise<ThemeItem[]> => {
  const res = await fetch(`${baseUrl}/api/themes`);
  if (!res.ok) throw new Error('테마 API 오류');
  const json = await res.json();

  return Array.isArray(json.data) ? json.data : [];
};
