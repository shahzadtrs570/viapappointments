# Buyer Onboarding UK English Language Review Plan

## Objective
Review and update the buyer onboarding process to use UK English spelling and terminology, and to avoid US-centric phrasing, as per feedback.

---

## 1. Terms and Phrases to Review/Change

| Current Term/Phrase                | UK English Alternative         | Rationale/Notes                                      |
|------------------------------------|-------------------------------|------------------------------------------------------|
| Auto-Fill                          | Autofill                      | "Autofill" (one word, no hyphen) is preferred in UK. |
| Show Progress                      | View Progress                 | "View" is more common in UK UI.                      |
| Show Steps                         | View Steps                    |                                                      |
| Show Guide                         | View Guide                    |                                                      |
| Hide Progress                      | Hide Progress                 | (Keep, but check for consistency)                    |
| Hide Steps                         | Hide Steps                    |                                                      |
| Hide Guide                         | Hide Guide                    |                                                      |
| Buy-Box                            | Buy Box                       | Remove hyphen unless brand-specific.                 |
| Buyer Onboarding                   | Buyer Onboarding              | (Neutral, but check for other US terms)              |
| Selected Properties                | Selected Properties           | (Neutral, but check for context)                     |
| Conceptualization                  | Conceptualisation             | Use "s" not "z" in UK spelling.                     |
| Organization/Organize              | Organisation/Organise         | Use "s" not "z" in UK spelling.                     |
| Customization/Customize            | Customisation/Customise       | Use "s" not "z" in UK spelling.                     |
| Capitalization/Capitalize          | Capitalisation/Capitalise     | Use "s" not "z" in UK spelling.                     |
| (Other -ize/-ization words)        | (Use -ise/-isation)           | Review for all such words.                           |

---

## 2. Files to Update

- `apps/dashboard/src/app/[lng]/(dashboard)/buyer-onboarding/page.tsx`
- All files in `apps/dashboard/src/app/[lng]/(dashboard)/buyer-onboarding/_components/`
  - Especially step components in `_components/Steps/`
- Any constants or types files with user-facing text

---

## 3. Action Plan

1. **Review all user-facing text** in the above files for US English spelling and phrasing.
2. **Update terms/phrases** as per the table above, prioritising UK English and more neutral UI language.
3. **Check for -ize/-ization words** and replace with -ise/-isation where appropriate.
4. **Review "Buy-Box" usage**: If not a brand, use "Buy Box" (no hyphen). If brand, clarify with stakeholders.
5. **Check for other Americanisms** (e.g., "color" vs. "colour", "analyze" vs. "analyse").
6. **Document all changes** for review before implementation.

---

## 4. Next Steps
- Await review and approval of this plan.
- Once approved, implement the changes in the listed files.
- Test the UI to ensure all terminology is updated and consistent.
- Document any edge cases or terms that require stakeholder input. 