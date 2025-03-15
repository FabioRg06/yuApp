// components/ProtectedRoute.tsx
import { useAuth } from '@/app/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // o react-router-dom

interface Props {
  children: React.ReactNode;
  roles?: string[]; // Roles permitidos (por defecto todos)
}

export const ProtectedRoute = ({ children, roles = [] }: Props) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login'); // No autenticado
      } else if (roles.length > 0 && !roles.includes(user!.role.name)) {
        router.push('/unauthorized'); // Autenticado pero sin rol permitido
      }
    }
  }, [loading, isAuthenticated, user, roles, router]);

  if (loading || !isAuthenticated) return <p>Cargando...</p>;

  return <>{children}</>;
};
