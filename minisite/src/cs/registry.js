/**
 * Case-study demo registry — maps <div class="cs-demo" data-demo="…"> markers
 * in _case_studies markdown to interactive components. One folder per study;
 * add a study by importing its demos here.
 */
import TokenLayerDemo     from './agentic-design-system/TokenLayerDemo.js'
import WorkflowDemo       from './agentic-design-system/WorkflowDemo.js'
import TokenArchDiagram   from './agentic-design-system/TokenArchDiagram.js'
import ThemeWindow        from './agentic-design-system/ThemeWindow.js'
import ComponentSpecPanel from './agentic-design-system/ComponentSpecPanel.js'
import StateMatrixDemo    from './agentic-design-system/StateMatrixDemo.js'
import FigmaSourcePanel   from './agentic-design-system/FigmaSourcePanel.js'
import DriftAuditTerminal from './agentic-design-system/DriftAuditTerminal.js'

export const DEMOS = {
  'token-layers':    TokenLayerDemo,
  'agent-workflows': WorkflowDemo,
  'token-arch':      TokenArchDiagram,
  'theme-window':    ThemeWindow,
  'component-spec':  ComponentSpecPanel,
  'state-matrix':    StateMatrixDemo,
  'figma-source':    FigmaSourcePanel,
  'drift-audit':     DriftAuditTerminal,
}
