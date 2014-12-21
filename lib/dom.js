var $ = require('jquery');

module.exports = {
	common: {
		$win: $(window)
	},
	setup: function () {
		this.$el = $(this.element);
		this.$onceEl = $();
	}
};
