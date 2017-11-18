// Классы в стиле ES5

// конструктор - простая функция. Обычно конструкторы называют с заглавной буквы.
function Vector(x, y) {
  this.x = x;
  this.y = y;
}

// <Constructor>.prototype становится прототипом объекта, созданного через new <Constructor>()
Vector.prototype.norm = function norm() {
  // this - контекст
  return Math.abs(this.x) + Math.abs(this.y);
}

// Оператор new создает пустой объект, прикрепляет к нему нужный прототип и вызывает функцию
// в контексте созданного объекта.
const vInst = new Vector(10, 20);
console.log(vInst.norm());

// Статические методы можно изобразить через поля функции-конструктора (функция - тоже объект)
Vector.zero = function() {
  return new Vector(0, 0);
};
console.log(Vector.zero());
// Хорошие кейсы для статических методов - фабрики...
// console.log(Vector.fromArray([100, 200]));
// console.log(Vector.clone(oldVec));
// и "симметричные" операции на нескольких экземплярах класса
// console.log(Vector.isEqual(v1, v2));



// Классы в стиле ES6

// В новой версии js классы (конструктор + прототип) можно объявлять с сахарным синтаксисом.
// Поддерживается наследование (тоже прототипное) через extend.
class VectorPolar extends Vector {
  constructor(r, phi) {
    // не забудьте вызвать конструктор родителя
    super(Math.cos(phi) * r, Math.sin(phi) * r);
    this.phi = phi;
    this.r = r;
  }

  // расширили
  mirror() {
    this.phi += Math.PI;
  }
}
console.log(new VectorPolar(10, 20));


// При желании можно изобразить инкапсуляцию через область видимости
const counter = () => {
  let tick = 0;
  return {
    getTicks: () => tick,
    next: () => tick++
  }
};
const c = counter();
console.log(c.getTicks());
c.next();
console.log(c.getTicks());
// а само значение счетчика мы никогда не получим и не перезапишем снаружи

// но обычно так не делают, а просто называют приваные свойства с подчеркиванием:
class Counter {
  constructor() {
    this._tick = 0;
  }
  next() {
    this._tick++;
  }
  getTicks() {
    return this._tick;
  }
}
