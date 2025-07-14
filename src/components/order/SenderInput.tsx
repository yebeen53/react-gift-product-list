import type { UseFormRegister } from 'react-hook-form';
import type { OrderFormData } from '@/schemas/orderSchema';
import styled from 'styled-components';
type Props = {
  register: UseFormRegister<OrderFormData>;
  error?: { message?: string };
  theme: any;
};
const Wrapper = styled.div``;

const Label = styled.label`
  font-weight: 500;
`;

const Input = styled.input<{ theme: any }>`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.semantic.borderDefault};
  background-color: ${({ theme }) => theme.colors.semantic.backgroundDefault};
  color: ${({ theme }) => theme.colors.semantic.textDefault};
  padding: 0 8px;
`;

const ErrorMessage = styled.p<{ theme: any }>`
  color: ${({ theme }) => theme.colors.semantic.statusCritical};
  margin-top: 4px;
  font-size: 13px;
`;
const SenderInput = ({ register, error, theme }: Props) => {
  return (
    <Wrapper>
    <Label>보내는 사람</Label>
    <Input {...register('senderName')} theme={theme} />
    {error && <ErrorMessage theme={theme}>{error.message}</ErrorMessage>}
  </Wrapper>

  );
};

export default SenderInput;
