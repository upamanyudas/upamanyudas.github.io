/**
 * Case-study demo registry — maps <div class="cs-demo" data-demo="…"> markers
 * in _case_studies markdown to interactive components. One folder per study;
 * add a study by importing its demos here.
 */
import TokenLayerDemo    from './agentic-design-system/TokenLayerDemo.js'
import WorkflowDemo      from './agentic-design-system/WorkflowDemo.js'
import TokenArchDiagram  from './agentic-design-system/TokenArchDiagram.js'
import ThemeWindow       from './agentic-design-system/ThemeWindow.js'
import ContentDataPanel  from './agentic-design-system/ContentDataPanel.js'
import DriftAuditTerminal from './agentic-design-system/DriftAuditTerminal.js'
import RepoWindow        from './agentic-design-system/RepoWindow.js'

export const DEMOS = {
  'token-layers':   TokenLayerDemo,
  'agent-workflows': WorkflowDemo,
  'token-arch':     TokenArchDiagram,
  'theme-window':   ThemeWindow,
  'content-data':   ContentDataPanel,
  'drift-audit':    DriftAuditTerminal,
  'repo-window':    RepoWindow,
}
