var schedulerApp = (function(options){
    var SCHEDULER_INTERVAL = 50;
    var LOOKAHEAD_DURATION = 0.1;

    var tempo = options.tempo || 200;
    var beatDuration = 60.0 / tempo;

    var NOTE_DURATION = 0.1;

    var nextBeatTime = 0.0;
    var scheduler;
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

    function scheduleSound(oscillator){
        if(!oscillator){
            return;
        }

        oscillator.connect(audio.destination);
        oscillator.start(nextBeatTime);
        oscillator.stop(nextBeatTime + NOTE_DURATION);
    }

    function setupAudioEvent(){
        var audioData;

        beatDuration = 60.0 / tempo;

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
        scheduler = setTimeout(function(){
            scheduleAudioEvents();
            schedule();
        }, SCHEDULER_INTERVAL);
    }

    function start(){
        if(scheduler){
            clearTimeout(scheduler);
        }
        schedule();
    }

    function stop(){
        clearTimeout(scheduler);
    }

    function setTempo(newTempo){
        tempo = newTempo;
    }

    return {
        start: start,
        stop: stop,
        setOscGen: setOscGen,
        setTempo: setTempo
    };
})({});
