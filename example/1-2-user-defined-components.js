const MyTitle = Feact.createClass({
    render(){
        return Feact.createElement('h1', null, this.props.message);
    }
});
Feact.render(
    // 类比 <MyTitle message="hey there Feact" >
    Feact.createElement(MyTitle, {message: 'hey there Feact '}),
    document.getElementById('root')
);