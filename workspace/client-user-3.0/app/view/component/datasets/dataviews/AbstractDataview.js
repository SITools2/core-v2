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
 * @include "../../components/datasets/datasets.js"
 * @include "../../components/datasets/projectForm.js"
 */

/**
 * Datasets Module : 
 * Displays All Datasets depending on datasets attached to the project.
 * @class sitools.user.modules.datasetsModule
 * @extends Ext.grid.GridPanel
 * @requires sitools.user.component.datasets.mainContainer
 */
Ext.define('sitools.user.view.component.datasets.dataviews.AbstractDataview', {
    componentType : 'datasetView',

    getColumns: function () {
        return this.getGrid().columns;
    },

    //generic method
    getNbRowsSelected : function () {
        var sm = this.getSelectionModel();
        if (sm.markAll) {
            return this.store.getTotalCount();
        }
        else {
            return sm.getSelection().length;
        }
    },

    //generic method
    isAllSelected : function () {
        //if the store is loading we cannot know how much records are selected
        if (this.getStore().isLoading()) {
            return false;
        }
        var nbRowsSelected = this.getNbRowsSelected();
        return nbRowsSelected === this.getStore().getTotalCount() || this.getSelectionModel().markAll;
    },

    //generic method
    /**
     * Return an array containing a button to show or hide columns
     * @returns {Array}
     */
    getCustomToolbarButtons : Ext.EmptyFn,


    // generic method
    getSelections: function () {
        return this.getSelectionModel().getSelection();
    },


    getRequestColumnModel: function () {
        var params = {};

        var colModel = extColModelToSrv(this.columns);
        if (!Ext.isEmpty(colModel)) {
            params["colModel"] = Ext.JSON.encode(colModel);
        }
        return params;
    },


    getRequestParam: function () {
        var params = {};

        Ext.apply(params, this.getRequestColumnModel());
        Ext.apply(params, this.getSelectionParam());
        // If a simple selection is done, don't add the form params as the
        // selection is done on the ids
        if (Ext.isEmpty(params["p[0]"]) && Ext.isEmpty(params["c[0]"])) {
            Ext.apply(params, this.getRequestFormFilterParams());
            Ext.apply(params, this.getRequestFormConceptFilterParams());
            Ext.apply(params, this.getRequestGridFilterParams());
            Ext.apply(params, this.getSortParams());
        }

        return params;
    },

    /**
     * Return all request parameters without the column model and selection
     * @return {String}
     */
    getRequestFormFilters: function () {
        //add the form params
        return this.store.getFormFilters();
    },

    /**
     * Return all form concept request parameters without the column model and selection
     * @return {String}
     */
    getRequestFormConceptFilters: function () {
        //add the form params
        return this.store.getFormConceptFilters();
    },

    /**
     * Return all request parameters without the column model and selection
     * @return {String}
     */
    getRequestFormFilterParams: function () {
        //add the form params
        return this.store.getFormParams();
    },

    /**
     * Return all form concept request parameters without the column model and selection
     * @return {String}
     */
    getRequestFormConceptFilterParams: function () {
        //add the form params
        return this.store.getFormConceptParams();
    },

    /**
     * Return all grid filter
     * @return {String}
     */
    getRequestGridFilterParams: function () {
        var params = {};
        // Add the filters params
        if (!Ext.isEmpty(this.getStore().getGridFilters())) {
            var gridFiltersParam = this.getStore().getGridFilters();
            if (!Ext.isEmpty(gridFiltersParam)) {
                params.filter = [];
                Ext.each(gridFiltersParam, function (filter, index) {
                    params.filter[index] = filter;
                });
            }
        }
        return params;
    },

    getSortParams: function () {
        // add the sorters
        var sortersCfg = this.store.sorters;

        var sorters = [];
        this.store.sorters.each(function (sorter) {
            sorters.push({
                field: sorter.property,
                direction: sorter.direction
            });
        }, this);

        return {
            sort: Ext.JSON.encode(sorters)
        };
    },

    /**
     * @method
     * will check if there is some pendingSelection (no requested records)
     * <li>First case, there is no pending Selection, it will build a form parameter
     * with a list of id foreach record.</li>
     * <li>Second case, there is some pending Selection : it will build a ranges parameter
     * with all the selected ranges.</li>
     * @returns {} Depending on liveGridSelectionModel, will return either an object that will use form API
     * (p[0] = LISTBOXMULTIPLE|primaryKeyName|primaryKeyValue1|primaryKeyValue1|...|primaryKeyValueN),
     * either an object that will contain an array of ranges of selection
     * (ranges=[range1, range2, ..., rangen] where rangeN = [startIndex, endIndex])
     *
     */
    getSelectionParam: function () {
        var sm = this.getSelectionModel(), param = {};
        param.ranges = Ext.JSON.encode(sm.getSelectedRanges());
        return param;
    },

    /**
     * Return all request parameters
     * @return {String}
     */
    getRequestUrl: function () {
        var params = this.getRequestParam();
        return Ext.Object.toQueryString(params, true);
    },

    /**
     * Return all request parameters without the column model
     * @return {String}
     */
    getRequestUrlWithoutColumnModel: function () {
        var params = {};

        Ext.apply(params, this.getSelectionParam());
        // If a simple selection is done, don't add the form params as the
        // selection is done on the ids
        if (Ext.isEmpty(params["p[0]"]) && Ext.isEmpty(params["c[0]"])) {
            Ext.apply(params, this.getRequestFormFilterParams());
            Ext.apply(params, this.getRequestFormConceptFilterParams());
            Ext.apply(params, this.getRequestGridFilterParams());
            Ext.apply(params, this.getSortParams());
        }
        return Ext.Object.toQueryString(params, true);
    },

    /**
     * Return all request parameters without the column model and selection
     * @return {String}
     */
    getRequestUrlWithoutSelection: function () {
        var params = {};

        Ext.apply(params, this.getRequestGridFilterParams());
        Ext.apply(params, this.getRequestFormFilterParams());
        Ext.apply(params, this.getRequestFormConceptFilterParams());
        Ext.apply(params, this.getSortParams());

        return Ext.Object.toQueryString(params, true);
    },

    getSelectionsRange: function () {
        var sm = this.getSelectionModel();
        return sm.getSelectedRanges();
    },

    /**
     * method called when trying to save preference
     *
     * @returns
     */
    _getSettings: function () {
        return this.component._getSettings();
    }
});
