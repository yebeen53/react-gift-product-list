
import { css } from '@emotion/react';
import HeroBanner from '@/components/HeroBanner';
import { useThemes } from '@/hooks/useThemes';

const pageStyle = css`
  padding: 24px;
`;

const GiftHomePage = () => {
  const { themes, error } = useThemes();

  return (
    <main css={pageStyle}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>🎁 선물하기 홈</h1>
      {error && <p>{error}</p>}

      {themes.map((theme) => (
        <HeroBanner
          key={theme.themeId}
          info={{
            title: theme.name,
            subtitle: theme.title,
            description: theme.description ?? '',
            backgroundColor: theme.backgroundColor,
          }}
        />
      ))}
    </main>
  );
};

export default GiftHomePage;
