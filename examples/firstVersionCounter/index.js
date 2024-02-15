import {createApp} from "../../packages/runtime/src/app.js";
import {h, hString, hFragment} from "../../packages/runtime/src/h.js";


createApp({
    state: 0,
    reducers: {
        add: (state, amount) => state + amount,
        subtract: (state, amount) => state - amount,
    },
    view: (state, emit) =>
        hFragment([
            h('button',
                { on: { click: () => emit('add', 1) },},
                [hString("+")]
            ),
            h('p', {}, [hString(state)]),
            h('button',
                { on: { click: () => emit('subtract', 1) } },
                [hString("-")]
            )
            ]),
}).mount(document.body)