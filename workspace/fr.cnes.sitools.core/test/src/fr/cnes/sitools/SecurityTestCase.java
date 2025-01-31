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
import static org.junit.Assert.assertTrue;

import org.junit.BeforeClass;
import org.junit.Test;
import org.restlet.data.ChallengeRequest;
import org.restlet.data.ChallengeResponse;
import org.restlet.data.ChallengeScheme;
import org.restlet.data.MediaType;
import org.restlet.engine.Engine;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;
import org.restlet.resource.ResourceException;

import com.thoughtworks.xstream.XStream;

import fr.cnes.sitools.common.SitoolsSettings;
import fr.cnes.sitools.common.SitoolsXStreamRepresentation;
import fr.cnes.sitools.common.XStreamFactory;
import fr.cnes.sitools.common.model.Response;
import fr.cnes.sitools.login.SitoolsAuthenticationInfo;
import fr.cnes.sitools.server.Consts;
import fr.cnes.sitools.util.RIAPUtils;

/**
 * Test security configuration Authentication / Authorization HTTP_BASIC
 * 
 * @author jp.boignard (AKKA Technologies)
 * 
 */
public class SecurityTestCase extends AbstractSitoolsServerTestCase {
  @Override
  protected String getBaseUrl() {
    return super.getBaseUrl() + SitoolsSettings.getInstance().getString(Consts.APP_LOGIN_PATH_URL);
  }

  /**
   * Executed once before all test methods
   */
  @BeforeClass
  public static void before() {
    setup();
    SitoolsSettings.getInstance().setAuthenticationSCHEME("HTTP_BASIC");
    start();
  }

  /**
   * Test Authorization strategy configuration for an application
   * 
   * SPRINT 5 : La configuration des authorizations s'effectue via l'IHM d'administration. Menu Security / Applications
   * : L'administration choisit une application et configure les roles authorisés et pour chacun les méthodes.
   * 
   * Au démarrage du serveur, les applications core / dynamiques sont créées. Au moment de l'attachement (méthode
   * createInbound) l'appel à la méthode setSecurity(router) permet : - créer un ChallengeAuthenticator sur la base du
   * SitoolsMemoryRealm global au serveur - créer un Authorizer propre à l'application et fonction de la configuration.
   * 
   * UserStory : ADM6.2 terminée.
   * 
   * TODO SPRINT 6 :
   * 
   * - mise à jour de la configuration des authorisations sur une application devrait être rendue effective
   * immédiatement => redémarrage de l'application OU => redémarrage du serveur ? selon les applications ?
   * 
   * 
   * TODO TEST UNITAIRE service : - CRUD d'authorisations sur une applications. - Contrôle que les authorisations sont
   * bien effectives.
   */
  // public void testApplicationAuthorization() {
  //
  // }

  /**
   * Test Authentication strategy
   * 
   * Resource /login optional authenticator in order to return a sitools response with true/false according to the
   * authentication.
   */
  @Test
  public void testServerAuthentificationLogin() {
    String user = "admin";
    String password = "admin";
    String url = getBaseUrl() + "/login";

    ClientResource resource = new ClientResource(url);

    resource.setChallengeResponse(ChallengeScheme.HTTP_BASIC, user, password);

    Representation result = null;

    // Send the first request with unsufficient authentication.
    try {
      result = resource.get(getMediaTest());
    }
    catch (ResourceException re) {
      assertTrue(false);
    }
    // Should be 401, since the client needs some data sent by the server in
    // order to complete the ChallengeResponse.
    assertEquals(200, resource.getStatus().getCode());

    // recuperer la reponse
    Response response = getResponse(getMediaTest(), result, SitoolsAuthenticationInfo.class, false);
    assertTrue(response.getSuccess());

    // WADL de la resource
    this.createWadl(url, "security-basic");
  }

  /**
   * Test Authentication strategy configuration for a server
   * 
   * SPRINT 5 : Il n'y a pas de configuration de l'authentification. L'authentification BASIC est utilisée pour accéder
   * aux applications pour lesquelles une configuration des authorizations a été réalisée :
   * 
   * SPRINT 6 : On doit pouvoir mettre à jour la configuration de l'authentification pour l'ensemble du serveur en
   * choisissant le schema BASIC / DIGEST et les propriétés associées. - realm (nom de domaine "SITOOLS" ou nom machine
   * + nom du serveur utilisateurs ?) - clé supplémentaire pour DIGEST
   * 
   * SPRINT 6 : à voir la mise à jour de la configuration nécessite un redémarrage des applications ? du serveur ?
   */
  @Test
  public void testServerAuthentificationBasic() {

    // BAD PASSWORD
    String user = "admin";
    String password = "toto";
    String url = getBaseUrl() + "/login-mandatory";

    ClientResource resource = new ClientResource(url);

    resource.setChallengeResponse(ChallengeScheme.HTTP_BASIC, user, password);
    // Send the first request with unsufficient authentication.
    try {
      resource.get(getMediaTest());
    }
    catch (ResourceException re) {
      re.printStackTrace();
    }
    // Should be 401, since the client needs some data sent by the server in
    // order to complete the ChallengeResponse.
    // System.out.println(resource.getStatus());
    assertEquals(401, resource.getStatus().getCode());

    // RIGHT PASSWORD
    password = "admin";

    // Complete the challengeResponse object according to the server's data
    // 1- Loop over the challengeRequest objects sent by the server.
    ChallengeRequest c1 = null;
    for (ChallengeRequest challengeRequest : resource.getChallengeRequests()) {
      if (ChallengeScheme.HTTP_BASIC.equals(challengeRequest.getScheme())) {
        c1 = challengeRequest;
        break;
      }
    }

    // 2- Create the Challenge response used by the client to authenticate its requests.
    ChallengeResponse challengeResponse = new ChallengeResponse(c1, resource.getResponse(), user,
        password.toCharArray(), ChallengeScheme.HTTP_BASIC.toString());

    resource.setChallengeResponse(challengeResponse);

    // Try authenticated request
    Representation result = resource.get(getMediaTest());
    // Should be 200.
    System.out.println(resource.getStatus());
    assertEquals(200, resource.getStatus().getCode());

    // recuperer la reponse
    Response response = getResponse(getMediaTest(), result, SitoolsAuthenticationInfo.class, false);
    assertTrue(response.getSuccess());

    // WADL de la resource
    this.createWadl(url, "security-basic");
  }

  // ------------------------------------------------------------
  // RESPONSE REPRESENTATION WRAPPING

  /**
   * REST API Response Representation wrapper for single or multiple items expexted
   * 
   * @param media
   *          MediaType expected
   * @param representation
   *          service response representation
   * @param dataClass
   *          class expected for items of the Response object
   * @param isArray
   *          if true wrap the data property else wrap the item property
   * @return Response
   */
  public static Response getResponse(MediaType media, Representation representation, Class<?> dataClass, boolean isArray) {
    try {
      if (!media.isCompatible(MediaType.APPLICATION_JSON) && !media.isCompatible(MediaType.APPLICATION_XML)) {
        Engine.getLogger(AbstractSitoolsTestCase.class.getName()).warning("Only JSON or XML supported in tests");
        return null;
      }

      XStream xstream = XStreamFactory.getInstance().getXStreamReader(media);
      configure(xstream);

      if (isArray) {
        xstream.addImplicitCollection(Response.class, "data", dataClass);
      }
      else {
        xstream.alias("item", dataClass);
        xstream.alias("item", Object.class, dataClass);
        xstream.aliasField("data", Response.class, "item");
      }
      // xstream.aliasField("data", Response.class, "data");

      SitoolsXStreamRepresentation<Response> rep = new SitoolsXStreamRepresentation<Response>(representation);
      rep.setXstream(xstream);

      if (media.isCompatible(getMediaTest())) {
        Response response = rep.getObject("response");

        return response;
      }
      else {
        Engine.getLogger(AbstractSitoolsTestCase.class.getName()).warning("Only JSON or XML supported in tests");
        return null; // TODO complete test for XML, Object
      }
    }
    finally {
      RIAPUtils.exhaust(representation);
    }
  }

  /**
   * Basic XStream configuration for parser/writer
   * 
   * @param xstream
   *          XStream
   */
  private static void configure(XStream xstream) {
    xstream.autodetectAnnotations(false);
    xstream.alias("response", Response.class);
    xstream.alias("data", SitoolsAuthenticationInfo.class);
  }
}
