import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';

import { AbstractLightBox } from 'src/app/dashboard/classes';
import { AuthService } from 'src/app/core/services/auth.service';
import { Group } from 'src/app/shared/models';
import { MembersComponent } from './../members/members.component';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetailsComponent extends AbstractLightBox implements OnInit {
  @Input() group$: Observable<Group>;

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialog,
    protected lighbox: Lightbox
  ) {
    super(lighbox);
  }

  ngOnInit() {
  }

  onOpenMembers() {
    this.dialogRef.open(MembersComponent, {
      height: 'auto'
    });
  }

  isOwner(group: Group) {
    return this.authService.user.email === group.creator;
  }

  onGroupClick(group: Group) {
    this.openImg({ email: group.conversationId, displayName: group.name, photoURL: group.image });
  }

}
