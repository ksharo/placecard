from flask import Flask, request
from Placecard_POC3 import main

app = Flask(__name__)

@app.route('/flask', methods=['POST'])
def index():
    # numbers = request.get_json()
    # res = numbers['x'] + numbers['y']

    seatingChart = main()
    return {'answer': seatingChart}

if __name__ == "__main__":
    app.run(port=5000, debug=True)