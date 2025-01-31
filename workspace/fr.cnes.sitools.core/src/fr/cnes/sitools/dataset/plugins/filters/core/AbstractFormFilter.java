     /*******************************************************************************
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
 ******************************************************************************/
package fr.cnes.sitools.dataset.plugins.filters.core;

import java.util.ArrayList;
import java.util.List;

import org.restlet.data.Status;
import org.restlet.resource.ResourceException;

import fr.cnes.sitools.dataset.DataSetApplication;
import fr.cnes.sitools.dataset.dto.ColumnConceptMappingDTO;
import fr.cnes.sitools.dataset.dto.DictionaryMappingDTO;
import fr.cnes.sitools.dataset.filter.business.AbstractFilter;

/**
 * Abstract Class for Dataset Filters with a particular signature generated by Form components
 * 
 * 
 * @author m.gond
 */
public abstract class AbstractFormFilter extends AbstractFilter {
  /**
   * The index of TYPE
   */
  public static final int TYPE = 0;
  /**
   * The index of COLUMN
   */
  public static final int COLUMN = 1;
  /**
   * The index of Values
   */
  public static final int VALUES = 2;

  /** The TEMPLATE_PARAM */
  public static final String TEMPLATE_PARAM = "p[#]";

  // CONCEPT CONSTANTS

  /** The TEMPLATE_PARAM */
  public static final String TEMPLATE_PARAM_CONCEPT = "c[#]";

  /**
   * The index of COLUMN
   */
  public static final int DICO_CONCEPT = 1;

  /**
   * Get a columnAlias in the list of parameters
   * <p>
   * If isConcept is true, it looks for the column alias in the dictionary mapping of the dataset
   * </p>
   * <p>
   * If isConcept is false, it looks for the column in the parameters
   * </p>
   * 
   * @param isConcept
   *          true if its a concept, false if its directly a columnAlias
   * @param parameters
   *          the list of parameters
   * @param dsApplication
   *          the DataSetApplicaiton
   * @return the columnAlias
   */
  public String getColumnAlias(boolean isConcept, String[] parameters, DataSetApplication dsApplication) {
    String columnAlias = null;
    if (isConcept) {
      String[] dicoConcept = parameters[DICO_CONCEPT].split(",");
      if (dicoConcept.length != 2) {
        throw new ResourceException(Status.CLIENT_ERROR_BAD_REQUEST, "Please provide dictionaryName and concept name");
      }

      String dictionary = dicoConcept[0];
      String concept = dicoConcept[1];
      DictionaryMappingDTO dicoDTO = dsApplication.getColumnConceptMappingDTO(dictionary);
      if (dicoDTO != null) {
        List<ColumnConceptMappingDTO> columnConcepts = dicoDTO.getMappingFromConcept(concept);
        if (columnConcepts != null && columnConcepts.size() == 1) {
          columnAlias = columnConcepts.get(0).getColumnAlias();
        }
        else if (columnConcepts.size() > 1) {
          throw new ResourceException(Status.CLIENT_ERROR_BAD_REQUEST,
              "More than 1 column found for this dictionary mapping");
        }
      }

    }
    else {
      columnAlias = parameters[COLUMN];
    }

    return columnAlias;
  }

  /**
   * Get a list of columnAlias in the list of parameters
   * <p>
   * If isConcept is true, it looks for all the column alias in the dictionary mapping of the dataset
   * </p>
   * <p>
   * If isConcept is false, it looks for the list of column alias in the parameters
   * </p>
   * 
   * @param isConcept
   *          true if its a concept, false if its directly a columnAlias
   * @param parameters
   *          the list of parameters
   * @param dsApplication
   *          the DataSetApplicaiton
   * @return a list of columnAlias
   */
  public String[] getColumnsAlias(boolean isConcept, String[] parameters, DataSetApplication dsApplication) {
    String[] columnsAlias = null;
    if (isConcept) {
      List<String> colAliasList = new ArrayList<String>();
      String[] dicoConcept = parameters[DICO_CONCEPT].split(",");
      if (dicoConcept.length < 2) {
        throw new ResourceException(Status.CLIENT_ERROR_BAD_REQUEST, "Please provide dictionaryName and concept name");
      }

      String dictionary = dicoConcept[0];
      DictionaryMappingDTO dicoDTO = null;
      for (int i = 1; i < dicoConcept.length; i++) {
        String concept = dicoConcept[i];
        if (dicoDTO == null) {
          dicoDTO = dsApplication.getColumnConceptMappingDTO(dictionary);
        }
        if (dicoDTO != null) {
          List<ColumnConceptMappingDTO> columnConcepts = dicoDTO.getMappingFromConcept(concept);
          if (columnConcepts != null && columnConcepts.size() == 1) {
            colAliasList.add(columnConcepts.get(0).getColumnAlias());
          }
          else if (columnConcepts.size() > 1) {
            throw new ResourceException(Status.CLIENT_ERROR_BAD_REQUEST,
                "More than 1 column found for this dictionary mapping");
          }
        }

      }
      columnsAlias = colAliasList.toArray(new String[0]);
    }
    else {
      columnsAlias = parameters[COLUMN].split(",");
    }

    return columnsAlias;
  }
}
