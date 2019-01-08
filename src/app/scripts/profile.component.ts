import { Component, OnInit } from '@angular/core';
import { UserService} from '../services';
import { Router } from '@angular/router';
import { Users } from '../../../server/model/Users';

@Component({
  selector: 'app-profile',
  templateUrl: '../views/profile.component.html'
})
export class ProfileComponent implements OnInit {
  pageName = 'Profile';
  pageHeading= 'Profile';
  model: Users = [];
  user:Users;
  data: any;
  message: any;
  constructor(private router: Router,private userService: UserService) { }
   id = localStorage.getItem('token');
  getUser() {
   this.userService.getUserbyID(this.id)
     .subscribe(user => this.user = user);
    }
    formEditProfile(form:any) {
      const data: Users = this.model;
      Object.assign(data, {_id: this.id});
      this.userService.updateUser(data)
      .subscribe(data => { this.data = data;
      });
    if (this.data = 'success') {
      this.message = 'Profile Updated Successfully';
    } else {
      this.message = 'Error in updating Profile.Please try again';
    }
    }
  ngOnInit() {
    this.getUser();
  }
}

