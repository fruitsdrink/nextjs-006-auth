import ResetPasswordForm from "@/components/reset-password-form";
import { verifyJwt } from "@/lib/jwt";
import React from "react";

interface Props {
  params: {
    jwt: string;
  };
}
const ResetPassPage: React.FC<Props> = ({ params }) => {
  const payload = verifyJwt(params.jwt);
  if (!payload) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-2xl">
        The url is not valid!
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <ResetPasswordForm jwtUserId={params.jwt} />
    </div>
  );
};

export default ResetPassPage;
