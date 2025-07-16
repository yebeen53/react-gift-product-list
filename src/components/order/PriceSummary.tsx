import styled from 'styled-components';
import type { Theme } from '@/data/theme';
type Props = {
    totalPrice: number;
    theme: Theme;
  };

  const SummaryBox = styled.div`
  margin-top: 16px;
`;

const OrderButton = styled.button<{ theme: Theme}>`
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.semantic.kakaoYellow};
  font-weight: bold;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;


  
  const PriceSummary = ({ totalPrice, theme }: Props) => {
    return (
      <>
        <SummaryBox>
        <strong>총 금액: {totalPrice.toLocaleString()}원</strong>
      </SummaryBox>
      <OrderButton type="submit" theme={theme}>
        {totalPrice.toLocaleString()}원 주문하기
      </OrderButton>

      </>
    );
  };
  
  export default PriceSummary;
  