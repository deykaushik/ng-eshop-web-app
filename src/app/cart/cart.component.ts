import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  inject,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { EShopApiService } from '../api/eshop-api.service';
import { ICartApiRes, IProductPost } from '../models/app.model';
import { AppStateService } from '../services/app-state.service';
import { BehaviorSubject, filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage, FormsModule],
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  private _eshopApi = inject(EShopApiService);
  private _appState = inject(AppStateService);
  private _currCartProducts: IProductPost[] = [];
  private _updatedCartProductsSub = new BehaviorSubject<IProductPost[]>([]);
  private _cartData: Signal<ICartApiRes | null> = this._appState.cart;

  cartDate$ = toObservable(this._cartData).pipe(
    tap((cart) => {
      this._currCartProducts =
        cart?.products?.map(
          (item) => ({ id: item.id, quantity: item.quantity } as IProductPost)
        ) || [];
    })
  );

  cartUpdateListener$ = this._updatedCartProductsSub.asObservable().pipe(
    filter((products) => !!products.length),
    switchMap((products) => this._eshopApi.addProductsToCart(products)),
    tap((cartRes) => this._appState.updateCart(cartRes))
  );

  private _updateCart(quantity: number, id: number): IProductPost[] {
    const currCartProducts = [...this._currCartProducts];
    const matchedProduct = currCartProducts.find((item) => item.id === id);
    if (matchedProduct) {
      matchedProduct.quantity = +quantity;
    }
    return currCartProducts.filter((item) => !!item.quantity);
  }

  onRemove(id: number) {
    const cartItems = this._updateCart(0, id);
    this._updatedCartProductsSub.next(cartItems);
  }

  onUpdate(quantity: number, id: number) {
    if (quantity < 0) {
      return;
    }
    const cartItems = this._updateCart(quantity, id);
    this._updatedCartProductsSub.next(cartItems);

    /**
     * DummyJSON Api returning wrong response
     */

    // const payload: ICartPayload = {
    //   merge: true,
    //   products: [...this._currCartProducts],
    // };
    // this._eshopApi.updateCart(payload).subscribe(console.log);
  }
}
