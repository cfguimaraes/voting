import { Injectable } from "@angular/core";
import { Dexie } from "dexie";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";

import { Entry } from "../../models/Course";

declare function require(params: string);

@Injectable()
export class GunProvider {
    private entries: Entry[];

    private db: any;
    private table_entries: Dexie.Table<Entry, string>;
    private table_tracker: Dexie.Table<{ email: string; name: string }, string>;

    constructor() {
        let Dexie = require("dexie").default;

        this.entries = [];
        this.db = new Dexie("7");
        this.db.version(1).stores({
            entries: "name",
            tracker: "email"
        });
        this.db.open();

        this.table_entries = this.db.table("entries");
        this.table_tracker = this.db.table("tracker");

        (<any>Window).dexie = this.db;
    }

    insertCourse(name: string) {
        this.table_entries.add(new Entry(name));
    }

    loadCourses(): Observable<Entry[]> {
        return new Observable(s => {
            this.table_entries.toArray().then(r => {
                this.entries = r;
                this.notifyIfChanged(s);
            });
            this.listenForChanges(s);
        });
    }
    private listenForChanges(s: Subscriber<Entry[]>) {
        this.table_entries.hook("creating", (pk, obj, transaction) => {
            this.entries.push(obj);
            s.next(this.entries);
        });

        this.table_entries.hook("updating", (obj: Entry, pk, transaction) => {
            let entry = this.entries.find(x => x.name == pk);
            entry.upvotes = obj.upvotes;
            s.next(this.entries);
        });

        // Ready for conveniece
        // If you want to implement exclusion you must write the logic that suits yout needs
        this.table_entries.hook("deleting", (pk, obj, transaction) => {
            let filter = this.entries.filter(x => x.name != pk);
            this.entries = filter;
            s.next(this.entries);
        });
    }

    private notifyIfChanged(s: Subscriber<Entry[]>) {
        s.next(this.entries);
    }

    upvote(entry: Entry, email: string) {
        this.table_tracker
            .get(email)
            .then(
                // If email upvoted before
                tracker => {
                    if (tracker) {
                        // Data exists

                        // Remove track information
                        this.table_entries
                            .get(tracker.name)
                            .then(rehydrated => {
                                delete rehydrated.upvotes[email];
                                this.table_entries.update(
                                    tracker.name,
                                    rehydrated
                                );
                            });

                        this.table_tracker.delete(email);
                    }
                }
                // let commit
            )
            .finally(() => {
                // Increment upvote information

                entry.upvotes[email] = 1;
                this.table_entries.update(entry.name, entry).then(x => {
                    // track information of email that upvoted
                    let tracker = { email, name: entry.name };

                    this.table_tracker.add(tracker).then(x => {});
                });
            });
    }
}
