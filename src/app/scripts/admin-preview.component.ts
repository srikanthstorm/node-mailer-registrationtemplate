
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';
import { Rssfeed } from '../../../server/model/rssfeed';
import { Source } from '../../../server/model/source';
import {RssfeedService, LoginService, SourcesService, TagsService} from '../services';
import {catchError, map, tap} from 'rxjs/operators';
import { stockCodes } from '../../../server/model/stockCodes';
import { Keywords } from '../../../server/model/keywords';
import * as $ from "jquery";

@Component({
  selector: 'app-admin-preview',
  templateUrl: '../views/admin-preview.component.html'
})
export class AdminPreviewComponent implements OnInit {
  pageName = 'Home';
  pageHeadings = 'Feed by Source';
  pageIcon = 'loyalty';
  rssfeed: Rssfeed;
  sources: Source[];
  keywords: Keywords[];
  stockCodes: stockCodes[];
  article:any; newVariable: any; feeds: any;
  stmt_arry: any; primaryKeyword: any; info: any; img: any;
  stockcodeText: any;
  selectedKeywords: Keywords[];
  selectedStocks: stockCodes[];
  keywordSettings = {};
  stockSettings ={};

  showFeed = false;

  constructor(private router: Router, private rssfeedService: RssfeedService,private sourcesService: SourcesService,
    private tagsService: TagsService) {
 
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
  getbyArticle(event){
    this.article =  event;
    this.getRssFeed();
    return this.article;
  }
  getRssFeed(){
    this.showFeed = true;
    if (typeof(this.article) == "undefined"){
      this.article = 'All';
    } else {
      this.article =  this.article;
    }
    this.rssfeedService.getOldestbySource(this.article)
    .subscribe(rssfeed => {
        this.rssfeed = rssfeed;
        const rss = this.rssfeed[0];
        this.img = rss.articles_urlToImage;
        const stmt = rss.articles_description;
        const array = stmt.split(">");
        if(array.length == 1){
          this.stmt_arry = array[0].split(" ");  
        } 
        else {
         this.stmt_arry = array[1].split(" ");
         const img2 = array[0].replace(/"/g,'')
         this.img = img2.replace(`<img src=`,'');
         console.log(this.img);
        }
        let strArray = rss.keyword.split(/[ ,]+/);
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
  getKeywords(){
    this.tagsService.getKeywords()
        .subscribe(keywords => {
            this.keywords = keywords;
        }, err => {
            console.log(err);
     });
  }
  ignoreFeed(event){
    console.log(event);
    this.rssfeedService.ignoreFeed(event)
    .subscribe(info => { this.info = info;
        this.info = info;
        alert(this.info.status);
        if(this.info.result != null){
          console.log(this.info.result.articles_source_name);
          this.getbyArticle(this.info.result.articles_source_name);
        }
    }); 
  }
  onselectedKeywordsChange (values: string[]) {
    this.selectedKeywords = values;
    console.log(this.selectedKeywords);
    
  }
  tagFeed(event) {
    const sStocks = this.stockcodeText;
   /* const sKeywords =  Array.from(new Set(this.selectedKeywords ));  
    const sStocks =  Array.from(new Set(this.selectedStocks )); */
    this.rssfeedService.updateStatus(event, this.primaryKeyword ,this.selectedKeywords, sStocks)
    .subscribe(info => { this.info = info;
        this.info = info;
        alert(this.info.status);
        console.log(this.article);
        this.getRssFeed();
    }); 
   
  }
 ngOnInit(){
  this.getCount();
  this.getTotalCount();
  this.getRssFeed();
  this.getKeywords();
  this.tagsService.getStockCodes().pipe(map((resp: Array<any>) => {
    this.stockCodes = resp;
  })).subscribe();
  
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
}














