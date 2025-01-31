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
package test;

import org.testng.annotations.Test;

import primitive.Menu;
import primitive.SEL;
import primitive.SELTestCase;

public class ADM02 extends SELTestCase {

  @Test(dependsOnGroups = { "initClientAdmin.*" })
  public void selectUsers() throws Exception {
    Menu.select("usrNodeId");
    SEL.sleep(1000);
  }

  @Test(dependsOnGroups = { "initClientAdmin.*" })
  public void selectGroups() throws Exception {
    Menu.select("grpNodeId");
    SEL.sleep(1000);
  }

  @Test(dependsOnGroups = { "initClientAdmin.*" }, enabled = false)
  public void createUser() throws Exception {
    Menu.select("usrNodeId");
    // TODO
    // ...
  }
}
