from prompts import getResearchPrompt, get_scoring_prompt
from flask import Flask, request, jsonify

from mistral import query_mistral, getContextualMessages
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
        score_response()
        if state["target"] in state["responses"][-1]:
            print("DONE")
            break

def generate_next_prompt():
    global state
    
    messages = getContextualMessages(state["prompts"], state["responses"], getResearchPrompt(state["target"]))
    response = query_mistral(messages)
    prompt_response = response.split("\n")[0].split("]: ")[1]
    
    print("ADDING PROMPT: " + prompt_response)
    
    state["prompts"].append(prompt_response)
    
def generate_next_response():
    global state
    
    response = query_mistral(state["prompts"][-1])
    print("ADDING RESPONSE: " + response)
    state["responses"].append(response)
    
    pass

def score_response():
    global state

    score_response = get_scoring_prompt(state["responses"][-1])
    print(f"RESPONSE SCORE: {score_response}")
    return query_mistral(score_response)

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