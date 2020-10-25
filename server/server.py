import os
import json
from flask import Flask, render_template, request, abort, jsonify
from flask_socketio import SocketIO, Namespace, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins='*')
SCRIBBLE_FILE_PATH = "/scribble/games"

class GameSpecificSocketHandler(Namespace):
    def on_connect(self):
        print('got connected')

    def on_disconnect(self):
        print('got dis connected')

    def on_game_message(self, data):
        print('got connected')
        emit('my_response', data)

@app.errorhandler(400)
def bad_request(e):
    return jsonify(error=str(e)), 400


@app.route('/rest/scribble', methods=['POST'])
def create():
    data = request.get_json()
    return_data = {'state': None}
    if 'name' not in data:
        abort(400, description="Expecting field 'name'")
    games = get_games()
    if data['name'] in games:
        abort(400, description="Already game called " +  data['name'])
    with open(SCRIBBLE_FILE_PATH + "/" + data['name'], 'w') as outfile:
        json.dump(return_data, outfile)
    socketio.on_namespace(GameSpecificSocketHandler('/scribble/' + data['name']))
    return json.dumps(return_data)

@app.route('/rest/scribble', methods=['GET'])
def list():
    games = []
    for root, dirs, files in os.walk(SCRIBBLE_FILE_PATH):
        for filename in files:
            games.append(filename)
    return json.dumps(games)

@app.route('/rest/scribble/<string:game_id>', methods=['DELETE'])
def delete(game_id):
    games = get_games()
    if game_id in games:
        os.remove(SCRIBBLE_FILE_PATH + "/" +game_id )
    else:
         abort(404, description="No game called " +  game_id)

def get_games():
    games = []
    for root, dirs, files in os.walk(SCRIBBLE_FILE_PATH):
        for filename in files:
            games.append(filename)
    return games




#@socketio.on('my event')
#def test_message(message):
#    print('got event')
#    emit('my response', {'data': message['data']})

#@socketio.on('my broadcast event', namespace='/test')
#def test_broadcast(message):
#    emit('my response', {'data': message['data']}, broadcast=True)

#@socketio.on('connect')
#def test_connect():
#    print('got connected')
#    emit('my response', {'data': 'Connected'})

#@socketio.on('disconnect', namespace='/test')
#def test_disconnect():
#    print('Client disconnected')


if __name__ == '__main__':
    socketio.run(app)
