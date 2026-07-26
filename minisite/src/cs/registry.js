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

import AudienceSplit      from './re-envisioning-ticketing/AudienceSplit.js'
import PitchMorph         from './re-envisioning-ticketing/PitchMorph.js'
import RevenueLoop        from './re-envisioning-ticketing/RevenueLoop.js'
import TeamShape          from './re-envisioning-ticketing/TeamShape.js'
import TemplatePipeline   from './re-envisioning-ticketing/TemplatePipeline.js'
import BuzzFeed           from './re-envisioning-ticketing/BuzzFeed.js'
import WatchGuide         from './re-envisioning-ticketing/WatchGuide.js'
import AdRules            from './re-envisioning-ticketing/AdRules.js'
import AdShot             from './re-envisioning-ticketing/AdShot.js'

import RatingBias         from './nine-second-reviews/RatingBias.js'
import RatingTakes        from './nine-second-reviews/RatingTakes.js'
import ReviewForm         from './nine-second-reviews/ReviewForm.js'
import TagMine            from './nine-second-reviews/TagMine.js'
import Benchmark          from './nine-second-reviews/Benchmark.js'
import TrustWeight        from './nine-second-reviews/TrustWeight.js'
import NudgeStory         from './nine-second-reviews/NudgeStory.js'
import ReviewSummary      from './nine-second-reviews/ReviewSummary.js'

import SpreadsheetPain    from './group-optimiser/SpreadsheetPain.js'
import OptimiserSteps     from './group-optimiser/OptimiserSteps.js'
import GoPreferences      from './group-optimiser/GoPreferences.js'
import NetPosition        from './group-optimiser/NetPosition.js'
import Exclusions         from './group-optimiser/Exclusions.js'
import PaymentPlans       from './group-optimiser/PaymentPlans.js'
import DeadlineBoard      from './group-optimiser/DeadlineBoard.js'
import ReportExport       from './group-optimiser/ReportExport.js'

export const DEMOS = {
  // Agentic design system
  'token-layers':      TokenLayerDemo,
  'agent-workflows':   WorkflowDemo,
  'token-arch':        TokenArchDiagram,
  'theme-window':      ThemeWindow,
  'component-spec':    ComponentSpecPanel,
  'state-matrix':      StateMatrixDemo,
  'figma-source':      FigmaSourcePanel,
  'drift-audit':       DriftAuditTerminal,

  // Re-envisioning a mass ticketing platform
  'audience-split':    AudienceSplit,
  'pitch-morph':       PitchMorph,
  'revenue-loop':      RevenueLoop,
  'team-shape':        TeamShape,
  'template-pipeline': TemplatePipeline,
  'buzz-feed':         BuzzFeed,
  'watch-guide':       WatchGuide,
  'ad-rules':          AdRules,
  'ad-tech-shot':      AdShot,

  // Ratings and reviews in nine seconds
  'rating-bias':       RatingBias,
  'rating-takes':      RatingTakes,
  'review-form':       ReviewForm,
  'tag-mine':          TagMine,
  'benchmark':         Benchmark,
  'trust-weight':      TrustWeight,
  'nudge-story':       NudgeStory,
  'review-summary':    ReviewSummary,

  // Group Optimiser
  'spreadsheet-pain':  SpreadsheetPain,
  'optimiser-steps':   OptimiserSteps,
  'go-preferences':    GoPreferences,
  'net-position':      NetPosition,
  'exclusions':        Exclusions,
  'payment-plans':     PaymentPlans,
  'deadline-board':    DeadlineBoard,
  'report-export':     ReportExport,
}
