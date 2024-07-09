import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../service/app-state.service';
import { IProduct } from '../models/app.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage, FormsModule, NgIf],
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  private _appState = inject(AppStateService);

  cartItems = this._appState.cartItems;

  totalPrice = computed(() =>
    this._appState
      .cartItems()
      .reduce((acc, curr) => (acc = acc + curr.quantity! * curr.price), 0)
  );

  onUpdate(product: IProduct, quantity: number) {
    this._appState.addToCart(product, +quantity, true);
  }

  onRemove(product: IProduct) {
    const cartItems = this._appState.cartItems();
    const updatedCartItems = cartItems.filter((item) => item.id !== product.id);
    this._appState.updateCartItems(updatedCartItems);
  }
}
