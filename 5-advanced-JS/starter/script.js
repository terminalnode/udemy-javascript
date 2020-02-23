// Function constructor
/*
const Person = function(name, birthYear, job) {
    this.name = name;
    this.birthYear = birthYear;
    this.job = job;
    this.calculateAge = function() {
        return 2020 - birthYear;
    }
}

const john = new Person("John", 1990, "teacher");

// it doesn't matter that John is defined before the method
// but we can not call it yet. this would return an error:
// console.log(john.someFunction());

Person.prototype.someFunction = function() {
    return "this is the return value of someFunction";
}

const tom = new Person("Tom", 1890, "markup language enthusiast");

console.log(john.calculateAge());
console.log(tom.calculateAge());
console.log(john.someFunction());
*/

// Object.create
/*
const personPrototype = {
    calculateAge: function() {
        return 2020 - this.birthYear;
    }
}

var john = Object.create(personPrototype);
john.name = "John";
john.birthYear = 1990;
john.job = "teacher";

var jane = Object.create(personPrototype,
{
    name: { value: "Jane" },
    birthYear: { value: 1969 },
    job: { value: "designer" }
});

console.log(john.calculateAge());
console.log(jane.calculateAge());
*/

// Primitives vs objects
// This is just the same as in java.
// Objects are references, primitive values are not.

// Passing functions as arguments
// Same as python and a bunch of other languages, useful but not very interesting.

// Returning functions
// Kind of weird, kind of cool. Anyway, I'll just write down
// the generic pattern for how to do this.
/*
function sayHello() {
    return function(name) {
        return "Hello " + name;
    }
}
innerF = sayHello();
console.log(sayHello()("John"));
console.log(innerF("John"));
*/

// Immediately invoked function expression, IIFE
// Apparently it's used to get data privacy and hide intermediate values and stuff.
/*
(function(goodLuck) {
    var score = Math.random() * 10;
    console.log(score >= 5 - goodLuck)
})(5);
*/

// Closures
/*
function retirement(retirementAge) {
    const text = " years left until retirement.";

    return function(yearOfBirth) {
        const age = 2020 - yearOfBirth;
        return (retirementAge - age) + text;
    }
}

const retirementUS = retirement(66);
const retirementEU = retirement(65);

function yearsUntil(cutOffAge, what) {
    const text = " years left until " + what + ".";

    return function(yearOfBirth) {
        const age = 2020 - yearOfBirth;
        return (cutOffAge - age) + text;
    }
}

// ok that is pretty neat
const canDrinkSE = yearsUntil(20, "this person can drink");
*/

// Bind, call and apply
/*
const john = {
    name: "John",
    age: 26,
    job: "teacher",
    presentation: function(style, timeOfDay) {
        if (style === "formal") {
            return `Good ${timeOfDay}, ladies and gentlemen! ` +
                   `My name is ${this.name}, I'm ${this.age} years old and ` +
                   `work as a ${this.job}.`
        } else if (style === "casual") {
            return `It's ${timeOfDay} my dudes, whaddap! Name's ${this.name}, ` +
                   `I'm ${this.age}, sell drugs at night and work as a ${this.job} daytime.`
        }
    }
}

const emily = {
    name: "Emily",
    age: 35,
    job: "drug dealer"
};

const emilyPresentationCall = john.presentation.call(emily, "casual", "night");
const emilyPresentationApply = john.presentation.apply(emily, ["casual", "night"]);
// this last one returns a function with predefined parameters rather than the result of that call
const emilyPresentationBind = john.presentation.bind(emily, "casual", "night");
// bind can also create partially applied functions
const emilyPresentationPartialBind = john.presentation.bind(emily, "casual");

// Let's try it on a "real" function
function f(a, b) {
    return a + b;
}

const g = this.f.bind(this, 1);
*/

// Coding challenge
const Question = function(question, correct, wrongs) {
  wrongs.push(correct);
  this.question = question;
  this.answers = wrongs;
  this.correct = correct;
}

Question.prototype.askQuestion = function() {
  // Randomise the order
  this.answers.sort(function(_, _) { return Math.random() - 0.5 });
  // Print question
  console.log(this.question);
  for (let i = 1; i <= this.answers.length; i++) {
    console.log(`${i}. ${this.answers[i - 1]}`);
  }
}

Question.prototype.checkAnswer = function(answer) {
  return this.answers[answer - 1] === this.correct;
}

function playGame() {
  const allQuestions = [
      new Question(
        "Is Javascript the best language in the world?",
        "No",
        ["Yes", "Maybe", "No but it is the second best"]),
      new Question(
        "What's the name of the creator of this quiz?",
        "Alexander",
        ["Tiffany", "Lord Cruxifax", "Shmaple"]),
      new Question(
        "What's the square root of pi?",
        "Not 1",
        ["5", "26", "32", "0", "42"]),
      new Question(
        "Is school a place for smart people?",
        "Lol nope",
        ["No", "Nah", "Probably not"])
  ]

  let answer;
  let playerScore = 0;

  while (answer !== "q" && answer !== null && answer !== "") {
    const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)]
    randomQuestion.askQuestion()
    answer = window.prompt("Type your answer here:");

    if (answer === "q" || answer === null || answer === "") {
      console.log("\nThanks for playing!");
      console.log(`Your final score was ${playerScore}\n\n`);

    } else if (randomQuestion.checkAnswer(answer)) {
      playerScore++;
      console.log("\nThat is correct! Well played!");
      console.log(`Your current score is ${playerScore}\n\n`);

    } else {
      console.log("\nI'm sorry to say, you're answer is stupid and so are you.\n");
      console.log(`Your current score is ${playerScore}\n\n`);
    }
  }
}
