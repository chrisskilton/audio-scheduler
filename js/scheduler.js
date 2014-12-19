var scheduler = (function(){
    var instance;
    var audio = new AudioContext();

    function Scheduler(options){
        var SCHEDULER_INTERVAL = 50;
        var LOOKAHEAD_DURATION = 0.1;

        var tempo = options.tempo || 120;
        var beatDuration = options.beatDuration || 60.0 / tempo / 4;

        var NOTE_DURATION = options.noteDuration || 0.1;

        var nextBeatTime = 0.0;
        var timerId;
        var oscillatorGen;

        function incrementBeat(){
            nextBeatTime += beatDuration;
        }

        function setOscGen(func){
            oscillatorGen = func;
        }

        function getOscGen() {
            return oscillatorGen;
        }

        oscillatorGen = function(audioData){
            // return an array of sound sources to play
            // can be an oscillator
            // can be an object with source and gain properties
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
            getOscGen: getOscGen,
            setTempo: setTempo,
            getContext: getContext,
            remove: remove
        };
    }

    return {
        get: function(options) {
            options = options || {};

            if (!instance){
                instance = new Scheduler(options);
            }

            return instance;
        },
        reset: function(options) {
            instance = undefined;
            instance = new Scheduler(options);

            return instance;
        }
    }
})();
