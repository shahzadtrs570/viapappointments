# Dashboard i18next US-to-UK English Implementation Plan

## Objective
Review and update all i18next language files in `apps/dashboard/public/locales/en` to use UK English spelling and terminology, and to avoid US-centric phrasing, as per best practice and feedback.

---

## Explicit File-by-File Change List

### wizard_provisional_offer.json
- **nextStepsSection.item1**
  - From: `Your dedicated Srenvoa advisor will contact you within 24 hours to arrange the next steps.`
  - To:   `Your dedicated Srenvoa adviser will contact you within 24 hours to arrange the next steps.`
  - Reason: UK spelling of "adviser".
- **nextStepsSection.dedicatedAdvisorTitle**
  - From: `YOUR DEDICATED ADVISOR:`
  - To:   `YOUR DEDICATED ADVISER:`
  - Reason: UK spelling.
- **importantRecommendation.description**
  - Replace all instances of `advisor`/`advisors` with `adviser`/`advisers`.
  - Reason: UK spelling.
- **importantRecommendation.sharedOption**
  - From: `Shared this offer with family/financial advisors`
  - To:   `Shared this offer with family/financial advisers`
  - Reason: UK spelling.
- **responseSection.speakAdvisorButton.label**
  - From: `Speak with an Advisor`
  - To:   `Speak with an Adviser`
  - Reason: UK spelling.
- **speakHumanForm.title**
  - From: `Speak with an Advisor`
  - To:   `Speak with an Adviser`
  - Reason: UK spelling.
- **speakHumanForm.phoneLabel**
  - From: `Your Phone Number`
  - To:   `Your Telephone Number`
  - Reason: UK usage prefers "telephone".
- **acceptanceConfirmation.advisorContact**
  - From: `Advisor Contact: Your dedicated advisor, {{advisorName}}, will contact you within 24 hours.`
  - To:   `Adviser Contact: Your dedicated adviser, {{advisorName}}, will contact you within 24 hours.`
  - Reason: UK spelling.
- **acceptanceConfirmation.continueButton**
  - From: `Continue to Finalisation`
  - To:   `Continue to Finalisation` (no change, already UK spelling)
- **toasts.acceptedSuccess**
  - From: `Your provisional offer has been accepted. Continue to finalization when ready.`
  - To:   `Your provisional offer has been accepted. Continue to finalisation when ready.`
  - Reason: UK spelling.
- **guideBot2.responses.paymentChanges**
  - Replace all instances of `advisor` with `adviser`.
  - Reason: UK spelling.

### wizard_review_recommendations.json
- **srenovaRecommendations.checklist.financialAdvisor**
  - From: `I have considered adding a financial advisor to my support network`
  - To:   `I have considered adding a financial adviser to my support network`
  - Reason: UK spelling.
- **guideBot.initialMessage**
  - Replace all instances of `advisor` with `adviser`.
  - Reason: UK spelling.
- **guideBot.responses.required_documents**
  - From: `passport/driving license`
  - To:   `passport/driving licence`
  - Reason: UK spelling.
- **guideBot.responses.process_timeline**
  - From: `finalizing agreements`
  - To:   `finalising agreements`
  - Reason: UK spelling.
- **guideBot.responses.post_submission**
  - Replace all instances of `advisor` with `adviser`.
  - Reason: UK spelling.
- **chatbot.suggestedQuestions.financialAdvisor**
  - From: `Should I consult a financial advisor?`
  - To:   `Should I consult a financial adviser?`
  - Reason: UK spelling.

### wizard_seller_information.json
- **ownerDetailsSection.form.phone.label**
  - From: `Phone Number`
  - To:   `Telephone Number`
  - Reason: UK usage prefers "telephone".
- **ownerDetailsSection.form.phone.placeholder**
  - From: `Enter phone number`
  - To:   `Enter telephone number`
  - Reason: UK usage prefers "telephone".
- **nextSteps.step3**
  - From: `Receive personalized recommendations`
  - To:   `Receive personalised recommendations`
  - Reason: UK spelling.

### wizard_property_information.json
- **guideBot.responses.next_steps**
  - Replace all instances of `personalized` with `personalised`.
  - Reason: UK spelling.
- **guideBot.responses.nextSteps**
  - Replace all instances of `personalized` with `personalised`.
  - Reason: UK spelling.
- **nextStepsSidebar.step3**
  - From: `Receive personalized recommendations`
  - To:   `Receive personalised recommendations`
  - Reason: UK spelling.

### wizard_header.json
- **speakToAdvisorButton**
  - From: `Speak to an Advisor`
  - To:   `Speak to an Adviser`
  - Reason: UK spelling.

### wizard_eligibility.json
- **questions.discussOptions.label**
  - From: `Would you like to discuss your options with a financial advisor?`
  - To:   `Would you like to discuss your options with a financial adviser?`
  - Reason: UK spelling.

### wizard_contemplation.json
- **steps.verification.process_value**
  - From: `Electronic records check, land registry confirmation, and market analysis`
  - To:   `Electronic records check, land registry confirmation, and market analysis` (no change, "analysis" is correct in UK English)
- **steps.offer.description**
  - Replace all instances of `personalized` with `personalised`.
  - Reason: UK spelling.
- **about_section.difference.description**
  - Replace all instances of `advisors` with `advisers`.
  - Reason: UK spelling.

### wizard_completion_status.json
- **solicitorDetails.form.phone.label**
  - From: `Phone Number`
  - To:   `Telephone Number`
  - Reason: UK usage prefers "telephone".
- **solicitorDetails.form.phone.placeholder**
  - From: `Enter phone number`
  - To:   `Enter telephone number`
  - Reason: UK usage prefers "telephone".
- **solicitorDetails.form.phone.validationInvalid**
  - From: `Please enter a valid phone number (minimum 10 digits)`
  - To:   `Please enter a valid telephone number (minimum 10 digits)`
  - Reason: UK usage prefers "telephone".

---

## Summary
- Only the above keys/values require updating for UK English.
- All other values are either already UK English, neutral, or do not require change.
- After approval, implement these changes in the respective JSON files.

---

## 1. Terms and Phrases to Review/Change

| Current Term/Phrase                | UK English Alternative         | Reason/Notes                                         |
|------------------------------------|-------------------------------|------------------------------------------------------|
| Advisor                            | Adviser                      | UK spelling is "adviser" for financial/legal context |
| Valuation                          | Valuation                    | (Check for context, spelling is the same)            |
| Customize/Customization            | Customise/Customisation      | Use "s" not "z" in UK spelling                      |
| Organize/Organization              | Organise/Organisation        | Use "s" not "z" in UK spelling                      |
| Finalization/Finalize              | Finalisation/Finalise        | Use "s" not "z" in UK spelling                      |
| Personalize/Personalization        | Personalise/Personalisation  | Use "s" not "z" in UK spelling                      |
| License                            | Licence                      | Use "c" for noun in UK English                      |
| Center                             | Centre                       | UK spelling                                          |
| Color                              | Colour                       | UK spelling                                          |
| Analyze/Analysis                   | Analyse/Analysis             | Use "s" not "z" in UK spelling                      |
| Recognize/Recognition              | Recognise/Recognition        | Use "s" not "z" in UK spelling                      |
| Behavior                           | Behaviour                    | UK spelling                                          |
| Program (for event, not software)  | Programme                    | UK spelling                                          |
| Check (for verification)           | Cheque (for payment)         | Only if context is payment                           |
| Initializing/Initialized           | Initialising/Initialised     | Use "s" not "z" in UK spelling                      |
| Canceled/Cancelling                | Cancelled/Cancelling         | Double "l" in UK spelling                           |
| Modeled/Modeling                   | Modelled/Modelling           | Double "l" in UK spelling                           |
| Enrollment/Enrolment               | Enrolment                    | UK spelling                                          |
| Plow                               | Plough                       | UK spelling                                          |
| Traveler                           | Traveller                    | UK spelling                                          |
| Fulfill                            | Fulfil                       | UK spelling                                          |
| Draft                              | Draft                        | (Check for context, spelling is the same)            |
| Property Value                     | Property Value               | (Check for context, spelling is the same)            |
| License (noun)                     | Licence                      | UK spelling                                          |
| Email                              | Email                        | (Spelling is the same, check for context)            |
| Phone Number                       | Telephone Number             | "Telephone" is more formal in UK English            |
| Zip Code                           | Postcode                     | UK spelling                                          |
| Realtor                            | Estate Agent                 | UK term                                              |
| Appraise/Appraisal                 | Value/Valuation              | UK term                                              |
| Curb (as in curb appeal)           | Kerb                         | UK spelling                                          |
| Inquiry                            | Enquiry                      | UK spelling                                          |
| Acknowledgment                     | Acknowledgement              | UK spelling                                          |
| Defense                            | Defence                      | UK spelling                                          |
| Offense                            | Offence                      | UK spelling                                          |
| Practice (noun, legal/medical)     | Practice                     | (Same, but check for context)                        |
| Practice (verb)                    | Practise                     | UK spelling                                          |
| Age-Related                        | Age Related                  | Remove hyphen if not compound modifier               |
| Aging                              | Ageing                       | UK spelling                                          |
| Enrollment                         | Enrolment                    | UK spelling                                          |
| Catalog                            | Catalogue                    | UK spelling                                          |
| Dialog                             | Dialogue                     | UK spelling                                          |
| Favorite                           | Favourite                    | UK spelling                                          |
| Honor                              | Honour                       | UK spelling                                          |
| Labor                              | Labour                       | UK spelling                                          |
| Neighbor                           | Neighbour                    | UK spelling                                          |
| Plow                               | Plough                       | UK spelling                                          |
| Program (event)                    | Programme                    | UK spelling                                          |
| Traveler                           | Traveller                    | UK spelling                                          |
| Jewelry                            | Jewellery                    | UK spelling                                          |
| Mustache                           | Moustache                    | UK spelling                                          |
| Pajamas                            | Pyjamas                      | UK spelling                                          |
| Tire (car)                         | Tyre                         | UK spelling                                          |
| Canceled                           | Cancelled                    | UK spelling                                          |
| Modeled                            | Modelled                     | UK spelling                                          |
| Counseling                         | Counselling                  | UK spelling                                          |
| Practice (verb)                    | Practise                     | UK spelling                                          |
| Enrollment                         | Enrolment                    | UK spelling                                          |
| Fulfill                            | Fulfil                       | UK spelling                                          |
| Skillful                           | Skilful                      | UK spelling                                          |
| Willful                            | Wilful                       | UK spelling                                          |
| Distill                            | Distil                       | UK spelling                                          |
| Instill                            | Instil                       | UK spelling                                          |
| Enrollment                         | Enrolment                    | UK spelling                                          |
| Enrollment                         | Enrolment                    | UK spelling                                          |

---

## 2. Files to Update

All files in `apps/dashboard/public/locales/en/`:
- wizard_provisional_offer.json
- wizard_review_recommendations.json
- wizard_seller_information.json
- wizard_eligibility.json
- wizard_header.json
- wizard_property_information.json
- wizard_address_lookup.json
- wizard_common.json
- wizard_completion_status.json
- wizard_contemplation.json
- my_properties.json
- profile.json
- seller_messages.json
- ui_guidebot.json
- user_menu.json
- auth_signin_signup.json
- auth_warm_welcome.json
- common.json
- family_communication.json

---

## 3. Action Plan

1. **Review all user-facing text** in the above files for US English spelling and phrasing.
2. **Update terms/phrases** as per the table above, prioritising UK English and more neutral UI language.
3. **Check for -ize/-ization words** and replace with -ise/-isation where appropriate.
4. **Check for other Americanisms** (e.g., "color" vs. "colour", "analyze" vs. "analyse").
5. **Document all changes** for review before implementation.

---

## 4. Next Steps
- Await review and approval of this plan.
- Once approved, implement the changes in the listed files.
- Test the UI to ensure all terminology is updated and consistent.
- Document any edge cases or terms that require stakeholder input. 