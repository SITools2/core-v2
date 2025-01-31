/*******************************************************************************
 * Copyright 2010-2016 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
 * 
 * This file is part of SITools2.
 * 
 * SITools2 is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * SITools2 is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * SITools2. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
/*global Ext, sitools, ID, i18n, document, showResponse, alertFailure, LOCALE, ImageChooser, loadUrl, extColModelToStorage, SitoolsDesk*/

Ext.namespace('sitools.user.component.datasets.services');

/**
 * service used to show the details of a specific record
 * 
 * @required datasetId
 * @required datasetUrl
 * @cfg {Ext.data.JsonStore} the store where nodes are saved
 * @class sitools.user.component.dataviews.services.addSelectionService
 * @extends Ext.Window
 */
//sitools.user.component.dataviews.services.viewDataDetailsService = {};

Ext.define('sitools.user.component.datasets.services.RecordDetailService', {
	extend : 'sitools.user.core.Component',
    alias : 'widget.recordDetailService',
    require : ['sitools.user.component.datasets.recordDetail.RecordDetailComponent'],
    
    statics : {
    	getParameters : function () {
    	    return [];
    	}
    },
    
	init : function (config) {
		
		var grid = config.dataview;
		var fromWhere = config.fromWhere;
		var urlRecords = grid.urlRecords;
		var datasetId = grid.dataset.id;
		var datasetUrl = grid.dataset.sitoolsAttachementForUsers;
		var datasetName = grid.dataset.name;
		var selections = grid.getSelections();
		
		if (Ext.isEmpty(selections) || selections.length === 0) {
			return popupMessage("", i18n.get('warning.noselection'), loadUrl.get('APP_URL') + '/common/res/images/msgBox/16/icon-info.png');;
		}
		
		var componentCfg = {
				baseUrl : urlRecords + "/",
				grid : grid,
				fromWhere : fromWhere,
				datasetId : datasetId,
				datasetName : datasetName,
				datasetUrl : datasetUrl,
				selections : selections,
				preferencesPath : "/" + datasetName,
				preferencesFileName : "dataDetails"
		};
		
	//    	    var windowConfig = {
	//    	        id : "dataDetail" + datasetId,
	//    	        title : i18n.get('label.viewDataDetail') + " : " + datasetName,
	//    	        datasetName : datasetName,
	//    	        saveToolbar : true,
	//    	        iconCls : "dataDetail",
	//    	        type : "dataDetail",
	//    	        shadow : true,
	//    	        shadowOffset : 5,
	//    	        toolbarItems : [ {
	//    	            iconCls : 'arrow-back',
	//    	            handler : function () {
	//    	                this.ownerCt.ownerCt.items.items[0].goPrevious();
	//    	            }
	//    	        }, {
	//    	            iconCls : 'arrow-next',
	//    	            handler : function () {
	//    	                this.ownerCt.ownerCt.items.items[0].goNext();
	//    	            }
	//    	        } ]
	//    	    };


		var userPersonalComponent = Ext.create('sitools.user.component.datasets.recordDetail.RecordDetailComponent');
		userPersonalComponent.create(this.getApplication());
		userPersonalComponent.init(componentCfg);
		
	}
});
