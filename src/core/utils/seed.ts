export function seededRandom(seed: number) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export function seedToNumber(seed: string): number {
    // Convert the seed (4 characters) into a numeric value
    return seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
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
