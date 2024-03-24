import os
# from dotenv import load_dotenv
import requests
from flask import jsonify
import json
import asyncio

# MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')
MISTRAL_API_KEY = 'TWfVrlX659GSTS9hcsgUcPZ8uNzfoQsg'

def query_mistral(question):
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + MISTRAL_API_KEY,
    }

    json_data = {
        'model': 'mistral-large-latest',
        'messages': [
            {
                'role': 'user',
                'content': question,
            },
        ],
    }

    # Send Mistral query
    response = requests.post('https://api.mistral.ai/v1/chat/completions', headers=headers, json=json_data)

    mistral_response = json.loads(response.text)["choices"]

    if not mistral_response[0]["message"]:
        print("ERROR: Mistral API did not return a response.")
    else:
        print(f"Received Mistral API response: {mistral_response}.")

    return mistral_response[0]["message"].get("content")