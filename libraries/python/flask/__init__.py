from itertools import imap, ifilter
from functools import wraps
import json
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from http import create_server
from inspect import getargspec


not_found = {
    "status": 404,
    "headers": {"Content-type": "application/json"},
    "body": json.dumps({"error": "route not found"})
}

def plain_text(body):
    return {
        "status": 200,
        "headers": {"Content-type": "text/plain"},
        "body": body
    }

def wrap_response(response):
    if isinstance(response, str):
        return plain_text(response)
    else:
        return response

def call_handler(handler, data):
    arity = len(getargspec(handler).args)
    if arity == 1:
        return wrap_response(handler(data))
    else:
        return wrap_response(handler())

class Flask(object):
    """docstring for Vial"""
    def __init__(self, name):
        self.name = name
        self.routes = {}

    def handler(self, request):
        route_handler = self.routes.get(request["path"], None)
        if route_handler:
            return call_handler(route_handler, request)
        else:
            return not_found

    def route(self, path):
        def decorator(f):
            self.routes[path] = f
            return f
        return decorator

    def run(self):
        create_server(self.handler)


app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run()
