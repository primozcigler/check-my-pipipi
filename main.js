/* global PI, webkitSpeechRecognition */

/**
 * Check PI with the SpeechRecognition HTML5 API
 * @link https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html
 * @link http://updates.html5rocks.com/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API
 * @link http://www.sitepoint.com/introducing-web-speech-api/
 */

document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	(function () {
		if (!('webkitSpeechRecognition' in window)) {
			document.body.innerHTML = 'This app is working only in Chrome Browser (version 25 and newer).';
		}
	}());

	// dom elements
	var btn = document.querySelector('#btn'),
		finalSpan   = document.querySelector('#finalSpan'),
		interimSpan = document.querySelector('#interimSpan');

	// state
	var speaking = false;

	// start/stop speech recognition
	btn.onclick = function () {
		speaking ? recognition.stop() : recognition.start();
	};

	// recognition and settings
	var recognition            = new webkitSpeechRecognition();
	recognition.continuous     = true;
	recognition.interimResults = true;
	recognition.lang           = 'sl-SI';

	// var for final transcript
	var finalTranscript   = '';

	/**
	 * Results
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	recognition.onresult = function(event) {
		console.log(event);
		var interimTranscript = '';

		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				finalTranscript += event.results[i][0].transcript;
			} else {
				interimTranscript += event.results[i][0].transcript;
			}
		}

		finalTranscript = removeAllButNumbers(finalTranscript);

		finalSpan.innerHTML   = finalTranscript;
		interimSpan.innerHTML = interimTranscript;

		checkPiFromStart(finalTranscript);
	};

	recognition.onstart = function () {
		speaking        = true;
		btn.innerHTML   = 'Click to stop';
		finalTranscript = '';
		document.body.style.backgroundColor = '';
	};

	recognition.onend = function () {
		speaking      = false;
		btn.innerHTML = 'Click to start';
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