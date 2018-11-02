class Point {
	getArea() {
		return this.x * this.y
	}
	scale(factor) {
		this.x = this.x * factor
		return this.y = this.y * factor
	}
	static unit() {
		return 42
	}
}
let p
p.x
p.x = 3
p.getArea()
let a = Point.unit()
