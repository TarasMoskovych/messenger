import { Component, ChangeDetectionStrategy, Input, OnInit, AfterViewInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ChatService } from 'src/app/core/services';
import { Message, User } from 'src/app/shared/models';
import { appConfig } from 'src/app/configs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() messages: Message[] = [];
  @Input() currentUser: User;
  @Input() userPhotoUrl: string;
  @ViewChild('list', { static: false }) private list: { _elementRef: ElementRef };

  sub$: Subscription;

  constructor(private charService: ChatService) { }

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

  private scrollContent() {
    this.list._elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

}
