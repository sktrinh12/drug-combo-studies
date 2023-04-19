#!/bin/bash
#
# Split the current tmux window into two panes
tmux split-window -v -c './frontend' 'npm run start'

# Create a new window for the backend, change directory, activate virtual environment, and start backend server
tmux new-window -n 'backend' -c './backend'
tmux split-window -v -c './backend'

# open vim in app dir
tmux send-keys 'cd ./app && vi .' C-m

tmux select-pane -t 0
tmux send-keys 'source venv/bin/activate' C-m
if [[ $(docker ps --filter "ancestor=pg-db" --format '{{.Names}}') ]]; then
	echo "postgres docker container running ..."
	tmux send-keys 'python main.py' C-m
else
	# If there is no running container, start a new one
	echo "postgres docker container not running, starting up now ..."
	docker run -d --name postgres --rm -p 5432:5432 pg-db
	echo 'sleeping for 5 seconds to allow postgres startup'
	sleep 5
fi

# Switch back to the first pane
tmux select-pane -t 0

# Attach to the tmux session to view the panes and windows
tmux attach-session
