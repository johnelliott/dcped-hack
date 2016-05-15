# about
This is a hack for the DC Great Streets hackathon put on by the District of Columbia government. Twitter hashtags for this event were #innomaytion and #GShackathon.

This requires a Raspberry Pi with a Raspberry Pi camera. The main hack is to call the Raspberry Pi camera using SSH from within node to skip deploying any code to the Pi.

The app has as server and browser front-end. The server gets a picture stream from pi via ssh/node child processes, pipes jpegs through openCV, does person detection, and sends data over a websocket to the browser with a virtual-DOM library that refreshes the view.

# directory structure
index.js - server

lib - modules using camera and openCV

src - front-end code

# use
change `lib/ssh-cam.js` to ssh to your Pi—this is the hacky bit
the front-end uses hyperx, which requires a browser supporting template literals
check out the `watch`, `build`, and `dbg` npm scripts in `package.json` to build and run the app in debug mode

