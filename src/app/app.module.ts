import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { UpvotesPage } from '../pages/upvotes/upvotes';
import { GunProvider } from '../providers/gun/gun';
import { MyApp } from './app.component';

@NgModule({
    declarations: [MyApp, TabsPage, HomePage, UpvotesPage],
    imports: [BrowserModule, IonicModule.forRoot(MyApp)],
    bootstrap: [IonicApp],
    entryComponents: [MyApp, TabsPage, HomePage, UpvotesPage],
    providers: [
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        GunProvider
    ]
})
export class AppModule {}
