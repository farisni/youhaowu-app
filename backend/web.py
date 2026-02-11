from flask import Flask
from response import R

app = Flask(__name__)


@app.get("/hello")
def hello():
    return R.ok(data={"say": "Hello, World!"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9000, debug=True)
