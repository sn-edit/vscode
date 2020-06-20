const vscode = require('vscode');
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
/* $PATH needed for shelljs to run with vscode */
const shell = require("shelljs");
const { updateStatusBarItem } = require('./commands/display-updateset');
const { versionCommand } = require('./commands/version');
const { searchCMD } = require('./commands/search');
const { runCommand } = require("./helpers/commands");
const { tryParseJSON } = require('./helpers/json');

const {
	getYaml
} = require("./config_files/configuration");

// const configurationCommand = require("./commands/configure");

// const engine = initExtension();

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const { subscriptions } = context;
	/* Download */
	subscriptions.push(vscode.commands.registerCommand('sn-edit.download', async() => {
		let options = {};

		vscode.window.setStatusBarMessage(
			`$(loading~spin) Loading and processing table data...`,
			3000
		);

		// table name
		options = {
			placeholder:  "Select the table you want to see the fields for!"
		};

		let table = await searchCMD(options);

		if (!table) {
			return vscode.window.showErrorMessage(
				"Please select a table so we are able to download your data!"
			)
		}

		vscode.window.setStatusBarMessage(
			`$(loading~spin) Loading entries from table ${table.name}`,
			3000
		);

		options = {
			table: table.name,
			query: "active=true",
			placeholder:  "Select the entry you would like to download!"
		};

		let table_entry = await searchCMD(options);

		if (!table_entry) {
			return vscode.window.showErrorMessage(
				"Please select an entry so we are able to download your data!"
			)
		}

		let tableName = table.name;
		let sysID = table_entry.sys_id;

		// run download command
		const command = ["download", "--table", tableName, "--sys_id", sysID, "--json"];

		// result is the array of jsons in this case
		let commandResult = await runCommand(command);
		
		commandResult.data.forEach((res) => {
			let resJSON = tryParseJSON(res);
			
			if (resJSON.level == "error" && resJSON.error) {
				return vscode.window.showErrorMessage(
					"There was an error while downloading your entry! (" + resJSON.error + ")",
				);
			}

			if (resJSON && resJSON.table_name === tableName && resJSON.sys_id === sysID) {
				result = tryParseJSON(resJSON.result);
				
				if (table_entry["unique_key"]) {
					return vscode.window.showInformationMessage(
						"Entry \"" + table_entry[table_entry["unique_key"]] + "\" from table " + tableName + "#" + sysID + " successfully downloaded!",
					);
				} else {
					return vscode.window.showInformationMessage(
						"Entry from table " + tableName + "[" + sysID + "] successfully downloaded!",
					);
				}

				return
			}
		});

	}));

	// /* Upload */
	// context.subscriptions.push(vscode.commands.registerCommand('sn-edit.upload', async () => {

	// 	let fields = await vscode.window.showInputBox({
	// 		prompt: "Provide one or more fields, comma separated (example: 'name,script,active')",
	// 		placeHolder: 'script',
	// 		ignoreFocusOut: true,
	// 		validateInput: (text) => {
	// 			if (!text || text.length <= 0) {
	// 				return 'Please provide a valid field name';
	// 			}
	// 			else {
	// 				return undefined;
	// 			}
	// 		}
	// 	});
		
	// 	let table = await vscode.window.showInputBox({
	// 		prompt: "Table name, eg: sys_user",
	// 		placeHolder: 'Table Name',
	// 		ignoreFocusOut: true,
	// 		validateInput: (text) => {
	// 			if (!text || text.length <= 0) {
	// 				return 'Please provide a valid table name';
	// 			}
	// 			else {
	// 				return undefined;
	// 			}
	// 		}
	// 	});

	// 	let sys_id = await vscode.window.showInputBox({
	// 		placeHolder: 'Script sys_id',
	// 		ignoreFocusOut: true,
	// 		validateInput: (text) => {
	// 			if (!text || text.length <= 15) {
	// 				return 'Please provide a valid sys_id';
	// 			}
	// 			else {
	// 				return undefined;
	// 			}
	// 		}
	// 	});

	// 	const commandSn = vscode.workspace.rootPath + '/sn-edit updateset --list --json';
	// 	const outputString = shell.exec(commandSn, {silent:false}).stdout;

	// 	console.log(outputString);

	// 	/* shell.cd(vscode.workspace.workspaceFolders[0].uri.path);
	// 	const outputString = shell.exec(commandSn, {silent:false}).stdout;
	// 	const outputSearch = outputString.split("\n");

	// 	outputSearch.forEach(element => {

	// 		const parsedOutput = JSON.parse(element);

	// 		if (parsedOutput.hasOwnProperty('current')) {

	// 			let updateSets = [];
	// 			updateSets.push(parsedOutput.current);

	// 			if (parsedOutput.hasOwnProperty('others'))
	// 				updateSets.push(parsedOutput.others);

	// 			console.log(JSON.stringify(updateSets));
				
	// 		}

	// 	}); */


	// 	const value = await vscode.window.showQuickPick(
	// 		['explorer', 'search', 'scm', 'debug', 'extensions'], 
	// 		{ 
	// 			placeHolder: 'Select the view to show when opening a window.',
	// 			canPickMany: false
	// 		 });

	// }));

	// /* Configure */
	// context.subscriptions.push(vscode.commands.registerCommand('sn-edit.configure', async () => {

	// 	/* Check if the user is in an open workspace */
	// 	if (vscode.workspace.workspaceFolders === undefined){
	// 		vscode.window.showErrorMessage("You need to open a workspace before you can configure sn-edit!");
	// 	}

	// 	else {

	// 		let username = await vscode.window.showInputBox({
	// 			placeHolder: 'ServiceNow Username',
	// 			ignoreFocusOut: true,
	// 			validateInput: (text) => {
	// 				if (!text || text.length <= 0) {
	// 					return 'Please provide a username';
	// 				}
	// 				else {
	// 					return undefined;
	// 				}
	// 			}
	// 		});
	
	// 		let password = await vscode.window.showInputBox({
	// 			placeHolder: 'ServiceNow Password',
	// 			ignoreFocusOut: true,
	// 			password: true,
	// 			validateInput: (text) => {
	// 				if (!text || text.length <= 0) {
	// 					return 'Please provide a password';
	// 				}
	// 				else {
	// 					return undefined;
	// 				}
	// 			}
	// 		});
	
	// 		let instance_url = await vscode.window.showInputBox({
	// 			prompt: "Enter the base URL for your instance",
	// 			placeHolder: 'ServiceNow Instance URL',
	// 			ignoreFocusOut: true,
	// 			validateInput: (url) => {
	// 				if (!url || url.length <= 0) {
	// 					return 'Please provide the URL for your instance';
	// 				}
	// 				if (url.endsWith("/")) {
	// 					return 'Please remove the / from the end of this URL';
	// 				}
	// 				if (!url.endsWith(".com")) {
	// 					return 'Please provide the base url such as https://example.service-now.com';
	// 				}
	// 				else {
	// 					return undefined;
	// 				}
	// 			}
	// 		});
	
	// 		const folderPath = vscode.workspace.rootPath + "/_config";
	
	// 		/* Checks to see if a folder called _config already exists */
	// 		if (!fs.existsSync(folderPath)) 
	// 			fs.mkdirSync(folderPath);
	
	// 		let config_object = {
	// 			user: username,
	// 			password: password,
	// 			url: instance_url,
	// 			root_directory: vscode.workspace.rootPath,
	// 			db: vscode.workspace.workspaceFolders[0].uri.path + "/_config/sn-edit-local.db"
	// 		}
	
	// 		let yamlStr = yaml.safeDump(getYaml(config_object));
	
	// 		fs.writeFile(path.join(folderPath, ".sn-edit.yaml"), yamlStr, err => {
	// 			if (err) {
	// 				return vscode.window.showErrorMessage(
	// 					"Failed to create the sn-edit configuration yaml file!"
	// 				);
	// 			}
	// 			vscode.window.showInformationMessage("Created sn-edit configuration yaml file!");
	// 		});
			
	// 	}

	// }));

	// search command
	subscriptions.push(vscode.commands.registerCommand('sn-edit.search', searchCMD));

	// status bar notification of the current update set
	// displays the currently selected default update set for the actual scope
	const updateSetDisplayCMD = 'snedit.defaultUpdateSet';
	let updatesetStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10);
	updatesetStatusBarItem.command = updateSetDisplayCMD;
	subscriptions.push(updatesetStatusBarItem);

	// register some listener that make sure the status bar 
	// item always up-to-date
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => updateStatusBarItem(editor, updatesetStatusBarItem)));
	// subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));

	// update status bar item once at start
	updateStatusBarItem(vscode.window.activeTextEditor, updatesetStatusBarItem);

	// version command
	subscriptions.push(vscode.commands.registerCommand("sn-edit.version", async () => versionCommand()));
}


exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}