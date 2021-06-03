sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("org.ubb.books.view.App", {

		formatDate:function(date){

			if (date != null)
				return date.slice(6,8)+'.'+date.slice(4,6)+'.'+date.slice(0,4);
		}

	});
});
