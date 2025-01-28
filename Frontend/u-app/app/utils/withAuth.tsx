import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateToken, refreshAccessToken } from "./auth";

export function withAuth(Component: React.FC) {
  return function AuthenticatedComponent(props: any) {
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
