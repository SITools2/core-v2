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
/*global Ext, sitools, window, showVersion, publicStorage, userLogin, projectGlobal, SitoolsDesk, showResponse, i18n, extColModelToJsonColModel, loadUrl*/

/**
 * @cfg {Array} modules la liste des modules
 * @class sitools.user.component.entete.NavBar
 * @extends Ext.Toolbar
 */
Ext.define('sitools.user.view.header.HeaderView', {
    extend : 'Ext.Panel',
    alias : 'widget.headerView',

    requires : [ 'sitools.user.view.header.ButtonTaskBarView', 'sitools.user.view.header.LeftTaskBarView' ],
    height : 0,

    initComponent : function () {

    	this.navBarHeight = 44;

        this.entetePanel = Ext.create("Ext.panel.Panel", {
        	style : 'overflow : visible;',
            html : this.htmlContent,
            border : false,
            layout : 'fit',
            flex : 1,
            listeners : {
                scope : this,
                desktopReady : this.showUserContainer
            }
        });

        Ext.apply(this, {
            items : [ this.entetePanel],
            border : false,
            layout : 'fit'
        });

        this.callParent(arguments);
    },

    showUserContainer : function (navBar) {
        var tpl, textToDisplay = i18n.get("label.welcome"), userContainerHeight, userContainerWidth;
        if (projectGlobal.user) {
            textToDisplay += " " + projectGlobal.user.firstName + " " + projectGlobal.user.lastName;
            userContainerHeight = 30;
            userContainerWidth = 250;
        } else {
            textToDisplay += " " + i18n.get('label.guest') + "<br>" + i18n.get("label.clickToConnect");
            userContainerHeight = 50;
            userContainerWidth = 250;
        }

        if (SitoolsDesk.desktopMaximizeMode) {
            tpl = new Ext.XTemplate("<div style='left:{width - 60}px;' class='sitools-userContainer-arrow-border-up'></div>",
                    "<div style='left:{width - 60}px;' class='sitools-userContainer-arrow-up'></div>",
                    "<div><img class='sitools-userContainer-icon' src='/sitools/cots/"+EXT_JS_FOLDER+"/resources/images/default/window/icon-info.gif'>{text}</div>");
        } else {
            tpl = new Ext.XTemplate(
                    "<div><img class='sitools-userContainer-icon' src='/sitools/cots/"+EXT_JS_FOLDER+"/resources/images/default/window/icon-info.gif'>{text}</div>",
                    "<div style='left:{width - 60}px;' class='sitools-userContainer-arrow-border-down'></div>",
                    "<div style='left:{width - 60}px;' class='sitools-userContainer-arrow-down'></div>");
        }
        this.userContainer = Ext.create("Ext.Component", {
            data : {
                text : textToDisplay,
                height : userContainerHeight,
                width : userContainerWidth
            },
            cls : "sitools-userContainer",
            width : userContainerWidth,
            height : userContainerHeight,
            renderTo : SitoolsDesk.getEnteteEl(),
            tpl : tpl,
            listeners : {
                scope : this,
                afterRender : function (me) {
                    var el = Ext.get(me.id);
                    el.on("click", function (e, t, o) {
                        this.getEl().fadeOut({
                            easing : 'easeOut',
                            duration : 1,
                            opacity : 0,
                            useDisplay : false
                        });
                    }, me);
                },
                maximizeDesktop : function (me, navBar) {
                    // me.setPosition(me.getPosition()[0],
                    // this.calcUserContainerYPos(navBar));
                    if (me.isVisible()) {
                        me.setVisible(false);
                        me.destroy();
                        // this.showUserContainer(navBar);
                    }
                },
                minimizeDesktop : function (me, navBar) {
                    if (me.isVisible()) {
                        me.setVisible(false);
                        me.destroy();
                        // this.showUserContainer(navBar);
                    }
                }
            }
        });

        var enteteEl = SitoolsDesk.getEnteteEl();
        var userContEl = this.userContainer.getEl();
        var x, y;
        x = Ext.getBody().getWidth() - this.userContainer.getWidth();

        y = this.calcUserContainerYPos(navBar);

        this.userContainer.setPosition([ x, y ]);
        userContEl.highlight("948B8B", {
            attr : 'background-color',
            duration : 1
        });
        userContEl.fadeOut({
            easing : 'easeOut',
            duration : 1,
            opacity : 0,
            useDisplay : false
        });
        // this.userContainer.setVisible(! SitoolsDesk.desktopMaximizeMode);
    },
    /**
     * Calculates the y position of the userContainer.
     * 
     * @param navBar
     *            (the navBar component
     * @returns {integer} the yPosition
     */
    calcUserContainerYPos : function (navBar) {
        var enteteEl = SitoolsDesk.getEnteteEl();
        var userContEl = this.userContainer.getEl();
        var y;
        if (SitoolsDesk.desktopMaximizeMode) {
            y = navBar.getHeight();
        } else {
            y = enteteEl.getHeight() - navBar.getHeight() - this.userContainer.getHeight();
            if (!Ext.isEmpty(userContEl.getMargin())) {
                y -= userContEl.getMargin().bottom;
                y -= userContEl.getMargin().top;
            }
        }
        return y;

    },

    /**
     * Return the Navbar Buttons
     */
    getNavbarButtons : function () {
        return this.navToolbarButtons;
    },

    /**
     * Return the Navbar Modules
     */
    getNavbarModules : function () {
        return this.navBarModule;
    },
    /**
     * listeners of maximizeDesktop event
     */
    onMaximizeDesktopNavbar : function () {
        this.navBarModule.fireEvent("maximizeDesktop");
        this.navToolbarButtons.fireEvent("maximizeDesktop");
    },

    /**
     * listeners of minimizeDesktop event
     */
    onMinimizeDesktopNavbar : function () {
        this.navBarModule.fireEvent("minimizeDesktop");
        this.navToolbarButtons.fireEvent("minimizeDesktop");
    }

});
