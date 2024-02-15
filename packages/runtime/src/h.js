import { withoutNulls } from "./utils/arrays.js"

export const DOM_TYPES =
    {
        TEXT: "text",
        ELEMENT: "elements",
        FRAGMENT: "fragment"
    }

export function h(tag, props = {}, children = []) {
    return {
        tag,
        props,
        children: mapToTextNodes(withoutNulls(children)),
        type: DOM_TYPES.ELEMENT
    }
}

export function hFragment(vNodes){
    return{
        type: DOM_TYPES.FRAGMENT,
        children: mapToTextNodes(withoutNulls(vNodes))
    }
}

function mapToTextNodes(children){
    return children.map((child) =>
    typeof child === "string" ? hString(child) : child);
}

export function hString(str){
    return{
        type: DOM_TYPES.TEXT,
        value: str
    }
}

export function lipsum(count){
    const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut  enim ad minim veniam, quis nostrud exercitation ullamco laboris nisiut aliquip ex ea commodo consequat."
    let paragraphs = [];
    for (let i = 0; i < count; i++){
        paragraphs.push(h("p", {}, [text]));
    }
    return hFragment(paragraphs);
}

export function MessageComponent({ message, level }){
    let p = h("p", {}, [message]);
    return hFragment(h("div", {class: `message message--${level}`}, [p]));
}