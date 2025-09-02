import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password, userType } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password || !userType) {
      return NextResponse.json(
        { success: false, message: 'Tüm alanlar gereklidir' },
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

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Şifre en az 8 karakter olmalıdır' },
        { status: 400 }
      )
    }

    // Check if user already exists (mock)
    const existingUser = false // In real app, check database
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 409 }
      )
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Save user to database (mock)
    const user = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone,
      userType,
      isVerified: false,
      verificationCode,
      createdAt: new Date().toISOString()
    }

    // Send verification email
    try {
      await resend.emails.send({
        from: 'Emlakos Türkiye <noreply@emlakos.com>',
        to: [email],
        subject: 'Emlakos Türkiye - Email Doğrulama',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Emlakos Türkiye</h2>
            <p>Merhaba ${firstName},</p>
            <p>Hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #2563eb; font-size: 32px; margin: 0;">${verificationCode}</h1>
            </div>
            <p>Bu kod 10 dakika geçerlidir.</p>
            <p>Eğer bu işlemi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Emlakos Türkiye - Türkiye'nin en güvenilir emlak platformu
            </p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Fallback to console log for development
      console.log(`Verification code for ${email}: ${verificationCode}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Kayıt başarılı. E-posta adresinize gönderilen doğrulama kodunu girin.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
