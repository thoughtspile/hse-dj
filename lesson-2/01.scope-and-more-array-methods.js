// Область видимости функций
function top() {
  let topVar = 0
  function bottom () {
    // bottom() может менять любые переменные в области видимости top
    const localVar = 10;
    topVar = 200;
    console.log('bottom', topVar, localVar);
  }
  bottom();
  // localVar не убежала из bottom(), topVar изменилась
  console.log('topVar cahnged by bottom()', topVar);

  function shadow() {
    // внутри функции можно *объявить* переменную с таким же имененем, как в
    // родительской области видимости. После этого родительская переменная недоступна.
    const topVar = 2000;
    console.log('shadowed topVar', topVar);
  }
  shadow();
  console.log('topVar not changed by shadow()', topVar);
}
top();

// После присваивания необъявленной переменной она автоматически убегает
// в глобальную область видимости
function breakFree() {
  // не надо так делать
  runaway = 200;
}
breakFree();
console.log('non-declared var ran away to global scope', runaway);


// const не мешает изменять сам объект, не переопределяя переменную
const obj = {};
function change(obj) {
  obj.name = 'jefaef';
  obj = { asf: 123 };
}
change(obj);
console.log('const obj cahnged', obj);


// ** Поиск в массиве **
// индекс элемента со сравнением по ссылке
console.log([1, 2, 3].indexOf(2));
// не нашли - возвращаем -1
console.log([].indexOf(2) === -1);
// объекты разные.
console.log([1, {}, 3].indexOf({}));
// то же, что <array>.indexOf(<el>) !== -1
console.log([1,2,3].includes(2));
// ищем по предикату, возвращаем элемент
console.log([{},{x:2},{}].find((obj, i) => obj.x + i > 2));
// индекс по предикату
console.log([{},{x:2},{}].findIndex((obj, i) => obj.x + i > 2));

// ** Конкатенация **
// принимает массив и прицепляет в конец
console.log([1, 2, 3].concat([2, 3, 4]));
// или несколько массивов
console.log([1, 2, 3].concat([2, 3], [4]));
// или элементы
console.log([1, 2, 3].concat(2, 3, 4));
// или всё вместе
console.log([1, 2, 3].concat([2, 3], 4));

// ** Лексикографическая сортировка **
console.log([1, 3, 2, 10].sort());
// можно передавать свою функцию сравнения
console.log([1, 3, 2, 10].sort((a, b) => a - b));

// объекты и массивы можно вкладывать друг в друга сколько угодно
console.log([[1,{x:12,arr:[]}],3,2, 10]);
