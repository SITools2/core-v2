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
Ext.namespace('sitools.admin.guiservices');

/**
 * A Panel to show project module properties from a specific project
 * 
 * @cfg {String} the url where get the resource
 * @cfg {String} the action to perform (modify or create)
 * @cfg {Ext.data.JsonStore} the store where get the record
 * @class sitools.admin.projects.modules.ProjectModuleProp
 * @extends Ext.Window
 */
Ext.define('sitools.admin.guiservices.GuiServicesProp', { 
    extend : 'Ext.Window',
    width : 700,
    height : 540,
    modal : true,
    id : ID.PROP.GUISERVICES,
    layout : 'fit',

    initComponent : function () {
        
        if (this.action === 'create') {
            this.title = i18n.get('label.createGuiService');
        } else if (this.action === 'modify') {
            this.title = i18n.get('label.modifyGuiService');
        }
        
        var comboSelectionType = Ext.create("Ext.form.ComboBox", {
            typeAhead : false,
            fieldLabel : i18n.get("label.selectionType"), 
            name : "dataSetSelection", 
            triggerAction : 'all',
            editable : false,
            queryMode : 'local',
            anchor : "100%",
            labelWidth : 150,
            emptyText: i18n.get("label.selectionTypeEmpty"),
            store : Ext.create("Ext.data.ArrayStore", {
                id : 0,
                fields : [ 'dataSetSelection' ],
                data : [ 
                    [ 'NONE' ],
                    [ 'SINGLE' ],
                    [ 'MULTIPLE' ],
                    [ 'ALL' ]]
            }),
            valueField : 'dataSetSelection',
            displayField : 'dataSetSelection'
        });
        
        this.formPanel = Ext.create("Ext.form.FormPanel", {
            border : false,
            bodyBorder : false,
            defaults : {
                labelWidth : 150
            },
            padding : 10,
            items : [ {
                    xtype : 'textfield',
                    name : 'id',
                    hidden : true
                }, {
                    xtype : 'textfield',
                    name : 'name',
                    fieldLabel : i18n.get('label.name'),
                    anchor : '100%', 
                    allowBlank : false
                }, {
                    xtype : 'textfield',
                    name : 'description',
                    fieldLabel : i18n.get('label.description'),
                    anchor : '100%', 
                    allowBlank : false
                }, {
                    xtype : 'textfield',
                    name : 'label',
                    fieldLabel : i18n.get('headers.label'),
                    anchor : '100%', 
                    allowBlank : false
                }, {
                    xtype : 'textfield',
                    name : 'author',
                    fieldLabel : i18n.get('label.author'),
                    anchor : '100%', 
                    allowBlank : false
                }, {
                    xtype : 'textfield',
                    name : 'version',
                    fieldLabel : i18n.get('label.version'),
                    anchor : '100%', 
                    allowBlank : false
                }, {
                    xtype : 'sitoolsSelectImage',
                    name : 'icon',
                    fieldLabel : i18n.get('label.icon'),
                    anchor : '100%', 
                    allowBlank : true
                }, {
                    xtype : 'textfield',
                    name : 'xtype',
                    fieldLabel : i18n.get('label.xtype'),
                    anchor : '100%', 
                    allowBlank : false
                }, comboSelectionType, {
                    xtype : 'numberfield',
                    name : 'priority',
                    id : 'priorityId', 
                    fieldLabel : i18n.get('label.priority'),
                    minValue : 0,
                    maxValue : 10,
                    allowDecimals : false,
                    incrementValue : 1,
                    accelerate : true,
                    anchor : "50%", 
                    allowBlank : false
                }, {
                    xtype : 'checkbox',
                    name : 'defaultGuiService',
                    fieldLabel : i18n.get('label.isDefault'),
                    anchor : '95%',
                    maxLength : 100
                }, {
                    xtype : 'checkbox',
                    name : 'defaultVisibility',
                    fieldLabel : i18n.get('label.defaultVisibilty'),
                    anchor : '95%',
                    maxLength : 100                    
                }
            ]
        });
            
        
        this.items = [this.formPanel];

        this.buttons = [ {
            text : i18n.get('label.ok'),
            scope : this,
            handler : this._onValidate
        }, {
            text : i18n.get('label.cancel'),
            scope : this,
            handler : function () {
                this.close();
            }
        }];

        this.callParent(arguments);
    },
    
    /**
     * done a specific render to load project modules properties. 
     */
    afterRender : function () {
        this.callParent(arguments);
        if (this.action === 'modify') {
            var f = this.formPanel.getForm();
            
            var record = this.store.getById(this.recordId);
            var data = record.data;
            
            f.setValues(data);
        }

        this.getEl().on('keyup', function (e) {
            if (e.getKey() == e.ENTER) {
                this._onValidate();
            }
        }, this);
    },

    /**
     * Save project modules properties for a specific project module
     */
    _onValidate : function () {
        var frm = this.formPanel.getForm();
        if (!frm.isValid()) {
            Ext.Msg.alert(i18n.get('label.warning'), i18n.get('warning.invalidForm'));
            return;
        }
        var jsonObject = frm.getFieldValues();
            
        if (this.action === "modify") {
			this.store.updateRecord(jsonObject);
		} else {
			this.store.saveRecord(jsonObject);
		}
        this.close();
    }

});