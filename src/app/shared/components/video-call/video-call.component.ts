import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RtcService } from './../../../core/services';
import { User } from './../../models';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  localCall = this.rtcService.localCallId;

  remoteCalls: string[] = [];
  muted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User,
    private rtcService: RtcService,
    private dialogRef: MatDialogRef<VideoCallComponent>
  ) { }

  ngOnInit() {
    this.onCallEnd();
    this.onRemote();
    this.rtcService.call();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onMute() {
    this.muted = !this.muted;
    this.rtcService.mute(this.muted);
  }

  onEndCall() {
    this.rtcService.endCall().then(() => this.dialogRef.close());
  }

  private onCallEnd() {
    this.rtcService.callEnd$
      .pipe(takeUntil(this.destroy$))
      .subscribe((end: boolean) => {
        if (end) { this.dialogRef.close(); }
      });
  }

  private onRemote() {
    this.rtcService.remote$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: { calls: string[], cb: () => void }) => {
        this.remoteCalls = data.calls;
        setTimeout(data.cb, 1000);
      });
  }
}
