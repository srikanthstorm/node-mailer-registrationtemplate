import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {TagsService} from '../services';
import { StockCodes } from '../../../server/model/stockCodes';

@Component({
  selector: 'app-add-tags',
  templateUrl: '../views/add-tags.component.html'
})
export class AddTagsComponent implements OnInit {
  model : StockCodes = {};
  message: any;
  data: any;
  formAddStockCode(form: any) {
    const stockCode: StockCodes = this.model;
    Object.assign(stockCode, {stock_status: 'active'});
    this.tagsService.addStockCode(stockCode)
      .subscribe(data => { this.data = data;
      });
    if (this.data = 'success') {
      this.message = 'New Company Added';
    } else {
      this.message = 'Error in new submission.Try again';
    }
  
  }
  close(): void {
    this.dialogRef.close();
}
  constructor( private tagsService: TagsService,public dialogRef: MatDialogRef<AddTagsComponent>) { }

  ngOnInit() {
  }

}
