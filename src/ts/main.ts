import { Manager } from "./Manager"

const onContentLoaded = () => {
    console.log('Go')
    const manager = new Manager()
}

window.addEventListener('DOMContentLoaded',onContentLoaded)