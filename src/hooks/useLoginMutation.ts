import { IFormValues } from "@/components/templates/Login";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";

export const useLoginMutation = () => {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (data: IFormValues) => {
      const request = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
        // options: {
        //   emailRedirectTo: `${location.origin}/auth/callback`
        // }
      });

      if (request.error) {
        return Promise.reject(request.error);
      }

      return request;
    },
    onSuccess: ({ data, error }) => {
      router.replace("matches");
    },
  });

  return loginMutation;
};
