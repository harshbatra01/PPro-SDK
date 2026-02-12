I'll update that for you immediately to keep the company name private.

Here is the revised Markdown code:

Markdown
# AI-Powered Premiere Pro Extension

An advanced Adobe CEP extension that bridges modern AI capabilities with Adobe’s legacy ExtendScript environment to automate professional video editing workflows.

## 🚀 Project Overview
Developed for a **video editing company**, this extension was engineered to reduce manual editing time by over 40%. The core challenge involved integrating modern LLM-generated commands into the Premiere Pro timeline, which operates on a restricted legacy engine.

### Key Achievements:
* **Engineered an Async-to-ES3 Bridge:** Solved the lack of `async/await` in Premiere’s 1999-era JavaScript engine by implementing a custom callback bridge with state polling.
* **LLM Integration:** Built a pipeline that translates natural language prompts into executable timeline edits (cuts, transitions, and asset placement).
* **Production-Ready Stability:** Stabilized cross-environment data transfer through explicit serialization, ensuring reliable execution in professional workflows.

---

## 🛠 Tech Stack
* **UI/Frontend:** HTML5, CSS3, Modern JavaScript (ES6+)
* **Host Integration:** Adobe CEP 11 & ExtendScript (ES3)
* **API Communication:** Node.js-based serialization layer
* **Development:** VS Code, ExtendScript Debugger, ZXPSignCmd

---

## 🏗 Technical Deep Dive: The Async Bridge
The primary technical hurdle was bridging **Modern JS (ES6)** used in the panel UI to **ExtendScript (ES3)** used by Premiere Pro. 

Since ES3 lacks native asynchronous support, I redesigned the communication layer:
1. **Serialization:** All UI requests are serialized into strings.
2. **Callback Bridge:** Implemented a custom listener that manages the hand-off between the Chromium-based panel and the host application.
3. **State Polling:** Created a polling mechanism to monitor long-running ExtendScript tasks, preventing UI freezes and ensuring data integrity upon completion.

---

## 🔧 Installation & Local Development

### 1. Enable Debug Mode
To load this unsigned extension for development:
* **Windows:** Add a Registry String `PlayerDebugMode` with value `1` to `HKEY_CURRENT_USER\Software\Adobe\CSXS.11`.
* **macOS:** ```bash
  defaults write com.adobe.CSXS.11.plist PlayerDebugMode 1
2. Deployment Path
Clone the repository into the system-specific Adobe extension folder:

Windows: C:\Program Files (x86)\Common Files\Adobe\CEP\extensions

macOS: /Library/Application Support/Adobe/CEP/extensions

📂 Repository Structure
/client: Modern JavaScript UI and LLM command processing.

/host: ExtendScript (ES3) logic for Premiere Pro timeline manipulation.

/manifest: Configuration for CEP 11 integration.

📈 Impact & Results
Successfully deployed and used in production, this tool transformed the editing process from manual asset manipulation to an AI-assisted workflow, maintaining stability even in complex, multi-layered projects.
