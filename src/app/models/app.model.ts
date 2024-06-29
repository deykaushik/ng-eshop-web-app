export interface IProduct {
  id: number;
  title: string;
  rating: number;
  price: number;
  thumbnail: string;
  discountPercentage: number;
}

export interface IProductPost {
  id: number;
  quantity: number;
}

export interface IAppState {
  errorMessage: string | null;
  currCartQty: number;
  cart: ICartApiRes | null;
}

export interface ICartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface ICartApiRes {
  id: string;
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
  products: ICartProduct[];
}

export interface ICartPayload {
  merge: boolean;
  products: IProductPost[];
}
