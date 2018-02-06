angular.module('NgFormTest')

.factory('MainFormService', [
	'$localForage', '$q', '$timeout', 'moment', 'accounting',
	function ($localForage, $q, $timeout, moment, accounting) {
		var lf = $localForage.instance('mainform')
		var keyPrefix = 'form-data-'
		
		var mainFormData = {}
		
		function setStepData (step, data) {
			// lf.setItem(keyPrefix + step, data)
			mainFormData[keyPrefix + step] = data
		}
		
		function getStepData (step) {
			// return lf.getItem(keyPrefix + step)
			return $q.when(mainFormData[keyPrefix + step])
		}
		
		function getAllStepData () {
			return $q.when(mainFormData)
		}
		
		function toJSON () {
			var jsonFormData = angular.copy(mainFormData)
			
			var dateOfBirth = jsonFormData['form-data-1'].dateOfBirth
			dateOfBirth = moment(dateOfBirth, 'D MMMM YYYY', true).toJSON()
			jsonFormData['form-data-1'].dateOfBirth = dateOfBirth
			
			for (var i=0; i<jsonFormData['form-data-2'].length; i++) {
				jsonFormData['form-data-2'][i].brand = jsonFormData['form-data-2'][i].brand.id
				jsonFormData['form-data-2'][i].carValue = accounting.parse(jsonFormData['form-data-2'][i].carValue)
			}
			
			return $q.when(jsonFormData)
		}
		
		function save () {
			return $timeout(function () {
				return true
			}, 2000)
		}
		
		return {
			setStepData: setStepData,
			getStepData: getStepData,
			getAllStepData: getAllStepData,
			toJSON: toJSON,
			save: save,
		}
	}
])

.factory('Vehicle', [
	'$http', '$timeout',
	function ($http, $timeout) {
		var jsonData = [
			{"id": 1, "brand": "Honda", "models": ["Accord", "Accord Coupé", "Accord Tourer", "City", "Civic"]},
			{"id": 2, "brand": "Subaru", "models": ["BRZ", "Forester", "Impreza", "Impreza Wagon", "Justy"]},
			{"id": 3, "brand": "Mazda", "models": ["121", "2", "3", "323", "323 Combi"]},
			{"id": 4, "brand": "Mitsubishi", "models": ["3000 GT", "ASX", "Carisma", "Colt", "Colt CC", "Eclipse"]},
			{"id": 5, "brand": "Lexus", "models": ["CT", "GS", "GS 300", "GX", "IS"]},
			{"id": 6, "brand": "Toyota", "models": ["4-Runner", "Auris", "Avensis", "Avensis Combi", "Avensis Van Verso"]},
			{"id": 7, "brand": "Suzuki", "models": ["Alto", "Baleno", "Baleno kombi", "Grand Vitara", "Grand Vitara XL-7"]}
		]
		
		function getDelay () {
			var max = 4
			var min = 2
			var delay = Math.floor(Math.random() * (max - min + 1)) + min;
			// console.log('Delay ' + delay + 's')
			// return (delay * 1000)
			return 0
		}
		
		function query () {
			return $timeout(function () {
				return jsonData
			}, getDelay())
		}
		
		function getModels (param) {
			return $timeout(function () {
				var brandId = param['id']
				var models = []
				
				for (var i=0; i<jsonData.length; i++) {
					if (jsonData[i]['id'] == brandId) {
						models = jsonData[i]['models']
						break
					}
				}
				
				return models
			}, getDelay())
		}
		
		return {
			$query: query,
			$getModels: getModels,
		}
	}
])

.factory('ScrollbarWidthService', [
	function () {
		var scrollDiv = document.createElement('div')
		scrollDiv.className = 'modal-scrollbar-measure'
		document.body.appendChild(scrollDiv)
		var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
		document.body.removeChild(scrollDiv)
		
		return {
			get: function () { return scrollbarWidth },
		}
	}
])

.factory('ModalBoxFactory', [
	'ScrollbarWidthService',
	function (ScrollbarWidthService) {
		function show (elemId) {
			var scrollWidth = ScrollbarWidthService.get() + 'px'
			
			var modalBox = document.querySelector(elemId)
			
			if (modalBox) {
				modalBox = angular.element(modalBox)
				modalBox.addClass('show')
				modalBox.css({
					'display': 'block',
					'padding-right': scrollWidth,
				})
				
				var bodyElem = angular.element(document.body)
				bodyElem.addClass('modal-open')
				bodyElem.css('padding-right', scrollWidth)
				
				var backdrop = document.createElement('div')
				backdrop.className = 'modal-backdrop show'
				document.body.appendChild(backdrop)
			}
		}
		
		function hide () {
			var backdrop = document.querySelector('.modal-backdrop.show')
			if (backdrop) {
				backdrop = angular.element(backdrop)
				backdrop.remove()
			}
			
			var bodyElem = angular.element(document.body)
			bodyElem.removeClass('modal-open')
			bodyElem.css('padding-right', 0)
			
			var modalBox = document.querySelector('.modal.show')
			if (modalBox) {
				modalBox = angular.element(modalBox)
				modalBox.removeClass('show')
				modalBox.css({
					'display': 'none',
					'padding-right': 0,
				})
			}
		}
		
		return {
			show: show,
			hide: hide,
		}
	}
])

.factory('Gadget', [
	'$q',
	function ($q) {
		var dataTypes = [
			{id: 1, name: 'Apple'},
			{id: 2, name: 'Sony'},
			{id: 3, name: 'Nokia'},
		]
		
		var dataMakes = [
			{id: 1, name: 'iPhone 6', typeId: 1},
			{id: 2, name: 'iPhone SE', typeId: 1},
			{id: 3, name: 'iPod', typeId: 1},
			{id: 4, name: 'Xperia L2', typeId: 2},
			{id: 5, name: 'Xperia Z3', typeId: 2},
			{id: 6, name: 'Xperia X', typeId: 2},
			{id: 7, name: '3', typeId: 3},
			{id: 8, name: '6', typeId: 3},
			{id: 9, name: '8', typeId: 3},
		]
		
		function getTypes () {
			return $q.when(dataTypes)
		}
		
		function getMakes (typeId) {
			var newDataMakes = []
			
			for (var i=0; i<dataMakes.length; i++) {
				if (dataMakes[i].typeId == typeId) {
					newDataMakes.push(dataMakes[i])
				}
			}
			
			return $q.when(newDataMakes)
		}
		
		return {
			getTypes: getTypes,
			getMakes: getMakes,
		}
	}
])
