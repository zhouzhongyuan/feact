
/*
* basic update
* 如果已经渲染过了，update；没有渲染过，mount。
* 怎么判断是否渲染过？
* 如何更新update dom？TopLevelWrapper这个Component没有updateComponent方法啊。
*
* 要点：container里存储的是childComponentInstance
*
*
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
            container._childComponentInstance.updateComponent(container._childComponentInstance.currentElement,element);
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
        this._hostNode = el;
        container.appendChild(el);
    }
    updateComponent(lastElement, nextElement){
        console.log(nextElement.children)
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
    updateComponent(lastElement, nextElement){

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
