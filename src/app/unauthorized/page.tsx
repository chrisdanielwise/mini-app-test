// src/app/unauthorized/page.tsx
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold text-red-600">403 - Access Denied</h1>
      <p className="text-muted-foreground">You do not have permission to access the Staff Terminal.</p>
      <Link href="/home" className="px-4 py-2 bg-blue-600 text-white rounded-md">
        Return to Home
      </Link>
    </div>
  );
}