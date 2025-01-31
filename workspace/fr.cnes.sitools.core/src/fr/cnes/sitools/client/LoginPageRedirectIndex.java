package fr.cnes.sitools.client;

import fr.cnes.sitools.applications.PublicApplication;
import fr.cnes.sitools.common.SitoolsResource;
import fr.cnes.sitools.security.challenge.ChallengeToken;
import fr.cnes.sitools.server.Consts;
import org.restlet.data.LocalReference;
import org.restlet.data.MediaType;
import org.restlet.data.Reference;
import org.restlet.data.Status;
import org.restlet.ext.freemarker.TemplateRepresentation;
import org.restlet.ext.wadl.MethodInfo;
import org.restlet.ext.wadl.RepresentationInfo;
import org.restlet.ext.wadl.ResponseInfo;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;
import org.restlet.resource.Get;
import org.restlet.resource.ResourceException;

import java.util.HashMap;
import java.util.Map;

/**
 * Gets the LoginPageRedirect index page
 * 
 * 
 * @author m.gond
 */
public class LoginPageRedirectIndex extends SitoolsResource {

  /**
   * The clientPublicApplication
   */
  private PublicApplication application;
//  /**
//   * The token
//   */
//  private String token;

  @Override
  public void sitoolsDescribe() {
    setName("LoginPageRedirectIndex");
    setDescription("Resource to return the index.html page of the LoginPageRedirect interface");
  }

  @Override
  protected void doInit() {
    super.doInit();
    application = (PublicApplication) this.getApplication();

//    ChallengeToken challengeToken = application.getChallengeToken();
//
//    token = getRequest().getResourceRef().getQueryAsForm().getFirstValue("cdChallengeMail", null);
//    if (token == null) {
//      throw new ResourceException(Status.CLIENT_ERROR_BAD_REQUEST, "cdChallengeMail parameter mandatory");
//    }
//
//    if (!challengeToken.isValid(token)) {
//      throw new ResourceException(
//          Status.CLIENT_ERROR_GONE,
//          "You asked to change your password, but the request is no longer available. Please ask again to change your password on SITools2");
//    }
  }

  @Get
  @Override
  public Representation get() {

    getApplication().getLogger().fine("get resetPasswordIndex");

    Map<String, Object> params = new HashMap<String, Object>();
    params.put("appUrl", application.getSettings().getString(Consts.APP_URL));
//    params.put("challengeToken", token);
    params.put("resourceUrl", "/loginPageRedirect");

    Reference ref = LocalReference.createFileReference(application.getLoginPageRedirectIndexUrl());

    Representation loginPageRedirectFtl = new ClientResource(ref).get();

    // Wraps the bean with a FreeMarker representation
    return new TemplateRepresentation(loginPageRedirectFtl, params, MediaType.TEXT_HTML);
  }

  /**
   * Describe the GET method
   * 
   * @param info
   *          the WADL documentation info
   */
  public void describeGet(MethodInfo info) {
    info.setDocumentation("Method to get the loginRedirect page.");
    this.addStandardGetRequestInfo(info);
    ResponseInfo responseInfo = new ResponseInfo();
    RepresentationInfo representationInfo = new RepresentationInfo();
    representationInfo.setReference("html_freemarker");
    responseInfo.getRepresentations().add(representationInfo);
    info.getResponses().add(responseInfo);
  }

}
