import {removeEventListeners} from './events.js';
import {DOM_TYPES} from "./h.js";

export function destroyDom(vdom){
    const {type} = vdom

    switch(type) {
        case DOM_TYPES.TEXT:{
            removeTextNode(vdom);
            break;
        }

        case DOM_TYPES.FRAGMENT:{
            removeFragmentNode(vdom);
            break;
        }

        case DOM_TYPES.ELEMENT:{
            removeElementNode(vdom);
            break;
        }

        default:{
            throw new Error(`Can't destory DOM of type: ${type}`);
        }
    }

    delete vdom.el;
}

function removeTextNode(vdom){
    const {el} = vdom;
    el.remove();
}

function removeFragmentNode(vdom){
    const {children} = vdom;
    children.forEach(destroyDom);
}

function removeElementNode(vdom){
    const{el, children, listeners} = vdom;

    el.remove();
    children.forEach(destroyDom);

    if(listeners){
        removeEventListeners(listeners, el);
        delete vdom.listeners;
    }
}