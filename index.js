var Feact = {
    render(element,container) {
        var conponentInstance = new FeactDOMComponent(element);
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