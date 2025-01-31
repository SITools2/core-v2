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
package fr.cnes.sitools.units.dimension;

import org.restlet.Context;

import fr.cnes.sitools.common.application.ContextAttributes;
import fr.cnes.sitools.common.application.SitoolsApplication;

/**
 * Base class for dimension application
 * @author m.marseille (AKKA technologies)
 */
public abstract class AbstractDimensionApplication extends SitoolsApplication {
  
  /** Store */
  private DimensionStoreInterface store = null;
  
  /**
   * Constructor with context
   * @param context the Restlet context
   */
  public AbstractDimensionApplication(Context context) {
    super(context);
    setStore((DimensionStoreInterface) context.getAttributes().get(ContextAttributes.APP_STORE));
  }

  /**
   * Sets the value of store
   * @param store the store to set
   */
  public final void setStore(DimensionStoreInterface store) {
    this.store = store;
  }

  /**
   * Gets the store value
   * @return the store
   */
  public final DimensionStoreInterface getStore() {
    return store;
  }

}
