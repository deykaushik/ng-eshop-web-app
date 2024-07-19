import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiBase } from './api-base';

@Injectable({ providedIn: 'root' })
export class EShopApiService extends ApiBase {
  private _productsUrl = '/products';
  private _searchProductsUrl = '/products/search';

  getAllProducts(): Observable<any[]> {
    const query = { limit: 50 };
    return this.getData<{ products: any[] }>(
      this._productsUrl,
      null,
      query
    ).pipe(map((res) => res.products));
  }

  getProductsByName(searchText: string = '') {
    const query = { limit: 50, q: searchText };
    return this.getData<{ products: any[] }>(
      this._searchProductsUrl,
      null,
      query
    ).pipe(map((res) => res.products));
  }
}
