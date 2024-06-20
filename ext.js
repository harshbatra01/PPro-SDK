/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function onLoaded () {
	var csInterface = new CSInterface();

	var env = csInterface.hostEnvironment;
	var appName 	= csInterface.hostEnvironment.appName;
	var appVersion 	= csInterface.hostEnvironment.appVersion;
	var APIVersion	= csInterface.getCurrentApiVersion();

	document.getElementById("dragthing").style.backgroundColor = "lightblue";
	var caps = csInterface.getHostCapabilities();
	
	loadJSX();
	
	updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);

	// Update the color of the panel when the theme color of the product changed.
	csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
	// Listen for event sent in response to rendering a sequence.
	csInterface.addEventListener("com.adobe.csxs.events.PProPanelRenderEvent", function(event) {
		alert(event.data);
	});

	csInterface.addEventListener("com.adobe.csxs.events.WorkspaceChanged", function(event) {
		alert("New workspace selected: " + event.data);
	});

	csInterface.addEventListener("com.adobe.ccx.start.handleLicenseBanner", function(event) {
		alert("User chose to go \"Home\", wherever that is...");
	});

	csInterface.addEventListener("ApplicationBeforeQuit", function(event) {
		csInterface.evalScript("$._PPP_.closeLog()");
	});
	// csInterface.evalScript("$._PPP_.getVideo()", getVideoName);
	csInterface.evalScript("$._PPP_.getVersionInfo()", myVersionInfoFunction);	
	csInterface.evalScript("$._PPP_.getActiveSequenceName()", myCallBackFunction);		
	csInterface.evalScript("$._PPP_.getUserName()", myUserNameFunction);  
	csInterface.evalScript("$._PPP_.getProjectProxySetting()", myGetProxyFunction);
	csInterface.evalScript("$._PPP_.keepPanelLoaded()");
	csInterface.evalScript("$._PPP_.disableImportWorkspaceWithProjects()");
	csInterface.evalScript("$._PPP_.registerProjectPanelSelectionChangedFxn()");  	// Project panel selection changed
	csInterface.evalScript("$._PPP_.registerItemAddedFxn()");					  	// Item added to project
	csInterface.evalScript("$._PPP_.registerProjectChangedFxn()");					// Project changed
	csInterface.evalScript("$._PPP_.registerSequenceSelectionChangedFxn()");		// Selection within the active sequence changed
	csInterface.evalScript("$._PPP_.registerSequenceActivatedFxn()");				// The active sequence changed
	csInterface.evalScript("$._PPP_.registerActiveSequenceStructureChangedFxn()");	// Clips within the active sequence changed
	csInterface.evalScript("$._PPP_.registerItemsAddedToProjectFxn()");  // register for message, whenever something is added to the active project
	csInterface.evalScript("$._PPP_.registerSequenceMessaging()");			
	csInterface.evalScript("$._PPP_.registerActiveSequenceChangedFxn()");	
	csInterface.evalScript("$._PPP_.confirmPProHostVersion()");
	csInterface.evalScript("$._PPP_.forceLogfilesOn()");  // turn on log files when launching

	// Good idea from our friends at Evolphin; make the ExtendScript locale match the JavaScript locale!
	var prefix		= "$._PPP_.setLocale('";
	var locale	 	= csInterface.hostEnvironment.appUILocale;
	var postfix		= "');";

	var entireCallWithParams = prefix + locale + postfix;
	csInterface.evalScript(entireCallWithParams);
}


const fs = require("fs");
const OpenAI = require("openai");

const openai = new OpenAI();

const OPENAI_API_KEY = 'sk-proj-ncOnHrLsPDqfi1BiMdvHT3BlbkFJAIYEMqOBke0ulKgwHRhR';

const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};


function handleTranscription(callback) {
    openai.audio.transcriptions.create({
        file: fs.createReadStream('life.mp4'),
        model: "whisper-1",
        response_format: "srt",
        word_timestamps: true
    }, (error, result) => {
        if (error) {
            console.error('Error creating transcription:', error);
            callback(error);
        } else {
            setTimeout(() => {
                // Code to handle the output of the promise here after 20 seconds
                console.log(result);
                callback(null, result);
            }, 20000);
        }
    });
}
  
function returnObjectAfterDelay() {
	const prompt = "Task: Analyze the given video transcript and suggest placements for relevant assets from your limited library in javascript object format. Each entry should specify the Asset Name and its corresponding timestamp in seconds within the video. Be creative and resourceful in utilizing the available assets to effectively represent different concepts. Available assets: Agreement Handshake Friend.mov, AI Chatgpt Technology.mov, Alert Warning Caution.mov, brain doubt choice-.mov, Camera VideoCamera Shoot.mov, Community Support Crowd.mov, Document File Paper.mov, Explain chart company.mov, Followers Subscribers Supporters.mov, Growth Grow Increase.mov, growth steps win.mov, Idea Bulb Light.mov, Mind Thinking Thought.mov, money dollar payment.mov, Network Computing LAN.mov, OnlineCall Consultation VideoCall.mov, People Friends Group.mov, Search Find MagnifyingGlass.mov, Subscribe notification follow.mov, Suitcase business job.mov, Vision Eyes Eyeinhand.mov, Write Pen Pencil Highlight.mov, wrong No avoid.mov  Example: Transcript excerpt: We need to increase our efficiency and meet the deadline. Output of the given transcript is a javascript object: { asset: clock, timestamp: 30 }"

	return new Promise((resolve) => {
	  const dataPromise = new Promise((resolveData) => {
		// Simulate an asynchronous operation that fetches the data
		setTimeout(() => {
		  const data = {
			key1: "value1",
			key2: "value2"
		  };
		  resolveData(data);
		}, 20000); // Delay of 1 second for demonstration
	  });
  
	  dataPromise.then((data) => {
		resolve(data);
	  });
	});
  }

function test() {
	var csInterface = new CSInterface();

	openai.audio.transcriptions.create({
    file: fs.createReadStream('life.mp4'),
    model: "whisper-1",
    response_format: "srt",
    word_timestamps: true
  })
  .then(transcription => {
	const escapedResultString = JSON.stringify(transcription)
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"');
    console.log(transcription);
    

    csInterface.evalScript('$._PPP_.alertOutput("' + escapedResultString + '")', function(res) {
    });
  })
  .catch(error => {
    alert("Error creating transcription:", error);
  });
}

  
// test() 

  function apiCall() {

	return new Promise((resolve, reject) => {
	 readFileAsync('prompt.txt', 'utf8')

	  .then((promptText) => {
	   return openai.audio.transcriptions.create({
		file: fs.createReadStream('life.mp4'),
		model: "whisper-1",
		response_format: "srt",
		word_timestamps: true

	   }).then((transcription) => {

		return { transcription, promptText };

	   });
	  })
	
	  .then(({ transcription, promptText }) => {

	   return openai.chat.completions.create({

		messages: [
		 { "role": "system", "content": "You are a helpful assistant designed to output JSON." },
		 { "role": "user", "content": transcription.data + promptText }
		],
		model: "gpt-3.5-turbo",
		logit_bias: {
		 // 10: 100,
		}
	   });
	  })

	  .then((completion) => {
		console.log(completion.choices[0]);

		const escapedResultString = JSON.stringify(completion.choices[0])
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"');

                var csInterface = new CSInterface();
                csInterface.evalScript('$._PPP_.alertOutput("' + escapedResultString + '")', function(res) {
                    // Handle any response from CSInterface.evalScript (optional)
                });

	   resolve(completion.choices[0]);
	   
	  })
	  .catch((error) => {
	   reject(error);
	   console.error('Error:', error);
	  });
	});
   }

//   apiCall()

  function apioutput() {
    try {
        let apiResult; // Variable to store API result

        // Execute apiCall to fetch data
        apiCall()
            .then((result) => {
                apiResult = result; // Store the API result
            })
            .catch((error) => {
                alert('Error in apiCall:', error);
            });

        // setTimeout to use the apiResult after a delay
        setTimeout(() => {
            try {
                const escapedResultString = JSON.stringify(apiResult)
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"');

                var csInterface = new CSInterface();
                csInterface.evalScript('$._PPP_.alertOutput("' + escapedResultString + '")', function(res) {
                    // Handle any response from CSInterface.evalScript (optional)
                });
            } catch (error) {
                alert('Error in setTimeout:', error);
            }
        }, 30000); // Replace 1000 with your desired delay in milliseconds

    } catch (error) {
        alert('Unexpected error in apioutput:', error);
    }
}

async function apiOutput(){
	const result =  apiCall()
	.then((result) => {
		const escapedResultString = JSON.stringify(result)
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"');
					console.log(escapedResultString)
					var csInterface = new CSInterface();
                csInterface.evalScript('$._PPP_.alertOutput("' + escapedResultString + '")', function(res) {
                    // Handle any response from CSInterface.evalScript (optional)
                })
	})
}
  
apiOutput()

// function apiCall() {
//     return new Promise((resolve, reject) => {
//         try {
//             readFileAsync('prompt.txt', 'utf8')
//                 .then((promptText) => {
//                     try {
//                         // Create audio transcription
//                         return openai.audio.transcriptions.create({
//                             file: fs.createReadStream('life.mp4'),
//                             model: "whisper-1",
//                             response_format: "srt",
//                             word_timestamps: true
//                         });
//                     } catch (error) {
//                         throw new Error('Error creating audio transcription: ' + error.message);
//                     }
//                 })
//                 .then((transcription) => {
//                     try {
//                         // Now we have both transcription and promptText
//                         return openai.chat.completions.create({
//                             messages: [
//                                 { "role": "system", "content": "You are a helpful assistant designed to output JSON." },
//                                 { "role": "user", "content": transcription.data + promptText }
//                             ],
//                             model: "gpt-3.5-turbo",
//                             logit_bias: {
//                                 // 10: 100,
//                             }
//                         });
//                     } catch (error) {
//                         throw new Error('Error creating chat completion: ' + error.message);
//                     }
//                 })
//                 .then((completion) => {
//                     try {
//                         resolve(completion.choices[0]);
//                         console.log(completion.choices[0]);
//                     } catch (error) {
//                         throw new Error('Error resolving completion: ' + error.message);
//                     }
//                 })
//                 .catch((error) => {
//                     console.error('Error during processing:', error);
//                     reject(error); // Propagate error to caller
//                 });
//         } catch (error) {
//             console.error('Unexpected error:', error);
//             reject(error); // Reject the promise with the error
//         }
//     });
// }

// function apiOutput() {
// 	try {
// 	  const a = "work";
// 	  alert("hi 1");
// 	} catch (error) {
// 	  alert("Error in block 1: " + error.message);
// 	}
  
// 	// let Result;
// 	// try {
// 	//   result = apiOutput0(); // Call apiOutput0 immediately
// 	// } catch (error) {
// 	//   alert("Error in block 2: " + error.message);
// 	// }
// 	apiOutput0()
// 	.then((result) => {
// 	  Result = result
// 	})
// 	.catch((error) => {
// 	  alert("Error in block 2:" + error.message);
// 	});
  
// 	// Delay using setTimeout instead of async/await
// 	setTimeout(function() {
// 	  try {
// 		alert("hi"); // Optional alert after delay
// 		const csInterface = new CSInterface();
// 		const res = new Promise(function(resolve) {
// 		  csInterface.evalScript('$._PPP_.alertOutput("' + Result + '")', function(res) {
// 			resolve(res);
// 		  });
// 		});
// 		// Handle promise resolution (optional)
// 		res.then(data => console.log(data))
// 		  .catch(error => console.error(error));
// 	  } catch (error) {
// 		alert("Error in block 4: " + error.message);
// 	  }
// 	}, 30000); // Set delay to 30 seconds (30000 milliseconds)
//   }

function addFilesJ() {
	var data = {
		"1": {
		  "asset": "Growth Grow Increase.mov",
		  "timestamp": 0
		},
		"2": {
		  "asset": "Mind Thinking Thought.mov",
		  "timestamp": 2.86
		},
		"3": {
		  "asset": "Community Support Crowd.mov",
		  "timestamp": 4.14
		},
		"4": {
		  "asset": "Document File Paper.mov",
		  "timestamp": 8.46
		},
		"5": {
		  "asset": "People Friends Group.mov",
		  "timestamp": 13.58
		},
		"6": {
		  "asset": "Suitcase business job.mov",
		  "timestamp": 17.139
		},
		"7": {
		  "asset": "Vision Eyes Eyeinhand.mov",
		  "timestamp": 22.1
		},
		"8": {
		  "asset": "wrong No avoid.mov",
		  "timestamp": 24.98
		}
	  }

	  const result = JSON.stringify(data);
	  const dataStringed = 
		  result.replace(/\\/g, '\\\\')
		  .replace(/"/g, '\\"');
	  
	  var csInterface = new CSInterface();
	  csInterface.evalScript('$._PPP_.addFiles("' + dataStringed + '")', function(res){
	  });
}

function getNameJ() {
    var mediaName = "work it harder";  
    var csInterface = new CSInterface();
    csInterface.evalScript('$._PPP_.getName("' + mediaName + '")', function(res){
	});
}

function dragHandler(event) {
	var csInterface = new CSInterface();
	var extPath 	= csInterface.getSystemPath(SystemPath.EXTENSION);
	var OSVersion	= csInterface.getOSInformation();

	/*
		Note: PPro displays different behavior, depending on where the drag ends (and over which the panel has no control):

		Project panel?	Import into project.
		Sequence?		Import into project, add to sequence.
		Source monitor? Open in source, but do NOT import into project.
	
	*/
	
	if (extPath !== null) {
		extPath = extPath + "/payloads/test.jpg";
		if (OSVersion.indexOf("Windows") >=0) {
			var sep = "\\\\";
			extPath = extPath.replace(/\//g, sep);
		}
		event.dataTransfer.setData("com.adobe.cep.dnd.file.0", extPath);
	//	event.dataTransfer.setData("com.adobe.cep.dnd.file.N", path);  N = (items to import - 1)
	}
}

function myCallBackFunction (data) {
	// Updates seq_display with whatever ExtendScript function returns.
	var boilerPlate		= "Active Sequence: ";
	var seq_display		= document.getElementById("active_seq");
	seq_display.innerHTML	= boilerPlate + data;
}

function myUserNameFunction (data) {
	// Updates username with whatever ExtendScript function returns.
	var user_name		= document.getElementById("username");
	user_name.innerHTML	= data;
}

function myGetProxyFunction (data) {
	// Updates proxy_display based on current sequence's value.
	var boilerPlate		   = "Proxies enabled for project: ";
	var proxy_display	   = document.getElementById("proxies_on");

	if (proxy_display !== null) {
		proxy_display.innerHTML = boilerPlate + data;
	}
}

function mySetProxyFunction (data) {
	var csInterface = new CSInterface();
	csInterface.evalScript("$._PPP_.getActiveSequenceName()", myCallBackFunction);
	csInterface.evalScript("$._PPP_.getProjectProxySetting()", myGetProxyFunction);
}

function myVersionInfoFunction (data) {
	var v_string		= document.getElementById("version_string");
	v_string.innerHTML	= data;
}

/**
 * Update the theme with the AppSkinInfo retrieved from the host product.
 */

function updateThemeWithAppSkinInfo(appSkinInfo) {

	//Update the background color of the panel

	var panelBackgroundColor = appSkinInfo.panelBackgroundColor.color;
	document.body.bgColor 	= toHex(panelBackgroundColor);

	var styleId 			= "ppstyle";
	var gradientBg			= "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, 40) + " , " + toHex(panelBackgroundColor, 10) + ");";
	var gradientDisabledBg	= "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, 15) + " , " + toHex(panelBackgroundColor, 5) + ");";
	var boxShadow			= "-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);";
	var boxActiveShadow		= "-webkit-box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.6);";

	var isPanelThemeLight	= panelBackgroundColor.red > 50; // choose your own sweet spot
	var fontColor, disabledFontColor, borderColor, inputBackgroundColor, gradientHighlightBg;

	if(isPanelThemeLight) {
		fontColor				= "#000000;";
		disabledFontColor		= "color:" + toHex(panelBackgroundColor, -70) + ";";
		borderColor				= "border-color: " + toHex(panelBackgroundColor, -90) + ";";
		inputBackgroundColor	= toHex(panelBackgroundColor, 54) + ";";
		gradientHighlightBg		= "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, -40) + " , " + toHex(panelBackgroundColor,-50) + ");";
	} else {
		fontColor				= "#ffffff;";
		disabledFontColor		= "color:" + toHex(panelBackgroundColor, 100) + ";";
		borderColor				= "border-color: " + toHex(panelBackgroundColor, -45) + ";";
		inputBackgroundColor	= toHex(panelBackgroundColor, -20) + ";";
		gradientHighlightBg		= "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, -20) + " , " + toHex(panelBackgroundColor, -30) + ");";
	}
	
	//Update the default text style with pp values

	addRule(styleId, ".default", "font-size:" + appSkinInfo.baseFontSize + "px" + "; color:" + fontColor + "; background-color:" + toHex(panelBackgroundColor) + ";");
	addRule(styleId, "button, select, input[type=text], input[type=button], input[type=submit]", borderColor);	   
	addRule(styleId, "p", "color:" + fontColor + ";");	  
	addRule(styleId, "h1", "color:" + fontColor + ";");	  
	addRule(styleId, "h2", "color:" + fontColor + ";");	  
	addRule(styleId, "button", "font-family: " + appSkinInfo.baseFontFamily + ", Arial, sans-serif;");	  
	addRule(styleId, "button", "color:" + fontColor + ";");	   
	addRule(styleId, "button", "font-size:" + (1.2 * appSkinInfo.baseFontSize) + "px;");	
	addRule(styleId, "button, select, input[type=button], input[type=submit]", gradientBg);	
	addRule(styleId, "button, select, input[type=button], input[type=submit]", boxShadow);
	addRule(styleId, "button:enabled:active, input[type=button]:enabled:active, input[type=submit]:enabled:active", gradientHighlightBg);
	addRule(styleId, "button:enabled:active, input[type=button]:enabled:active, input[type=submit]:enabled:active", boxActiveShadow);
	addRule(styleId, "[disabled]", gradientDisabledBg);
	addRule(styleId, "[disabled]", disabledFontColor);
	addRule(styleId, "input[type=text]", "padding:1px 3px;");
	addRule(styleId, "input[type=text]", "background-color: " + inputBackgroundColor + ";");
	addRule(styleId, "input[type=text]:focus", "background-color: #ffffff;");
	addRule(styleId, "input[type=text]:focus", "color: #000000;");
}

function addRule(stylesheetId, selector, rule) {
	var stylesheet = document.getElementById(stylesheetId);
	if (stylesheet) {
		stylesheet = stylesheet.sheet;
		if( stylesheet.addRule ) {
			stylesheet.addRule(selector, rule);
		} else if( stylesheet.insertRule ) {
			stylesheet.insertRule(selector + " { " + rule + " }", stylesheet.cssRules.length);
		}dfgjkls;hgadjkls;fhdejkorfghdjksfhjklxchjkladsghadsfj;klafsjtgopdfgiojsdflkvjmdsklfjmn
	}
}

function reverseColor(color, delta) {
	return toHex({red:Math.abs(255-color.red), green:Math.abs(255-color.green), blue:Math.abs(255-color.blue)}, delta);
}

/**
 * Convert the Color object to string in hexadecimal format;
 */

function computeValue(value, delta) {
	var computedValue = !isNaN(delta) ? value + delta : value;
	if (computedValue < 0) {
		computedValue = 0;
	} else if (computedValue > 255) {
		computedValue = 255;
	}

	computedValue = Math.round(computedValue).toString(16);
	return computedValue.length == 1 ? "0" + computedValue : computedValue;
}

function toHex(color, delta) {

	var hex = "";
	if (color) {
		hex = computeValue(color.red, delta) + computeValue(color.green, delta) + computeValue(color.blue, delta);
	}
	return "#" + hex;
}

function onAppThemeColorChanged(event) {
	// Should get a latest HostEnvironment object from application.
	var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
	// Gets the style information such as color info from the skinInfo, 
	// and redraw all UI controls of your extension according to the style info.
	updateThemeWithAppSkinInfo(skinInfo);
} 

/**
* Load JSX file into the scripting context of the product. All the jsx files in 
* folder [ExtensionRoot]/jsx & [ExtensionRoot]/jsx/[AppName] will be loaded.
*/
function loadJSX() {
	var csInterface = new CSInterface();

	// get the appName of the currently used app. For Premiere Pro it's "PPRO"
	var appName = csInterface.hostEnvironment.appName;
	var extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION);

	// load general JSX script independent of appName
	var extensionRootGeneral = extensionPath + "/jsx/";
	csInterface.evalScript("$._ext.evalFiles(\"" + extensionRootGeneral + "\")");

	// load JSX scripts based on appName
	var extensionRootApp = extensionPath + "/jsx/" + appName + "/";
	csInterface.evalScript("$._ext.evalFiles(\"" + extensionRootApp + "\")");
}

function evalScript(script, callback) {
	new CSInterface().evalScript(script, callback);
}

function onClickButton(ppid) {
	var extScript = "$._ext_" + ppid + ".run()";
	evalScript(extScript);
}
