/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import type { ApplicationPreviewProps } from "./FormValidation"
import { Owner } from "@/app/store/property/sellerInformation"

export function ApplicationPreview({
  propertyDetails,
  ownersInformation,
  readOnly,
  onEdit,
  t,
}: ApplicationPreviewProps) {
  return (
    <div className="rounded-lg border border-border bg-muted p-3 sm:p-4 md:p-6">
      <Typography
        className="mb-2 text-base sm:mb-4 sm:text-lg md:text-xl"
        variant="h3"
      >
        {t("applicationPreview.title")}
      </Typography>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        <div>
          <Typography
            className="mb-1 text-sm sm:mb-2 sm:text-base"
            variant="h4"
          >
            {t("applicationPreview.propertyDetails.title")}
          </Typography>
          <dl className="space-y-1 text-xs text-muted-foreground sm:space-y-2 sm:text-sm">
            <div className="flex">
              <dt className="mr-2 font-medium">
                {t("applicationPreview.propertyDetails.type")}
              </dt>
              <dd>{propertyDetails?.propertyType || "Not specified"}</dd>
            </div>
            <div className="flex">
              <dt className="mr-2 font-medium">
                {t("applicationPreview.propertyDetails.bedrooms")}
              </dt>
              <dd>{propertyDetails?.bedroomCount || "Not specified"}</dd>
            </div>
            <div className="flex">
              <dt className="mr-2 font-medium">
                {t("applicationPreview.propertyDetails.bathrooms")}
              </dt>
              <dd>{propertyDetails?.bathroomCount || "Not specified"}</dd>
            </div>
            <div className="flex">
              <dt className="mr-2 font-medium">
                {t("applicationPreview.propertyDetails.size")}
              </dt>
              <dd>
                {propertyDetails?.totalAreaSqM
                  ? `${propertyDetails.totalAreaSqM} sq m`
                  : "Not specified"}
              </dd>
            </div>
            <div className="flex">
              <dt className="mr-2 font-medium">
                {t("applicationPreview.propertyDetails.condition")}
              </dt>
              <dd>{propertyDetails?.condition || "Not specified"}</dd>
            </div>
            <div className="flex">
              <dt className="mr-2 font-medium">
                {t("applicationPreview.propertyDetails.estimatedValue")}
              </dt>
              <dd>
                {propertyDetails?.estimatedValue
                  ? `£${Number(propertyDetails.estimatedValue).toLocaleString()}`
                  : "Not specified"}
              </dd>
            </div>
          </dl>
          <button
            className="mt-2 flex items-center text-xs text-primary hover:text-primary/80 sm:mt-3 sm:text-sm"
            style={{ display: readOnly ? "none" : "flex" }}
            onClick={() => onEdit("property", { mode: "edit" })}
          >
            <svg
              className="mr-1 size-3 sm:size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            {t("applicationPreview.propertyDetails.editButton")}
          </button>
        </div>

        <div>
          <Typography
            className="mb-1 mt-4 text-sm sm:mb-2 sm:text-base md:mt-0"
            variant="h4"
          >
            {t("applicationPreview.ownerInformation.title")}
          </Typography>
          <dl className="space-y-1 text-xs text-muted-foreground sm:space-y-2 sm:text-sm">
            <div className="flex">
              <dt className="mr-2 font-medium">
                {t("applicationPreview.ownerInformation.ownershipType")}
              </dt>
              <dd>{ownersInformation?.ownerType || "Not specified"}</dd>
            </div>
            <div className="flex">
              <dt className="mr-2 font-medium">
                {t("applicationPreview.ownerInformation.numberOfOwners")}
              </dt>
              <dd>{ownersInformation?.numberOfOwners || "Not specified"}</dd>
            </div>
            {ownersInformation?.owners &&
              ownersInformation.owners.length > 0 && (
                <>
                  {/* Primary Owner Card */}
                  <div className="mt-2 rounded-md bg-muted/50 ">
                    <div className="mb-1 font-medium text-primary">
                      {t("applicationPreview.ownerInformation.primaryOwner")}
                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-1 p-2 text-sm">
                      <div className="flex">
                        <dt className=" font-medium">
                          {t("applicationPreview.ownerInformation.name")}
                        </dt>
                        <dd>{`${ownersInformation.owners[0].firstName} ${ownersInformation.owners[0].lastName}`}</dd>
                      </div>
                      <div className="flex">
                        <dt className=" font-medium">
                          {t("applicationPreview.ownerInformation.dob")}
                        </dt>
                        <dd>
                          {new Date(
                            ownersInformation.owners[0].dateOfBirth
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                      {ownersInformation.owners[0].email && (
                        <div className="flex">
                          <dt className=" font-medium">
                            {t("applicationPreview.ownerInformation.email")}
                          </dt>
                          <dd>{ownersInformation.owners[0].email}</dd>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Co-owners Section */}
                  {ownersInformation.owners.length > 1 && (
                    <div className="mt-3">
                      <div className="mb-1 font-medium text-primary">
                        {t("applicationPreview.ownerInformation.coOwner")}
                        {ownersInformation.owners.length > 2 ? "s" : ""}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {ownersInformation.owners
                          .slice(1)
                          .map((owner: Owner, index: number) => (
                            <div
                              key={owner.id || index}
                              className="rounded-md bg-muted/30 p-2 text-sm"
                            >
                              <div className="mb-1">{`${owner.firstName} ${owner.lastName}`}</div>
                              <div className="text-xs text-muted-foreground">
                                {t("applicationPreview.ownerInformation.dob")}:{" "}
                                {new Date(
                                  owner.dateOfBirth
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
          </dl>
          <button
            className="mt-2 flex items-center text-xs text-primary hover:text-primary/80 sm:mt-3 sm:text-sm"
            style={{ display: readOnly ? "none" : "flex" }}
            onClick={() => onEdit("owner", { mode: "edit" })}
          >
            <svg
              className="mr-1 size-3 sm:size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            {t("applicationPreview.ownerInformation.editButton")}
          </button>
        </div>
      </div>
    </div>
  )
}
