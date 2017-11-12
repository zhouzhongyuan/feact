
/*
* basic update
* 如果已经渲染过了，update；没有渲染过，mount。
* 怎么判断是否渲染过？
* 如何更新update dom？TopLevelWrapper这个Component没有updateComponent方法啊。
*
* 要点：container里存储的是childComponentInstance
*
*
* 如何update compositeComponent
* 非常简单，看updateComponent函数
*
* */

// 硬造出一个CompositeComponent，只有render方法
function TopLevelWrapper(props) {
    this.props = props;
}

TopLevelWrapper.prototype.render = function () {
    return this.props;
}



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

        if(container._childComponentInstance){
            container._childComponentInstance.receiveComponent(element);
        }else{
            const wrapperElement = this.createElement(TopLevelWrapper,element);
            const internalInstance = new FeactCompositeComponent(wrapperElement);
            internalInstance.mountComponent(container);
            container._childComponentInstance = internalInstance._childComponentInstance;
        }


    },
    createClass(obj){
        function Constructor(props) {
            this.props = props;
            this.state = obj.getInitialState() || {};
        }

        Constructor.prototype = Object.assign({},obj);
        Constructor.prototype.setState = function (newState) {
            const feactInternalInstance = FeactInstanceMap.get(this);
            feactInternalInstance._peddingState = newState;
            feactInternalInstance.performUpdateIfNecessary();
        }


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
        this._hostNode = el;
        container.appendChild(el);
    }
    receiveComponent(nextElement){
        this.updateComponent(this.currentElement, nextElement);
    }
    updateComponent(lastElement, nextElement){
        this._hostNode.firstChild.nodeValue = nextElement.props.children;
    }
}

class FeactCompositeComponent{
    constructor(element){
        this.currentElement = element;
    }
    mountComponent(container){

        const componentInstance = new this.currentElement.type(this.currentElement.props);
        this._instance = componentInstance;
        FeactInstanceMap.set(this._instance, this);
        if(componentInstance.componentWillMount){
            componentInstance.componentWillMount();
        }
        const markup = this.performIntialMount(container);
        if(componentInstance.componentDidMount){
            componentInstance.componentDidMount();
        }
        return markup;
    }
    performIntialMount(container){
        let renderedElement = this._instance.render();
        const childInstance = instantiateFeactComponent(renderedElement);
        this._childComponentInstance = childInstance;
        return FeactReconciler.mountComponent(childInstance, container);
    }
    receiveComponent(nextElement){
        this.updateComponent(this.currentElement, nextElement);
    }
    updateComponent(lastElement, nextElement){
        let shouldUpdate = true;
        const nextState = Object.assign({}, this.state, this._peddingState);
        if(shouldUpdate){
            this._instance.props = nextElement.props; //更新“此Component”的props
            this._instance.state = nextState; //更新“此Component”的state
            const nextRenderedElement = this._instance.render(); // 重新render“此Component”
            this._childComponentInstance.receiveComponent(nextRenderedElement); //“子组件”开始更新。
        }else{
            this._instance.props = nextProps;
            this._instance.state = nextState;
        }

    }
    performUpdateIfNecessary(){
        this.updateComponent(this.currentElement, this.currentElement);
    }
}

function instantiateFeactComponent(element) {
    let internalInstance;
    if(typeof element.type === 'function'){
        internalInstance = new FeactCompositeComponent(element);
    }else{
        internalInstance = new FeactDOMComponent(element);
    }
    return internalInstance;
}

const FeactReconciler = {
    mountComponent(internalInstance, container){
        internalInstance.mountComponent(container);
    }
}
const FeactInstanceMap = {
    set(key, value){
        key.__feactInternalInstance = value;
    },
    get(key){
        return key.__feactInternalInstance;
    }
}