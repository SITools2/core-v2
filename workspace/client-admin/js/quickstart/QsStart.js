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
/*global Ext, sitools, ID, i18n, document, showResponse, alertFailure*/
Ext.namespace('sitools.admin.quickstart');

Ext.define('sitools.admin.quickstart.QsStart', {
    extend: 'Ext.panel.Panel',
    widget: 'widget.qsStart',

    forceLayout: true,
    layout: {
        type: "vbox",
        align: 'center',
        pack: 'start'
    },
    border: false,
    bodyCls: 'quickStart',
    initComponent: function () {

        var title = Ext.create('Ext.form.Label', {
            cls: 'qs-h1',
            html: i18n.get('label.qsStartTitle')
        });

        var desc = Ext.create('Ext.form.Label', {
            cls: 'qs-div',
            id: "start-desc",
            html: i18n.get('label.qsStartDesc')
        });

        var img = Ext.create('Ext.form.Label', {
            html: '<img id="qs-logo" class="bouton_action" src="/sitools/client-admin/res/html/quickStart/icons/quick_start_logo.png"/>',
            listeners: {
                afterrender: function (sitools) {
                    Ext.get("qs-logo").on('load', function () {

                        sitools.getEl().on('mouseleave', function (e, t, o) {
                            Ext.get(t).update("<img id='qs-projet-logo' class='bouton_action' src='/sitools/client-admin/res/html/quickStart/icons/quick_start_logo.png'/>");
                        });
                        sitools.getEl().on('mouseenter', function (e, t, o) {
                            Ext.get(t).update("<img id='qs-projet-logo' class='bouton_action' src='/sitools/client-admin/res/html/quickStart/icons/quick_start_logo_hover.png'/>");

                        });
                        sitools.getEl().on('click', function (e, t, o) {
                            var nextBtn = this.ownerCt.qs.welcomePanel.dockedItems.getAt(0).items.items[1];
                            nextBtn.toggle(true);
                        }, this);

                        new Ext.ToolTip({
                            target: 'qs-logo',
                            anchor: 'right',
                            autoShow: true,
                            showDelay: 0,
                            floating: true,
                            html: "<b>Begin</b>"
                        });

                        sitools.getEl().alignTo("start-desc", "tr-br");

                    }, this);
                }
            }
        });
        this.items = [title, desc, img];

        this.callParent(arguments);
    }
});
