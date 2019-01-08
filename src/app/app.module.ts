import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SidebarModule } from 'ng-sidebar';

import { MatMenuModule, MatIconModule, MatToolbarModule, MatCardModule, MatSelectModule, MatListModule,
  MatFormFieldModule,MatAutocompleteModule, MatInputModule, MatDatepickerModule, MatNativeDateModule
 } from '@angular/material';
 import {MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';

/*Services */
import { LoginService, RssfeedService, UserService, SourcesService, TagsService, PipelinesService } from './services';
import { AuthGuard } from './guard/auth.guard';
import { Globals }  from './global';

/* Components */
import { AppComponent } from './app.component';
import { LoginComponent } from './scripts/login.component';
import { AdminHomeComponent } from './scripts/admin-home.component';
import { ButtonViewComponent } from './scripts/admin-dashboard.component';
import { SimpleDateComponent } from './scripts/admin-dashboard.component';
import { AdminDashboardComponent } from './scripts/admin-dashboard.component';
import { ManageSourcesComponent } from './scripts/manage-sources.component';
import { ManageTagsComponent } from './scripts/manage-tags.component';
import { ManageUsersComponent } from './scripts/manage-users.component';
import { AdminPreviewComponent } from './scripts/admin-preview.component';
import { TagFeedComponent } from './scripts/tag-feed.component';
import { AddFeedComponent } from './scripts/add-feed.component';
import { AddTagsComponent } from './scripts/add-tags.component';
import { AddUserComponent } from './scripts/add-user.component';
import { UserDashboardComponent } from './scripts/user-dashboard.component';
import { UserHomeComponent } from './scripts/user-home.component';
import { ManagePreferencesComponent } from './scripts/manage-preferences.component';
import { UnsubscribeComponent } from './scripts/unsubscribe.component';
import { AddSourceComponent } from './scripts/add-source.component';
import { ProfileComponent } from './scripts/profile.component';
import { AddKeywordsComponent } from './scripts/add-keywords.component';
import { ForgetPasswordComponent } from './scripts/forget-password.component';
import { PipelinesComponent } from './scripts/pipelines.component';
import { AddPipelineComponent } from './scripts/add-pipeline.component';
import { PipelineStatusComponent } from './scripts/pipeline-status.component';
import { ButtonView1Component } from './scripts/manage-sources.component';
import { AdminDashboard2Component } from './scripts/admin-dashboard2.component';



const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'addUser', component: AddUserComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'adminHome', component: AdminHomeComponent, canActivate: [AuthGuard],
children: [
      { path: '', redirectTo: '/adminHome/dashboard', pathMatch: 'full'},
      { path: 'dashboard2', component: AdminDashboardComponent },
      { path: 'dashboard', component: AdminDashboard2Component },
      { path: 'addFeed', component: AddFeedComponent },
      { path: 'manageSources', component: ManageSourcesComponent },
      { path: 'manageTags', component: ManageTagsComponent },
      { path: 'manageUsers', component: ManageUsersComponent },
      { path: 'adminPreview', component: AdminPreviewComponent },
      { path: 'profile', component: ProfileComponent},
      { path: 'pipelines', component: PipelinesComponent}

]},
{ path: 'userHome', component: UserHomeComponent, canActivate: [AuthGuard],
children: [
  { path: '', redirectTo: '/userHome/userDashboard', pathMatch: 'full'},
  { path: 'userDashboard', component: UserDashboardComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'managePreferences', component: ManagePreferencesComponent },
      { path: 'unsubscribe', component: UnsubscribeComponent }
]} 
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminHomeComponent,
    AdminDashboardComponent,
    ButtonViewComponent,
    ManageSourcesComponent,
    ManageTagsComponent,
    ManageUsersComponent,
    AdminPreviewComponent,
    TagFeedComponent,
    AddFeedComponent,
    AddTagsComponent,
    AddUserComponent,
    UserDashboardComponent,
    UserHomeComponent,
    ManagePreferencesComponent,
    UnsubscribeComponent,
    AddSourceComponent,
    ProfileComponent,
    AddKeywordsComponent,
    ForgetPasswordComponent,
    PipelinesComponent,
    AddPipelineComponent,
    PipelineStatusComponent,
    ButtonView1Component,
    SimpleDateComponent,
    AdminDashboard2Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    Ng2SmartTableModule,
    NgMultiSelectDropDownModule.forRoot(),AngularMultiSelectModule,
    MatMenuModule, MatIconModule, MatToolbarModule , MatCardModule, MatDialogModule, MatSelectModule, MatListModule,
    MatFormFieldModule, MatAutocompleteModule, MatInputModule,MatDatepickerModule, MatNativeDateModule,
    OwlDateTimeModule, OwlNativeDateTimeModule, SidebarModule.forRoot(),
    
  ],
  entryComponents: [
    TagFeedComponent, AddTagsComponent, AddSourceComponent,AddKeywordsComponent, 
    ButtonViewComponent, AddPipelineComponent, PipelineStatusComponent, ButtonView1Component, SimpleDateComponent
  ],
  providers: [LoginService, RssfeedService, SourcesService, TagsService, UserService, PipelinesService, AuthGuard,
     { provide: LocationStrategy, useClass: HashLocationStrategy},Globals ],
  bootstrap: [AppComponent]
})
export class AppModule { }
