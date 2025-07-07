export const ddqaSurveyJson = {
  title: "",
  logoPosition: "right",
  pages: [
    {
      name: "institutionalInfo",
      title: "Section 1: Institutional Information",
      elements: [
        {
          type: "text",
          name: "institutionName",
          title: "Name of Institution:",
          isRequired: true,
          maxLength: 100,
        },
        {
          type: "text",
          name: "registeredAddress",
          title: "Registered Office Address:",
          isRequired: true,
        },
        {
          type: "text",
          name: "leiNumber",
          title: "Legal Entity Identifier (LEI) Number:",
          maxLength: 20,
        },
        {
          type: "text",
          name: "registrationNumber",
          title: "Registration Number (e.g., Company Number):",
          isRequired: true,
        },
        {
          type: "dropdown",
          name: "countryOfIncorporation",
          title: "Country of Incorporation:",
          isRequired: true,
          choices: [
            "United Kingdom",
            "United States",
            "France",
            "Germany",
            "Netherlands",
            "Switzerland",
            "Singapore",
            "Other",
          ],
        },
        {
          type: "dropdown",
          name: "institutionType",
          title: "Type of Institution:",
          isRequired: true,
          hasOther: true,
          choices: [
            "Pension Fund",
            "Insurance Company",
            "Family Office",
            "Asset Manager",
            "Sovereign Wealth Fund",
            "Endowment",
            "Bank",
          ],
        },
      ],
    },
    {
      name: "contactInfo",
      title: "Section 2: Contact Information",
      elements: [
        {
          type: "text",
          name: "primaryContactName",
          title: "Primary Contact Name:",
          isRequired: true,
        },
        {
          type: "text",
          name: "jobTitle",
          title: "Job Title:",
          isRequired: true,
        },
        {
          type: "text",
          name: "emailAddress",
          title: "Email Address:",
          isRequired: true,
          validators: [
            {
              type: "email",
            },
          ],
        },
        {
          type: "text",
          name: "phoneNumber",
          title: "Phone Number:",
          isRequired: true,
        },
        {
          type: "text",
          name: "secondaryContact",
          title: "Secondary Contact (Compliance Officer):",
        },
      ],
    },
    {
      name: "regulatoryInfo",
      title: "Section 3: Regulatory and Compliance Information",
      elements: [
        {
          type: "text",
          name: "regulatoryStatus",
          title:
            "Regulatory Status (please specify regulator and jurisdiction):",
          isRequired: true,
        },
        {
          type: "comment",
          name: "regulatoryLicenses",
          title: "Details of relevant regulatory licenses or authorisations:",
        },
        {
          type: "boolean",
          name: "regulatoryAction",
          title:
            "Has the institution or any of its directors/officers ever been subject to regulatory action, penalties, or investigations?",
          isRequired: true,
        },
        {
          type: "comment",
          name: "regulatoryActionDetails",
          title: "If yes, please provide details:",
          visibleIf: "{regulatoryAction} = true",
        },
        {
          type: "comment",
          name: "complianceProcedures",
          title:
            "Provide details of your internal compliance and anti-money laundering (AML) procedures:",
          isRequired: true,
        },
      ],
    },
    {
      name: "ownershipInfo",
      title: "Section 4: Ownership and Governance",
      elements: [
        {
          type: "comment",
          name: "majorShareholders",
          title:
            "Provide a list of major shareholders (10% or more ownership):",
          isRequired: true,
        },
        {
          type: "comment",
          name: "ultimateBeneficialOwners",
          title: "Identify Ultimate Beneficial Owners (UBOs):",
          isRequired: true,
        },
        {
          type: "comment",
          name: "keyManagement",
          title:
            "Provide the names and titles of key senior management and board members:",
          isRequired: true,
        },
      ],
    },
    {
      name: "financialInfo",
      title: "Section 5: Financial Information",
      elements: [
        {
          type: "text",
          name: "aum",
          title: "Provide a summary of total assets under management (AUM):",
          isRequired: true,
        },
        {
          type: "file",
          name: "financialStatements",
          title: "Latest audited financial statements (please attach):",
          isRequired: true,
          maxSize: 10485760,
        },
        {
          type: "text",
          name: "creditRating",
          title:
            "Credit rating or other financial stability indicators (if applicable):",
        },
      ],
    },
    {
      name: "investmentInfo",
      title: "Section 6: Investment Objectives and Strategy",
      elements: [
        {
          type: "checkbox",
          name: "investmentObjectives",
          title: "Describe your primary investment objectives:",
          isRequired: true,
          hasOther: true,
          choices: [
            "Income Generation",
            "Capital Preservation",
            "Growth",
            "Inflation Protection",
            "Portfolio Diversification",
          ],
        },
        {
          type: "radiogroup",
          name: "investmentHorizon",
          title: "What is your typical investment horizon?",
          isRequired: true,
          choices: [
            "Short-term (< 3 years)",
            "Medium-term (3-7 years)",
            "Long-term (7-15 years)",
            "Very long-term (15+ years)",
          ],
        },
        {
          type: "comment",
          name: "assetAllocation",
          title: "Specify your target asset allocation preferences:",
          isRequired: true,
        },
        {
          type: "comment",
          name: "investmentRestrictions",
          title:
            "Describe any investment restrictions or limitations applicable to your organisation:",
          isRequired: true,
        },
      ],
    },
    {
      name: "realEstateExperience",
      title: "Section 7: Real Estate Experience",
      elements: [
        {
          type: "boolean",
          name: "priorRealEstateInvestment",
          title:
            "Has your institution previously invested in real estate transactions?",
          isRequired: true,
        },
        {
          type: "comment",
          name: "realEstateDetails",
          title: "If yes, provide details:",
          visibleIf: "{priorRealEstateInvestment} = true",
        },
        {
          type: "comment",
          name: "riskAssessment",
          title:
            "Describe your understanding and risk assessment of property investments:",
          isRequired: true,
        },
        {
          type: "comment",
          name: "approvalProcess",
          title:
            "Outline your internal process for approving new types of investments:",
          isRequired: true,
        },
      ],
    },
    {
      name: "operationalInfo",
      title: "Section 8: Operational Information",
      elements: [
        {
          type: "comment",
          name: "decisionMakingProcess",
          title:
            "Outline your decision-making and investment approval process (including key committees or individuals involved):",
          isRequired: true,
        },
        {
          type: "comment",
          name: "dueDiligenceApproach",
          title:
            "Describe your approach to due diligence for real estate investments:",
          isRequired: true,
        },
        {
          type: "comment",
          name: "thirdPartyAdvisers",
          title:
            "Specify any third-party advisers or consultants used (legal, actuarial, financial):",
        },
      ],
    },
    {
      name: "legalInfo",
      title: "Section 9: Legal and Reputational Information",
      elements: [
        {
          type: "boolean",
          name: "currentLitigation",
          title:
            "Is your institution involved in any current litigation or dispute that could materially affect your financial position or reputation?",
          isRequired: true,
        },
        {
          type: "comment",
          name: "litigationDetails",
          title: "If yes, please provide details:",
          visibleIf: "{currentLitigation} = true",
        },
        {
          type: "comment",
          name: "historicalLitigation",
          title:
            "Provide details of any historical litigation or regulatory issues in the past five years:",
          isRequired: true,
        },
      ],
    },
    {
      name: "documentation",
      title: "Section 10: Documentation Checklist",
      elements: [
        {
          type: "checkbox",
          name: "documentationProvided",
          title:
            "Please confirm which of the following documents you are attaching:",
          isRequired: true,
          choices: [
            "Certificate of Incorporation",
            "Articles of Association or equivalent",
            "Proof of Regulatory Licences",
            "Audited Financial Statements (latest fiscal year)",
            "AML/Compliance Policy Documents",
            "Proof of Authorised Signatories",
          ],
        },
        {
          type: "file",
          name: "documentationFiles",
          title: "Upload relevant documentation:",
          maxSize: 10485760,
          allowMultiple: true,
        },
      ],
    },
    {
      name: "declaration",
      title: "Declaration",
      elements: [
        {
          type: "text",
          name: "signatureName",
          title: "Name:",
          isRequired: true,
        },
        {
          type: "text",
          name: "signatureTitle",
          title: "Title:",
          isRequired: true,
        },
        {
          type: "boolean",
          name: "declarationConfirmation",
          title:
            "I confirm that the information provided in this Due Diligence Questionnaire is accurate and complete to the best of my knowledge.",
          isRequired: true,
        },
      ],
    },
  ],
  showQuestionNumbers: "off",
  completeText: "Submit",
  pageNextText: "Continue",
  pagePrevText: "Previous",
  showPrevButton: true,
  showCompletedPage: false,
}
