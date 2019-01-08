import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {SourcesService} from '../services';
import { Source } from '../../../server/model/source';
import { Key } from 'protractor';

@Component({
  selector: 'app-add-source',
  templateUrl: '../views/add-source.component.html'
})
export class AddSourceComponent implements OnInit {
  pageName: any = 'Add Feed';
  pageHeading: any = 'New Feed';
  model: Source = {};
  message: any;
  data: any;
  info: any;
  api_key: any;

  constructor(private sourceService: SourcesService,public dialogRef: MatDialogRef<AddSourceComponent>) { }
  formAddSource() {
    const url = this.model.link.replace(/=/gi,'zyem');
    const url1 = url.replace(/&/gi,'zxc');
   
    const source : Source = {source_name : this.model.source_name, source_type: this.model.source_type,
      link: url1, api_key: this.model.api_key, source_abbreviation: this.model.source_abbreviation, 
      source_heading: this.model.source_heading,  source_status: 'active'
      /*  userid: this.model.userid, password: this.model.password */
    };
     this.sourceService.addSource(source)
      .subscribe(data => { this.data = data;
      });
    if (this.data = 'success') {
      this.info = 1;
      this.message = 'New Source added successfully';
    } else {
      this.info = 0;
      this.message = 'Error in adding new source. Try again.';
    } 
  }
  close(info): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

}
