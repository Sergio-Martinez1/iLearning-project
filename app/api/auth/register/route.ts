import { NextResponse, type NextRequest } from 'next/server'
import { connectDB } from '../../../../db/db_config'
import { getServerSession } from 'next-auth/next'
import User from '../../../../db/models/user.models'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    const data = await request.json()
    const email = data.email;

    try {
        await connectDB()
        const userFound = await User.findOne({ email })
        if (userFound) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 })
        }
        const passwordHash = await bcrypt.hash(data.password, 10)
        const newUser = new User({ username: data.username, email: data.email, password: passwordHash, role: "user", status: false })
        await newUser.save()
        return Response.json({ message: 'User created succesfully' })
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: 'Error creating user' }), { status: 500 });
    }

}