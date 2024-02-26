"use client";

import { useCallback, useEffect, useState } from "react";
import Login from "./Login";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }

      if (data) {
        router.replace("/matches");
      }
    } catch (error) {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return <Login />;
}
