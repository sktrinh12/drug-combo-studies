#!/bin/bash
#
# Split the current tmux window into two panes

tmux split-window -v -c './frontend'
tmux send-keys 'export REACT_APP_BACKEND_URL=http://localhost:80 && export REACT_APP_VERSION=0.1 && export REACT_APP_ENIRONMENT=DEV' C-m
tmux send-keys 'npm run start' C-m

# Create a new window for the backend, change directory, activate virtual environment, and start backend server
tmux new-window -n 'backend' -c './backend'
tmux split-window -v -c './backend'

# open vim in app dir
tmux send-keys 'cd ./app && vi .' C-m

tmux select-pane -t 0
tmux send-keys 'source venv/bin/activate' C-m
if [[ $(docker ps --filter "ancestor=pg-db" --format '{{.Names}}') ]]; then
	echo "postgres docker container running ..."
else
	# If there is no running container, start a new one
	echo "postgres docker container not running, starting up now ..."
	docker run -d --name postgres --rm -p 5432:5432 pg-db
	echo 'sleeping for 10 seconds to allow postgres startup'
	sleep 20
fi
tmux send-keys 'python main.py' C-m

# Switch back to the first pane
tmux select-pane -t 0

# Attach to the tmux session to view the panes and windows
# tmux attach-session
