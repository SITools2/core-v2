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
Ext.namespace('sitools.admin.usergroups');

/**
 * A Panel retrieving sitools2 users
 * 
 * @cfg {String} the mode (select or list) to load roles
 * @cfg {String} the url where get the selected user property
 * @cfg {Ext.form.TextField} the user field
 * @cfg {Ext.form.Field} the value of the user field
 * @class sitools.admin.usergroups.UsersPanel
 * @extends Ext.Window
 */
Ext.define('sitools.admin.usergroups.UsersPanel', { 
    extend : 'Ext.Window', 
	alias : 'widget.s-users',
    width : 500,
    height : 350,
    modal : true,
    closable : false,
    pageSize : ADMIN_PANEL_NB_ELEMENTS,
    layout : 'fit',
    mixins : {
        utils : 'sitools.admin.utils.utils'
    },

    initComponent : function () {
        
        this.title = this.mode == 'list' ? i18n.get('label.members') : i18n.get('label.selectUsers');

        this.store = Ext.create('Ext.data.JsonStore', {
            pageSize : this.pageSize,
            proxy : {
                type : 'ajax',
                url : this.url,
                reader : {
                    type : 'json',
                    root : 'data',
                    idProperty : 'identifier'
                }
            },
            fields : [{
                name : 'identifier',
                type : 'string'
            }, {
                name : 'firstName',
                type : 'string'
            }, {
                name : 'lastName',
                type : 'string'
            }]
        });
        
        this.grid = Ext.create('Ext.grid.Panel', {
            selModel : Ext.create('Ext.selection.RowModel', {
                mode : 'MULTI'
            }),
            store : this.store,
            height : 200,
            forceFit : true,
            tbar : {
                xtype : 'toolbar',
                defaults : {
                    scope : this,
                    hidden : true
                },
                items : [{
                    text : i18n.get('label.add'),
                    hidden : (this.mode == 'select' || this.mode == 'selectUnique'),
                    icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/toolbar_create.png',
                    handler : this._onCreate
                }, {
                    text : i18n.get('label.remove'),
                    hidden : (this.mode == 'select' || this.mode == 'selectUnique'),
                    icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/toolbar_delete.png',
                    handler : this._onDelete
                }, '->', {
                    xtype : 's-filter',
                    hidden : this.mode == 'list',
                    emptyText : i18n.get('label.search'),
                    store : this.store,
                    pageSize : this.pageSize
                }]
            },
            columns : [{
                header : i18n.get('label.login'),
                dataIndex : 'identifier'
            }, {
                header : i18n.get('label.firstName'),
                dataIndex : 'firstName'
            }, {
                header : i18n.get('label.lastName'),
                dataIndex : 'lastName'
            }],
            bbar : {
                xtype : 'pagingtoolbar',
                store : this.store,
                displayInfo : true,
                displayMsg : i18n.get('paging.display'),
                emptyMsg : i18n.get('paging.empty')
            }
        });
        
        this.items = [this.grid];
        
        this.buttons = [{
            text : i18n.get('label.ok'),
            scope : this,
            handler : this._onAdd,
            hidden : this.mode == 'list'
        }, {
            text : i18n.get('label.ok'),
            scope : this,
            handler : this._onOK,
            hidden : (this.mode == 'select' || this.mode == 'selectUnique')
        }, {
            text : i18n.get('label.cancel'),
            scope : this,
            handler : this._onCancel
        }];
        
        this.callParent(arguments);
    },

    /**
     * done a specific render to load users from the store. 
     */ 
    onRender : function () {
        this.callParent(arguments);
        this.store.load({
            params : {
                start : 0,
                limit : this.pageSize
            },
            callback : function (r, options, success) {
                if (!success) {
                    this.close();
                    Ext.Msg.alert(i18n.get('label.warning'), i18n.get('label.loadError'));
                }
            }
        });

        this.getEl().on('keyup', function (e) {
            if (e.getKey() == e.ENTER) {
                this._onOK();
            }
        }, this);
    },

    /**
     * Create a new {sitools.admin.usergroups.UsersPanel} users panel and display all users
     */
    _onCreate : function () {
        var up = new sitools.admin.usergroups.UsersPanel({
            mode : 'select',
            url : loadUrl.get('APP_URL') + loadUrl.get('APP_SECURITY_URL') + '/users?media=json',
            storeref : this.store
        });
        up.show(this);
    },

    /**
     * Delete the selected user from the store
     */
    _onDelete : function () {
        var recs = this.grid.getSelectionModel().getSelection();
        if (!recs) {
            return popupMessage("", i18n.get('warning.noselection'), loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/msgBox/16/icon-info.png');
        }
        this.store.remove(recs);
    },

    /**
     * Gets the selected users and add them to the list users of the current parent object
     */
    _onAdd : function () { // sub window -> no action
        if (this.mode == "select") {
            var recs = this.grid.getSelectionModel().getSelection();
            var newrecs = [];
            Ext.each(recs, function (rec) {
                newrecs.push({
                    identifier : rec.data.identifier,
                    firstName : rec.data.firstName,
                    lastName : rec.data.lastName
                });
            });
            this.storeref.add(newrecs);
        }
        if (this.mode == "selectUnique") {
//            var rec = this.getLastSelectedRecord();
            var rec = this.grid.getSelectionModel().getSelection()[0];
            this.displayField.setValue(rec.data.firstName + " " + rec.data.lastName);
            this.valueField.setValue(rec.data.identifier);
        }
        this.close();
    },

    /**
     * Save the user of the current parent object
     */
    _onOK : function () {
        var putObject = this.getPutObject();
        Ext.Ajax.request({
            url : this.url,
            method : 'PUT',
            scope : this,
            jsonData : putObject,
            success : function (ret) {
                var data = Ext.decode(ret.responseText);
                if (!data.success) {
                    Ext.Msg.alert(i18n.get('label.warning'), i18n.get(data.message));
                    return false;
                }
                this.close();
                this.store.reload();
            },
            failure : alertFailure
        });
    },
    
    getPutObject : function () {
    	var putObject = this.data;
        putObject.users = [];
        this.store.each(function (record) {
            var resource = {
                id : record.data.identifier
            };
            putObject.users.push(resource);
        });
        return putObject;
    },
 
    /**
     * Destroy the {sitools.admin.usergroups.UsersPanel} users Panel
     */
    _onCancel : function () {
        this.destroy();
    }
});

