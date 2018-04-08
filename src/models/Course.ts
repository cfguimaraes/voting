export { Entry };

class Entry {
    name: string;
    upvotes: {};
    createAt: number;

    constructor(name: string) {
        this.name = name;
        this.createAt = new Date().getTime();
        this.upvotes = {};
    }
}
