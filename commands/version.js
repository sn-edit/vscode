const vscode = require('vscode');
const { runCommand } = require("../helpers/commands");

const versionCommand = async () => {
    const command = ["--version"];

	// result is the array of jsons in this case
	let commandResult = await runCommand(command);

	if (commandResult.error) {
		// hide statusbar since no useful information will be provided anyway
		return vscode.window.showErrorMessage(
			"Could not get version of sn-edit!"
		);
	}
	
	console.log("commandresult", JSON.stringify(commandResult));
	
    vscode.window.showInformationMessage(
        commandResult.data[0].trim()
    );
};

module.exports = {
    versionCommand: versionCommand
}