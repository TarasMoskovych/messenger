import { Component, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, ElementRef, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji/public_api';

import { appConfig } from 'src/app/configs';
import { ChatService } from 'src/app/core';

@Component({
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextboxComponent implements OnInit, OnDestroy {
  @Output() sendMessage = new EventEmitter<string>();
  @Output() fileUpload = new EventEmitter<File>();
  @ViewChild('field', { static: false }) private textarea: ElementRef;

  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef) { }

  sub: Subscription;
  maxLength = appConfig.textBoxLength;
  message = '';
  showEmojiPicker = false;
  showLoader = false;

  ngOnInit() {
    this.sub = this.chatService.onSendFileDone$
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.showLoader = false;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onAddEmoji(event: EmojiEvent) {
    const { message } = this;
    const text = `${message}${event.emoji.native}`;

    this.message = text;
    this.textarea.nativeElement.focus();
    this.showEmojiPicker = false;
  }

  onSendMessage(event?: KeyboardEvent) {
    event && event.preventDefault();

    const msg = this.message.trim();

    if (msg.length) {
      this.sendMessage.emit(msg);
      this.message = '';
    }
  }

  onFileUpload(file: File) {
    if (file) {
      this.showLoader = true;
      this.fileUpload.emit(file);
    }
  }

  onFileDropped(file: File[]) {
    if (file.length) {
      this.onFileUpload(file[0]);
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
}
