import { getServerSession } from "next-auth"
import { authOptions } from '../app/api/auth/[...nextauth]/route'
import { hash } from 'bcryptjs'
import { authOptions } from "../app/api/auth/[...nextauth]/route"

export async function getCurrentUser() {
    const session = await getServerSession(authOptions)
    return session?.user
}

export async function requireAuth() {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }
    return user
}

export async function hashPassword(password:string) {
    return await hash(password, 10)
}

export { compare as verifyPassword} from 'bcryptjs'