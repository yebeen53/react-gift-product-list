import type { UseFormRegister } from 'react-hook-form';
import type { OrderFormData } from '@/schemas/orderSchema';
import styled from 'styled-components';

type Props = {
  register: UseFormRegister<OrderFormData>;
  error?: { message?: string };
  theme: any;
};

const Wrapper = styled.div`
  margin: 12px 0;
`;

const Label = styled.label`
  font-weight: 500;
`;

const TextArea = styled.textarea<{ theme: any }>`
  width: 100%;
  height: 60px;
  border-radius: 8px;
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.colors.semantic.borderDefault};
  background-color: ${({ theme }) => theme.colors.semantic.backgroundDefault};
  color: ${({ theme }) => theme.colors.semantic.textDefault};
  resize: none;
`;

const ErrorMessage = styled.p<{ theme: any }>`
  color: ${({ theme }) => theme.colors.semantic.statusCritical};
  margin-top: 4px;
  font-size: 13px;
`;

const MessageInput = ({ register, error, theme }: Props) => {
  return (
    <Wrapper>
    <Label>메시지</Label>
    <TextArea {...register('message')} rows={3} theme={theme} />
    {error && <ErrorMessage theme={theme}>{error.message}</ErrorMessage>}
  </Wrapper>

  );
};

export default MessageInput;
