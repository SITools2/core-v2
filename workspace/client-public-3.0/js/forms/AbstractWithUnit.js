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
/*global Ext, sitools*/

/**
 * Abstract class to build Sitools form components with units.
 * @class sitools.public.forms.AbstractWithUnit
 * @extends Ext.Container
 */
Ext.define('sitools.public.forms.AbstractWithUnit', {
   alternateClassName : ['sitools.public.forms.AbstractWithUnit'],
   extend : 'Ext.container.Container',
   dimensionId : null,
   userUnit : null,
   userDimension : null,
   
   initComponent : function () {
		this.userDimension = this.dimensionId;
		this.userUnit = this.unit;
		
		this.storeUnits = Ext.create('Ext.data.JsonStore', {
            id : 'storeUnitSelect',
            root : 'dimension.units',
            idProperty : 'id',
            fields : [ {
                name : 'unitName',
                type : 'string'
            }, {
                name : 'label',
                type : 'string'
            }]
        });
        
		this.callParent(arguments);
   },
   /**
    * Load all units available with a given dimension.
    * On Callback : show a {Ext.Window} with the result in a gridPanel
    * @param {} event The click event (to get coordinates) 
    */
   loadUnits : function (button) {
        if (!this.unitsLoaded) {
            this.storeUnits.removeAll();
            Ext.Ajax.request({
                method : "GET",
                url : loadUrl.get('APP_URL') + loadUrl.get('APP_DIMENSIONS_ADMIN_URL') + '/dimension/' + this.dimensionId,
                scope : this, 
                success : function (ret) {
                    var Json = Ext.decode(ret.responseText);
                    if (!Json.success) {
                        Ext.Msg.alert(i18n.get('label.warning'), Json.message);
                        return;
                    }
                    var units = Json.dimension.sitoolsUnits;
                    this.dimensionName = Json.dimension.name;
                    for (var i = 0; i < units.length; i++) {
                        this.storeUnits.add(units[i]);
                    }
                }, 
                failure : alertFailure,
                callback : function () {
                    this.unitsLoaded = true;
                    this.showWinUnits(button);
                }
            });
        }
        else {
            this.showWinUnits(button);
        }
    }, 
    
    /**
     * Create and show a {Ext.Window} window with the loaded units 
     * build the gridUnits. 
     * @param {} event The click event to get coordinates for the window
     */
    showWinUnits : function (button) {

        var cmUnits = {
            items : [ {
                header : i18n.get('headers.name'),
                dataIndex : 'label',
                width : 100
            },
            {
                header : i18n.get('label.unit'),
                dataIndex : 'unitName',
                width : 100
            }],
            defaults : {
                sortable : true,
                width : 100,
                menuDisabled : true
            }
        };

        var smUnits = Ext.create('Ext.selection.RowModel',{
            mode : 'SINGLE'
        });

        this.gridUnits = Ext.create('Ext.grid.Panel', {
            autoScroll : true,
            store : this.storeUnits,
            columns : cmUnits,
            sm : smUnits, 
            layout : 'fit',
            forceFit : true,
            listeners : {
                scope : this,
                itemclick : function (grid, record, item, rowIndex) {
                    this.onValidateUnits(grid);
                },
                afterrender : function(grid) {
                    var buttonValue = button.getText();
                    var record = grid.getStore().findRecord("label", buttonValue);
                    if (!Ext.isEmpty(record)) {
                        grid.getSelectionModel().select(record);
                    }
                }
            }
        });
        var winUnit = Ext.create('Ext.window.Window', {
            layout : 'fit', 
            width : 200, 
            title : i18n.get('title.unitList'),
            modal : true,
            height : 300,
            items : [this.gridUnits],
            buttons : [{
                text : i18n.get('label.ok'), 
                handler : this.onValidateUnits, 
                scope : this
            }, {
                text : i18n.get('label.cancel'), 
                handler : function (btn) {
                    btn.up("window").close();
                }
            }]
        }); 
        
        winUnit.show();
    },
    /**
     * update property this.userDimension and this.userUnit, depending on the selected record in this.gridUnits
     * update the label of the button withe the new unit
     */
    onValidateUnits : function (cmp) {
        var rec = this.gridUnits.getSelectionModel().getSelection()[0];
        if (Ext.isEmpty(rec)) {
            Ext.Msg.alert(i18n.get('label.error'), i18n.get('label.noSelection'));
            return;
        }

        this.userUnit = rec.getData();
        this.userDimension = this.dimensionName;

        var unitButton = this.down("button#unitButton");
        if (! Ext.isEmpty(unitButton)) {
            this.down("button#unitButton").setText(rec.get("label"));
        }
        cmp.up("window").close();
    }, 

    /**
     * build a {Ext.Container} container with 
     * <ul><li>a {Ext.Button} button if column unit is not null and administrator defines a dimension</li>
     * <li>A simple text if column unit is not null and administrator not defines a dimension</li>
     * <li>null when column unit is null</li></ul> 
     * @return {} null or the builded container
     */
    getUnitComponent : function () {
	    var columnUnit = this.context.getRefUnit(this);
        //the administrator defines a dimension for this component
	    // and the column unit is not null
        if (!Ext.isEmpty(this.dimensionId)) {
            var btn = Ext.create("Ext.Button", {
                scope : this,
                itemId : 'unitButton',
                text : Ext.isEmpty(columnUnit) ? "    " : columnUnit.label, 
                width : 90,
                handler : function (button, e) {
                    this.loadUnits(button);
                }
            });
            unit = Ext.create('Ext.container.Container', {
            	layout : "hbox", 
            	layoutConfig : {
            		pack : "center", 
            		align : "middle"
            	},
            	margins : {top:0, right:0, bottom:0, left:10}, 
	        	width : 100, 
            	items : [btn]
            });
        }
        else {
            if (!Ext.isEmpty(columnUnit)) {
                unit = Ext.create('Ext.container.Container', {
		    		html : columnUnit.label, 
		    		margins : {top:0, right:0, bottom:0, left:10}, 
	        		flex : 1
		    	});
            }
            else {
                unit = null;
            }
        }
        return unit;
    }
});


