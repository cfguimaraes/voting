import { Injectable } from "@angular/core";
import * as Gun from "gun";

import { peers } from "../../config/peers";
import { Course } from "../../models/Course";
import { Observable } from "rxjs/Observable";

@Injectable()
export class GunProvider {
    private Gun = new Gun(peers);
    private degrees: any;

    constructor() {
        this.degrees = this.Gun.get("courses1");
    }

    insertCourse(courseName: string) {
        this.degrees.get(courseName).put({ name: courseName });
    }

    loadCourses(): Observable<Course> {
        return new Observable(s => {
            this.degrees.map().val((item, id) => {
                let course = new Course(id);
                console.log("course", course);
                s.next(course);
                course.upvotes = [];

                this.degrees
                    .get(id)
                    .get("upvotes")
                    .val((data, id) => {
                        course.upvotes.push(data);
                    });
            });
        });
    }

    upvote(degree: Course, email: string) {
        this.degrees
            .get(degree.name)
            .get("upvotes")
            .get(email)
            .set({ email: 1 });
    }
}
