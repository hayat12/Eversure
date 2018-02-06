angular.module('NgFormTest')

.directive('ngCustomShowModal', [
	'ModalBoxFactory',
	function (ModalBoxFactory) {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				// console.log(ScrollbarWidthService.get())
				elem.on('click', function () {
					ModalBoxFactory.show(attrs.ngCustomShowModal)
				})
				
			}
		}
	}
])

.directive('ngCustomHideModal', [
	'ModalBoxFactory',
	function (ModalBoxFactory) {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				elem.on('click', ModalBoxFactory.hide)
			}
		}
	}
])

// .directive('emailField', [
// 	function () {
// 		restrict: 'E',
// 		require: 'ngModel',
// 		scope: {
// 			ngModel: '=',
// 			options: '='
// 		},
		
// 	}
// ])
