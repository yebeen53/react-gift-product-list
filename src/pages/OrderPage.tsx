import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema } from '@/schemas/orderSchema';
import type { OrderFormData } from '@/schemas/orderSchema';
import { FormProvider } from 'react-hook-form';

import useRequireAuth from '@/hooks/useRequireAuth';
import useCustomTheme from '@/hooks/useCustomTheme';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CardSelector from '@/components/order/CardSelector';
import MessageInput from '@/components/order/MessageInput';
import SenderInput from '@/components/order/SenderInput';
import RecipientSummary from '@/components/order/RecipientSummary';
import RecipientModal from '@/components/order/RecipientModal';
import PriceSummary from '@/components/order/PriceSummary';

import axios from 'axios';
import { toast } from 'react-toastify';
import useAuth from '@/hooks/useAuth';
import { AxiosError } from 'axios';

type ProductInfo = {
  name: string;
  description: string;
  price: number;
  brandName?: string;
  imageURL?: string;
};

const OrderPage = () => {
  const user = useRequireAuth();
  const { user: userInfo } = useAuth();
  const theme = useCustomTheme();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();

  const [product, setProduct] = useState<ProductInfo | null>(null);

  const [productPrice, setProductPrice] = useState<number>(0);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!productId) return;
    axios
      .get(`/api/products/${productId}/summary`)
      .then((res) => {
        console.log('summary 응답:', res.data);

        const summary = res.data.data;
        setProduct({
          name: summary.name,
          price: summary.price,
          description: '',
          brandName: summary.brandName,
          imageURL: summary.imageURL,
        });
        setProductPrice(summary.price);

        return axios.get(`/api/products/${productId}/detail`);
      })
      .then((res) => {
        const detail = res.data.data;
        setProduct((prev) =>
          prev ? { ...prev, description: detail.description } : prev
        );
      })
      .catch((error) => {
        if (error.response?.status >= 400 && error.response?.status < 500) {
          toast.error('상품 정보를 불러오지 못했습니다.');
          navigate('/homepage');
        } else {
          toast.error('서버 오류가 발생했습니다.');
        }
      });
  }, [productId, navigate]);

  const methods = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      message: '',
      senderName: userInfo?.name || '',
      selectedCardId: null,
      recipients: [],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'recipients',
  });

  const selectedCardId = watch('selectedCardId');
  const recipients = watch('recipients');

  if (!user) return null;

  const totalQuantity = recipients.reduce(
    (sum, r) => sum + Number(r.quantity || 0),
    0
  );
  const totalPrice = totalQuantity * productPrice;

  const onSubmit: SubmitHandler<OrderFormData> = async (data) => {
    try {
      await axios.post(
        '/api/order',
        {
          productId: Number(productId),
          message: data.message,
          messageCardId: `card${data.selectedCardId}`,
          ordererName: data.senderName,
          receivers: data.recipients.map((r) => ({
            name: r.name,
            phoneNumber: r.phoneNumber,
            quantity: Number(r.quantity),
          })),
        },

        {
          headers: {
            Authorization: 'dummy-token',
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success(
        `주문이 완료되었습니다.\n` +
          `구매 수량:${totalQuantity}\n` +
          `발신자 이름:${data.senderName}\n` +
          `메시지:${data.message}`
      );
      console.log('authToken:', userInfo?.authToken);
      navigate('/');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;

      if (axiosError.response) {
        if (axiosError.response.status === 401) {
          toast.error('로그인이 필요합니다.');
          navigate('/');
        } else if (
          axiosError.response.status >= 400 &&
          axiosError.response.status < 500
        ) {
          toast.error(
            axiosError.response.data.message || '주문에 실패했습니다.'
          );
        } else {
          toast.error('서버 오류가 발생했습니다.');
        }
      } else {
        toast.error('네트워크 오류가 발생했습니다.');
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        css={{
          maxWidth: '720px',
          margin: 'auto',
          padding: theme.spacing.spacing5,
        }}
      >
        <CardSelector
          selectedCardId={selectedCardId}
          setValue={setValue}
          theme={theme}
        />

        <MessageInput
          register={register}
          error={errors.message}
          theme={theme}
        />

        <SenderInput
          register={register}
          error={errors.senderName}
          theme={theme}
        />

        <RecipientSummary
          recipients={recipients}
          errors={errors.recipients}
          append={append}
          setModalOpen={setModalOpen}
          theme={theme}
        />

        {isModalOpen && (
          <RecipientModal
            fields={fields}
            register={register}
            errors={errors}
            append={append}
            remove={remove}
            theme={theme}
            setModalOpen={setModalOpen}
            setValue={setValue}
          />
        )}
        {product && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {product.imageURL && (
              <img
                src={product.imageURL}
                alt={product.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            )}
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                }}
              >
                {product.name}
              </h3>
              {product.brandName && (
                <p style={{ color: theme.colors.gray600, fontSize: '14px' }}>
                  {product.brandName}
                </p>
              )}
              <p style={{ fontWeight: '500', marginTop: '4px' }}>
                상품가 {product.price.toLocaleString()}원
              </p>
            </div>
          </div>
        )}
        <PriceSummary
          totalPrice={totalPrice}
          theme={theme}
          onOrder={handleSubmit(onSubmit)}
        />
      </form>
    </FormProvider>
  );
};

export default OrderPage;
