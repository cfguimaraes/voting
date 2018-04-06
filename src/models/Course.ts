export { Course };

class Course {
    name: string;
    upvotes: string[];

    constructor(name: string) {
        this.name = name;
        this.upvotes = [];
    }
}
