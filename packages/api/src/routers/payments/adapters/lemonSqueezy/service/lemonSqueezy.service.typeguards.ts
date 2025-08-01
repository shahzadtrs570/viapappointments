import type { lemonSqueezy } from "@package/payments"

export type MetaType = {
  meta: {
    event_name: string
    custom_data: {
      user_id: string
    }
  }
}

/**
 * Check if the value is an object.
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/**
 * Typeguard to check if the object has a 'meta' property
 * and that the 'meta' property has the correct shape.
 */
export function webhookHasMeta(obj: unknown): obj is {
  meta: {
    event_name: string
    custom_data: {
      user_id: string
    }
  }
} {
  if (
    isObject(obj) &&
    isObject(obj.meta) &&
    typeof obj.meta.event_name === "string" &&
    isObject(obj.meta.custom_data) &&
    typeof obj.meta.custom_data.user_id === "string"
  ) {
    return true
  }
  return false
}

/**
 * Typeguard to check if the object has a 'data' property and the correct shape.
 *
 * @param obj - The object to check.
 * @returns True if the object has a 'data' property.
 */
export function webhookHasData(obj: unknown): obj is {
  data: lemonSqueezy.Subscription["data"]
} {
  return (
    isObject(obj) &&
    "data" in obj &&
    isObject(obj.data) &&
    "attributes" in obj.data
  )
}
