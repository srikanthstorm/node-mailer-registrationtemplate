import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators, FormGroup, FormArray} from '@angular/forms';
import { stockCodes } from '../../../server/model/stockCodes';
import { Keywords } from '../../../server/model/keywords';
import {TagsService, UserService} from '../services';

@Component({
  selector: 'app-manage-preferences',
  templateUrl: '../views/manage-preferences.component.html'
})
export class ManagePreferencesComponent implements OnInit {
  pageName = 'Manage Preferences';
  pageHeading = 'Manage Preferences';
  showKeywords = true;
  showStocks = false;
 
selectedKeywords: string[] ;
selectedStocks: string[] ;
    model: any = {};
    keywords: Keywords;
    stockCodes: stockCodes;
    data: any;
    message:any;
  constructor(private fb: FormBuilder, private userService: UserService, private tagsService: TagsService) { }
next() {
  this.showKeywords = false;
  this.showStocks = true;
}
back() {
  this.showKeywords = true;
  this.showStocks = false;
}
    getKeywords() {
      this.tagsService.getKeywords()
    .subscribe(keywords => {this.keywords = keywords;
        }, err => {
    console.log(err);
        });
    }  
   getStockCodes() {
       this.tagsService.getStockCodes()
      .subscribe(stockCodes => {this.stockCodes = stockCodes;
          }, err => {
      console.log(err);
          });
      } 
   ngOnInit() {
       this.getKeywords();
       this.getStockCodes();
   }

   onselectedKeywordsChange(values: any[]) {
    this.selectedKeywords = values;
  }
  onselectedStocksChange(values: string[]) {
    this.selectedStocks = values;
  }
   formManagePref(form: any) {
    const id = localStorage.getItem('token');
     this.userService.updatePreferences(id, this.selectedKeywords, this.selectedStocks)
     .subscribe(data => { this.data = data;
     });
   if (this.data = 'success') {
     this.message = 'Preferences updated with given Keywords and StockCodes';
   } else {
     this.message = 'Error in updating Profile.Please try again';
   }
   }


}
