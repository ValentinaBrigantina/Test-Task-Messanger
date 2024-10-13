import { HTTPException } from 'hono/http-exception'
import { decode, sign, verify } from 'hono/jwt'
import * as bcrypt from 'bcryptjs'
import { db } from '../db'
import { users as usersTable } from '../db/schema/users'
import { eq } from 'drizzle-orm'
import type { AuthSchema, JwtToken, PayloadUserData } from '../sharedTypes'
import { Role } from '../helpers/getUser'

const secretJwtKey = process.env.JWT_KEY || 'secret'

export const checkValidToken = async (token: string) => {
  try {
    return await verify(token, secretJwtKey)
  } catch (error) {
    throw new HTTPException(401)
  }
}

export const getDataFromToken = async (token: string) => {
  const { header, payload } = decode(token)
  return payload
}

const createJwtToken = async (payload: PayloadUserData) => {
  const options = {
    expiresIn: '365d',
  }
  return await sign({ ...payload, ...options }, secretJwtKey)
}

export const getUserByName = async (name: string) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.name, name))
  return user
}

export const createHash = (string: string) => bcrypt.hash(string, 6)

export const compareHash = (hash: string, string: string) =>
  bcrypt.compare(hash, string)

export const registration = async (authData: AuthSchema) => {
  const isExist = !!(await getUserByName(authData.name))
  if (isExist) {
    throw new HTTPException(409, { message: 'user already exist' })
  }
  const hashPassword = await createHash(authData.password)
  const [{password, ...user}] = await db
    .insert(usersTable)
    .values({ ...authData, role: Role.User, password: hashPassword })
    .returning()

  return user
}

export const login = async (authData: AuthSchema): Promise<JwtToken> => {
  const user = await getUserByName(authData.name)
  const isCorrectPassword = user
    ? await compareHash(authData.password, user.password)
    : false
  if (!isCorrectPassword || !user) {
    throw new HTTPException(401)
  }
  const token = await createJwtToken({ id: user.id, name: user.name })
  return { token: `Bearer ${token}` }
}
