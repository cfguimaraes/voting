import { Component } from "@angular/core";
import { IonicPage } from "ionic-angular";

import { HomePage } from "./../home/home";
import { UpvotesPage } from "./../upvotes/upvotes";

@IonicPage()
@Component({
    selector: "page-tabs",
    templateUrl: "tabs.html"
})
export class TabsPage {
    votingRoot = HomePage;
    upvotesRoot = UpvotesPage;

    constructor() {}
}
