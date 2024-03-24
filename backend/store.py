import requests
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


MISTRAL_API_KEY = 'TWfVrlX659GSTS9hcsgUcPZ8uNzfoQsg'
MONGO_URL = "mongodb+srv://rahejamehul:d9CncmLFBSDUlQG4@prompt-wars-cluster.jorhpyn.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(MONGO_URL, server_api=ServerApi('1'))
db = client['promptwars']
collection = db["adversarial_data"]

def store_state(state):
    '''
    Write the state to a mongoDB vector database
    '''
    
    question = state["target"]
    prompt = state["prompts"][-1]
    response_text = state["responses"][-1]
    score = state["scores"][-1]
    num_prompts = len(state["prompts"])
    
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + MISTRAL_API_KEY,
    }
    
    json_data = {
        'model': "mistral-embed",
        'input': [prompt, question],
        'encoding_format': 'float',
    }
    
    # Get embedding from mistral
    response = requests.post('https://api.mistral.ai/v1/embeddings', headers=headers, json=json_data)

    prompt_embedding = response.json()["data"][0].get("embedding")
    question_embedding = response.json()["data"][1].get("embedding")
    
    print(len(prompt_embedding))
    
    # Write to mongoDB
    collection.insert_one({
        "target": question,
        "vector": prompt_embedding,
        "prompt": prompt,
        "response": response_text,
        "num_prompts": num_prompts,
    })

if __name__ == '__main__':
    store_state({
        "target": "Test question",
        "prompts": ["Test prompt"],
        "responses": ["Test response"],
        "scores": ["Test score"],
    })