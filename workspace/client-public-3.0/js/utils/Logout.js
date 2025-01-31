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
/*global Ext,window*/

Ext.namespace('sitools.public.utils');

Ext.define('sitools.public.utils.Logout', {
    singleton : true,
    logout : function (reload) {
        if (Ext.isEmpty(reload)) {
            reload = true;
        }
        Ext.util.Cookies.set('userLogin', '');
        Ext.util.Cookies.clear('userLogin');
        Ext.util.Cookies.set('hashCode', '');
        localStorage.removeItem("userSessionTimeOut");
        Ext.destroyMembers(Ext.Ajax.defaultHeaders, "Authorization");
        if (reload) {
            window.location.reload();
        }   
    }
});

utils_logout = sitools.public.utils.logout;