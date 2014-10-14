var SCHEDULER_INTERVAL = 50;
var LOOKAHEAD_DURATION = 0.1;
var BEAT_DURATION = 0.25;
var NOTE_DURATION = 0.1;

var nextBeatTime = 0.0;
var scheduler;
var audio = new AudioContext();

function incrementBeat(){
    nextBeatTime += BEAT_DURATION;
}

function scheduleSound(){
    var osc = audio.createOscillator();

    osc.frequency.value = 100;

    osc.connect(audio.destination);

    osc.start(nextBeatTime);
    osc.stop(nextBeatTime + NOTE_DURATION);
}

function scheduleAudioEvents(){
    while(nextBeatTime < audio.currentTime + LOOKAHEAD_DURATION){
        scheduleSound();
        incrementBeat();
    }
}

function schedule(){
    scheduler = setTimeout(function(){
        scheduleAudioEvents();
        schedule();
    }, SCHEDULER_INTERVAL);
}

document.querySelector('#start').onclick = function(){
    clearTimeout(scheduler);
    schedule();
};

document.querySelector('#stop').onclick = function(){
    clearTimeout(scheduler);
};
