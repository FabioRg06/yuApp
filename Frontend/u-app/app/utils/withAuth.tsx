import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateToken, refreshAccessToken } from "./auth";

export function withAuth<T extends object>(Component: React.FC<T>) {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        let accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accessToken) {
          router.push("/");
          return;
        }

        const isValid = await validateToken(accessToken);
        if (!isValid && refreshToken) {
          try {
            accessToken = await refreshAccessToken(refreshToken);
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
