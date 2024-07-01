import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { EShopApiService } from '../api/eshop-api.service';
import { ICartApiRes, IProduct, IProductPost } from '../models/app.model';
import { AppStateService } from '../service/app-state.service';
import { AppErrorHandler, DefaultErrorHanlder } from '../utils/error-handler';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage, NgIf],
  templateUrl: './shop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: AppErrorHandler,
      useClass: DefaultErrorHanlder,
    },
  ],
})
export class ShopComponent {
  private _eshopApi = inject(EShopApiService);
  private _appState = inject(AppStateService);
  private _appErrorHandler = inject(AppErrorHandler);

  private _currCartProducts: IProductPost[] = [];
  private _addToCartSub = new BehaviorSubject<IProductPost | null>(null);

  cartData$ = toObservable(this._appState.cart).pipe(
    tap((cart) => {
      this._currCartProducts =
        cart?.products?.map(
          (item) => ({ id: item.id, quantity: item.quantity } as IProductPost)
        ) || [];
    })
  );

  /**
   * Ensure that on fast clicking of Add to cart we cancel the previous add call
   * Update the product qty if already exist else add new product
   * */
  addToCartListener$ = this._addToCartSub.asObservable().pipe(
    map((newProduct) => {
      if (newProduct) {
        const existingProductIndex = this._currCartProducts.findIndex(
          (item) => item.id === newProduct.id
        );
        if (existingProductIndex !== -1) {
          this._currCartProducts[existingProductIndex].quantity++;
        } else {
          this._currCartProducts.push({ id: newProduct.id, quantity: 1 });
        }
        return this._currCartProducts;
      } else {
        return [];
      }
    }),
    filter((products) => !!products.length),
    switchMap((products) => this._eshopApi.addProductsToCart(products)),
    catchError((err: HttpErrorResponse) => {
      this._appErrorHandler.handleError(err);
      return of({} as ICartApiRes);
    }),
    tap((cart) => this._appState.updateCart(cart))
  );

  productsData$: Observable<IProduct[]> = this._eshopApi.getAllProducts().pipe(
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
    this._addToCartSub.next({ id: productId, quantity: 1 });
  }
}
