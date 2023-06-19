import * as vscode from "vscode";
import { TextEditorSelectionChangeKind } from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let timerId: NodeJS.Timeout;
  const timeoutDelay: number =
    vscode.workspace.getConfiguration("declutter").delay;
  const isAutoHideSidebar: boolean =
    vscode.workspace.getConfiguration("declutter").autoHideSidebar;

  vscode.window.showInformationMessage(
    `Current timer delay is: ${timeoutDelay}`
  );
  vscode.window.showInformationMessage(
    `Autohide sidebar: ${isAutoHideSidebar}`
  );

  function triggerAutohide() {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      vscode.commands.executeCommand("workbench.action.closeSidebar");
    }, timeoutDelay);
  }

  if (isAutoHideSidebar) {
    // User selected something on the text editor
    vscode.window.onDidChangeTextEditorSelection((evt) => {
      if (!!evt && evt.kind === TextEditorSelectionChangeKind.Mouse) {
        triggerAutohide();
      }
    });

    // User changed tabs
    vscode.window.onDidChangeActiveTextEditor((evt) => {
      console.log(evt);
      if (!!evt) {
        triggerAutohide();
      }
    });
  }

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "declutter.updateAutoHideSidebar",
      async () => {
        const config = vscode.workspace.getConfiguration("declutter");

        await config.update("autoHideSidebar", !config.autoHideSidebar, false);
      }
    )
  );
}

export function deactivate() {}
