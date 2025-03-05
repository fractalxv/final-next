// filepath: src/components/Header.tsx
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}