import { AsyncPipe, JsonPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService, IProduct } from '../service/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage, FormsModule, NgIf],
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  private _cartService = inject(CartService);

  cartItems$ = this._cartService.cartItems$;
  getCartTotal$ = this._cartService.getCartTotal$;

  onInputBlur(input: Event, product: IProduct) {
    const inputElem = input.target as HTMLInputElement;
    if (+inputElem.value < 0) {
      inputElem.value = '0';
    }
    this._cartService.editCartItemQuantity(product, +inputElem.value);
  }

  onRemove(product: IProduct) {
    this._cartService.editCartItemQuantity(product, 0);
  }
}
