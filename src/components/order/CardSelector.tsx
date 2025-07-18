import orderCard from '@/data/orderCard';
import type { UseFormSetValue } from 'react-hook-form';
import type { OrderFormData } from '@/schemas/orderSchema';
import styled from 'styled-components';

type Props = {
  selectedCardId: number | null;
  setValue: UseFormSetValue<OrderFormData>;
  theme: any;
};

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 8px;
  margin: 8px 0 16px;
`;

const CardThumbnail = styled.img<{ selected: boolean; theme: any }>`
  width: 80px;
  height: 50px;
  border-radius: 8px;
  cursor: pointer;
  border: ${({ selected, theme }) =>
    selected
      ? `2px solid ${theme.colors.blue900}`
      : `1px solid ${theme.colors.semantic.borderDefault}`};
`;

const SelectedImage = styled.img`
  width: 100%;
  border-radius: 12px;
`;

const CardSelector = ({ selectedCardId, setValue, theme }: Props) => {
  const handleSelectCard = (cardId: number) => {
    const isSelected = selectedCardId === cardId;
    setValue('selectedCardId', isSelected ? null : cardId);
    setValue(
      'message',
      isSelected ? '' : orderCard.find((c) => c.id === cardId)?.defaultTextMessage || ''
    );
  };

  const selectedCard =
    selectedCardId !== null ? orderCard.find((c) => c.id === selectedCardId) : null;

    return (
      <section>
        <ScrollContainer>
          {orderCard.slice(0, 12).map((card) => (
            <CardThumbnail
              key={card.id}
              src={card.thumbUrl}
              alt="card"
              onClick={() => handleSelectCard(card.id)}
              selected={selectedCardId === card.id}
              theme={theme}
            />
          ))}
        </ScrollContainer>
        {selectedCard && <SelectedImage src={selectedCard.imageUrl} />}
      </section>
    );
  };

export default CardSelector;
