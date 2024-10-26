class Mutex {
    private locked = false;
    private waitQueue: (() => void)[] = [];

    async acquire(): Promise<void> {
        if (!this.locked) {
            this.locked = true;
            return;
        }
        return new Promise((resolve) => {
            this.waitQueue.push(resolve);
        });
    }

    release(): void {
        if (this.waitQueue.length > 0) {
            const resolve = this.waitQueue.shift()!;
            resolve();
        } else {
            this.locked = false;
        }
    }
}

export default Mutex;