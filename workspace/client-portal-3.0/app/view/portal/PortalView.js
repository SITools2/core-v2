/**
 * @class Ext.app.Portal
 * @extends Object
 * A sample portal layout application class.
 */

Ext.define('sitools.clientportal.view.portal.PortalView', {
    extend: 'Ext.container.Viewport',

    requires: ['sitools.clientportal.view.portal.PortalPanel',
        'sitools.clientportal.view.portal.PortalColumn',
        'sitools.clientportal.view.portal.GridPortlet',
        'sitools.clientportal.view.portal.Portlet',
        'sitools.clientportal.view.portal.FeedsReaderPortal',
        'sitools.public.userProfile.editProfile'],

    alias: 'widget.portalView',

    layout: {
        type: 'border',
        padding: 10
    },
    border: false,
    bodyBorder: false,

    initComponent: function () {

        var user;
        var menuLoginLogout;

        //var initPortalCallback = function () {

        if (Ext.isEmpty(Ext.util.Cookies.get('userLogin'))) {
            user = i18n.get('label.guest');

            menuLoginLogout = {
                xtype: 'button',
                text: i18n.get('label.connection'),
                name: 'menuLogin',
                cls: 'x-custom-button-color',
                icon: loadUrl.get('APP_URL') + '/client-public/res/images/icons/login.png',
                scope: this,
                handler: function () {
                    sitools.public.utils.LoginUtils.connect({
                        closable: true,
                        url: loadUrl.get('APP_URL') + loadUrl.get('APP_LOGIN_PATH_URL') + '/login',
                        register: loadUrl.get('APP_URL') + '/inscriptions/user',
                        reset: loadUrl.get('APP_URL') + '/lostPassword',
                        unblacklist: loadUrl.get('APP_URL') + '/unblacklist'
                    });


                }

            };
        } else {
            user = Ext.util.Cookies.get('userLogin');
            menuLoginLogout = {
                xtype: 'button',
                text: i18n.get('label.logout'),
                itemId: 'menu_logout',
                cls: 'x-custom-button-color',
                icon: loadUrl.get('APP_URL') + '/client-public/res/images/icons/logout.png',
                scope: this,
                handler: sitools.public.utils.LoginUtils.logout
            };

        }
        var versionButton = {
            xtype: 'button',
            text: i18n.get('label.version'),
            itemId: 'menu_version',
            icon: loadUrl.get('APP_URL') + '/client-public/res/images/icons/version.png',
            cls: 'x-custom-button-color',
            handler: function () {
                Ext.create('sitools.public.version.Version').show();
            }

        };

        var menuLangues = Ext.create('Ext.menu.Menu', {
            name: 'menuLangues',
            plain: true,
            border: false,
            bodyBorder: false
        });

        Ext.each(this.languages, function (language) {
            menuLangues.add({
                text: language.displayName,
                scope: this,
                handler: function () {
                    var callback = function () {
                        Ext.util.Cookies.set('language', language.localName);
                        window.location.reload();
                    };
                    var date = new Date();
                    Ext.util.Cookies.set('language', language.localName, Ext.Date.add(date, Ext.Date.MINUTE, 20));
                    locale.setLocale(language.localName);
                    userPreferences = {};
                    userPreferences.language = language.localName;
                    if (!Ext.isEmpty(userLogin)) {
                        UserStorage.set(loadUrl.get('APP_PORTAL_URL'), "/" + DEFAULT_PREFERENCES_FOLDER + loadUrl.get('APP_PORTAL_URL'), userPreferences, callback);
//                        userStorage.set("portal",  "/" + DEFAULT_PREFERENCES_FOLDER + "/portal", userPreferences, callback);
                    } else {
                        window.location.reload();
                    }
                },
                icon: language.image
            });
        }, this);

        var editProfileButton;
        if (!Ext.isEmpty(Ext.util.Cookies.get('userLogin'))) {
            editProfileButton = {
                xtype: 'button',
                name: 'editProfileBtn',
                text: i18n.get('label.editProfile'),
                itemId: 'menu_editProfile',
                cls: 'x-custom-button-color',
                icon: loadUrl.get('APP_URL') + '/client-public/res/images/icons/tree_userman.png',
                identifier: user,
                edit: loadUrl.get('APP_URL') + '/editProfile/' + user,
                scope: this
            };
        } else {

            editProfileButton = {
                xtype: 'button',
                name: 'editProfileBtn',
                cls: 'x-custom-button-color',
                hidden: true
            };
        }

        this.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            id: 'toolbar',
            cls: 'bg-transparent box-shadow',
            region: 'north',
            height: 55,
            border: false,
            bodyBorder: false,
            enableOverflow: true,
            margin: 10,
            items: [{
                xtype: 'label',
                html: '<img src=' + loadUrl.get('APP_URL') + '/client-public/res/images/cnes.png width=92 height=28>'
            }, {
                xtype: 'label',
                html: '<img src=' + loadUrl.get('APP_URL') + '/client-public/res/images/logo_01_petiteTaille.png width=92 height=28>'
            }, '->', {
                xtype: 'label',
                margins: {
                    top: 0,
                    right: 10,
                    bottom: 0,
                    left: 10
                },
                html: i18n.get('label.welcome') + ' <b>' + user + '</b>'
            }, versionButton, {
                text: i18n.get('label.langues'),
                cls: 'x-custom-button-color',
                menu: menuLangues,
                iconCls: 'languageMenuIcon'
            }, editProfileButton, menuLoginLogout]
        });

        /***************************************************************************
         * Creation du portlet Liste des projets
         */

        var portletCollection = new Ext.util.MixedCollection();

        Ext.each(this.projects, function (project) {

            var record = {
                id: project.id,
                name: project.name,
                description: project.description,
                image: project.image.url || SITOOLS_DEFAULT_PROJECT_IMAGE_URL,
                authorized: project.authorized,
                maintenance: project.maintenance,
                maintenanceText: project.maintenanceText,
                priority: project.priority,
                categoryProject: project.categoryProject
            };

            // creation of the portletObject if it does not already exist

            var portletObject = {};
            if (Ext.isEmpty(project.categoryProject) && project.authorized) {
                portletObject.category = i18n.get('label.publicProject');
            } else if (!project.authorized) {
                portletObject.category = i18n.get('label.privateProject');
            }


            if (portletCollection.get(portletObject.category) == undefined && portletCollection.get(project.categoryProject) == undefined) {

                if (!project.authorized) {
                    portletObject.category = i18n.get('label.privateProject');
                }
//                else if ((project.categoryProject === "" || project.categoryProject == undefined) && portletCollection.get("") === undefined) {
//                    portletObject.category = "Public";
//                }
                else if (!Ext.isEmpty(project.categoryProject)) {
                    portletObject.category = project.categoryProject;
                }

                portletObject.store = this.createStore();
                portletObject.store.add(record);
                portletObject.store.sort({
                    property: 'priority',
                    direction: 'ASC'
                });

                portletObject.dataview = this.createDataview(portletObject.store);

                portletObject.portlet = this.createPortlet(portletObject);

                portletCollection.add(portletObject.category, portletObject);

            } else { // just adding record to the portletObject store
                var portletObject = portletCollection.get(portletObject.category) || portletCollection.get(project.categoryProject);
                if (!Ext.isEmpty(portletObject)) {
                    portletObject.store.add(record);
                    portletObject.store.sort({
                        property: 'priority',
                        direction: 'ASC'
                    });
                }
            }
        }, this);


        /***************************************************************************
         * Creation du portlet d'affichage des flux rss/atom
         */

        var panelFluxPortal = Ext.create('sitools.clientportal.view.portal.FeedsReaderPortal', {});

        var portletFluxPortal = {
            xtype: 'portlet',
            layout: 'fit',
            title: i18n.get('title.portlelFeedsPortal'),
            height: 410,
            items: [panelFluxPortal]
        };

        this.footerPanel = Ext.create('sitools.clientportal.view.portal.PortalFooter', {});

        Ext.create('Ext.fx.Animator', {
            target: this.footerPanel,
            duration: 2000,
            keyframes: {
                0: {
                    opacity: 0
                },
                100: {
                    opacity: 1
                }
            }
        });

        /***************************************************************************
         * Creation tabPanel Center qui contient le portal
         */

        this.northPanel = Ext.create('Ext.Component', {
            region: 'north',
            title: i18n.get('label.freeText'),
            autoScroll: false,
            layout: 'fit',
            flex: .4,
            margin: 10,
            autoEl: {
                tag: 'iframe',
                border: false,
                autoScroll: false,
                src: loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PORTAL_URL') + "/resources/html/" + locale.getLocale() + "/freeText.html"
            }
        });

        Ext.create('Ext.fx.Animator', {
            target: this.northPanel,
            duration: 2000,
            keyframes: {
                0: {
                    opacity: 0
                },
                100: {
                    opacity: 1
                }
            }
        });

        var onlyPortletTab = [];
        portletCollection.each(function (item, index, length) {
            onlyPortletTab.push(item.portlet);
        }, this);

        var itemCenterRegion;
//            items : [ portletProjetPublic ]

        itemCenterRegion = [{
            columnWidth: 0.50,
            items: onlyPortletTab
        }, {
            columnWidth: 0.50,
            items: [portletFluxPortal]
        }];

        this.widgetsPanel = Ext.create('sitools.clientportal.view.portal.PortalPanel', {
            region: 'center',
            baseCls: 'portalMainPanel',
            margins: '20 5 5 0',
            defaults: {
                style: 'padding:10px 0 10px 10px'
            },
            items: itemCenterRegion
        });

        this.centerPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            layout: 'border',
            autoScroll: false,
            border: false,
            bodyBorder: false,
            bodyCls: 'bg-transparent-2',
            cls: 'box-shadow',
            margin: 10,
            items: [this.northPanel, this.widgetsPanel]
        });

        this.southPanel = Ext.create('sitools.clientportal.view.portal.PortalPanel', {
            region: 'south',
            //xtype: 'portalpanel',
            border: false,
            bodyBorder: false,
            cls: 'box-shadow',
            height: 70,
            margin: 10,
            autoScroll: false,
            layout: 'border',
            items: [this.footerPanel]
        });

        this.items = [this.toolbar, this.centerPanel, this.southPanel];

        this.callParent(arguments);
    },

    beforeRender: function () {
        this.loadDisplayConfigFile();
        this.callParent(arguments);
    },

    /**
     * Load portal configuration file
     */
    loadDisplayConfigFile: function () {
        Ext.Ajax.request({
            method: "GET",
            scope: this,
            url: loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PORTAL_URL') + "/conf/portalDisplayConfig.json",
            success: function (ret) {
                this.displayConfig = Ext.decode(ret.responseText);
                if (Ext.isEmpty(this.displayConfig)) {
                    return;
                }
                this.customizePortal();
            }
        });
    },

    /**
     * Customize Portal Elements with data set into configuration file
     */
    customizePortal: function () {
        try {
            this.toolbar.setHeight(this.displayConfig.toolbar.height);
            this.toolbar.setMargin(this.displayConfig.toolbar.margin);

            this.northPanel.flex = this.displayConfig.northPanel.flex;
            this.northPanel.setMargin(this.displayConfig.northPanel.margin);

            this.centerPanel.setMargin(this.displayConfig.centerPanel.margin);
            this.centerPanel.addCls(this.displayConfig.centerPanel.cls);
            this.centerPanel.addBodyCls(this.displayConfig.centerPanel.bodyCls);

            this.southPanel.setHeight(this.displayConfig.southPanel.height);
            this.southPanel.setMargin(this.displayConfig.southPanel.margin);
            this.southPanel.addCls(this.displayConfig.southPanel.cls);
        } catch (err) {
            console.log("Error while applying customization");
        }
    },

    createStore: function () {
        return Ext.create('Ext.data.JsonStore', {
            fields: ['id', 'name', 'description', 'image', 'authorized', 'maintenance', 'maintenanceText', 'priority', 'categoryProject'],
            sorters: {
                property: 'priority',
                direction: 'ASC'
            }
        });
    },

    createDataview: function (store) {
        return Ext.create('Ext.view.View', {
            store: store,
            tpl: new Ext.XTemplate('<ul>', '<tpl for=".">',
                '<li id="{id}" ',
                '<tpl if="authorized == true">',
                'class="project',
                '<tpl if="maintenance">',
                ' sitools-maintenance-portal',
                '</tpl>',
                '"',
                '</tpl>',
                '<tpl if="authorized == false">',
                'class="project projectUnauthorized"',
                '</tpl>',
                '>',
                '<img width="80" height="80" src="{image}" />', '<p data-qtip="{name}" class="projectName">{name}</p>',
                '<p class="projectDescription" data-qtip="{description}">{description} </p>', '</li>', '</tpl>', '</ul>',
                {
                    compiled: true,
                    disableFormats: true,
                    isAuthorized: function (authorized) {
                        return authorized === true;
                    }
                }),
//            id : 'projectDataView',
            autoScroll: true,
            cls: 'projectDataView',
            itemSelector: 'li.project',
            overItemCls: 'project-hover',
            mode: 'SINGLE'
        });
    },

    createPortlet: function (portletObject) {
        return Ext.create('sitools.clientportal.view.portal.Portlet', {
            title: portletObject.category,
            height: 200,
            boxMaxHeight: 430,
            items: [portletObject.dataview],
            resizable: false,
            listeners: {
                scope: this,
                afterrender: function (portlet) {
                    if (portlet.getHeight() > portlet.boxMaxHeight) {
                        portlet.autoHeight = false;
                        portlet.setHeight(portlet.boxMaxHeight);
                        portlet.doLayout();
                    }
                }
            }
        });
    }

});
