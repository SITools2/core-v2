# Compress sources

## Compress admin source

### Pre requisite

Install nodejs on Ubuntu
	
	//Configuration du proxy (if needed)
	export http_proxy=http://user:password@proxy2.akka.eu:9090
	export https_proxy=http://user:password@proxy2.akka.eu:9090
	//add custom repository to have last nodejs version
	sudo -E apt-add-repository ppa:chris-lea/node.js
	//install nodejs
	sudo apt-get update
	sudo apt-get install nodejs
	//Configure nodejs repository in http to avoid proxy problems
	npm config set registry http://registry.npmjs.org/



Configure the proxy (if needed)

	npm config set proxy http://proxy.company.com:8080
	npm config set https-proxy http://proxy.company.com:8080

### Intialise gulp

	npm install gulp gulp-concat gulp-uglifyjs


### Build sources

	gulp

### Update the freemarker template (index.html equivalent)

Go to the *data/freemarker* folder.

Edit the adminIndex.ftl file.

Comment all script tags between

	<!-- BEGIN_JS_DEV_INCLUDES --> and  <!-- END_JS_DEV_INCLUDES -->
	
and uncomment all script tags between

	<!-- BEGIN_PROD and END PROD -->
	
### Refresh the file list JSON file

The build process is based on a single json file that contains the **ordered** list of all files to build.
In order to create or refresh that list, you can follow the following steps :

1.  Run SITools2 admin with Google chrome
2.  Open the javascript console by pressing f12
3.  In the javascript console run :
	
		var out = [];
		//loop through all classes loaded to get the file path
		Ext.each(Ext.Loader.history, function(classz) {
			var filePath = Ext.Loader.classNameToFilePathMap[classz];
			if(!Ext.isEmpty(filePath)) {
				// update the filePath to quope with url rewriting
				filePath = filePath.replace("client-public/", "client-public-3.0/");
				filePath = filePath.replace("./js/", "js/");
				out.push(filePath);
			}
		});
		// Stringigy the output array
		var out = JSON.stringify(out);
		// add a breakline add the end of each line to make it easier to read
		var reEndOfLine = new RegExp('",', 'g');
		out = out.replace(reEndOfLine, '",\n');
		out;

4. Copy and paste the result into the *conf/files.json* file
5. Run the gulp task again