const inputElem = document.querySelector('#img_input');
const checkbox = document.querySelector('#checkbox');
const hiddenInputCoordinates = document.querySelector('#coordinates_input');
const hiddenInputLabels = document.querySelector('#labels_input');
const imgElem = document.querySelector('img');
const form = document.querySelector('form');
const submitBtn = document.querySelector('#submit_btn');

let originalHeight = 0;
let originalWidth = 0;
let coordinates = [];
let labels = [];

submitBtn.disabled = true;

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
    const dot = document.createElement('div');

    checkbox.checked
        ? dot.setAttribute('class', 'dot exclude')
        : dot.setAttribute('class', 'dot include');
    dot.style.top = posY + 'px';
    dot.style.left = posX + 'px';

    const dotNode = document.querySelector('body').appendChild(dot);

    dotNode.addEventListener('click', (e) => {
        const [xRelativeToOriginal, yRelativeToOriginal] = getCoordinates(imgElem, e, true);

        const duplicate = coordinates.findIndex(obj => obj.x === xRelativeToOriginal && obj.y === yRelativeToOriginal);

        if (duplicate > -1) {
            coordinates.splice(duplicate, 1);
            labels.splice(duplicate, 1);
            e.currentTarget.remove();
        }

        if (coordinates.length < 1) {
            submitBtn.disabled = true;
        }
    })

}


/**
 * Event-Handler for when the user chooses a picture.
 * Reads the file and extracts the dimensions of it.
 */
inputElem.addEventListener('change', () => {
    document.querySelectorAll('.dot').forEach(elem => {
        elem.remove();
    });

    hiddenInputCoordinates.value = '';

    let img = new Image();
    let fr = new FileReader();
    fr.onload = () => {
        imgElem.src = fr.result;
        img.src = fr.result;

        img.onload = () => {
            originalHeight = img.height;
            originalWidth = img.width;
        }
        
    };
    fr.readAsDataURL(inputElem.files[0]);
})

const getCoordinates = (target, e, dotClicked = false) => {
    const rect = target.getBoundingClientRect();

    const clickX = dotClicked
        ? e.currentTarget.getBoundingClientRect().left + e.currentTarget.getBoundingClientRect().width / 2
        : e.clientX;

    const clickY = dotClicked
        ? e.currentTarget.getBoundingClientRect().top + e.currentTarget.getBoundingClientRect().height / 2
        : e.clientY;

    const xRelative = Math.floor(clickX - rect.left);
    const yRelative = Math.floor(clickY - rect.top);

    const xScale = target.naturalHeight / target.offsetHeight;
    const yScale = target.naturalWidth / target.offsetWidth;

    const xRelativeToOriginal = Math.floor(xRelative * xScale);
    const yRelativeToOriginal = Math.floor(yRelative * yScale);

    return [xRelativeToOriginal, yRelativeToOriginal];
}

/**
 * Event-Handler for when the user clicks inside the image.
 * Calculates the coordinates relative to picture dimensions for the segmentation model to use.
 */
imgElem.addEventListener('click', (e) => {
    console.log('img click', e.offsetX, e.offsetY);
    createDot(e.clientX, e.clientY);

    const [xRelativeToOriginal, yRelativeToOriginal] = getCoordinates(e.currentTarget, e);
    coordinates.push({x: xRelativeToOriginal, y: yRelativeToOriginal})
    labels.push(checkbox.checked ? 0 : 1);

    if (coordinates.length > 0) {
        submitBtn.disabled = false;
    }
})

/**
 * Event-Handler for when the user wants to submit their selection to the model.
 * Prevents the default-submit and populates the hidden-inputs before sending the data to the model.
 */
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    coordinates.forEach(co => hiddenInputCoordinates.value += `[${co.x}, ${co.y}]`);
    hiddenInputLabels.value += `[${labels}]`;

    form.submit();
})