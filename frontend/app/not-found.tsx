import Link from "next/link";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-lg rounded-lg border border-line bg-white p-8 text-center shadow-soft">
      <h1 className="text-2xl font-extrabold text-ink">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-muted">The page you are looking for does not exist.</p>
      <Link className="mt-6 inline-block" href="/">
        <Button>Back to board</Button>
      </Link>
    </section>
  );
}
