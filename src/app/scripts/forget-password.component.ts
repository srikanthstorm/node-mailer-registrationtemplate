import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../../../server/model/Users';
import { UserService } from '../services';

@Component({
  selector: 'app-forget-password',
  templateUrl: '../views/forget-password.component.html'
})
export class ForgetPasswordComponent implements OnInit {
  model: any = {};
  addNew = false;
  data: Users;
  info: any;
  message: any;
  constructor( private router: Router, public userService: UserService ) { }

  formUpdatePassword() {
  this.data = {username: this.model.username, password: this.model.password};
    this.userService.updatePassword(this.data)
    .subscribe(data => { this.data = data;
    });
  if (this.data = 'success') {
    this.message = 'Password Updated Successfully. You can Login in now';
  } else {
    this.message = 'Error in Restting Password.Please try again';
  }
  }
  ngOnInit() {
  }

}
