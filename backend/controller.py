from flask import Flask
from mistral import query_mistral

app = Flask(__name__)

@app.route("/generate")
def generate():
    return query_mistral("This is a test query. Can you name a French painter?")

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"