import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/auth.service';


// Need to be imported for the bootstrap JS code to work (open dropdowns...)
// here we comment it out and do this JS work manually in a @Dropdown() directive
// import '../../node_modules/bootstrap/dist/js/bootstrap.bundle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // try to automatically login using user info stored in local storage
    this.authService.autoLogin();
  }
}
