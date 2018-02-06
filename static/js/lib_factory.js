angular.module('NgFormTest')

.factory('moment', [
	'$window',
	function ($window) {
		return $window.moment
	}
])

.provider('createNumberMask', function () {
	var defaultArgs = {}
	
	this.setDefaultArgs = function (args) {
		defaultArgs = args
	}
	
	this.$get = [
		'$window',
		function ($window) {
			function forInt (args) {
				args = angular.extend({}, defaultArgs, args)
				args['allowDecimal'] = false
				return $window.createNumberMask.default(args)
			}
			
			function forDecimal (args) {
				args = angular.extend({}, defaultArgs, args)
				args['allowDecimal'] = true
				return $window.createNumberMask.default(args)
			}
			
			return {
				forInt: forInt,
				forDecimal: forDecimal,
			}
		}
	]
})

.factory('accounting', [
	'$window',
	function ($window) {
		return $window.accounting
	}
])
