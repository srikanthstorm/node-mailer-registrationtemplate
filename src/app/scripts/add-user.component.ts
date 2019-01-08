import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../../../server/model/Users';
import { UserService } from '../services';

@Component({
  selector: 'app-add-user',
  templateUrl: '../views/add-user.component.html'
})
export class AddUserComponent implements OnInit {
  showDetail =true;
  showPassword = false;
  message: string;
  returnUrl: string;
  model: any = {};
  addNew = false;
  data: Users;
  constructor( private router: Router, public userService: UserService ) { }
  next() {
    this.showPassword = true;
    this.showDetail = false;
  }
  back() {
    this.showPassword = false;
    this.showDetail = true;
  } 
  formAddUser(form: any) {
    const user: Users = this.model;
    Object.assign(user, {user_type: 'user'});
    Object.assign(user,{user_status: 'active'});
    this.userService.addUser(user)
      .subscribe(data => { this.data = data;
      });
    if (this.data = 'success') {
      this.message = 'Account created successfully. Login in now to set your preferences';
    } else {
      this.message = 'Error in signing Up.Please try again';
    }
  
  }

  ngOnInit() {
  }

}
