"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import PasswordStrength from "./password-strength";
import { passwordStrength } from "check-password-strength";
import { toast } from "react-toastify";
import { resetPassword } from "@/lib/actions/auth";

interface Props {
  jwtUserId: string;
}

const FormSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(52, "Password must be at most 52 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof FormSchema>;

const ResetPasswordForm: React.FC<Props> = ({ jwtUserId }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const [visiblePass, setIsVisiblePass] = useState(false);
  const [passStrength, setPassStrength] = useState(0);

  useEffect(() => {
    // console.log({
    //   password: watch().password,
    //   id: passwordStrength(watch().password).id,
    // });
    setPassStrength(passwordStrength(watch().password).id);
  }, [watch().password]);

  const onSubmitHandle: SubmitHandler<InputType> = async (data: InputType) => {
    console.log({ data });
    try {
      const result = await resetPassword(jwtUserId, data.password);
      if (result === "success") {
        toast.success("Password reset successfully");
      } else {
        toast.error("An error occurred");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandle)}
      className="flex flex-col gap-2 p-2 m-2 border rounded-md shadow"
    >
      <div className="text-center p-2">Reset your password</div>
      <Input
        label="Password"
        type={visiblePass ? "text" : "password"}
        {...register("password")}
        errorMessage={errors.password?.message}
        isInvalid={!!errors.password}
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
      <PasswordStrength passStrength={passStrength} />
      <Input
        label="Confirm Password"
        type={visiblePass ? "text" : "password"}
        {...register("confirmPassword")}
        errorMessage={errors.confirmPassword?.message}
        isInvalid={!!errors.confirmPassword}
      />
      <div className="flex justify-center items-center">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          color="primary"
        >
          {isSubmitting ? "Please wait..." : "Reset Password"}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
