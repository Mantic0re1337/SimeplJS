import {init} from "./framework";
import {div} from "./framework/element.js";

const firstName = "Marvin";
const lastName = "Frachet";

init("#app", div`Hello ${firstName} ${lastName}`);