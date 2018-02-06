angular.module('NgFormTest')

.controller('RootController', [
	function () {
		var self = this
		
	}
])

.controller('MainFormController', [
	'$rootScope', '$window',
	function ($rootScope, $window) {
		var formVm = this
		
		formVm.stepTemplateList = [
			'static/templates/main_form/_step1.html',
			'static/templates/main_form/_step2.html',
			'static/templates/main_form/_step3.html',
			'static/templates/main_form/_step4.html',
			'static/templates/main_form/_step5.html',
			'static/templates/main_form/_step6.html',
		]
		
		formVm.progressActiveIndex = 0
		formVm.stepActiveIndex = 0
		formVm.isReady = true
		
		formVm.goNextStep = function () {
			$window.scrollTo(0, 0)
			formVm.stepActiveIndex = Math.min(formVm.stepActiveIndex + 1, formVm.stepTemplateList.length)
		}
		
		formVm.goPreviousStep = function () {
			$window.scrollTo(0, 0)
			formVm.stepActiveIndex = Math.max(0, formVm.stepActiveIndex - 1)
		}
		
		$rootScope.$on('setProgressActiveIndex', function (e, index) {
			formVm.progressActiveIndex = index
		})
		
		$rootScope.$on('main-form:go-next', function (e) {
			e.stopPropagation()
			formVm.goNextStep()
		})
		
		$rootScope.$on('main-form:go-previous', function (e) {
			e.stopPropagation()
			formVm.goPreviousStep()
		})
		
	}
])

.controller('GadgetDetailsController', [
	'$rootScope', 'MainFormService', 'Gadget', 'moment',
	function ($rootScope, MainFormService, Gadget, moment) {
		var vm = this
		
		vm.gadgetList = []
		
		vm.opt = {
			type: [],
			make: [],
			// modelValue: [],
		}
		
		vm.momentPicker = {
			purchaseDate: {
				max: moment(),
				min: moment().subtract(80, 'years')
			}
		}
		
		vm.typeChange = vmTypeChange
		vm.addGadget = vmAddGadget
		vm.removeGadget = vmRemoveGadget
		vm.submit = vmSubmit
		
		vmInit()
		
		// =====
		
		function vmInit () {
			Gadget.getTypes().then(function (data) {
				vm.opt.type = data
			})
			
			MainFormService.getStepData(1).then(function (data) {
				if (data) {
					vm.gadgetList = data
				}
			})
			
			$rootScope.$emit('setProgressActiveIndex', 0)
		}
		
		function vmTypeChange (vmType) {
			vm.opt.make = []
			Gadget.getMakes(vmType.id).then(function (data) {
				vm.opt.make = data
			})
		}
		
		function vmAddGadget (form) {
			if (form.$valid) {
				var gadgetData = {
					type: vm.type,
					make: vm.make,
					purchaseDate: vm.purchaseDate,
					condition: vm.condition,
				}
				
				vm.gadgetList.push(gadgetData)
				
				vm.type = ''
				vm.make = ''
				vm.purchaseDate = ''
				vm.condition = ''
				
				form.$setPristine()
				form.$setUntouched()
			}
		}
		
		function vmRemoveGadget (index) {
			if (vm.gadgetList.length > 0) {
				vm.gadgetList.splice(index, 1)
			}
		}
		
		function vmSubmit (form) {
			if (vm.gadgetList.length == 0) {
				alert('Please add a gadget before continuing')
			}
			else if (vm.gadgetList.length > 0 && form.$pristine) {
				MainFormService.setStepData(1, vm.gadgetList)
				$rootScope.$emit('main-form:go-next')
			}
		}
	}
])

.controller('CoverDetailsController', [
	'$rootScope', 'MainFormService',
	function ($rootScope, MainFormService) {
		var vm = this
		
		vm.setCover = vmSetCover
		
		vmInit()
		
		// =====
		
		function vmInit () {
			$rootScope.$emit('setProgressActiveIndex', 0)
		}
		
		function vmSetCover (cover) {
			MainFormService.setStepData(2, cover)
			$rootScope.$emit('main-form:go-next')
		}
	}
])

.controller('PersonalDetailsController', [
	'$rootScope', 'MainFormService', 'moment',
	function ($rootScope, MainFormService, moment) {
		var vm = this
		
		var formKeys = [
			'name',
			'surname',
			'emailAddress',
			'phone',
			'postcode',
			'address',
			'dateOfBirth',
		]
		
		vm.momentPicker = {
			dateOfBirth: {
				max: moment(),
				min: moment().subtract(80, 'years')
			}
		}
		
		vm.submit = vmSubmit
		
		vmInit()
		
		// ========================================
		
		function vmInit () {
			MainFormService.getStepData(3).then(function (data) {
				if (data) {
					angular.extend(vm, data)
				}
			})
			
			$rootScope.$emit('setProgressActiveIndex', 1)
		}
		
		function vmSubmit (form) {
			if (form.$valid) {
				var formData = {}
				for (var i=0; i<formKeys.length; i++) {
					formData[formKeys[i]] = vm[formKeys[i]]
				}
				
				MainFormService.setStepData(3, formData)
				$rootScope.$emit('main-form:go-next')
			}
			
		}
		
	}
])

.controller('SummaryController', [
	'$rootScope', 'MainFormService',
	function ($rootScope, MainFormService) {
		var vm = this
		
		// vm.gadgetList = []
		vm.gadgetList = [ { "type": { "id": 2, "name": "Sony" }, "make": { "id": 5, "name": "Xperia Z3", "typeId": 2 }, "purchaseDate": "February 2018", "condition": "refurbished" }, { "type": { "id": 1, "name": "Apple" }, "make": { "id": 2, "name": "iPhone SE", "typeId": 1 }, "purchaseDate": "January 2018", "condition": "new" } ] 
		// vm.personalData = {}
		vm.personalData =  { "name": "asassda", "surname": "asdaasd", "emailAddress": "asdas@asd.co", "phone": "123", "postcode": "123", "address": "asdad", "dateOfBirth": "24 January 2018" } 
		
		vmInit()
		
		// =====
		
		function vmInit () {
			MainFormService.getStepData(1).then(function (data) {
				if (data) {
					vm.gadgetList = data
				}
			})
			
			MainFormService.getStepData(3).then(function (data) {
				if (data) {
					vm.personalData = data
				}
			})
			
			$rootScope.$emit('setProgressActiveIndex', 1)
		}
	}
])

.controller('FinalQuestionController', [
	'$rootScope', '$location', 'MainFormService', 'moment',
	function ($rootScope, $location, MainFormService, moment) {
		var vm = this
		
		vm.momentPicker = {
			startDate: {
				max: moment().add(1, 'years'),
				min: moment()
			}
		}
		
		vm.submit = vmSubmit
		
		vmInit()
		
		// =====
		
		function vmInit () {
			$rootScope.$emit('setProgressActiveIndex', 2)
		}
		
		function vmSubmit (form) {
			form.tncAgree.$setValidity('required', (vm.tncAgree === true))
			
			if (form.$valid) {
				$rootScope.$emit('main-form:go-next')
			}
		}
	}
])

.controller('PaymentController', [
	'$rootScope',
	function ($rootScope) {
		$rootScope.$emit('setProgressActiveIndex', 2)
	}
])

// .controller('VehicleDetailsController', [
// 	'$rootScope', 'Vehicle', 'createNumberMask', 'MainFormService',
// 	function ($rootScope, Vehicle, createNumberMask, MainFormService) {
// 		var vm = this
		
// 		var vehicleModel = {
// 			brand: '',
// 			model: '',
// 			carValue: '',
// 			carPlate: '',
// 			opt: {
// 				brand: [],
// 				model: [],
// 			},
// 		}
		
// 		var formKeys = [
// 			'brand',
// 			'model',
// 			'carValue',
// 			'carPlate',
// 		]
		
// 		vm.vehicleVmList = []
		
// 		vm.mask = {
// 			carValue: {
// 				'mask': createNumberMask.forDecimal(),
// 			}
// 		}
		
// 		vm.goBack = vmGoBack
		
// 		vm.brandChange = vmBrandChange
		
// 		vm.addVehicle = vmAddVehicle
// 		vm.addVehicleDisabled = false
// 		vm.removeVehicle = vmRemoveVehicle
// 		vm.removeVehicleDisabled = true
		
// 		vm.submit = vmFormSubmit
		
// 		vmInit()
		
// 		// ========================================
		
// 		function vmFormSubmit (form) {
// 			if (form.$valid) {
// 				var formDataList = []
// 				for (var i=0; i<vm.vehicleVmList.length; i++) {
// 					var formData = {}
					
// 					for (var j=0; j<formKeys.length; j++) {
// 						formData[formKeys[j]] = vm.vehicleVmList[i][formKeys[j]]
// 					}
					
// 					formDataList.push(formData)
// 				}
				
// 				MainFormService.setStepData(2, formDataList)
// 				$rootScope.$emit('main-form:go-next')
// 			}
// 		}
		
// 		function vmGoBack () {
// 			$rootScope.$emit('main-form:go-previous')
// 		}
		
// 		function vmBrandChange (vehicleVm, vehicleModelValue) {
// 			vehicleVm.model = ''
// 			vehicleVm.opt.model = []
			
// 			Vehicle.$getModels({id: vehicleVm.brand.id}).then(function (data) {
// 				vehicleVm.opt.model = data
				
// 				if (vehicleModelValue) {
// 					vehicleVm.model = vehicleModelValue
// 				}
// 			})
// 		}
		
// 		function vmAddVehicle (vehicleData) {
// 			if (!vm.addVehicleDisabled) {
// 				var newVehicleModel = angular.copy(vehicleModel)
				
// 				if (vehicleData) {
// 					angular.extend(newVehicleModel, vehicleData)
// 					vmBrandChange(newVehicleModel, vehicleData.model)
// 				}
				
// 				vm.vehicleVmList.push(newVehicleModel)
// 			}
			
// 			checkVehicleAction()
// 		}
		
// 		function vmRemoveVehicle (index) {
// 			if (!vm.removeVehicleDisabled) {
// 				vm.vehicleVmList.splice(index, 1)
// 			}
			
// 			checkVehicleAction()
// 		}
		
// 		function checkVehicleAction () {
// 			vm.addVehicleDisabled = (vm.vehicleVmList.length >= 3)
// 			vm.removeVehicleDisabled = (vm.vehicleVmList.length == 1)
// 		}
		
// 		function vmInit () {
// 			MainFormService.getStepData(2).then(function (data) {
// 				if (data) {
// 					for (var i=0; i<data.length; i++) {
// 						vmAddVehicle(data[i])
// 					}
// 				}
// 				else {
// 					vmAddVehicle()
// 				}
				
// 			})
			
// 			Vehicle.$query().then(function (data) {
// 				var optBrand = []
				
// 				for (var i=0; i<data.length; i++) {
// 					optBrand.push({
// 						'id': data[i]['id'],
// 						'brand': data[i]['brand'],
// 					})
// 				}
				
// 				vehicleModel.opt.brand = optBrand
				
// 				for (var i=0; i<vm.vehicleVmList.length; i++) {
// 					vm.vehicleVmList[i].opt.brand = optBrand
// 				}
// 			})
			
// 		}
// 	}
// ])

// .controller('SummaryController', [
// 	'$rootScope', '$location', 'MainFormService', 'ModalBoxFactory',
// 	function ($rootScope, $location, MainFormService, ModalBoxFactory) {
// 		var vm = this
		
// 		vm.formData = {}
		
// 		vm.goBack = vmGoBack
		
// 		vm.submit = vmFormSubmit
		
// 		vmInit()
		
// 		// ========================================
		
// 		function vmInit () {
// 			MainFormService.getAllStepData().then(function (data) {
// 				vm.formData = data
// 			})
// 		}
		
// 		function vmGoBack () {
// 			$rootScope.$emit('main-form:go-previous')
// 		}
		
// 		function vmFormSubmit (form) {
// 			form.tncAgree.$setValidity('required', (vm.tncAgree === true))
			
// 			if (form.$valid) {
// 				ModalBoxFactory.show('#summary-process-modal')
// 				MainFormService.save().then(function () {
// 					ModalBoxFactory.hide()
// 					$location.path('/thanks');
// 				})
// 			}
// 		}
// 	}
// ])

// .controller('ThankYouController', [
// 	'MainFormService',
// 	function (MainFormService) {
// 		var vm = this
		
// 		vmInit()
		
// 		// ========================================
		
// 		function vmInit () {
// 			MainFormService.toJSON().then(function (data) {
// 				vm.formData = JSON.stringify(data, null, '  ')
// 			})
// 		}
// 	}
// ])
