from flask import Flask, request, render_template
from flask_socketio import SocketIO
from flask_cors import CORS

# Initialize the Flask app & SocketIO
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

users = {} # {ip: name}

@app.route('/', methods=['GET', 'POST'])
def home():
    """Handles requests for landing page and chat page."""
    if request.method == 'POST': return render_template('chat.html')
    return render_template('home.html')

@socketio.on('join')
def handleConnect(name):
    """Handles new connections to the chat."""
    users[request.remote_addr] = name # Add user to users list
    socketio.emit('current_users', users) # Update users list

@socketio.on('message')
def handleMessage(msg):
    """Handles new messages in the chat."""
    try:
        socketio.emit('message', {'msg': msg, 
                                  'name': users[request.remote_addr]}, 
                                  include_self=False)
    except KeyError: # If user is not in users list
        pass

@socketio.on('current_users')
def handleCurrentUsers():
    """Handles requests for current users list in chat."""
    socketio.emit('current_users', list(users.values()))


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)