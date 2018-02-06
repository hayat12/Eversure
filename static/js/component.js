angular.module('NgFormTest')

.component('stepFormButtons', {
	templateUrl: 'static/partials/buttons.html',
	bindings: {
		showPrevious: '<',
		showNext: '<',
		onPrevious: '&',
		onNext: '&',
	},
})
