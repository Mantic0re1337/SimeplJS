import {destroyDom} from "./destroy-dom.js";
import {mountDom} from "./mount-dom.js";
import {Dispatcher} from "./dispatcher.js";

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

    function renderApp(){
        if(vdom){
            destroyDom(vdom);
        }

        vdom = view(state, emit);
        mountDom(vdom, parentEl);
    }

    return {
        mount(_parenEl){
            parentEl = _parenEl;
            renderApp();
        },

        unmount(){
            destroyDom(vdom);
            subscriptions.forEach((unsubscribe) => unsubscribe())
        },
    }
}

