import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Group } from 'src/app/shared/models';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent implements OnInit {
  @Input() groups: Group[];
  @Output() addGroup = new EventEmitter<string>();

  adding = false;
  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.buildForm();
  }

  onAddGroup() {
    this.addGroup.emit(this.form.value.name);
    this.onToggleForm();
    this.form.reset();
  }

  onOpenGroup(group: Group) {
    console.log(group);
  }

  onRefresh() {

  }

  onToggleForm() {
    this.adding = !this.adding;
  }

  onUpdatePhoto(file: File) {

  }

  private buildForm() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required])
    });
  }

}
