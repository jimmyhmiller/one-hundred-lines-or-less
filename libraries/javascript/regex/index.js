// Found https://blog.veitheller.de/Regular_Expressions_Made_Simple.html

const match = (regex, text) => {
  if (text.length === 0) {
    return false;
  } else if (regex[0] === "^") {
    return matchHere(regex.substring(1), text);
  } else if (matchHere(regex, text)) {
    return true
  } else {
    return match(regex, text.substring(1));
  }
}

const matchHere = (regex, text) => {
  if (regex.length === 0) {
    return true;
  } else if (regex.length > 1 && regex[1] === "*") {
    return matchStar(regex[0], regex.substring(2), text)
  } else if (regex[0] === "$" && regex.length === 1) {
    return text.length === 0
  } else if (text.length >= 1 && regex[0] === "." || regex[0] == text[0]) {
    return matchHere(regex.substring(1), text.substring(1))
  } else {
    return false
  }
}

const matchStar = (character, regex, text) => {
  if (matchHere(regex, text)) {
    return true;
  } else if (text.length > 0 && character === "." || text[0] === character ) {
    return matchStar(character, regex, text.substring(1))
  } else {
    return false
  }
}


console.log(match("a*", "aaaaaaaa"))
console.log(match("^ab*", "aa"))
console.log(match("^aa$", "aa"))
console.log(match("^.*md$", "asdfmd"))
