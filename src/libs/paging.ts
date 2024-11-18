export class Paging {
    constructor(page: number, limit: number) {
        this.page = page;
        this.limit = limit;
        this.default()
    }

    total: number = 0;
    page: number;
    limit: number;
    cursor?: number;
    nextCursor?: number;

    default() {
        if (this.page <= 0)
            this.page = 1;
        if (this.limit <= 0)
            this.page = 20;
    }
}


