console.log("#---------------------------#");
console.log("|   It's challenge time!!   |");
console.log("| Final challenge! Houghda! |");
console.log("#---------------------------#");

/////////////////////////////////
// CODING CHALLENGE
// Suppose that you're working in a small town administration, and you're in charge of two town elements:
// 1. Parks
// 2. Streets
// It's a very small town, so right now there are only 3 parks and 4 streets. All parks and streets have a name and a build year.
//
// At an end-of-year meeting, your boss wants a final report with the following:
// 1. Tree density of each park in the town (forumla: number of trees/park area)
// 2. Average age of each town's park (forumla: sum of all ages/number of parks)
// 3. The name of the park that has more than 1000 trees
// 4. Total and average length of the town's streets
// 5. Size classification of all streets: tiny/small/normal/big/huge. If the size is unknown, the default is normal
//
// All the report data should be printed to the console.
//
// HINT: Use some of the ES6 features: classes, subclasses, template strings, default parameters, maps, arrow functions, destructuring, etc.

class TownElement {
  constructor(name, buildYear) {
    this.name = name;
    this.buildYear = buildYear;
  }

  age() {
    return (new Date().getFullYear()) - this.buildYear;
  }
}

class Park extends TownElement {
  constructor(name, buildYear, area, numberOfTrees) {
    super(name, buildYear);
    this.area = area;
    this.numberOfTrees = numberOfTrees;
  }
}

class Street extends TownElement {
  constructor(name, buildYear, length) {
    super(name, buildYear);
    this.length = length;
  }
}

function averageAge(presentableName, townElements) {
  let elementAges = townElements.map(elem => elem.age());
  let sumOfAges = elementAges.reduce((acc, val) => acc + val);
  let averageAge = (sumOfAges / townElements.length).toFixed(2);
  console.log(`The average age of the town's ${presentableName} is ${averageAge}`);
}

function maxAge(presentableName, townElements) {
  let elementAges = townElements.map(elem => elem.age());
  let highestAge = Math.max(...elementAges);
  let oldestElement = townElements.find(e => (e.age() === highestAge));
  console.log(`The oldest of the town's ${presentableName} is ${oldestElement.name}, at a whoppin' ${oldestElement.age()} years old!`);
}

function showParkWithLotsOfTrees(townParks) {
  let park = townParks.find(park => park.numberOfTrees > 1000);
  console.log(`Did you know that ${park.name} has over one THOUSAND trees???`);
}

function streetLengthData(townStreets) {
  let streetLengths = townStreets.map(elem => elem.length);
  let sumOfLengths = streetLengths.reduce((acc, val) => acc + val);
  let avg = (sumOfLengths / townStreets.length).toFixed(2);
  console.log(`The average length of a street in this city is ${avg} length units!`);
  console.log(`The total length of all streets in town is ${sumOfLengths} length units!`);
}

const townParks = [
  new Park("Park 1", 1965, 10, 151),
  new Park("Park 2", 2010, 20, 1391),
  new Park("Park 3", 2000, 30, 10),
];

const townStreets = [
  new Street("Street 1", 1921, 10),
  new Street("Street 2", 1939, 20),
  new Street("Street 3", 1954, 30),
  new Street("Street 4", 2011, 40),
];

averageAge("parks", townParks);
averageAge("streets", townStreets);
maxAge("parks", townParks);
maxAge("streets", townStreets);
showParkWithLotsOfTrees(townParks);
streetLengthData(townStreets);
