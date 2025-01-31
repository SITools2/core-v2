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
Ext.namespace('sitools.admin.usergroups');

/**
 * A Panel role data from a specific role
 * 
 * @cfg {String} the url where get the role
 * @cfg {String} the action to perform
 * @cfg {Ext.data.JsonStore} the store where saved the roles data
 * @class sitools.admin.usergroups.RoleProp
 * @extends Ext.Window
 */
Ext.define('sitools.admin.usergroups.RoleProp', { 
    extend : 'Ext.Window', 
	alias : 'widget.s-roleprop',
    width : 700,
    height : 480,
    modal : true,
    layout : 'fit',

    initComponent : function () {
//        if (this.action == 'modify') {
//            this.title = i18n.get('label.modifyRole');
//        } else {
//            this.title = i18n.get('label.createRole');
//        }
        this.title = i18n.get('label.roleInfo');

        this.items = [ {
            xtype : 'panel',
            height : 450,
//            title : i18n.get('label.roleInfo'),
            items : [{
                xtype : 'form',
                border : false,
                padding : 10,
                items : [ {
                    xtype : 'hidden',
                    name : 'id',
                    fieldLabel : i18n.get('label.id'),
                    anchor : '100%'
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
                    growMax : 400
                }]
            }]
        }];
        
        this.buttons = [{
            id : ID.ITEM.OKBUTTON,
            text : i18n.get('label.ok'),
            scope : this,
            handler : this.onModify
        }, {
            id : ID.ITEM.CANCELBUTTON,
            text : i18n.get('label.cancel'),
            scope : this,
            handler : function () {
                this.close();
            }
        }];
        
        sitools.admin.usergroups.RoleProp.superclass.initComponent.call(this);
    },

    getRoleAsJson : function() {
    	var f = this.down('form').getForm();
    	if (!f.isValid()) {
    		return null;
    	}
    	return f.getValues();
    },
    
    
    /**
     * Action to perform on the button handler (modify or create)
     */
    onModify : function () {
        var jsonRole = this.getRoleAsJson();
        if(jsonRole==null){
            Ext.Msg.alert(i18n.get('label.error'), i18n.get('warning.invalidForm'));
            return;
        }

        var method;
        if (this.action == 'modify') {
        	method = "PUT";
        }else {
        	method = "POST";
        }
        	
        Ext.Ajax.request({
            url : this.url,
            method : method,
            scope : this,
            jsonData : jsonRole,
            success : function (ret) {
                var Json = Ext.decode(ret.responseText);
                if (Json.success) {
                    this.store.reload();
                    this.close();
                } else {
                    Ext.Msg.alert(i18n.get('label.warning'), Json.message);
                }
            },
            failure : alertFailure
        });

    },

    /**
     * done a specific render to load role data from the store. 
     */ 
    onRender : function () {
        this.callParent(arguments);
        if (this.url) {
            var f = this.down('form').getForm();
            if (this.action == 'modify') {
                Ext.Ajax.request({
                    url : this.url,
                    method : 'GET',
                    scope : this,
                    success : function (ret) {
                        var data = Ext.decode(ret.responseText);
                        if (data.success) {
                            f.setValues(data.role);
                        } else {
                            this.close();
                            Ext.Msg.alert(i18n.get('label.warning'), data.message);
                            return;
                        }
                    },
                    failure : alertFailure
                });
            }
        }

        this.getEl().on('keyup', function (e) {
            if (e.getKey() == e.ENTER) {
                this.onModify();
            }
        }, this);
    }

});

