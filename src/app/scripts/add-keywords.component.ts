import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {TagsService} from '../services';
import { Keywords } from '../../../server/model/keywords';

@Component({
  selector: 'app-add-keywords',
  templateUrl: '../views/add-keywords.component.html'
})
export class AddKeywordsComponent implements OnInit {
  model : Keywords = {};
  message: any;
  data: any;
  addItem(){
    
  }
  formAddStockCode(form: any) {
    const keyword: Keywords = this.model;
    Object.assign(keyword, {keyword_status: 'active'});
    this.tagsService.addKeyword(keyword)
      .subscribe(data => { this.data = data;
      });
    if (this.data = 'success') {
      this.message = 'New Keyword Added';
      return this.data;
    } else {
      this.message = 'Error in new submission.Try again';
    }
  }
  close(data): void {
      this.dialogRef.close();
      return data;
  }
  constructor( private tagsService: TagsService, public dialogRef: MatDialogRef<AddKeywordsComponent>) { }

  ngOnInit() {
  }

}

