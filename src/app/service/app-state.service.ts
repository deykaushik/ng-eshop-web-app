import { Injectable, computed, signal } from '@angular/core';
import { IAppState, ICartApiRes } from '../models/app.model';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private _state = signal<IAppState>({
    errorMessage: null,
    cart: null,
  });

  errorMessage = computed(() => this._state().errorMessage);
  cart = computed(() => this._state().cart);

  updateErrorMessage(errorMessage: string) {
    this._state.update((state) => ({ ...state, errorMessage }));
  }

  updateCart(cart: ICartApiRes) {
    this._state.update((state) => ({ ...state, cart }));
  }
}
