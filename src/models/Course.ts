export { Course };

class Course {
    name: string;
    upvotes: { email: string; vote: number }[];

    constructor(name: string) {
        this.name = name;
        this.upvotes = [];
    }

    sumUpvotes() {
        return this.upvotes.map(x => x.vote).reduce((a, b) => a + b);
    }
}
