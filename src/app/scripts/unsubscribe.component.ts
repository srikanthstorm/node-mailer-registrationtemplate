import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-unsubscribe',
  templateUrl: '../views/unsubscribe.component.html'
})
export class UnsubscribeComponent implements OnInit {
  data: any;
  message: any;
  pageName = 'Unsubscribe';
  showButton = true;
  showMessage = false;
  constructor(private userService: UserService) { }
  unsubscribe() {
    const id = localStorage.getItem('token');
    this.userService.deactivateUser(id)
    .subscribe(data => { this.data = data;
    });
    console.log(this.data);
  if (this.data = 'success') {
    this.message = 'Account Deactivated Successfully';
  } else {
    this.message = 'Error in deactivating Profile.Please try again';
  }
    this.showButton == false;
    this.showMessage == true;
  }
  ngOnInit() {
  }

}
