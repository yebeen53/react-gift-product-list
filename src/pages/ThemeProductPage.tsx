import { useNavigate, useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import axios from 'axios';
import ProductList from '@/components/ProductList';
import { useThemeProducts } from '@/hooks/useThemeProduct';
import { useThemes } from '@/hooks/useThemes';
import HeroBanner from '@/components/HeroBanner';
import type { Theme } from '@/data/theme';
import theme from '@/data/theme';
import { useEffect } from 'react';

const containerStyle = (theme: Theme) => css`
  max-width: 960px;
  margin: 0 auto;
  padding: ${theme.spacing.spacing4};
`;

const ThemeProductPage = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const numericThemeId = Number(themeId);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchThemes = async () => {
      try {
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          navigate('/');
        }
      }
    };
    fetchThemes();
  }, []);

  const { themes, loading: themeLoading } = useThemes();
  const {
    products,
    loading: productsLoading,
    error,
    hasNextPage,
    fetchNextProduct,
  } = useThemeProducts(themeId ?? '');

  const bannerInfo = themes.find((b) => b.themeId === numericThemeId);
  const isLoading = themeLoading || productsLoading;

  return (
    <div css={containerStyle(theme)}>
      {bannerInfo && (
        <HeroBanner
          info={{
            title: bannerInfo.title ?? bannerInfo.name,
            subtitle: bannerInfo.name,
            description: bannerInfo.description ?? '',
            backgroundColor: bannerInfo.backgroundColor ?? '#333',
            image: bannerInfo.image,
          }}
        />
      )}

      {error && <p>오류 발생: {error}</p>}

      {!isLoading && (
        <ProductList
          products={products}
          hasNextPage={hasNextPage}
          setPage={fetchNextProduct}
          loading={productsLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default ThemeProductPage;
