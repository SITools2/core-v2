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
/*global Ext, sitools, ID, i18n, document, showResponse, alertFailure, LOCALE, ImageChooser, 
 showHelp*/

Ext.namespace('sitools.admin.fileEditor');

Ext.define('sitools.admin.fileEditor.FileEditorProp', {
    extend: 'Ext.Window',
    alias: 'widget.s-fileEditorProp',
    width: 700,
    height: 480,
    mediaType: null,

    initComponent: function () {
        this.title = i18n.get('label.modifyFile') + this.fileName;
        this.layout = 'fit';
        this.modal = this.modalType;
        var buttons;

        if (this.modal === true) {
            buttons = [{
                text: i18n.get('label.save'),
                scope: this,
                handler: this.onValidate
            }, {
                text: i18n.get('label.cancel'),
                scope: this,
                handler: function () {
                    this.close();
                }
            }];
        } else {
            buttons = [{
                text: i18n.get('label.cancel'),
                scope: this,
                handler: function () {
                    this.close();
                }
            }];
        }

        var htmlEditor = Ext.create('Ext.panel.Panel', {
            renderTo: Ext.getBody(),
            width: 550,
            height: 250,
            border: false,
            bodyBorder: false,
            layout: 'fit',
            items: {
                xtype: 'htmleditor',
                enableColors: false
            }
        });

        this.items = [htmlEditor];
        this.buttons = buttons;

        this.listeners = {
            scope: this,
            activate: function () {
                var htmlEditor = this.down('htmleditor');
                htmlEditor.syncValue();
                htmlEditor.toggleSourceEdit(true);
            }
        };

        Ext.tip.QuickTipManager.init();
        this.callParent(arguments);
    },

    onRender: function () {
        this.callParent(arguments);

        if (this.url) {
            Ext.Ajax.request({
                url: this.url,
                method: 'GET',
                scope: this,
                success: function (ret) {
                    var data = ret.responseText;
                    this.down('htmleditor').setValue(data);
                },
                failure: alertFailure
            });
        }
    },

    onValidate: function () {
        var text = this.down('htmleditor').getValue();

        Ext.Ajax.request({
            url: this.url,
            method: 'PUT',
            scope: this,
            headers: {
                'Content-Type': this.mediaType
            },
            jsonData: text,
            success: function (ret) {
                popupMessage(i18n.get('label.information'), i18n.get('label.changeSaved'), null, 'x-info');
                this.parentCrudEditor.store.reload();
                this.close();
            },
            failure: alertFailure
        });
    }
});

