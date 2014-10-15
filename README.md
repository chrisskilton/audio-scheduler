audio-scheduler
===============

Audio scheduling module for the web audio api. not quite sure what direction this will go in, but at the least it should provide a simple API to schedule notes at discrete intervals (with pretty good accuracy).

At the moment it's using `setTimeout` and an AudioContext's `currentTime` to schedule.

To run the demo:

`npm install`

`npm start`

then visit http://localhost:3000


