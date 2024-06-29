import { Injectable, computed, signal } from '@angular/core';
import { IAppState, ICartApiRes } from '../models/app.model';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  // Signal that hold the state (initial state)
  private _state = signal<IAppState>({
    errorMessage: null,
    currCartQty: 0,
    cart: null,
  });

  // Selectors (slices of state)
  errorMessage = computed(() => this._state().errorMessage);
  currCartQty = computed(() => this._state().currCartQty);
  cart = computed(() => this._state().cart);

  // Reducers
  updateCartQty(currCartQty: number) {
    this._state.update((state) => ({ ...state, currCartQty }));
  }

  updateErrorMessage(errorMessage: string) {
    this._state.update((state) => ({ ...state, errorMessage }));
  }

  updateCart(cart: ICartApiRes) {
    this._state.update((state) => ({ ...state, cart }));
  }
}
