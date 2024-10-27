export function seededRandom(seed: number) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export function seedToNumber(seed: string): number {
    // Convert the seed (4 characters) into a numeric value
    return seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}


export function numberToSeed(num: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let seed = '';

    for (let i = 0; i < 4; i++) {
        // Map the number to a character within 'a-z' and '0-9' by using the `chars` string
        const index = num % 36;  // Use modulo 36 to stay within the index range of `chars`
        seed = chars[index] + seed;
        num = Math.floor(num / 36);
    }
    
    return seed;
}

export function shuffleArrayWithSeed<T>(array: T[], seed: string): T[] {
    const seedNumber = seedToNumber(seed);
    let shuffledArray = array.slice();

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seedNumber + i) * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}






// // Example usage:
// const myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// const seed = "a1b2"; // 4 characters seed from a-z and 0-9
// const shuffled = shuffleArrayWithSeed(myArray, seed);
// console.log(shuffled);
