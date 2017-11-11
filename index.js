const Feact = {
    createElement: function (type, props, children) {
        return {
            type,
            props: Object.assign({},props, {children:children}),
        }
    },
    render(element, container){
        // const internalInstance = new FeactDOMComponent(element);
        // internalInstance.mountComponent(container);

        const internalInstance = new FeactCompositeComponent(element);
        internalInstance.mountComponent(container);
    },
    createClass(obj){
        function Constructor(props) {
            this.props = props;
        }

        Constructor.prototype = Object.assign({},obj);


        return Constructor;
    },
}

class FeactDOMComponent{
    constructor(element){
        this.currentElement = element;
    }
    mountComponent(container){
        const el = document.createElement(this.currentElement.type);
        const textEl = document.createTextNode(this.currentElement.props.children);
        el.appendChild(textEl);
        container.appendChild(el);
    }
}

class FeactCompositeComponent{
    constructor(element){
        this.currentElement = element;
    }
    mountComponent(container){

        const componentInstance = new this.currentElement.type(this.currentElement.props);
        const renderedElement = componentInstance.render();

        const internalInstance = new FeactDOMComponent(renderedElement);
        internalInstance.mountComponent(container);
    }
}