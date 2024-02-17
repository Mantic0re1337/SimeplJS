import {h, hString, hFragment} from "../../node_modules/simplejs_manticore/dist/simplejs_manticore.js";
import {createApp} from "../../node_modules/simplejs_manticore/dist/simplejs_manticore.js";

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