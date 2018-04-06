import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { AlertController } from "ionic-angular/components/alert/alert-controller";

import { Course } from "../../models/Course";
import { GunProvider } from "../../providers/gun/gun";

@Component({
    selector: "page-home",
    templateUrl: "home.html"
})
export class HomePage {
    private fromDB = new Array<Course>();
    degrees: Course[];

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public gun: GunProvider
    ) {
        this.degrees = [];
        this.subscribeToDegreesInGun();
    }

    private subscribeToDegreesInGun() {
        this.gun.loadCourses().subscribe(x => {
            this.degrees = x.sort((a, b) => (a.name > b.name ? 1 : -1));
        });
    }

    insertCourse(courseName: string) {
        this.gun.insertCourse(courseName);
    }

    upvote(course: any) {
        let prompt = this.alertCtrl.create({
            title: "Votar no curso",
            message: "Digite seu email para confirmar seu voto",
            inputs: [
                {
                    name: "email",
                    placeholder: "Email"
                }
            ],
            buttons: [
                {
                    text: "Cancelar"
                },
                {
                    text: "Salvar",
                    handler: data => {
                        if (data.email && data.email.trim() != "")
                            this.gun.upvote(course, data.email);
                        else return false;
                    }
                }
            ]
        });
        prompt.present();
    }

    async filterCourses(ev: any) {
        let filterValue = <string>ev.target.value.toLowerCase();
        const hasExpressionToFilter = filterValue && filterValue.trim() != "";

        if (!hasExpressionToFilter) this.degrees = this.fromDB;
        else {
            this.degrees = this.fromDB.filter(
                a => a.name.toLowerCase().indexOf(filterValue) > -1
            );
        }
    }

    showPromptToCreateCourse() {
        let prompt = this.alertCtrl.create({
            title: "Criar entrada",
            message: "Descreva a opção a ser criada",
            inputs: [
                {
                    name: "course",
                    placeholder: "Descrição"
                }
            ],
            buttons: [
                {
                    text: "Cancelar"
                },
                {
                    text: "Salvar",
                    handler: data => {
                        if (data.course && data.course.trim() != "")
                            this.insertCourse(data.course);
                        else return false;
                    }
                }
            ]
        });
        prompt.present();
    }
}
