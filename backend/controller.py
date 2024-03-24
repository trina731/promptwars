import re
from store import store_state
from prompts import PROMPT_MAP
from flask import Flask, request, jsonify

from mistral import getContextualMessages, getDefaultMessage, query_mistral
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://promptwars.com"}})

storage = {}

def start_process(state, promptgen):
    for i in range(20):
        generate_next_prompt(state, promptgen)
        generate_next_response(state, promptgen)
        score_response(state, promptgen)
        if int(state["scores"][-1][0]) > 50:
            state['done'] = True
            store_state(state)
            break

def generate_next_prompt(state, promptgen):
    tries = 0
    while tries < 5:
        try:
            messages = getContextualMessages(state["prompts"], state["responses"], promptgen.getResearchPrompt(state["target"]), promptgen)
            response = query_mistral(messages)
            prompt_response = response.split("\n")[0].split("]: ")[1]
            state["prompts"].append(prompt_response)
            break
        except Exception as e:
            tries += 1
    
def generate_next_response(state, promptgen):
    
    response = query_mistral(getDefaultMessage(state["prompts"][-1]), model="open-mistral-7b")
    state["responses"].append(response)
    
    pass

def score_response(state, promptgen):
    tries = 0
    while tries < 5:
        try:
            score_prompt = promptgen.get_scoring_prompt(state["responses"][-1], state["target"], state["prompts"][-1])
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
    advType = request.json["advType"]
    state["target"] = target
    storage[id] = state
    start_process(state, PROMPT_MAP[advType])
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