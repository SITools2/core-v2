1/ Description
______________

Identification                       : SITools2
Date                                 : 2017-12-22
Version                              : 3.1.2
Owner                                : CNES
Developer                            : AKKA Technologies
Type                                 : Complete
Repository url                       : https://github.com/SITools2/core-v2.git
Project page                         : http://sitools2.github.io/
Classification                       : Not Confidential - Opensource GPL V3
Characteristics                      : Standalone, Java, ExtJS
Role/Function                        : Adaptable web interface for scientific data exposition.
Reference tag                        : (3.1.2)

2/ Changes
______________
-3.1.2 (2018-12-22)

	This version fixes some bugs from the version 3.1.1

	* Bug fixed :
		- Fix dataset URL column feature improving error display and linking together data storage HEAD and GET authorizations #90
		- Fix missing i18n labels for key label.resource.not.found #91
		- Fix green check shwon when datasource test fails #93
		- Shrink i18n labels for key label.description.Mini #94
______________
-3.1.1 (2017-11-29)

	This version fixes some bugs from the version 3.1

	* Bug fixed :
		- Client timeout not taken in account #78
		- Failure of download from second download #61
		- Fix query form DATE_BETWEEN component #82
		- plot function not working with template without footer #83
		- fix wrong url sent by automatic email #84
		- replace deprecated library uglifyjs by uglify
		- fix missing toolbar on query form result view #85
______________
-3.1 (2016-11-09)

	This version adds some new features and fixes some bugs from the version 3.0.3

	* New features :
		- New dataview available for dataset (TemplateView) migrated from version 2.6
		- Footer is now customizable for each project by specifying an icon, backgroung image and text.
		- New projects templates are available (with or without header/footer)
		- Portal elements size customizable from client-portal-3.0/conf/portalDisplayConfig.json file

	* Enhancements :
		- Only projects templates exposed in project administration (use of new component comboGrid)
		- Deleting duplicates keys in properties files

	* Bug fixed :
		- Filter not filterable in dataset but still displayed #74
______________
-3.0.3 (2016-08-30)

	This version adds some new features and fixes some bugs from the version 3.0.2
	
	* New features :
		- New "featureType" to have a column behave as a datasetLink but configured with a column from the dataset. 
		This column should contain the name of the dataset to link and the name of the column using the format : datasetName||columnName
		of the column is not specified the primaryKey of the target dataset is used  
		- Contact page from the portal to send email to the SITools2 administrator
	
	* Enhancements :
		- Better error handling from the datastorage
		- Login page pops up when a 401 status is sent by the server	

	* Bug fixed :
		- Link layout problem from the livegrid view #68
		- Legal information problem #67
		- Form width not used in fixed desktop mode #65
		- Delete an application from the applications list removes the according application plugin #56
		- Improve loading speed of the form menu #69 #70
		- Internationalize the help pages. (Content still in french).
______________
-3.0.2 (2016-05-10)

	This version fixes some bugs from the version 3.0.1

	* Bug fixed :
		- Fix Problem of DatasetLink #60
		- Fix Footer link #58
		- Fix enumerated parameters Admin #57
		- Fix Error cart downloading #62
		- Fix RegExp {TODAY} Date Between
______________
-3.0.1 (2015-12-18)

	This version fixes some bugs from the version 3.0

	* Bug fixed :
		- Fixing bug limit dataset services #50
		- Fix GeoJSON generation speed

	* API changes :
        - Increase max number of rows returned to 100000
_________________
-3.0 (2015-10-22)

	This version fixes some bugs from the beta3.

	* Enhancements :
		- Fix RSS and ATOM validity
		- Searching in dataset columns #45
		- Customisation project graph #46

	* API changes :
    		- com.sun.syndication removed
_________________
-3.0-beta3 (2015-10-13)

	This version fixes some bugs from the beta2.

	* New features :
		- Auto fit dataset column configurable

	* Enhancements :
		- Optimizing opening windows time
		- Tree archive #38
		- Downloading many products in zip format #40

	* Bug fixed :
		- Scrolling project graph administration  #27
		- Css editor pointing to wrong directory #2
		- Problem to open several external pages #43
		- Reset password did not working in ExtJs4
		- Problem with MODE_SERVER_OUTBOUND mode in ProxyApp.java #36
_________________
-3.0-beta2 (2015-09-15)

	This version fixes some bugs from the beta1 and includes MIZAR as a module in order to display datasets.

	* New features :
		- Mizar module linked to a dataset through a dataset GUI service or a project graph column
		- Another Mizar module linked to a dataset directly in the same module
		- Healpix dataset filter
		- Delete all authorizations associated to a role when deleting a role
		- Regroup dataset columns into categories
		- Dataset can use DISTINCT and GROUP BY
		- New GeoJSON resource for MIZAR without dictionary configuration
		- New simple dataset view for MIZAR

	* Enhancements :
		- Trigger Search in a form with a shorcut 'Enter' #34
		- Click Enter to validate admin window
		- GroupBy et Having #22
		- Remove the file charts.swf #15
		- Improve converter and services parameters configuration
		- Use real column name (alias or table name and column name) for sorting
		- Display and sort column by schema in dataset administration
		- Fix desktop resize

	* Bug fixed :
		- Sort by alias dataset #23
		- Tri colonne requête multiples jointures #18
		- Reconnexion source de données MySQL #17
		- Suppression d'un rôle #16
		- Ajout de node dans le project graph #10
		- Feature Type Image et Thumbnail #9
		- bug dans le module projectGraph #8
		- vue bloquée lors de l'upload d'une image #7
		- Creation Dataset avec Criteria #6
		- Scroll bar graph projet #5
		- Tri colonne requête multiples jointures #4
_________________
-3.0-beta1 (2015-01-12)

    This version implies a lot of modifications to the client and server code. 
    In order to migrate from 2.4.x to 3.0 follow the instruction in the file installation-notes.txt (English) or in the Developper Guide (French).
    Client plugin from the 2.x versions cannot be used anymore and have to be refactored using Extjs4 (see Developper Guide for more information).

    * New features :
        - Brand new web client based on Extjs4
        - Choose visibility of Project graph column
        - Client plugin definition dependencies inside source code
        - Client plugin language file configuration
    
    * API changes :
        - Upgrade Extjs to version 4.2.1.883
        - Upgrade Openlayers to version 2.13.1
        - Upgrade geoext to version 2.0.2
        - Data folder
            * freemarker
            * gui_services
            * projects_modules
            * datasets_views
            * formComponents
        - Plugin JavaScript object name changed (Use the updateData.sh script to update your existing files).    
                            
    * Missing features from version 2.4.3
        - Dataset template view
        - Poster module
                
    * Know bugs
        - Bad resizing of the desktop when resizing the window
        - A group cannot be modified if it has more than 10 users
        - Atom feeds are invalid (missing id tag) and cannot be displayed in web client

_________________
-2.5 (2015-01-12)
	* New features :
		- Set all columns visible/invisible in the dataset configuration
	
	* Enhancements :
		- User profile can be updated by admin without setting a new password
		- Apply Alessandro's contribution to reset form fields to default values
		- Fix USER_PROPERTIES primary key in MySQL
		- Default data files (client plugins) into map/ folder
		- Fix Datastorage to create datastorage with file:///
		- Auto reconnect to MySQL database after long inactivity period
		
	* Bug Fixed :
		- #66 Fits change frame menu visible
		- #73 multiple datastorage problem
		- #72 space disk not updated
		- #73 multiple datastorage problem
		- #75 project category removed when updating a project
		- #76 CONE_SEARCH_CARTESIEN with name resolver BUG
		
	* Know bugs
		- #70 Authorizations are not removed when a role is deleted

_________________
-2.4.2 (2014-10-13)
	* New features :
		- Project can be regrouped using named categories
	
	* Enhancements :
		- Stores uses map interface to simplify file naming
		- data are automatically loaded from old directory
		- StoreHelper can be configured in sitools.properties file
		- Minify javascripts during izpack generation
		
	* API changes :
		- data folder are now data/<datatype>/map
		
	* Bug Fixed :
		- #71 Add Table label
		- #68 Bug in user panel [ADMIN], sort users and groups is case insensitive
		- #67 Unable to see new user after I create one
		
	* Know bugs
		- #66 Fits change frame menu visible
		- #70 Authorizations are not removed when a role is deleted
_________________
-2.4.1 (2014-05-28)
	* Enhancements : 
		- Content editor improved for multi user use
		- Cannot update the name of a role
		- Error thrown when an unknown role is attached to an application
		- Minified javascript sources used by default with IzPack install
		
	* API changes :
		- update freemarker to version 2.3.20
	
_________________
-2.4 (2014-04-04)
	* New features :
		- Administrator actions logged in a specific log
			
	* Enhancements :	
		- Password recovery process changed
		- Unlock account process changed
		- Change password emails improved
					
	* API changes :
		- org.json library removed in favor of Jackson
		- org.restlet.ext.json library removed
_________________
-2.3.1 (2014-03-14)
	* New features :
		- User is blacklisted after 5 bad connections
		- User is prompted when its session expire
		- Password complexity have been improved
		- Bad connections are logged to a specific file
				
	* Enhancements :	
		- An email is sent to the administrator for any user registration
		- File size and last modification displayed on the datastorage explorer
		- Desktop Windows are properly resized when the browser is resized
		- The email send to the user when its inscription is validated do not contains the password.
		
					
	* Bug fixed :
		- The project application is not deleted when deleting a project
		- When adding a role to an authorization, only the first 10 roles are displayed
		- Double click on a project module makes multiple windows to be opened
		- Header column on HTML export on a dataset empty when a cell has no value
		 
	* API changes :
		- Log4j is used for log
			* All logs are situated in the logs folder
			* sitools-app.log contains the java trace
			* sitools-admin-app.log contains the security and administration log
			* solr.log contains only the logs generated by solr
			* All the configuration is done in the log4j.properties file
_________________
-2.3 (2014-02-13)
	* New features :
		- Fits viewer
			- New Gui service to quickly view a fits image from a dataset column
			- New project module for complete visualisation of a Fits file
				- headers
				- Image threshold management
				- ASCII table (First 300 records)
		- Administration Quick start guide 
		- HSQLDB embedded database compatibility for User and Group management (no installation of PostgreSQL or MySQL needed)			
		
				
	* Enhancements :	
		- Better transaction handling when starting a dataset or a project (only one application started)
		- Project duplication in administration
		- Easier datastorage configuration
		- Service duplication on dataset/project/application
		- Windows are properly resized and positioned when resizing browser window if the window cannot fit into the desktop 
		
					
	* Bug fixed :
		- FTL and CSS url exposition problem in the admin API
		- Wait for all Gui services to be loaded before displaying dataset records
		- Userstorage file name are correctly encoded
		- User removed from each role when deleted
		- group removed from each role when deleted
		- Cannot start an application multiple times in the application administration
		- AppRegistryApplication registered only one time
		- PUBLIC_HOST_DOMAIN property used in ".." link for datastorage HTML representation
		- HTML export problem on headers with empty column value
		- Double click on projectModule configuration open only one window
		
		

_________________
-2.2.2 (2013-12-10)
	
	* Enhancements :
		- Wiki   
			- Upload of documents with automatic link creation in HTML page
			- Upload of images in wiki datastorage (instead of SITools2 standard upload directory).			
			- HTML Link to project module
			- Page modification indicator
		
	* API changes :
		- HTTP client libraries updated to version 4.3.1
			- httpclient-4.3.1
			- httpcore-4.3
			- httpmime-4.3.1
		- Add library
			- httpclient-cache-4.3.1.jar
			
	* Bug fixed :
		- Problem with image zoomer when configured on multiple image columns

__________________
-2.2.1 (2013-11-06)

	* Enhancements :
		- Update Solr version to 4.5
		- Possibility to disable XML model files check at startup to improve startup speed (Warning it will start even if there are errors in the files)
			- Set Starter.CHECK_STORES_AT_STARTUP to false to disable model files check			
		
	* API changes :
		- Update Solr version to 4.5
		- Update Solr Restlet extension version to 4.5
		- Update Log4j in cobertura version (for tests only) to 1.2.16
		- Solr version 3.1 and 3.6.1 removed
		- HTTP client libraries updated to version 4.2.3
			- httpclient-4.2.3
			- httpcore-4.2.2
			- httpmime-4.2.3		  

___________________
-2.2 (2013-10-03)
	* New feature
		- Cart order
			- Add records to the cart as an authenticated user on every dataset
			- Visualize the cart with the selections for each dataset
			- Modify the selection
			- Order the selected records
				- Archive streaming
				- Copy the ordered records to the userstorage
				- Create an archive and copy it to the userstorage
		- New "advanced query" form component to organize dataset forms
		- New "advanced query" form component to organize multi dataset forms
		- Security extension with LDAP and OpenAM support
		
	* Bugs fixed : 
		- Groups and Users were not allocated to a role properly
		- Javascript error when adding a FeatureType image on a dataset column
		
	* Enhancements :
		- Regular expressions to check username and password for user
		- PublicHostDomain is used for host in the directory's list files (no more problems when Sitools is behind an Apache Proxy)
		- Proxy resource (/proxy) can be used with "rewrite_redirection=true" parameter to rewrite redirection urls
		- RSS link to add it to your favorite feed reader
		- New button look and feel
		- Tasks can be sorted by start and end dates		
	
	* API changes :
		- Data folder 
			- Mutli dataset forms definition changed. XML files must be edited and <fr.cnes.sitools.form.project.model.FormParameter> tags must be changed to <SimpleParameter> tags  
		- Upgrade to Guava version 14
	
	* Known limitations
		 - Cart selections cannot be changed in the fixed mode
___________________
-2.1.1 (2013-07-02)
	* New feature
		- IP blacklist and Intranet/Extranet filtering available when SITools2 is configured behind an Apache Proxy
		- Direct authentication on project page when project is private
		- Quicklook GUI service to zoom into images
		
	* Bugs fixed : 
		- Bad resize when zooming with the browser
		
	* Enhancements : 
		- JDBC datasource administration interface
		- New HTML editor (CKEDITOR)
		- Default visibility configuration on GUI services
	
	* API changes :
		- Data folder : 
			- projectIndex.ftl has been changed
			- portalIndex.ftl has been changed
			- adminIndex.ftl has been changed
			- new gui_services definition
		- Content editor project module configuration changed, it needs to be reconfigured using the following procedure
			- Deactivate the project
			- Edit the project and set the content editor project module as not available
			- Save the project
			- Edit the project and set the content editor project module as available and configure it
			- Don't forget to set the roles
			- Save the project and activate it		 

___________________
-2.1 (2013-06-03)
	* New feature
		- Default Gui Services are added by default to a dataset when creating a dataset
		- Gui and server services are displayed in the dataviews depending on the number of lines selected
		- Gui and server services can be aligned on the left or the right of the dataview toolbar
		- Java7 code compatibility
		- Jetty server properties configuration available from the sitools.properties file

	* Bugs fixed : 
		- Impossible to load a project desktop if a project module is not available
		- Impossible to add a concept to a column when the dataset was just created (status NEW)
		- CartoView is very long to close when there are a lot of data to display 
		
	* Enhancements : 
		- Datastorage module ergonomy improvement
		- DatasetSelectionType of the servers extensions changed (ALL to MUTLIPLE)
		- Selection with checkbox on the livegrid and cartoView
		- Code quality improvement
	
	* API changes : 
		- Base64 class file removed, replace by org.apache.commons.codec.binary.Base64
		- Data folder :
			- projectIndex.ftl has been changed
			- new gui_services definition
___________________
-2.0.2 (2013-04-26)
	* New feature
		- New CSV export resource plugin
		- GUI services configuration on datasets
		- GUI services categorization on datasets
		- Service services categorization on datasets
		- GUI services definition for sort, filter, plot, download, record details, column definition and add to selection
		- GUI services and service services are displayed in dataset views

	* Bugs fixed : 
		- Paging problem in datastorage administration application
		- DatasetView and ProjectModule dependencies are not loaded properly in the administration interface
		- Fix PNG export in the plot GUI service
		- Form size cannot be saved as public user
		
	* Enhancements : 
		- No more context menu (right click) in dataviews
		- Upgrade to Flotr2 for the plot GUI service
		- Redesign window header style in desktop mode
	
	* API changes : 
		- Data folder :
			- adminIndex.ftl and projectIndex.ftl has been changed
			- new gui_services folder with some gui_services declared
			- new services folder
			- new plugin_gui_services folder
			- new project_modules definition
___________________
-2.0.1 (2013-04-02)
	* New feature
		- In fixed mode, it is possible to save a form and to display it at startup
		- In fixed mode, it is possible to save a dataset view and to display it at startup
		- GUI services administration

	* Bugs fixed : 
		- Bad layout on project tree graph when column label is too long to be displayed
		- Project module parameters cannot be used in projectModule configured in desktop div
		- 
		
	* Enhancements : 
		- During the dataset configuration, it's not possible to change the alias of a table anymore, all columns must be removed before
		- Date validity is checked when submiting a form with a date between
		- Project has been moved to GitHub (https://github.com/SITools2/core-v2)
		- Displayed column choice in the livegrid has been moved to a menu 
		
	
	* API changes : 
		- When querying the dataset record API, a 400 HTTP error code is returned 
			* If a date is invalid 
			* If a the dates in a date between filter are Inconsistent
		- Upgrade org.restlet.patched from 1.0.2 to 1.0.3 (jar name changed)
		- Logs file path in the sitools.properties are now relative to the ROOT_DIRECTORY
____________________
-2.0 (2013-02-13)

	* Bugs fixed : 
		  - Datastorage with security filter cannot be restarted after server reboot
		  - The Opensearch component in client-user don't display anything
		  		
	* Enhancements :
		- Project ftl template have been moved directly into the freemarker folder
		- The livegrid dataview is the default one
		- The content editor module can be used by multiple user at the same time
		- Automatic install of the user tables is done during the IzPack install process and not from a panel at the end		  
		
	* Known bugs : 
		- It is not possible to save forms or datasetviews in fixed desktop mode		
	
	* API changes : 
		- The freemarker template in the project have to be changed (projectTemplate/<templateName> to <templateName>)
____________________
-2.0-RC-1 (2013-01-16)

	* New Features :
		- Selected zone in the map panel form component can be unselected
		- Value are sorted in dropdown list form components
		- Name resolver form component have been improved, if multiple object are found for a name the choice is given to the user
		- It's possible to change the size of the panels in the Cartographic view dataview. The size of the map panel can be chosen in the dataset administration
		  		

	* Bugs fixed : 
		- WADL correction
		- Query type in dataset was not taken into account
		- In the Dataset SQL wizard it is impossible to change the tables name
		- DirectOrderResource could not we executed from a CartoView dataset view
		- A new project module cannot be added directly to a project without reloading the page
		- Calendar form component layout have been fixed
		- Application plugin parameters were not changed for new application plugin
		  		  
		
	* Enhancements :
		- Images available on Resources Plugins and visible on dataset services list
		- Name Resolver : the user can specify a type to fill up RA/DEC corresponding to the user choice.
		- xs*: parameters available on Application Plugins
		- New logs format for resources order
		- New tooltip configuration available on the dataset livegrid
			- It is possible to configure a tooltip for every column (it will override the default tooltip)
			- It is possible to configure a tooltip for every feature type
		- Tar and Zip representation in order resource have been greatly optimized
		- NumericFilter uses BigDecimal from exact precision instead of floating point Double precision
		- Project modules administrator application is only used by client admin GUI
		- Dataset views administrator application is only used by client admin GUI
		- Images url for dataset, project ... are relative
		- Security changes : For all application, except PublicApplication, a bad credential call will result in a 403 status.
		- ProxyResource improved to allow all HTTP methods (only GET was allowed before) 
		
	* Known bugs : 
		- It is not possible to save forms or datasetviews in fixed desktop mode
		

____________________
-1.7.3 (2012-11-02)
	* New Features :
		- New client user GUI
			- Zoning can be specified in a ftl template and specified for each project
			- User space more user friendly 
			- Navigation menu to open modules. Module can be regrouped into categories
			- DataSet or multidataset form can be access directly through a specific module.
		- Possibility to choose between 2 navigation mode 
			- desktop : like 1.0 
			- fixed : the pages are anchored on the desktop like a classic website.
		- History of the pages is saved in fixed mode (Saves the last 10 pages opened) 
		- New MongoDB Datasource
			- MongoDB database explorer module available on the administration GUI
			- Dataset can be defined on both MongoDB and SQL Datasource			
		- New Dataset explorer module, more user friendly.
		- New CMS like module. It is possible to create and view a simple web site directly in the SITools2 GUI.
		- New Datasource explorer module.
		- A project module can have its own parameters and can be parameterized by project 
		- New dataset view to display geographic metadata.
		
	* Bugs fixed : 
		- Converters behavior on null values have been homogenized => nothing is returned 
		- Images are displayed on image feature type column even if the value is null => no image displayed
		
	* Enhancements : 
		- Plot refactored to display more than 300 records or selected records
		- Feed reader changed to be more user friendly
		- Feed detail window changed to be more user friendly
		- Multidataset result window have been changed and have different behavior depending on the navigation mode
		- Auto language detection
		- Copy/Paste is available with right click on the record details window
		- No more desktop manager module 		
		
	* API changes : 
		- Project model changed a lot => To be recreated
		- DataSet model changed => Compare operator in the predicat have to be changed (ex : = to EQ)


____________________
-1.0 (2012-07-04)
	* Bugs fixed : 
		- ExternalUrl feature type does not work when there are parameters in the URL
		- NULL value for numeric type are displayed as 0.0
		- HTML export resource doesn't work properly with "no client access" column
	* Enhancements : 
		- The SVA have been removed for good
		- French labels have been updated
		
____________________
-0.9.6 (2012-06-18)
	* New Features : 
		- Public preferences can be deleted 
		- Resource parameter can have a dictionary valueType (xs:dictionary) to choose from the list of dictionaries 
		- RSS or ATOM feeds can be defined from external sources 
		- In date between form, the default date can be defined with a date template. This template contains the date of the current day minus or plus a certain amount of days. 
		- Dataset's dataview can have parameters defined by the dataview developer. The value of the parameters are defined by the administrator when creating/ editing a dataset. 
		- New astronomy extension, featuring :
			- supports coneSearch Protocol from IVOA
			- supports galactic/equatorial coordinates transformation
			- supports name resolver service for solar system bodies and objects
			- supports hexadecimal/decimal degrees coordinate transformation
		- Name resolver in the cone-search form component

	* Bugs fixed : 
		- "The preference files cancel the date format requested" (ID: 3532421), the date format changes when the preference are saved. 
		- "Preference files add unwanted columns in livegrid" (ID: 3532417) 
		- "NoClientAccess Feature type not used correctly in client" (ID : 3531919) 
		- "Wrong column order in CSV export" (ID : 3532706) 
		- "Problem with primary keys with a '+'" (ID : 3532704) 

	* Enhancements : 
		- ColumnRenderer GUI. 
		- DateConverter updated with new SItools date format 
		- In forms the labels don't contain ":" anymore. 
		- In the "External Url (view in Desktop)" feature type, it is possible to tell whether or not the link is displayable in a window. It not, it will be downloaded. 
		- Date converter can have 2 labels, one for each field (start date/ end date). 
		- Form components can have no label. 

	* API changes : 
		- Since the dataview configuration on a dataset has changed, all datasets have to be opened and saved.


____________________
-0.9.5 (2012-05-30)
	* New Features :
	    - New feature types for dataset columns
	    - Date format can be defined for date column on a dataset
	    - Date format can be defined for the date_between form component
	    - Date columns can be used in the plot
	    - Project can be set to maintenance mode, which means they cannot be accessed anymore
	 
	* Bugs fixed : 
	    - Public save on multidataset doesn't save the right position
	
	* Enhancements : 
	    - The date format exchange between client and server (for the /records API) is now yyyy-MM-dd'T'HH:mm:ss.SSS
	    - The viewDataDetails and DataView (for datasets) new layout
	    - Tasks Application security changed to allow GET, PUT, DELETE for the task owner or Public user if there is no user logged. 
	
	* API changes : 
	    - /data configuration for datasets
	       - For every column the fields "datasetDetailUrl", "columnAliasDetail", "image" and "columnRenderer" must be deleted
	       - The columnRenderer have to be re-entered with the new version of Sitools.
		- see installation-notes.txt for more information on how to merge your data.
____________________
-0.9.4 (2012-05-09)
	* New Features :
		- Project usability : The administrator can define a configuration used for every public user
		- Order files : New synchronous order resource available with zip, tar, tar.gz export format.
			- Limit the number of files to download (warning and error threshold)
			- Set the name of the result file
		- Plugin resource : Its possible to configure the client behavior of a Resource plugin (Open directly in the deskop or in a new tab of the browser)
	* Bugs fixed :
		- It is know possible to change the order of the properties on an mutlidataset search form.
	* Enhancements :
		- Asynchronous task window look and feel
	* API changes :
		- fr.cnes.sitools.project.modules.model.ProjectModule publicOpened deprecated.
		- fr.cnes.sitools.common.resource.SitoolsParametrizedResource : Add of a new fileName parameter (this parameter have to be added in all plugins_resources xml files).
		- fr.cnes.sitools.plugins.resources.model.ResourceModel : Add .of a new behavior attribute.
		- setAuthor and setVersion method deleted in AbstractConverter and AbstractFilter 
____________________
- 0.9.3 (2012-04-25)
	* New Features :
	   - Multi dataset search finished :
	       - Datasets can be filtered on their properties
	       - Multi dataset search can be performed
	       - Multi dataset component supports units
	       - Muti dataset result show the number of records for each dataset      
	   - A new access logger is available to log and analyse business access
	   - New ergonomics administration menu	
	* Bugs fixed : 
	   - no scrollbar in livegrid with windows+firefox 10.0 - ID: 3484932
	   - WADL for dataset applications works properly
	   - With Google Chrome when calling ANALOG generation a Method Not Allowed occur.
	* Enhancements : 
		- External IP are logged even if Sitools is configured behind a front end Apache
	* API changes : 
	   - Overrides all formComponents, datasets_views, projects_modules and freemarker in /data directory
	   - Dis-activate, open, close et reactivate all datasets and project to load new configuration.
	   - For all existing forms & formProject : 
	       - replace NumberFieldUser with NumberField
	       - replace Listbox with ListboxMultiple
	       - replace sitools.component.forms with sitools.admin.forms
	       - replace sitools.component.users.SubSelectionParameters.SingleSelection with sitools.common.forms.components
	       - replace sitools.component.users.SubSelectionParameters.MultipleSelection with sitools.common.forms.components
	       - replace sitools.component.users.SubSelectionParameters.NoSelection with sitools.common.forms.components
____________________
- 0.9.2 (2012-03-23)
    * New Features :
		- Geographic search form component
		- Project modules defined on a project can be authorized only for some specified roles. 
		- Multi dataset search development in progress : 
			- Collection of datasets 
			- Properties on a dataset 
			- Multi dataset form search (Project form) administration 
			- Multi dataset form search displayed in the user interface (don�t do any searching) 
		- Feature type DisplayableUrl is available on all dataset views and data details windows.
    * Bugs fixed : 
		- ANALOG report now works on Linux host 
		- Refresh issue � ID: 3509431 � When adding a column to the livegrid and refreshing the grid, the data of this column are properly refreshed 
		- DATABASE column type missing � ID: 3495622 � It is now impossible to change column type of a DATABASE column 
		- In the data detail window, the field label are the label of the column (not the database column name) 
		- Images can be changed in RSS feeds items
    * Enhancements :
	    API changes : 
		- Overrides all formComponents, datasets_views, projects_modules and freemarker in /data directory 
		- Dis-activate, open, close et reactivate all datasets and project to load new configuration.
    * Known bugs :
		- With Google Chrome when calling ANALOG generation a Method Not Allowed occur. Although the ANALOG report is correctly done, user have to click on analog menu again to refresh the ANALOG report. If the Analog report is not refreshed the browser cache have to be cleared. 
____________________
- 0.9.1 (2012-03-08)
	* Bugs fixed : 
		- Tasks result can be displayed properly
____________________
- 0.9.1RC2 (2012-02-24)
	* New Features :
		- 2 new dataset's column featureTypes
		    - noClientAccess : The column will never be shown to the client but can be use in services
		    - displayableUrl : The column data points to an external url but will be displayed in the desktop
	* Bugs fixed : 
		- ANALOG report is not correct precisely on hosts information	
		- HTML display problem when using "start" menu - ID: 3472397
		- Form Component size properties inefficient - ID: 3488542
		- Regression : Impossible to change form size - ID: 3488531
	* Enhancements : 
		- Dataset form component can be created on not visible column  		
	* API changes : 
		- /data configuration : plugins_filters parameters are now named filterParameter instead of resourceParameter
		- /data default configuration : freemarker and dataset_views default files must be overridden.
		- All Datasets must be edited and saved in order to reload the new datasetViews configuration.
		- /data default authorizations files have been updated and must be overridden. 
	* Known bugs : 
		- ANALOG report does not work on Linux host
____________________
- 0.9.1RC (2012-02-10)
	* New Features :
		-> New resource plugin parameters type (xs:enum, xs:enum-multiple, xs-enum-editable, xs-enum-editable-multiple)
		-> Administrator can configure whether or not to display a resource plugin parameter in the client-user 
		-> On linux host it is possible to run multiple instance of Sitools2
		-> It is possible to set a project header to display in the desktop
		-> New project description module
	* Bugs fixed : 
		-> Export Html not persistent - ID: 3483143	
	* Enhancements : 
		-> It is possible to set an Owner in every Sitools2 plugin
		-> Freemarker templates are located in the data/freemarker directory
		-> RSS feeds can contains images, those images will be displayed in the client
	* API changes : 
		-> /data configuration : fields removed in  dataset_filters (currentClassVersion and currentClassAuthor)
		-> /data configuration : in taskModel, runType is now named runTypeAdministration
	* Known bugs : 
		- ANALOG report is not correct precisely on hosts information
		- ANALOG report does not work on Linux host 
____________________
- 0.9.1M5 (2012-01-24)
	* New Features :
		-> It is possible to call a service ( SVA or Resource ) over a selection of more that 300 records.
		-> User inscription secured with captcha image
		-> Blacklist Ip addresses configurable in sitools.properties
		-> CSS, and freemarker templates directly editable in administration interface
		-> Project modules configuration
	
	* Bugs fixed : 
	
	* Enhancements : 
		-> developer plugins *.jar can be added and removed in fr.cnes.sitools.core/ext directory. 
		-> Plugin CRUD client/server communication is done through DTOs and not Model any more. 
			Model have Maps of parameters and DTOs have list of parameters. On server side only Maps are used. 
		-> Resource Order has been re factored to facilitate the implementation of new order process. 
		-> org.restlet.patched plugin containing extended classes of restlet for wadl and security purpose 
	* API changes : 
		-> tag must be removed for all : 
			-datasets_converters
			-datasets_filters
			-plugins_resources
			-plugins_filters
		 -> Plugins_applications must be recreated 
	* Known bugs : 
		- ANALOG report is not correct precisely on hosts information 
		
- 0.9.1M4 (2011-12-22)
    *  New Features :
 		-> When developing a resource plugin, the developer can define the application class to which the resource can be attached        
 		-> It is now possible to use resource plugin as SVAs with full task management
 		-> The client gets all applications paths from the server, the paths can be changed in the sitools.properties ( except APP_URL for now)
 		-> Client-User module can be added/remove/modified on the admin part 
    *  Bugs fixed :

    *  Enhancements : 
        -> Added 2 attributes in Response object count and offset to deal with record pagination
       	

    *  API changes :
       -> In the record API result totalCount = total
    
    *  Known bugs : 
    	-> It is impossible to select more than 300 records from the livegrid and execute a service (SVA, order, resource ...)
    
- 0.9.1M3 (2011-11-28)
	- New Features :
		-> Reset User Password from the login window (portal)
		-> Generate a user password for a new user from the client-admin
		-> Change user profile from an existing user in the client-user
		-> Freemarker templates available for emails in /conf/resources/templates
		-> New module to test API from the client-user (Module Poster)
	
	- Bugs fixed : 
		-> Admin help have been corrected and improved
		-> Not possible to register a user from project desktop - ID: 3435309 
			
	- Enhancements : 
		-> Context is available when validating a Converter, a Filter, a SVA or an Application plugin. 
		-> DataSetApplication and ProjectApplication are attached via riap (can be used by other resources, applications, internally knowing the url attachment) 
		-> SecurityFilter is now configurable by setting a subclass name in sitools.properties (for example in order to control upload size limit) 
		-> DataSet description can now be used in client applications (window title of DataSetViews for example) DataSet description can be set without any character control, contrary to DataSet name 
		-> On /records API, limit=-1 returns all records in the limit of the AbstractDatabaseRequest.MAX_ROWS parameter and limit=0 returns no records only counts
		-> Email is mandatory when creating a user
		-> Absolute SVA URL can be found when editing SVA
	
	- API changes :
		-> in data folder, template folder is now named dictionary_templates
		____________________
- 0.9 (14/10/2011)
	- New Features :
		-> Filtering on date + time
		-> Dataset views can be saved and reopen automatically
		-> Converters can be activated or disactivated
	
	- Bugs fixed :
		-> Opensearch RSS feeds are W3C valid
		-> Problem with postgresql when schema name is in uppercase - ID: 3419661 
		-> Wrong label for conesearch component on the server side - ID: 3415343 
		-> It seems that whatever SVA is listed in Home>SVATask. Nevertheless, only SVA having a POST method or asynchrone task should be listed. 
		-> Datasource password can contain % character
		-> Datastorage security can be changed
		-> Dictionary concepts description are diplayed as tooltip on live columns
		-> Forms are centered in the window
		-> New dataset's columns are added to the livegrid even if the livegrid have been saved before (the columns deleted are not deleted in the livegrid)
		-> Dataset icon link are saved and restored properly
		-> Dataset views are saved and restored properly according to the user rights
		-> Unit extension support hour, minute and second units
		-> Sva default values are displayed when editing a Sva, and parameters are saved properly
		

- 0.9RC (04/10/2011)
	- New Features :
		-> Project details can be viewed even if the project is active
		-> Converters can be actived and disactivated
		
	- Bugs fixed :
		-> minors bugs

- 0.9M5 (2011-09-23)

	- New Features :
		-> Dataset SQL definition improved
			-> The Join statement can be specified
		-> Resource plugin can be plugged on DataSet's and Project's applications
		-> DataSet can have semantic definition by mapping dictionary concepts to columns
		-> Application WADL contains HTTP codes
		-> Security on datastorage improvements 
			-> Each datastorage have its own security definition
			-> Each datastorage can have a specific plugin filter for security check
		
	- Bugs fixed :
		-> 3411383 : Quotes are missing in SQL request using DATE_BETWEEN 
		-> minors bugs

- 0.9M4 (2011-09-05)
	
	- New Features
		-> SVA handling improvments in user client
                -> Dictionary Concepts integration (step 1) 
		-> DataView component to replace classic livegrid
		-> Security improved to prevent SQL injection
                -> DB for tests installer to execute Junit tests (needs MySQL and Postgres)
		
	-> Bugs fixed :
		-> minors bugs


- 0.9M3 (2011-08-11)
	
	- New Features :
		-> Cone Search with unit conversion
		-> Default Security configuration for all applications
		-> Numeric form components with units
		-> Better form component behaviours
		
	-> Bugs fixed :
		-> Duplicate User / group exceptions
                -> numeric filters / operators <= and => instead of < and >


- 0.9M2 (2011-07-21)
	
	- New Features :
		-> Application IP filtering (intranet/extranet)
		-> JAR Plugins "on-the-fly" installation 
		-> Numeric form components with units
		-> Better form component behaviours
		
	-> Bugs fixed :
		-> Download/Upload of files including security
		-> 3362806: Tables opened from the graph have two MultiSort buttons

- 0.9M1 (2011-07-07)

	- New features :
		-> Form components plug-ins
		-> Units/Dimension administration
		
	- Bugs fixed :
		-> Same as 0.8 (simultaneous development)

- 0.8 (2011-06-21) 

	- Bugs fixed :
		-> 3313793: The wrong number of record was displayed in the plot windows
		-> 3314255: Not visible columns were present in the CVS export but were empty
		-> 3317773: It was impossible to create an empty properties when creating a user
		-> 3317774: There was no primary or foreign keys in the user MySQL schema
		-> 3344414: Radio button were not working properly in the forms
		-> 3346563: DataSet's predicates were not used when searching from a form on a dataset defined without the SQL Wizard
		-> In the livegrid the filters were not applied when scrolling
		-> 3346624: There was a precision loss while filtering on big integer values
		-> 3355053: It was impossible to get the list of visible columns (including the virtual columns) on a dataset
	- Known bugs


- 0.8RC1 (2011-06-10) : Initial version of the software distributed by Sourceforge http://sitools2.sourceforge.net/

	- Bugs fixed :
		
	- Known bugs :
	
	
3/ System requirements
______________________

Developement : Windows, Linux, MacOSx compatible
Runtime      : Windows, Linux, MacOSx compatible


Build tools :
-------------

.................................................................................................
Name                    |       Version   |   Provider                                          |
.................................................................................................
Java Development Kit    |       1.6       |   Oracle                                            |
Ant                     |       1.8.1     |   Apache                                            |
IzPack                  |                 |                                                     |
.................................................................................................


Tools to install :
------------------

.................................................................................................
Name                    |       Version   |   Provider                                          |
.................................................................................................
Java Development Kit    |       1.6       |   Oracle                                            |
Ant                     |       1.8.1     |   Apache                                            |
SGBD MySQL        or    |                 |                                                     |
SGBD PostgreSQL         |                 |                                                     |
.................................................................................................


Embedded libraries :
--------------------

.................................................................................................
Name                    |       Version   |   Provider                                          |
.................................................................................................
Ant                     |       1.8.1     |   Apache                                            |
IzPack                  |                 |                                                     |
Restlet                 |       2.0.5     |   Noelios                                           |
ExtJS                   |       3.2.2     |   Sencha                                            |
Saxon                   |       9.        |                                                     |
.................................................................................................

No licence for use
Project distributed under Opensource GPL V3 license


4/ Content
__________


1) Server modules
      fr.cnes.sitools.core : Main classes for SITools2 server
      fr.cnes.sitools.extensions : Plugins classes of applications, resources, converters, filters, and svas
      fr.cnes.sitools.ext.test : Plugins classes for example and tests purpose.

2) Web client modules 
      client-admin  : ExtJS interface for administration.
      client-public : Commons files for ExtJS interface.
      client-user   : ExtJS user interface.

3) Build modules
	sitools/build : update properties files of others modules in one step.
	sitools/install-izpack : builder of the izpack installer

5/ File extensions
__________________

.java           ascii           Java source
.properties     ascii           Java property file
.xml            ascii           XML file
.xsd            ascii           XML schema
.txt            ascii           Text file
.css            ascii           Web style sheet
.html           ascii           HTML javadoc file
.js             ascii           Javascript source
.bat            ascii           Executable batch DOS file


.class          binary         Java class
.jar            binary         Java archive
.zip            binary         Compression of exploitation tree
.exe            binary         Executable
.gif            binary         Image
.jpg            binary         Image
.png            binary         Image
.doc            binary         Word document


6/ Build 
____________________

cd /sitools/workspace/fr.cnes.sitools-core 
ant

cd /sitools/workspace/fr.cnes.sitools-extensions 
ant

7/ Build installer
____________________

cd workspace/sitools-install-izpack
ant

8/ Install
__________

Simply launch the installer executable.
 
9/ Start
________

Simply launch the batch startSitools.sh or startSitools.bat


10 / Copyright
______________

This software distribution is covered by this copyright notice.

All third-party libraries redistributed with this software remain the property 
of their respective copyright owners and are subject to separate license 
agreements. 


11 / License
____________

You can obtain a copy of the GPL 3.0 license at
http://www.opensource.org/licenses/GPL-3.0

Restlet is a registered trademark of Noelios Technologies.

This product includes the FreeMarker software developed by the Visigoth 
Software Society (http://www.visigoths.org/).