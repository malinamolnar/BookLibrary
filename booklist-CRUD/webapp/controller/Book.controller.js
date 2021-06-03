sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/resource/ResourceModel"
], function (Controller, JSONModel, MessageToast, ResourceModel) {
	"use strict";

	return Controller.extend("org.ubb.books.view.App", {


		handleDelete: function(oEvent){

			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("deleteMessage", [sRecipient]);
			var sMsgFailed = oBundle.getText("deleteMessageFailed", [sRecipient]);

			var sBookPath= oEvent.getParameter('listItem').getBindingContext().getPath();
			this.getView().getModel().remove(sBookPath,{
				success: function(){
					MessageToast.show(sMsg);
				},
                error: function(){
                    MessageToast.show(sMsgFailed);
                }
			})
		},

	
		onInit : function () {
			var oMessageManager = sap.ui.getCore().getMessageManager(),
				oMessageModel = oMessageManager.getMessageModel(),
				oMessageModelBinding = oMessageModel.bindList("/", undefined, []),
				oViewModel = new JSONModel({
					busy : false,
					hasUIChanges : false,
					usernameEmpty : true,
					order : 0
				});
			this.getView().setModel(oViewModel, "a");
			this._bTechnicalErrors = false;

            var i18nModel = new ResourceModel({
                bundleName: "org.ubb.books.i18n.i18n"
             });
             this.getView().setModel(i18nModel, "i18n");
        
},

		onCreate : function () {
			var oData;
			var oView=this.getView();
			var oModel = oView.getModel();

			oData={
			Isbn :    this.getView().byId("inIsbn").getValue(),
			Author : this.getView().byId("inAuthor").getValue(),
			Title : this.getView().byId("inTitle").getValue(),
			DatePublished : this.getView().byId("inDatePublished").getDateValue(),
			Language:this.getView().byId("inLanguage").getValue(),
			TotalNrBooks: parseInt(this.getView().byId("inTotalNrBooks").getValue()),
			AvailableNrBooks:parseInt(this.getView().byId("inAvailableNrBooks").getValue())
			};

			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("addMessage", [sRecipient]);
			var sMsgFailed = oBundle.getText("addMessageFailed", [sRecipient]);


			oView.setBusy(true);
			oModel.create("/Z801BOOKS_MMSet", oData, {
				success: function(oResponseData){
				MessageToast.show(sMsg);
					oView.setBusy(false);
				}.bind(this),
				error: function(){
					MessageToast.show(sMsgFailed);
					oView.setBusy(false);
				}
			});

		},

		onInputNrChange: function(oEvent){
			var value = oEvent.getSource().getValue();
			var bindingContext = oEvent.getSource().getBindingContext().getPath();
			this.getView().getModel().setProperty(bindingContext+"/AvailableNrBooks",parseInt(value));
		},

		onSave : function () {

			var oView= this.getView();
            var oModel=oView.getModel();
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("updateMessage", [sRecipient]);
			var sMsgFailed = oBundle.getText("updateMessageFailed", [sRecipient]);

            oModel.submitChanges({
                success: jQuery.proxy(function(){
                    MessageToast.show(sMsg);
                }),
                error: jQuery.proxy(function(){
                    MessageToast.show(sMsgFailed);
                    oView.setBusy(false);
                })
            });
        },

		handleChange: function (oEvent) {
			var oText = this.byId("textResult"),
				oDP = oEvent.getSource(),
				sValue = oEvent.getParameter("value"),
				bValid = oEvent.getParameter("valid");

			this._iEvent++;
			oText.setText("Change - Event " + this._iEvent + ": DatePicker " + oDP.getId() + ":" + sValue);

			if (bValid) {
				oDP.setValueState(ValueState.None);
			} else {
				oDP.setValueState(ValueState.Error);
			}
		},


		_setBusy : function (bIsBusy) {
			var oModel = this.getView().getModel("appView");
			oModel.setProperty("/busy", bIsBusy);
		}
		
				// _setUIChanges : function (bHasUIChanges) {
		// 	if (this._bTechnicalErrors) {
		// 		// If there is currently a technical error, then force 'true'.
		// 		bHasUIChanges = true;
		// 	} else if (bHasUIChanges === undefined) {
		// 		bHasUIChanges = this.getView().getModel().hasPendingChanges();
		// 	}
		// 	var oModel = this.getView().getModel("appView");
		// 	oModel.setProperty("/hasUIChanges", bHasUIChanges);
		// },

	});
});