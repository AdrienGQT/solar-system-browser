import { Manager } from "./Manager"

const onContentLoaded = () => {
    console.log('Go')
    new Manager()
}

window.addEventListener('DOMContentLoaded',onContentLoaded)