"use client";
import { forgotPassword } from "@/lib/actions/auth";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type InputType = z.infer<typeof FormSchema>;

const ForgotPaswordPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<InputType> = async (data: InputType) => {
    try {
      const result = await forgotPassword(data.email);
      if (result) {
        toast.success("Password reset link sent to your email");
      }

      reset();
    } catch (error) {
      console.log(error);
      toast.error("Failed to send password reset link");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 items-start">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 p-2 border rounded-md shadow"
      >
        <div className="text-center p-2">Enter your email</div>
        <Input
          label="Email"
          {...register("email")}
          startContent={<EnvelopeIcon className="w-4" />}
          errorMessage={errors.email?.message}
          isInvalid={!!errors.email}
        />
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          color="primary"
        >
          {isSubmitting ? "Please wait..." : "Submit"}
        </Button>
      </form>

      <Image
        src="/forgotPass.png"
        alt=""
        width={500}
        height={500}
        className="col-span-2 place-self-center"
      />
    </div>
  );
};

export default ForgotPaswordPage;
