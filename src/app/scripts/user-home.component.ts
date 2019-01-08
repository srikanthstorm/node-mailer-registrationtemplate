import { Component, OnInit } from '@angular/core';
import { LoginService, UserService} from '../services';
import { Router } from '@angular/router';
import { Users } from '../../../server/model/Users';
declare var $: any;
@Component({
  selector: 'app-user-home',
  templateUrl: '../views/user-home.component.html'
})
export class UserHomeComponent implements OnInit {
  user: Users;
  showDropdown = false;
  navbarOpen = false;
  hideHR = true;
  toggleNavbar() {
   this.navbarOpen = !this.navbarOpen;
   this.hideHR = false;
 }
 
   toggle() {
     this.showDropdown =!this.showDropdown;
   }
  constructor(private router: Router, private loginService: LoginService, private userService: UserService) { }
  logout(): void {
    this.loginService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
}
getUser() {
  const id = localStorage.getItem('token');
   this.userService.getUserbyID(id)
     .subscribe(user => this.user = user);
    }
  ngOnInit() {
    this.getUser();
    $(function(){ 
      var navMain = $("#navbar");
      navMain.on("click", "a", null, function () {
          navMain.collapse('hide');
      });
  });
}
}
