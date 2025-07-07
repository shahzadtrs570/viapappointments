import { getServerSession } from "next-auth"

import authOptions from "../auth/authOptions"

export const serverSession = () => getServerSession(authOptions)
