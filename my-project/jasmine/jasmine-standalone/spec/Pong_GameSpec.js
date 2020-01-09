describe("Sigmoid Curve Multiplier", function() {
	it("should return new y speed", function() {
		// Arrange
		const num = 30;
		
		// Act
		const result = sigmoidCurveMultiplier(num);
		
		// Assert
		expect(result).toEqual(20.841365175303885);
	});
});

describe("Staircase Curve Multiplier", function() {
	it("should return new x speed", function() {
		//Arrange
		const num = 50;
		
		// Act
		const result = staircaseCurveMultiplier(num);
		
		// Assert
		expect(result).toEqual(18.126452624390886);
	});
});


describe("Staircase Curve Multiplier", function() {
	it("should return new x speed", function() {
		// Arrange
		const num = 0;
		
		// Act
		const result = staircaseCurveMultiplier(num);
		expect(result).toEqual(0);
	});
});
