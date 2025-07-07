# BuyBox Creation UK English & Terminology Review Plan

## Objective
Review all user-facing text in the BuyBoxCreation and buy-box-creation files for US/UK English spelling, Americanisms, and the use of 'Buy-Box' (unless it is a brand). Suggest UK alternatives where needed.

---

## Review Summary

### Files Reviewed
- `apps/dashboard/src/app/[lng]/(dashboard)/admin/buy-box-creation/page.tsx`
- `apps/dashboard/src/app/[lng]/(dashboard)/admin/_components/BuyBoxCreation/BuyBoxCreation.tsx`
- `apps/dashboard/src/app/[lng]/(dashboard)/admin/_components/BuyBoxCreation/types.ts`
- `apps/dashboard/src/app/[lng]/(dashboard)/admin/_components/BuyBoxCreation/StepProps.ts`
- All step components in `apps/dashboard/src/app/[lng]/(dashboard)/admin/_components/BuyBoxCreation/Steps/`

### Findings
- The term **"Buy-Box"** is used throughout as a product/feature name. If this is a brand or accepted product term, it can remain. If not, consider changing to **"Buy Box"** (no hyphen) for UK English consistency.
- The step name **"ThemeConceptualizationStep"** and UI text **"Conceptualization"** use the US spelling. UK English is **"Conceptualisation"**.
- No other US English spellings, Americanisms, or problematic terms were found in the reviewed files.

---

## Explicit Change List

### If 'Buy-Box' is NOT a brand, update:
- All user-facing instances of **"Buy-Box"** → **"Buy Box"**
  - e.g. Page title, guide messages, button labels, step titles, etc.
  - Rationale: UK English prefers no hyphen unless a brand name.

### Theme Conceptualization Step
- All user-facing instances of **"Conceptualization"** → **"Conceptualisation"**
  - e.g. Step title, section headers, guide messages, etc.
  - Rationale: UK English spelling uses "s" not "z".

---

## Example Changes
- `Buy-Box Creation` → `Buy Box Creation` (if not a brand)
- `Theme Conceptualization` → `Theme Conceptualisation`
- `Buy-Box Identification & Conceptualization` → `Buy Box Identification & Conceptualisation`
- Any other UI text, tooltips, or messages using these terms

---

## Next Steps
- Confirm if 'Buy-Box' is a brand. If not, proceed with the above changes.
- Update all relevant files and UI text for UK English consistency.
- No other changes are required based on the current review. 