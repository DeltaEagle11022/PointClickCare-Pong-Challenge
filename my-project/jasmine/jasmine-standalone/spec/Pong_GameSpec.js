/*
Developer's Note:

	Once SpecRunner is executed, the first 2 tests will pass, while the thrid will not (may not be in the same order in browser). 
	This can be noted from the green dots (pass) and red cross (fail) under "Jasmine" on the top-left. 
	However, in the browser, an error is shown due to jasmine not being able to get a value for canvasContext.getContext 
	within the game file. This does not impede the testing.
*/

describe("Sigmoid Curve Multiplier", function() {
	it("should return new y speed", function() {
		expect(sigmoidCurveMultiplier(30)).toEqual(20.841365175303885);
	});
});

describe("Staircase Curve Multiplier", function() {
	it("should return new x speed", function() {
		expect(staircaseCurveMultiplier(50)).toEqual(18.126452624390886);
	});
});

//This test is intentionally made to fail
describe("Staircase Curve Multiplier", function() {
	it("should return new x speed", function() {
		expect(staircaseCurveMultiplier(50)).toEqual(10);
	});
});
