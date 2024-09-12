import segmentation_helper

from flask import (
    Flask, render_template, request, url_for
)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
app.secret_key = 'secret key'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def index():
    # Handle GET
    if request.method == 'GET':
        return render_template('index.html')
    
    # Handle POST
    if request.method == 'POST':
        
        if 'image_file' not in request.files:
            print('No file part')
            return render_template('index.html')
        
        file = request.files['image_file']

        # Request send without file
        if file.filename == '':
            print('No selected file')
            return render_template('index.html')
        
        # Request send with file and file-type is correct
        if file and allowed_file(file.filename):
            print('Successful POST')
            segmentation_helper.sendImage(file) 
            return render_template('index.html')   