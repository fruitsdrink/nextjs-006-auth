import { activateUser } from "@/lib/actions/auth";
import React from "react";

interface Props {
  params: {
    jwt: string;
  };
}
const ActivationPage: React.FC<Props> = async ({ params }) => {
  const result = await activateUser(params.jwt);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      {result === "userNotExist" ? (
        <p className="text-red-500 text-2xl">The user does not exist</p>
      ) : result === "alreadyActivated" ? (
        <p className="text-red-500 text-2xl">The user is already activated</p>
      ) : result === "success" ? (
        <p className="text-green-500 text-2xl">
          The user is activated successfully
        </p>
      ) : (
        <p className="text-yellow-500 text-2xl">Something went wrong</p>
      )}
    </div>
  );
};

export default ActivationPage;
