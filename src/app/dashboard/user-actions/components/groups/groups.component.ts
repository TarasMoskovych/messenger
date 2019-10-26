import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { GroupService, ChatService } from 'src/app/core/services';
import { Group } from 'src/app/shared/models';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent implements OnInit, OnDestroy {
  @Input() groups: Group[];
  @Output() addGroup = new EventEmitter<string>();

  adding = false;
  selected: Group;
  form: FormGroup;
  sub: Subscription;

  constructor(
    private groupService: GroupService,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.select();
    this.buildForm();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onAddGroup() {
    this.addGroup.emit(this.form.value.name);
    this.onToggleForm();
    this.form.reset();
  }

  onOpenGroup(group: Group) {
    if (this.groupService.selectedGroup && this.groupService.selectedGroup.name === group.name) { return; }

    this.groupService.select(group);
    this.chatService.close();
  }

  onRefresh() {

  }

  onToggleForm() {
    this.adding = !this.adding;
  }

  private buildForm() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required])
    });
  }

  private select() {
    this.sub = this.groupService.selectedGroup$.subscribe((group: Group) => {
      this.selected = group;
      this.cdr.detectChanges();
    });
  }

}
