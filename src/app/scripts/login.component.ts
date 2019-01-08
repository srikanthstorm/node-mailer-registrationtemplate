import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../../../server/model/Users';
import { LoginService } from '../services';

@Component({
  selector: 'app-login',
  templateUrl: '../views/login.component.html'
})
export class LoginComponent implements OnInit {
  message: string;
  returnUrl: string;
  constructor( private router: Router, public loginService: LoginService ) { }
  model: any = {};
  data: Users;
  formLogin(form: any) {
    this.loginService.login(form.username, form.password)
      .subscribe(
        data => { this.data = data;
          if ( this.data.length !== 0) {
            for (let i = 0; i < this.data.length; i++) {
             // console.log(this.data[i].username,this.data[i].password);
              if (this.data[i].username === form.username && this.data[i].password === form.password && data[i].user_type === 'admin') {
               const user_id = this.data[i]._id;
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('token', user_id);
                this.router.navigate(['/adminHome']);
              } else if (this.data[i].username === form.username && this.data[i].password === form.password && data[i].user_type === 'user') {
                const user_id = this.data[i]._id;
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('token', user_id);
                this.router.navigate(['/userHome']);
              }
              else if(this.data.isEmpty()){
                this.message = 'SignIn failed. Please try again ';
              }
            }
          } else if(this.data.length == 0) {
            this.message = 'Please check your username and password';
          }
        },
        error => {
          console.log(error);
        });
  }
  ngOnInit() {
    this.loginService.logout();
  }

}

