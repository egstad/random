import arrayShuffle from "array-shuffle";
import { adjectives } from "~~/public/adjectives";
import { imageQueryStrings } from "~~/public/imageQueryStrings";
import { nouns } from "~~/public/nouns";

let shuffledNouns: string[] = [];
let shuffledAdjectives: string[] = [];
let shuffledImageQueryStrings: string[] = [];
let shuffledImages: any = [];

// find the shortest array, save that number for generator
const getQueryMaxLength = (): number => {
  return Math.min(
    shuffledImageQueryStrings.length,
    shuffledAdjectives.length,
    shuffledNouns.length
  );
};

// generate array of noun, adjective, and image query string pairs
const generatePairs = () => {
  const objectPairs = [];

  for (let index = 0; index < getQueryMaxLength(); index++) {
    objectPairs.push({
      noun: shuffledNouns[index],
      adjective: shuffledAdjectives[index],
      imageQueryString: shuffledImageQueryStrings[index],
      image: shuffledImages[index],
    });
  }

  return objectPairs;
};

const fetchImageData = async () => {
  Promise.all(
    shuffledImageQueryStrings.map(async (queryString) => {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&&prop=pageimages|pageterms&pithumbsize=1024&titles=${queryString}&origin=*`
      );
      const image = await response.json();
      shuffledImages.push(image.query.pages[0].thumbnail);
    })
  );
};

const shuffle = () => {
  shuffledImageQueryStrings = arrayShuffle(imageQueryStrings);
  shuffledAdjectives = arrayShuffle(adjectives);
  shuffledNouns = arrayShuffle(nouns);
};

export default async () => {
  shuffle();
  // await fetchImageData();

  return {
    combos: generatePairs(),
    combosLength: getQueryMaxLength(),
  };
};
