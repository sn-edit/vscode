const vscode = require('vscode');
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

		let snow_url = await vscode.window.showInputBox({ placeHolder: 'ServiceNow Instance URL' });
		if (snow_url) {

			let table = await vscode.window.showInputBox({ placeHolder: 'Table Name'});
			let sys_id = await vscode.window.showInputBox({ placeHolder: 'Sys ID'});

			vscode.window.createTerminal(`Ext Terminal #${NEXT_TERM_ID++}`);
		 
			if (ensureTerminalExists()) {
				vscode.window.showInformationMessage('Connecting to ServiceNow instance ' + snow_url);
				vscode.window.activeTerminal.show();
				vscode.window.activeTerminal.sendText("sn-edit --download --table " + table + " --sys_id " + sys_id);
				vscode.window.activeTerminal.sendText('echo Searching...');
			};

		}

	});

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
