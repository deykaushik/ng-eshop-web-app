import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IProduct {
  id: number;
  title: string;
  rating: number;
  price: number;
  thumbnail: string;
  discountPercentage: number;
  quantity: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _cartItemsSubject = new BehaviorSubject<IProduct[]>([]);
  readonly cartItems$: Observable<IProduct[]> =
    this._cartItemsSubject.asObservable();

  readonly getCartItemsCount$ = this.cartItems$.pipe(
    map((items) => items.reduce((acc, item) => acc + item.quantity, 0))
  );

  readonly getCartTotal$ = this.cartItems$.pipe(
    map((items) => items.reduce((acc, item) => acc + item.total, 0))
  );

  private _updateCartItems(
    product: IProduct,
    newQuantity: number,
    isEdit: boolean = false
  ): IProduct[] {
    const cartItems = this._cartItemsSubject.getValue();
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      if (isEdit) {
        existingItem.quantity = +newQuantity;
      } else {
        existingItem.quantity = existingItem.quantity! + 1;
      }
      existingItem.total = existingItem.price * existingItem.quantity;
    } else {
      cartItems.push({ ...product, quantity: 1, total: product.price });
    }
    return [...cartItems.filter((item) => item.quantity > 0)];
  }

  addToCart(product: IProduct) {
    this._cartItemsSubject.next(this._updateCartItems(product, 1));
  }

  editCartItemQuantity(product: IProduct, newQuantity: number) {
    this._cartItemsSubject.next(
      this._updateCartItems(product, newQuantity, true)
    );
  }
}
