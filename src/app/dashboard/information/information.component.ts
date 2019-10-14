import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ChatService } from 'src/app/core/services';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  friend$: Observable<User>;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.getFriendInfo();
  }

  onCloseChat() {
    this.chatService.close();
  }

  onCall(user: User) {
    console.log(user);
  }

  private getFriendInfo() {
    this.friend$ = this.chatService.selectedUser$;
  }

}
