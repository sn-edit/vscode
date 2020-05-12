const vscode = require('vscode');
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const {
	getYaml
} = require("./config_files/configuration");

// const configurationCommand = require("./commands/configure");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	/*let someVar = vscode.commands.registerCommand('sn-edit.configure', async () => {

		function ensureTerminalExists() {
			if (vscode.window.terminals.length === 0) {
				vscode.window.showErrorMessage('No active terminals');
				return false;
			}
			return true;
		}

		let snow_url = await vscode.window.showInputBox({
			placeHolder: 'ServiceNow Instance URL'
		});
		if (snow_url) {

			let table = await vscode.window.showInputBox({
				placeHolder: 'Table Name'
			});
			let sys_id = await vscode.window.showInputBox({
				placeHolder: 'Sys ID'
			});

			vscode.window.createTerminal(`Ext Terminal #${NEXT_TERM_ID++}`);

			if (ensureTerminalExists()) {
				vscode.window.showInformationMessage('Connecting to ServiceNow instance ' + snow_url);

				let root = vscode.workspace.rootPath;
				let path = root + "/some_folder";
				if (!fs.existsSync(path)) {
					fs.mkdirSync(path);
				}

				vscode.window.activeTerminal.show();
				vscode.window.activeTerminal.sendText("sn-edit --download --table " + table + " --sys_id " + sys_id);
				vscode.window.activeTerminal.sendText('echo Searching...');
			};

		}

	}); */

	context.subscriptions.push(vscode.commands.registerCommand('sn-edit.configure', async () => {

		/* Check if the user is in an open workspace */
		if (vscode.workspace.workspaceFolders === undefined){
			vscode.window.showErrorMessage("You need to open a workspace before you can configure sn-edit!");
		}

		else {

			let username = await vscode.window.showInputBox({
				placeHolder: 'ServiceNow Username',
				validateInput: (text) => {
					if (!text || text.length <= 0) {
						return 'Please provide a username';
					}
					else {
						return undefined;
					}
				}
			});
	
			let password = await vscode.window.showInputBox({
				placeHolder: 'ServiceNow Password',
				password: true,
				validateInput: (text) => {
					if (!text || text.length <= 0) {
						return 'Please provide a password';
					}
					else {
						return undefined;
					}
				}
			});
	
			let instance_url = await vscode.window.showInputBox({
				prompt: "Enter the base URL for your instance",
				placeHolder: 'ServiceNow Instance URL',
				validateInput: (url) => {
					if (!url || url.length <= 0) {
						return 'Please provide the URL for your instance';
					}
					if (url.endsWith("/")) {
						return 'Please remove the / from the end of this URL';
					}
					if (!url.endsWith(".com")) {
						return 'Please provide the base url such as https://example.service-now.com';
					}
					else {
						return undefined;
					}
				}
			});
	
			const folderPath = vscode.workspace.workspaceFolders[0].uri.path + "/_config";
	
			/* Checks to see if a folder called _config already exists */
			if (!fs.existsSync(folderPath)) 
				fs.mkdirSync(folderPath);
	
			let config_object = {
				user: username,
				password: password,
				url: instance_url,
				root_directory: vscode.workspace.workspaceFolders[0].uri.path,
				db: vscode.workspace.workspaceFolders[0].uri.path + "/_config/sn-edit-local.db"
			}
	
			let yamlStr = yaml.safeDump(getYaml(config_object));
	
			fs.writeFile(path.join(folderPath, ".sn-edit.yaml"), yamlStr, err => {
				if (err) {
					return vscode.window.showErrorMessage(
						"Failed to create the sn-edit configuration yaml file!"
					);
				}
				vscode.window.showInformationMessage("Created sn-edit configuration yaml file!");
				vscode.window.activeTerminal.show();
				vscode.window.activeTerminal.sendText("./sn-edit --help");
			});
			
		}

	}));

}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}