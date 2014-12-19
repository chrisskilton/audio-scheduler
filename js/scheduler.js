var Scheduler = function Scheduler(options){
    var SCHEDULER_INTERVAL = 50;
    var LOOKAHEAD_DURATION = 0.1;

    var tempo = options.tempo || 120;
    var beatDuration = options.beatDuration || 60.0 / tempo / 4;

    var NOTE_DURATION = options.noteDuration || 0.1;

    var nextBeatTime = 0.0;
    var timerId;
    var audio = new AudioContext();
    var oscillatorGen;

    function incrementBeat(){
        nextBeatTime += beatDuration;
    }

    function setOscGen(func){
        oscillatorGen = func;
    }

    oscillatorGen = function(audioData){
        var osc = audioData.context.createOscillator();

        return osc;
    };

    function scheduleSound(soundsToPlay){
        if(!soundsToPlay || !soundsToPlay.length){
            return;
        }

        soundsToPlay.forEach(function(soundSource){
            var gainConnection = soundSource.gain ? soundSource.gain : soundSource;
            var source = soundSource.source ? soundSource.source : soundSource;

            gainConnection.connect(audio.destination);
            source.start(nextBeatTime);
            source.stop(nextBeatTime + NOTE_DURATION);
        });
    }

    function setupAudioEvent(){
        var audioData;

        audioData = {
            context: audio,
            tempo: tempo,
            beatDuration: beatDuration,
            beatTime: Math.round(nextBeatTime / beatDuration)
        };

        var sound = oscillatorGen(audioData);

        scheduleSound(sound);
    }

    function scheduleAudioEvents(){
        while(nextBeatTime < audio.currentTime + LOOKAHEAD_DURATION){
            setupAudioEvent();
            incrementBeat();
        }
    }

    function schedule(){
        if(timerId){
            clearInterval(timerId);
        }

        timerId = setInterval(function(){
            scheduleAudioEvents();
            schedule();
        }, SCHEDULER_INTERVAL);
    }

    function start(){
        if(timerId){
            clearInterval(timerId);
        }

        schedule();
    }

    function stop(){
        clearInterval(timerId);
    }

    function setTempo(newTempo){
        tempo = newTempo;
    }

    function getContext(){
        return audio;
    }

    function remove(){
        stop();
        audio = undefined;
    }

    return {
        start: start,
        stop: stop,
        setOscGen: setOscGen,
        setTempo: setTempo,
        getContext: getContext,
        remove: remove
    };
}

if (typeof define === 'function'){
    define(function() {
        return Scheduler;
    });
} else {
    window.Scheduler = Scheduler;
}
