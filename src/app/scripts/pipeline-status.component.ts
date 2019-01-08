import { Component, OnInit, Input, Inject, OnChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PipelinesService, RssfeedService } from '../services';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Subscription, timer, pipe,  } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-pipeline-status',
  templateUrl: '../views/pipeline-status.component.html'
})
export class PipelineStatusComponent implements OnInit {
  showStart = false;
  showStop = false;
  showError = false;
  showStatus = true;
  pipeline : Observable<any>;
  model: any;
  data:any;
  message:any;
  info: any;
  interval: any;
  subscription: Subscription;
  constructor(  @Inject(MAT_DIALOG_DATA) public record_Id: any,
  public dialogRef: MatDialogRef<PipelineStatusComponent>, private pipelinesService: PipelinesService,  private rssfeedService: RssfeedService) { }
  close(): void {
    this.dialogRef.close();
}
  getPipelineStatus(){ 
   const pipeID = this.record_Id.pipeline.pipelineId;
    if(pipeID == "" || pipeID === undefined || pipeID === null){
      this.showError = true;
      this.showStatus = false;
    }
    else {
      this.showError = false;
      this.showStatus = true;
      this.pipelinesService.getPipelineStatus(pipeID)
      .subscribe(pipeline => {this.pipeline = pipeline;
       
      });  
    }
     
  }
  startPipeline(){
    this.pipelinesService.startStatus(this.record_Id.pipeline.pipelineId)
       .subscribe(pipeline => { this.pipeline = pipeline},
        this.getPipelineStatus());
     
     
         /*  this.subscription = timer(0, 10000).pipe(
  switchMap(() => this.pipelinesService.stopStatus())
).subscribe();  */
       
  }
  stopPipeline(){
    this.pipelinesService.stopStatus(this.record_Id.pipeline.pipelineId)
    .subscribe(pipeline => { this.pipeline = pipeline},
     this.getPipelineStatus());
       
  }
  createPipeline(){
    this.pipelinesService.createPipelineforExisting(this.record_Id.pipeline._id)
    .subscribe(data => { this.data = data;
    });
  if (this.data = 'success') {
    this.message = 'PipeLine created';
    this.showError = false;
    this.showStatus = false;
    this.getPipelineStatus();
    } else {
    this.message = 'Error in adding new Pipeline. Try again.';
  }
  }
 
  getColor(status) { 
    switch (status) {
      case 'STOPPING':
      case 'FINISHING':
      this.showStop = true;
      this.showStart = false;
      return 'orange';
      
      case'ERROR': 
      case 'RUN_ERROR': 
      case 'START_ERROR':
      case 'STOP_ERROR': 
      case 'CONNECT_ERROR' :
      this.showStart = true;
      this.showStop = false;
      return 'red';

      case 'RUNNING':
      case 'STARTING':
      this.showStop = true;
      this.showStart = false;
        return 'green';

      case 'EDITED':
      case 'RETRY':
      case 'STOPPED':
      case 'DISCONNECTED':
      case 'FINISHED':
      this.showStart = true;
      this.showStop = false;
        return '#68B3C8';
     
    }
  }
 
  ngOnInit() {
    this.getPipelineStatus();
    setInterval(() => {
      this.getPipelineStatus();
  },1000);
 
  }
}
