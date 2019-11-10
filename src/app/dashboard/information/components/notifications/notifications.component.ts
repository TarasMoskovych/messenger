import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Notification, User } from 'src/app/shared/models';
import { NotificationService } from 'src/app/core/services';
import { takeUntil, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Input() user$: Observable<User>;
  @Output() selectNotification = new EventEmitter<Notification>();

  private destroy$ = new Subject<boolean>();

  notifications: Notification[] = [];
  user: User;

  constructor(private notificationService: NotificationService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.onUserChange();
    this.getNotifications();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onNotificationClick(notification: Notification) {
    this.selectNotification.emit(notification)
  }

  private onUserChange() {
    this.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User) => {
        this.user = user;

        if (!user) { return; }

        this.clearNotifications(user);
      });
  }

  private getNotifications() {
    this.notificationService.get()
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(200)
      )
      .subscribe((notifications: Notification[]) => {
        if (!this.user) {
          this.notifications = notifications;
        } else {
          this.notifications = notifications.filter((n: Notification) => n.senderEmail !== this.user.email);
        }

        this.setLength();
        this.cdr.detectChanges();
      });
  }

  private clearNotifications(user: User) {
    const predicate = this.notifications.find((n: Notification) => n.senderEmail === user.email);

    if (predicate) { this.notificationService.clear(user); }
  }

  private setLength() {
    this.notificationService.setLength(this.notifications.length);
  }

}
