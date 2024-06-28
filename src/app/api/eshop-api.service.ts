import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiBase } from './api-base';
import { IProductPost } from '../models/app.model';

const CARD_ID = 1;

@Injectable({ providedIn: 'root' })
export class EShopApiService extends ApiBase {
  private _productsUrl = '/products';
  private _addProductsToCartUrl = '/carts/add';

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
    const payload = { userId: CARD_ID, products };
    return this.postData(
      this._addProductsToCartUrl,
      null,
      null,
      payload
    ) as Observable<any>;
  }
}
