angular.module('NgFormTest', [
	'ngRoute',
	'ngMessages',
	'ngResource',
	'ngSanitize',

	'pascalprecht.translate',
	
	'text-mask',
	'moment-picker',
	'LocalForageModule',
	'ui.select',
])

.factory('CacheBustService', [
	function () {
		return {
			request: function (config) {
				if (config.url.indexOf('templates') !== -1 || config.url.indexOf('partials') !== -1) {
					config.url += (config.url.indexOf('?') === -1 ? '?' : '&') + 'v=' + parseInt(Date.now() / 1000)
				}
				return config
			}
		}
	}
])

.config([
	'$compileProvider', '$routeProvider', '$httpProvider', '$translateProvider', 'momentPickerProvider', 'createNumberMaskProvider',
	function ($compileProvider, $routeProvider, $httpProvider, $translateProvider, momentPickerProvider, createNumberMaskProvider) {
		// production setting
		// $compileProvider.debugInfoEnabled(false)
		
		// ng route definitions
		$routeProvider.otherwise({
			redirectTo: '/form',
		})
		.when('/home', {
			templateUrl: 'static/templates/home/page.html',
		})
		.when('/form', {
			templateUrl: 'static/templates/main_form/page.html',
		})
		.when('/thanks', {
			templateUrl: 'static/templates/thanks/page.html',
		})
		
		// push our cache buster
		$httpProvider.interceptors.push('CacheBustService')
		
		// get settings from body
		var bodyElem = angular.element(document.body)
		
		// use a static loader
		$translateProvider.useStaticFilesLoader({
			prefix: 'static/locale/',
			suffix: '.json',
		})
		$translateProvider.preferredLanguage(bodyElem.attr('data-locale'))
		
		// use no sanitization. its insane, but we start small
		$translateProvider.useSanitizeValueStrategy(null)
		
		// moment picker
		momentPickerProvider.options({
			locale: bodyElem.attr('data-locale'),
			format: bodyElem.attr('data-date-field-format'),
			// setOnSelect: true,
			today: true,
			leftArrow: '<i class="icon-arrow-left"></i>',
			rightArrow: '<i class="icon-arrow-right"></i>',
		})
		
		// defaults for the create number mask in text mask
		createNumberMaskProvider.setDefaultArgs({
			prefix: '',
			suffix: '',
			includeThousandsSeparator: true,
			thousandsSeparatorSymbol: bodyElem.attr('data-thousand-symbol'),
			decimalSymbol: bodyElem.attr('data-decimal-symbol'),
			decimalLimit: 2,
			integerLimit: null,
		})
		
	}
])

.run([
	'$localForage', 'accounting',
	function ($localForage, accounting) {
		$localForage.createInstance({name: 'mainform'})
		
		var bodyElem = angular.element(document.body)
		
		accounting.settings.number.precision = 2
		accounting.settings.number.thousand = bodyElem.attr('data-thousand-symbol')
		accounting.settings.number.decimal = bodyElem.attr('data-decimal-symbol')
	}
])
