import LoginForm from "../components/login-form";

type LoginPageProps = {
  mode: "admin" | "user";
};

export default function LoginPage({ mode }: LoginPageProps) {
  return <LoginForm mode={mode} />;
}
