import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { AlertController } from "ionic-angular/components/alert/alert-controller";

import { GunProvider } from "../../providers/gun/gun";

@Component({
    selector: "page-home",
    templateUrl: "home.html"
})
export class HomePage {
    public courses: Array<{ name: string}>;

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public gun: GunProvider
    ) {
        this.loadCourses();
    }

    loadCourses() {
        let value = this.gun.loadCourses();
        this.courses=value;
    }

    insertCourse(courseName: string) {
        this.gun.insertCourse(courseName);
    }

    upvote(course: any) {
        let prompt = this.alertCtrl.create({
            title: "Votar no curso",
            message:
                "Caso você faça esse curso digite o seu email para confirmar seu voto",
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
                    text: "Criar entrada",
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

    filterCourses(ev: any) {
        this.loadCourses();
        
        let filterValue = <string>ev.target.value.toLowerCase();
        const hasExpressionToFilter = filterValue && filterValue.trim() != "";
        
        if (!hasExpressionToFilter) return;
        else {
            this.courses.forEach(x=> console.log(x))
            
        }
    }

    showPromptToCreateCourse() {
        let prompt = this.alertCtrl.create({
            title: "Criar curso",
            message: "Digite o nome do curso que não existe para ser inserido",
            inputs: [
                {
                    name: "course",
                    placeholder: "Curso"
                }
            ],
            buttons: [
                {
                    text: "Cancelar"
                },
                {
                    text: "Criar entrada",
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
