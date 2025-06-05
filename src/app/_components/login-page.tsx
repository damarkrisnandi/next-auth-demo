import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();

  if (status === 'authenticated') {
    return (
      <div>
        You are already logged in!
      </div>
    );
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEventHandler<any>) => {
    e.preventDefault();
    try {
      await signIn('credentials', { email, password });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Log in</button>
    </form>
  );
}