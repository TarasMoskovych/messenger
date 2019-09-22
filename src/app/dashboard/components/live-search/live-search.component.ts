import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-live-search',
  templateUrl: './live-search.component.html',
  styleUrls: ['./live-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveSearchComponent {
  @Output() searchUser = new EventEmitter<string>();

  onUserSearch(email: string) {
    this.searchUser.emit(email);
  }

}
