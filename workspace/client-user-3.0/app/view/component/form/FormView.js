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
/*global Ext, sitools, i18n, document, projectGlobal, SitoolsDesk, userLogin, DEFAULT_PREFERENCES_FOLDER, loadUrl*/
/*
 * @include "../../sitoolsProject.js"
 * @include "../../desktop/desktop.js"
 * @include "../../components/forms/forms.js"
 * @include "../../components/forms/projectForm.js"
 */

Ext.namespace('sitools.user.view.component.form');

/**
 * Forms Module :
 * Displays All Forms depending on datasets attached to the project.
 * @class sitools.user.modules.formsModule
 * @extends Ext.grid.GridPanel
 * @requires sitools.user.component.forms.mainContainer
 */
Ext.define('sitools.user.view.component.form.FormView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.formsView',
    layout: 'fit',
    autoScroll: true,
    bodyBorder: false,
    border: false,
    

    initComponent: function () {

        this.width = this.formWidth;
        this.height = this.formHeight;
        this.css = this.formCss;
        this.formId = this.formId;

        var panelIdObject = {};

        // New Form model with zones
        if (!Ext.isEmpty(this.formZones)) {
            Ext.each(this.formZones, function (formParam) {
                var containerId = formParam.containerPanelId;
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
                css: this.formCss,
                formId: this.formId,
                formWidth: this.formWidth,
                formHeight: this.formHeight
            });

            if (!Ext.isEmpty(this.formZones)) {
                globalParams.formZones = formParams;
            } else {
                globalParams.oldParameters = formParams;
            }

            componentList.datasetCm = this.dataset.columnModel;
            componentList.loadParameters(globalParams, this.dataUrl, "dataset");

            items.push(componentList);
        }, this);

        if (Ext.isEmpty(this.dataset)) {
            Ext.Ajax.request({
                url: this.dataUrl,
                method: "GET",
                scope: this,
                success: function (ret) {
                    if (showResponse(ret)) {
                        var json = Ext.decode(ret.responseText);
//                      this.componentList.datasetCm = json.dataset.columnModel;
//                      this.componentList.loadParameters(config.formParameters, config.dataUrl, "dataset");
                        this.datasetId = json.dataset.id;
                        this.datasetName = json.dataset.name;
                        this.datasetCm = json.dataset.columnModel;
                        this.datasetView = json.dataset.datasetView;
                        this.dictionaryMappings = json.dataset.dictionaryMappings;
                    }
                }
            });
        }
        else {
//          this.componentList.datasetCm = config.dataset.columnModel;
//          this.componentList.loadParameters(config.formParameters, config.dataUrl, "dataset");
            this.datasetId = this.dataset.id;
            this.datasetName = this.dataset.name;
            this.datasetCm = this.dataset.columnModel;
            this.datasetView = this.dataset.datasetView;
            this.dictionaryMappings = this.dataset.dictionaryMappings;
        }

        this.buttons = {
            xtype: 'toolbar',
            style: 'background-color:white;',
            layout: {
                type: 'hbox',
                pack: 'center',
                align: 'middle'
            },
            items: [{
                text: i18n.get('label.search'),
                itemId: 'btnSearchForm',
                scale: 'large'
            }, {
                text : i18n.get("label.reset"),
                itemId : 'resetSearchForm',
                scale : 'large',
                cls : 'x-custom-btn-gray'
            }]
        };

        this.bbar= Ext.create("sitools.public.widget.StatusBar", {
            text : i18n.get('label.ready'),
            iconCls : 'x-status-valid',
            hidden : true,
            itemId : 'formStatusBar'
        });

        this.items = items;

        this.callParent(arguments);
    },

    _getSettings: function () {
        return this.component._getSettings();
    }
});
