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
 showHelp*/
Ext.namespace('sitools.admin.datasets');

/**
 * the Window used to edit or add a new table on the sql Join Wizard Panel.
 * @cfg {String} datasetId (required) the datasetId
 * @cfg {Ext.grid.GridPanel} datasetSelectTables (required) the Panel that displays all Tables
 * @cfg {String} action (required) Should be 'create' or 'modify'
 * @class sitools.admin.datasets.JoinTableWin
 * @extends Ext.Window
 */
Ext.define('sitools.admin.datasets.JoinTableWin', { 
    extend : 'Ext.Window',
    width : 350,
    height : ADMIN_PANEL_HEIGHT, 
    modal : true,
    closable : false,
	layout : "fit", 
    initComponent : function () {
        this.title = i18n.get('label.tables');
        
        /**
         * The store that contains the tables of a Dataset.
         * @type Ext.grid.ColumnModel
         */
        var store = Ext.create('sitools.widget.JsonStore', {
            id : 'storeTablesDataset',
            fields : [ {
                name : 'id',
                type : 'string'
            }, {
                name : 'name',
                type : 'string'
            }, {
                name : 'alias',
                type : 'string'
            }, {
                name : 'schemaName',
                type : 'string'
            }

            ]
        });
        
        store.add(this.datasetSelectTables.getStoreSelectedTables().data.items);
        

        this.grid = Ext.create('Ext.grid.GridPanel', {
			layout : 'fit', 
            store : store,
            forceFit : true,
            columns : [{
                id : 'name',
                header : i18n.get('headers.name'),
                width : 160,
                sortable : true,
                dataIndex : 'name'
            }, {
                id : 'alias',
                header : i18n.get('headers.tableAlias'),
                width : 80,
                sortable : true,
                dataIndex : 'alias',
                editor : Ext.create("Ext.form.TextField", {
                    disabled : this.action == 'view' ? true : false
                })
            }],
            selModel : Ext.create('Ext.selection.RowModel', {
				mode : 'SINGLE'
			}), 
			autoScroll : true,
            enableDragDrop : false,
            stripeRows : true,
            title : 'Tables Dataset'
		});
        
        this.items = [this.grid];
        
		this.buttons = [{
            text : i18n.get('label.ok'),
            handler : this._onOK, 
            scope : this
        }, {
            text : i18n.get('label.cancel'),
            handler : this._onCancel, 
            scope : this
        } ];
        // this.relayEvents(this.store, ['destroy', 'save', 'update']);
        sitools.admin.datasets.JoinTableWin.superclass.initComponent.call(this);
    },

    /**
     * Called when button Ok is pressed
     * Depending on action mode, it could edit the root node, edit a node, or add new node.
     */
    _onOK : function () {
        var table = this.grid.getSelectionModel().getSelection()[0];
        if(!Ext.isEmpty(table)) {
	        if (this.mode == 'edit') {
	            this.node.set('text', this.typeJointure + " " + table.data.name);
	            this.node.set("table",{
					alias : table.data.alias,
					name : table.data.name,
					schema : table.data.schemaName
	            });
                this.destroy();
	            
	        } else if (this.mode == "edit-root") {
	            this.node.set('text', table.data.name);
	            this.node.set("table", {
	                alias : table.data.alias,
	                name : table.data.name,
	                schema : table.data.schemaName
	            });
                this.destroy();
	
	        } else {
	            var newNode = {
	                text : this.typeJointure + " " + table.data.name, 
	                typeJointure : this.typeJointure, 
	                type : "table", 
	                table : {
						name : table.data.name,
						alias : table.data.alias,
						schema : table.data.schemaName
	                }, 
	                leaf : false, 
	                children : []
	            };
	            if (!this.node.isExpanded()) {
	                this.node.expand();
	            }
	            this.node.appendChild(newNode);
                this.destroy();
	        }
        } else {
            Ext.Msg.alert(i18n.get('label.warning'), i18n.get('warning.noselection'));  
            return;
        }        
    },

    /**
     * Close this window.
     */
    _onCancel : function () {
        this.destroy();
    }

});
