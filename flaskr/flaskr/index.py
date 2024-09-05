import functools
from . import segmentation_helper

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

bp = Blueprint('index', __name__, url_prefix='/index')

@bp.route('/selection')
def selection():
    return render_template('index/selection.html')