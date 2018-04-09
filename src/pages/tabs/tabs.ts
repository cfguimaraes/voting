import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { UpvotesPage } from '../upvotes/upvotes';

@Component({
    selector: "page-tabs",
    templateUrl: "tabs.html"
})
export class TabsPage {
    votingRoot = HomePage;
    upvotesRoot = UpvotesPage;

    constructor() {}
}
