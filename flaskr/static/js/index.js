console.log('index.js loaded');

const inputElem = document.querySelector('#img_input');
const hiddenInput = document.querySelector('#coordinates_input');
const imgElem = document.querySelector('img');
const form = document.querySelector('form');

let originalHeight = 0;
let originalWidth = 0;

window.onbeforeunload = () => {
    console.log('Before reload');
    form.reset();
}

inputElem.addEventListener('change', () => {
    hiddenInput.value = '';
    let img = new Image();
    let fr = new FileReader();
    fr.onload = () => {
        imgElem.src = fr.result;
        img.src = fr.result;
        originalHeight = img.height;
        originalWidth = img.width;
    };
    fr.readAsDataURL(inputElem.files[0]);
})

imgElem.addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRelative = Math.floor(e.clientX - rect.left);
    const yRelative = Math.floor(e.clientY - rect.top);

    const xScale = originalHeight / e.currentTarget.offsetHeight;
    const yScale = originalWidth / e.currentTarget.offsetWidth;

    const xRelativeToOriginal = Math.floor(xRelative * xScale);
    const yRelativeToOriginal = Math.floor(yRelative * yScale);
    
    console.log('Relative to image in Browser:');
    console.log('x: '+ xRelative, 'y: ' + yRelative);
    console.log('Relative to original:');
    console.log('x: '+ xRelativeToOriginal, 'y: ' + yRelativeToOriginal);

    hiddenInput.value += `[${xRelativeToOriginal}, ${yRelativeToOriginal}]`;

    console.log(hiddenInput.value);
})