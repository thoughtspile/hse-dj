// Функциональный вариант — объект с данными + функция, которая работет на нём
const vec = { x: 1, y: 2 };
function vecNorm(vec) {
  return Math.abs(vec.x) + Math.abs(vec.y);
}
// неплохо, но нужно таскать везде объекты и функции и помнить, что с чем работает
console.log('data + function', vec, vecNorm(vec));


// Фабрика объектов с методом, привязанным к объекту через область видимости
function makeVec(x, y) {
  const vec = { x, y };
  // все хорошо, но для каждого объекта создается своя копия функции
  vec.norm = function norm() {
    return Math.abs(vec.x) + Math.abs(vec.y);
  }
  return vec;
}
console.log('scope-method', makeVec(3, 4).norm());


// Внутри функций, вызванных как метод объекта (<obj>.<method>()), доступен объект
// через this. Почти как self в питоне, только появляется волшебным образом,
// а не через аргумент.
function normMethod() {
  // объект-контекст
  return Math.abs(this.x) + Math.abs(this.y);
}
function makeVecBetter(x, y) {
  return { x: 1, y: 2, norm: normMethod };
}
// теперь метод norm общий у всех созданных объектов
const vecWithMethod = makeVecBetter(10, 20);
console.log('shaerd method', vecWithMethod.norm());


// Если вытащить метод из объекта и вызывать как свободную функцию, нужного this не будет
const freeNormBad = vecWithMethod.norm;
console.log('lost context', freeNormBad());
// Можно использовать такой трюк:
const freeNormGood = () => vecWithMethod.norm();
console.log('preserved context',freeNormGood());


// Главное различие между стрелочными функциями и function - в работе с this:
const incable = {
  data: [1,2,3],
  by: 10,
  incFunction: function() {
    // function всегда создает новый контекст
    return this.data.map(function (val) {
      // this потерялся
      return val + this.by;
    });
  },
  incSafe: function() {
    // ... => ... всегда наследует this из области видимости, в которой создана
    return this.data.map(val => val + this.by);
  },
  // всегда, хотим мы этого или нет.
  incNotBound: () => {
    return this.data.map(val => val + this.by);
  }
};
console.log('wanna inc the numbers', incable.data, 'by', incable.by);
console.log('Too un-hip', incable.incFunction());
console.log('Too hip', incable.incNotBound());
console.log('just perfect!', incable.incSafe());
