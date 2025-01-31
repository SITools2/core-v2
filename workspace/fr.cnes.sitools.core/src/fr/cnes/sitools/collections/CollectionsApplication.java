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
package fr.cnes.sitools.collections;

import org.restlet.Context;
import org.restlet.Request;
import org.restlet.Response;
import org.restlet.Restlet;
import org.restlet.ext.wadl.ApplicationInfo;
import org.restlet.ext.wadl.DocumentationInfo;
import org.restlet.routing.Router;

import fr.cnes.sitools.common.application.ContextAttributes;
import fr.cnes.sitools.common.application.SitoolsApplication;
import fr.cnes.sitools.common.model.Category;

/**
 * Application for managing Collection
 * 
 * Dependencies : DataSets columns references Collection notions.
 * 
 * @author AKKA
 * 
 */
public final class CollectionsApplication extends SitoolsApplication {

  /** Store */
  private CollectionStoreInterface store = null;

  /**
   * Constructor
   * 
   * @param context
   *          Restlet Host Context
   */
  public CollectionsApplication(Context context) {
    super(context);
    this.store = (CollectionStoreInterface) context.getAttributes().get(ContextAttributes.APP_STORE);
  }

  @Override
  public void sitoolsDescribe() {
    setCategory(Category.ADMIN);
    setName("CollectionApplication");
    setDescription("Management of Collections of datasets");
  }

  @Override
  public Restlet createInboundRoot() {

    Router router = new Router(getContext());

    router.attachDefault(CollectionsCollectionResource.class);
    router.attach("/{collectionId}", CollectionsResource.class);
    router.attach("/{collectionId}/concepts/{dictionaryId}", CommonConceptsResource.class);
    router.attach("/{collectionId}/properties", PropertyListResource.class);

    return router;
  }

  /**
   * Gets the store value
   * 
   * @return the store
   */
  public CollectionStoreInterface getStore() {
    return store;
  }

  @Override
  public ApplicationInfo getApplicationInfo(Request request, Response response) {
    ApplicationInfo result = super.getApplicationInfo(request, response);
    DocumentationInfo docInfo = new DocumentationInfo("Dataset collections managment");
    docInfo.setTitle("API documentation.");
    result.getDocumentations().add(docInfo);
    return result;
  }

}
