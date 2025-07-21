import { useParams } from 'react-router-dom';
import { css } from '@emotion/react';

import ProductList from '@/components/ProductList';
import { useThemeProducts } from '@/hooks/useThemeProduct';
import { useThemes } from '@/hooks/useThemes';
import HeroBanner from '@/components/HeroBanner';

const containerStyle = css`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
`;

const ThemeProductPage = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const numericThemeId = Number(themeId);

  const { themes, loading: themeLoading } = useThemes();
  const {
    products,
    loading: productsLoading,
    error,
    hasNextPage,
    setCursor,
  } = useThemeProducts(themeId ?? '');

  const bannerInfo = themes.find((b) => b.themeId === numericThemeId);
  const isLoading = themeLoading || productsLoading;

  return (
    <div css={containerStyle}>
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
          setPage={setCursor}
          loading={productsLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default ThemeProductPage;
