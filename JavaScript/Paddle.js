//Creating the class for the Paddle Object
class Paddle {
	constructor(_x, _y) {
		this.x = _x;
		this.y = _y;
		this.height = 100;
		this.width = 10;
		this.up = false;
		this.down = false;
		this.speedY = 15;
	}

	get posY() {
		return this.y;
	}

	set posY(positionY) {
		this.y = positionY;
	}

	get paddleHeight() {
		return this.height;
	}

	get paddleWidth() {
		return this.width;
	}

	//Method to display / draw paddles
	display() {
		//Rectangle fill colour is white
		canvasContext.fillStyle = "white";
		//Draw Rectangle (paddle)
		canvasContext.fillRect(this.x, this.y, this.width, this.height);
	}
}
