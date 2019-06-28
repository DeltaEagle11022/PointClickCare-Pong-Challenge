// Creating the Class for the Ball object
class Ball {
	constructor(x, y, speedX, speedY) {
		this._x = x;
		this._y = y;
		this._speedX = speedX;
		this._speedY = speedY;
		this.radius = 10;
	}

	get posX() {
		return this._x;
	}

	set posX(positionX) {
		this._x = positionX;
	}

	get posY() {
		return this._y;
	}

	set posY(positionY) {
		this._y = positionY;
	}

	get speedX() {
		return this._speedX;
	}

	set speedX(SpeedX) {
		this._speedX = SpeedX;
	}
	get speedY() {
		return this._speedY;
	}

	set speedY(SpeedY) {
		this._speedY = SpeedY;
	}

	//Method to display / draw the ball
	display() {
		//Fill shape
		canvasContext.fillStyle = "white";
		//Draw shape (circle)
		canvasContext.beginPath();
		// arc (x, y, radius, start angle (radians), end angle (radians), draw counterclockwise (true / false));
		canvasContext.arc(this._x, this._y, this.radius, 0, Math.PI * 2, true);
		//fill entire shape
		canvasContext.fill();
	}
}
