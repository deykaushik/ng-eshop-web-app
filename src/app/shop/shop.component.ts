import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  fromEvent,
  map,
  Observable,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { EShopApiService } from '../api/eshop-api.service';
import { CartService, IProduct } from '../service/cart.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage, NgIf, ReactiveFormsModule],
  templateUrl: './shop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent implements AfterViewInit {
  private _eshopApi = inject(EShopApiService);
  private _cartService = inject(CartService);
  private _ngZone = inject(NgZone);
  private _searchTerm = new BehaviorSubject<string>('');

  @ViewChild('inputElement')
  inputElement!: ElementRef<HTMLInputElement>;

  protected searchFC = new FormControl();

  // private _productsData$(searchText: string): Observable<IProduct[]> {
  //   return this._eshopApi.getProductsByName(searchText).pipe(
  //     map((products) =>
  //       products.map(
  //         (product) =>
  //           ({
  //             id: product.id,
  //             title: product.title,
  //             rating: product.rating,
  //             price: product.price,
  //             thumbnail: product.thumbnail,
  //             discountPercentage: product.discountPercentage,
  //             quantity: 0,
  //             total: 0,
  //           } as IProduct)
  //       )
  //     )
  //   );
  // }

  private _productsData$(searchText: string): Observable<IProduct[]> {
    return this._eshopApi.getAllProducts().pipe(
      map((products) =>
        products.map(
          (product) =>
            ({
              id: product.id,
              title: product.title,
              rating: product.rating,
              price: product.price,
              thumbnail: product.thumbnail,
              discountPercentage: product.discountPercentage,
              quantity: 0,
              total: 0,
            } as IProduct)
        )
      ),
      map((products) =>
        products.filter((items) => items.title.includes(searchText))
      )
    );
  }

  protected filteredList$ = this._searchTerm
    .asObservable()
    .pipe(switchMap((searchText) => this._productsData$(searchText)));

  ngAfterViewInit(): void {
    this._ngZone.runOutsideAngular(() => {
      fromEvent(this.inputElement.nativeElement, 'keyup')
        .pipe(debounceTime(100))
        .subscribe((event: any) => {
          this._ngZone.run(() => this._searchTerm.next(event.target.value));
        });
    });
  }

  protected addToCart(product: IProduct) {
    this._cartService.addToCart(product);
  }
}
