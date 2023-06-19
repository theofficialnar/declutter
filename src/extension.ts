import * as vscode from "vscode";
import { TextEditorSelectionChangeKind } from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let timerId: NodeJS.Timeout;

  function triggerAutohide() {
    const timeoutDelay: number =
      vscode.workspace.getConfiguration("declutter").delay;
    const isAutoHideSidebar: boolean =
      vscode.workspace.getConfiguration("declutter").autoHideSidebar;

    if (!isAutoHideSidebar) {
      return;
    }

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      vscode.commands.executeCommand("workbench.action.closeSidebar");
    }, timeoutDelay);
  }

  // User selected something on the text editor
  vscode.window.onDidChangeTextEditorSelection((evt) => {
    if (!!evt && evt.kind === TextEditorSelectionChangeKind.Mouse) {
      triggerAutohide();
    }
  });

  // User changed tabs
  vscode.window.onDidChangeActiveTextEditor((evt) => {
    if (!!evt) {
      triggerAutohide();
    }
  });

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
