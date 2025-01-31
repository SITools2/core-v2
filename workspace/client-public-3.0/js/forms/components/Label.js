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
Ext.ns('sitools.public.forms.components');

/**
 * 
 * @class sitools.public.forms.components.Label
 * @extends Ext.Container
 */
Ext.define('sitools.public.forms.components.Label', {
    extend : 'Ext.Container',
    alternateClassName : ['sitools.common.forms.components.Label'],

    initComponent : function () {
	    Ext.apply(this, {
	        html : this.label,
	        cls : this.css,
	        overCls : 'fieldset-child'
	    });
	    sitools.public.forms.components.Label.superclass.initComponent.apply(this, arguments);
    },
    getParameterValue : function () {
	    return null;
    }
});
