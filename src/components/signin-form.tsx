"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Link } from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string({
    required_error: "Password is required",
  }),
});

type InputType = z.infer<typeof FormSchema>;

interface Props {
  callbackUrl?: string;
}

const SigninForm: React.FC<Props> = ({ callbackUrl }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const [visiblePass, setIsVisiblePass] = useState(false);

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    console.log({ data });
    const result = await signIn("credentials", {
      redirect: false,
      username: data.email,
      password: data.password,
    });

    console.log({ result });
    if (!result?.ok || result.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Signed in successfully");
    router.push(callbackUrl || "/");
  };

  return (
    <form
      className="flex flex-col gap-2 border rounded-md shadow overflow-hidden w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="bg-gradient-to-b from-white to bg-slate-200 dark:from-slate-700 dark:to-slate-900 p-2 text-center">
        Sign IN Form
      </div>
      <div className="p-2 flex flex-col gap-2">
        <Input
          label="Email"
          {...register("email")}
          errorMessage={errors.email?.message}
          isInvalid={!!errors.email}
        />
        <Input
          type={visiblePass ? "text" : "password"}
          {...register("password")}
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
          label="Password"
          endContent={
            <button
              type="button"
              onClick={(e) => {
                // e.preventDefault();
                setIsVisiblePass((prev) => !prev);
              }}
            >
              {visiblePass ? (
                <EyeSlashIcon className="w-4" />
              ) : (
                <EyeIcon className="w-4" />
              )}
            </button>
          }
        />
        <div className="flex items-center justify-center gap-2">
          <Button
            color="primary"
            disabled={isSubmitting}
            type="submit"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          <Button as={Link} href="/auth/singup">
            Sign up
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SigninForm;
