class Stack {
  constructor() {
    this.data = [];
  }

  push(e) {
    this.data.push(e);
  }

  pop() {
    return this.data.pop();
  }

  static fromArray(arr) {
    const s = new Stack();
    s.data = arr.slice();
    return s;
  }
}

const s = new Stack();
console.log(s);
s.push(100);
console.log(s);
s.pop();
console.log(s);

class Deque extends Stack {
  pushLeft(e) {
    this.data.unshift(e);
  }

  popLeft() {
    return this.data.shift();
  }
}

const d = new Deque();
console.log(d);
d.push(100);
d.pushLeft(200);
console.log(d);
d.pop();
console.log(d);
console.log(d.popLeft());

console.log(Stack.fromArray([1,2,3]));


// так измерять время
console.time('1000 stack');
const st = new Stack();
for (var i = 0; i < 100000; i++) {
  st.push(Math.random());
}
console.timeEnd('1000 stack');

console.time('1000 deque');
const dt = new Deque();
for (var i = 0; i < 100000; i++) {
  dt.pushLeft(Math.random());
}
console.timeEnd('1000 deque');
