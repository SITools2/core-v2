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

/**
 * Populate the div x-headers of the sitools Desktop.
 *
 * @cfg {String} htmlContent html content of the headers,
 * @cfg {Array} modules the modules list
 * @class sitools.user.component.entete.Entete
 * @extends Ext.Panel
 */
Ext.define("sitools.user.controller.footer.FooterController", {

    extend: 'Ext.app.Controller',

    views: ['footer.FooterView'],

    config: {
        FooterView: null
    },

    heightNormalMode: 0,
    heightMaximizeDesktopMode: 0,

    statics: {
        showFooterLink: function (url, linkName) {
            var nameIframe = (!Ext.isEmpty(i18n.get(linkName))) ? i18n.get(linkName) : linkName;

            sitools.user.utils.DataviewUtils.showDisplayableUrl(url, true, {
                name: nameIframe,
                title: nameIframe
            });
        }
    },

    init: function () {

        this.getApplication().on('headerLoaded', this.onProjectLoaded, this);

        Ext.create('Ext.data.Store', {
            fields: ['name', 'url'],
            storeId: 'linkStore'
        });

        this.control({
            'container#leftPanel': {
                afterrender: function (panel) {
                	var footer = Ext.get("footerLogo");
                	if (footer) {
                		footer.on('load', function () {
                			footer.alignTo(panel.getEl(), "c-c", [-60, 2]);
                		}, this);
                	}
                }
            },
            'panel#footer': {
                afterrender: function (footerView) {
                    if (!footerView.defaultBottom) {
                        footerView.setHeight(0);
                    } else {
                        Ext.Ajax.request({
                            url: this.versionUrl,
                            method: 'GET',
                            scope: this,
                            success: function (ret) {
                                var json = Ext.decode(ret.responseText);
                                if (!json.success) {
                                    Ext.Msg.alert(i18n.get('label.warning'), json.message);
                                    return false;
                                }
                                var info = json.info;
                                var copyright = info.copyright || "";

                                footerView.down('label#credits').setText(Ext.String.format(footerView.footer.text || "", copyright), false);

                                var bottomEl = Ext.get(footerView.renderTo);
                                footerView.setHeight(bottomEl.getHeight());
                                footerView.heightNormalMode = bottomEl.getHeight();


                            }
                        });
                    }

                },
                resize: function (me) {
                    if (!me.defaultBottom) {
                        me.setHeight(0);
                    } else {
                        me.setSize(Ext.get(me.renderTo).getSize());
                        Ext.get("footerLogo").alignTo(me.down('container#leftPanel').getEl(), "c-c");
                        me.down("panel#sitools_build_by").alignTo(me.down('panel#middlePanel').getEl(), "c-c");

                        var fr = Ext.get("sitools_footer_right");
                        if (Ext.isDefined(fr) && !Ext.isEmpty(fr)) {
                            fr.alignTo(me.down('panel#rightPanel').getEl(), "c-c");
                        }
                    }
                },
                maximizeDesktop: this.onMaximizeDesktop,
                minimizeDesktop: this.onMinimizeDesktop
            }
        });

        this.callParent(arguments);
    },

    onProjectLoaded: function () {
        this.fillLinks();
        this.versionUrl = loadUrl.get('APP_URL') + '/version';

        if (Desktop.getBottomEl().getHeight() != 0) {
            var project = Ext.getStore('ProjectStore').getAt(0);
            this.FooterView = Ext.create('sitools.user.view.footer.FooterView', {
                footer: project.get('footer')
            });
        }

        this.getApplication().fireEvent('footerLoaded');
    },

    onMaximizeDesktop: function () {
        var footerView = this.getFooterView();

        if (Ext.isEmpty(footerView)) {
            return;
        }

        this.getFooterView().container.setHeight(0);
        this.getFooterView().hide();
    },

    onMinimizeDesktop: function () {
        var footerView = this.getFooterView();

        if (Ext.isEmpty(footerView)) {
            return;
        }

        footerView.container.dom.style.height = "";
        footerView.setSize(Desktop.getBottomEl().getSize());
        footerView.show();
    },

    fillLinks: function () {
        var project = Ext.getStore('ProjectStore').getAt(0);
        var projectLinks = project.links();
        var linkStore = Ext.getStore('linkStore');
        projectLinks.each(function (link) {
            linkStore.add(link);
        }, this);
    }
});