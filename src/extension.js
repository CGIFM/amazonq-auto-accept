const vscode = require('vscode');

let statusBarItem;
let enabled = true;
let pollInterval = null;
let isRunning = false;

function activate(context) {
    const config = () => vscode.workspace.getConfiguration('amazonqAutoAccept');
    enabled = config().get('enabled', true);

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'amazonq-auto-accept.toggle';
    updateStatusBar();
    if (config().get('showStatusBar', true)) statusBarItem.show();

    context.subscriptions.push(
        vscode.commands.registerCommand('amazonq-auto-accept.toggle', () => {
            enabled = !enabled;
            config().update('enabled', enabled, vscode.ConfigurationTarget.Global);
            updateStatusBar();
            if (enabled) startPolling(config); else stopPolling();
            vscode.window.showInformationMessage(`Amazon Q Auto Run: ${enabled ? 'ON' : 'OFF'}`);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('amazonq-auto-accept.runOnce', () => tryRun())
    );

    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('amazonqAutoAccept')) {
                enabled = config().get('enabled', true);
                updateStatusBar();
                stopPolling();
                if (enabled) startPolling(config);
                if (e.affectsConfiguration('amazonqAutoAccept.showStatusBar')) {
                    config().get('showStatusBar', true) ? statusBarItem.show() : statusBarItem.hide();
                }
            }
        })
    );

    if (enabled) startPolling(config);
}

function startPolling(config) {
    stopPolling();
    const delay = config().get('delayMs', 800);
    pollInterval = setInterval(() => {
        if (enabled && !isRunning) tryRun();
    }, delay);
}

function stopPolling() {
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
}

async function tryRun() {
    isRunning = true;
    try {
        await Promise.allSettled([
            vscode.commands.executeCommand('aws.amazonq.runCmdExecution'),
            vscode.commands.executeCommand('aws.amazonq.inline.acceptEdit'),
        ]);
    } catch {
        // no pending execution
    } finally {
        isRunning = false;
    }
}

function updateStatusBar() {
    const version = require('../package.json').version;
    statusBarItem.text = enabled ? `$(check) Q-AutoRun v${version}` : `$(x) Q-AutoRun v${version}`;
    statusBarItem.tooltip = `Amazon Q Auto Run v${version}: ${enabled ? 'Enabled' : 'Disabled'}`;
    statusBarItem.backgroundColor = enabled
        ? undefined
        : new vscode.ThemeColor('statusBarItem.warningBackground');
}

function deactivate() {
    stopPolling();
}

module.exports = { activate, deactivate };
