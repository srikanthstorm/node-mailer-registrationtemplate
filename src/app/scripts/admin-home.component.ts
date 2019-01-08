import { Component, OnInit } from '@angular/core';
import { LoginService, UserService, PipelinesService, RssfeedService} from '../services';
import { Router } from '@angular/router';
import { Users } from '../../../server/model/Users';
declare var $: any;
@Component({
  selector: 'app-admin-home',
  templateUrl: '../views/admin-home.component.html'
})
export class AdminHomeComponent implements OnInit {
 user: Users;
 pipeline: any;
 info: any;
 showDropdown = false;
 navbarOpen = false;
 hideHR = true;
 pipelines: any[];
 toggleNavbar() {
  this.navbarOpen = !this.navbarOpen;
  this.hideHR = false;
}

  toggle() {
    this.showDropdown =!this.showDropdown;
  }
  constructor(private router: Router, private loginService: LoginService,private userService: UserService, private pipelinesService: PipelinesService, private rssfeedService: RssfeedService) { }
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
    checkPipelines(){
      this.pipelinesService.getStatus()
     .subscribe(user => {this.user = user;
      this.pipelines = Object.values(JSON.parse(this.user)) ;
    //  console.log(pipelines);
      for(let i=0; i<this.pipelines.length; i++){
        if(this.pipelines[i].status == 'RUNNING'){
       // console.log(this.pipelines[i].pipelineId);
        this.pipelinesService.stopStatus(this.pipelines[i].pipelineId)
        .subscribe(pipeline => { this.pipeline = pipeline});
        }
      } 
     });
     this.rssfeedService.autoTagFeeds()
    .subscribe(info => { this.info = info;
    });
  if (this.info = 'success') {
    //console.log('AutoTagging is completed for the New Stories');
  } else {
   // console.log('Error Occured. Please try again');
  
  }
    
    }
  ngOnInit() {
    this.getUser();
    
    setInterval(() => {
       this.checkPipelines();
   },  60000);
  }

 
}

