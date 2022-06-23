import * as vscode from "vscode";
import { DebugHelper } from "./debug.helper";
// import * as path from "path";
// import * as fs from "fs";
// import * as fs from "fs-extra";

import { NotebookHelper } from "./notebook.helper";

export interface DebugConfig {
  readonly type: string;
  readonly file: string;
  readonly breakPointLine: number;
}

export class QuickDebugger {
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  private context: vscode.ExtensionContext;

  public activate() {
    if (
      vscode.workspace.workspaceFolders === undefined ||
      vscode.workspace.workspaceFolders.length === 0
    ) {
      vscode.window.showErrorMessage("no workspace foleder opened");
      return;
    }

    const folder = vscode.workspace.workspaceFolders[0];
    const fs = require("fs-extra");
    fs.readJson(folder.uri.path + "/.debug.config.json")
      .then((config: DebugConfig) => {
        console.log(config);
        let helper: DebugHelper;
        if (config.type === "notebook") {
          helper = new NotebookHelper(folder, config);
        }

        if (helper) {
          helper.loadDebugFile();
        }
      })
      .catch((err: Error) => {
        vscode.window.showErrorMessage("lauch debug due to error:" + err);
      });
  }
}
