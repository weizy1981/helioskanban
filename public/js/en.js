var PLEASE_WAIT = "Please wait...";
var LOADING_DATA = "Loading data...";
var INPUT_AJAX_UPLOAD_INVALID = "Invalid options.";
var INPUT_AJAX_UPLOAD_BLNAK = "The input file is blank!";
var SERVICE_FAILED = "Failed to get data from the service!";
var VALID_YEAR = "Please input a valid year number between 1900 and 9999!";
var ERROR_500 = "Internal server error!";

/**
 * For JSCal2, version 1.7 For the other language, you just need replace
 * function body
 */
function initCalendar() {
	Calendar.LANG("en", "English", {
		fdow : 1, // first day of week for this locale; 0 = Sunday, 1 =Monday, etc.
		goToday : "Go Today",
		today : "Today", // appears in bottom bar
		wk : "wk",
		weekend : "0,6", // 0 = Sunday, 1 = Monday, etc.
		AM : "am",
		PM : "pm",
		mn : [ "January", "February", "March", "April", "May", "June", "July",
				"August", "September", "October", "November", "December" ],

		smn : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
				"Oct", "Nov", "Dec" ],

		dn : [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
				"Friday", "Saturday", "Sunday" ],

		sdn : [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su" ]
	});
}
