# Marketing i18next US-to-UK English Implementation Plan

## Objective
Review and update all i18next language files in `apps/marketing/public/locales/en` to use UK English spelling and terminology, and to avoid US-centric phrasing, as per best practice and feedback.

---

## Explicit File-by-File Change List

### whatIsSrenova.json
- **description.paragraph2**
  - Replace all instances of `modernized` with `modernised`.
  - Reason: UK spelling.
- **chat.initial_message**
  - Replace all instances of `program` with `programme`.
  - Reason: UK spelling.

### viagerExplainer.json
- **(all values)**
  - Replace all instances of `customized`/`personalized` with `customised`/`personalised`.
  - Reason: UK spelling.

### valueProposition.json
- **(all values)**
  - Replace all instances of `advisor`/`advisors` with `adviser`/`advisers`.
  - Reason: UK spelling.

### trustIndicators.json
- **(all values)**
  - Replace all instances of `standardized`/`specialized`/`personalized` with `standardised`/`specialised`/`personalised`.
  - Reason: UK spelling.

### landing.json
- **info_section.step_2_title**
  - From: `Personalized Options`
  - To:   `Personalised Options`
  - Reason: UK spelling.
- **info_section.step_2_description**
  - Replace all instances of `customized`/`personalized` with `customised`/`personalised`.
  - Reason: UK spelling.
- **features.feature_2_description**
  - Replace all instances of `customized` with `customised`.
  - Reason: UK spelling.
- **features.feature_3_description**
  - Replace all instances of `advisors` with `advisers`.
  - Reason: UK spelling.
- **features.group_one.guidance.text**
  - Replace all instances of `advisors`/`personalized` with `advisers`/`personalised`.
  - Reason: UK spelling.
- **features.group_two.receive.text**
  - Replace all instances of `advisor`/`personalized` with `adviser`/`personalised`.
  - Reason: UK spelling.
- **lead_capture.form_phone_label**
  - From: `Phone Number`
  - To:   `Telephone Number`
  - Reason: UK usage prefers "telephone".
- **lead_capture.form_phone_placeholder**
  - From: `Enter your phone number`
  - To:   `Enter your telephone number`
  - Reason: UK usage prefers "telephone".
- **faq, testimonials, and other sections**
  - Replace all instances of `advisor`/`advisors` with `adviser`/`advisers`.
  - Reason: UK spelling.
- **optimize**
  - From: `optimize`
  - To:   `optimise`
  - Reason: UK spelling.
- **finalization**
  - From: `finalization`
  - To:   `finalisation`
  - Reason: UK spelling.

### howItWorks.json
- **description, steps**
  - Replace all instances of `inquiry` with `enquiry`.
  - Replace all instances of `personalized`/`customized` with `personalised`/`customised`.
  - Reason: UK spelling.

### eligibility.json
- **header.button, sidebar.help.button**
  - From: `Speak to an Advisor`/`Call an Advisor`
  - To:   `Speak to an Adviser`/`Call an Adviser`
  - Reason: UK spelling.
- **contactForm.label.phone**
  - From: `Phone Number (Optional)`
  - To:   `Telephone Number (Optional)`
  - Reason: UK usage prefers "telephone".
- **contactForm.placeholder.phone**
  - From: `Enter your phone number`
  - To:   `Enter your telephone number`
  - Reason: UK usage prefers "telephone".
- **sidebar.chatbot.welcome, sidebar.chatbot.eligibility.viager_model**
  - Replace all instances of `program` with `programme`.
  - Reason: UK spelling.
- **age.options.under55.description**
  - From: `Not yet eligible for age-related services,`
  - To:   `Not yet eligible for age related services,`
  - Reason: Remove hyphen in UK English unless compound modifier.

### testimonials.json
- **(all values)**
  - Replace all instances of `advisor`/`advisors` with `adviser`/`advisers`.
  - Reason: UK spelling.

### calculator.json
- **(all values)**
  - Replace all instances of `customized`/`personalized` with `customised`/`personalised`.
  - Reason: UK spelling.

### common.json
- **(all values)**
  - Replace all instances of `advisor`/`advisors` with `adviser`/`advisers`.
  - Reason: UK spelling.

### features.json
- **(all values)**
  - Replace all instances of `customized`/`personalized` with `customised`/`personalised`.
  - Reason: UK spelling.

### callToAction.json
- **(all values)**
  - Replace all instances of `advisor`/`advisors` with `adviser`/`advisers`.
  - Reason: UK spelling.

---

## Summary
- Only the above keys/values require updating for UK English.
- All other values are either already UK English, neutral, or do not require change.
- After approval, implement these changes in the respective JSON files. 