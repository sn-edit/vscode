const vscode = require('vscode');
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
/* $PATH needed for shelljs to run with vscode */
const shell = require("shelljs");
const { updateStatusBarItem } = require('./commands/display-updateset');
const { versionCommand } = require('./commands/version');
const { searchCMD } = require('./commands/search');
const { downloadCMD } = require('./commands/download');
const { openOnInstanceCMD } = require('./commands/open-on-instance');
const { runCommand } = require("./helpers/commands");
const { tryParseJSON } = require('./helpers/json');
const { setStatusbarMessage } = require('./helpers/statusbar');
const { getFieldName, getTable, getScope } = require("./helpers/core");
const { initExtension } = require('./core/config');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const { subscriptions } = context;
	/* Download */
	subscriptions.push(vscode.commands.registerCommand('sn-edit.download', downloadCMD));

	/* Open on Instance */
	subscriptions.push(vscode.commands.registerCommand('sn-edit.openOnInstance', openOnInstanceCMD));

	// upload onsave
	vscode.workspace.onDidSaveTextDocument(async (editor) => {
		const engine = initExtension();
		if (engine.error) {
			return;
		}

		// get the sys_id of the current file
		// get the table of the currently opened file
		// call upload command

		if (editor.fileName.indexOf(engine.workspacePath) === -1 || editor.fileName.indexOf(".sn-edit.yaml") >= 0) {
			// run this only when we are in our workspacepath
			// todo: make this more reliable and read it from yaml config instead
			return
		}

		setStatusbarMessage(`$(loading~spin) Uploading file to instance`, 3000);

		console.log("EDITOR => ");
		console.log(editor);
		console.log("FILENAME::: = ", editor.fileName);

		// get scopename
		let scopeName = getScope(editor);
		console.log("GETSCOPENAME", scopeName);
		let table = getTable(editor);
		console.log("GETTABLENAME", table);

		let currentFileName = editor.fileName;
		// split the file path based on the current OS's separator, windows and unix like differ
		currentFileName = currentFileName.split(path.sep);
		let name = "";

		if (currentFileName[currentFileName.length - 4].length > 0) {
			name = currentFileName[currentFileName.length - 2];
		}

		let folderPath = currentFileName;
		folderPath.splice(folderPath.length -1, 1);
		folderPath = folderPath.join(path.sep);
		let sysIDPath = folderPath + path.sep + "sys_id.txt";
		// TODO, introduce some validation if path exists and there was any error
		let sysID = fs.readFileSync(sysIDPath).toString();

		// scope is not needed for the upload, maybe sooner for the update set from the --list output
		console.log("Scope name", scopeName);
		console.log("Table", table);
		console.log("Sys ID", sysID);
		

		let field = getFieldName(editor);;

		console.log("BASENAME::", field);

		const command = ["upload", "--table", table, "--sys_id", sysID, "--fields", field, "--json"];

		let commandResult = await runCommand(command);

		commandResult.data.forEach((res) => {
			let resJSON = tryParseJSON(res);
			
			if (resJSON.level === "error" && resJSON.error) {
				return vscode.window.showErrorMessage(
					"There was an error while downloading your entry! (" + resJSON.error + ")",
				);
			}

			if (resJSON && resJSON.table === table && resJSON.sys_id === sysID) {
				return vscode.window.showInformationMessage(
					"The changes for file " + name + " [" + field + "] in table " + table + " were successfully uploaded!",
				);
			}
		});
	});

	context.subscriptions.push(vscode.commands.registerCommand('sn-edit.configure', async () => {
		vscode.env.openExternal(vscode.Uri.parse('https://conf.sn-edit.com'));
	}));

	// search command
	subscriptions.push(vscode.commands.registerCommand('sn-edit.search', searchCMD));

	// status bar notification of the current update set
	// displays the currently selected default update set for the actual scope
	const updateSetDisplayCMD = 'snedit.changeUpdateSet';
	let updatesetStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10);
	updatesetStatusBarItem.command = updateSetDisplayCMD;
	subscriptions.push(updatesetStatusBarItem);

	// register some listener that make sure the status bar 
	// item always up-to-date
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => updateStatusBarItem(editor, updatesetStatusBarItem)));

	// update set picker part
	subscriptions.push(vscode.commands.registerCommand("snedit.changeUpdateSet", async () => {
		// truncate update set data and force reload of it
		const truncateCommand = ["updateset", "--truncate", "--json"];

		let truncateCommandResult = await runCommand(truncateCommand);

		if (truncateCommandResult.error) {
			// hide statusbar since no useful information will be provided anyway
			return vscode.window.showErrorMessage(
				"Could not truncate update set data!"
			);
		}

		// set scopename to a default of global
		let scopeName = getScope(vscode.window.activeTextEditor);

		const command = ["updateset", "--list", "--scope", scopeName, "--json"];

		let commandResult = await runCommand(command);

		if (commandResult.error) {
			// hide statusbar since no useful information will be provided anyway
			return vscode.window.showErrorMessage(
				"Could not list update sets!"
			);
		}

		let updateSetsToChoose = [];

		commandResult.data.forEach((res) => {
			let resJSON = tryParseJSON(res);			

			if (resJSON && resJSON.current) {
				// take the others elements, these are all the other update sets. except of the currently selected one
				// this others contains an array
				resJSON.others.forEach((el) => {
					el.label = el.name;
					delete(el.name);
					updateSetsToChoose.push(el);
				});
			}
		});

		if (updateSetsToChoose.length === 0) {
			return vscode.window.showInformationMessage(
				"There are no update sets to choose from except of the currently selected one! Please go to your instance and create some and try again!"
				)
		}

		// options
		let placeholder = "Please pick the update set we should set as your default!";
		const pickerOptions = {
			placeHolder: placeholder ? placeholder : "",
		};

		let choice = await vscode.window.showQuickPick(updateSetsToChoose, pickerOptions);

		if (choice) {
			const command = ["updateset", "--set", "--scope", scopeName, "--update_set", choice.sys_id, "--json"];
			// ignore output for now
			let commandResult = await runCommand(command);
			
			if (commandResult.error) {
				return vscode.window.showErrorMessage(
					"There was an error while setting the update set!"
				);
			}

			vscode.window.showInformationMessage(
				"We successfully updated your default update set"
			);

			// update the status bar to reflect new changes if any
			await updateStatusBarItem(vscode.window.activeTextEditor, updatesetStatusBarItem);
		}
	}));


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