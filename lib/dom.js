var $ = require('jquery');

module.exports = {
	$win: $(window),
	setup: function () {
		this.$el = $(this.element);
		this.$onceEl = $();
	}
};
