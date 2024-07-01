import { HttpErrorResponse } from '@angular/common/http';
import { AppStateService } from '../service/app-state.service';
import { inject } from '@angular/core';

export abstract class AppErrorHandler {
  abstract handleError(err: HttpErrorResponse): void;
}

export class DefaultErrorHanlder extends AppErrorHandler {
  private _appState = inject(AppStateService);

  override handleError(err: HttpErrorResponse): void {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occured :${err.error.message}`;
    } else {
      errorMessage = `Backend error occured :${err.status} ${err.message}`;
    }
    this._appState.updateErrorMessage(errorMessage);
  }
}
