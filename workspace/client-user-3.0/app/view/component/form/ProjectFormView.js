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
/*global Ext, sitools, SITOOLS_DATE_FORMAT, SITOOLS_DEFAULT_IHM_DATE_FORMAT, i18n, userLogin, DEFAULT_WIN_HEIGHT, DEFAULT_WIN_WIDTH, getDesktop, projectGlobal, SitoolsDesk, DEFAULT_PREFERENCES_FOLDER, alertFailure*/
/*global loadUrl*/
/*
 * @include "formComponentsPanel.js"
 * @include "resultsProjectForm.js"
 */
Ext.namespace('sitools.user.view.component.form');

/**
 * The global Panel. A panel with a formComponentsPanel and the buttons. 
 * @cfg {string} formId Id of the selected Form
 * @cfg {string} formName Name of the selected Form 
 * @cfg {Array} formParameters Array of all form Parameters
 * @cfg {number} formWidth Form Width 
 * @cfg {number} formHeight Form Height 
 * @cfg {string} formCss Name of a specific css class to apply to form 
 * @cfg {Array} properties An array of Properties. 
 * @cfg {string} urlServicePropertiesSearch The url to request properties
 * @cfg {string} urlServiceDatasetSearch the url to request for Multids Search
 * @cfg {string} dictionaryName the Name of the dictionary attached to the form
 * @class sitools.user.component.forms.projectForm
 * @extends Ext.Panel
 * @requires sitools.user.component.formComponentsPanel
 */
Ext.define('sitools.user.view.component.form.ProjectFormView', {
    extend : 'Ext.panel.Panel',
    alias : 'widget.projectformview',
    border : false,
    bodyBorder : false,
    layout : {
        type : 'vbox',
        align : 'stretch'
    },

    initComponent : function () {

        this.height = this.formHeight;
        
        var panelIdObject = {};

        // New Form model with zones
        if (!Ext.isEmpty(this.formZones)) {
            Ext.each(this.formZones, function (formParam) {
//                var containerId = formParam.containerPanelId;
                var containerId = formParam.id;
                if (Ext.isEmpty(panelIdObject[containerId])) {
                    panelIdObject[containerId] = [];
                }
                panelIdObject[containerId].push(formParam);
            });
        } else { // old form model
            Ext.each(this.formParameters, function (formParam) {
                var containerId = formParam.containerPanelId;
                if (Ext.isEmpty(panelIdObject[containerId])) {
                    panelIdObject[containerId] = [];
                }
                panelIdObject[containerId].push(formParam);
            });
        }

        var items = [];
        var globalParams = {};

        Ext.iterate(panelIdObject, function (key, formParams) {
            var componentList = Ext.create('sitools.user.view.component.form.FormContainerView', {
                border : true,
                css : this.formCss,
                formId : this.formId,
                formWidth : this.formWidth,
                autoScroll: false
            });

            if (!Ext.isEmpty(this.formZones)) {
                globalParams.formZones = formParams;
            } else {
                globalParams.oldParameters = formParams;
            }

            componentList.loadParameters(globalParams, this.dataUrl, "dataset");
            items.push(componentList);
        }, this);

        /**
         * The panel that displays all form components as defined by the administrator. 
         */
        this.zonesPanel = Ext.create('Ext.panel.Panel', {
        	autoScroll : true,
            width : this.formWidth,
            height : this.formHeight,
            css : this.formCss,
            formId : this.formId,
            border : false,
            items : items
        });

        var displayComponentPanel = Ext.create('Ext.panel.Panel', {
            itemId : 'displayPanelId',
            title : i18n.get('label.formConcepts'),
            flex : 2,
            autoScroll : false,
            border : false,
            items : [this.zonesPanel],
            layout : "fit"
        });

        /**
         * The panel that displays Property search
         * Each property adds a formField with the buildPropertyField method
         */
        this.propertyPanel = Ext.create('Ext.form.Panel', {
            itemId : 'propertyPanelId',
            title : i18n.get("label.defineProperties"),
            labelWidth : 100,
            flex : 2,
            bodyPadding : 5,
            autoScroll : true,
            border : false,
            defaults : {
                labelSeparator : ""
            },
            buttons : {
                xtype: 'toolbar',
                style: 'background-color:white;',
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'middle'
                },
                items: [{
                    text: i18n.get('label.refreshDatasets'),
                    itemId: "refreshDatasets"
                }]
            }
        });
        if (!Ext.isEmpty(this.properties)) {
            Ext.each(this.properties, function (prop) {
                var field = this.buildPropertyField(prop);
                this.propertyPanel.add(field);
            }, this);
        }

        var project = Ext.getStore('ProjectStore').getProject();
        
        var storeDatasets = Ext.create('Ext.data.JsonStore', {
            autoLoad : true,
            proxy : {
                type : 'ajax',
                url : project.get('sitoolsAttachementForUsers') + this.urlServicePropertiesSearch,
                reader : {
                    type : 'json',
                    root : "collection.dataSets"
                }
            },
            fields : [{
                name : "id",
                type : "string"
            }, {
                name : "name",
                type : "string"
            }, {
                name : "visible",
                type : "boolean"
            } ],
            listeners : {
                load : function (store, recs) {
                    Ext.each(recs, function (rec) {
                        rec.set("visible", true);
                    });
                }
            }
        });

        var visible = Ext.create('Ext.grid.column.CheckColumn', {
            header : i18n.get('headers.visible'),
            dataIndex : 'visible',
            width : 55
        });

        var cmDatasets = {
            items : [ {
                header : i18n.get('headers.name'),
                dataIndex : 'name',
                width : 120
            }, visible ]
        };

        var smDatasets = Ext.create('Ext.selection.RowModel', {
            mode : 'SINGLE'
        });

        /**
         * The dataset list. 
         * It is updated when user pressed on refresh dataset button.
         */
        this.datasetPanel = Ext.create('Ext.grid.Panel', {
            title : i18n.get('label.defineDatasets'),
            store : storeDatasets,
            columns : cmDatasets,
            selModel : smDatasets,
            flex : 1,
            autoScroll : true,
            forceFit : true
        });

        var firstPanel = Ext.create('Ext.panel.Panel', {
            height : 300,
            items : [ this.propertyPanel, this.datasetPanel ],
            collapsedTitle : i18n.get('label.advancedSearch'),
            collapsible : true,
            collapsed : true,
            layout : {
                type : 'hbox',
                align : 'stretch'
            }
        });

        this.buttons = {
            xtype: 'toolbar',
            style: 'background-color:white;',
            layout: {
                type: 'hbox',
                pack: 'center',
                align: 'middle'
            },
            items: [{
                text : i18n.get("label.reset"),
                itemId : 'resetSearchForm',
                scale : 'large'
            }, {
                text: i18n.get('label.search'),
                itemId: 'btnSearchForm',
                scale: 'large'
            }]
        };

        this.bbar= Ext.create("sitools.public.widget.StatusBar", {
            text : i18n.get('label.ready'),
            iconCls : 'x-status-valid',
            hidden : true,
            itemId : 'formStatusBar'
        });
        
        this.items = [ firstPanel, displayComponentPanel ];

        Ext.apply(this, {
            listeners : {
                scope : this,
                propertyChanged : function () {
                    var properties = this.propertyPanel.items.items;
                    var params = {};
                    var j = 0;
                    var k = {};
                    for (var i = 0; i < properties.length; i++) {
                        var prop = properties[i];
                        if (!Ext.isEmpty(prop.getAPIValue())) {
                            params["k[" + j + "]"] = prop.getAPIValue();
                            j++;
                        }
                    }
                    this.datasetPanel.getStore().load({
                        params : params
                    });
                },
                multiDsSearchDone : function () {
//                    this.searchButton.setDisabled(false);
                }
            }
        });
        
        this.callParent(arguments);
    },

    /**
     * Build for a properties a new formField depending on property type.
     * The property type could be one of :
     *  - TEXTFIELD,
     *  - NUMERIC_FIELD,
     *  - NUMERIC_BETWEEN,
     *  - DATE_BETWEEN
     * @param {} prop the Json definition of a property.
     * @return {Ext.form.Field} a simple or composite field.
     */
    buildPropertyField : function (prop) {
        var field;
        switch (prop.type) {
            case "TEXTFIELD" :
                field = {
                    xtype : "textfield",
                    name : prop.name,
                    anchor : '98%',
                    enableKeyEvents : true,
                    fieldLabel : prop.name,
                    getAPIValue : function () {
                        if (Ext.isEmpty(this.getValue())) {
                            return null;
                        }
                        return Ext.String.format("{0}|{1}|{2}", prop.type, prop.name, this.getValue());
                    }
                };
                break;
            case "NUMBER_FIELD" :
                field = {
                    xtype : "numberfield",
                    name : prop.name,
                    anchor : '98%',
                    enableKeyEvents : true,
                    fieldLabel : prop.name,
                    getAPIValue : function () {
                        if (Ext.isEmpty(this.getValue())) {
                            return null;
                        }
                        return Ext.String.format("{0}|{1}|{2}", prop.type, prop.name, this.getValue());
                    }
                };
                break;
            case "NUMERIC_BETWEEN" :
                field = {
                    xtype: 'fieldcontainer',
                    defaults: {
                        flex: 1
                    },
                    msgTarget: 'under',
                    anchor : '98%',
                    items: [
                        {
                            xtype: 'numberfield',
                            name : prop.name + "deb",
                            enableKeyEvents : true,
                            itemId : 'deb'
                        },
                        {
                            xtype: 'numberfield',
                            name : prop.name + "fin",
                            itemId : 'fin'

                        }
                    ],
                    fieldLabel : prop.name,
                    getAPIValue : function () {
                        var deb = this.down("deb").getValue();
                        var fin = this.down("fin").getValue();
                        if (Ext.isEmpty(deb) || Ext.isEmpty(fin)) {
                            return null;
                        }
                        return Ext.String.format("{0}|{1}|{2}|{3}", prop.type, prop.name, deb, fin);
                    }
                };
                break;
            case "DATE_BETWEEN" :
                field = {
                    xtype: 'fieldcontainer',
                    defaults: {
                        flex: 1
                    },
                    msgTarget: 'under',
                    anchor : '98%',
                    items: [
                        {
                            xtype: 'datefield',
                            name : prop.name + "deb",
                            enableKeyEvents : true,
                            format : SITOOLS_DEFAULT_IHM_DATE_FORMAT,
                            showTime : true,
                            itemId : 'deb'
                        },
                        {
                            xtype: 'datefield',
                            name : prop.name + "fin",
                            format : SITOOLS_DEFAULT_IHM_DATE_FORMAT,
                            showTime : true,
                            itemId : 'fin'
                        }
                    ],
                    fieldLabel : prop.name,
                    getAPIValue : function () {
                        var debDate, finDate;
                        var deb = this.down("deb").getValue();
                        var fin = this.down("fin").getValue();
                        try {
                            debDate = Ext.Date.format(deb,SITOOLS_DATE_FORMAT);
                            finDate = Ext.Date.format(fin,SITOOLS_DATE_FORMAT);
                        }
                        catch (err) {
                            return null;
                        }
                        if (Ext.isEmpty(debDate) || Ext.isEmpty(finDate)) {
                            return null;
                        }
                        return Ext.String.format("{0}|{1}|{2}|{3}", prop.type, prop.name, debDate, finDate);
                    }
                };
                break;
        }
        return field;
    },

    _getSettings : function () {
        return this.component._getSettings();
    }

});
