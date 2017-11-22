# Занятие 3: JSON, асинхронность и скрипты на странице (21.11.2017)

JSON — формат сериализации (запихивания в строку) данных. Чтобы положить данные в файл или передать по сети, их засовывают в строку через `JSON.stringify`, а потом достают из неё через `JSON.parse`. Формат похож на урезанный js. Типы:
    - число, `12.22`
    - строка (всегда в двойных кавычках), `"string"`
    - `true` / `false`
    - массивы, `[1, 2, 23]`
    - ассоциативные массивы, причем ключ всегда в двойных кавычках: `{ "key": "value" }`
Все типы можно вкладывать друг в друга сколько угодно.

Запустите сервер в этой папке через
```
npm i
npm run dev
```

## Задание

- Взять из `npm` библиотеку `request`.
- Запросить что-нибудь из интернета в и вывести в консоль через node-style коллбек.
- Написать руками (смотрите подсказку в `main.js`) промис-обертку для `request`:
  - `requestPromise(URL)` возврвщает объект с методом `then`;
  - функции из аргументов `then` вызываются как у настоящего промиса;
  - можно составить then-цепочку, возвращая на каждом шаге промисы или не-промисы.
- Сделать то же самое через `new Promise` и больше никогда не писать промис-обертки руками.

Официальный тест-кейс:
```js
requestPromise('www.google.ru')
  .then(res1 => console.log('ok google', res1))
  .then(() => 'https://mail.ru')
  .then(url => requestPromise(url))
  .then(res2 => console.log('ok mail', res2));
// ok google <google.ru response>
// ok mail <mail.ru response>

requestPromise('123123').then(
  () => console.log('ok'),
  err => console.log('err', err)
).then(
  () => console.log('rejection handled')
);
// err <err>
// rejection handled

requestPromise('123123').then(
  () => console.log('ok')
).then(
  () => console.log('rejection handled')
  () => console.log('error propagated')
);
// error propagated
```
