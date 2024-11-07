const inputElem = document.querySelector('#img-input');
const checkbox = document.querySelector('#checkbox');
const hiddenInputCoordinates = document.querySelector('#coordinates-input');
const hiddenInputLabels = document.querySelector('#labels-input');
const imgElem = document.querySelector('img');
const form = document.querySelector('form');
const submitBtn = document.querySelector('#submit-btn');
const canvas = document.querySelector('#canvas');
const accentColor = getComputedStyle(document.body).getPropertyValue('--main-accent-color');
const radioBtns = form.selectionType;

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

    posY += window.scrollY;
    posX += window.scrollX;

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

const checkSelectionType = (radioBtn) => {
    if (radioBtn.checked && radioBtn.value !== selType) {
        selType = radioBtn.value;
        changeCanvasAccessibilty();
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

    const xScale = originalWidth / target.offsetWidth;
    const yScale = originalHeight / target.offsetHeight;

    const xRelativeToOriginal = Math.floor(xRelative * xScale);
    const yRelativeToOriginal = Math.floor(yRelative * yScale);

    return [xRelativeToOriginal, yRelativeToOriginal];
}

const canvasMouseDownHandler = (e) => {
    origin = {
        x: e.offsetX,
        y: e.offsetY
    };
}

const canvasMouseMoveHandler = (e) => {
    if (!!origin) {
        context.strokeStyle = accentColor;
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.beginPath();
        context.rect(origin.x, origin.y, e.offsetX - origin.x, e.offsetY - origin.y);
        context.stroke();
    }
}

const changeCanvasAccessibilty = () => {
    if (selType !== 'box') {
        canvas.style.display = 'none';
        canvas.removeEventListener('mousedown', (e) => {
            canvasMouseDownHandler(e)
        })
        canvas.removeEventListener('mousemove', (e) => {
            canvasMouseMoveHandler(e)
        })
    } else {
        canvas.style.display = 'block';
        changeCanvasDimension();
        canvas.addEventListener('mousedown', (e) => {
            canvasMouseDownHandler(e)
        })
        canvas.addEventListener('mousemove', (e) => {
            canvasMouseMoveHandler(e)
        })
    }
}

/**
 * Event-Handler for when the user clicks inside the image.
 * Calculates the coordinates relative to picture dimensions for the segmentation model to use.
 */
imgElem.addEventListener('click', (e) => {
    createDot(e.clientX, e.clientY);

    const [xRelativeToOriginal, yRelativeToOriginal] = getCoordinates(e.currentTarget, e);
    coordinates.push({x: xRelativeToOriginal, y: yRelativeToOriginal})
    labels.push(checkbox.checked ? 0 : 1);

    if (coordinates.length > 0) {
        submitBtn.disabled = false;
    }
})

radioBtns.forEach(radio => {
    radio.addEventListener('change', (e) => {
        checkSelectionType(e.target);
    })
})

radioBtns.forEach(radio => checkSelectionType(radio));

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