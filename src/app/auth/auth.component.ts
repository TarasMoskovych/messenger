import { Component, OnInit } from '@angular/core';

import { RtcService } from '../core/services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  constructor(private rtc: RtcService) { }

  ngOnInit() {
    this.rtc.init();
  }
}
