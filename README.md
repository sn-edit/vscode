# sn-edit

The extension provides a bridge between sn-edit and the Visual Studio Code UI. We've created a few simple commands that are useful for daily development and could be used while development. 

**For the extension to work correctly:**
- Install **NodeJS** from the [Official Page](https://nodejs.org/en/download/) (At least the LTS version or anything newer)
- Download the [sn-edit](https://docs.sn-edit.com/#/getting-started/README) application, for the instructions, please refer to our [docs site](https://docs.sn-edit.com/#/getting-started/README).

After installing sn-edit, please use the [configuration generator](https://conf.sn-edit.com/) to download your config file.

The capabilities include:
- Downloading of entries
- Uploading entries onsave
- Update set management, like displaying the currently selected update set and setting a new default one that would be used in subsequent calls in your session
- To choose a different update set, just click on the right bottom on the update set name and you should be presented with a list of other update sets
- We support basic authentication only but if there will be popular demand on other types, we are able to do it
- We support scopes, that means your entries will be saved in the specific scope they belong to
- No support for creating new entries for now
- We support searching for tables and their entries inside of vscode. After picking your entry, the entry gets downloaded locally
- Support to run background scripts from local js files (Not supported by the extension yet, but supported by sn-edit)

**Note**: If anyone feels capable enough to take up the challenge of maintaining this project let me know! Feel free to send feedback
and improvement suggestions! Every help is welcome!

We invite every one of you to contribute to this project to make it better for you and for everyone else. 