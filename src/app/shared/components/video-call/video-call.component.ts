import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AudioService, ChannelService, RtcService } from './../../../core/services';
import { fadeOut } from '../../animations';
import { User } from './../../models';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss'],
  animations: [fadeOut]
})
export class VideoCallComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  localCall = this.rtcService.localCallId;
  outcome = true;
  remoteCalls: string[] = [];
  muted = false;
  showCall = true;
  videoAllowed = this.rtcService.isVideoAllowed();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User, channel: string, outcome: boolean },
    private rtcService: RtcService,
    private dialogRef: MatDialogRef<VideoCallComponent>,
    private channelService: ChannelService,
    private audioService: AudioService
  ) { }

  ngOnInit() {
    this.onClose();
    this.onRemote();
    this.call();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onMute() {
    this.muted = !this.muted;
    this.rtcService.mute(this.muted);
  }

  onAcceptCall() {
    this.rtcService.call(this.data.channel);
    this.outcome = true;
  }

  onEndCall() {
    this.rtcService.endCall().then(() => this.dialogRef.close());
  }

  private call() {
    if (this.data.outcome) {
      this.audioService.outcomeCallPlay();
      this.channelService.update(this.data.user, this.data.channel)
        .then(() => this.rtcService.call(this.data.channel));
    } else {
      this.audioService.incomeCallPlay();
      this.outcome = false;
    }
  }

  private onClose() {
    this.dialogRef.beforeClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.audioStop();
        this.channelService.delete(this.data.user.email);
        this.channelService.delete();
      });

    this.rtcService.callEnd$
      .pipe(takeUntil(this.destroy$))
      .subscribe((end: boolean) => {
        this.audioStop();

        if (end) { this.dialogRef.close(); }
      });
  }

  private onRemote() {
    this.rtcService.remote$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: { calls: string[], cb: () => void }) => {
        this.remoteCalls = data.calls;
        setTimeout(data.cb, 1000);

        this.audioStop();
        this.showCall = false;
      });
  }

  private audioStop() {
    this.audioService.incomeCallStop();
    this.audioService.outcomeCallStop();
  }
}
