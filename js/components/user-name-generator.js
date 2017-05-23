let colors = [
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Indigo",
  "Violet",
  "Cyan",
  "Magenta",
  "Grey",
  "Lilac",
  "Pink",
  "Sapphire",
  "Ruby",
  "Emerald",
  "Topaz",
  "Jade",
  "Onyx",
  "Citrine",
  "Amethyst",
  "Turquoise",
  "Amber",
  "Gold",
  "Silver",
  "Copper",
  "Bronze",
  "Platinum",
  "Iron",
  "Nickel",
  "Steel"
];

let animals = [
  "Cat",
  "Dog",
  "Mouse",
  "Chipmunk",
  "Squirrel",
  "Rabbit",
  "Dove",
  "Turtle",
  "Lizard",
  "Lion",
  "Tiger",
  "Elephant",
  "Coyote",
  "Chicken",
  "Cow",
  "Horse",
  "Pony",
  "Eagle",
  "Koala",
  "Kangaroo",
  "Lemur",
  "Zebra",
  "Moose",
  "Reindeer",
  "Turkey",
  "Groundhog",
  "Raccoon",
  "Goat",
  "Llama",
  "Puma"
];

let getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function () {
  let color = colors[getRandomInt(0, colors.length - 1)];
  let animal = animals[getRandomInt(0, animals.length - 1)];
  let num = getRandomInt(100, 999);
  return color + animal + num;
}