Feact.render(
    Feact.createElement('h1', null, 'hello, zhongyuan.'),
    document.getElementById('root')
);
setTimeout(function() {
        Feact.render(Feact.createElement('h1', null, 'changed'),
        document.getElementById('root')
    );
}, 2000);
var root = document.getElementById('root');
// Feact.render(
//     Feact.createElement('h1', null, 'hello'),
//     root
// );
//
// setTimeout(function() {
//     Feact.render(
//         Feact.createElement('h1', null, 'hello again'),
//         root
//     );
// }, 2000);