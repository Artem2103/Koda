import Header from "@/components/Header";
import { AuthLayout } from "./login";

export default function GetStartedPage() {
  return (
    <>
      <Header />
      <AuthLayout eyebrow="Get started" heading="Start your free trial" mode="signup" />
    </>
  );
}