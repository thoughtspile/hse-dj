const _ = require('lodash');

const arr = [1,2,3,3,2,100];
console.log(_.uniq(arr));

const { x } = { x: [...arr]  };
console.log(x);

// const x = await fetch('http://google.ru');
