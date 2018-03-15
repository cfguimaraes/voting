import { Injectable } from "@angular/core";
import * as Gun from "gun";

import { peers } from "../../config/peers";
import { Course } from "../../models/Course";

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

    loadCourses(): Promise<Course[]> {
        let degrees = new Array<Course>();

        return new Promise(resolve => {
            this.degrees.map().val((item, id) => {
                let obj: any = { name: id };
                degrees.push(obj);
                obj.upvotes = [];
                this.degrees
                    .get(id)
                    .get("upvotes")
                    .val((data, id) => {
                        obj.upvotes.push(data);
                    });
            });

            resolve(degrees.sort((a, b) => (a.name < b.name ? -1 : 1)));
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
