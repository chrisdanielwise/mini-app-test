

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500/20" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}