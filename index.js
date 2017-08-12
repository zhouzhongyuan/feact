const TopLevelComponentWrapper = function (props) {
    this.props = props;
}
TopLevelComponentWrapper.prototype.render = function () {
    return this.props;
}



var Feact = {
    render(element,container) {
        const type = element.type;
        const wrapperElement = this.createElement(TopLevelComponentWrapper, element);
        const componentInstance = new FeactCompositeComponentWrapper(wrapperElement);
        return FeactReconciler.mountComponent(componentInstance, container);

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

        function Constructor(props) {
            this.props = props;
        }
        Object.assign(Constructor.prototype, spec);
        // class Constructor{
        //     constructor(props){
        //         this.props = props;
        //     }
        //     render(){
        //         return spec.render.call(this);
        //     }
        // }
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
        this._instance = componentInstance;

        if(componentInstance.componentWillMount){
            componentInstance.componentWillMount();
        }


        const markup = this.performInitialMount(container);
        if(componentInstance.componentDidMount){
            componentInstance.componentDidMount();
        }
        return markup;


        let child = componentInstance.render();

        this.initialMount(child);

        while( Object.prototype.toString.call(element.type) === '[object Function]'){
            element = (new element.type(element.props)).render();
        }
        const domComponentInstance = new FeactDOMComponent(element);
        domComponentInstance.mountComponent(container);

    }
    performInitialMount(container){
        // child
        let renderedElement = this._instance.render();

        const child = instantiateFeactComponent(renderedElement);
        this._renderedComponent = child;

        return FeactReconciler.mountComponent(child, container);


    }
}

const FeactReconciler = {
    mountComponent(internalInstance, container){
        return internalInstance.mountComponent(container);
    }
}

function instantiateFeactComponent(element) {
    if (typeof element.type === 'string') {
        return new FeactDOMComponent(element);
    } else if (typeof element.type === 'function') {
        return new FeactCompositeComponentWrapper(element);
    }
}