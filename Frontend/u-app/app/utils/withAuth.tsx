import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateToken,refreshAccessToken } from "../services/auth/auth";

export function withAuth<T extends object>(Component: React.FC<T>) {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {


        const isValid = await validateToken();
        if (!isValid ) {
          try {
            await refreshAccessToken();
          } catch (error) {
            console.error("No se pudo renovar el token", error);
            router.push("/");
          }
        } else if (!isValid) {
          router.push("/");
        }
      };

      checkAuth();
    }, [router]);

    return <Component {...props} />;
  };
}
