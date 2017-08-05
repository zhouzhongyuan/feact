var Feact = {
    render(element,container) {
        var conponentInstance = new FeactCompositeComponentWrapper(element);
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
    createClass(spec){

        // function Constructor(props) {
        //     this.props = props;
        // }
        // Constructor.prototype.render = obj.render;
        class Constructor{
            constructor(props){
                this.props = props;
            }
            render(){
                return spec.render.call(this);
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
class FeactCompositeComponentWrapper{
    constructor(element){
        this._currentElement = element;
    }
    mountComponent(container){
        const Component = this._currentElement.type;
        const props = this._currentElement.props;
        const componentInstance = new Component(props);
        const element = componentInstance.render();

        var domComponentInstance = new FeactDOMComponent(element);
        domComponentInstance.mountComponent(container);
    }
}