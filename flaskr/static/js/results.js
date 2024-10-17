const gallery = document.querySelector('#gallery');

let resultImages = [];

fetch('/image-list')
    .then(response => response.json())
    .then(imagesFiles => {
        imagesFiles.forEach(img => {
            const imgEl = document.createElement('img');
            imgEl.src = `./resources/results/images/${img}`;
            imgEl.style.width = '600px';
            gallery.appendChild(imgEl);
        });
    })
    .catch(error => console.log('Error fetching the image list: ', error));
