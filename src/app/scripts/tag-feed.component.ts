import {Component, Input, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormControl, Validators, FormGroup, FormArray} from '@angular/forms';
import {RssfeedService, TagsService} from '../services';
import { Rssfeed } from '../../../server/model/rssfeed';
import { stockCodes } from '../../../server/model/stockCodes';
import { Keywords } from '../../../server/model/keywords';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
    selector: 'app-tag-feed',
    templateUrl: '../views/tag-feed.component.html'
})
export class TagFeedComponent implements OnInit {
    @Input() recordId: string;
    model: any = {};
    keywords: Keywords;
    stockCodes: stockCodes;
    rssfeed: Rssfeed;
    info: any;
    primaryKeyword: any;
    content: any;
    keys: any;
    newDescription: any;
    newStyle: any;
    stmt_arry: any;
    selectedKeywords: Keywords[];
    selectedStocks: stockCodes[];
    keywordSettings = {};
    stockSettings ={};
 
    constructor(private fb: FormBuilder, private rssfeedService: RssfeedService, private tagsService: TagsService,
        @Inject(MAT_DIALOG_DATA) public record_Id: any,
                public dialogRef: MatDialogRef<TagFeedComponent>) { }

    getRssfeedbyID(): void {
        this.recordId = this.record_Id.id;
        this.rssfeedService.getFeedbyID(this.recordId)
            .subscribe(rssfeed => {
                this.rssfeed = rssfeed ; 
                const stmt = this.rssfeed.articles_description;
               const array = stmt.split(">");
               if(array.length == 1){
                 this.stmt_arry = array[0].split(" ");  
               } 
               else {
                this.stmt_arry = array[1].split(" ");
               }
               let strArray = this.rssfeed.keyword.split(/[ ,]+/);
                strArray = strArray.filter(Boolean);
                 $.each(strArray, function (i, vals) {
                  $.each(this.stmt_arry, function (j, sVal) {
                      if (sVal == vals) {
                        this.stmt_arry[j] = "<b>" + sVal + "</b>";
                      }
                  });
              });
              var req_stmt = this.stmt_arry.join(" ");
              $("#result").html(req_stmt);
        });
    }
 
/*     highlight(){
        this.content = this.rssfeed.articles_description;
        this.keys= this.rssfeed.keyword.split(",");
        if(!this.rssfeed.keyword) {
            return this.content;
        }
         for(let i=0; i< this.keys.length; i++){
           this.newDescription = this.content.replace(new RegExp(this.keys[i], "gi"), match => {
            this.newDescription =  '<span class="highlightText">' + match + '</span>';
            return this.newDescription;
        });
        return this.newDescription;
       }
     } */
     
    getKeywords(){
        this.tagsService.getKeywords()
            .subscribe(keywords => {
                this.keywords = keywords;
            }, err => {
                console.log(err);
         });
    }
    ngOnInit() {
         this.getRssfeedbyID();  
         this.getKeywords(); 
         this.tagsService.getStockCodes()
            .subscribe(stockCodes => {
                this.stockCodes = stockCodes;
            }, err => {
                console.log(err);
         });

         this.keywordSettings = {
            singleSelection: true,
            idField: 'keyword_name',
            textField: 'keyword_name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 5,
            allowSearchFilter: true
          };
          this.stockSettings = {
            singleSelection: false,
            idField: 'stock_code',
            textField: 'stock_code',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 5,
            allowSearchFilter: true
          }
    
    }
    onKeySelect (primaryKeyword) {
       // this.primaryKeyword.push(primaryKeyword);
       this.primaryKeyword;
      }
      onKeySelectAll (items: any) {
      }
      onStockSelect (selectedStocks: stockCodes) {
        this.selectedStocks.push(selectedStocks);
      }
      onStockSelectAll (items: any) {
      }
     onselectedKeywordsChange (values: string[]) {
        this.selectedKeywords = values;
        
      }
    formTagFeed(form: any) {
        this.recordId = this.record_Id.id;
        let sStocks = this.model.stockcode;
         this.rssfeedService.updateStatus(this.recordId, this.primaryKeyword ,this.selectedKeywords, sStocks)
        .subscribe(info => { this.info = info;
            this.info = info ;
            alert(this.info.status);
        }); 
        this.dialogRef.close();
    }
    close(): void {
        this.dialogRef.close();
    }
}

