import { Injectable } from "@angular/core";
import * as Gun from "gun";
import { Observable } from "rxjs/Observable";

import { peers } from "../../config/peers";
import { Course } from "../../models/Course";

@Injectable()
export class GunProvider {
    private Gun = new Gun(peers);
    private db: any;
    private degrees: Course[];

    constructor() {
        this.db = this.Gun.get("courses2");
        this.degrees = [];
    }

    insertCourse(courseName: string) {
        this.db.get(courseName).put({ name: courseName });
    }

    loadCourses(): Observable<Course[]> {
        return new Observable(s => {
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
                    .get("upvotes")
                    .map()
                    .on((votes, email) => {
                        this.db
                            .get(id)
                            .get("upvotes")
                            .get(email)
                            .map()
                            .on(upvote => {
                                if (!degree.upvotes.find(x => x == email)) {
                                    degree.upvotes.push(email);
                                    s.next(this.degrees);
                                }
                            });
                    });
            });
            s.next(this.degrees);
        });
    }

    upvote(degree: Course, email: string) {
        let vote = {};
        vote[email] = 1;
        this.db
            .get(degree.name)
            .get("upvotes")
            .get(email)
            .set(vote);
    }
}
