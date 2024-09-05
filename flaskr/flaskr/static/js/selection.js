console.log('Hello - Flask!');

const inputElem = document.querySelector('input');
const imgElem = document.querySelector('img');

inputElem.addEventListener('change', () => {
    console.log("Filelist length: ", inputElem.files.length)
    imgElem.src = inputElem.files[0].src;
})