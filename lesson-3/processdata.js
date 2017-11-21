// require в браузере не работает!
// Заходите в следующий вторник: выясним, как это исправить
// const _ = require('lodash');

// Прицепляем к элементу с id="output" <ul>, контейнер для списка
const wrapper = document.getElementById('output');
const target = document.createElement('ul');
wrapper.appendChild(target);

// Загружаем данные с локального сервера (работает, если запускать проект через npm run dev)
fetch('/opendata.json')
  // делаем из JSON js-объект
  .then(res => res.json())
  .then(data => {
    // выводим данные  в консоль
    console.log(data);
    // (это массив)
    data
      // достаём из каждого элемента массива ссылку на проектную декларацию
      .map(i => i.LinkToProjectDeclaration)
      // убираем пустые и кириллические ссылки
      .filter(href => !!href && /^[a-zA-Z.]*$/.test(href))
      // для каждого оставшегося адреса...
      .forEach(href => {
        // создаем элемент <a> (ссылку)
        const a = document.createElement('a');
        // говорим, куда эта ссылка ведет
        a.href = 'http://' + href;
        // Текст ссылки - адрес
        a.innerText = href;

        // оборачиваем в <li>, элемент списка
        const li = document.createElement('li');
        li.appendChild(a);
        // и подцепляем в конец списка
        target.appendChild(li);
      });
  })
  .catch(err => {
    // если что-то пошло не так, выводим на страницу ошибку
    wrapper.innerHTML = 'I get error all is bad =\'(';
  });
