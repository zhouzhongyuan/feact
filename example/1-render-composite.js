const MyTitle = Feact.createClass({
    render() {
        return Feact.createElement('h1', null, this.props.message);
    }
});


console.log(MyTitle);

Feact.render(
        Feact.createElement(MyTitle, { message: 'hey there Feact' }),
    document.getElementById('root')
);