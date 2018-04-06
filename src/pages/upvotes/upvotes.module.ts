import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpvotesPage } from './upvotes';

@NgModule({
  declarations: [
    UpvotesPage,
  ],
  imports: [
    IonicPageModule.forChild(UpvotesPage),
  ],
})
export class UpvotesPageModule {}
