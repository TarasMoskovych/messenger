import { User } from 'src/app/shared/models';

export abstract class AbstractLightBox {
  protected album = [];

  protected initAlbum(users: User[]) {
    users.forEach((user: User) => this.album.push({ src: user.photoURL, thumb: '' }));
  }

}
