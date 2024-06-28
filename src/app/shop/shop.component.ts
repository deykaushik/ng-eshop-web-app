import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  filter,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { EShopApiService } from '../api/eshop-api.service';
import { IProduct, IProductPost } from '../models/app.model';
import { AppStateService } from '../services/app-state.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage],
  templateUrl: './shop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent {
  private _eshopApi = inject(EShopApiService);
  private _appState = inject(AppStateService);
  private _currentlyAddedProducts: IProductPost[] = [];
  private _addedProductsSub = new BehaviorSubject<IProductPost | null>(null);

  /**
   * Ensure that on fast clicking of Add to cart we cancel the previous add call
   * Update the product qty if already exist else add new product
   * */
  protected addProducts$ = this._addedProductsSub.asObservable().pipe(
    map((newProduct) => {
      if (newProduct) {
        const existingProductIndex = this._currentlyAddedProducts.findIndex(
          (item) => item.id === newProduct.id
        );
        if (existingProductIndex !== -1) {
          this._currentlyAddedProducts[existingProductIndex].quantity += 1;
        } else {
          this._currentlyAddedProducts.push({ id: newProduct.id, quantity: 1 });
        }
        return this._currentlyAddedProducts;
      } else {
        return [];
      }
    }),
    filter((products) => !!products.length),
    switchMap((products) => this._eshopApi.addProductsToCart(products)),
    tap(({ totalQuantity }) => this._appState.updateCartQty(totalQuantity))
  );

  protected products$: Observable<IProduct[]> = this._eshopApi
    .getAllProducts()
    .pipe(
      map((products) =>
        products.map((product) => ({
          id: product.id,
          title: product.title,
          rating: product.rating,
          price: product.price,
          thumbnail: product.thumbnail,
          discountPercentage: product.discountPercentage,
        }))
      )
    );

  protected addToCart(productId: number) {
    this._addedProductsSub.next({ id: productId, quantity: 1 });
  }
}
