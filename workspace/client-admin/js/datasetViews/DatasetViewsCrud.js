/***************************************
* Copyright 2010-2016 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
* 
* This file is part of SITools2.
* 
* SITools2 is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* SITools2 is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with SITools2.  If not, see <http://www.gnu.org/licenses/>.
***************************************/
/*global Ext, sitools, ID, i18n, document, showResponse, alertFailure, LOCALE, ImageChooser, 
 showHelp, loadUrl*/
/*
 * @include "DatasetViewsProp.js"
 */
Ext.namespace('sitools.admin.datasetViews');

/**
 * A Panel to show the different datasetView available in Sitools2. 
 * @requires sitools.admin.datasetViews.DatasetViewsProp
 * @class sitools.admin.datasetViews.DatasetViewsCrud
 * @extends Ext.grid.GridPanel
 */
Ext.define('sitools.admin.datasetViews.DatasetViewsCrud', { 
    extend : 'Ext.grid.Panel',
	alias : 'widget.s-datasetView',
    border : false,
    height : ADMIN_PANEL_HEIGHT,
    id : ID.BOX.DATASETVIEW,
    pageSize : ADMIN_PANEL_NB_ELEMENTS,
    forceFit : true,
    mixins : {
        utils : "sitools.admin.utils.utils"
    },
    
    requires : ['sitools.admin.datasetViews.DatasetViewsProp'],

    initComponent : function () {
        this.url = loadUrl.get('APP_URL') + loadUrl.get('APP_DATASETS_VIEWS_URL');
        
        this.store = Ext.create("Ext.data.JsonStore", {
            pageSize : this.pageSize,
            proxy : {
                type : 'ajax',
                url : this.url,
                simpleSortMode : true,
                reader : {
                    type : 'json',
                    root : 'data',
                    idProperty : 'id'
                }
            },
            remoteSort : true,
            fields : [ {
                name : 'id',
                type : 'string'
            }, {
                name : 'name',
                type : 'string'
            }, {
                name : 'description',
                type : 'string'
            }, {
                name : 'jsObject',
                type : 'string'
            }, {
                name : 'fileUrl',
                type : 'string'
            }, {
                name : 'imageUrl',
                type : 'string'
            }, {
				name : "priority", 
				type : "integer"
            }]
        });

        this.columns = {
            // specify any defaults for each column
            defaults : {
                sortable : true
            // columns are not sortable by default
            },
            items : [ {
                header : i18n.get('label.name'),
                dataIndex : 'name',
                width : 230,
                sortable : true,
                renderer : function (value, meta, record) {
                    meta.style = "font-weight: bold;";
                    return value;
                }
            }, {
                header : i18n.get('label.description'),
                dataIndex : 'description',
                width : 300,
                sortable : false
            }, {
                header : i18n.get('label.jsObject'),
                dataIndex : 'jsObject',
                width : 340,
                sortable : false
            }, {
                header : i18n.get('label.priority'),
                dataIndex : 'priority',
                width : 70,
                sortable : true
            } ]
        };

        this.bbar = {
            xtype : 'pagingtoolbar',
            pageSize : this.pageSize,
            store : this.store,
            displayInfo : true,
            displayMsg : i18n.get('paging.display'),
            emptyMsg : i18n.get('paging.empty')
        };

        this.tbar = {
            xtype : 'toolbar',
            defaults : {
                scope : this
            },
            items : [ {
                text : i18n.get('label.create'),
                icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/toolbar_create.png',
                handler : this._onCreate,
                xtype : 's-menuButton'
            }, {
                text : i18n.get('label.modify'),
                icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/toolbar_edit.png',
                handler : this._onModify,
                xtype : 's-menuButton'
            }, {
                text : i18n.get('label.delete'),
                icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/toolbar_delete.png',
                handler : this._onDelete,
                xtype : 's-menuButton'
            }, '->', {
                xtype : 's-filter',
                emptyText : i18n.get('label.search'),
                store : this.store,
                pageSize : this.pageSize
            } ]
        };

        this.listeners = {
            scope : this, 
            itemdblclick : this._onModify
        };
        
        this.selModel = Ext.create('Ext.selection.RowModel', {
            mode : "SINGLE"
        });
        
        this.callParent(arguments);
    },

    onRender : function () {
        this.callParent(arguments);
        this.store.load({
            start : 0,
            limit : this.pageSize
        });
    },

    _onCreate : function () {
        var dbp = Ext.create("sitools.admin.datasetViews.DatasetViewsProp", {
            url : this.url,
            action : 'create',
            store : this.store
        });
        dbp.show(ID.PROP.DATASETVIEW);
    },

    _onModify : function () {
        var rec = this.getLastSelectedRecord();
        if (!rec) {
            return popupMessage("", i18n.get('warning.noselection'), loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/msgBox/16/icon-info.png');;
        }

        var dbp = Ext.create("sitools.admin.datasetViews.DatasetViewsProp", {
            url : this.url + '/' + rec.data.id,
            action : 'modify',
            store : this.store
        });
        dbp.show(ID.PROP.DATASETVIEW);
    },

    _onDelete : function () {
        var rec = this.getLastSelectedRecord();
        if (!rec) {
            return false;
        }

        Ext.Msg.show({
            title : i18n.get('label.delete'),
            buttons : Ext.Msg.YESNO,
            msg : Ext.String.format(i18n.get('datasetViewsCrud.delete'), rec.get('name')),
            scope : this,
            fn : function (btn, text) {
                if (btn == 'yes') {
                    this.doDelete(rec);
                }
            }

        });

    },
    doDelete : function (rec) {
        Ext.Ajax.request({
            url : this.url + "/" + rec.data.id,
            method : 'DELETE',
            scope : this,
            success : function (ret) {
                if (showResponse(ret)) {
                    this.store.reload();
                }
            },
            failure : alertFailure
        });
    }

});
