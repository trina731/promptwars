import requests

def send_http_request(url, request=None, method="GET"):
  """
  Sends an HTTP request and returns the response.
  Args:
      url (str): The URL of the resource to access.
      request (dict, optional): A dictionary containing data for the request body (POST only). Defaults to None.
      method (str, optional): The HTTP method (GET or POST). Defaults to "GET".
  Returns:
      requests.Response: The HTTP response object.
  Raises:
      ValueError: If an invalid HTTP method is provided.
  """
  valid_methods = ["GET", "POST"]
  if method.upper() not in valid_methods:
    raise ValueError(f"Invalid HTTP method: {method}. Valid methods are {', '.join(valid_methods)}")

  # Handle GET and POST requests with appropriate arguments
  if method.upper() == "GET":
    response = requests.get(url)
  elif method.upper() == "POST":
    response = requests.post(url, json=request)  # Assuming JSON data for POST

  # Raise an error for unexpected status codes
  response.raise_for_status()

  return response

"""
# Example usage
url = "https://api.example.com/data"
data = {"key": "value"}  # Example data for POST

# GET request
get_response = send_http_request(url)
print(f"GET response status code: {get_response.status_code}")
print(get_response.text)  # Access response content

# POST request
post_response = send_http_request(url, data, method="POST")
print(f"POST response status code: {post_response.status_ code}")
print(post_response.text)
"""
