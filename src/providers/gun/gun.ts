import { Injectable } from "@angular/core";
import * as Gun from "gun";
import { Observable } from "rxjs/Observable";

import { peers } from "../../config/peers";
import { Course } from "../../models/Course";
import { Subscriber } from "rxjs/Subscriber";

@Injectable()
export class GunProvider {
    private Gun = new Gun(peers);
    private degrees: Course[];
    private cache: Course[];

    private readonly nameOfBucketToStoreUpvotes: string;

    private db: any;
    private tracker: any;

    constructor() {
        this.degrees = [];
        this.db = this.Gun.get("c");
        this.tracker = this.Gun.get("t");
        this.nameOfBucketToStoreUpvotes = "upvotes";
    }

    insertCourse(courseName: string) {
        this.db.get(courseName).put({ name: courseName });
    }

    loadCourses(): Observable<Course[]> {
        return new Observable(s => {
            let i = 0;
            this.db.map().on((item, id) => {
                let degree = this.degrees.find(it => it.name == item.name);
                if (!degree) {
                    let course = new Course(item.name);
                    degree = course;
                    this.degrees.push(course);
                } else {
                    let i = this.degrees.indexOf(degree);
                    this.degrees[i] = degree;
                }
                this.db
                    .get(id)
                    .get(this.nameOfBucketToStoreUpvotes)
                    .map()
                    .on((votes, email) => {
                        this.db
                            .get(id)
                            .get(this.nameOfBucketToStoreUpvotes)
                            .get(email)
                            .map()
                            .on(upvote => {
                                console.log("upvote", upvote)
                                let vote = upvote[email];
                                let exists = degree.upvotes.find(
                                    x => x.email == email
                                );

                                if (exists) {
                                    exists.vote = vote;
                                } else {
                                    let obj = { email: email, vote: vote };
                                    degree.upvotes.push(obj);
                                }
                                // this.notifyIfChanged(s);
                                return this.notifyIfChanged(s);
                            });
                    });
            });
            return this.notifyIfChanged(s);
        });
    }

   private notifyIfChanged(s: Subscriber<Course[]>) {
        if (this.degrees !== this.cache) {
            console.log("<>");
            this.cache = this.degrees;
            s.next(this.degrees);
        } else console.log("==");
    }

    upvote(degree: Course, email: string) {
        this.tracker.get(email, data => {
            if (!data.put) {
                // create
                this.tracker.get(email).put(degree.name);
            } else {
                // update old value to 0
                this.db
                    .get(degree.name)
                    .get(this.nameOfBucketToStoreUpvotes)
                    .get(email)
                    .set({ email: email, vote: 0 });
                // create new entry for tracking
                this.tracker.get(email).put(degree.name);
            }
        });

        let vote = {};
        vote[email] = 1;
        this.db
            .get(degree.name)
            .get(this.nameOfBucketToStoreUpvotes)
            .get(email)
            .set(vote);
    }
}
