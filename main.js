/* global PI, webkitSpeechRecognition */

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

	// recognition and settings
	var recognition        = new webkitSpeechRecognition();
	recognition.continuous = true;
	// recognition.interim    = true;
	recognition.lang       = 'sl-SI';

	recognition.onresult = function(event) {
		console.log(event);

		var transcript = removeAllButNumbers(event.results[0][0].transcript);

		transcriptDiv.innerHTML = transcript;

		checkPiFromStart(transcript);
	};


	// misc functions

	// remove all characters except numbers
	var removeAllButNumbers = function (str) {
		return str.replace(/\D/gm, '');
	};

	// check first N decimas of PI
	var checkPiFromStart = function (input) {
		var partialPi = PI.slice(0, input.length);

		if ( partialPi === input ) {
			document.body.style.backgroundColor = 'green';
		}
		else {
			document.body.style.backgroundColor = 'red';
		}
	};

});