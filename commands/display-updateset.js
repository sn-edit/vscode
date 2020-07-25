const vscode = require('vscode');
const path = require("path");
const { tryParseJSON } = require('../helpers/json');
const { runCommand } = require("../helpers/commands");


const updateStatusBarItem = async (editor, statusbarItem) => {
	let actualText = "Update set: N/A";
	// set scopename to a default of global
	let scopeName = "global";
	
	if (typeof editor == "undefined")
		return
	
	let currentFileName = editor.document.fileName;
	// split the file path based on the current OS's separator, windows and unix like differ
	currentFileName = currentFileName.split(path.sep);
	if (currentFileName[currentFileName.length - 4].length > 0) {
		// select the scopename from the path, this might need reworking
		scopeName = currentFileName[currentFileName.length - 4];
	}
	
	const command = ["updateset", "--list", "--scope", scopeName, "--json"];

	// result is the array of jsons in this case
	let commandResult = await runCommand(command);

	if (commandResult.error) {
		// hide statusbar since no useful information will be provided anyway
		statusbarItem.hide();
		return vscode.window.showErrorMessage(
			"Could not get the current update set!"
		);
	}

	commandResult.data.forEach((res) => {
		let resJSON = tryParseJSON(res);

		if (resJSON && resJSON.current) {
			actualText = statusbarItem.text;
			let newText = `SNEDIT $(files) Update set: ${resJSON.current.name}`;
			if (newText !== actualText) {
				statusbarItem.text = newText;
			}
		} else {
			// hide statusbar since no useful information will be provided anyway
			statusbarItem.hide();
		}
	});

	statusbarItem.show();
}

module.exports = {
    updateStatusBarItem
}