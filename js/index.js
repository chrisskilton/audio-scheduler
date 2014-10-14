var schedulerApp = (function(){
    var SCHEDULER_INTERVAL = 50;
    var LOOKAHEAD_DURATION = 0.1;

    var TEMPO = 120;
    var BEAT_DURATION = 60.0 / TEMPO;
    var NOTE_DURATION = 0.1;

    var nextBeatTime = 0.0;
    var scheduler;
    var audio = new AudioContext();
    var oscillatorGen;

    function incrementBeat(){
        nextBeatTime += BEAT_DURATION;
    }

    function setOscGen(func){
        oscillatorGen = func;
    }

    oscillatorGen = function(context){
        var osc = context.createOscillator();

        return osc;
    };

    function scheduleSound(oscillator){
        oscillator.connect(audio.destination);
        oscillator.start(nextBeatTime);
        oscillator.stop(nextBeatTime + NOTE_DURATION);
    }

    function setupAudioEvent(){
        var sound = oscillatorGen(audio);

        scheduleSound(sound);
    }

    function scheduleAudioEvents(){
        while(nextBeatTime < audio.currentTime + LOOKAHEAD_DURATION){
            setupAudioEvent();
            incrementBeat();
        }
    }

    function schedule(){
        scheduler = setTimeout(function(){
            scheduleAudioEvents();
            schedule();
        }, SCHEDULER_INTERVAL);
    }

    function start(){
        clearTimeout(scheduler);
        schedule();
    }

    function stop(){
        clearTimeout(scheduler);
    }

    return {
        start: start,
        stop: stop,
        setOscGen: setOscGen
    };
})();
