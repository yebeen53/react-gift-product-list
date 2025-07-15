import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import useCustomTheme from '../hooks/useCustomTheme';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@/components/Button';
import GiftItem from '@/components/GiftItem';
import type { Theme } from '@/data/theme';

interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  imageURL: string;
  ranking: number;
}

const tabs = ['전체', '여성이', '남성이', '청소년이'];
const subTabs = ['받고 싶어한', '많이 선물한', '위시로 받은'];

const sectionStyle = (theme: Theme) => css`
  padding: ${theme.spacing.spacing5};
`;

const titleStyle = (theme: Theme) => css`
  font-size: ${theme.typography.title1Bold.fontSize};
  font-weight: ${theme.typography.title1Bold.fontWeight};
  margin-bottom: ${theme.spacing.spacing4};
`;

const tabsStyle = (theme: Theme) => css`
  display: flex;
  gap: ${theme.spacing.spacing2};
  margin-bottom: ${theme.spacing.spacing3};
`;

const subTabContainer = (theme: Theme) => css`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${theme.spacing.spacing4};
  font-size: 14px;
`;

const gridStyle = (theme: Theme) => css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.spacing4};
`;

const moreStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GiftRanking = () => {
  const theme = useCustomTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [visible, setVisible] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const selectedTab = searchParams.get('gender') && tabs.includes(searchParams.get('gender')!)
    ? searchParams.get('gender')!
    : '전체';

  const selectedSubTab = searchParams.get('category') && subTabs.includes(searchParams.get('category')!)
    ? searchParams.get('category')!
    : '받고 싶어한';

  const targetMap: Record<string, string> = {
    전체: 'ALL',
    여성이: 'FEMALE',
    남성이: 'MALE',
    청소년이: 'YOUTH',
  };

  const rankMap: Record<string, string> = {
    '받고 싶어한': 'MANY_WISH',
    '많이 선물한': 'MANY_RECEIVE',
    '위시로 받은': 'MANY_WISH_RECEIVE',
  };

  const fetchRanking = async () => {
    setLoading(true);
    setError(false);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    try {
      const res = await fetch(
        `${baseUrl}/api/products/ranking?targetType=${targetMap[selectedTab]}&rankType=${rankMap[selectedSubTab]}`
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API 오류: ${res.status} ${text}`);
      }

      const { data } = await res.json();
      const mapped = data.map((item: any, index: number) => ({
        id: item.id,
        brand: item.brandInfo?.name || '',
        name: item.name,
        price: item.price?.sellingPrice || 0,
        imageURL: item.imageURL,
        ranking: index + 1,
      }));
      setProducts(mapped);
    } catch (err) {
      console.error('fetch 실패:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
    setVisible(6);
  }, [selectedTab, selectedSubTab]);

  const onTabClick = (tab: string) => {
    setSearchParams({ gender: tab, category: selectedSubTab }, { replace: true });
  };

  const onSubTabClick = (subTab: string) => {
    setSearchParams({ gender: selectedTab, category: subTab }, { replace: true });
  };

  const handleMore = () => {
    setVisible((prev) => Math.min(prev + 3, products.length));
  };

  const handleProductClick = (product: Product) => {
    navigate('/order', { state: { product } });
  };

  return (
    <section css={sectionStyle(theme)}>
      <h2 css={titleStyle(theme)}>실시간 급상승 선물랭킹</h2>

      <div css={tabsStyle(theme)}>
        {tabs.map((tab) => (
          <Button
            key={tab}
            selected={tab === selectedTab}
            baseColor={theme.colors.blue400}
            selectedColor={theme.colors.blue900}
            onClick={() => onTabClick(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div css={subTabContainer(theme)}>
        {subTabs.map((subTab) => (
          <Button
            key={subTab}
            onClick={() => onSubTabClick(subTab)}
            selected={subTab === selectedSubTab}
            baseColor={theme.colors.blue400}
            selectedColor={theme.colors.blue900}
            transparent
          >
            {subTab}
          </Button>
        ))}
      </div>

      {loading ? (
        <p>로딩중...</p>
      ) : error ? (
        <p>데이터를 불러오는데 실패했습니다.</p>
      ) : products.length === 0 ? (
        <p>상품이 없습니다.</p>
      ) : (
        <div css={gridStyle(theme)}>
          {products.slice(0, visible).map((item) => (
            <div
              key={item.id}
              onClick={() => handleProductClick(item)}
              style={{ cursor: 'pointer' }}
            >
              <GiftItem
                id={item.id}
                brand={item.brand}
                name={item.name}
                price={item.price}
                image={item.imageURL}
                theme={theme}
              />
            </div>
          ))}
        </div>
      )}

      {visible < products.length && !loading && !error && (
        <div css={moreStyle}>
          <Button onClick={handleMore} baseColor="white" textColor="black">
            더보기
          </Button>
        </div>
      )}
    </section>
  );
};

export default GiftRanking;