const fs = require('fs');
const fsPromise = require('fs-promise');
const path = require('path');

// ** JSON **

// данные
const data = {
  name: 'Vera',
  "age": 32,
  'friends': [
    'Boris',
    'Piotr',
  ],
  fn: function () { return 10; },
  n: null,
  u: undefined
};

// туда и обратно, очень просто
console.log(data);
const str = JSON.stringify(data, null, '  ');
console.log(str);
const deser = JSON.parse(str);
console.log(deser);


// ** Асинхронность **
// суть упражнения – класть наши данные в файл и читать из оттуда,
// но идея распросраняется на любые действия, результат которых доступен не сразу:
//   - работа с файлами
//   - работа с базой данных
//   - HTTP-запросы
//   - Даже ожидание ввода от пользователя
const fname = path.join(__dirname, 'vera.json');

try {
  fs.writeFileSync(fname, str); // на этой строке мы ждём, когда же файл действительно запишется, и ничего другого не делаем
  console.log('Sync file written!', '' + fs.readFileSync(fname));
} catch(err) {
  console.error('Sync file ops failed');
}

// На самом деле пока ОС работает с файлами, мы можем делать другие полезные вещи.
// Встречайте Continuation-Passing Style (CPS) или node-style callback
fs.writeFile(fname, str, function (writeErr) {
  // эта функция (коллбек) вызовется, когда мы наконец запишем файл.
  if (writeErr) {
    // Если произошла ошибка, она придёт в первом аргументе
    console.error('error writing file');
    return;
  }
  console.log('write file OK!');
  // Продолжаем...
  fs.readFile(fname, function (readErr, contents) {
    // ещё раз
    if (readErr) {
      console.error('error reading file');
      return;
    }
    // Так можно уйти очень глубоко и превратить свой код в кашу из коллбеков
    console.log('read file OK!', '' + contents);
  });
});
// а пока ОС работает с файлом, можно заняться другими делами
console.log('I am running around having fun while all the file stuff happens somewhere');

// Промисы позволяют получше структурировать асинхронный код.
fsPromise.writeFile(fname, str) // эта обертка над fs возвращает объект с методом then
  // then принимает 2 функции
  .then(
    // первая вызывается при успехе операции
    // в ней можно вернуть промис, и следующий then вызовется с его результатом
    () => fsPromise.readFile(fname)
    // а во второй можно обработать ошибку
  )
  .then(
    // а можно вернуть не-промис, и все равно продолжать then-цепочку
    str => JSON.parse(str),
    // пока мы не обрабатываем ошибку, она проваливается дальше по цепочке
  )
  .then(
    obj => console.log(obj),
    // обработаем разом ошибки записи, чтения и парсинга JSON
    err => console.error('ERROR!', err)
  )
  .then(
    () => console.log('processing file over')
    // сюда ошибка уже не долетит
  );

// А так можно запустить несколько операций и подождать, пока выполнятся все:
// Promise.all([...array of promises or values...]).then((arrayOfResolvedValues) => { ... })
// В CPS это вообще непонятно как делать

// Попробуем реализовать очень плохой промиc сами (на самом деле так делать не надо):
const lousyPromisifySync = (fn) => {
  return {
    then: function(ok, onErr) {
      try {
        ok(fn());
      } catch(err) {
        onErr(err);
      }
    }
  };
};
lousyPromisifySync(() => { throw new Error('=('); }).then(
  res => console.log('all ok, got', res),
  err => console.error('not all ok, caught', err)
);
lousyPromisifySync(() => 10).then(
  res => console.log('all ok, got', res),
  err => console.error('not all ok, caught', err)
);


// Если хотите зайти дальше, async/await сахарок позволяет работать с промисами,
// как если бы это были синхронные операции.
// Важно помнить, что это всего лишь специальный синтаксис для работы с промисами.
const run = async function() {
  try {
    await fsPromise.writeFile(fname, str);
    const res = await fsPromise.readFile(fname);
    console.log('write + read OK', '' + res, JSON.parse(res));
  } catch (err) {
    console.log('async / await error seems pretty synchronous', err);
  }
};
run();
