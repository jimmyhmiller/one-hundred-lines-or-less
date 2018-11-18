import socket
from itertools import takewhile

def create_socket(host, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind((host, port))
    s.listen(1)
    return s

def parse_header(header_line):
    (name, value) = header_line.split(":", 1)
    return (name, value)

def parse_request(data):
    lines = list(takewhile(lambda x: x, data.split("\r\n")))
    (method, path, _) = lines[0].split(" ")
    headers = dict(map(parse_header, lines[1:]))
    return {
        "method": method,
        "path": path,
        "headers": headers
    }

statuses = {
    200: "200 OK",
    400: "400 Bad Request",
    404: "404 Not Found",
    500: "500 Internal Server Error"
}

def format_header((name, value)):
    return "{}: {}".format(name, value)

def format_response(response):
    headers = response["headers"]
    status = statuses[response["status"]]
    body = response["body"]
    formatted_headers = "\n".join(map(format_header, headers.iteritems()))

    return "HTTP/1.1 {}\r\n{}\r\n\r\n{}".format(status, formatted_headers, body)

def create_server(handler, host="127.0.0.1", port="8080"):
    print("starting server on port {}".format(port))
    server = create_socket(host, int(port))

    while True:
        sock, client_address = server.accept()

        data = sock.recv(4096)
        response = handler(parse_request(data))
        sock.sendall(format_response(response))
        sock.close()

#########

def hello_handler(request):
    print(request)
    return {
        "status": 200,
        "headers": {
            "Content-type": "application/json"
        },
        "body": "{\"hello\":\"world\"}"
    }


# create_server(hello_handler)