import {destroyDom} from "./destroy-dom.js";
import {mountDom} from "./mount-dom.js";
import {Dispatcher} from "./dispatcher.js";
import {patchDOM} from "./patch-dom.js";

export function createApp({state, view, reducers = {}}){
    let parentEl = null;
    let vdom = null;

    const dispatcher = new Dispatcher();
    const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

    function emit(eventName, payload){
        dispatcher.dispatch(eventName, payload);
    }

    for(const actionName in reducers){
        const reducer = reducers[actionName];

        const subs = dispatcher.subscribe(actionName, (payload) => {
            state = reducer(state, payload)
        });
        subscriptions.push(subs);
    }

    function renderApp() {
        const newVdom = view(state, emit);
        vdom = patchDOM(vdom, newVdom, parentEl);
    }

    return {
        mount(_parentEl) {
            if(vdom === null){
                parentEl = _parentEl;
                vdom = view(state, emit)
                mountDom(vdom, parentEl)
                return;
            }
            throw new Error("You can not mount the DOM more than once initially.");
        },

        unmount() {
            destroyDom(vdom);
            vdom = null;
            subscriptions.forEach((unsubscribe) => unsubscribe());
        },
    }
}

