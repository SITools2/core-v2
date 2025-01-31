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
package fr.cnes.sitools;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.File;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.restlet.Context;

import fr.cnes.sitools.common.SitoolsSettings;
import fr.cnes.sitools.common.application.ContextAttributes;
import fr.cnes.sitools.common.model.ResourceCollectionFilter;
import fr.cnes.sitools.project.ProjectStoreInterface;
import fr.cnes.sitools.project.ProjectStoreXMLMap;
import fr.cnes.sitools.project.model.Project;
import fr.cnes.sitools.server.Consts;

/**
 * Test ProjectStoreXML
 * 
 * @since UserStory : ADM Projects - Sprint : 4
 * @author jp.boignard (AKKA Technologies)
 */
public class ProjectStoreXMLTestCase extends AbstractSitoolsTestCase {
  /**
   * static xml store instance for the test
   */
  private static ProjectStoreInterface store = null;

  @Override
  protected String getBaseUrl() {
    return super.getBaseUrl() + SitoolsSettings.getInstance().getString(Consts.APP_PROJECTS_URL);
  }

  @Override
  protected String getTestRepository() {
    return super.getTestRepository() + SitoolsSettings.getInstance().getString(Consts.APP_PROJECTS_STORE_DIR) + "/map";
  }

  @Before
  @Override
  /**
   * Create store
   * @throws Exception
   */
  public void setUp() throws Exception {
    if (store == null) {
      File storeDirectory = new File(getTestRepository());
      storeDirectory.mkdirs();
      cleanDirectory(storeDirectory);
      cleanMapDirectories(storeDirectory);
      Context ctx = new Context();
      ctx.getAttributes().put(ContextAttributes.SETTINGS, SitoolsSettings.getInstance());
      store = new ProjectStoreXMLMap(storeDirectory, ctx);
    }
  }

  @After
  @Override
  /**
   * Nothing
   * @throws Exception
   */
  public void tearDown() throws Exception {
  }

  /**
   * Test CRUD scenario.
   */
  @Test
  public void testCRUD() {
    assertNone();
    create();
    retrieve();
    update();
    delete();
    assertNone();
  }

  /**
   * Invokes store.getArray and check result is an empty array
   */
  public void assertNone() {
    Project[] list = store.getArray();
    assertNotNull(list);
    assertTrue(list.length == 0);
  }

  /**
   * Invokes store.create and asserts result is conform.
   */
  public void create() {
    Project element = new Project();
    element.setId("testCreateProject");
    element.setName("test_Name");
    element.setDescription("test_Description");
    Project result = store.create(element);
    assertNotNull(result);
    assertEquals("test_Name", result.getName());
    assertEquals("test_Description", result.getDescription());
  }

  /**
   * Invokes store.retrieve and asserts result is conform.
   */
  public void retrieve() {
    Project result = store.retrieve("testCreateProject");
    assertNotNull(result);
    result.getId().equals("testCreateProject");
  }

  /**
   * Invokes store.update and asserts result is conform.
   */
  public void update() {
    Project element = new Project();
    element.setId("testCreateProject");
    element.setName("test_Name_modified");
    element.setDescription("test_Description_modified");
    Project result = store.update(element);
    assertNotNull(result);
    assertEquals("test_Name_modified", result.getName());
    assertEquals("test_Description_modified", result.getDescription());
  }

  /**
   * Invokes store.delete and asserts result is conform.
   */
  public void delete() {
    boolean result = store.delete("testCreateProject");
    assertTrue(result);

    Project testDeletedProject = store.retrieve("testCreateProject");
    assertNull(testDeletedProject);
  }

  /**
   * Test des requetes avec XQuery / XPath >> quand nous aurons une BD XML Test de creation/consultation/suppression
   * multiples
   */
  @Test
  public void testGetProjectsByXQuery() {
    assertNone();

    create();
    fillDatabase(10);

    // // all
    // Project[] list = store.getArrayByXQuery("//Project");
    // assertNotNull(list);
    // assertEquals(list.length, 1);
    //
    // String id = "testCreateProject";
    // list = store.getArrayByXQuery("//Project[id ='"+ id +"']");
    // assertNotNull(list);
    // assertTrue(list[0].getId().equals(id));
    //
    //
    // // startsWith
    // String start = "test";
    // list = store.getArrayByXQuery("//Project[starts-with(firstName,'"+start+"')]");
    // assertNotNull(list);
    // assertTrue(list[0].getFirstName().startsWith(start));

    Project[] completeList = store.getArray();
    assertNotNull(completeList);

    // pagination list
    ResourceCollectionFilter filter = new ResourceCollectionFilter(2, 5, "test");
    Project[] newList = store.getArray(filter);
    assertNotNull(newList);

    delete();
    clearDatabase(10);

    assertNone();
  }

  /**
   * Invokes store.create for numerous elements ( "test"+no for identifier)
   * 
   * @param nbElement
   *          the number of elements to be created
   */
  private void fillDatabase(int nbElement) {
    Project element = null;
    for (int i = 0; i < nbElement; i++) {
      element = new Project();
      element.setId("test" + i);
      element.setName("test_Name" + i);
      element.setDescription("test_Description" + i);
      Project result = store.create(element);
      assertNotNull(result);
    }
  }

  /**
   * Invokes store.delete on the "test"+no elements with 0 <= no < nbElement
   * 
   * @param nbElement
   *          number of element to clear suppose elements are identifier by "test"+no
   */
  private void clearDatabase(int nbElement) {
    for (int i = 0; i < nbElement; i++) {
      store.delete("test" + i);
    }
  }

}
