import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiBase } from './api-base';
import { ICartApiRes, IProductPost } from '../models/app.model';

const USER_ID = 1;

@Injectable({ providedIn: 'root' })
export class EShopApiService extends ApiBase {
  private _productsUrl = '/products';
  private _addProductsToCartUrl = '/carts/add';
  private _getCartUrl = `/carts/user/:userId`;
  private _updateCartUrl = `/carts/:userId`;

  /**
   * For now we are not modeling the whole api response object
   * as they are not needed as per the assignment scope
   * @returns IProductApiRes // not defined yet
   */
  getAllProducts(): Observable<any[]> {
    const query = { limit: 50 };
    return this.getData<{ products: any[] }>(
      this._productsUrl,
      null,
      query
    ).pipe(map((res) => res.products));
  }

  addProductsToCart(products: IProductPost[]) {
    const payload = { userId: USER_ID, products };
    return this.postData(
      this._addProductsToCartUrl,
      null,
      null,
      payload
    ) as Observable<ICartApiRes>;
  }

  getCart() {
    return this.getData<ICartApiRes>(
      this._getCartUrl,
      { userId: USER_ID },
      null
    ).pipe(
      tap(console.log),
      map((res) => res.products)
    );
  }

  updateCart(payload: { merge: boolean; products: IProductPost[] }) {
    return this.putData(
      this._updateCartUrl,
      { userId: USER_ID },
      null,
      payload
    );
  }
}
