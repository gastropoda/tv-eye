define(["paper"], function(paper) {
  paper.Rectangle.prototype._containsPoint = function(point) {
		var x = point.x,
			y = point.y;
		return x >= this.x && y >= this.y
				&& x < this.x + this.width
				&& y < this.y + this.height;
	};
  return paper;
});
