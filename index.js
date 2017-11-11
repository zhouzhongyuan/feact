
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


        const wrapperElement = this.createElement(TopLevelWrapper,element);

        const internalInstance = new FeactCompositeComponent(wrapperElement);
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
        let renderedElement = componentInstance.render();
        while(typeof renderedElement.type === 'function'){
            renderedElement = new renderedElement.type(renderedElement.props).render();
        }

        const internalInstance = new FeactDOMComponent(renderedElement);
        internalInstance.mountComponent(container);
    }
}