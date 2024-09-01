"use client";

import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { z } from "zod";
import validator from "validator";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";
import PasswordStrength from "./password-strength";
import { registerUser } from "@/lib/actions/auth";
import { toast } from "react-toastify";

const FormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(45, "First name must be at most 45 characters")
      .regex(/^[a-zA-Z]+$/, "First name must contain only letters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(45, "Last name must be at most 45 characters")
      .regex(/^[a-zA-Z]+$/, "Last name must contain only letters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().refine((val) => {
      return validator.isMobilePhone(val, "zh-CN");
    }, "Invalid phone number"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be at most 50 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be at most 50 characters"),
    accepted: z.literal(true, {
      errorMap: () => ({
        message: "You must agree to the terms of service",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof FormSchema>;

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const [passStrength, setPassStrength] = useState(0);
  const [isVisiblePass, setIsVisiblePass] = useState(false);

  useEffect(() => {
    // console.log({
    //   password: watch().password,
    //   id: passwordStrength(watch().password).id,
    // });
    setPassStrength(passwordStrength(watch().password).id);
  }, [watch().password]);

  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  const saveUser: SubmitHandler<InputType> = async (data) => {
    const { accepted, confirmPassword, ...user } = data;

    try {
      const result = await registerUser(user);
      toast.success("User registered successfully");
    } catch (error) {
      toast.error("Error registering user");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(saveUser)}
      className="grid grid-cols-2 gap-3 p-2 shadow border rounded-md place-self-stretch "
    >
      <Input
        errorMessage={errors.firstName?.message}
        isInvalid={!!errors.firstName}
        {...register("firstName")}
        label="First Name"
        startContent={<UserIcon className="w-4" />}
      />
      <Input
        {...register("lastName")}
        errorMessage={errors.lastName?.message}
        isInvalid={!!errors.lastName}
        label="Last Name"
        startContent={<UserIcon className="w-4" />}
      />
      <Input
        {...register("email")}
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
        label="Email"
        className="col-span-2"
        startContent={<EnvelopeIcon className="w-4" />}
      />
      <Input
        {...register("phone")}
        errorMessage={errors.phone?.message}
        isInvalid={!!errors.phone}
        label="Phone"
        className="col-span-2"
        startContent={<PhoneIcon className="w-4" />}
      />
      <Input
        {...register("password")}
        errorMessage={errors.password?.message}
        isInvalid={!!errors.password}
        label="Password"
        type={isVisiblePass ? "text" : "password"}
        className="col-span-2"
        startContent={<KeyIcon className="w-4" />}
        endContent={
          isVisiblePass ? (
            <EyeIcon
              className="w-4 cursor-pointer"
              onClick={toggleVisiblePass}
            />
          ) : (
            <EyeSlashIcon
              className="w-4 cursor-pointer"
              onClick={toggleVisiblePass}
            />
          )
        }
      />
      <PasswordStrength passStrength={passStrength} />
      <Input
        {...register("confirmPassword")}
        errorMessage={errors.confirmPassword?.message}
        isInvalid={!!errors.confirmPassword}
        label="Confirm Password"
        type={isVisiblePass ? "text" : "password"}
        className="col-span-2"
        startContent={<KeyIcon className="w-4" />}
      />
      <Controller
        control={control}
        name="accepted"
        render={({ field }) => (
          <Checkbox
            onChange={field.onChange}
            onBlur={field.onBlur}
            className="col-span-2"
          >
            I agree to the <Link href="/terms">Terms of Service</Link>
          </Checkbox>
        )}
      />
      {!!errors.accepted && (
        <p className="text-red-500">{errors.accepted.message}</p>
      )}

      <div className="flex justify-center col-span-2">
        <Button className="w-48" color="primary" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
