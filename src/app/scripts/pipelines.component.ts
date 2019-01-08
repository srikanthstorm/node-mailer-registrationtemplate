import { Component, OnInit } from '@angular/core';
import { PipelinesService } from '../services';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonViewComponent} from './admin-dashboard.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AddPipelineComponent } from './add-pipeline.component';


@Component({
  selector: 'app-pipelines',
  templateUrl: '../views/pipelines.component.html'
})
export class PipelinesComponent implements OnInit {
  pageIcon = 'get_app';
pageHeadings: any = 'Pipelines';
result: any;
item: any;
style: any;
source: LocalDataSource;
settings = {
  selectMode: 'multi',
  actions: {
      add: false,
      edit: false,
      delete: true, 
      position: 'right',
      width: '10%',
      custom: [{ name: 'tag', title: `<button *ngIf="actionbutton == true" class="btn pull-right" >Start</button>`}
    ]
    },
    delete: {
      deleteButtonContent: '<button mat-button=""  *ngIf="actionbutton == true" class="btn pull-right" >Stop</button>',
      confirmDelete: true
    },
    columns: {
      name: {
        title: 'Name',
        filter: true,
        sort: true,
        width: '20%',

      },
      message: {
      title: 'Message',
      sort: true,
      width: '50%'
    },
    status: {
      title: 'Status',
      sort: true,
      width: '20%',
      type:'html',
      valuePrepareFunction: (value) => {
        if(value === 'STOPPED' || value === 'DISCONNECTED' || value === 'FINISHED'){
          return '<p class="stopped" align="center">'+value+'</p>';
        } else if( value === 'RUNNING' || value == 'FINISHING' || value === 'STARTING'){
          return '<p class="running" align="center">'+value+'</p>';
        } else if( value === 'ERROR' || value === 'RUN_ERROR' || value === 'START_ERROR'
        || value === 'STOP_ERROR' || value === 'CONNECT_ERROR' || value === 'EDITED' ){
          return '<p class="error" align="center">'+value+'</p>';
        } 
      }
    },  
  }
};
example(event){
  console.log(event);
}
openPage() {
  this.dialog.open(AddPipelineComponent, {
    width: '400px',
    height: '400px',
  }); 
  this.dialog.afterAllClosed.subscribe(() => {
    // update a variable or call a function when the dialog closes
     this.getStatus();
    });
}
  constructor( public dialog: MatDialog,private pipelinesService: PipelinesService) { }

  getStatus() {
    this.pipelinesService.getStatus()
    .subscribe(result => {
      this.result = result;
      this.item = Object.values(JSON.parse(this.result));
      this.source = new LocalDataSource(this.item);
     // console.log(this.item)
    }, err => {
      console.log(err);
  });
}  
startPipeline(event){
  this.item = event.data;
  this.pipelinesService.startStatus(this.item.pipelineId)
       .subscribe(item => { this.item = item;
          alert(this.item.status);
          if(this.item.status != null){
            this.getStatus();
          }
       });
}
stopPipeline(event){
  this.item = event.data;
  this.pipelinesService.stopStatus(this.item.pipelineId)
       .subscribe(item => { this.item = item;
          alert(this.item.status);
          if(this.item.status != null){
            this.getStatus();
          }
       });
}
  ngOnInit() {
  this.getStatus();
  }
  onSearch(query: string = '') {
    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'name',
        search: query
      }, {
        field: 'message',
        search: query
      }, {
        field: 'status',
        search: query
      }], false); 
};
}
