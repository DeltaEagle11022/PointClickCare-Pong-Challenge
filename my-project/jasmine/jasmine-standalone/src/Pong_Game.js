//Canvas variables and TitleScreen toggle (via boolean)
var canvas;
var canvasContext;
var TitleScreen = true;

//Score Variables
var p1Score = 0;
var p2Score = 0;
var WinScreen = false;
const WIN = 11;

//Create the canvas
canvas = document.getElementById("Gameboard");
//Create a context for a 2d game.
canvasContext = canvas.getContext("2d");

//Resizes the canvas dimensions to fit the window
canvasContext.canvas.height = window.innerHeight;
canvasContext.canvas.width = window.innerWidth;

//Create Ball
//Ball (x, y, speedX, speedY)
var ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 3);

//Create Paddle for Player 1 who is on the left
//Paddle(x, y)
var Paddle_1 = new Paddle(2, 250);

//Create Paddle for Player 2 who is on the right
var Paddle_2 = new Paddle(canvas.width - 12, 250);

//Audio
var contactAudio_1 = document.getElementById("contactSound1");
var contactAudio_2 = document.getElementById("contactSound2");

//executes the script once the window has loaded
window.onload = function() {
	//Updating screen for movement and drawing, frame rate is 30 frames per second
	setInterval(function() {
		move();
		draw();
	}, 1000 / 30);

	//Add event listener for keydown events
	document.addEventListener("keydown", function() {
		if (event.code == "KeyW" && Paddle_1.posY > 0) {
			//turns on the "auto hold" which allows the paddle to continuously move up
			Paddle_1.up = true;
		} else if (event.code == "KeyS" && Paddle_1.posY < canvas.height) {
			//turns on the "auto hold" which allows the paddle to continuously move down
			Paddle_1.down = true;
		}

		if (event.code == "ArrowUp" && Paddle_2.posY > 0) {
			Paddle_2.up = true;
		} else if (event.code == "ArrowDown" && Paddle_2.posY < canvas.height) {
			Paddle_2.down = true;
		}
	});

	//Add event listener for keyup events according to eventCode
	document.addEventListener("keyup", function() {
		if (event.code == "KeyW") {
			//turns off the "auto hold" which allows the paddle to continuously move up
			Paddle_1.up = false;
		} else if (event.code == "KeyS") {
			//turns off the "auto hold" which allows the paddle to continuously move down
			Paddle_1.down = false;
		}

		if (event.code == "ArrowUp") {
			Paddle_2.up = false;
		} else if (event.code == "ArrowDown") {
			Paddle_2.down = false;
		}
	});

	//Handles mouse click to reset game
	canvas.addEventListener("mousedown", MouseClick);
};

function MouseClick(evt) {
	if (TitleScreen) {
		//When player "Clicks to continue", title screen will disappear
		TitleScreen = false;
	}

	if (WinScreen) {
		//When player "Clicks to play again", win screen will disappear and scores / paddles reset
		p1Score = 0;
		p2Score = 0;
		ball.speedX = 10;
		ball.speedY = 3;
		Paddle_1.posY = 250;
		Paddle_2.posY = 250;
		WinScreen = false;
	}
}

function move() {
	//blocks out all movement code if title screen in display
	if (TitleScreen) {
		return;
	}
	//blocks out all movement code if win is established
	if (WinScreen) {
		return;
	}

	//Move Paddles if auto hold for up is on (true) and Paddle is not above screen (stops paddle from leaving screen)
	if (Paddle_1.up && Paddle_1.posY > 0) {
		Paddle_1.posY -= Paddle_1.speedY;
	} else if (Paddle_1.down && Paddle_1.posY < canvas.height - Paddle_1.height) {
		Paddle_1.posY += Paddle_1.speedY;
	}

	//Same as Paddle 1
	if (Paddle_2.up && Paddle_2.posY > 0) {
		Paddle_2.posY -= Paddle_2.speedY;
	} else if (Paddle_2.down && Paddle_2.posY < canvas.height - Paddle_2.height) {
		Paddle_2.posY += Paddle_2.speedY;
	}

	//Near Left Paddle, handles ball collision
	//If ball hits paddle front and is inbetween the top and bottom of paddle, run collision

	if (ball.posX < Paddle_1.paddleWidth - 2) {
		//Checks if ball is within the paddle (added ball.radius to account for ball radius as ball is drawn from center)
		if (
			ball.posY > Paddle_1.posY - ball.radius &&
			ball.posY < Paddle_1.posY + Paddle_1.paddleHeight + ball.radius
		) {
			//Plays paddle contact audio for Player 1
			contactAudio_1.play();

			//Difference in height between ball and midpoint of paddle; used for speed multiplier
			//Increases the speed of the ball if further from Paddle center
			var deltaY = ball.posY - (2 * Paddle_1.posY + Paddle_1.paddleHeight) / 2;

			//sigmoidCurve and staircaseCurve are mapping functions that will use deltaY to increase/decrease X/Y speed
			ball.speedX = staircaseCurveMultiplier(deltaY);

			//shift in the x position ensures the else statement will not execute in the next frame is ball is too far in the paddle with minimal speed to get out.
			ball.posX += ball.speedX;
			ball.speedY = sigmoidCurveMultiplier(deltaY);
		} else {
			p2Score++;
			ballReset();
		}
	}

	//Near Right Paddle
	if (ball.posX > canvas.width - 8) {
		//If ball is inbetween the paddle's top and bottom
		if (
			ball.posY > Paddle_2.posY - ball.radius &&
			ball.posY < Paddle_2.posY + Paddle_2.paddleHeight + ball.radius
		) {
			//Plays paddle contact audio for Player 2
			contactAudio_2.play();

			deltaY = ball.posY - (2 * Paddle_2.posY + Paddle_2.paddleHeight) / 2;
			//multiplied by -1 to reverse direction
			ball.speedX = staircaseCurveMultiplier(deltaY) * -1;
			ball.posX += ball.speedX;
			ball.speedY = sigmoidCurveMultiplier(deltaY);
		} else {
			p1Score++;
			ballReset();
		}
	}

	//Move ball
	ball.posX += ball.speedX;
	ball.posY += ball.speedY;

	// Bounce if hits the top or bottom of the canvas
	//reverses the Y speed of the ball
	if (ball.posY > canvas.height - ball.radius) {
		//Places the ball slightly further up so that it does not become stuck on edge
		ball.posY = canvas.height - 9;
		ball.speedY *= -1;
	}

	if (ball.posY < Paddle_1.paddleWidth + ball.radius) {
		//Places the ball slightly further down so that it does not become stuck on edge
		ball.posY = Paddle_1.paddleWidth + 11;
		ball.speedY *= -1;
	}
}

/*
    This function will map the difference in the height of the ball and the center of the paddle 
    upon contact to a calculate new Y speed for the ball.

    For a curve with a gradual increase a sigmoid (logistical) curve was used 7
    and reformatted for a deltaY between -50 and 50 and a speed output between -25 and 25
*/
function sigmoidCurveMultiplier(_distance) {
	let newSpeed = 50 / (1 + Math.exp(-0.08 * _distance)) - 25;
	return newSpeed;
}

/*
    This function maps the deltaY to the new X speed of the ball using a curved staircase function
    
    h = height of function
    w = period of function
    a = smoothness of function
*/

function staircaseCurveMultiplier(_distance) {
	let h = 8;
	let w = 50;
	let a = 5;

	let speed =
		Math.abs(
			h *
				(0.5 *
					(1 / Math.tanh(a / 2)) *
					Math.tanh(a * (_distance / w - Math.floor(_distance / w)) - 0.5) +
					0.5 +
					Math.floor(_distance / w))
		) + 8;
	return speed;
}

function ballReset() {
	//Resets ball to middle of canvas
	ball.posX = canvas.width / 2;
	ball.posY = canvas.height / 2;

	//Resets the speed of the ball to 10 and reverses direction
	ball.speedX = -10 * (ball.speedX / Math.abs(ball.speedX));

	//Random Y speed integer between -10 and 10
	ball.speedY = Math.floor(Math.random() * (10 + 10 + 1) - 10);

	//If either player reaches winning score, turn on (true) win screen
	if (p2Score >= WIN || p1Score >= WIN) {
		WinScreen = true;
	}
}

//Function will draw all objects / texts on the screen
function draw() {
	//Draw game canvas
	canvasContext.fillStyle = "black";
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);

	//Title Screen shown at the start of a match
	if (TitleScreen) {
		showTitleScreen();
		//Ensure game does not run until player has clicked
		return;
	}

	if (WinScreen) {
		canvasContext.fillStyle = "White";

		if (p1Score >= WIN) {
			canvasContext.fillText(
				"Player 1 Won",
				canvas.width / 2 - canvasContext.measureText("Player 1 Won").width / 2,
				200
			);
		} else if (p2Score >= WIN) {
			canvasContext.fillText(
				"Player 2 Won",
				canvas.width / 2 - canvasContext.measureText("Player 2 Won").width / 2,
				200
			);
		}

		canvasContext.fillText(
			"Click to Play Again",
			canvas.width / 2 -
				canvasContext.measureText("Click to Play Again").width / 2,
			500
		);
		return;
	}

	//Draws Paddle, Ball, and Net
	Paddle_1.display();

	Paddle_2.display();

	ball.display();

	//Draws net
	drawNet();

	//display Player Scores
	canvasContext.font = "80px Bit5x3";
	canvasContext.fillText(p1Score, canvas.width / 2 - 200, 100);
	canvasContext.fillText(p2Score, canvas.width / 2 + 200, 100);
}

//Creates a dashed line from top of screen to bottom to act as a net
function drawNet() {
	canvasContext.beginPath();

	//sets dash length and spacing, first value indicates dash length, second indicates space between dash
	canvasContext.setLineDash([30, 15]);

	//moves drawing cursor
	canvasContext.moveTo(canvas.width / 2, 0);
	canvasContext.lineTo(canvas.width / 2, canvas.height);
	canvasContext.lineWidth = 5;

	//sets line colour
	canvasContext.strokeStyle = "white";
	canvasContext.stroke();
}

//Draws Title Screen
function showTitleScreen() {
	canvasContext.fillStyle = "rgb(30, 174, 255)";
	canvasContext.font = "45px Bit5x3";

	//Text is added to center of screen
	//Alignment is done by shifting positioning of fillText to middle of text (by taking half of the text length in pixels)
	//This balances the pixel count on each side
	canvasContext.fillText(
		"Welcome to the Retro Arcade game Pong by Atari",
		canvas.width / 2 -
			canvasContext.measureText(
				"Welcome to the Retro Arcade game Pong by Atari"
			).width /
				2,
		150
	);

	//Retro font used (Bit5x3)
	canvasContext.font = "35px Bit5x3";
	canvasContext.fillText(
		"Instructions",
		canvas.width / 2 - canvasContext.measureText("Instructions").width / 2,
		300
	);

	//Create an underline for "Instructions"
	canvasContext.fillRect(
		canvas.width / 2 - canvasContext.measureText("Instructions").width / 2,
		310,
		canvasContext.measureText("Instructions").width,
		5
	);

	//Instructions
	canvasContext.fillText(
		"W and S keys control Player 1 for Up and Down",
		canvas.width / 2 -
			canvasContext.measureText("W and S keys control Player 1 for Up and Down")
				.width /
				2,
		370
	);

	canvasContext.fillText(
		"Up and Down Arrow keys control Player 2",
		canvas.width / 2 -
			canvasContext.measureText("Up and Down Arrow keys control Player 2")
				.width /
				2,
		430
	);

	canvasContext.fillText(
		"First Player to 11 points wins",
		canvas.width / 2 -
			canvasContext.measureText("First Player to 11 points wins").width / 2,
		490
	);

	canvasContext.fillText(
		"Click to Continue",
		canvas.width / 2 - canvasContext.measureText("Click to Continue").width / 2,
		590
	);
}
