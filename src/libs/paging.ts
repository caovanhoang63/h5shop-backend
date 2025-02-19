export class Paging {
    constructor(page: number, limit: number) {
        this.page = page;
        this.limit = limit;
        this.default()
    }

    getOffSet() : Number{
        return (this.page - 1) * this.limit;
    }
    total: number = 0;
    page: number;
    limit: number;
    cursor?: number | bigint;
    nextCursor?: number | bigint;

    default() {
        if (this.page <= 0)
            this.page = 1;
        if (this.limit <= 0)
            this.limit = 20;
    }
}


