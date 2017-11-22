// импортируем библиотеку, установленную через npm
const randomQuote = require('random-quote');
// импортируем другой файл по пути
const randint = require('./random.js');

// используем
console.log('random int:', randint(1000));
// не пугайтесь, это промис
randomQuote().then(
  quote => console.log(quote[0].content),
  err => console.error(err)
);
