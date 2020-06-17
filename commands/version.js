const vscode = require('vscode');
const { runCommand } = require("../helpers/commands");

const versionCommand = () => {
    const command = ["--version"];

	// result is the array of jsons in this case
	let commandResult = runCommand(command);

	if (commandResult.error) {
		// hide statusbar since no useful information will be provided anyway
		return vscode.window.showErrorMessage(
			"Could not get version of sn-edit!"
		);
    }

    vscode.window.showInformationMessage(
        commandResult.data.trim()
    );
    

};

module.exports = {
    versionCommand: versionCommand
}