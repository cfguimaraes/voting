import { Component } from "@angular/core";
import { IonicPage } from "ionic-angular";

import { GunProvider } from "./../../providers/gun/gun";
import { Entry } from "../../models/Course";

@IonicPage()
@Component({
    selector: "page-upvotes",
    templateUrl: "upvotes.html"
})
export class UpvotesPage {
    public entries: Entry[];

    constructor(public gun: GunProvider) {
        this.loadEntries();
    }

    loadEntries() {
        this.gun.loadCourses().subscribe(x => {
            this.entries = x.sort((a, b) => {
                return this.sumUpvotes(b) - this.sumUpvotes(a);
            });
            console.log(this.entries);
        });
    }
    
    sumUpvotes = (entry: Entry) => Object.keys(entry.upvotes).length;
}
