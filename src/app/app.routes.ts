import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./app-shell/app-shell.routes').then((r) => r.AppShellRoutes),
  },
];
