import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { CoreModule } from '../core.module';

@Injectable({
  providedIn: CoreModule
})
export class InformationService {

  constructor(private snackBar: MatSnackBar) { }

  showError(e: any) {
    console.warn(e);

    if (e.message) {
      this.showMessage(e.message);
    }
  }

  showMessage(msg: string, buttonName: string = 'Close'): void {
    this.snackBar.open(msg, buttonName, { duration: 3000 });
  }
}
