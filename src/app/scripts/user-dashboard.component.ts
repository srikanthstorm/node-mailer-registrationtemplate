import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../../../server/model/Users';
import { UserService } from '../services';
@Component({
  selector: 'app-user-dashboard',
  templateUrl: '../views/user-dashboard.component.html'
})
export class UserDashboardComponent implements OnInit {
pageName = 'Home';
pageHeading = 'Dashboard';
user: Users;

  constructor( private userService: UserService) { }
getUser() {
  const id = localStorage.getItem('token');
   this.userService.getUserbyID(id)
     .subscribe(user => this.user = user);
    }
  ngOnInit() {
    this.getUser();
  }
}
