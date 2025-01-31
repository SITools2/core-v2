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
Ext.namespace('sitools.component.projects');

Ext.define('sitools.admin.graphs.GraphsNodeWin', { 
    extend : 'Ext.Window',
    width : 350,
    modal : true,
    closable : false,

    initComponent : function () {
        this.title = i18n.get('label.nodeDescription');

        
        var listenerEnter = {
            scope: this,
            specialkey: function (field, e) {
                if (e.getKey() == e.ENTER) {
                    this._onOK();
                }
            }
        };
        
        /* paramétres du formulaire */
        this.itemsForm = [{
            fieldLabel : i18n.get('label.name'),
            name : 'name',
            anchor : '100%',
            allowBlank : false,
            listeners : {
            	scope: this,
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        this._onOK();
                    }
                },
                afterrender: function (textfield) {
                    Ext.defer(textfield.focus, 500, textfield);
                }
            }
        }, {
            fieldLabel : i18n.get('label.description'),
            name : 'description',
            anchor : '100%',
            listeners : listenerEnter
        }, {
            xtype : 'sitoolsSelectImage',
            name : 'image',
            fieldLabel : i18n.get('label.image'),
            anchor : '100%',
            growMax : 400,
            listeners : listenerEnter
        } ];

        this.bbar = {
            xtype : 'toolbar',
            defaults : {
                scope : this
            },
            items : [ '->', {
                text : i18n.get('label.ok'),
                handler : this._onOK
            }, {
                text : i18n.get('label.cancel'),
                handler : this._onCancel
            } ]
        };

        this.formPanel = Ext.create('Ext.form.Panel', {
            labelWidth : 100,
            border : false,
            bodyBorder : false,
            padding : '5 5 5 5',
            defaultType : 'textfield',
            items : this.itemsForm

        });

        this.items = [ this.formPanel ];
        this.callParent(arguments);
    },

    afterRender : function () {
        this.callParent(arguments);

        if (this.mode == 'edit') {
            var node = this.node;
            var form = this.formPanel.getForm();
            var rec = {};
            rec.name = node.get('text');
            rec.image = node.get('image').url;
            rec.description = node.get('description');

            form.setValues(rec);
        }
    },

    _onOK : function () {
        var form = this.formPanel.getForm();

        if (!form.isValid()) {
            return;
        }

        var values = form.getValues();
        var image = {};
        
        if (!Ext.isEmpty(values.image)) {
            image.url = values.image;
            image.type = "Image";
            image.mediaType = "Image";
        }

        if (this.mode == 'edit') {
            this.node.set('text', values.name);
            this.node.set('description', values.description);
            this.node.set('image', image);

        } else {
            var newNode = Ext.create('sitools.admin.graphs.GraphNodeModel', {
                text : values.name,
                image : image,
                description : values.description,
                type : "node",
                children : []
            });
            
            if (!this.node.isExpanded()) {
                this.node.expand();
            }
            this.node.appendChild(newNode);
        }

        var saveButton = this.graphTree.graphsCrud.down('button#saveGraphBtnId');
        saveButton.addCls('not-save-textfield');

        this.close();
    },

    _onCancel : function () {
        this.destroy();
    },

    _onUpload : function () {
        Ext.msg.alert("Information", "TODO");
    }

});
