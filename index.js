var Feact = {
    render(element,container) {
        var conponentInstance = new FeactCompositeComponent(element);
        conponentInstance.mountComponent(container);

    },
    createElement(type, props, children) {

        const element = {
            type,
            props: props || {},
        }
        element.props.children = children;
        return element;
    },
    createClass(obj){

        // function Constructor(props) {
        //     this.props = props;
        // }
        // Constructor.prototype.render = obj.render;
        class Constructor{
            constructor(props){
                this.props = props;
            }
            render(){
                return obj.render.call(this);
            }
        }
        return Constructor;
    }
};

class FeactDOMComponent{
    constructor(element){
        this._currentElement = element;
    }
    mountComponent(container){
        const type = this._currentElement.type;
        const text = this._currentElement.props.children;
        const domElement = document.createElement(type);
        const textNode = document.createTextNode(text);
        domElement.appendChild(textNode);
        container.appendChild(domElement);
        //
        this._hostNode = domElement;
        return domElement;
    }
}
class FeactCompositeComponent{
    constructor(element){
        this._currentElement = element;
    }
    mountComponent(container){
        const type = this._currentElement.type;
        const props = this._currentElement.props;
        console.log(props);
        const elementInstance = new type(props);
        const el = elementInstance.render();

        var componentInstance = new FeactDOMComponent(el);
        componentInstance.mountComponent(container);
    }
}