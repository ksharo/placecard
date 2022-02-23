from flask import Flask, request
from add import add

app = Flask(__name__)

@app.route('/flask', methods=['POST'])
def index():
    numbers = request.get_json()
    res = numbers['x'] + numbers['y']
    return {'answer': res}

if __name__ == "__main__":
    app.run(port=5000, debug=True)