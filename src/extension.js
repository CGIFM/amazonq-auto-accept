const vscode = require('vscode');
const cp = require('child_process');

let statusBarItem;
let enabled = true;
let pollTimer = null;
let pollRunning = false;

let cachedDelayMs = 800;
let cachedShowStatusBar = true;

function refreshConfig() {
    const config = vscode.workspace.getConfiguration('amazonqAutoAccept');
    cachedDelayMs = config.get('delayMs', 800);
    cachedShowStatusBar = config.get('showStatusBar', true);
    enabled = config.get('enabled', true);
}

function activate(context) {
    refreshConfig();

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'amazonq-auto-accept.toggle';
    updateStatusBar();
    if (cachedShowStatusBar) statusBarItem.show();

    context.subscriptions.push(
        vscode.commands.registerCommand('amazonq-auto-accept.toggle', () => {
            enabled = !enabled;
            vscode.workspace.getConfiguration('amazonqAutoAccept')
                .update('enabled', enabled, vscode.ConfigurationTarget.Global);
            updateStatusBar();
            enabled ? startPolling() : stopPolling();
            vscode.window.showInformationMessage(`Amazon Q Auto Run: ${enabled ? 'ON' : 'OFF'}`);
        }),
        vscode.commands.registerCommand('amazonq-auto-accept.runOnce', () => sendRunKeystroke()),
        statusBarItem
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (!e.affectsConfiguration('amazonqAutoAccept')) return;
            refreshConfig();
            updateStatusBar();
            cachedShowStatusBar ? statusBarItem.show() : statusBarItem.hide();
            stopPolling();
            if (enabled) startPolling();
        })
    );

    if (enabled) startPolling();
}

function startPolling() {
    stopPolling();
    if (!enabled) return;
    poll();
}

function stopPolling() {
    if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
}

function poll() {
    if (!enabled) return;

    pollTimer = setTimeout(() => {
        if (!enabled || pollRunning) {
            poll();
            return;
        }
        sendRunKeystroke();
        poll();
    }, cachedDelayMs);
}

// Simulate Ctrl+Shift+Enter via PowerShell SendKeys.
// This is the native keybinding for aws.amazonq.runCmdExecution.
// Unlike executeCommand, SendKeys does NOT steal focus — the keystroke
// is sent to whatever window/element currently has focus.
// If Q chat panel has focus → Run is triggered.
// If user is typing elsewhere → keystroke is harmlessly consumed.
function sendRunKeystroke() {
    if (pollRunning) return;
    pollRunning = true;

    cp.exec(
        'powershell -WindowStyle Hidden -NoProfile -Command "$w = New-Object -ComObject WScript.Shell; $w.SendKeys(\'^+{ENTER}\')"',
        { windowsHide: true },
        () => { pollRunning = false; }
    );
}

function updateStatusBar() {
    statusBarItem.text = enabled ? '$(check) Q-AutoRun' : '$(x) Q-AutoRun';
    statusBarItem.tooltip = `Amazon Q Auto Run: ${enabled ? 'Enabled' : 'Disabled'}`;
    statusBarItem.backgroundColor = enabled
        ? undefined
        : new vscode.ThemeColor('statusBarItem.warningBackground');
}

function deactivate() {
    stopPolling();
}

module.exports = { activate, deactivate };
