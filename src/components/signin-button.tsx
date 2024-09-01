"use client";

import { Button, Link } from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";

const SigninButton = () => {
  const { data: session } = useSession();
  return (
    <div className="flex items-center gap-2">
      {session && session.user ? (
        <>
          <Link href="/profile">{`${session.user.firstName} ${session.user.lastName}`}</Link>{" "}
          <Link
            className="text-sky-500 hover:text-sky-600 transition-colors"
            href="/api/auth/signout"
          >
            Sign out
          </Link>
        </>
      ) : (
        <>
          <Button onClick={() => signIn()}>Sign in</Button>
          <Button as={Link} href="/auth/signup">
            Sign up
          </Button>
        </>
      )}
    </div>
  );
};

export default SigninButton;
