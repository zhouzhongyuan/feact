Feact.render(
    Feact.createElement('h1', null, 'hello'),
    root
);

setTimeout(function() {
    Feact.render(
        Feact.createElement('h1', null, 'hello again'),
        root
    );
}, 2000);