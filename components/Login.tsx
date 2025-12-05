import React, { useEffect } from 'react';
import { LABELS } from '../constants';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

// Declare Google Identity Services types roughly
declare global {
  interface Window {
    google: any;
  }
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  
  const handleAuthClick = () => {
    // This value is injected by Vite at build time from GitHub Secrets
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    if (!CLIENT_ID) {
      alert("配置错误：Google Client ID 未找到。请检查 GitHub Secrets (VITE_GOOGLE_CLIENT_ID)。");
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      callback: (tokenResponse: any) => {
        if (tokenResponse && tokenResponse.access_token) {
          onLoginSuccess(tokenResponse.access_token);
        }
      },
    });

    client.requestAccessToken();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 p-4">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8">
        {LABELS.appName}
      </h1>
      <button
        onClick={handleAuthClick}
        className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-all active:scale-95"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        {LABELS.login}
      </button>
      <p className="mt-4 text-slate-500 text-sm">
        需要 Google 账号以同步数据至 Sheets
      </p>
    </div>
  );
};

export default Login;