import { Lightbox } from 'ngx-lightbox';

import { User } from 'src/app/shared/models';

export abstract class AbstractLightBox {
  protected album = [];

  constructor(private lightbox: Lightbox) {}

  protected initAlbum(users: User[]) {
    users.forEach((user: User) => this.album.push({ src: user.photoURL, thumb: '' }));
  }

  protected openImg(idx: number) {
    this.lightbox.open(this.album, idx);
  }

}
