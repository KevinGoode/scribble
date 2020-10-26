import os
import json
from flask import Flask, render_template, request, abort, jsonify
from flask_socketio import SocketIO, Namespace, emit
import uuid
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins='*')
SCRIBBLE_FILE_PATH = "/scribble/games"

class GameSpecificSocketHandler(Namespace):
    def set_name(self, name):
        self.name = name
    def on_connect(self):
        print('Client connected')
        with open(SCRIBBLE_FILE_PATH + "/" + self.name) as gamefile:
            game_data = json.load(gamefile)
        #Send state data to client that connected only
        emit('game message', {'type': 'stateUpdate', 'body': game_data['state'],'sender': self.name})

    def on_disconnect(self):
        print('Client disconnected')

    def on_game_event(self, data):
        print('Received message: ' + data['type'])
        with open(SCRIBBLE_FILE_PATH + "/" +  self.name, 'r+') as game_file:
            if data['type'] == 'stateUpdate':
                # Save state
                json.dump(data['data'], game_file)
                # Send state update to all
                print('Forwarding update state message')
                emit('game message', data, broadcast=True)
            elif data['type'] == 'playerAdd':         
                game_data = json.load(game_file)
                if data['body']['name'] not in game_data['state']['Players']:
                     print('Player ' + data['body']['name'] + ' registered')
                     game_data['state']['Players'].append(data['body']['name'])
                     json.dump(game_data, game_file)
                     emit('game message', {'type': 'stateUpdate', 'body': game_data['state'], 'sender': data['body']['name']}, broadcast=True)
            else:
                # Send all other messages to all clients
                emit('game message', data, broadcast=True)

@app.errorhandler(400)
def bad_request(e):
    return jsonify(error=str(e)), 400


@app.route('/rest/scribble', methods=['POST'])
def create():
    data = request.get_json()
    if 'name' not in data:
        abort(400, description="Expecting field 'name'")
    games = get_games()
    if data['name'] in games:
        abort(400, description="Already game called " +  data['name'])
    game_data = {'state': {'Started': False, 'Players': [], 'Name': data['name']}, 'id': str(uuid.uuid4())}
    with open(SCRIBBLE_FILE_PATH + "/" + data['name'], 'w') as outfile:
        json.dump(game_data, outfile)
    # Create game socket
    game_socket = GameSpecificSocketHandler('/scribble/' + game_data['id'])
    game_socket.set_name(data['name'])
    socketio.on_namespace(game_socket)
    return json.dumps({'id' : game_data['id']})

@app.route('/rest/scribble/<string:game_name>', methods=['PATCH'])
def join(game_name):
    data = request.get_json()
    if 'name' not in data:
        abort(400, description="Expecting field 'name'")
    games = get_games()
    if game_name not in games:
        abort(404, description="No game called " +  game_name)
    with open(SCRIBBLE_FILE_PATH + "/" + game_name) as gamefile:
        game_data = json.load(gamefile)
        if not game_data['state']['Started']:
            #Game has started so let's do a name check
            if data['name'] in  game_data['state']['Players']:
                return json.dumps({'id' :data['id']})
            else:
                 abort(400, description="Player " +  data['name'] + " no in game")
        else:
            #Game has not started so basically any player can join
            #NEED TO RETHINK THIS
            return json.dumps({'id' :data['id']})


@app.route('/rest/scribble', methods=['GET'])
def list():
    games = []
    for root, dirs, files in os.walk(SCRIBBLE_FILE_PATH):
        for filename in files:
            games.append(filename)
    return json.dumps(games)

@app.route('/rest/scribble/<string:game_name>', methods=['DELETE'])
def delete(game_name):
    games = get_games()
    if game_name in games:
        os.remove(SCRIBBLE_FILE_PATH + "/" + game_name )
        # TODO How to delete namespace socket listener?
    else:
         abort(404, description="No game called " +  game_name)

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
