const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

export const randomSalt = (n: number): string => {
    let a = ""
    for (let i = 0; i < n; i++) {
        a += letters[randomIntFromInterval(0, letters.length - 1)]
    }
    return a
}

function randomIntFromInterval(min: number, max: number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
