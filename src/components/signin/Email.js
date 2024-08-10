import React from 'react';
import { SplashButton } from '../buttons/SplashButton';

export const Email = ({password, setPassword, email, setEmail, onSubmit}) => {
    return (
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="email-input" className="mb-1.5 text-zinc-400">
            Email
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@provider.com"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
          />
        </div>
        <div className="mb-6">
          <div className="mb-1.5 flex items-end justify-between">
            <label htmlFor="password-input" className="block text-zinc-400">
              Password
            </label>
          </div>
          <input
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
          />
        </div>
        <SplashButton type="submit" className="w-full">
          Sign in
        </SplashButton>
      </form>
    );
  };
  