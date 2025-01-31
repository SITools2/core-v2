/*******************************************************************************
 * Copyright 2010-2016 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
 * 
 * This file is part of SITools2.
 * 
 * SITools2 is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * SITools2 is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * SITools2. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
/*global Ext, i18n, loadUrl, getDesktop, sitools, SitoolsDesk */
Ext.define('sitools.user.controller.DesktopController', {

    extend : 'Ext.app.Controller',

    requires : [ 'Ext.window.MessageBox', 
                 'Ext.ux.modules.Settings' ],

    views : [ 'desktop.DesktopView' ],

    init : function () {
    	this.control({
            'menu#saveMenuWindow menuitem#saveUser' : {
                click : function (menuItem) {
                    var menu = menuItem.up("menu");
                    var window = menu.window;
                    var component = window.items.items[0];

                    var componentSettings = component._getSettings();
                    window.saveSettings(componentSettings, false);
                }

            },
            'menu#saveMenuWindow menuitem#savePublic' : {
                click : function (menuItem) {
                    var menu = menuItem.up("menu");
                    var window = menu.window;
                    var component = window.items.items[0];

                    var componentSettings = component._getSettings();
                    window.saveSettings(componentSettings, true);
                }

            },
            'window tool#save' : {
                click : function (tool, e, eOpts) {
                    var window = tool.up("window");

                    var saveLabel = Ext.create('Ext.menu.Item', {
                        text : i18n.get('label.chooseSaveType'),
                        plain : false,
                        canActivate : false,
                        cls : 'userMenuCls'
                    });

                    var menuForms = Ext.create("Ext.menu.Menu", {
                        border : false,
                        plain : true,
                        width : 260,
                        closeAction : 'hide',
                        itemId : 'saveMenuWindow',
                        window : window,
                        items : [saveLabel, {
                            xtype : 'menuseparator',
                            separatorCls : 'customMenuSeparator'
                        }, {
                            text: i18n.get("label.myself"),
                            cls : 'menuItemCls',
                            iconCls : 'saveUserIcon',
                            itemId : 'saveUser',
                        },
                        {
                            text: i18n.get("label.publicUser"),
                            cls : 'menuItemCls',
                            iconCls : 'savePublicIcon',
                            itemId : 'savePublic',
                        }]
                    });

                    var x = e.getX() + 5;
                    var y = e.getY() + 5;

                    menuForms.showAt([x, y]);
                }
            }
    	});


        this.getApplication().on('projectLoaded', this.realInit, this);
    	this.callParent(arguments);
    },
    
    realInit : function () {
    	this.id = 'DesktopControllerId';
    	
    	var me = this, desktopCfg;
    	
    	desktopCfg = me.getDesktopConfig();
    	
    	Ext.apply(desktopCfg, {
    		renderTo : 'x-desktop'
    	}, {
    		desktopController : me
    	});
    	
    	me.desktopView = Ext.create('sitools.user.view.desktop.DesktopView', desktopCfg);
    	
    	Ext.EventManager.on(window, 'beforeunload', me.onUnload, me);
    	Ext.EventManager.onWindowResize(this.fireResize, this);
    	
    	me.isReady = true;
    	me.fireEvent('ready', me);
    },

    createWindow : function (view, windowConfig) {
        var desktopView = this.getDesktopView();
        var win = desktopView.getWindow(windowConfig.id) || desktopView.getWindow(windowConfig.name);
        
        if (!win) {
            Ext.applyIf(windowConfig, {
                id : windowConfig.name,
                title : i18n.get(windowConfig.label),
                width : 600,
                height : 400,
                animCollapse : false,
                border : false,
                bodyBorder : false,
                hideMode : 'offsets',
                layout : 'fit',
                items : [ view ],
                listeners : {
                    render : function (window) {
                        window.getEl().mask(i18n.get("label.loading"));
                    },
                    boxready : function (window) {
                        window.getEl().unmask();
                    }
                },
                tools : [{
                	type : 'prev',
                	tooltip : i18n.get('label.alignLeftDesktop'),
                	handler : this.alignWindow
                }, {
                	type : 'next',
                	tooltip : i18n.get('label.alignRightDesktop'),
                	handler : this.alignWindow
                }]
            });
            
            if(!Ext.isEmpty(userLogin) && windowConfig.saveToolbar) {
                windowConfig.tools.push({
                    type : 'gear',
                    itemId : 'save'
                });
            }
            
            win = desktopView.createWindow(windowConfig);
        }
        
        Desktop.setActivePanel(win);
        win.on('beforeclose', function (winToClose) {
        	Desktop.setActivePanel(null);
        }, this);
        
        win.show();
    },
    
    alignWindow : function (event, toolEl, header, tool) {
    	var window = header.up('window');
		var wallpaper = Ext.get('wallpaperId');
		
		var newWindowWidth = wallpaper.getWidth() / 2;
		var newWindowHeight = wallpaper.getHeight();
		window.setSize(newWindowWidth, newWindowHeight);
		
		var newWindowX, newWindowY;
		if (tool.type == "prev") { // align left
			newWindowX = 0;
			newWindowY = wallpaper.getY();
		} else { // align right
			newWindowX = newWindowWidth;
			newWindowY = wallpaper.getY();
		}
		
		window.setXY([newWindowX, newWindowY], true);
    },
    
    createPanel : function (view, windowConfig) {
        var desktopView = this.getDesktopView();
        var panel = desktopView.getWindow(windowConfig.id) || desktopView.getWindow(windowConfig.name);
        
        if (!panel) {
            Ext.applyIf(windowConfig, {
                id : windowConfig.name,
//                title : i18n.get(windowConfig.label),
                maximized : true,
                shadow : false,
                hideMode : 'offsets',
                constrainHeader : false,
                header : false,
                layout : 'fit',
                items : [ view ],
                height : Desktop.getDesktopEl().getHeight(),
                width : Desktop.getDesktopEl().getWidth()
            });
            
            panel = desktopView.createPanel(windowConfig);
        }
        
        Desktop.setActivePanel(panel);
        
        panel.on('beforeclose', function (winToClose) {
        	Desktop.setActivePanel(null);
        }, this);
        
        panel.show();
    },

    /**
     * This method returns the configuration object for the TaskBar. A derived
     * class can override this method, call the base version to build the config
     * and then modify the returned object before returning it.
     */
    getTaskbarConfig : function () {
        var me = this, cfg = {
            app : me
        };
        Ext.apply(cfg, me.taskbarConfig);
        return cfg;
    },

    onReady : function (fn, scope) {
        if (this.isReady) {
            fn.call(scope, this);
        } else {
            this.on({
                ready : fn,
                scope : scope,
                single : true
            });
        }
    },

    getDesktopView : function () {
        return this.desktopView;
    },

    onUnload : function (e) {
        if (this.fireEvent('beforeunload', this) === false) {
            e.stopEvent();
        }
    },

    getDesktopConfig : function () {
        var me = this, cfg = {
            app : me,
            taskbarConfig : me.getTaskbarConfig()
        };

        Ext.apply(cfg, me.desktopConfig);
        return Ext.apply(cfg, {

            // cls: 'ux-desktop-black',

            contextMenuItems : [ {
                text : i18n.get('label.changeSettings'),
                handler : me.onSettings,
                scope : me
            } ],

            wallpaper : 'resources/wallpapers/Wood-Sencha.jpg',
            wallpaperStretch : false
        });
    },

    getTaskbarConfig : function () {
        var me = this, cfg = {
            app : me
        };

        Ext.apply(cfg, me.taskbarConfig);
        return cfg;
    },
    
    onSettings : function () {
        var dlg = Ext.create('Ext.ux.modules.Settings', {
            desktop : this.desktopView
        });
        dlg.show();
    },
    
    /**
	 * Set the height of the different elements of the desktop, according to the screen height.
	 * @private 
	 */
	layout : function () {
		var el = Desktop.getMainDesktop();
		var enteteEl = Desktop.getEnteteEl();
		var bottom = Desktop.getBottomEl();
		try {
			el.setHeight(Ext.getBody().getHeight() - enteteEl.getHeight() - bottom.getHeight())
			Desktop.getDesktopEl().setHeight(Desktop.getDesktopAndTaskBarEl().getHeight()- Desktop.getTaskbarEl().getHeight());
		}
		catch (err) {
			return;
		}
	},
    
	maximize : function () {
    	var headerController = this.getApplication().getController('header.HeaderController');
    	var footerController = this.getApplication().getController('footer.FooterController');
		
		headerController.onMaximizeDesktop();
    	footerController.onMaximizeDesktop();
		
		var arrayFreeDiv = Ext.DomQuery.select("div[stype=freeDiv]");
		if (!Ext.isEmpty(arrayFreeDiv)) {
			Ext.each(arrayFreeDiv, function (freeDiv) {
				freeDiv.style.height = "0px";
				freeDiv.style.width = "0px";
			});
			
		}
		
		if (!Ext.isEmpty(Desktop.getModulesInDiv())) {
			Ext.Array.each(Desktop.getModulesInDiv(), function (moduleInDiv) {
				moduleInDiv.fireEvent("maximizeDesktop", moduleInDiv);
			});
			
			Desktop.getDesktopAndTaskBarEl().setWidth(Ext.getBody().getWidth());
			Desktop.getDesktopEl().setWidth(Ext.getBody().getWidth());
		}
		
		var desktopMaxHeight = Ext.getBody().getHeight() - this.desktopView.taskbar.getHeight();
		var desktopMaxWidth = Ext.getBody().getWidth();
//		
		var desktopTaskBarMaxHeight = Ext.getBody().getHeight();
			
		//Agrandir la zone desktopAndTaskbar
		Desktop.getDesktopAndTaskBarEl().setHeight(Ext.getBody().getHeight() - 1);
		Desktop.getDesktopAndTaskBarEl().setWidth(Ext.getBody().getWidth());
//		
		Desktop.getDesktopEl().setHeight(desktopMaxHeight - this.desktopView.taskbar.getHeight());
		Desktop.getDesktopEl().setWidth(desktopMaxWidth);

//		Desktop.getBottomEl().setHeight(0);
		
//		Desktop.getMainDesktop().setHeight(desktopMaxHeight);
		
		this.desktopView.fitDesktop();
		
		Desktop.getNavMode().maximize(this.desktopView);
		
	},
	
    minimize : function () {
    	var headerController = this.getApplication().getController('header.HeaderController');
    	var footerController = this.getApplication().getController('footer.FooterController');

    	headerController.onMinimizeDesktop();
    	footerController.onMinimizeDesktop();
		
		var arrayFreeDiv = Ext.dom.Query.select("div[stype=freeDiv]");
		
		if (!Ext.isEmpty(arrayFreeDiv)) {
			Ext.each(arrayFreeDiv, function (freeDiv) {
				freeDiv.style.height = "";
				freeDiv.style.width = "";
			});
		}
		
		//Revenir à la taille initiale de la zone desktopAndTaskbar
		
		Desktop.getDesktopAndTaskBarEl().dom.style.height = "";
		Desktop.getDesktopAndTaskBarEl().dom.style.width = "";
		
		Desktop.getDesktopEl().setWidth("");
		
		this.desktopView.fitDesktop();
		
		Desktop.getNavMode().minimize(this.desktopView);
		
		if (!Ext.isEmpty(Desktop.getModulesInDiv())) {
			Ext.Array.each(Desktop.getModulesInDiv(), function (moduleInDiv) {
				moduleInDiv.fireEvent("minimizeDesktop", moduleInDiv);
			});
		}
	},
	
	/**
	 * Called on a desktop Resize.
	 * It will redefine the height and size of desktop Element. 
	 * Fires events for each component so that they can resize according to their container
	 * Fires event resizeDesktop on activePanel
	 * Fires event resize on entete and bottom component.
	 * Fires event resize on each module representation included in a specific Div  
	 */
	fireResize : function (newW, newH) {
		
		if (Desktop.getDesktopMaximized() == true) {
			Desktop.getDesktopAndTaskBarEl().setHeight(Ext.getBody().getHeight() - Desktop.getEnteteEl().getHeight());
			Desktop.getDesktopAndTaskBarEl().setWidth(Ext.getBody().getWidth());
	
			Desktop.getDesktopAndTaskBarEl().setHeight(Ext.getBody().getHeight() - Desktop.getEnteteEl().getHeight());
			Desktop.getDesktopEl().setHeight(Ext.getBody().getHeight() - Desktop.getEnteteEl().getHeight());
			Desktop.getDesktopEl().setWidth(Ext.getBody().getWidth());
		}

		this.desktopView.fitDesktop();
		
		this.desktopView.windows.each(function (win) {
				win.fireEvent("resizeDesktop", win, newW, newH);
		});

        if (!Ext.isEmpty(Desktop.getModulesInDiv())) {
            Ext.Array.each(Desktop.getModulesInDiv(), function (moduleInDiv) {
                var parent = Ext.get(moduleInDiv.getEl().findParentNode('div'));
                moduleInDiv.setSize(parent.getWidth(), parent.getHeight());
            });
        }
	}
	
});