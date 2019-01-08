import { AfterViewInit, Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { Rssfeed } from '../../../server/model/rssfeed';
import { Source } from '../../../server/model/source';
import {RssfeedService, SourcesService} from '../services';
import { TagFeedComponent } from './tag-feed.component';
import { Globals }  from '../global';
import { ButtonViewComponent } from './admin-dashboard.component';
import { SimpleDateComponent } from './admin-dashboard.component';
import { Subscription, timer, pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';
declare const $: any;

@Component({
  selector: 'app-admin-dashboard2',
  templateUrl: '../views/admin-dashboard2.component.html'
})
export class AdminDashboard2Component implements OnInit {
  statuss = [
    {value: 'untagged', viewValue: 'Untagged'},
    {value: 'tagged', viewValue: 'Tagged'},
    {value: 'ignored', viewValue: 'Ignored'},
    {value: 'mailed', viewValue: 'Mailed'}
  ];
  byDate = [
    {value: '1', viewValue: 'Last 24 hours'},
    {value: '2', viewValue: 'Last 2 days'},
    {value: '3', viewValue: 'Last 3 days'},
    /* {value: 'all', viewValue: 'All Days'}  */
  ]
  pageName = 'Home';
  pageHeadings = 'Latest Feeds ';
  pageIcon = 'view_list';
  feeds: Rssfeed;
  rssfeed: Rssfeed;
  sources: Source;
  source: LocalDataSource;   
  info: any; settings: any;  article: any;  status: any;  date: any;
  source_name: any;  newVariable: any; selectedItem: any;
  ignore: any[] = new Array();
  showAllFeeds = true; showNew = true; showIgnoreAll = true; showEmail = false;
  subscription: Subscription;
  statusText: any;
  private sidebarOpen: boolean = true; fullwidth = false;
  constructor(private router: Router, private rssfeedService: RssfeedService,private sourcesService: SourcesService,
    public dialog: MatDialog,private globals: Globals) {
 
}
toggleSideBar() {
  this.sidebarOpen = !this.sidebarOpen;
  this.fullwidth = !this.fullwidth;
 }
getbyStatus(event){
  this.status =  event;
  this.getRssFeed();
  return this.status;
  
}
getbyArticle(event){
 this.showAllFeeds = false;
  event.active = !event.active;  
  
  this.article =  event._id;
  this.getRssFeed();
    this.selectedItem = event; 
  
 
  return this.article;
}
getbyDate(event){
  this.date =  event;
  this.getRssFeed();
  return this.date;
}
getRssFeed(){
  if (typeof(this.status) == "undefined"){
    this.status = 'untagged';
  } else {
    this.status =  this.status;
  }
  if (typeof(this.date) == "undefined"){
    this.date = '3';
  } else {
    this.date =  this.date;
  }
  if (typeof(this.article) == "undefined"){
    this.article = 'All';
  } else {
    this.article =  this.article;
  }
  this.rssfeedService.mainPage(this.status,this.article,this.date)
  .subscribe(data => {
    this.source = new LocalDataSource(data);
  }, err => {
    console.log(err);
  });
  if( this.status == 'untagged'){
    this.settings = {
      selectMode: 'multi',
      actions: {
          add: false,
          edit: false,
          delete: true, 
          position: 'right',
          width: '15%',
          custom: [{ name: 'tag', title: `<button *ngIf="actionbutton == true" class="btn pull-right" >Tag</button>`}
        ]
        },
        delete: {
          deleteButtonContent: '<button mat-button=""  *ngIf="actionbutton == true" class="btn pull-right">Ignore</button>',
          confirmDelete: true
        },
        columns: {
          articles_title: {
            title: 'Title',
            filter: true,
            sort: true,
            width: '18%',
            type: 'custom',
            renderComponent: ButtonViewComponent,
            onComponentInitFunction(instance) {
              instance.save.subscribe(row => {
                window.open(`${row.articles_url}`)
              });
            }
          },
          articles_publishedAt: {
            title: 'Article Date',
            sort: true,
            width: '15%',
            type: 'custom',
            renderComponent: SimpleDateComponent
          },
        articles_description: {
          title: 'Description',
          sort: true,
          width: '30%',
          type: 'html',
          valuePrepareFunction: (value) => {
            const array = value.split(">");
            if(array.length == 1){
              return '<p align="center">'+array[0]+'</p>';
            } else{
              const url1 = array[1].replace(`<div class="feedflare"`,'');
              return '<p align="center">'+url1+'</p>';  
            }
           }
        },  /* 
        articles_author: {
          title: 'Author',
          sort: true,
          width: '12%'
        }, */ 
        keyword: {
          title: 'Keywords',
          sort: true,
          width: '10%'
        },
        stockcode: {
          title: 'Stock Code',
          sort: true,
          width: '10%'
        },  
      }
};
  } else if( this.status == 'tagged') {
    this.showEmail = true;
    this.showIgnoreAll = true;
    this.settings = {
      selectMode: 'multi',
      actions: {
          add: false,
          edit: false,
          delete: true, 
          position: 'right',
          width: '14%',
          custom: [{ name: 'tag', title: `<button *ngIf="actionbutton == true" class="btn pull-right" >Tag</button>`}]
        },
        delete: {
          deleteButtonContent: '<button mat-button=""  *ngIf="actionbutton == true" class="btn pull-right" >Ignore</button>',
          confirmDelete: true
        },
      columns: {
          articles_title: {
          title: 'Title',
          filter: true,
          sort: true,
          width: '14%',
          type: 'custom',
          renderComponent: ButtonViewComponent,
          onComponentInitFunction(instance) {
            instance.save.subscribe(row => {
              window.open(`${row.articles_url}`)
            });
          }
        },
        articles_publishedAt: {
          title: 'Article Date',
          sort: true,
          width: '15%',
          type: 'custom',
          renderComponent: SimpleDateComponent
        },
        articles_description: {
          title: 'Description',
          sort: true,
          width: '20%'
        },/* 
        articles_author: {
          title: 'Author',
          sort: true,
          width: '11%'
        }, */
        primary_keyword: {
          title: 'Primary Keyword',
          sort: true,
          width: '10%',
          valuePrepareFunction: (value) => {
            if(value == 'undefined' || value === null ){
              return '';
            } else {
              return value;
            } 
          }
        },
        keyword: {
          title: 'Other Keywords',
          sort: true,
          width: '11%',
          valuePrepareFunction: (value) => {
            if(value == 'undefined' || value === null ){
              return '';
            } else {
              return value;
            } 
          }
        },
        stockcode: {
          title: 'Stock Code',
          sort: true,
          width: '10%',
          valuePrepareFunction: (value) => {
            if(value == 'undefined' || value == null ){
              return '';
            } else {
              return value;
            } 
          }
        },
        
      }
    };
  } else if ( this.status == 'ignored') {
    this.showIgnoreAll = false;
    this.showEmail = false;
    this.settings = {
      selectMode: 'none',
      actions: {
          add: false,
          edit: false,
          delete: false, 
           position: 'right',
           width: '10%',
           custom: [{ name: 'tag', title: `<button *ngIf="actionbutton == true" class="btn pull-right" >Tag</button>`}]
        },
        delete: {
          deleteButtonContent: '<button mat-button=""  *ngIf="actionbutton == true" class="btn pull-right" >Ignore</button>',
          confirmDelete: true
        },
      columns: {
        articles_title: {
          title: 'Title',
          filter: true,
          sort: true,
          width: '18%',
          type: 'custom',
          renderComponent: ButtonViewComponent,
          onComponentInitFunction(instance) {
            instance.save.subscribe(row => {
              window.open(`${row.articles_url}`)
            });
          }
        },
        articles_publishedAt: {
          title: 'Article Date',
          sort: true,
          width: '15%',
          type: 'custom',
          renderComponent: SimpleDateComponent
        },
        articles_description: {
          title: 'Description',
          sort: true,
          width: '30%'
        },
       /*  articles_author: {
          title: 'Author',
          sort: true,
          width: '10%'
        }, */
        primary_keyword: {
          title: 'Primary Keyword',
          sort: true,
          width: '10%',
          valuePrepareFunction: (value) => {
            if(value == 'undefined' || value === null ){
              return '';
            } else {
              return value;
            } 
          }
        },
        keyword: {
          title: 'Other Keywords',
          sort: true,
          width: '10%',
          valuePrepareFunction: (value) => {
            if(value == 'undefined' || value === null ){
              return '';
            } else {
              return value;
            } 
          }
        },
        stockcode: {
          title: 'Stock Code',
          sort: true,
          width: '10%',
          valuePrepareFunction: (value) => {
            if(value == 'undefined' || value == null ){
              return '';
            } else {
              return value;
            } 
          }
        },
      }
    };
  } else if ( this.status == 'mailed') {
    this.showIgnoreAll = true;
    this.showEmail = false;
    this.settings = {
      selectMode: 'multi',
      actions: {
        add: false,
        edit: false,
        delete: true, 
        position: 'right',
        width: '15%',
        custom: [{ name: 'tag', title: `<button *ngIf="actionbutton == true" class="btn pull-right" >Tag</button>`}
      ]
      },
        delete: {
          deleteButtonContent: '<button mat-button=""  *ngIf="actionbutton == true" class="btn pull-right" >Ignore</button>',
          confirmDelete: true
        },
      columns: {
        articles_title: {
          title: 'Title',
          filter: true,
          sort: true,
          width: '18%',
          type: 'custom',
          renderComponent: ButtonViewComponent,
          onComponentInitFunction(instance) {
            instance.save.subscribe(row => {
              window.open(`${row.articles_url}`)
            });
          }
        },
        articles_publishedAt: {
          title: 'Article Date',
          sort: true,
          width: '15%',
          type: 'custom',
          renderComponent: SimpleDateComponent
        },
        articles_description: {
          title: 'Description',
          sort: true,
          width: '20%'
        },/* 
        articles_author: {
          title: 'Author',
          sort: true,
          width: '10%'
        }, */
        primary_keyword: {
          title: 'Primary Keyword',
          sort: true,
          width: '10%',
          valuePrepareFunction: (value) => {
            if(value == 'undefined' || value === null ){
              return '';
            } else {
              return value;
            } 
          }
        },
        keyword: {
          title: 'Other Keywords',
          sort: true,
          width: '11%',
          valuePrepareFunction: (value) => {
            if(value == 'undefined' || value === null ){
              return '';
            } else {
              return value;
            } 
          }
        },
        stockcode: {
          title: 'Stock Code',
          sort: true,
          width: '10%',
          valuePrepareFunction: (value) => {
            if(value == 'undefined' || value == null ){
              return '';
            } else {
              return value;
            } 
          }
        },
      }
    };
  }

}
getTotalCount(){
  return new Promise(resolve => {
    this.rssfeedService.countTotalFeeds()
    .subscribe(feeds => {
      this.newVariable = feeds; 
      resolve(this.newVariable); 
       }, err => {
      console.log(err);
    });
  });
}
getCount(){
  this.getTotalCount().then(data => {
    this.newVariable =  data;
    this.rssfeedService.countSources()
    .subscribe(feeds => {
     this.feeds = feeds;
     this.feeds.unshift(this.newVariable);
      }, err => {
     console.log(err);
    });
  })
}
autoTagFeeds(){
  this.rssfeedService.autoTagFeeds()
    .subscribe(info => { this.info = info;
    });
  if (this.info = 'success') {
    alert('AutoTagging is completed for the New Stories');
  } else {
    alert('Error Occured. Please try again');
  
  }
}
tagFeed(event) {
  const data = event.data;
   this.dialog.open(TagFeedComponent, {
      width: '1250px',
      height: '750px',
      data: {'id': data._id}
  }); 
  this.dialog.afterAllClosed.subscribe(() => {
    // update a variable or call a function when the dialog closes
     this.getRssFeed();
    });
}
/* Ignore feed */
delete(event) {
  const data = event.data;
this.rssfeedService.ignoreFeed(data._id)
.subscribe(info => { this.info = info;
    alert(this.info.status);
    if(this.info.result != null){
      this.getRssFeed();
     
    }
});
}
onUserRowSelect(event){
  const data = event.selected;
  for (let i = 0; i < data.length; i++) {
    this.ignore.push(data[i]._id);
  }
  }
ignoreMany(){
 const myNewList =  Array.from(new Set(this.ignore)); 
  this.rssfeedService.ignoreManyFeeds(myNewList)
  .subscribe(info => { this.info = info;
     alert("Selected Feeds Ignored");
     this.getRssFeed();
  });
}
sendEmail() {
  const myNewList =  Array.from(new Set(this.ignore)); 
    this.rssfeedService.sendEmail(myNewList)
        .subscribe(info => {
            this.info = info;
            if(this.info.status == 'success'){
             alert('Emails sent successfully'); 
            }
            else {
              alert('Email already sent for the selected feed');
            }
        }); 
        this.getRssFeed();
}
ngOnInit() { 
//  this.getArticles();
this.selectedItem = 'All'; 
 this.getRssFeed();
 this.getCount();
 //this.getTotalCount();
 const $sidebar = $('#sidebar');
 const $maiHeight = $('.table').height();
 $sidebar.attr('height', $maiHeight );

/*  this.subscription = timer(0, 10000).pipe(
  switchMap(() => this.rssfeedService.testFunction())
).subscribe(result => { this.statusText = result; console.log(this.statusText);}); */
}
//search in table
onSearch(query: string = '') {
    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'title_0_value',
        search: query
      }, {
        field: 'link_0_value',
        search: query
      }, {
        field: 'pubDate_0_value',
        search: query
      }, {
        field: 'description_0_value',
        search: query
      }, {
      field: 'status',
      search: query
      }, {
        field: 'keyword',
        search: query
      }, {
        field: 'stockCode',
        search: query
      }], false); 
};
}
