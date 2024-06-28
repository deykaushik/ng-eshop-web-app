import { Routes } from '@angular/router';
import { AppShellComponent } from './app-shell.component';
import { ShopComponent } from '../shop/shop.component';
import { CartComponent } from '../cart/cart.component';

export const AppShellRoutes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: 'shop',
        component: ShopComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: '',
        redirectTo: 'shop',
        pathMatch: 'full',
      },
    ],
  },
];
