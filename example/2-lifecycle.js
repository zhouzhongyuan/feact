const MyHead = Feact.createClass({
    componentWillMount(){
        console.log(`MyHead will mount`);
    },
    componentDidMount(){
        console.log(`MyHead did mount`);
    },
    render(){
        return Feact.createElement('h1', null, this.props.message);
    }
});

const MyTitle = Feact.createClass({
    componentWillMount(){
        console.log(`MyTitle will mount`);
    },
    componentDidMount(){
        console.log(`MyTitle did mount`);
    },
    render(){
        return Feact.createElement(MyHead,  this.props);
    }
});

Feact.render(
    Feact.createElement(MyTitle, { message: 'life cycle' }),
    document.getElementById('root')
);