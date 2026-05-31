import { redirect } from "next/navigation";
import SecretLoginForm from "./SecretLoginForm";

export default function SecretLoginPage() {
  if (!process.env.DEMO_PASSWORD) {
    redirect("/");
  }

  return <SecretLoginForm />;
}
