"use client";
import { useForm } from "react-hook-form";
import { Button } from "../atoms/Button";
import TextField from "../atoms/Fields";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoginMutation } from "@/hooks/useLoginMutation";

export interface IFormValues {
  email: string;
  password: string;
}
export default function Login() {
  const { isLoading: isLoggingIn, mutate: loginMutate } = useLoginMutation();

  const schema = yup.object({
    email: yup
      .string()
      .email("E-mail inválido!")
      .required("Informe seu e-mail de login!"),
    password: yup.string().required("Informe sua senha!"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const handleSignIn = async (form: IFormValues) => {
    if (isLoggingIn) {
      return;
    }
    loginMutate(form);
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full"
      onSubmit={handleSubmit(handleSignIn)}
    >
      <h1 className="text-4xl font-bold w-full">Login</h1>
      <form className="flex flex-col items-center justify-center w-full h-full">
        <TextField
          className="w-full"
          label="Email"
          id="email"
          type="email"
          placeholder="Ex.: meuemail@dominio.com"
          {...register("email")}
          error={errors.email?.message as string}
        />
        <TextField
          className="w-full"
          label="Senha"
          id="password"
          type="password"
          placeholder="Ex.: 1aB2d3"
          {...register("password")}
          error={errors.password?.message as string}
        />
        <Button
          type="submit"
          className="w-full h-12 p-4 my-4 text-lg bg-blue-500 text-white rounded-lg"
          disabled={isLoggingIn}
        >
          Entrar
        </Button>
      </form>
    </div>
  );
}
