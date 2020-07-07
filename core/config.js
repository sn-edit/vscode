const vscode = require('vscode');
const shell = require("shelljs");

const initExtension = () => {
    // get the node path
    const node = shell.which('node');

    if (!node) {
        console.log("sn-edit not found, please install node before using this extension");
        return vscode.window.showErrorMessage("We could not find node in your path! Please install Node and try again! Read the instructions on the extension details page!")
    }

    const nodePath = (shell.which('node').toString());

    shell.config.execPath = nodePath;

    // get the path to the sn-edit binary in a variable and use it throughout
    const snedit = (shell.which('sn-edit').toString());

    if (!snedit) {
        console.log("sn-edit not found, please install sn-edit before using this extension");
        return vscode.window.showErrorMessage("We could not find sn-edit in your path! Please install sn-edit and try again! Read the instructions on the extension details page!")
    }

    const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

    return  {
        workspacePath: workspacePath,
        shell: shell,
        snedit: snedit
    };
};

module.exports = {
    initExtension: initExtension
}