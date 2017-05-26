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

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



function generateUsername() {
  let color = colors[getRandomInt(0, colors.length - 1)];
  let animal = animals[getRandomInt(0, animals.length - 1)];
  let num = getRandomInt(100, 999);
  return color + animal + num;
}

module.exports = function(){
  let username = getCookie("username");
  if (username == "") {
    username = generateUsername();
    if (username != "" && username != null) {
      setCookie("username", username, 1);
    }
  }
  return username;
}