// Пишем в консоль:
console.log('hi children!');


// ** Переменные **

// Объявляем
var x = 10;
let y = 20;
const z = 30;

// Разница между let и const
y = 30; // OK
// z = 40; // тут будет ошибка, const-переменную нельзя менять по ссылке

// Разница между let и var
if (true) {
  var surprise = 0;
  console.log('I am defined in a block', surprise);
}
// Вы не ожидали, но она убежала из блока!
console.log('surprise!', surprise);

if (true) {
  let noSurprise = 10;
}
// Никаких сюрпризов, тут ошибка
// console.log(noSurprise);

// именование
// camelCase для переменных
const camelCasedName = 10;
// Названия классов с заглавной
console.log(Object, Array, Math);

// В целом предпочитайте const, затем let.


// Типизация нестрогая. Базовые типы:
// число
y = 213.2;
// строка
y = 'hello';
// тоже строка
y = "hello";
// буль
y = false;
// null
y = null;
// undefined
y = undefined;

// ** Операторы **

// Операторы привдят типы сами по себе
console.log(
  1 + 1, // 2
  '1' + '1', // = '11'
  '1' + 1, // = '1' + '1' = '11'
  true + 1, // = 1 + 1 = 2
  false + true // = 0 + 1 = 1
);
// &&, || операторы приводят тип для проверки, но возвращают исходное значение
console.log(
  false || true, // true
  false && true, // false
  1 || 0, // 1
  'hello' || 'hi', // 'hello'
  0 || 'popup' // 'popup'
);
// ! приводит тип к boolean
console.log(!0); // true

// === Сравнивает типы, == приводит к одному:
console.log(1 == '1', 0 == false, 1 === 1, 1 === true);
// Так что используйте === (и !==)

// Аккуратнее с математикой!
console.log('I want 0.1', 0.3 - 0.2); // Плохо считается
console.log(1 / 10); // Целые числа и числа с плавающей запятой - один и тот же тип
console.log('modulo', 100 % 12); // остаток
console.log(Math.floor(1 / 10)); // Типа целочисленное деление


// ** Функции **

// Функции первого класса (first class citizen) можно класть в переменные и передавать в другие функции параметром:
const fnClassic = function(x) {
  return x + 18;
};
// Почти то же самое
function fnClassicNamed(x) {
  return x * 77;
}
// То же самое, новый синтаксис - стрелочные функции
const mult = (x, y) => { return x * y; };
// Если тело функции состоит только из return, можно убрать return и фигурные скобки.
const sum = (x, y) => x + y;
// Если аргумент один, можно не окружать его скобками.
const addFour = x => x + 4;

// Любую функцию можно вызвать с любым числом аргументов
function log(a1, a2) { console.log('first:', a1, 'second:', a2); }
log(0, 1);
// Если аргумента нет - вместо него функция получит undefined
log(0);
log();
// Лишние просто выкинутся
log(100, 200, 300);


// ** Объекты **
// Единственный составной тип данных в js

// Создаём литералом:
const obj = {
  // <ключ>: <значение>
  hello: 'str',
  // Можно ключ в кавычках
  "id": 234,
  // Нужно, если ключ - не идентификатор
  'smart-attr': 123,
  // Значения могут быть любого типа:
  complex: {
    hello: 'hello',
    fn: () => console.log('i got called')
  }
};

// Получаем по ключу:
console.log(obj['hello']);
// То же самое: оператор "." превращает идентификатор после себя в ключ-строку
console.log(obj.hello);
// Квадратные скобки нужны, чтобы обращаться по переменной:
const key = 'complex';
console.log(obj[key]);
// Получаем элемент, которого нет — выходит undefined
console.log('no such value:', obj.noKey);
// Список ключей
console.log('keys', Object.keys(obj));
// Проверяем, есть ли ключ в объекте:
console.log('hello' in obj, 'hi' in obj);
// Если честно, обычно делают что-то вроде
console.log(obj['hello'] === undefined);
// Но осторожнее, помните про приведение типов:
obj.zero = 0;
if (obj.zero) { // 0 == false
  console.log('I want to break free!');
}


// ** if **
if (obj.id === 234) {
  let innerVar = 10;
  console.log('obj.id is 234', innerVar);
} else if (obj.id === '234') {
  console.log('obj.id is (string) 234');
} else {
  console.log('=(');
}


// ** Массивы **

const arr = [1,2,3,4];
console.log('arr[0]', arr[0]); // получить элемент
// const значит, что переменной arr нельзя присвоить новое значение -- старое можно менять как угодно
arr[2] = 100;
console.log('mutated array', arr); // console.log можно передать любой объект

// Полезные методы массива:
arr.push(5); // Добавить элемент в конец
console.log('append el', arr);

console.log('length', arr.length); // длина массива

// ** Итерация и методы массива **

// цикл
for (let i = 0; i < arr.length; i++) {
  console.log('found', arr[i], 'at', i);
}

// Вызываем функцию для каждого элемента
arr.forEach((item, i) => {
  console.log('found', item, 'at', i);
});

// map создает новый массив, применяя функцию к каждому элементу
console.log('inc by 4', arr.map(addFour));
// можно создать функцию прямо на месте, а не брать из переменной
console.log('square', arr.map(x => x * x));

// Отфильтровать элементы по предикату
console.log('square', arr.filter(x => x > 2));

// some и every
console.log('arr has 2: ', arr.some(e => e === 2));
console.log('arr has only positive items: ', arr.every(e => e > 0));

// reduce (он же fold)
console.log('sum', arr.reduce((acc, x) => acc + x, 0)); // reduce(<Function>, <initial value>)
// Для каждого элемента массива:
// 1. получает текущее значение аккумулятора и элемента массива
// 2. делает с ними что-то
// 3. возвращает новое значение аккумулятора
// Начальное значение аккумулятора берется из второго параметра.

// Еще раз, с forEach:
let total = 0;
[1,2,3,4,5].forEach(x => {
  total += x;
});
console.log(total);

// И с reduce:
const sum2 = [1,2,3,4,5,6,7].reduce((acc, x) => {
  return acc + x;
}, 0);
console.log(sum2);

// Аккуратно, Array наследует от Object. Объект не является массивом.
// У объекта нет методов map / forEach / length
// Чтобы итерировать над объектом, превратите его в массив при помощи Object.keys или Object.values:
console.log(
  'keys', Object.keys(obj),
  'values', Object.keys(obj).map(k => obj[k])
);
