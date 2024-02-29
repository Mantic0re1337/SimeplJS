import {destroyDom} from "./destroy-dom.js";
import {mountDom} from "./mount-dom.js";
import {areNodesEqual} from "./nodes-equal.js";
import {DOM_TYPES, extractChildren} from "./h.js";
import {removeAttribute, setAttribute, removeStyle, setStyle} from "./attributes.js";
import {objectsDiff} from "./utils/objects.js";
import {arrayDiff, arraysDiffSequence, ARRAY_DIFF_OP} from "./utils/arrays.js";
import {isNotBlankOrEmptyString} from "./utils/strings.js";
import {addEventListener} from "./events.js";

export function patchDOM(oldVdom, newVdom, parentEl){
    if(!areNodesEqual(oldVdom, newVdom)){
        const index = findIndexInParent(parentEl, oldVdom.el);
        destroyDom(oldVdom);
        mountDom(newVdom, parentEl, index);

        return newVdom;
    }

    newVdom.el = oldVdom.el

    switch(newVdom.type){
        case DOM_TYPES.TEXT: {
            patchText(oldVdom, newVdom);
            return newVdom;
        }
        case DOM_TYPES.ELEMENT:{
            patchElement(oldVdom, newVdom);
            break;
        }
    }

    patchChildren(oldVdom, newVdom);
    return newVdom;
}

function findIndexInParent(parentEl, el){
    const index = Array.from(parentEl.childNodes). indexOf(el);
    if(index < 0){
        return null;
    }
    return index;
}

function patchText(oldVdom, newVdom){
    const el = oldVdom.el;
    const {value: oldText} = oldVdom;
    const {value: newText} = newVdom;

    if(oldText !== newText){
        el.nodeValue = newText;
    }
}

function patchElement(oldVdom, newVdom){
    const el = oldVdom.el;
    const {
        class: oldClass,
        style: oldStyle,
        on: oldEvents,
        ...oldAttrs
    } = oldVdom.props;
    const {
        class: newClass,
        style: newStyle,
        on: newEvents,
        ...newAttrs
    } = newVdom.props;

    const {listeners: oldListeners} = oldVdom;

    patchAttrs(el, oldAttrs, newAttrs);
    patchClasses(el, oldClass, newClass);
    patchStyles(el, oldStyle, newStyle);
    newVdom.listeners = patchEvents(el, oldListeners, oldEvents, newEvents)
}

function patchAttrs(el, oldAttrs, newAttrs){
    const {added, removed, updated} = objectsDiff(oldAttrs, newAttrs);

    for(const attr of removed){
        removeAttribute(el, attr);
    }
    for(const attr of added.concat(updated)){
        setAttribute(el, attr, newAttrs[attr]);
    }
}

function patchClasses(el, oldClass, newClass){
    const oldClasses = toClassList(oldClass);
    const newClasses = toClassList(newClass);

    const {added, removed} = arrayDiff(oldClasses, newClasses);

    if(removed.length > 0){
        el.classList.remove(...removed);
    }
    if(added.length > 0){
        el.classList.add(...added);
    }
}

function toClassList(classes = ""){
    return Array.isArray(classes)
        ? classes.filter(isNotBlankOrEmptyString)
        : classes.split(/(\s+)/).filter(isNotBlankOrEmptyString)
}

function patchStyles(el, oldStyle = {}, newStyle = {}){
    const {added, removed, updated} = objectsDiff(oldStyle, newStyle);

    for(const style of removed){
        removeStyle(el, style)
    }

    for(const style of added.concat(updated)){
        setStyle(el, style, newStyle[style])
    }
}

function patchEvents(el, oldListeners = {}, oldEvents = {}, newEvents = {}){
    const {removed, added, updated} = objectsDiff(oldEvents, newEvents);

    for(const eventName of removed.concat(updated)){
        el.removeEventListener(eventName, oldListeners[eventName])
    }

    const addedListeners = {}

    for(const eventName of added.concat(updated)){
        const listener = addEventListener(eventName, newEvents[eventName], el)
        addedListeners[eventName] = listener;
    }

    return addedListeners;
}

function patchChildren(oldVdom, newVdom){
    const oldChildren = extractChildren(oldVdom);
    const newChildren = extractChildren(newVdom);
    const parentEl = oldVdom.el;

    const diffSeq = arraysDiffSequence(oldChildren, newChildren, areNodesEqual);

    for(const operation of diffSeq){
        const {originalIndex, index, item} = operation;

        switch (operation.op){
            case ARRAY_DIFF_OP.ADD: {
                mountDom(item, parentEl, index);
                break;
            }
            case ARRAY_DIFF_OP.REMOVE: {
                destroyDom(item);
                break;
            }
            case ARRAY_DIFF_OP.MOVE: {
                const oldChild = oldChildren[originalIndex];
                const newChild = newChildren[index];
                const el = oldChild.el;
                const elAtTargetIndex = parentEl.childNodes[index];

                parentEl.insertBefore(el, elAtTargetIndex);
                patchDOM(oldChild, newChild, parentEl);
                break;
            }
            case ARRAY_DIFF_OP.NOOP: {
                patchDOM(oldChildren[originalIndex], newChildren[index], parentEl);
                break;
            }

        }
    }
}
