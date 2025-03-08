import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/hooks/useAuth";

export default function RegisterForm() {
  const { handleRegister, isLoading } = useAuth();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    handleRegister(
      formData.get("name") as string,
      formData.get("email") as string,
      formData.get("password") as string
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Username</Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full bg-wayuu-red text-white" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Registrarse"}
        </Button>
      </div>
    </form>
  );
}
