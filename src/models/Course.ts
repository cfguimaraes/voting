export { Entry, Upvote };

class Entry {
    name: string;
    upvotes: Upvote[];
    createAt: number;

    constructor(name: string) {
        this.name = name;
        this.createAt = new Date().getTime();
        this.upvotes = [];
    }

    sumUpvotes() {
        return this.upvotes.map(x => x.vote).reduce((a, b) => a + b);
    }
}

class Upvote {
    email: string;
    vote: number;

    constructor(email: string) {
        this.email = email;
        this.vote = 1;
    }
    downVote() {
        this.vote = 0;
        return this;
    }
}
