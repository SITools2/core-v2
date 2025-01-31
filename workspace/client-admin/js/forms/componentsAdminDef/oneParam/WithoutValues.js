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
Ext.namespace('sitools.admin.forms.componentsAdminDef.oneParam');

/**
 * A Form Panel to display Administration for for form Components without Values. 
 * @class sitools.admin.forms.componentsAdminDef.oneParam.WithoutValues
 * @extends sitools.admin.forms.componentsAdminDef.oneParam.Abstract
 */
Ext.define('sitools.admin.forms.componentsAdminDef.oneParam.WithoutValues', { 
    extend : 'sitools.admin.forms.componentsAdminDef.oneParam.Abstract', 
    height : 380,
//    id : "sitools.component.forms.definitionId",
    initComponent : function () {
        this.winPropComponent.specificHeight = this.height;
        this.winPropComponent.specificWidth = 400;
        this.callParent(arguments);
        this.componentDefaultValue = Ext.create("Ext.form.TextField", {
            fieldLabel : i18n.get('label.defaultValue'),
            name : 'componentDefaultValue',
            anchor : '100%',
            itemId : 'defaultValue'
        });
        this.add(this.componentDefaultValue);

    },
    afterRender : function () {
        this.callParent(arguments);
        if (this.action == 'modify') {
            if (!Ext.isEmpty(this.selectedRecord.data.defaultValues)) {
                this.componentDefaultValue.setValue(this.selectedRecord.data.defaultValues[0]);
            }
        }
    },
    _onValidate : function (action, formComponentsStore) {
        var f = this.getForm();
        if (!f.isValid()) {
            Ext.Msg.alert(i18n.get('label.error'), i18n.get('warning.invalidForm'));
            return false;
        }
        var param1, defaultValue, code;
        if (action == 'modify') {
            var rec = this.selectedRecord;
            param1 = Ext.isEmpty(f.findField('PARAM1')) ? "" : f.findField('PARAM1').getValue();
            code = [param1];
            var labelParam1 = Ext.isEmpty(f.findField('LABEL_PARAM1')) ? "" : f.findField('LABEL_PARAM1').getValue();
            var css = Ext.isEmpty(f.findField('CSS')) ? "" : f.findField('CSS').getValue();
            defaultValue = Ext.isEmpty(f.findField('componentDefaultValue')) ? "" : f.findField('componentDefaultValue').getValue();

            rec.set('label', labelParam1);
            rec.set('code', code);
            rec.set('css', css);
//            rec.set('componentDefaultHeight', f.findField('componentDefaultHeight').getValue());
//            rec.set('componentDefaultWidth', f.findField('componentDefaultWidth').getValue());

            rec.set('defaultValues', [ defaultValue ]);
        } else {
            defaultValue = Ext.isEmpty(f.findField('componentDefaultValue')) ? "" : f.findField('componentDefaultValue').getValue();

            // Génération de l'id
            var lastId = 0;
//            var greatY = 0;
            formComponentsStore.each(function (component) {
                if (component.data.id > lastId) {
                    lastId = parseInt(component.data.id, 10);
                }
//                if (component.data.ypos > greatY) {
//                    greatY = parseInt(component.data.ypos, 10)  + parseInt(component.data.height, 10);
//                }

            });
            var componentId = lastId + 1;
            componentId = componentId.toString();
//            var componentYpos = greatY + 10;
            param1 = Ext.isEmpty(f.findField('PARAM1')) ? "" : f.findField('PARAM1').getValue();
            code = [param1];
            formComponentsStore.add({
                label : f.findField('LABEL_PARAM1').getValue(),
                type : this.ctype,
                code : code,
                defaultValue : defaultValue,
                width : f.findField('componentDefaultWidth').getValue(),
                height : f.findField('componentDefaultHeight').getValue(),
                id : componentId,
                ypos : this.xyOnCreate.y,
                xpos : this.xyOnCreate.x, 
                css : f.findField('CSS').getValue(),
                jsAdminObject : this.jsAdminObject,
                jsUserObject : this.jsUserObject,
                defaultValues : [ defaultValue ],
                containerPanelId : this.containerPanelId
            });
        }
        return true;
    }

});
