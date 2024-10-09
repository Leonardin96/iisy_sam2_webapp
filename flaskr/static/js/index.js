const inputElem = document.querySelector('#img_input');
const hiddenInput = document.querySelector('#coordinates_input');
const imgElem = document.querySelector('img');
const form = document.querySelector('form');
const submitBtn = document.querySelector('#submit_btn');

let originalHeight = 0;
let originalWidth = 0;
let coordinates = [];

/**
 * Clears the form before the page reloads.
 */
window.onbeforeunload = () => {
    form.reset();
}

/**
 * Creates an element at the mouseclick-position, indicating the clicked coordinate.
 * @param {number} posX 
 * @param {number} posY 
 */
const createDot = (posX, posY) => {
    console.log('Create dot...');
    const dot = document.createElement('div');
    dot.setAttribute('class', 'dot');
    dot.style.top = posY + 'px';
    dot.style.left = posX + 'px';
    const dotNode = document.querySelector('body').appendChild(dot);
    dotNode.addEventListener('click', (e) => {
        console.log('clicked on dot');
        console.log(getCoordinates(imgElem, e));
    })

}

/**
 * Event-Handler for when the user chooses a picture.
 * Reads the file and extracts the dimensions of it.
 */
inputElem.addEventListener('change', () => {
    document.querySelectorAll('.dot').forEach(e => {
        e.remove();
    });

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

const getCoordinates = (target, e) => {
    const rect = target.getBoundingClientRect();

    const xRelative = Math.floor(e.clientX - rect.left);
    const yRelative = Math.floor(e.clientY - rect.top);

    const xScale = originalHeight / target.offsetHeight;
    const yScale = originalWidth / target.offsetWidth;

    const xRelativeToOriginal = Math.floor(xRelative * xScale);
    const yRelativeToOriginal = Math.floor(yRelative * yScale);

    console.log('Relative to image in Browser:');
    console.log('x: '+ xRelative, 'y: ' + yRelative);
    console.log('Relative to original:');
    console.log('x: '+ xRelativeToOriginal, 'y: ' + yRelativeToOriginal);

    return [xRelativeToOriginal, yRelativeToOriginal];
}

/**
 * Event-Handler for when the user clicks inside the image.
 * Calculates the coordinates relative to picture dimensions for the segmentation model to use.
 */
imgElem.addEventListener('click', (e) => {
    submitBtn.toggleAttribute('disabled', hiddenInput.value !== '');

    createDot(e.clientX, e.clientY);
    
    console.log(e.currentTarget);

    const [xRelativeToOriginal, yRelativeToOriginal] = getCoordinates(e.currentTarget, e);

    const duplicate = coordinates.indexOf(obj => obj.x === xRelativeToOriginal && obj.y === yRelativeToOriginal)

    duplicate > -1 
        ? coordinates.splice(index, 1)
        : coordinates.push({x: xRelativeToOriginal, y: yRelativeToOriginal})

    hiddenInput.value += `[${xRelativeToOriginal}, ${yRelativeToOriginal}]`;

    console.log(hiddenInput.value);
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('But now...');
    form.submit();
})