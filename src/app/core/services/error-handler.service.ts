import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { CoreModule } from './../core.module';

@Injectable({
  providedIn: CoreModule
})
export class ErrorHandlerService {

  constructor(private snackBar: MatSnackBar) { }

  show(e: any) {
    console.warn(e);

    if (e.message) {
      this.snackBar.open(e.message, 'Close', { duration: 3000 });
    }
  }

}
