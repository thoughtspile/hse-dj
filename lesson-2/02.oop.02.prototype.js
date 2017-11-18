// берём объект со свойствами x и y
const parent = { x: 'parentX', p: 'parentP' };

// и ещё один, со свойством y
const child = { y: 'childY', z: 20 };
// Никакого x нет!
console.log('no x in child', child.x);
// теперь прицепляем прототип
child.__proto__ = parent;
// Теперь если свойства нет, js ищет его в прототипе
console.log('inherited x', child.x);

// Запись в свойство все ещё работает с самим объектом, а не с прототипом
child.x = 'childOverrideX';
console.log('overriden', child.x, parent.x);

// Теперь можно сделать что-то очень похожее на настоящее наследование!
const grandchild = { name: 'grandchild' };
grandchild.__proto__ = child;
console.log('grandchild', grandchild.name, grandchild.y, grandchild.p);

// прототип общий для расширяющих его объектов
const child2 = {};
child2.__proto__ = parent;
console.log('shared p before update', child.p, child2.p);
parent.p = 'newParentP';
console.log('shared p after update', child.p, child2.p);

// Если свойства нет ни у кого в цепочке прототипов, будет undefined, как всегда
console.log('missing', child2.help);
