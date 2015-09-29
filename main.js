document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	// dom elements
	var btn = document.querySelector('#btn'),
		transcriptDiv = document.querySelector('#transcript');

	// state
	var speaking = false;

	// start/stop speech recognition
	btn.onclick = function () {
		if (speaking) {
			recognition.stop();
			speaking = false;
			btn.innerHTML = 'Click to start';
		} else {
			recognition.start();
			speaking = true;
			btn.innerHTML = 'Click to stop';
			transcriptDiv.innerHTML = '';
		}
	};

	// recognition
	var recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.lang = 'sl-SI';

	recognition.onresult = function(event) {
		console.log(event);

		transcriptDiv.innerHTML = removeWhiteSpace(event.results[0][0].transcript);
	};


	// misc functions
	var removeWhiteSpace = function (str) {
		return str.replace(/\s/gm, '');
	};

});