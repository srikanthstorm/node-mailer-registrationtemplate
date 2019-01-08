import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { LocalDataSource } from 'ng2-smart-table';
import { StockCodes } from '../../../server/model/stockCodes';
import { Keywords } from '../../../server/model/keywords';
import {TagsService} from '../services';
import { AddTagsComponent } from './add-tags.component';
import { AddKeywordsComponent } from './add-keywords.component';
import { Globals }  from '../global';

@Component({
  selector: 'app-manage-tags',
  templateUrl: '../views/manage-tags.component.html'
})
export class ManageTagsComponent implements OnInit {
   statuss = this.globals.statuss;
  pageName = 'Manage Tags ';
  pageHeading = 'Tags';
  buttonName = 'Delete Selected';
  ignore: any[] = new Array();
  showButtons = true;
  showBack = false;
  showStocks = false;
  showKeywords = false;
  showDelete = true;
  showActivate = false;
  status: any;
  keyword_name: any;
  disabled = true;
  showEdit = true;
  showUpdate = false;
  selectedKeywords: any[] = new Array();
  newKeyword: any[];
  newKeywords: any[] = new Array();;
  info: any
  source: LocalDataSource;
  keywords : Keywords;
  settings: any;

ngOnInit() {
  this.getKeywords();
}
showstockCodes() {
  this.showButtons = false;
  this.showStocks = true;
  this.showBack = true;
 }
 showkeywords() {
   this.showButtons = false;
   this.showKeywords = true;
   this.showBack = true;
 }
back() {
   this.showButtons = true;
   this.showStocks = false;
   this.showKeywords = false;
 }
 editKeywords(){
   this.disabled = false;
   this.showEdit = false;
   this.showUpdate = true;
 }
 onChange(event, id) {
  this.newKeyword =  [{id: id,keyword_name: event}]; 
}
/*  onChange(event, id) {
   this.newKeyword =  [{id: id,keyword_name: event}]; 
   console.log(this.newKeyword);
   this.changeKeyword();
}
changeKeyword(){
  for (let i = 0; i < this.newKeyword.length; i++) {
     this.newKeywords.push(this.newKeyword[i]);
  }
  console.log('sdff',this.newKeywords);
} */
constructor(private route: ActivatedRoute, private router: Router, 
private tagsService: TagsService, public dialog: MatDialog,private globals: Globals) { 
 this.getStatus();
}

getStatus(){
  if (typeof(this.status) == "undefined"){
    this.status = 'active';
  } else {
    this.status = this.status;
  }
  this.tagsService.getStockbyStatus(this.status)
  .subscribe(data => {
    this.source = new LocalDataSource(data);
}, err => {
    console.log(err);
});
if( this.status == 'deactive'){
  this.showDelete = false;
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
      confirmSave: true
    },
    columns: {
      stock_name: {
        title: 'Company Name',
        filter: true,
        sort: true,
        width: '34%'
      },
      stock_code: {
        title: 'Stock Code',
        sort: true,
        width: '15%'
      },
      stock_sector: {
        title: 'Sector',
        sort: true,
        width: '34%'
      },
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
      width: '10%'
    },
    delete: {
      deleteButtonContent: '<button mat-button="" class="login100-form-btn m-b-3">Delete</button>',
      confirmDelete: true
    },
    edit: {
      confirmSave: true
    },
    columns: {
      stock_name: {
        title: 'Company Name',
        filter: true,
        sort: true,
        width: '35%'
      },
      stock_code: {
        title: 'Stock Code',
        sort: true,
        width: '20%'
      },
      stock_sector: {
        title: 'Sector',
        sort: true,
        width: '30%'
      },
    }
  };
}
}
getbyStatus(event){
  this.status =  event;
  this.getStatus();
  return this.status;
}
updateRecord(event) {
  this.tagsService.updateStockCode(event.newData)
  .subscribe(info => {
    this.info = info;
    alert(this.info.status);
    if(this.info.result != null){
     this.getStatus();
    }
  }, err => {
    console.log(err);
  });
}
delete(event) {
  const data = event.data;
  this.tagsService.deactivateStockCode(data._id)
  .subscribe(info => { this.info = info;
      this.info = info;
      alert(this.info.status);
      if(this.info.result != null){
       this.getStatus();
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
 const myNewList =  Array.from(new Set(this.ignore )); 
  this.tagsService.deactivateManyStockCode(myNewList)
  .subscribe(info => { this.info = info;
     alert(this.info.status);
     if(this.info.status != null){
     this.getStatus();
    }
     
  });
}
 //re activate user
 tagFeed(event) {
  const data = event.data;
  this.tagsService.reactivateStockCode(data._id)
  .subscribe(info => { this.info = info;
      this.info = info;
      alert(this.info.status);
      if(this.info.result != null){
       this.getStatus();
      }
  });
}
addStockCode() {
  this.dialog.open(AddTagsComponent, {
    width: '450px',
    height: '435px',
  }); 
  this.dialog.afterAllClosed.subscribe(() => {
    // update a variable or call a function when the dialog closes
     this.getStatus();
    });
}
addKeyword() {
  this.dialog.open(AddKeywordsComponent, {
    width: '450px',
    height: '425px',
    data: { keywords: this.keywords}
  });

  this.dialog.afterAllClosed.subscribe(() => {
    // update a variable or call a function when the dialog closes
     this.getKeywords();
    });
}
getbyKeywordStatus(event){
  this.status =  event;
      this.getKeywords();
      return this.status;
}
getKeywords() {
  if (typeof(event) == "undefined"){
    this.status = 'active';
  } else {
    this.status = this.status;
  }
  this.tagsService.getKeywordsbyStatus(this.status)
  .subscribe(keywords => {
    this.keywords = keywords;
}, err => {
    console.log(err);
});
if( this.status == 'deactive'){
  this.showDelete = false;
  this.showActivate = true;
} else {
  this.showDelete = true;
  this.showActivate = false;
}
}
onselectedKeywordsChange(values: string[]) {
  const data = values;
      for (let i = 0; i < data.length; i++) {
         this.selectedKeywords.push(data[i]);

      }
  
}
updateKeywords() {
  console.log('func',this.newKeyword);
  this.tagsService.updateKeyword(this.newKeyword)
  .subscribe(info => {
    this.info = info;
    alert(this.info.status);
    if(this.info.result != null){
     this.getKeywords();
     this.showEdit = true;
     this.showUpdate = false;
    }
  }, err => {
    console.log(err);
  });
  this.disabled = true;
}
deleteKeywords(){
  this.tagsService.deactivateKeywords(this.selectedKeywords)
  .subscribe(info => { this.info = info;
      this.info = info;
      alert(this.info.status);
      if(this.info.status != null){
        this.getKeywords();
      }
  });
}
activateKeywords(){
  this.tagsService.activateKeywords(this.selectedKeywords)
  .subscribe(info => { this.info = info;
      this.info = info;
      alert(this.info.status);
      if(this.info.status != null){
        this.getKeywords();
      }
  });

}
onSearch(query: string = '') {
  this.source.setFilter([
    // fields we want to include in the search
    {
      field: 'stock_name',
      search: query
    }, {
      field: 'stock_code',
      search: query
    }, {
      field: 'stock_sector',
      search: query
    }], false); 
};
}

