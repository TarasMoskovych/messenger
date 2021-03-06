import { Injectable } from '@angular/core';
import { NgxAgoraService, AgoraClient, ClientEvent, Stream, StreamEvent } from 'ngx-agora';
import { Subject } from 'rxjs';

import { CoreModule } from '../core.module';
import { UserService } from './user.service';
import { InformationService } from './information.service';

@Injectable({
  providedIn: CoreModule
})
export class RtcService {
  private dispatchRemote = new Subject<{ calls: string[], cb: () => void }>();
  private callEnd = new Subject<boolean>();
  private client: AgoraClient;
  private localStream: Stream;
  private initialized = false;
  private remoteCalls: string[] = [];
  private uid: string;

  localCallId = 'agora_local';
  callEnd$ = this.callEnd.asObservable();
  remote$ = this.dispatchRemote.asObservable();

  constructor(
    private informationService: InformationService,
    private userService: UserService,
    private ngxAgoraService: NgxAgoraService
  ) { }

  init() {
    if (this.initialized) { return; }

    this.ngxAgoraService.AgoraRTC.Logger.setLogLevel(this.ngxAgoraService.AgoraRTC.Logger.NONE);
    this.userService.user$.subscribe((user: firebase.User) => {
      if (user) {
        this.uid = user.uid;
        this.initRTC();
        this.initialized = true;
      }
    });
  }

  call(channel: string = 'channel_default') {
    this.initLocalStream(() => this.join(channel, uid => this.publish()));
  }

  endCall() {
    return new Promise(resolve => {
      this.client.leave(() => {
        if (this.localStream.isPlaying()) {
          this.localStream.stop();
          this.localStream.close();
        }
        resolve();
      });
    });
  }

  mute(enabled: boolean) {
    enabled ? this.localStream.muteAudio() : this.localStream.unmuteAudio();
  }

  dispatchCallEnd() {
    this.callEnd.next(true);
  }

  isVideoAllowed() {
    return this.ngxAgoraService.videoDevices.length > 0;
  }

  isAudioAllowed() {
    return this.ngxAgoraService.audioDevices.length > 0;
  }

  private initRTC() {
    this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
    this.localStream = this.ngxAgoraService.createStream({
      streamID: this.uid,
      audio: this.isAudioAllowed(),
      video: this.isVideoAllowed(),
      screen: false
    });

    this.initClientHandlers();
    this.initLocalStreamHandlers();
  }

  private join(channel: string, onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
    this.client.join(null, channel, this.uid, onSuccess, onFailure);
  }

  private publish(): void {
    this.client.publish(this.localStream);
  }

  private initLocalStreamHandlers(): void {
    this.localStream.on(StreamEvent.MediaAccessDenied,
      () => this.informationService.showMessage('Access Denied, please allow camera and microphone to turn on'));
  }

  private initClientHandlers(): void {
    this.client.on(ClientEvent.Error, error => {
      console.log('client_event err:', error.reason);

      if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.client.renewChannelKey('', () => console.log('renewed the channel'), err => console.error('renew channel key failed: ', err));
      }
    });

    this.client.on(ClientEvent.RemoteStreamAdded, evt => {
      const stream = evt.stream as Stream;

      this.client.subscribe(stream, { audio: true, video: true });
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, evt => {
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);

      if (!this.remoteCalls.length) {
        this.remoteCalls.push(id);
        this.dispatchRemote.next({ calls: this.remoteCalls, cb: () => stream.play(id) });
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, evt => {
      const stream = evt.stream as Stream;

      if (stream) {
        stream.stop();
        this.remoteCalls = [];
        this.dispatchRemote.next({ calls: this.remoteCalls, cb: () => console.log(`remote stream is removed ${stream.getId()}`) });
      }
    });

    this.client.on(ClientEvent.PeerLeave, evt => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call !== `${this.getRemoteId(stream)}`);
        this.dispatchRemote.next({ calls: this.remoteCalls, cb: () => console.log(`${evt.uid} left from this channel`) });
        this.endCall();
        this.dispatchCallEnd();
      }
    });
  }

  private getRemoteId(stream: Stream): string {
    return `agora_remote-${stream.getId()}`;
  }

  private initLocalStream(onSuccess?: () => any): void {
    this.remoteCalls = [];

    this.localStream.init(
      () => {
         this.localStream.play(this.localCallId);
         if (onSuccess) { onSuccess(); }
      },
      err => {
        console.log(err);
        this.informationService.showMessage('Stream initialization failed');
      }
    );
  }
}
