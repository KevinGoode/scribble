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
        emit('game message', {'type': 'stateUpdate', 'body': game_data,'sender': self.name})

    def on_disconnect(self):
        print('Client disconnected')

    def on_game_event(self, data):
        print('Received message: ' + data['type'])
        if data['type'] == 'stateUpdate':
            with open(SCRIBBLE_FILE_PATH + "/" +  self.name, 'w') as game_file:
                # Save state
                json.dump(data['body'], game_file)
            # Send state update to all
            print('Forwarding update state message')
            emit('game message', data, broadcast=True)
        elif data['type'] == 'playerAdd':
            addPlayer =  False
            with open(SCRIBBLE_FILE_PATH + "/" +  self.name, 'r') as game_file:
                game_data = json.load(game_file)
                if data['body']['name'] not in game_data['Players']:
                    print('Player ' + data['body']['name'] + ' registered')
                    game_data['Players'].append(data['body']['name'])
                    addPlayer = True
            if addPlayer:
                with open(SCRIBBLE_FILE_PATH + "/" +  self.name, 'w') as game_file:
                    json.dump(game_data, game_file)
                    emit('game message', {'type': 'stateUpdate', 'body': game_data, 'sender': data['body']['name']}, broadcast=True)
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
    if len(games) >= 10:
        abort(400, description="Too many live games running. Try again some other time.")
    game_data = {'Started': False, 'Players': [], 'Name': data['name'], 'id': str(uuid.uuid4())}
    with open(SCRIBBLE_FILE_PATH + "/" + data['name'], 'w') as outfile:
        json.dump(game_data, outfile)
    # Create game socket
    game_socket = GameSpecificSocketHandler('/scribble/' + game_data['id'])
    game_socket.set_name(data['name'])
    socketio.on_namespace(game_socket)
    return json.dumps({'id' : game_data['id']})

@app.route('/rest/scribble/<string:game_name>', methods=['PATCH'])
def join(game_name):
    # This method adds a new player or allows an existing player to join game after browser has closed.
    #IE after browser crash or in scenario want to come back and resume a game a couple of days later.
    # TODO. At present no way to work out if there is a duplicate name with active connection in a game.
    # This is going to cause a major problem but unlikely to happen
    data = request.get_json()
    if 'name' not in data:
        abort(400, description="Expecting field 'name'")
    games = get_games()
    if game_name not in games:
        abort(404, description="No game called " +  game_name)
    with open(SCRIBBLE_FILE_PATH + "/" + game_name) as gamefile:
        game_data = json.load(gamefile)
        if game_data['Started']:
            #Game has started so let's do a name check
            if data['name'] in game_data['Players']:
                return json.dumps({'id': game_data['id']})
            else:
                 abort(400, description="Player " +  data['name'] + " not in game")
        elif len(game_data['Players']) >=4:
            #Player browser may have crashed before starting so still allow known player to join
            if data['name'] in game_data['Players']:
                return json.dumps({'id': game_data['id']})
            else:
                 abort(400, description="Already 4 players playing this game.")

        else:
            #Game has not started and max number of players not exceeded so can join
            #Basically any player can join. NEED TO RETHINK THIS
            return json.dumps({'id': game_data['id']})


@app.route('/rest/scribble', methods=['GET'])
def list():
    #Best to switch GET ALL games off otherwise going to be easy for a rogue player to
    #enter a game since all they need to do is guess a playername.
    #With this API switched off, a rogue player is going to have to guess game name 
    #and player name to infiltrate a game
    abort(404, description="Not possible to get a list of live games")
    games = []
    for root, dirs, files in os.walk(SCRIBBLE_FILE_PATH):
        for filename in files:
            games.append(filename)
    return json.dumps(games)

@app.route('/rest/scribble/<string:game_id>', methods=['DELETE'])
def delete(game_id):
    games = get_games()

    for game in games:
        with open(SCRIBBLE_FILE_PATH + "/" + game) as gamefile:
            game_data = json.load(gamefile)
            if game_data['id'] == game_id:
                os.remove(SCRIBBLE_FILE_PATH + "/" + game )
                # TODO How to delete namespace socket listener?
                return
    #Not found so abort
    abort(404, description="No game called " +  game_id)

def get_games():
    games = []
    for root, dirs, files in os.walk(SCRIBBLE_FILE_PATH):
        for filename in files:
            games.append(filename)
    return games


if __name__ == '__main__':
    socketio.run(app)
