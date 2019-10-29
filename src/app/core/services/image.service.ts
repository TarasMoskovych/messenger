import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { of, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CoreModule } from '../core.module';
import { HashService } from './hash.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: CoreModule
})
export class ImageService {

  constructor(
    private storage: AngularFireStorage,
    private hashService: HashService,
    private notificationService: NotificationService
  ) { }

  upload(file: File, folder = 'images', name = `/image_${this.hashService.generateHash()}`): Observable<string> {
    if (!this.isImage(file)) {
      this.showNotification();
      return of(null);
    }

    return from(this.storage.upload(`${folder}/${name}`, file))
      .pipe(
        switchMap((data: UploadTaskSnapshot) => {
          if (data.metadata.contentType.match('image/.*')) {
            return data.ref.getDownloadURL();
          } else {
            return data.ref.delete();
          }
        })
      );
  }

  private isImage(file: File) {
    return file.type.match('image/.*');
  }

  private showNotification() {
    this.notificationService.showMessage('File type is not supported!');
  }
}
