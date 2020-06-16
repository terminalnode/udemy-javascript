console.log("Hello.");

// Lecture: let and const
// ES5
var name5 = "Jane Smith";
var age5 = 23;
name5 = "Not Jane Smith";
console.log(name5)

// ES6
const name6 = "Jane Smith";
let age6 = 23;
// Can't reassign a const value.
// name6 = "This will raise an error";
// But we can reassign a let value.
age6 = 24;
console.log(name6)
console.log(age6)

// ES5
// Variables in ES6 are block scoped, ES5 var is function scoped.
function driversLicence5(passedTest) {
  if (passedTest) {
    var firstName = "John";
    var yearOfBirth = 1990;
  }

  // This is reasonable in ES5, because the variables are function scoped.
  console.log(`${firstName}, born in ${yearOfBirth}, is now officially allowed to drive a car.`);
}
driversLicence5(true);

// ES 6
function driversLicence6(passedTest) {
  if (passedTest) {
    let firstName = "John";
    const yearOfBirth = 1990;

    console.log(`${firstName}, born in ${yearOfBirth}, is now officially allowed to drive a car.`);
  }

  // This will not work, because of block scoping.
  // console.log(`${firstName}, born in ${yearOfBirth}, is now officially allowed to drive a car.`);
}
driversLicence6(true);

// Another important difference between ES5 and ES6 is that
// variables are not hoisted, they can not be used before they
// are defined. `var` however is hoisted and that's bullshit.

// Block scoping is great, look at this shit:
let i = 23;
for (let i = 0; i < 5; i++) {
  console.log(i);
}
console.log(i); // will print 23
// if we used var instead of let, it would've printed 5
// because var SUCKS

////////////////////////////////////////////////////////
// Lecture: blocks and IIFEs
// tldr IIFEs are dead, we can just use blocks.
{
  const a = 1;
  let b = 2;
  console.log(a + b); // Works
}
// does not work
// console.log(a + b);

// To do the same block thing in ES5 we'd make an IIFE:
(function() {
  var a = 1;
  var b = 2;
  console.log(a + b); // Works
})();

// does not work
// console.log(a + b);
// it's almost like a sane programming language now, amazing

////////////////////////////////////////////////
// Lecture: Strings
// Apparently template literals are an ES6 feature.
let firstName = "Johnny";
let lastName = "Boy";
const yearOfBirth = 1990;
function calcAge(year) {
  return (new Date().getFullYear()) - year;
}

// Virgin ES5 way of doing it
console.log(firstName + " " + lastName + " is " + calcAge(yearOfBirth) + " years old.")
// Chad ES6 way of doing it
console.log(`${firstName} ${lastName} is ${calcAge(yearOfBirth)} years old.`)

// We have some new methods as well
console.log(`${firstName} starts with J? ${firstName.startsWith('J')}`)
console.log(`${firstName} starts with j? ${firstName.startsWith('j')}`)
console.log(`${firstName} ends with x? ${firstName.endsWith('x')}`)
console.log(`${firstName} includes x? ${firstName.includes('x')}`)
console.log(`${firstName} includes oh? ${firstName.includes('oh')}`)
console.log(`${firstName}.repeat(3) ${firstName.repeat(3)}`)

///////////////////////////////////////////////
// Lecture: Arrow functions
// Or as they're called in sane languages: lambda functions
const years = [ 1990, 1965, 1982, 1937 ]

// ES5
var ages5 = years.map(function(year) {
  return (new Date().getFullYear()) - year;
});

// ES6
let ages6 = years.map(year =>
  (new Date().getFullYear()) - year
);

// Arrow functions do not have a this-keyword,
// They use the surrounding this object. Also cool.
// ES5-ish
var box5 = {
  color: "green",
  position: 1,
  clickMe: function() {
    document.querySelector(".green")
      .addEventListener("click", function() {
        console.log(`Hi! I'm box ${this.position} and I'm ${this.color}.`);
      });
  }
};
box5.clickMe(); // Hi! I'm box undefined and I'm undefined..... I mean.... true?

var box5fixed = {
  color: "green",
  position: 1,
  clickMe: function() {
    // Let's make this python code instead. :)
    var self = this;
    document.querySelector(".green")
      .addEventListener("click", function() {
        console.log(`Hi! I'm box ${self.position} and I'm ${self.color}.`);
      });
  }
};
box5fixed.clickMe(); // Hi! I'm box 1 and I'm green.

// Magic. Code less ugly and actually works.
const box6 = {
  color: "green",
  position: 1,
  clickMe: function() {
    document.querySelector(".green")
      .addEventListener("click", () => {
        console.log(`Hi! I'm box ${this.position} and I'm ${this.color}.`);
      });
  }
};
box6.clickMe(); // Hi! I'm box 1 and I'm green.

//////////////////////////////
//Lecture: Destructuring
const john = ["John", 26];

// ES5
var name = john[0];
var age = john[1];

// ES6
let [name62, age62] = john;
console.log(`${name62} is ${age62} y/o`)

// We can also do this with objects.
const johnObject = { firstNameD: "John", lastNameD: "Lollerstorm" }
// Method one: Same variable name as field names
let {firstNameD, lastNameD} = johnObject;
console.log(`His name is ${firstNameD} ${lastNameD}!`)
// Method two: Not stupid
let {firstNameD: a180, lastNameD: b180} = johnObject;
console.log(`His name is ${a180} ${b180}!`)
