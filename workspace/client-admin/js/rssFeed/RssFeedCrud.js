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
Ext.namespace('sitools.admin.rssFeed');

/**
 * Generic component to create RssFeed Can be used for DataSets, Projects or
 * archive Parameters :
 * 
 * @cfg : url , the url to get the list of DataSets, Projects or archive
 * @cfg : label , the label to display ( Select DataSet ... )
 * @cfg : urlRef , the relative url of the RSS API
 * @class sitools.admin.rssFeed.RssFeedCrud
 * @extends Ext.grid.GridPanel
 */
Ext.define('sitools.admin.rssFeed.RssFeedCrud', { 
    extend : 'Ext.grid.Panel',
	alias : 'widget.s-rssFeedCrud',
    border : false,
    pageSize : ADMIN_PANEL_NB_ELEMENTS,
    modify : false,
    forceFit : "true",
    id : ID.BOX.RSSFEED,

    requires : ['sitools.admin.rssFeed.RssFeedProp'],
    
    initComponent : function () {

        this.store = Ext.create('Ext.data.JsonStore', {
            pageSize : this.pageSize,
            proxy : {
                type : 'ajax',
                url : "/tmp",
                reader : {
                    type : 'json',
                    root : 'data',
                    idProperty : 'id'
                }
            },
            fields : [ {
                name : 'id',
                type : 'string'
            }, {
                name : 'title',
                type : 'string'
            }, {
                name : 'description',
                type : 'string'
            }, {
                name : 'link',
                type : 'string'
            }, {
                name : 'feedType',
                type : 'string'
            }, {
                name : 'feedSource',
                type : 'string'
            }, {
                name : 'name',
                type : 'string'
            } ]
        });

        var storeCombo = Ext.create('Ext.data.JsonStore', {
            autoLoad : true,
            fields : ['id', 'name', 'type'],
            pageSize: 10,
            proxy : {
                type : 'ajax',
                url : this.url,
                reader : {
                    type : 'json',
                    root : "data"
                }
            },
            listeners : {
            	scope : this,
            	load : function (store, records) {
            			record = this.combobox.getStore().getAt(0);
            			if (!Ext.isEmpty(record)) {
	            			this.combobox.setValue(record.get(this.combobox.valueField), true);
	            			this.combobox.fireEvent('select', this.combobox, [record]);
            			}
            	}
            }
        });

        this.combobox = Ext.create('Ext.form.field.ComboBox', {
            store : storeCombo,
            width: 268,
            displayField: 'name',
            valueField: 'id',
            minChars: 0,
            forceSelection: true,
            triggerAction: 'query',
            pageSize: true,
            emptyText: i18n.get('label.selectOrSearch'),
            listeners : {
                scope : this,
                render: function (combo) {
                    combo.triggerEl.on('click', function () {
                        if (!Ext.isEmpty(combo.getValue())) {
                            var record = combo.getStore().getById(combo.getValue());
                            if (!Ext.isEmpty(combo.tmpValue)) {
                                if (combo.tmpValue.get('id') != combo.getValue()) {
                                    combo.tmpValue = record;
                                }
                            } else {
                                combo.tmpValue = record;
                            }
                        }
                        combo.clearValue();
                    }, combo);
                },
                blur: function (combo) {
                    if (Ext.isEmpty(combo.getValue())) {
                        combo.setValue(combo.tmpValue);
                    }
                },
                select : function (combo, rec, index) {
                    this.dataId = rec[0].data.id;

                    combo.tmpValue = rec[0];

                    this.loadRss();
                }
            }
        });

        this.columns = {
            defaults : {
                sortable : true
            },
            items : [{
                header : i18n.get('label.name'),
                dataIndex : 'name',
                width : 100,
                renderer : function (value, meta, record) {
                    meta.style = "font-weight: bold;";
                    return value;
                }
            }, {
                header : i18n.get('label.titleRss'),
                dataIndex : 'title',
                width : 150
            }, {
                header : i18n.get('label.description'),
                dataIndex : 'description',
                width : 200
            }, {
                header : i18n.get('label.linkTitle'),
                dataIndex : 'link',
                width : 200
            }, {
                header : i18n.get('headers.type'),
                dataIndex : 'feedType',
                width : 50
            }, {
                header : i18n.get('headers.feedSource'),
                dataIndex : 'feedSource',
                width : 100
            }]
        };

        this.tbar = [this.combobox, {
            text : i18n.get('label.add'),
            icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/toolbar_create.png',
            scope : this,
            handler : this.onCreate,
            xtype : 's-menuButton'
        }, {
            text : i18n.get('label.modify'),
            icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/toolbar_edit.png',
            scope : this,
            handler : this.onModify,
            xtype : 's-menuButton'
        }, {
            text : i18n.get('label.delete'),
            icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/toolbar_delete.png',
            scope : this,
            handler : this.onDelete,
            xtype : 's-menuButton'
        }, '->', {
            xtype : 's-filter',
            emptyText : i18n.get('label.search'),
            store : this.store,
            pageSize : this.pageSize,
            id : "s-filter"
        }];

        this.bbar = {
            xtype : 'pagingtoolbar',
            store : this.store,
            displayInfo : true,
            displayMsg : i18n.get('paging.display'),
            emptyMsg : i18n.get('paging.empty')
        };

        this.listeners = {
            scope : this, 
            itemdblclick : this.onModify
        };
        
        this.selModel = Ext.create('Ext.selection.RowModel', {
            mode : "SINGLE"
        });
        
        this.callParent(arguments);

    },
    
    afterRender : function () {
        this.callParent(arguments);
        this.combobox.getStore().load();
    	
    },

    /**
     * Load the rss feeds of the selected dataset in the comboBox
     */
    loadRss : function () {

        var urlRss = this.url + "/" + this.dataId + this.urlRef;
        this.store.getProxy().url = urlRss;
        this.store.load({
            scope : this,
            callback : function () {
                this.getView().refresh();
            }
        });
    },

    /**
     * Open a {sitools.admin.rssFeed.RssFeedProp} rss property window
     *  to create a new rss feed for the selected dataset
     */
    onCreate : function () {
        if (Ext.isEmpty(this.combobox.getValue())) {
            return;
        }
        var up = Ext.create('sitools.admin.rssFeed.RssFeedProp', {
            action : 'create',
            store : this.store,
            id : this.dataId,
            url : this.url,
            urlRef : this.urlRef
        });
        up.show(ID.BOX.RSSFEED);
    },

    /**
     * Open a {sitools.admin.rssFeed.RssFeedProp} rss property window
     *  to modify an existing rss feed
     */
    onModify : function () {
        var rec = this.getSelectionModel().getSelection()[0];
        if (!rec) {
            return popupMessage("", i18n.get('warning.noselection'), loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/msgBox/16/icon-info.png');;
        }

        var up = Ext.create('sitools.admin.rssFeed.RssFeedProp', {
            action : 'modify',
            store : this.store,
            id : this.dataId,
            url : this.url,
            urlRef : this.urlRef,
            idFeed : rec.data.id
        });
        up.show(ID.BOX.RSSFEED);
    },

    /**
     * Diplay confirm delete Msg box and call the method doDelete
     */
    onDelete : function () {
        var rec = this.getSelectionModel().getSelection()[0];
        if (!rec) {
            return false;
        }
        Ext.Msg.show({
            title : i18n.get('label.delete'),
            buttons : Ext.Msg.YESNO,
            msg : i18n.get('feedCrud.delete'),
            scope : this,
            fn : function (btn, text) {
                if (btn == 'yes') {
                    this.doDelete(rec);
                }
            }

        });

    },
    
    /**
     * done the delete of the passed record
     * @param rec the record to delete
     */
    doDelete : function (rec) {

        Ext.Ajax.request({
            url : this.url + "/" + this.dataId + this.urlRef + "/" + rec.data.id,
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

