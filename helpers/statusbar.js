const vscode = require('vscode');

// call this to set a message to the statusbar to notify the user
// that there is some ongoing process
const setStatusbarMessage = (message, timeout) => {
    timeout = timeout ? timeout : 3000;
    
    vscode.window.setStatusBarMessage(
        message,
        timeout
    );
};

module.exports = {
    setStatusbarMessage: setStatusbarMessage
}