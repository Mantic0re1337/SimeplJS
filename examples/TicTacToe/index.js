import {h, hString, hFragment} from "../../node_modules/simplejs_manticore/dist/simplejs_manticore.js";
import {createApp} from "../../node_modules/simplejs_manticore/dist/simplejs_manticore.js";

const state = {
    currentPlayer: "X",
    playfield: [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ],
    title: `It's X's turn`,
    winmessage: "",
    doneturns: 0
}

const reducers = {
    "set-playersymbol": (state, {x,y}) => {

        const newPlayfield = state.playfield.map(row => [...row]);

        if(newPlayfield[x][y] === 0)
        {
            newPlayfield[x][y] = state.currentPlayer === "X" ? 1 : 2;
        }

        return {
            ...state,
            playfield: newPlayfield,
            currentPlayer: state.currentPlayer === "X" ? "O" : "X",
            doneturns: state.doneturns + 1,
            title: state.currentPlayer === "X" ? `It's O's turn` : `It's X's turn`,
            winmessage: state.doneturns >= 8 ? "Winmessage" : ""
        }
    }
}

function ceckWin(){
    //do some
}

function App(state, emit){
    return hFragment([
        h("h1", {}, [hString(state.title)]),
        h("p", {}, [hString(state.winmessage)]),
        h("table", {
            on:{
                click: () => emit("set-playersymbol", {})
            }

        },
        [createRow(state, emit, 0), createRow(state, emit, 1), createRow(state, emit, 2)]
        )
        ])
}

function createRow(state, emit, rownumber) {
    return h("tr", {},[
        createCell(state, emit, {row: rownumber, column: 0}),
        createCell(state, emit, {row: rownumber, column: 1}),
        createCell(state, emit, {row: rownumber, column: 2})
    ])
}

function createCell(state, emit, {row, column}){

    const value = state.playfield[row][column];
    let render = "";

    switch (value) {
        case 1:
            render = "X";
            break;
        case 2:
            render = "O";
            break;
        default:
            break;
    }

    return h("td", {
        class: "cell",
        on: {click: () => emit("set-playersymbol", {x: row, y: column})},
    },[hString(render)])
}

createApp({state, reducers, view: App}).mount(document.body)