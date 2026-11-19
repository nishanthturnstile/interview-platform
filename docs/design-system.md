# BU Interview Studio design system

**Product scope** · Director, HR, interview panelist and candidate workspaces. Use this reference with the [product plan](./product-plan.md) and [architecture](./architecture.md).

Warm neutral surfaces keep long interviews and dense intake tables readable. Orange identifies the main action and active location. A director opening a disputed decision should see the effective outcome first, the signed assessments next, and the source answer or code within one drill-down. The same hierarchy guides each workspace: show the work to do, its current state and the evidence needed to act.

The palette and system-font pairings are an independent PwC-inspired interpretation for the synthetic POC. Use the product name as a text wordmark. Formal PwC use requires approved branding and permission for proprietary marks, fonts and imagery.

## 1. Foundation and setup

Use Next.js App Router, Tailwind CSS v4 and the official shadcn/ui registry. Choose **Radix primitives, Nova style, Neutral base, Lucide icons, small radius, solid menus and subtle menu accent**. Keep the generated component source in the repository. Use the CSS below for the exact product colors and fonts regardless of the choices exposed by the preset builder. [shadcn/ui Create](https://ui.shadcn.com/create) · [Theming reference](https://ui.shadcn.com/docs/theming)

In `apps/web/components.json`, set `tailwind.css` to `src/app/globals.css` and leave `tailwind.config` empty for v4. Merge the declarations below into that stylesheet. Preserve generated imports, dark variant and baseline layers. Replace matching token declarations and mappings once. Start with Button, Field, Input, Select, Checkbox, Table, Badge, Tabs, Card, Dialog, Sheet, DropdownMenu, Sidebar, Breadcrumb, Alert, Skeleton and Tooltip. Add NavigationMenu only on a public surface that needs it. Use the project's pnpm runner for component installation. [shadcn/ui configuration](https://ui.shadcn.com/docs/components-json#tailwind)

## 2. Color and theme contract

The reference palette supplies orange #E65A1E, gold #FFB600, amber #EB8C00, red #E0301E, maroon #602320, graphite #444444 and charcoal #252525. Components consume the semantic colors below. The brighter orange and gold are decorative accents. The light theme uses a deeper orange for white action labels and darker chart strokes for visibility on white. Keep card dividers subtle and field boundaries distinctly visible.

The CSS block is self-contained for theme values and mappings. Light is the default. Apply the dark class on the document root for dark mode, including portal overlays and the code editor. Use the same font stack and component geometry in both modes.

```css
:root {
  color-scheme: light;
  --radius: 0.25rem;
  --background: #F7F6F4;
  --foreground: #252525;
  --card: #FFFFFF;
  --card-foreground: #252525;
  --popover: #FFFFFF;
  --popover-foreground: #252525;
  --primary: #C64B16;
  --primary-foreground: #FFFFFF;
  --primary-hover: #AD3E10;
  --primary-pressed: #90330C;
  --secondary: #EDEAE7;
  --secondary-foreground: #34302D;
  --muted: #F1EFED;
  --muted-foreground: #595551;
  --accent: #FCE9DD;
  --accent-foreground: #81310E;
  --destructive: #B12F24;
  --destructive-foreground: #FFFFFF;
  --border: #E5E2DF;
  --input: #827A74;
  --ring: #A53C10;
  --success: #E4F1E8;
  --success-foreground: #245536;
  --warning: #FFF0CE;
  --warning-foreground: #714704;
  --info: #E7EEF8;
  --info-foreground: #294F79;
  --error: #FCE8E4;
  --error-foreground: #912C20;
  --chart-1: #BC4614;
  --chart-2: #946000;
  --chart-3: #B92C21;
  --chart-4: #602320;
  --chart-5: #525252;
  --sidebar: var(--card);
  --sidebar-foreground: var(--foreground);
  --sidebar-primary: var(--primary);
  --sidebar-primary-foreground: var(--primary-foreground);
  --sidebar-accent: var(--accent);
  --sidebar-accent-foreground: var(--accent-foreground);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--ring);
}

.dark {
  color-scheme: dark;
  --background: #191817;
  --foreground: #F7F6F4;
  --card: #242220;
  --card-foreground: #F7F6F4;
  --popover: #2E2A28;
  --popover-foreground: #F7F6F4;
  --primary: #FF9865;
  --primary-foreground: #251910;
  --primary-hover: #FFAB82;
  --primary-pressed: #F18A5B;
  --secondary: #34312F;
  --secondary-foreground: #F7F6F4;
  --muted: #302D2B;
  --muted-foreground: #C8C1BB;
  --accent: #482B20;
  --accent-foreground: #FFC2A0;
  --destructive: #FF958A;
  --destructive-foreground: #321713;
  --border: #4F4945;
  --input: #91877F;
  --ring: #FFAB82;
  --success: #193529;
  --success-foreground: #A7DDB8;
  --warning: #40321B;
  --warning-foreground: #FFD586;
  --info: #203247;
  --info-foreground: #B0D2FF;
  --error: #482621;
  --error-foreground: #FFB8AE;
  --chart-1: #FF9865;
  --chart-2: #FFC061;
  --chart-3: #FF8880;
  --chart-4: #CF92AE;
  --chart-5: #B4B0AB;
  --sidebar: var(--card);
  --sidebar-foreground: var(--foreground);
  --sidebar-primary: var(--primary);
  --sidebar-primary-foreground: var(--primary-foreground);
  --sidebar-accent: var(--accent);
  --sidebar-accent-foreground: var(--accent-foreground);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--ring);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-hover: var(--primary-hover);
  --color-primary-pressed: var(--primary-pressed);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-error: var(--error);
  --color-error-foreground: var(--error-foreground);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) * 0.5);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) * 1.5);
  --radius-xl: calc(var(--radius) * 2);
  --font-sans: Arial, "Helvetica Neue", Helvetica, sans-serif;
  --font-display: Georgia, "Times New Roman", serif;
  --font-mono: ui-monospace, SFMono-Regular, Consolas, monospace;
}
```

Use solid token pairs for labels and action backgrounds, including hover and pressed states. Override any generated opacity, blend or translucent dark input variant that changes a tested pair. Use a solid 2px focus-visible outline in ring color with a 2px surface gap. This keeps the indicator visible around orange buttons as well as neutral fields. Underline links in running text; use accent-foreground on card for link text.

## 3. Typography, layout and motion

| Element | Specification |
| --- | --- |
| App page title | Arial, 28–36px, 700, line height 1.2. One H1 naming the current task or record. |
| Section / field label | Sections 20–24px, 600–700. Field and table labels 14px, 600. Sentence case; preserve BU and skill acronyms. |
| Body and evidence | Body 16px/1.5; compact lists and table cells 14px/1.5; supporting metadata 12–14px/1.5. Use tabular numerals for durations, timestamps and comparisons. |
| Code and run output | Local monospace, 14–16px/1.5. Keep revision and execution status adjacent. Allow selection, wrapping of diagnostics and horizontal scrolling inside the editor. |
| Editorial display | Georgia, 48–80px/1.08 for a spacious editorial cover; scale down on narrow screens. Internal page titles, scorecards and tables use the app type scale. |
| Spacing and surfaces | 4px base unit; use 4, 8, 12, 16, 24, 32 and 48px. White or dark-card surfaces with a 1px border, 16–24px padding. Reserve a restrained shadow for floating overlays. |
| Shell | 64px header, approximately 240px desktop sidebar, 24–32px workspace gutters. Show active BU and page title. Keep search and actions scoped to the active workspace. Candidate sessions use a compact task header. |
| Responsive layout | Below 768px, move sidebar and secondary panels into titled sheets, stack form columns and use 16px gutters. From 768px, use a collapsible sidebar. From 1024px, show an evidence pane alongside the scorecard when both remain readable. At 320 CSS px, only genuinely two-dimensional tables or code areas scroll horizontally. |
| Icons and motion | Lucide icons at 16px inline and 20px for navigation. Name icon-only controls; hide decorative icons from assistive technology. Use 150–200ms color or opacity transitions. Respect reduced motion by removing translation, shimmer and animated scrolling. |

## 4. Components and interaction states

| Pattern | Behavior and visual treatment |
| --- | --- |
| Header and navigation | Orange rule and current-page semantics identify the active destination. Hover and keyboard focus are distinct. Use Breadcrumb for hierarchy, Sidebar for internal navigation and labelled mobile Sheet triggers. |
| Buttons and links | Primary for the main action in a task, secondary for alternatives, ghost for utilities. Use 4px corners, 40px minimum desktop height and at least 44px touch targets. Editorial CTAs may use 44–48px. Give destructive actions an explicit verb, a destructive fill and matching foreground. During submission keep the action label, add progress, prevent double submission and announce the outcome. |
| Forms and filters | Visible label above every input, 40px minimum desktop height, solid input border and adjacent help. Associate units with both experience fields. Identify required fields in text. Link inline errors with aria-describedby and set aria-invalid. On failed submit focus the first invalid field or a linked error summary. A read-only value remains legible and selectable. |
| Cards and dialogs | Group one task or decision per card. Use a sheet for evidence inspection and a dialog for a focused decision such as confirming an override. Give each overlay a title, contain keyboard focus, support Escape and restore focus to the trigger. |
| Data tables | Neutral header, 44–52px normal rows, sortable column buttons with aria-sort on the active header. Align numeric columns and wrap long names. Give horizontal scroll regions a name. Selected rows use an accent surface and a checkbox or marker. On narrow screens retain identity, state and next action first. |
| Tabs, menus and tooltips | Use Radix keyboard behavior. Mark selected tabs using a rule plus label weight. Keep menus solid and accent subtle. Put essential instructions inline; use tooltips for supplementary detail. |
| Feedback | Reserve layout space during loading and mark the region busy. Empty queues explain what would appear. Distinguish an empty result from a failed fetch. Show “Saved”, “Saving…” or “Unsaved changes” by the relevant editor. Use a persistent alert with recovery action for failures and a polite live region for completed saves. |
| Status and charts | Pair a text label with a semantic foreground and surface. Use success for completed operations, warning for action needed, error for failed operations, info for scheduled or pending work and muted for unassessed. Use numbered chart tokens on card surfaces, direct labels and different line dashes, symbols or patterns. Offer the underlying values in a table. |

## 5. Product patterns

| Workspace | Application of the system |
| --- | --- |
| HR intake | Show active BU, opening and batch above the preview. Summarize valid rows, conflicts and missing files. A duplicate opens a field-by-field comparison with explicit Skip, Reuse or Update selected fields actions. Preserve input when resolving errors. |
| Scheduling | Present eligible panelists with relevant months and skill. Explain a blocked booking beside its control. Display timezone and busy slots without exposing another BU’s candidate. Label the Teams link and coding link separately. |
| Panelist interview | Keep the actual question and note field central. Show AI suggestions in a secondary area labelled “AI suggestion” with use, edit or dismiss actions. Separate observed evidence from unassessed competencies. Keep the signed state and its author visible. |
| Candidate exercise | Show the task, allowed resources, editor, Run and Submit. Display saved revision and the revision last run. Distinguish compilation errors from runner unavailability. Provide a keyboard route into and out of the editor. Hide staff navigation, scores and private test expectations. |
| Director review | Lead with exceptions and the effective decision. Present BU capability and client readiness in separate labelled fields. Drill down to the original observation or run. A justified override preserves signed scores and displays the author and time of the new disposition. |
| Identity and offline states | Show the identity-check result in ordinary workflows; render the image only in the authorized verification view. When hosted AI is unavailable, label pending drafts and keep notes, guides and manual scoring usable. Reserve error styling for operational failures; a person’s hiring outcome always has a neutral, explicit label. |

## 6. Validation and acceptance

The ratios below were calculated from the opaque sRGB tokens using relative luminance. Normal text requires at least 4.5:1; meaningful non-text indicators target at least 3:1 against their adjacent surface. A pale divider is suitable for grouping where spacing and headings already establish the structure. [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) · [Non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)

| Checked pair | Light | Dark |
| --- | ---: | ---: |
| Body on canvas | 14.19:1 | 16.42:1 |
| Primary label on fill | 4.75:1 | 8.11:1 |
| Supporting text on muted surface | 6.44:1 | 7.68:1 |
| Field outline on card | 4.21:1 | 4.51:1 |
| Focus ring on card | 6.45:1 | 8.61:1 |

Validation also covered primary hover and pressed labels, secondary, accent, destructive and all four status pairs, plus chart marks on canvas and card in both themes. The supplied #777777 muted gray and #E5E2DF divider needed stronger alternatives for small supporting text and field outlines respectively.

During implementation, verify generated Button, Input, Badge and Sidebar variants in both themes at their actual computed colors. Test keyboard-only intake and override, dialog focus restoration, editor escape, candidate save announcements, reduced motion, text zoom, narrow viewport overflow and chart labels. Check light and dark views of a duplicate import, a failed run and a signed L2 assessment. Token validation covers the specified pairs; rendered component behavior needs a working application.
