"use client"

import { useSupabaseConfig } from "./SupabaseProvider"

export default function SupabaseStatus() {
  const { isConfigured, error } = useSupabaseConfig()

  if (isConfigured) return null

  return (
    <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">Demo Mode Active</h3>
            <div className="mt-2 text-sm">
              <p>✅ The app is running with demo data. All features work!</p>
              <p className="mt-2">
                <strong>To enable full database functionality:</strong>
              </p>
              <ol className="mt-2 list-decimal list-inside space-y-1 text-xs">
                <li>Create a Supabase project</li>
                <li>Add credentials to .env.local</li>
                <li>Run the database setup scripts</li>
              </ol>
              <p className="mt-2 text-xs font-medium text-blue-800">
                🎯 Demo credentials work instantly - no setup required!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
