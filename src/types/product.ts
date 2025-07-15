
export interface Product {
    id: number;
    name: string;
    gender: string;
    category: string;
    price: {
      basicPrice: number;
      sellingPrice: number;
      discountRate: number;
    };
    imageURL: string;
    brandInfo: {
      id: number;
      name: string;
      imageURL: string;
    };
  }