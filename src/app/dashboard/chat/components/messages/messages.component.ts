import { Component, ChangeDetectionStrategy, Input, OnInit, AfterViewInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { AbstractLightBox } from 'src/app/dashboard/classes';
import { ChatService } from 'src/app/core/services';
import { Message, User } from 'src/app/shared/models';
import { appConfig } from 'src/app/configs';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent extends AbstractLightBox implements OnInit, AfterViewInit, OnDestroy {
  @Input() messages: Message[] = [];
  @Input() currentUser: User;
  @Input() userPhotoUrl: string;
  @ViewChild('list', { static: false }) private list: { _elementRef: ElementRef };

  sub$: Subscription;

  constructor(private charService: ChatService, protected lightbox: Lightbox) {
    super(lightbox);
  }

  ngOnInit() {
    this.sub$ = this.charService.onSendDone$
      .pipe(debounceTime(appConfig.scrollDelay))
      .subscribe(this.scrollContent.bind(this));
  }

  ngAfterViewInit() {
    this.scrollContent();
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  onImageClick(photoURL: string) {
    this.openImg({ photoURL, displayName: '', email: photoURL });
  }

  private scrollContent() {
    this.list._elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

}
