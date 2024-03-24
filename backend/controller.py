from flask import Flask
from mistral import query_mistral
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route("/generate", methods=["POST"])
def generate():
    return query_mistral("This is a test query. Can you name a French painter?")

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"