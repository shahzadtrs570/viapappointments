import { createTRPCRouter } from "../../trpc"
import { myPropertiesRouter } from "./myProperties/myProperties.router"
import { applicationReviewRouter } from "./sub-routers/applicationReview/applicationReview.router"
import { detailsRouter } from "./sub-routers/details/details.router"
import { eligibilityRouter } from "./sub-routers/eligibility/eligibility.router"
import { finalStatusRouter } from "./sub-routers/finalStatus/finalStatus.router"
import { propertyValidationRouter } from "./sub-routers/propertyValidation/propertyValidation.router"
import { provisionalOfferRouter } from "./sub-routers/provisionalOffer/provisionalOffer.router"
import { sellerInformationRouter } from "./sub-routers/sellerInformation/sellerInformation.router"

export const propertyRouter = createTRPCRouter({
  sellerInformation: sellerInformationRouter,
  details: detailsRouter,
  applicationReview: applicationReviewRouter,
  provisionalOffer: provisionalOfferRouter,
  finalStatus: finalStatusRouter,
  eligibility: eligibilityRouter,
  myProperties: myPropertiesRouter,
  validation: propertyValidationRouter,
})
