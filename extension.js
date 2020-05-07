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

		let username = await vscode.window.showInputBox({
			placeHolder: 'ServiceNow Username'
		});

		let password = await vscode.window.showInputBox({
			placeHolder: 'ServiceNow Password'
		});

		let instance_url = await vscode.window.showInputBox({
			placeHolder: 'ServiceNow Instance URL'
		});

		let script_path = await vscode.window.showInputBox({
			placeHolder: 'Script Path'
		});

		let db_path = await vscode.window.showInputBox({
			placeHolder: 'Database Path'
		});

		let config_object = {
			user: username,
			password: password,
			servicenow_instance_url: instance_url,
			script_path: script_path,
			db_path: db_path
		}

		let content = getYaml(config_object);

		const currentDirectory = vscode.workspace.workspaceFolders[0].uri.path;

		const folderPath = currentDirectory + "/_config";

		let yamlStr = yaml.safeDump(content);

		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath);
		}

		fs.writeFile(path.join(folderPath, "configuration.yaml"), yamlStr, err => {
			if (err) {
				return vscode.window.showErrorMessage(
					"Failed to create boilerplate file!"
				);
			}
			vscode.window.showInformationMessage("Created boilerplate files");
		});

	}));

}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}