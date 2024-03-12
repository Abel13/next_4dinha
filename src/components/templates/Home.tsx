"use client";

import { useCallback, useEffect, useState } from "react";
import Login from "./Login";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw error;
    }

    if (data) {
      router.replace("/matches");
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <Login />;
}
