import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';
import { Group } from 'src/app/shared/models';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetailsComponent implements OnInit {
  @Input() group$: Observable<Group>;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  isOwner(group: Group) {
    return this.authService.user.email === group.creator;
  }

}
