"use client";
import { Button } from "../atoms/Button";

export default function CreateMatch() {
  const handleCreate = async () => {
    await fetch("matches/create", {
      method: "POST",
    });
  };

  return (
    <div className="flex flex-col">
      <span className="border-b-2  mb-2 font-semibold font-sans">Partidas</span>
      <Button onClick={handleCreate} className="self-end mb-2">
        Criar Partida
      </Button>
    </div>
  );
}
