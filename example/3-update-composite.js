const MyCoolComponent = Feact.createClass({
    render(){
        return Feact.createElement('h1', null, this.props.message);
    }
});


Feact.render(
    Feact.createElement(MyCoolComponent, { message: 'hello.3' }),
    document.getElementById('root')
);

setTimeout(function() {
    Feact.render(
        Feact.createElement(MyCoolComponent, { message: 'hello again.3' }),
        document.getElementById('root')
    );
}, 2000);