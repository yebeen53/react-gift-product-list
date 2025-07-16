import { css } from '@emotion/react';
import type { Theme } from '@/data/theme';

interface GiftItemProps {
  id: number;
  brand: string;
  name: string;
  price: number;
  image: string;
  theme: Theme;
  highlight?: boolean;
  rank?: number;
}

const cardStyle = (theme: Theme) => css`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  padding: ${theme.spacing.spacing2};
  text-align: center;
`;

const rankBadge = (theme: Theme, highlight?: boolean) => css`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: ${highlight ? theme.colors.red800 : theme.colors.gray700};
  color: white;
  font-size: 12px;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const imageStyle = (theme: Theme) => css`
  width: 100%;
  height: auto;
  margin-bottom: ${theme.spacing.spacing2};
`;

const brandStyle = (theme: Theme) => css`
  font-size: 12px;
  color: ${theme.colors.semantic.textDefault};
`;

const nameStyle = css`
  font-weight: 500;
  margin-top: 2px;
`;

const priceStyle = css`
  font-weight: bold;
  margin-top: 4px;
`;

const GiftItem = ({
  brand,
  name,
  price,
  image,
  theme,
  rank,
  highlight,
}: GiftItemProps) => {
  return (
    <div css={cardStyle(theme)}>
      {typeof rank === 'number' && (
        <div css={rankBadge(theme, highlight)}>{rank}</div>
      )}
      <img src={image} alt={name} css={imageStyle(theme)} />
      <div css={brandStyle(theme)}>{brand}</div>
      <div css={nameStyle}>{name}</div>
      <div css={priceStyle}>{price.toLocaleString()} 원</div>
    </div>
  );
};

export default GiftItem;
