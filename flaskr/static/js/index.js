const inputElem = document.querySelector('#img-input');
const checkbox = document.querySelector('#checkbox');
const hiddenInputCoordinates = document.querySelector('#coordinates-input');
const hiddenInputLabels = document.querySelector('#labels-input');
const imgElem = document.querySelector('img');
const form = document.querySelector('form');
const submitBtn = document.querySelector('#submit-btn');
const canvas = document.querySelector('#canvas');
const accentColor = getComputedStyle(document.body).getPropertyValue('--main-accent-color');

let originalHeight = 0;
let originalWidth = 0;
let coordinates = [];
let labels = [];
let origin = null;
let canvasHeight = null;
let canvasWidth = null;
let selType = null;

submitBtn.disabled = true;
let context = null;
const dotSize = 12;

let mouseMoved = false;

/**
 * Clears the form before the page reloads.
 */
window.onbeforeunload = () => {
    form.reset();
}

/**
 * Draws a "dot" on the canvas based on the given coordinates and the given label-value.
 * @param {int} x
 * @param {int} y 
 * @param {boolean} checked
 */
const drawDot = (x, y, checked) => {
    if (x && y) {
        context.fillStyle = checked ? 'red' : accentColor;
        context.fillRect((x - (dotSize / 2)), (y - (dotSize / 2)), dotSize, dotSize);
    }
}

const changeCanvasDimension = () => {
    canvasWidth = canvas.offsetWidth;
    canvasHeight = canvas.offsetHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context = canvas.getContext('2d');
    context.lineWidth = 4;
}

/**
 * Redraws the whole canvas based on the saved coordinates.
 */
const redrawCanvas = () => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    coordinates.forEach((dot, index) => {
        [x, y] = getOrigin(dot.x, dot.y);
        drawDot(x, y, labels[index]);
    })
}

/**
 * Calculates the coordinates of the dot relative to the original dimensions of the image.
 * @param {int} x 
 * @param {int} y 
 * @returns {int[]}
 */
const getRelativeCoordinates = (x, y) => {
    const xScale = originalWidth / imgElem.offsetWidth;
    const yScale = originalHeight / imgElem.offsetHeight;

    const xRelativeToOriginal = Math.floor(x * xScale);
    const yRelativeToOriginal = Math.floor(y * yScale);

    return [xRelativeToOriginal, yRelativeToOriginal];
}

/**
 * "Unscales" the relative coordinates to get the origin-point.
 * @param {int} x 
 * @param {int} y 
 * @returns {float[]}
 */
const getOrigin = (x, y) => {
    const xScale = originalWidth / imgElem.offsetWidth;
    const yScale = originalHeight / imgElem.offsetHeight;

    const originalX = x / xScale;
    const originalY = y / yScale;

    return [originalX, originalY];
}

const canvasMouseDownHandler = (e) => {
    mouseMoved = false;

    origin = {
        x: e.offsetX,
        y: e.offsetY
    };
}

const canvasMouseMoveHandler = (e) => {
    if (!!origin) {
        context.strokeStyle = accentColor;
        redrawCanvas();
        context.beginPath();
        context.rect(origin.x, origin.y, e.offsetX - origin.x, e.offsetY - origin.y);
        context.stroke();

        mouseMoved = true;
    }
}

/**
 * Event-Handler for when the mouseup-event is fired on the canvas.
 */
const canvasMouseUpHandler = () => {
    if (!mouseMoved) {
        const [xRelativeToOriginal, yRelativeToOriginal] = getRelativeCoordinates(...Object.values(origin));
        const duplicate = coordinates.findIndex(obj =>
            Math.sqrt((obj.x - xRelativeToOriginal) ** 2 + (obj.y - yRelativeToOriginal) ** 2) <= dotSize / 2);

        if (duplicate > -1) {
            coordinates.splice(duplicate, 1);
            labels.splice(duplicate, 1);

            redrawCanvas();
        } else {
            drawDot(...Object.values(origin), checkbox.checked);
            
            coordinates.push({x: xRelativeToOriginal, y: yRelativeToOriginal})
            labels.push(checkbox.checked ? 1 : 0);
        }
    }

    if (coordinates.length > 0) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

canvas.addEventListener('mousedown', canvasMouseDownHandler);
canvas.addEventListener('mousemove', canvasMouseMoveHandler);
canvas.addEventListener('mouseup', canvasMouseUpHandler);

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

            changeCanvasDimension();
        }
  
    };
    fr.readAsDataURL(inputElem.files[0]);
})

window.addEventListener('mouseup', () => {
    origin = null;
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