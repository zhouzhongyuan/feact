const TopLevelComponentWrapper = function (props) {
    this.props = props;
}
TopLevelComponentWrapper.prototype.render = function () {
    return this.props;
}



var Feact = {
    render(element,container) {

        const prevComponent = getTopLevelComponentInContainer(container);

        if(prevComponent){
            return updateRootComponent(prevComponent, element);
        }else {
            return renderNewRootComponent(element, container);
        }

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
    receiveComponent(nextElement){
        const prevElement = this._currentElement;
        this.updateComponent(prevElement, nextElement);
    }
    updateComponent(prevElement, nextElement){
        const lastProps = prevElement.props;
        const nextProps = nextElement.props;

        this._updateDOMProperties(lastProps, nextProps);
        this._updateDOMChildren(lastProps, nextProps);

        this._currentElement = nextElement;
    }
    _updateDOMProperties(lastProps, nextProps){
        //TODO nothing to do, will explain why later.
        // explain: _updateDOMProperties is mostly concerned with updating CSS styles.
    }
    _updateDOMChildren(lastProps, nextProps){
        // finnally, the component can update the DOM here
        // I'll implement this next

        const lastContent = lastProps.children;
        const nextContent = nextProps.children;

        if(!nextProps){
            this.updateTextContent('');
        }else if(lastContent !== nextContent){
            this.updateTextContent('' + nextContent);
        }





    }
    updateTextContent(text){
        const node = this._hostNode;
        const firstChild = node.firstChild;
        if(firstChild && firstChild === node.lastChild && firstChild.nodeType ===3){
            firstChild.nodeValue = text;
            return;
        }
        node.textContent = text;
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

    }
    performInitialMount(container){
        // child
        let renderedElement = this._instance.render();

        const child = instantiateFeactComponent(renderedElement);
        this._renderedComponent = child;

        return FeactReconciler.mountComponent(child, container);


    }
    receiveComponent(nextElement){
        const prevElement = this._currentElement;
        this.updateComponent(prevElement, nextElement);
    }
    updateComponent(prevElement, nextElement){
        const  nextProps = nextElement.props;
        this._performComponentUpdate(nextElement, nextProps);
    }
    _performComponentUpdate(nextElement, nextProps){
        this._currentElement = nextElement;
        const inst = this._instance;
        inst.props = nextProps;
        this._updateRenderedComponent();
    }
    _updateRenderedComponent(){
        const prevComponentInstance = this._renderedComponent;
        const inst = this._instance;
        const nextRenderedElement = inst.render();
        FeactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement);
    }
}

const FeactReconciler = {
    mountComponent(internalInstance, container){
        return internalInstance.mountComponent(container);
    },
    receiveComponent(internalInstance, nextElement){
        internalInstance.receiveComponent(nextElement);
    }
}

function instantiateFeactComponent(element) {
    if (typeof element.type === 'string') {
        return new FeactDOMComponent(element);
    } else if (typeof element.type === 'function') {
        return new FeactCompositeComponentWrapper(element);
    }
}

function renderNewRootComponent(element, container) {
    const wrapperElement = Feact.createElement(TopLevelComponentWrapper, element);
    const componentInstance = new FeactCompositeComponentWrapper(wrapperElement);

    const markUp = FeactReconciler.mountComponent(componentInstance, container);
    container._feactComponentInstance = componentInstance._renderedComponent;
    return markUp;

}

function getTopLevelComponentInContainer(container) {
    // need to figure this out
    return container._feactComponentInstance;
}

function updateRootComponent(prevComponent, nextElement) {
    // need to figure this out too
    FeactReconciler.receiveComponent(prevComponent, nextElement);
}