
import type { Product } from "@/types/product";
export async function fetchProductRanking(
  gender: string,
  category: string
): Promise<Product[]> {
  const query = new URLSearchParams({ gender, category }).toString();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/ranking?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('상품 랭킹을 불러오는데 실패했습니다.');
  }
  const data: Product[] = await response.json();
  return data;
}