AudioHelpers = (function(){
    var context = new AudioContext();

    function loadSoundFromUrl(url, callback){
        var request = new XMLHttpRequest();

        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function(){
            context.decodeAudioData(request.response, function(buffer){
                callback(buffer);
            });
        };

        request.send();
    }

    function createSourceFromBuffer(buffer){
        var source = context.createBufferSource();

        source.buffer = buffer;

        return source;
    }

    return {
        loadSoundFromUrl: loadSoundFromUrl,
        createSourceFromBuffer: createSourceFromBuffer
    };
})();