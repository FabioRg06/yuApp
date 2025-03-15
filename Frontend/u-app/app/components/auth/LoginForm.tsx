import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginForm() {
  const { login,loading } = useAuth();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    login(formData.get("email") as string, formData.get("password") as string);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full bg-wayuu-red text-white" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </Button>
      </div>
    </form>
  );
}
