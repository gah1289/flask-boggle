const $guessForm = $('#guess-form');
let $messageSection = $('.messages');
let score = 0;
let guesses = [];

$('#score').text(score);

$('#guess-submit').click(function(e) {
	// Step 3- Using jQuery, take the form value and using axios, make an AJAX request to send it to the server.

	e.preventDefault();
	$messageSection.show();
	checkWord();
});

async function checkWord() {
	let $guess = $('#guess-input').val().toLowerCase();
	// check for duplicates
	if (!guesses.includes($guess)) {
		guesses.push($guess);
		res = await $.ajax({
			url      : 'http://127.0.0.1:5000/check-word',
			method   : 'POST',
			dataType : 'json',
			data     : { guess: $guess }
		});
		// https://stackoverflow.com/questions/1200266/submit-a-form-using-jquery
		let status = res.result;
		if (status == 'ok') {
			let pointsEarned = 0;
			msg = 'Nice!';
			$messageSection.removeClass('wrong-word');
			$messageSection.addClass('ok-word');
			pointsEarned = $guess.length;
			score += pointsEarned;
			$('#score').text(score);
			flashPoints(pointsEarned);
		}
		else if (status == 'not-on-board') {
			msg = 'The word is not on the board';
			$messageSection.removeClass('ok-word');
			$messageSection.addClass('wrong-word');
		}
		else {
			msg = 'Please enter a valid word';
			$messageSection.removeClass('ok-word');
			$messageSection.addClass('wrong-word');
		}
	}
	else {
		msg = 'You already guessed that!';
		$messageSection.removeClass('ok-word');
		$messageSection.addClass('wrong-word');
	}
	showMessage(msg);
	$('#guess-input').val('');
}

function showMessage(msg) {
	$messageSection.text(msg);
}

function flashPoints(points) {
	$('#game-board').append(`<div class="points">+${points}</div>`);
}

(function startCountdown() {
	// Instead of letting the user guess for an infinite amount of time, ensure that a game can only be played for 60 seconds.
	let counter = 60;
	$('#start-game').click(function() {
		$('#game-board').removeClass('blur');
		let interval = setInterval(function() {
			$('#start-game').hide();
			$('#guess-submit').removeAttr('disabled');
			counter--;
			if (counter <= 0) {
				clearInterval(interval);
				$('#time').text("Time's up!");
				$('#guess-submit').prop('disabled', true);
				//Once 60 seconds has passed, disable any future guesses-- https://learn.jquery.com/using-jquery-core/faq/how-do-i-disable-enable-a-form-element/
				$messageSection.hide();
				finalScore(score);
				return;
			}
			else {
				$('#time').text(counter);
			}
		}, 1000);
	});
})();

async function finalScore(finalScore) {
	const res = await axios.post('/end-game', { score: finalScore });
	let isHighScore = res.data.brokeRecord;
	if (isHighScore) {
		$('#score-div').html(`<h1 class="high-score"> New High Score! ${score}</h1>`);
	}
	else {
		$('#score-div').html(`<h1> Final Score: ${score}</h1>`);
	}
}
