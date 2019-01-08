import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {SourcesService, PipelinesService} from '../services';
import { Sources } from '../../../server/model/source';
import { UrlSegment } from '@angular/router';

@Component({
  selector: 'app-add-pipeline',
  templateUrl: '../views/add-pipeline.component.html'
})
export class AddPipelineComponent implements OnInit {
sources : Sources;
model: any;
data: any;
message: any;
  constructor(private sourcesService: SourcesService,private pipelinesService: PipelinesService, public dialogRef: MatDialogRef<AddPipelineComponent>) { }
  getArticles(){
      this.sourcesService.getSources()
      .subscribe(sources => {
          this.sources = sources; 
      }, err => {
          console.log(err);
      });
  }
  close(data): void {
    this.dialogRef.close();
    return data;
}
  getbyArticle(event)
  {
    this.model = event
  }
  formAddPipeline(form: any){
   
    const id = this.model
    this.pipelinesService.createPipeline( id)
      .subscribe(data => { this.data = data;
      });
    if (this.data = 'success') {
      this.message = 'New Source added successfully';
    } else {
      this.message = 'Error in adding new source. Try again.';
    }
  }
  ngOnInit() {
    this.getArticles();
  }

}
