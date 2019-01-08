import { Component, OnInit } from '@angular/core';
import {RssfeedService, SourcesService, TagsService} from '../services';
import { stockCodes } from '../../../server/model/stockCodes';
import { Keywords } from '../../../server/model/keywords';
import { Rssfeed } from '../../../server/model/rssfeed';
import { Source } from '../../../server/model/source';
import { AddKeywordsComponent } from './add-keywords.component';

@Component({
  selector: 'app-add-feed',
  templateUrl: '../views/add-feed.component.html'
})
export class AddFeedComponent implements OnInit {
  articles_publishedAt: any;

  pageName: any = 'Add Feed';
  pageHeading: any = 'New Feed';
  model: Rssfeed = {};
  message: any;
  data: any;
  sources: Source;
  stockCodes: stockCodes[];
  keywords: Keywords[];
  selectedKeywords: Keywords[];
  selectedStocks: stockCodes[];
  keywordSettings = {};
  stockSettings ={};
  article: any;
  constructor(private rssfeedService: RssfeedService, private sourcesService: SourcesService,
    private tagsService: TagsService) {
      this.articles_publishedAt = new Date().toISOString().substring(0, 10);
     }
  formAddFeed() {
    const rssfeed: Rssfeed = this.model;
     const sKeywords =  Array.from(new Set(this.selectedKeywords ));  
    const sStocks =  Array.from(new Set(this.selectedStocks ));
    Object.assign(rssfeed, {articles_source_name: this.article});
    Object.assign(rssfeed, {keyword: this.selectedKeywords.toString()});
    Object.assign(rssfeed, {stockcode: this.selectedStocks.toString()});
    Object.assign(rssfeed, {feed_status: 'untagged'});
    Object.assign(rssfeed, {articles_publishedAt: this.articles_publishedAt});
  
    console.log(rssfeed);
     this.rssfeedService.addFeed(rssfeed)
      .subscribe(data => { this.data = data;
      });
    if (this.data = 'success') {
      this.message = 'New feed added successfully';
    } else {
      this.message = 'Error in adding new feed. Try again.';
    } 
  }
  getArticles(){
    this.sourcesService.getSources()
    .subscribe(sources => {
        this.sources = sources;
    }, err => {
        console.log(err);
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
  getStockCodes(){
    this.tagsService.getStockCodes()
            .subscribe(stockCodes => {
                this.stockCodes = stockCodes;
            }, err => {
                console.log(err);
         });
  }
  getbyArticle(event){
    this.article = event;
  }
  ngOnInit() {
    this.getArticles();
    this.getKeywords();
    this.getStockCodes();
    this.keywordSettings = {
      singleSelection: false,
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
  onKeySelect (selectedKeywords) {
    this.selectedKeywords.push(selectedKeywords);
  }
  onKeySelectAll (items: any) {
  }
  onStockSelect (selectedStocks: stockCodes) {
    this.selectedStocks.push(selectedStocks);
  }
  onStockSelectAll (items: any) {
  }

}
