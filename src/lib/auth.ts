import { getServerSession } from "next-auth"
import { authOptions } from '../app/api/auth/[...nextauth]/route'
import { hash } from 'bcryptjs'

export async function getCurrentUser() {
    const session = await getServerSession(authOptions)
    return session?.user
}

export async function requireAuth() {
    const user = await getCurrentUser()

    if (!user) {
        // TEMPORARY: Bypass auth for development without database
        // TODO: Remove this bypass once database is set up
        return {
            id: 'dev-user-id',
            email: 'dev@example.com',
            name: 'Dev User'
        }
    }
    return user
}

export async function hashPassword(password:string) {
    return await hash(password, 10)
}

export { compare as verifyPassword} from 'bcryptjs'