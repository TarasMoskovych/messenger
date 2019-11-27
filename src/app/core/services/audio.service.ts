import { Injectable } from '@angular/core';

import { appConfig } from 'src/app/configs';
import { CoreModule } from '../core.module';

@Injectable({
  providedIn: CoreModule
})
export class AudioService {
  private obj = {};

  incomeCallPlay() {
    this.play(appConfig.call.income);
  }

  incomeCallStop() {
    this.stop(appConfig.call.income);
  }

  outcomeCallPlay() {
    this.play(appConfig.call.outcome);
  }

  outcomeCallStop() {
    this.stop(appConfig.call.outcome);
  }

  play(path: string, loop: boolean = true) {
    if (this.obj[path] && loop) {
      return this.obj[path].play();
    }

    const audio = new Audio(path);

    audio.loop = loop;
    audio.load();
    audio.play();

    this.obj[path] = audio;
  }

  stop(path: string) {
    if (this.obj[path]) {
      this.obj[path].pause();
    }
  }
}
