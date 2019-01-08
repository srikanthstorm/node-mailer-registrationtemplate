import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Users } from '../../../server/model/Users';
import { UserService } from '../services';
import { Globals }  from '../global';

@Component({
  selector: 'app-manage-users',
  templateUrl: '../views/admin-dashboard.component.html'
})
export class ManageUsersComponent implements OnInit {
  statuss = this.globals.statuss;
  pageName = 'Manage Users';
  pageHeadings = 'Users';
  pageIcon = 'group';
  showIgnoreAll = true;
  showDate = false;
  showNew = false;
  startPipeline = false;
  ignore: any[] = new Array();
  status: any;
  info: any;
  users: Users;
  source: LocalDataSource;
  settings:any;
  ignoreTitle = 'Deleted Selected';
  ngOnInit() {
  }
  ngOnChanges(){
  this.getUsers();
  }
  constructor(private route: ActivatedRoute, private router: Router, 
    private userService: UserService, private globals: Globals) { 
     this.getUsers();
    }
    getUsers(){
      if (typeof(this.status) == "undefined"){
        this.status = 'active';
      } else {
        this.status =  this.status;
      }
      this.userService.getUsersbyStatus(this.status)
      .subscribe(data => {
        this.source = new LocalDataSource(data);
    }, err => {
        console.log(err);
    });
    if(this.status == 'deactive') {
      this.showIgnoreAll = false;
      this.settings = {
        selectMode: 'none',
        actions: {
          delete: false,
          edit: false,
          add: false,
          position: 'right',
          width: '10%',
          custom: [{ name: 'tag', title: `<button *ngIf="actionbutton == true" class="btn pull-right" >Re-activate</button>`}]
        },
        delete: {
          deleteButtonContent: '<button mat-button="" class="login100-form-btn m-b-3">Delete</button>',
          confirmDelete: true
        },
        edit: {
          confirmEdit: true
        },
        columns: {
          user_fname: {
            title: 'First Name',
            filter: true,
            sort: true,
            width: '10%'
          },
          user_lname: {
            title: 'Last Name',
            sort: true,
            width: '10%'
          },
          user_businessname: {
            title: 'Business Name',
            sort: true,
            width: '10%'
          },
          user_businessEmail: {
            title: 'Email ID',
            sort: true,
            width: '12%'
          },
          user_businessphone1: {
            title: 'Phone Number',
            sort: true,
            width: '10%'
          },
          user_city: {
            title: 'City',
            sort: true,
            width: '10%'
          },
          user_state: {
            title: 'State',
            sort: true,
            width: '10%'
          },
          user_country: {
            title: 'Country',
            sort: true,
            width: '10%'
          },
          user_zip: {
            title: 'Zip Code',
            sort: true,
            width: '7%'
          }
        }
      };
    } else {
      this.settings = {
        selectMode: 'multi',
        actions: {
          delete: true,
          edit: true,
          add: false,
          position: 'right',
          width: '8%',
        },
        delete: {
          deleteButtonContent: '<button mat-button="" class="login100-form-btn m-b-3">Delete</button>',
          confirmDelete: true
        },
        edit: {
          confirmSave: true
        },
        columns: {
          user_fname: {
            title: 'First Name',
            filter: true,
            sort: true,
            width: '12%'
          },
          user_lname: {
            title: 'Last Name',
            sort: true,
            width: '10%'
          },
          user_businessname: {
            title: 'Business Name',
            sort: true,
            width: '12%'
          },
          user_businessEmail: {
            title: 'Email ID',
            sort: true,
            width: '14%'
          },
          user_businessphone1: {
            title: 'Phone Number',
            sort: true,
            width: '10%'
          },
          user_city: {
            title: 'City',
            sort: true,
            width: '8%'
          },
          user_state: {
            title: 'State',
            sort: true,
            width: '8%'
          },
          user_country: {
            title: 'Country',
            sort: true,
            width: '8%'
          },
          user_zip: {
            title: 'Zip Code',
            sort: true,
            width: '8%'
          }
        }
      };
    }
    }
    getbyStatus(event){
      this.status =  event;
      this.getUsers();
      return this.status;
    }
  
    onUserRowSelect(event){
      const data = event.selected;
      for (let i = 0; i < data.length; i++) {
        this.ignore.push(data[i]._id);
      }
      }
      ignoreMany(){
        const myNewList =  Array.from(new Set(this.ignore )); 
         this.userService.deactivateMany(myNewList)
         .subscribe(info => { this.info = info;
            alert(this.info.status);
            if(this.info.status != null){
              this.getUsers();
            }
         });
       }

    delete(event) {
      const data = event.data;
      this.userService.deactivateUser(data._id)
      .subscribe(info => { this.info = info;
          this.info = info;
          alert(this.info.status);
          if(this.info.result != null){
            this.getUsers();
          }
      });
    }
    //re activate user
    tagFeed(event) {
      const data = event.data;
      this.userService.reactivateUser(data._id)
      .subscribe(info => { this.info = info;
          this.info = info;
          alert(this.info.status);
          if(this.info.result != null){
            this.getUsers();
          }
      });
    }
    updateRecord(event) {
      const data = { _id : event.newData._id, user_fname: event.newData.user_fname, 
        user_lname:event.newData.user_lname, user_businessname:event.newData.user_businessname, 
        user_businessEmail: event.newData.user_businessEmail,user_businessphone1: event.newData.user_businessphone1,
        user_businessphone2: event.newData.user_businessphone2, user_address: event.newData.user_address, 
        user_city: event.newData.user_city, user_state:event.newData.user_state, user_country:event.newData.user_country,
        user_zip: event.newData.user_zip };
        console.log(data);
       this.userService.updateUser(data)
      .subscribe(info => { this.info = info;
      this.info = info;
      alert(this.info.status);
      if(this.info.source != null){
        this.getUsers();
      }
      }); 
      this.getUsers();
    } 
    onSearch(query: string = '') {
      this.source.setFilter([
        // fields we want to include in the search
        {
          field: 'user_fname',
          search: query
        }, {
          field: 'user_lname',
          search: query
        }, {
          field: 'user_businessname',
          search: query
        }, {
          field: 'user_businessEmail',
          search: query
        }, {
        field: 'user_businessphone1',
        search: query
        }, {
          field: 'user_city',
          search: query
        },
        , {
          field: 'user_state',
          search: query
        }, {
        field: 'user_country',
        search: query
        }, {
          field: 'user_zip',
          search: query
        }], false); 
  };
}

