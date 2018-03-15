import { Injectable } from "@angular/core";
import * as Gun from "gun";

import { peers } from "../../config/peers";

@Injectable()
export class GunProvider {
    private Gun = new Gun(peers);
    private course: any;

    constructor() {
        this.course = this.Gun.get("courses1");
    }

    insertCourse(courseName: string) {
        this.course.get(courseName).put({ name: courseName });
    }

    loadCourses() {
        let itens: Array<{ name: string; upvotes: string[] }> = new Array();
        this.course.map().val((item, id) => {
            let obj: any = { name: id };
            itens.push(obj);
            obj.upvotes = [];
            this.course
                .get(id)
                .get("upvotes")
                .val((email,id) => obj.upvotes.push(email));
        });

        return itens.sort((a, b) => (a.name < b.name ? -1 : 1));
    }

    upvote(course, email) {
        this.course
            .get(course.name)
            .get("upvotes")
            .get(email)
            .set({ email: 1 });
    }
}
