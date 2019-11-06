import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Notification, User } from 'src/app/shared/models';
import { NotificationService } from 'src/app/core/services';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Input() user$: Observable<User>;

  private sub: Subscription;

  notifications$: Observable<Notification[]>;
  user: User;

  constructor(private notificationService: NotificationService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.onUserChange();
    this.notifications$ = this.notificationService.get();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // @TODO: Fix this
  private onUserChange() {
    this.sub = this.user$.subscribe((user: User) => {
      this.cdr.detectChanges();

      if (this.user) {
        this.notificationService.clear(this.user).then(() => {
          this.cdr.detectChanges();
        });
      }

      if (!user) { this.cdr.detectChanges(); }

      this.user = user;
    });
  }

}
