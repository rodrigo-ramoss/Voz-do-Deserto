import { redirect } from "next/navigation";

// Redireciona permanentemente de /biblioteca para /livraria
export default function BibliotecaPage() {
  redirect("/livraria");
}
