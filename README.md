# Amazon Q Auto Accept

<p align="center">
  <img src="logo-w.jpg" width="320" alt="Amazon Q Auto Accept">
</p>

<p align="center">
  <strong>⚡ Auto-accept Amazon Q agent tool execution in VS Code — no more clicking <code>Run</code> manually.</strong>
</p>

<p align="center">
  <a href="https://github.com/CGIFM/amazonq-auto-accept/releases"><img src="https://img.shields.io/github/v/release/CGIFM/amazonq-auto-accept?style=flat-square&color=blue" alt="Release"></a>
  <a href="https://github.com/CGIFM/amazonq-auto-accept/blob/main/LICENSE"><img src="https://img.shields.io/github/license/CGIFM/amazonq-auto-accept?style=flat-square" alt="License"></a>
  <a href="https://github.com/CGIFM/amazonq-auto-accept/stargazers"><img src="https://img.shields.io/github/stars/CGIFM/amazonq-auto-accept?style=flat-square&color=yellow" alt="Stars"></a>
</p>

---

## ⚠️ IMPORTANT: Toggle Shortcut

<table>
<tr>
<td>

### 🔴 You MUST know this shortcut:

# `Ctrl + Shift + Q`
### (`Cmd + Shift + Q` on Mac)

**When auto-accept is ON, you CANNOT type in the Amazon Q chat input box.**
The extension polls commands that steal focus from the chat panel.

**Always press `Ctrl+Shift+Q` to toggle OFF before typing in the Q chat.**

</td>
</tr>
</table>

---

## 🤔 What Does It Do?

When [Amazon Q Developer](https://aws.amazon.com/q/developer/) runs in agent mode, it asks for confirmation before:

- 🔧 **Running shell commands** → the `Run` button
- 📝 **Editing your files** → the `Allow` button

This extension **automatically clicks both** for you. Hands-free agentic coding. 🚀

---

## ⚙️ How It Works

```
Amazon Q suggests a command
        ↓
   ┌─────────┐
   │   Run   │  ← Extension auto-clicks this ✅
   └─────────┘
        ↓
   Command executes automatically
```

The extension polls `aws.amazonq.runCmdExecution` and `aws.amazonq.inline.acceptEdit` at a configurable interval. A concurrency lock (`isRunning`) ensures only one approval is in-flight at a time, preventing duplicate triggers.

---

## 📦 Installation

### From VSIX (recommended)

1. Download the `.vsix` file from [Releases](https://github.com/CGIFM/amazonq-auto-accept/releases)
2. Drag and drop into VS Code Extensions panel
3. Reload VS Code — done! ✅

### From Source

```bash
git clone https://github.com/CGIFM/amazonq-auto-accept.git
cd amazonq-auto-accept
npm install
npm run package
```

Then: `Extensions` → `···` → `Install from VSIX…` → select the `.vsix` file.

---

## 🎮 Usage

| Action | Shortcut | Description |
|--------|----------|-------------|
| 🔄 **Toggle on/off** | **`Ctrl+Shift+Q`** | ⚠️ **Turn OFF before typing in Q chat!** |
| ▶️ Run once | `Ctrl+Shift+R` | Manual trigger |

Status bar indicator (bottom-right):

| Status | Meaning |
|--------|---------|
| `✅ Q-AutoRun v1.0.1` | Auto-accept is **ON** |
| `❌ Q-AutoRun v1.0.1` | Auto-accept is **OFF** |

> 💡 **Tip:** Click the status bar item to toggle on/off.

---

## 🔧 Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `amazonqAutoAccept.enabled` | `true` | Enable/disable auto-run |
| `amazonqAutoAccept.delayMs` | `800` | Polling interval in ms (200–5000) |
| `amazonqAutoAccept.showStatusBar` | `true` | Show status bar indicator |

---

## 📋 Requirements

- VS Code ≥ 1.82.0
- [Amazon Q Developer Extension](https://marketplace.visualstudio.com/items?itemName=amazonwebservices.amazon-q-vscode) installed and signed in

---

## 🛡️ Security Notice

> ⚠️ This extension **automatically approves** Amazon Q agent tool executions.
> Shell commands and file edits suggested by Amazon Q will run **without manual confirmation**.

**Recommendations:**
- 🔍 Review the Amazon Q chat context before enabling
- 🔒 Press **`Ctrl+Shift+Q`** to disable when working with sensitive environments
- ⏱️ Set a longer polling interval for critical workloads

---

## 📄 License

[MIT](LICENSE) — free and open source.

---

<p align="center">
  Made with ❤️ for the Amazon Q community
</p>
