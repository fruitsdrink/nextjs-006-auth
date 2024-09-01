import SigninForm from "@/components/signin-form";
import { Link } from "@nextui-org/react";
import React from "react";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}

const SigninPage: React.FC<Props> = ({ searchParams }) => {
  console.log({ searchParams });
  return (
    <div className="flex flex-col items-center justify-center">
      <SigninForm callbackUrl={searchParams.callbackUrl} />
      <Link href="/auth/forgotPassword">Forgot your password?</Link>
    </div>
  );
};

export default SigninPage;
