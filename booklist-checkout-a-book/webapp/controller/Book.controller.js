sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType"
], function (Controller, JSONModel, MessageToast, ResourceModel, Filter, FilterOperator, FilterType) {
	"use strict";

	return Controller.extend("org.ubb.books.view.App", {

		formatDate:function(date){

			if (date != null)
				return date.slice(6,8)+'.'+date.slice(4,6)+'.'+date.slice(0,4);
		},
		onInit : function () {
            var oJSONData = {
				busy : false,
				order : 0
			};
			var oModel = new JSONModel(oJSONData);
			this.getView().setModel(oModel, "appView");	

        },

		checkoutBook: function () {

			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("bookCheckOutMessage", [sRecipient]);
			var sMsgFailed = oBundle.getText("failedBookCheckOutMessage", [sRecipient]);
			var sMsgNotPossible = oBundle.getText("notPossibleBookCheckOutMessage", [sRecipient]);

            var items = this.getView().byId("idBooksTable").getSelectedItems();
            var oData;
            var oView=this.getView();
            var oModel = oView.getModel();
            for (var i = 0; i < items.length; i++) {

                var item = items[i];

                var context = item.getBindingContext();

                var obj = context.getProperty(null, context);
				if (obj.AvailableNrBooks == 0)
					MessageToast.show(sMsgNotPossible);
				else{
                oData= {
                        Isbn: obj.Isbn,
                        Author: obj.Author,
                        Title: obj.Title,
                        DatePublished: obj.DatePublished,
                        Language: obj.Language,
                        TotalNrBooks: obj.TotalNrBooks,
                        AvailableNrBooks: obj.AvailableNrBooks
                    };
                    oModel.create("/SEARCHBOOK_MMSet", oData, {
                        success: function(oResponseData){
                        	MessageToast.show(sMsg);
                        }.bind(this),
                        error: function(){
                        	MessageToast.show(sMsgFailed);
                        }
                    });
                }
				}
    		},

		onResetChanges : function () {
			this.byId("idBooksTable").getBinding("items").resetChanges();
			this._bTechnicalErrors = false; // If there were technical errors, cancelling changes resets them.
			this._setUIChanges(false);
		},

		onSearch : function () {
			var oFilters = [];
	
			var oView = this.getView(),
				titleValue = oView.byId("searchTitle").getValue(),
				authorValue = oView.byId("searchAuthor").getValue(),
				isbnValue = oView.byId("searchId").getValue(),
				dateValue = oView.byId("searchDate").getValue(),
				languageValue = oView.byId("searchLanguage").getValue(),
				oFilterTitle = new Filter("Title", FilterOperator.Contains, titleValue),
				oFilterAuthor = new Filter("Author", FilterOperator.Contains, authorValue),
				oFilterIsbn = new Filter("Isbn", FilterOperator.Contains, isbnValue),
				oFilterDate = new Filter("DatePublished", FilterOperator.EQ, dateValue),
				oFilterLanguage = new Filter("Language", FilterOperator.EQ, languageValue);

				if (languageValue == 'RO'){
					languageValue = '4';
					oFilterLanguage = new Filter("Language", FilterOperator.EQ, languageValue);
				}

				if (languageValue == 'EN'){
					languageValue = 'E';
					oFilterLanguage = new Filter("Language", FilterOperator.EQ, languageValue);
				}
					
				if (authorValue.length != 0){
	
					oFilters.push(oFilterAuthor);
	
				}
	
				if (titleValue.length != 0){
	
					oFilters.push(oFilterTitle);
				}
	
				if (isbnValue.length != 0){
	
					oFilters.push(oFilterIsbn);
				}
	
				if (languageValue.length != 0){
	
					oFilters.push(oFilterLanguage);
				}
				if (dateValue != null && dateValue!=""){
	
					oFilters.push(oFilterDate);
				}
				
				if (languageValue.length != 0){

					oFilters.push(oFilterLanguage);
				}

			oView.byId("idBooksTable").getBinding("items").filter(oFilters);
	
	
		},
	
		onSort : function () {
			var oView = this.getView(),
				aStates = [undefined, "asc", "desc"],
				aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
				sMessage,
				iOrder = oView.getModel("appView").getProperty("/order");

			iOrder = (iOrder + 1) % aStates.length;
			var sOrder = aStates[iOrder];

			oView.getModel("appView").setProperty("/order", iOrder);
			oView.byId("idBooksTable").getBinding("items").sort(sOrder && new Sorter("Title", sOrder === "desc"));

			sMessage = this._getText("sortMessage", [this._getText(aStateTextIds[iOrder])]);
			MessageToast.show(sMessage);
		}


	});
});