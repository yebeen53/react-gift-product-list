import Button from '@/components/Button';
import type { FieldErrors, UseFieldArrayAppend } from 'react-hook-form';
import type { OrderFormData } from '@/schemas/orderSchema';
import styled from 'styled-components';
import type {Theme} from '@/data/theme';

type Props = {
  recipients: OrderFormData['recipients'];
  errors?: FieldErrors<OrderFormData>['recipients'];
  append: UseFieldArrayAppend<OrderFormData, 'recipients'>;
  setModalOpen: (open: boolean) => void;
  theme: Theme;
};

const Section = styled.section<{ theme: Theme }>`
  margin-top: 16px;
  border: 1px solid ${({ theme }) => theme.colors.semantic.borderDefault};
  border-radius: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.semantic.backgroundDefault};
`;

const Heading = styled.h3`
  margin-top: 0;
  margin-bottom: 12px;
`;

const Description = styled.p<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.semantic.textDefault};
`;

const RecipientList = styled.ul`
  padding-left: 20px;
  margin-bottom: 16px;
`;

const ErrorMessage = styled.p<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.semantic.statusCritical};
  margin-bottom: 16px;
  font-size: 13px;
`;

const RecipientSummary = ({ recipients, errors, setModalOpen, theme }: Props) => {
  return (
    <Section theme={theme}>
    <Heading>받는 사람</Heading>

    {recipients.length === 0 ? (
      <Description theme={theme}>
        받는 사람이 없습니다. <br />
        받는 사람을 추가해주세요.
      </Description>
    ) : (
      <RecipientList>
        {recipients.map((r, index) => (
          <li key={index}>
            {r.name || ''} {r.phone || ''} {r.quantity || 1}개
          </li>
        ))}
      </RecipientList>
    )}

    {typeof errors?.message === 'string' && (
      <ErrorMessage theme={theme}>{errors.message}</ErrorMessage>
    )}

    <Button
      baseColor={theme.colors.semantic.borderDisabled}
      textColor={theme.colors.semantic.textDefault}
      onClick={() => setModalOpen(true)}
    >
      {recipients.length > 0 ? '수정' : '추가'}
    </Button>
  </Section>
);
};


export default RecipientSummary;
