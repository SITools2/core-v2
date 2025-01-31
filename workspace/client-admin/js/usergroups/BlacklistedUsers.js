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
Ext.define('sitools.admin.usergroups.BlacklistedUsers', {
    extend : 'Ext.window.Window',
    alias : 'widget.s-blacklistedusers',
    // url + mode + storeref
    mixins : {
        utils : 'sitools.admin.utils.utils'
    },
    width : 700,
    modal : true,
    pageSize : ADMIN_PANEL_NB_ELEMENTS,
    height : 480,
    layout : 'fit',
    border : false,
    bodyBorder : false,

    initComponent : function () {
        this.title = i18n.get("title.blacklistedUsers");
        
        this.store = Ext.create("Ext.data.JsonStore", {
            proxy : {
                type : 'ajax',
                url : this.url,
                reader : {
                    type : 'json',
                    root : 'data',
                    idProperty : 'identifier'
                        
                }
            },
            fields : [ {
                name : 'id',
                type : 'string'
            }, {
                name : 'username',
                type : 'string'
            }, {
                name : 'ipAddress',
                type : 'string'
            }, {
                name : 'date',
                type : 'date',
                dateFormat : SITOOLS_DATE_FORMAT
            }, {
                name : 'userExists',
                type : 'boolean'
            } ]
        });
        
        this.grid = Ext.create("Ext.grid.GridPanel", {
            forceFit : true,
            layout : 'fit',
            border : false,
            sm : Ext.create('Ext.selection.RowModel', {
                mode : 'SINGLE'
            }),
            store : this.store,
            padding : 10,
            columns : [ {
                header : i18n.get('label.login'),
                dataIndex : 'username'
            }, {
                header : i18n.get('label.ipAddress'),
                dataIndex : 'ipAddress'
            }, {
                header : i18n.get('headers.date'),
                dataIndex : 'date',
                format : SITOOLS_DEFAULT_IHM_DATE_FORMAT,
                xtype : 'datecolumn'
            }, {
                header : i18n.get('label.userExists'),
                dataIndex : 'userExists',
                renderer : function (value, metadata, record, rowIndex, colIndex, store) {
                    if (value) {
                        metadata.style += "font-weight:bold; color:green;";
                    } else {
                        metadata.style += "font-weight:bold; color:red;";
                    }
                    return value;
                }
                    
            } ],
            bbar : {
                xtype : 'pagingtoolbar',
                pageSize : this.pageSize,
                store : this.store,
                displayInfo : true,
                displayMsg : i18n.get('paging.display'),
                emptyMsg : i18n.get('paging.empty')
            }
        });
        this.items = [ this.grid ];
        this.tbar = {
                xtype : 'toolbar',
                border : false,
                defaults : {
                    scope : this
                },
                items : [ {
                    text : i18n.get('label.unlockAccount'),
                    icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/unlocked_user.png',
                    handler : this._onRemoveFromBlacklist
                }, '->', {
                    xtype : 's-filter',
                    hidden : this.mode == 'list',
                    emptyText : i18n.get('label.search'),
                    store : this.store,
                    pageSize : this.pageSize
                } ]
            };
        
            this.buttons = [{
                text : i18n.get('label.close'),
                scope : this,
                handler : this.destroy
            }];
        this.callParent(arguments);
    },

    /**
     * done a specific render to load users from the store. 
     */ 
    afterRender : function () {
        this.callParent(arguments);
        this.store.load({
            scope : this,
            params : {
                start : 0,
                limit : this.pageSize
            }
        });
    },
    
    _onRemoveFromBlacklist : function () {
        var rec = this.getLastSelectedRecord(this.grid);
        if (!rec) {
            return false;
        }
        Ext.Ajax.request({
            url : this.url + "/" + rec.get("id"),
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