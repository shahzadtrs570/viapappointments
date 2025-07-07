/*eslint-disable*/

// Export all validation types and schemas
export {
  getPropertySchema,
  type PropertyInfoData,
  type PreviousStepAddress,
  type PropertyInformationProps,
  type StoredTempFile,
  type RightmoveResponse,
  type PropertyInfoTFunction,
  type BathroomCountInput,
  type BedroomCountInput,
  type PropertyConditionInput,
  type PropertyDetailsForm,
  type PropertyDocument,
  type PropertyFeatureInput,
  type PropertyStatusInput,
  type PropertyTypeInput,
} from "./FormValidation"

// Export all helper functions
export {
  convertSqMeterToSqFeet,
  convertSqFeetToSqMeter,
  formatApiDataForRedux,
  updateManualAddressData,
  mapRightmovePropertyType,
  mapRightmoveTenure,
  mapRightmoveCondition,
  getSuggestedQuestions,
  isImageFile,
  isPdfFile,
} from "./FormHelpers"

// Export all document helpers
export {
  getFileExtension,
  openFileInNewWindow,
  fileToBase64,
  TEMP_FILES_STORAGE_KEY,
  loadTempFilesFromStorage,
  saveTempFilesToStorage,
  clearTempFilesStorage,
  formatFileName,
  isDuplicateDocument,
} from "./DocumentHelpers"

// Export all components
export { AddressSearchSection } from "./AddressSearchSection"
export { PropertyLocationSection } from "./PropertyLocationSection"
export { PropertyTypeSection } from "./PropertyTypeSection"
export { PropertyStatusSection } from "./PropertyStatusSection"
export { PropertyDetailsSection } from "./PropertyDetailsSection"
export { PropertyConditionSection } from "./PropertyConditionSection"
export { DocumentUploadSection } from "./DocumentUploadSection"
export { NavigationButtons } from "./NavigationButtons"
export { ChatBotSection } from "./ChatBotSection"
export { SidebarCards } from "./SidebarCards"
