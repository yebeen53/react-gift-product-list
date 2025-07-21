import { useEffect, useState } from 'react';
import { apiClient } from '@/api/apiClient';

export interface ThemeBase {
  themeId: number;
  name: string;
  image: string;
}

export interface ThemeDetail {
  themeId: number;
  title: string;
  description: string | null;
  backgroundColor: string;
}

export type ThemeItem = ThemeBase & ThemeDetail;

const fetchThemes = async (): Promise<ThemeBase[]> => {
  const res = await apiClient.get('/api/themes');
  const data = res.data?.data;
  return Array.isArray(data) ? data : [];
};

const fetchThemeDetail = async (
  themeId: number
): Promise<ThemeDetail | null> => {
  try {
    const res = await apiClient.get(`/api/themes/${themeId}/info`);
    return res.data?.data ?? null;
  } catch {
    return null;
  }
};

export const useThemes = () => {
  const [themes, setThemes] = useState<ThemeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseThemes = await fetchThemes();
        const details = await Promise.all(
          baseThemes.map((theme) => fetchThemeDetail(theme.themeId))
        );

        const merged = baseThemes.map((base, index) => {
          const detail = details[index];
          return {
            themeId: base.themeId,
            name: base.name,
            image: base.image,
            title: detail?.title ?? base.name,
            description: detail?.description ?? '',
            backgroundColor: detail?.backgroundColor ?? '#333',
          };
        });

        setThemes(merged);
      } catch (err) {
        console.error('테마 목록 병합 실패:', err);
        setError('테마 데이터를 불러오는 데 실패했어요.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { themes, loading, error };
};
