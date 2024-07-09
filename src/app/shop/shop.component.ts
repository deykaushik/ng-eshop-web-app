import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EShopApiService } from '../api/eshop-api.service';
import { CartService, IProduct } from '../service/cart.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage, NgIf],
  templateUrl: './shop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent {
  private _eshopApi = inject(EShopApiService);
  private _cartService = inject(CartService);

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

  protected addToCart(product: IProduct) {
    this._cartService.addToCart(product);
  }
}
