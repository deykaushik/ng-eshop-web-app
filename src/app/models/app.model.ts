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
}
