import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'E-posta adresi gereklidir' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Geçerli bir e-posta adresi girin' },
        { status: 400 }
      )
    }

    // Check if user exists (mock)
    const userExists = true // In real app, check database
    
    if (!userExists) {
      return NextResponse.json(
        { success: false, message: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Update verification code in database (mock)
    console.log(`New verification code for ${email}: ${verificationCode}`)
    
    // In real app, update database and send email
    // await updateVerificationCode(email, verificationCode)
    // await sendVerificationEmail(email, verificationCode)

    return NextResponse.json({
      success: true,
      message: 'Yeni doğrulama kodu e-posta adresinize gönderildi'
    })

  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
