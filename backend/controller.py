import re
from prompts import getResearchPrompt, get_scoring_prompt
from flask import Flask, request, jsonify

from mistral import getContextualMessages, getDefaultMessage, query_mistral
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://promptwars.com"}})

storage = {}

def start_process(state):
    for i in range(20):
        generate_next_prompt(state)
        generate_next_response(state)
        score_response(state)
        if int(state["scores"][-1][0]) > 50:
            state['done'] = True
            break

def generate_next_prompt(state):
    tries = 0
    while tries < 5:
        try:
            messages = getContextualMessages(state["prompts"], state["responses"], getResearchPrompt(state["target"]))
            response = query_mistral(messages)
            prompt_response = response.split("\n")[0].split("]: ")[1]
            state["prompts"].append(prompt_response)
            break
        except Exception as e:
            tries += 1
    
def generate_next_response(state):
    
    response = query_mistral(getDefaultMessage(state["prompts"][-1]), model="open-mistral-7b")
    state["responses"].append(response)
    
    pass

def score_response(state):
    print("SCORING")
    tries = 0
    while tries < 5:
        try:
            score_prompt = get_scoring_prompt(state["responses"][-1], state["target"], state["prompts"][-1])
            score_response = query_mistral(getDefaultMessage(score_prompt))

            delimiters = "[SCORE]:", "[EXPLANATION]:", "\n"
            regex_pattern = '|'.join(map(re.escape, delimiters))
            score_response_parsed = list(filter(None, re.split(regex_pattern, score_response)))
            
            state["scores"].append((score_response_parsed[0].strip(), score_response_parsed[1].strip()))
            break
        except Exception as e:
            tries += 1


    return score_response

@app.route("/generate", methods=["POST"])
def generate():
    
    state = {
        'target': "",
        'prompts': [],
        'responses': [],
        'scores': [],
        'done': False,
    } 

    '''
    Starts the whole process
    '''
    target = request.json["target"]
    id = request.json["id"]
    state["target"] = target
    storage[id] = state
    start_process(state)
    return ""

@app.route("/get-state", methods=["POST"])
def get_state():
    id = request.json["id"]

    state = storage[id]
    return jsonify(state)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == '__main__':
    app.run(debug=True)