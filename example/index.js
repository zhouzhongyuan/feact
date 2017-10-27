var root = document.getElementById('root');

// Feact.render(
//     Feact.createElement('h1', null, 'hello, zhongyuan.'),
//     root,
// );
// setTimeout(function() {
//         Feact.render(Feact.createElement('h1', null, 'changed'),
//         root,
//     );
// }, 2000);
// Feact.render(
//     Feact.createElement('h1', null, 'hello'),
//     root
// );
//
const MyHead = Feact.createClass({
    componentWillMount(){
        console.log(`MyHead will mount`);
    },
    getInitialState(){
      return {
          message: 'hh',
      }
    },
    componentDidMount(){
        console.log(this);
        setTimeout(() => {
            this.setState({
                message: 'setState called'
            });
        }, 2000);
        console.log(`MyHead did mount`);
    },
    render(){
        return Feact.createElement('h1', null, this.state.message);
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
    Feact.createElement(MyTitle, {message: 'hey there Feact '}),
    root
);




setTimeout(function() {
    Feact.render(
        Feact.createElement(MyTitle, {message: 'hello, again'}),
        root
    );
}, 2000);

setTimeout(function() {
    Feact.render(
        Feact.createElement(MyTitle, {message: 'hello, third'}),
        root
    );
}, 4000);


mountComponent(container) {
    const domElement =
        document.createElement(this._currentElement.type);
    const text = this._currentElement.props.children;
    const textNode = document.createTextNode(text);
    domElement.appendChild(textNode);

    container.appendChild(domElement);

    this._hostNode = domElement;
    return domElement;
}