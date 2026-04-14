# Amazon Q Auto Accept

<p align="center">
  <img src="logo.jpg" width="128" alt="Amazon Q Auto Accept">
</p>

> Auto-accept Amazon Q agent tool execution in VS Code — no more clicking **Run** manually.

When [Amazon Q Developer](https://aws.amazon.com/q/developer/) runs in agent mode, it asks for user confirmation before executing shell commands. This extension automatically approves those executions, enabling a fully hands-free agentic coding workflow.

## How It Works

The extension polls `aws.amazonq.runCmdExecution` at a configurable interval. When Amazon Q presents a pending tool execution (the **Run** button), the command is accepted automatically. If no execution is pending, the call is silently ignored with zero overhead.

A concurrency lock (`isRunning`) ensures only one approval is in-flight at a time, preventing duplicate triggers and keeping the UI responsive.

## Installation

### From VSIX (recommended)

```bash
git clone https://github.com/CGIFM/amazonq-auto-accept.git
cd amazonq-auto-accept
npm install
npm run package
```

Then in VS Code: `Extensions` → `···` → `Install from VSIX…` → select the generated `.vsix` file.

### From Source (development)

```bash
git clone https://github.com/CGIFM/amazonq-auto-accept.git
cd amazonq-auto-accept
npm install
```

Press `F5` to launch the Extension Development Host.

## Usage

| Action | Shortcut |
|--------|----------|
| Toggle on/off | `Ctrl+Shift+Q` (`Cmd+Shift+Q` on Mac) |
| Run once (manual trigger) | `Ctrl+Shift+R` (`Cmd+Shift+R` on Mac) |

Status bar shows `✓ Q-AutoRun` (enabled) or `✗ Q-AutoRun` (disabled). Click to toggle.

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `amazonqAutoAccept.enabled` | `true` | Enable/disable auto-run |
| `amazonqAutoAccept.delayMs` | `800` | Polling interval in ms (200–5000) |
| `amazonqAutoAccept.showStatusBar` | `true` | Show status bar indicator |

## Requirements

- VS Code ≥ 1.82.0
- [Amazon Q Developer Extension](https://marketplace.visualstudio.com/items?itemName=amazonwebservices.amazon-q-vscode) installed and signed in

## ⚠️ Security Notice

This extension **automatically approves** Amazon Q agent tool executions. This means shell commands suggested by Amazon Q will run without manual confirmation.

**Use at your own risk.** It is recommended to:
- Review the Amazon Q chat context before enabling
- Disable auto-run (`Ctrl+Shift+Q`) when working with sensitive environments
- Set a longer polling interval for critical workloads

## License

[MIT](LICENSE)
