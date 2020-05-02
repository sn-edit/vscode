const vscode = require('vscode');
const fs = require("fs");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let NEXT_TERM_ID = 1;
	console.log("Terminals: " + vscode.window.terminals.length);

	let disposable = vscode.commands.registerCommand('sn-edit.helloWorld', function () {
		vscode.window.showInformationMessage('sn-edit test!');
	});

	let someVar = vscode.commands.registerCommand('sn-edit.configure', async () => {

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

	});

	let createYaml = vscode.commands.registerCommand('sn-edit.createYaml', function () {

		const folderPath = vscode.workspace.workspaceFolders[0].uri
			.toString()
			.split(":")[1];

		const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <link rel="stylesheet" href="app.css" />
</head>
<body>
    <script src="app.js"></script>
</body>
</html>`;

		fs.writeFile(path.join(folderPath, "index.html"), htmlContent, err => {
			if (err) {
				return vscode.window.showErrorMessage(
					"Failed to create boilerplate file!"
				);
			}
			vscode.window.showInformationMessage("Created boilerplate files");
		});

	});

	context.subscriptions.push(createYaml);
	context.subscriptions.push(someVar);
	context.subscriptions.push(disposable);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}