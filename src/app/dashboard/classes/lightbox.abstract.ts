import { Lightbox } from 'ngx-lightbox';

import { appConfig } from 'src/app/configs';
import { User } from 'src/app/shared/models';

export abstract class AbstractLightBox {
  private cache = {};

  constructor(protected lightbox: Lightbox) {}

  protected openImg(user: User) {
    if (user.photoURL === appConfig.defaultPhotoUrl) {
      return;
    }

    if (!this.cache[user.email]) {
      this.cache[user.email] = [{ src: user.photoURL, thumb: '', caption: user.displayName, }];
    }

    this.lightbox.open(this.cache[user.email], 0);
  }

}
