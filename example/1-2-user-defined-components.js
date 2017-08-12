const MyTitle = Feact.createClass({
    componentWillMount(){
        console.log(`MyTitle will mount`);
    },
    componentDidMount(){
        console.log(`MyTitle did mount`);
    },
    render(){
        return Feact.createElement('h1', null, this.props.message);
    }
});






const MyMessage = Feact.createClass({
    componentWillMount(){
        console.log(`MyMessage will mount`);
    },
    componentDidMount(){
        console.log(`MyMessage did mount`);
    },
   render(){
       if(this.props.asTitle){
           return Feact.createElement(MyTitle, {message:this.props.message});
       }else{
           return Feact.createElement('p', null, this.props.message);
       }
   }
});
Feact.render(
    // 类比 <MyTitle message="hey there Feact" >
    Feact.createElement(MyMessage, {asTitle: true, message: 'hey there Feact '}),
    document.getElementById('root')
);