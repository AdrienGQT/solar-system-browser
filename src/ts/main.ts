import { Manager } from "./Manager"

let manager: Manager

const onContentLoaded = () => {
    console.log('Go')
    manager = new Manager()
}

window.addEventListener('DOMContentLoaded',onContentLoaded)