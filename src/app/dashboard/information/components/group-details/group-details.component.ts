import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { Lightbox } from 'ngx-lightbox';

import { AbstractLightBox } from 'src/app/dashboard/classes';
import { AuthService } from 'src/app/core/services/auth.service';
import { Group } from 'src/app/shared/models';
import { MembersComponent } from './../members/members.component';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetailsComponent extends AbstractLightBox {
  @Input() group$: Observable<Group>;
  @Output() changeImage = new EventEmitter<File>();
  @Output() closeGroup = new EventEmitter<void>();
  @Output() removeGroup = new EventEmitter<void>();

  loading = false;

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialog,
    private cdr: ChangeDetectorRef,
    protected lighbox: Lightbox
  ) {
    super(lighbox);
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

  onCloseGroup() {
    this.closeGroup.emit();
  }

  onRemoveGroup() {
    this.removeGroup.emit();
  }

  onImageChange(file: File) {
    if (file) {
      this.loading = true;
      this.changeImage.emit(file);
    }
  }

  hideLoader() {
    this.loading = false;
    this.cdr.detectChanges();
  }

}
