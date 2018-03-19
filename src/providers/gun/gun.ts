import { Injectable } from "@angular/core";
import * as Gun from "gun";
import { Observable } from "rxjs/Observable";

import { peers } from "../../config/peers";
import { Course } from "../../models/Course";

@Injectable()
export class GunProvider {
    private Gun = new Gun(peers);
    private db: any;

    constructor() {
        this.db = this.Gun.get("courses1");
    }

    insertCourse(courseName: string) {
        this.db.get(courseName).put({ name: courseName });
    }

    loadCourses(): Observable<Course> {
        return new Observable(s => {
            this.db.map().on((item, id) => {
                let course = new Course(item.name);
                this.db
                    .get(id)
                    .get("upvotes")
                    .map()
                    .on(votes => {
                        course.upvotes = course.upvotes || [];
                        course.upvotes.push(votes);
                    });
                s.next(course);
            });
        });
    }

    upvote(degree: Course, email: string) {
        this.db
            .get(degree.name)
            .get("upvotes")
            .get(email)
            .set({ email: 1 });
    }
}
