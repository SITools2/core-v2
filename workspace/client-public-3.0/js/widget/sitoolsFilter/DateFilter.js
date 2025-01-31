/*******************************************************************************
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
 ******************************************************************************/
/*global Ext, i18n, loadUrl, getDesktop, sitools, SitoolsDesk */
Ext.namespace("sitools.public.widget.sitoolsFilter");

Ext.define('sitools.public.widget.sitoolsFilter.DateFilter', {
    extend : 'sitools.public.widget.sitoolsFilter.Filter',
    alias : 'sitools.widget.DateFilter',
	
    /**
     * @cfg {String} iconCls
     * The iconCls to be applied to the menu item.
     * @cfg {String} format
     * The date format to use
     * Defaults to <tt>'ux-gridfilter-text-icon'</tt>.
     */
    iconCls : 'ux-gridfilter-text-icon',

    emptyText: 'Enter Filter Text...',
    selectOnFocus: true,
    
    /**  
     * @private
     * Template method that is to initialize the filter and install required menu items.
     */
    init : function (config) {
        config = config || {};
        this.dateFormat = Ext.isEmpty(config.format)?SITOOLS_DEFAULT_IHM_DATE_FORMAT:config.format; 
        this.inputFrom = Ext.create("Ext.form.DateField", {
        	anchor : "100%", 
        	format : this.dateFormat
        }); 
        this.inputTo = Ext.create("Ext.form.DateField", {
        	anchor : "100%", 
        	format : this.dateFormat
        });
        
        var imageFrom = Ext.create('Ext.Img', {
            src : '/sitools/client-public/res/images/sitoolsFilter/greater_than_or_equals.png',
            width : 16,
            height : 16,
            margin : '4 5 4 5'
        });
        
        var imageTo = Ext.create('Ext.Img', {
            src : '/sitools/client-public/res/images/sitoolsFilter/less_than_or_equals.png',
            width : 16,
            height : 16,
            margin : '4 5 4 5'
        });
        
        var formPanelFrom = Ext.create("Ext.form.FieldContainer", {
            layout : {
                type :'hbox',
                align :'stretch'                
            },
            items : [imageFrom, this.inputFrom], 
            bodyBorder : false, 
            border : false
        });
        
        var formPanelTo = Ext.create("Ext.form.FieldContainer", {
            layout : {
                type :'hbox',
                align :'stretch'                
            },
            items : [imageTo, this.inputTo], 
            bodyBorder : false, 
            border : false
        });
        
        
        var formPanel = Ext.create("Ext.Container", {
            layout : {
                type :'vbox',
                align :'stretch'                
            },
        	items : [formPanelFrom, formPanelTo], 
        	bodyBorder : false, 
        	border : false
        });
        
        
        this.add(formPanel);
    },
    
    /**
     * @private
     * Template method that is to get and return the value of the filter.
     * @return {String} The value of this filter
     */
    getValue : function () {
        var result = [];
        if (!Ext.isEmpty(this.inputFrom.getValue())) {
        	result.push({
	        	"columnAlias" : this.columnAlias, 
	        	"data" : {
	        		"comparison" : "gte", 
	        		"value" : Ext.Date.format(this.inputFrom.getValue(),SITOOLS_DATE_FORMAT), 
	        		"type" : "date"
	        	}
	        });
        }
        if (!Ext.isEmpty(this.inputTo.getValue())) {
        	result.push({
	        	"columnAlias" : this.columnAlias, 
	        	"data" : {
	        		"comparison" : "lte", 
	        		"value" : Ext.Date.format(this.inputTo.getValue(),SITOOLS_DATE_FORMAT), 
	        		"type" : "date"
	        	}
        	});
        }
        return result;
    },
    
    getConfig : function () {
    	if (!Ext.isEmpty(this.inputFrom.getValue()) || !Ext.isEmpty(this.inputTo.getValue())) {
	 		return {
	    		"columnAlias" : this.columnAlias, 
	    		"value" : {
	    			"from" : this.inputFrom.getValue(), 
	    			"to" : this.inputTo.getValue() 
	    		}, 
	    		"type" : "date"
	    	};
    	}
    	else {
    		return null;
    	}
    	
    }, 
    /**
     * @private
     * Template method that is to set the value of the filter.
     * @param {Object} value The value to set the filter
     */	
    setValue : function (value) {
        this.inputFrom.setValue(value.from);
        this.inputTo.setValue(value.to);
        
    } , 
    _getHeight : function () {
    	return this.height;
    }
});
