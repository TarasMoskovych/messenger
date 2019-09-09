import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { UserService } from 'src/app/core/services';
import { User } from 'src/app/shared/models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  user$: BehaviorSubject<User>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user$ = this.userService.user$;
  }

  updateName() {

  }

  updatePhoto() {

  }

}
