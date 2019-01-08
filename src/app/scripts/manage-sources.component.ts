import { AfterViewInit, Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Source } from '../../../server/model/source';
import {SourcesService, PipelinesService} from '../services';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AddSourceComponent } from './add-source.component';
import { PipelineStatusComponent } from './pipeline-status.component';
import { Globals }  from '../global';

@Component({
  selector: 'button-view',
  template: `
    <button (click)="openStatus(value)" class="blue">Status</button>
  `,
})
export class ButtonView1Component implements  OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();
  constructor(public dialog: MatDialog) { 
     }
  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
    }

  openStatus(rowData) {
    const data = this.rowData;
       this.dialog.open(PipelineStatusComponent, {
        width: '600px',
        height: '350px',
        data: {'pipeline': data}
    });  
    this.dialog.afterAllClosed.subscribe(() => {
      // update a variable or call a function when the dialog closes
      
      });
  }
}

@Component({
  selector: 'app-manage-sources',
  templateUrl: '../views/admin-dashboard.component.html'
})
export class ManageSourcesComponent implements OnInit {
  pageName = 'Manage Sources ';
  pageHeadings = 'Sources';
  pageIcon = 'cloud_download';
  ignoreTitle = 'Delete Selected';
  selectSource = false;
  showDate = false;
  showNew = true;
  startPipeline = true;
  statuss = this.globals.statuss;
  status: any;
  info: any;
  ignore: any[] = new Array();
  showIgnoreAll = true;
  source: Source;
  data: LocalDataSource;
    settings:any;
      ngOnInit() { 
        this.getSources();
      }
      openPage() {
        this.dialog.open(AddSourceComponent, {
          width: '650px',
          height: '525px',
        }); 
        this.dialog.afterAllClosed.subscribe(() => {
          // update a variable or call a function when the dialog closes
           this.getSources();
          });
      }
  constructor(private route: ActivatedRoute, private router: Router, 
    private sourcesService: SourcesService,private pipelinesService: PipelinesService,  public dialog: MatDialog, private globals:Globals) { 
     }
    getSources(){
      if (typeof(this.status) == "undefined"){
        this.status = 'active';
      } else {
        this.status =  this.status;
      }
      this.sourcesService.getSourcebyStatus(this.status)
      .subscribe(data => {
        this.source = new LocalDataSource(data);
       
    }, err => {
        console.log(err);
    });
    if( this.status == 'deactive') {
      this.showIgnoreAll = false;
      this.settings = {
        selectMode: 'none',
        actions: {
          delete: false,
          edit: false,
          add: false,
     position: 'right',
          width: '7%',
          custom: [{ name: 'tag', title: `<button *ngIf="actionbutton == true" class="btn pull-right" >Re-activate</button>`}]
        },
        
        delete: {
          deleteButtonContent: '<button mat-button="" class="login100-form-btn m-b-3">Delete</button>',
          confirmDelete: true
        },
        edit: {
          confirmSave: true
        },
        columns: {
          source_name: {
            title: 'Name',
            filter: true,
            sort: true,
            width: '15%'
          },
          source_abbreviation: {
            title: 'Abbreviation',
            sort: true,
            width: '8%'
          },
          source_heading: {
            title: 'Heading',
            sort: true,
            width: '15%'
          },
          link: {
            title: 'Source',
            sort: true,
            width: '22%'
          },
          
          api_key: {
            title: 'Api Key',
            sort: true,
            width: '12%'
          },
          source_type: {
            title: 'Type',
            sort: true,
            width: '10%'
          },
          
        }
      };
    } else {
      this.showIgnoreAll = true;
      this.settings = {
        selectMode: 'multi',
        actions: {
          delete: true,
          edit: true,
          add: false,
          position: 'right',
          width: '12%',
         },
        
        delete: {
          deleteButtonContent: '<button mat-button="" class="login100-form-btn m-b-3">Delete</button>',
          confirmDelete: true
        },
        edit: {
          confirmSave: true
        },
        columns: {
          source_name: {
            title: 'Name',
            filter: true,
            sort: true,
            width: '15%'
          },
          source_abbreviation: {
            title: 'Abbreviation',
            sort: true,
            width: '8%'
          },
          source_heading: {
            title: 'Heading',
            sort: true,
            width: '15%'
          },
          link: {
            title: 'Source',
            sort: true,
            width: '22%'
          },
          api_key: {
            title: 'Api Key',
            sort: true,
            width: '12%'
          },
          source_type: {
            title: 'Type',
            sort: true,
            width: '10%'
          },
          pipelineId: {
            title: 'Pipeline',
            sort: true,
            width: '10%',
            type: 'custom',
            valuePrepareFunction: (cell,row) => 0,
            renderComponent: ButtonView1Component,
          }
        }
      };
    }
    }
    getbyStatus(event){
      this.status =  event;
      this.getSources();
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
   
       this.sourcesService.deactivateMany(myNewList)
       .subscribe(info => { this.info = info;
          alert(this.info.status);
          if(this.info.status != null){
            this.getSources();
          }
       });
    }

    delete(event) {
      const data = event.data;
      this.sourcesService.deactivateSource(data._id)
      .subscribe(info => { this.info = info;
          this.info = info;
          alert(this.info.status);
          this.getSources();
      });
      
    }
    updateRecord(event) {
      const data = { _id : event.newData._id, source_name: event.newData.source_name, userid:event.newData.userid, 
        password:event.newData.password, api_key: event.newData.api_key, source_type: event.newData.source_type };
      this.sourcesService.updateSource(data)
      .subscribe(info => { this.info = info;
      this.info = info;
      alert(this.info.status);
      if(this.info.source != null){
        this.getSources();
      }
      });
      this.getSources();
    }
    //re activate source
    tagFeed(event) {
          const data = event.data;
          this.sourcesService.reactivateSource(data._id)
          .subscribe(info => { this.info = info;
              this.info = info;
              alert(this.info.status);
              this.getSources();
          });
    }
    //start all pipelines
    startAllPipelines() {
      this.pipelinesService.startAllPipelines()
      .subscribe(info => { this.info = info;
        this.info = info;
      //  console.log(this.info);
        alert(this.info.status);
      });
    }
    onSearch(query: string = '') {
          this.source.setFilter([
            // fields we want to include in the search
            {
              field: 'source_name',
              search: query
            }, {
              field: 'link',
              search: query
            }, {
              field: 'userid',
              search: query
            }, {
              field: 'password',
              search: query
            }, {
            field: 'api_key',
            search: query
            }, {
              field: 'source_type',
              search: query
            }], false); 
    };
     
}

