import os
# from dotenv import load_dotenv
import requests
from flask import jsonify
import json
import asyncio

# MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')
MISTRAL_API_KEY = 'TWfVrlX659GSTS9hcsgUcPZ8uNzfoQsg'

def getContextualMessages(prompts, responses, content):
    messages = []
    for prompt, response in zip(prompts, responses):
        messages.append({
            'role': 'user',
            'content': prompt
            })
        messages.append({
            'role': 'system',
            'content': response
            })
    messages.append({
                'role': 'user',
                'content': content
            })
    return messages


def query_mistral(messages):
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + MISTRAL_API_KEY,
    }

    # we need to add role and content to messages for each one, if empty then this one

    json_data = {
        'model': 'mistral-large-latest',
        'messages': messages,
    }

    # Send Mistral query
    response = requests.post('https://api.mistral.ai/v1/chat/completions', headers=headers, json=json_data)

    mistral_response = json.loads(response.text)["choices"]

    if not mistral_response[0]["message"]:
        print("ERROR: Mistral API did not return a response.")
    else:
        print(f"Received Mistral API response: {mistral_response}.")

    return mistral_response[0]["message"].get("content")