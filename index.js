const TopLevelWrapper = function (props) {
    this.props = props;
}
TopLevelWrapper.prototype.render = function () {
    return this.props;
}


const FeactInstanceMap = {
    set(key, value) {
        key.__feactInternalInstance = value;
    },

    get(key) {
        return key.__feactInternalInstance;
    }
};

var Feact = {
    createElement: function (type, props, children) {
        return {
            type,
            props: Object.assign({}, props, {children: children})
        };
    },
    render: function (element, container) {



        const prevComponent = this.getRootComponent(container);

        if(prevComponent){
            //update
            this.updateComponent(prevComponent, element);
        }else{
            // new
            this.newRoot(element, container);
        }

        

    },
    getRootComponent: function(container) {
        return container._renderedComponent;
    },
    updateComponent(prevComponent, nextElement){
        prevComponent.receiveComponent(nextElement);
    },
    newRoot: function (element, container) {
        const wrapperElement = this.createElement(TopLevelWrapper,element);
        const componentInstance = new FeactCompositeComponentWrap(wrapperElement);
        const markup = FeactReconciler.mountComponent(componentInstance, container);

        container._renderedComponent = componentInstance._renderedComponent
        return markup;
    },
    createClass: function (obj) {





        var Constructor = function (props) {
            this.props = props;


            const initialState = this.getInitialState ? this.getInitialState(): null;
            this.state = initialState;
        }
        Constructor.prototype = Object.assign({},obj)
        Constructor.prototype.render = obj.render;
        Constructor.prototype.setState = function (partialState) {

            const internalInstance = FeactInstanceMap.get(this);

            internalInstance._pendingPartialState = partialState;

            FeactReconciler.performUpdateIfNecessary(internalInstance);
        }
        return Constructor;
    }
}

class FeactDOMComponent{
    constructor(element){
        this._currentElement = element;
    }
    mountComponent(container){
        const wrapEl = document.createElement(this._currentElement.type);
        const textEl = document.createTextNode(this._currentElement.props.children);
        container.appendChild(wrapEl.appendChild(textEl));
        this._hostNode = wrapEl;
        return wrapEl;
    }
    receiveComponent(nextElement){
        console.log('receive component');
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
    _updateDOMProperties(){

    }
    _updateDOMChildren(lastProps, nextProps) {
        const lastContent = lastProps.children;
        const nextContent = nextProps.children;

        if (!nextContent) {
            this.updateTextContent('');
        } else if (lastContent !== nextContent) {
            this.updateTextContent('' + nextContent);
        }
    }

    updateTextContent(text) {
        const node = this._hostNode;
        console.log(node);
        const firstChild = node.firstChild;

        if (firstChild && firstChild === node.lastChild
            && firstChild.nodeType === 3) {
            firstChild.nodeValue = text;
            return;
        }

        node.textContent = text;
    }
}

class FeactCompositeComponentWrap{
    constructor(element){
        this._currentElement = element;
    }
    mountComponent(container){
        const Component = this._currentElement.type;
        const componentInstance = new Component(this._currentElement.props);
        FeactInstanceMap.set(componentInstance, this);
        this._instance = componentInstance;
        // will mount
        if(componentInstance.componentWillMount){
            componentInstance.componentWillMount();
        }
        this.perfromInitialMount(container);

        if(componentInstance.componentDidMount){
            componentInstance.componentDidMount();
        }
        // did mount
    }
    perfromInitialMount(container){
        let renderedElement = this._instance.render();
        const child = instantiateFeactComponent(renderedElement);

        this._renderedComponent = child;


        console.log(child);

        return FeactReconciler.mountComponent(child,container);
    }
    receiveComponent(nextElement){
        const prevElement = this._currentElement;
        this.updateComponent(prevElement, nextElement);
    }
    updateComponent(prevElement, nextElement){
        this._currentElement = nextElement;
        this._instance.props = nextElement.props;

        const nextState = Object.assign({}, this._instance.state, this._pendingPartialState);
        this._pendingPartialState = null;
        this._instance.state = nextState;
        //update rendered component
        const nextRenderedElement = this._instance.render();
        this._renderedComponent.receiveComponent(nextRenderedElement)
    }
    performUpdateIfNecessary() {
        this.updateComponent(this._currentElement, this._currentElement);
    }
}

const FeactReconciler = {
    mountComponent: function (internalInstance, container) {
        internalInstance.mountComponent(container);
    },
    performUpdateIfNecessary(internalInstance) {
        internalInstance.performUpdateIfNecessary();
    }
}

function instantiateFeactComponent(element) {
    if(typeof element.type === 'string'){
        return new FeactDOMComponent(element);
    }else{
        return new FeactCompositeComponentWrap(element);
    }
}
