/* global PI, webkitSpeechRecognition, JsDiff */

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
			document.querySelector('.container').innerHTML = '<div class="text-center lead">This app is working only in Chrome Browser (version 25 and newer). But not on iOS devices (Win, Mac, Linux is fine).</div>';
		}
	}());

	// dom elements
	var btn = document.querySelector('#btn'),
		langSel = document.querySelector('#lang'),
		finalSpan   = document.querySelector('#finalSpan'),
		interimSpan = document.querySelector('#interimSpan');

	// state
	var settings = {
		speaking:        false,
		startCheckingAt: 0,
	};

	/**
	 * Toggle speech recognition start/stop
	 * Based on speaking state var.
	 */
	var toggleRecognition = function () {
		if (settings.speaking) {
			recognition.stop();
		} else {
			// currently selected language
			recognition.lang = langSel.value;

			recognition.start();
		}
	};

	// start/stop speech recognition
	btn.onclick = toggleRecognition;

	// start/stop with spacebar
	document.onkeydown = function (ev) {
		if ( ev.keyCode === 32 ) {
			toggleRecognition();
		}
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
	 */
	recognition.onresult = function(event) {
		var interimTranscript = '';

		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				finalTranscript += checkPiFromPosition((settings.startCheckingAt+finalTranscript.length), event.results[i][0].transcript);
			} else {
				interimTranscript += event.results[i][0].transcript;
			}
		}

		finalSpan.innerHTML   = finalTranscript;
		interimSpan.innerHTML = interimTranscript;
	};

	// start recognition
	recognition.onstart = function () {
		var startAtElm = document.querySelector('#startAt');

		settings.speaking        = true;
		settings.startCheckingAt = startAtElm.value ? parseInt(startAtElm.value, 10)-1 : 0;

		btn.innerHTML     = 'Click to stop';
		finalTranscript   = '';

		// set initial dots if not starting from start of PI
		document.querySelector('#initialDecimals').innerHTML = settings.startCheckingAt > 0 ? '[first ' + settings.startCheckingAt + ' decimals]' : '';
	};

	// stop recognition
	recognition.onend = function () {
		settings.speaking = false;
		btn.innerHTML     = 'Click to start';
	};


	// misc functions

	// remove all characters except numbers
	var removeAllButNumbers = function (str) {
		return str.replace(/\D/gm, '');
	};

	// check first N decimas of PI
	var checkPiFromPosition = function (pos, input) {
		input = removeAllButNumbers(input);

		var partialPi = PI.substr(pos, input.length),
			isOK = partialPi === input;

		if (isOK) {
			return input;
		} else {
			var diff = JsDiff.diffChars(input, partialPi),
				out = [];

			diff.forEach(function(part){
				// green for additions, red for deletions
				// white for common parts
				var color = part.added ? 'green' :
					part.removed ? 'red' : false;

				if (color) {
					out.push('<span style="color: ' + color + ';">' + part.value + '</span>');
				} else {
					out.push(part.value);
				}
			});

			return out.join('');
		}

	};

});