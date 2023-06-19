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
    vscode.commands.registerCommand("declutter.updateAutoHideSidebar", () => {
      vscode.window
        .showQuickPick(["true", "false"], {
          placeHolder: "Auto hide the sidebar",
        })
        .then(async (result) => {
          if (!!result) {
            const config = vscode.workspace.getConfiguration("declutter");

            await config.update("autoHideSidebar", result === "true", false);
          }
        });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("declutter.updateAutoHideDelay", () => {
      vscode.window
        .showInputBox({
          placeHolder: "Input desired delay in ms",
          validateInput: (value) =>
            isNaN(parseFloat(value)) ? "Input must be of type number" : null,
        })
        .then(async (result) => {
          if (!!!result) {
            return;
          }

          const delay = parseFloat(result);

          if (!isNaN(delay)) {
            const config = vscode.workspace.getConfiguration("declutter");

            await config.update("delay", delay, false);
          }
        });
    })
  );
}

export function deactivate() {}
