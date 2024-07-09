export interface IProduct {
  id: number;
  title: string;
  rating: number;
  price: number;
  thumbnail: string;
  discountPercentage: number;
  quantity?: number;
}
