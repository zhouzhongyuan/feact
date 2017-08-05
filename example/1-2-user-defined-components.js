const MyTitle = Feact.createClass({
    render(){
        return Feact.createElement('h1', null, this.props.message);
    }
});
const MyMessage = Feact.createClass({
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