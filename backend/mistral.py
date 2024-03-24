import os
# from dotenv import load_dotenv
import requests
from prompts import get_follow_up
from flask import jsonify
import json
import asyncio

# MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')
MISTRAL_API_KEY = 'TWfVrlX659GSTS9hcsgUcPZ8uNzfoQsg'

def getContextualMessages(prompts, responses, content):
    messages = []
    messages.append({
            'role': 'user',
            'content': content
        })
    for prompt, response in zip(prompts, responses):
        messages.append({
            'role': 'system',
            'content': prompt
            })
        messages.append({
            'role': 'user',
            'content': get_follow_up(response)
            })

    print(messages)
    return messages


def getDefaultMessage(content):
    messages = []
    messages.append({
                'role': 'user',
                'content': content
            })
    return messages
    
def query_mistral(messages, model="mistral-large-latest"):
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + MISTRAL_API_KEY,
    }

    # we need to add role and content to messages for each one, if empty then this one

    json_data = {
        'model': model,
        'messages': messages,
    }

    print("messages: ", messages)

    # Send Mistral query
    response = requests.post('https://api.mistral.ai/v1/chat/completions', headers=headers, json=json_data)

    print("original response: ", json.loads(response.text))

    mistral_response = json.loads(response.text)["choices"]

    if not mistral_response[0]["message"]:
        print("ERROR: Mistral API did not return a response.")
    else:
        print(f"Received Mistral API response: {mistral_response}.")

    return mistral_response[0]["message"].get("content")