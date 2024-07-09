import { Injectable, signal } from '@angular/core';
import { IProduct } from '../models/app.model';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  readonly cartItems = signal<IProduct[]>([]);
  readonly errorMessage = signal<string | null>(null);

  updateCartItems(products: IProduct[]) {
    this.cartItems.update(() => products.filter((item) => !!item.quantity));
  }

  setErrorMessage(message: string | null) {
    this.errorMessage.update(() => message);
  }

  addToCart(product: IProduct, quantity: number, isEdit: boolean = false) {
    const currCartItems = this.cartItems();
    const existingProductIndex = currCartItems.findIndex(
      (item) => item.id === product.id
    );
    if (existingProductIndex !== -1) {
      const matchedProduct = currCartItems[existingProductIndex];
      if (isEdit) {
        matchedProduct.quantity = +quantity;
      } else {
        matchedProduct.quantity = (matchedProduct.quantity || 0) + 1;
      }
    } else {
      currCartItems.push({ ...product, quantity: +quantity });
    }

    this.updateCartItems(currCartItems);
  }
}
