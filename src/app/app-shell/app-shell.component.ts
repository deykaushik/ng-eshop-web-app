import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppStateService } from '../service/app-state.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  private _appState = inject(AppStateService);

  errorMessage = this._appState.errorMessage;

  cartTotalCount = computed(() =>
    this._appState
      .cartItems()
      .reduce((acc, curr) => (acc = acc + +curr.quantity!), 0)
  );
}
