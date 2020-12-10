import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__)))

import flask
from flask import request, render_template
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from dateutil import tz

# setup firestore database connection
cred = credentials.Certificate("flask-bullentin-firebase-adminsdk-6hy1f-16a1a174c7.json")
firebase_admin.initialize_app(cred)
firestore_db = firestore.client()

app = flask.Flask(__name__)
CORS(app)

@app.route('/')
def main():
    messages = []
    snapshot = list(firestore_db.collection(u'bullentin').order_by('timestamp').get())
    to_zone = tz.tzlocal()
    for m in snapshot:
        m_ = m.to_dict()
        m_['timestamp'] = m_['timestamp'].astimezone(to_zone).strftime('%X %Y-%m-%d')
        messages.append(m_)
    return render_template('index.html', messages=messages[:100])

@app.route('/upload', methods=['POST'])
def upload():
    req = request.json
    req['timestamp'] = firestore.SERVER_TIMESTAMP
    if 'name' in req and 'message' in req and 'location' in req:    
        firestore_db.collection(u'bullentin').add(req)
    return {'status': 200, 'message': 'successful'}

if __name__ == '__main__':
    app.run(debug=True)