const MyTitle = Feact.createClass({
    getInitialState(){
        return {
            message: 'initial state',
        }
    },
    componentDidMount(){
        setTimeout(() => {
            this.setState({
                message: 'I am changed by setState',
            });
        },2000)
    },
    render() {
        return Feact.createElement('h1', null, this.state.message);
    }
});



Feact.render(
    Feact.createElement(MyTitle),
    document.getElementById('root')
);