import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    // Validate required fields
    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: 'E-posta ve doğrulama kodu gereklidir' },
        { status: 400 }
      )
    }

    // Validate code format
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, message: 'Doğrulama kodu 6 haneli olmalıdır' },
        { status: 400 }
      )
    }

    // In real app, check database for user and verification code
    // For now, we'll use a mock verification
    const mockVerificationCode = '123456' // In real app, get from database
    
    if (code !== mockVerificationCode) {
      return NextResponse.json(
        { success: false, message: 'Doğrulama kodu hatalı' },
        { status: 400 }
      )
    }

    // Update user verification status (mock)
    console.log(`Email verified for: ${email}`)
    
    // In real app, update database
    // await updateUserVerification(email, true)

    return NextResponse.json({
      success: true,
      message: 'E-posta başarıyla doğrulandı'
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
