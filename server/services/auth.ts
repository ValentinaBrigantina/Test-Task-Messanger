import { HTTPException } from 'hono/http-exception'
import { decode, sign, verify } from 'hono/jwt'
import type { JWTPayload } from 'hono/utils/jwt/types'
import * as bcrypt from 'bcryptjs'

import { db } from '../db'
import { users as usersTable, type UserSchemaInsert } from '../db/schema/users'
import type {
  AuthSchema,
  JwtToken,
  PayloadUserData,
  UserProfile,
} from '../sharedTypes'
import { getUserByName } from './user'

const secretJwtKey = process.env.JWT_KEY || 'secret'

export const checkValidToken = async (token: string): Promise<JWTPayload> => {
  try {
    return await verify(token, secretJwtKey)
  } catch (error) {
    throw new HTTPException(401)
  }
}

export const getDataFromToken = (token: string): JWTPayload => {
  const { payload } = decode(token)
  return payload
}

const createJwtToken = async (payload: PayloadUserData) => {
  const options = {
    expiresIn: '365d',
  }
  return await sign({ ...payload, ...options }, secretJwtKey)
}

export const createHash = (string: string) => bcrypt.hash(string, 6)

export const compareHash = (hash: string, string: string) =>
  bcrypt.compare(hash, string)

export const registration = async (
  authData: UserSchemaInsert
): Promise<UserProfile> => {
  const isExist = !!(await getUserByName(authData.name))
  if (isExist) {
    throw new HTTPException(409, { message: 'user already exist' })
  }
  const hashPassword = await createHash(authData.password)
  const [{ password, ...user }] = await db
    .insert(usersTable)
    .values({ ...authData, password: hashPassword })
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
  const token = await createJwtToken({
    id: user.id,
    role: user.role,
  })
  return { token: `Bearer ${token}` }
}
