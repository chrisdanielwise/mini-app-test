"use client";

import { useApi, apiPost } from "@/lib/hooks/use-api";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ApiTestPage() {
  const { auth, hapticFeedback } = useTelegramContext();
  const [isPosting, setIsPosting] = useState(false);

  // 1. Test GET Request (Fetching User Profile)
  const {
    data: profile,
    error,
    isLoading,
    mutate,
  } = useApi<any>("/api/user/profile");

  // 2. Test POST Request (Simulate an Order)
  const handleTestPost = async () => {
    setIsPosting(true);
    hapticFeedback("light");
    try {
      const result = await apiPost("/api/orders/test", {
        testValue: "2026_PROD_READY",
      });
      toast({ title: "Success", description: "POST request successful" });
      console.log("POST Result:", result);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setIsPosting(false);
    }
  };

  // 3. Manual 401 Simulation
  const simulateExpiry = () => {
    localStorage.setItem("auth_token", "invalid_expired_token");
    toast({
      title: "Simulating 401",
      description: "Next request will trigger re-auth flow.",
    });
    mutate(); // Re-triggers the GET request
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <h1 className="text-2xl font-black italic uppercase tracking-tighter">
        API Debugger
      </h1>

      <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase">
            Auth State
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <p>
            Authenticated:{" "}
            <span
              className={
                auth.isAuthenticated ? "text-green-500" : "text-red-500"
              }
            >
              {auth.isAuthenticated ? "YES" : "NO"}
            </span>
          </p>
          <p>
            Token Type:{" "}
            <span className="font-mono">
              {localStorage.getItem("auth_token")
                ? "JWT (Bearer)"
                : "InitData (TMA)"}
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase">
            GET Test (/user/profile)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="animate-pulse text-xs">Fetching...</p>
          ) : null}
          {error ? (
            <p className="text-red-500 text-xs">Error: {error.message}</p>
          ) : null}
          {profile && (
            <pre className="text-[10px] bg-black/10 p-2 rounded-lg overflow-auto max-h-32">
              {JSON.stringify(profile, null, 2)}
            </pre>
          )}
          <Button
            variant="outline"
            className="w-full mt-4 rounded-xl"
            onClick={() => mutate()}
          >
            Refresh Data
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Button
          className="rounded-xl font-bold"
          onClick={handleTestPost}
          disabled={isPosting}
        >
          Test POST
        </Button>
        <Button
          variant="destructive"
          className="rounded-xl font-bold"
          onClick={simulateExpiry}
        >
          Simulate 401
        </Button>
      </div>
    </div>
  );
}
