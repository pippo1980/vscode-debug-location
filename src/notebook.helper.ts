import * as vscode from "vscode";
import { DebugConfig } from "./quick.debug";
import { DebugHelper } from "./debug.helper";

export class NotebookHelper implements DebugHelper {
  constructor(folder: vscode.WorkspaceFolder, config: DebugConfig) {
    this.folder = folder;
    this.config = config;
  }

  private folder: vscode.WorkspaceFolder;
  private config: DebugConfig;

  public loadDebugFile() {
    vscode.workspace
      .openNotebookDocument(
        vscode.Uri.file(this.folder.uri.path + "/" + this.config.file)
      )
      .then(this.showNotebook.bind(this), this.errorHandler.bind(this));
  }

  private showNotebook(document: vscode.NotebookDocument) {
    console.log(this.config);
    let range: vscode.NotebookRange = new vscode.NotebookRange(
      this.config.breakPointLine,
      this.config.breakPointLine + 1
    );

    vscode.window
      .showNotebookDocument(document, {
        preview: false,
        selections: [range],
      })
      .then(this.runToLineDialog.bind(this), this.errorHandler.bind(this));
  }

  private runToLineDialog(editor: vscode.NotebookEditor) {
    vscode.window
      .showInformationMessage("是否运行断点前所有Cell", "yes", "no")
      .then((item) => {
        if (item === "yes") {
          let file = vscode.Uri.file(
            this.folder.uri.path + "/" + this.config.file
          );
          vscode.commands.executeCommand(
            "jupyter.runallcellsabove",
            file,
            this.config.breakPointLine,
            0
          ).then(()=>{},this.errorHandler.bind(this));
        }
      });
  }

  private errorHandler(reson: any) {
    const msg = "open notebook:" + this.config.file + "due to error:" + reson;
    console.error(msg);
    vscode.window.showErrorMessage(msg);
  }
}
