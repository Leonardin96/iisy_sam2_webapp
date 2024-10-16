import os
import glob
import segmentation_helper
from pathlib import Path


from flask import (
    Flask, render_template, request, redirect, url_for
)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

directories = [
        "./resources/results/images",
        "./resources/results/masks/images",
        "./resources/results/masks/output"
]

for dir in directories:
    Path(dir).mkdir(parents=True, exist_ok=True)

app = Flask(__name__)
app.secret_key = 'secret key'

def clear_directory_contents(directory):
    # Check if the directory exists
    if os.path.exists(directory):
        # Iterate over the files and directories inside the given directory
        for filename in os.listdir(directory):
            file_path = os.path.join(directory, filename)
            try:
                os.remove(file_path)
            except Exception as e:
                print(f'Failed to delete {file_path}. Reason: {e}')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def index():
    # Handle GET
    if request.method == 'GET':
        for dir in directories:
            clear_directory_contents(dir)
        
        return render_template('index.html')
    
    # Handle POST
    if request.method == 'POST':
        
        if 'image_file' not in request.files:
            print('No file part')
        
        file = request.files['image_file']

        # Request send without file
        if file.filename == '':
            print('No selected file')
        
        # Request send with file and file-type is correct
        if file and allowed_file(file.filename):
            segmentation_helper.sendImage(file, request.form['coordinates'], request.form['labels']) 
            return redirect(url_for('results'))

        return render_template('index.html')
    
@app.route('/results', methods=['GET', 'POST'])
def results():
    return render_template('results.html')