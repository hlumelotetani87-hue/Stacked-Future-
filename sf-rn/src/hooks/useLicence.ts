import { useEffect } from "react";
import { useTradingStore } from "@/store/trading-store";
import { useAuth } from "@clerk/expo";

export function useLicence() {
  const { isSignedIn } = useAuth();
  const { checkLicence, tier } = useTradingStore();

  useEffect(() => {
    if (isSignedIn) checkLicence();
  }, [isSignedIn]);

  return { tier, isPro: tier === "pro" || tier === "pro_lifetime" };
}
