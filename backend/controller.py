from prompts import getResearchPrompt
from flask import Flask, request, jsonify

from mistral import getContextualMessages, getDefaultMessage, query_mistral
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

state = {
    'target': "",
    'prompts': [],
    'responses': []
} 

def start_process():
    for i in range(5):
        generate_next_prompt()
        generate_next_response()
        if state["target"].lower() in state["responses"][-1].lower():
            break

def generate_next_prompt():
    global state
    
    messages = getContextualMessages(state["prompts"], state["responses"], getResearchPrompt(state["target"]))
    response = query_mistral(messages)
    prompt_response = response.split("\n")[0].split("]: ")[1]
        
    state["prompts"].append(prompt_response)
    
def generate_next_response():
    global state
    
    response = query_mistral(getDefaultMessage(state["prompts"][-1]))
    state["responses"].append(response)
    
    pass


@app.route("/generate", methods=["POST"])
def generate():
    global state
    
    state = {
        'target': "",
        'prompts': [],
        'responses': []
    } 

    '''
    Starts the whole process
    '''
    target = request.json["target"]
    state["target"] = target
    start_process()
    return

@app.route("/get-state", methods=["POST"])
def get_state():
    return jsonify(state)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == '__main__':
    app.run(debug=True)