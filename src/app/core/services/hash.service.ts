import { Injectable } from '@angular/core';

import { CoreModule } from '../core.module';
import randomize from 'randomatic';

@Injectable({
  providedIn: CoreModule
})
export class HashService {

  generateHash() {
    return randomize('Aa0', 32);
  }
}
