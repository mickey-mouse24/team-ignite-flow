import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'
import { Eye, EyeOff, ArrowRight, User, Lock, Clock, Users } from 'lucide-react'

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: 'admin@collabflow.com',
    password: 'admin123',
    firstName: '',
    lastName: '',
    department: ''
  })

  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password)
        if (success) {
          toast.success('Connexion réussie !')
          navigate('/')
        }
      } else {
        const success = await register({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          department: formData.department
        })
        if (success) {
          toast.success('Compte créé avec succès !')
          setIsLogin(true)
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (role: 'admin' | 'user') => {
    setIsLoading(true)
    try {
      const demoCredentials = {
        admin: { email: 'admin@collabflow.com', password: 'admin123' },
        user: { email: 'user@collabflow.com', password: 'user123' }
      }
      
      const { email, password } = demoCredentials[role]
      const success = await login(email, password)
      
      if (success) {
        toast.success(`Connexion en tant que ${role === 'admin' ? 'Administrateur' : 'Utilisateur'} !`)
        console.log('🔄 Redirection vers /')
        navigate('/')
      }
    } catch (error) {
      toast.error('Erreur lors de la connexion de démonstration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* App Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <ArrowRight className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            CollabFlow
          </h1>
          <p className="text-gray-600 text-sm">
            Système de gestion collaborative d'équipes
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username/Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isLogin ? 'Adresse email' : 'Adresse email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Entrez votre adresse email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Entrez votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Registration Fields */}
            {!isLogin && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Prénom"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nom"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Département
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Département"
                    required
                  />
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-5 h-5" />
              <span>{isLoading ? 'Connexion...' : (isLogin ? 'Se connecter' : 'Créer un compte')}</span>
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Comptes de démonstration :
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50"
              >
                <Users className="w-4 h-4" />
                <span>Administrateur</span>
              </button>
              <button
                onClick={() => handleDemoLogin('user')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50"
              >
                <User className="w-4 h-4" />
                <span>Utilisateur</span>
              </button>
            </div>
          </div>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © 2025 CollabFlow - Système de gestion collaborative moderne
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login