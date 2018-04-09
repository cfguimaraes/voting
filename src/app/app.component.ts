import { Component } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Platform } from "ionic-angular";

import { TabsPage } from "./../pages/tabs/tabs";

@Component({
    templateUrl: "app.html"
})
export class MyApp {
    rootPage: any = TabsPage;

    constructor(
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen
    ) {
        platform.ready().then(() => {
            if (platform.is("cordova")) {
                statusBar.styleDefault();
                splashScreen.hide();
            }
        });
    }
}
