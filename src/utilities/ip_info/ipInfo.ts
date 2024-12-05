import { env } from "../../config";
import { TIpInFo } from "../../types";
import { Logger } from "../logger/logger";

export const IPInfo = async (userIp?: string): Promise<TIpInFo> => {
  if (!userIp) return null;
  try {
    const response = await fetch(
      `https://ipinfo.io/${userIp}?token=${env.ip_info.token}`
    );

    if (!response.ok) {
      // Handle HTTP errors gracefully
      Logger.console.error(
        `Failed to fetch IP info. Status: ${response.status}, Message: ${response.statusText}`
      );
      return null;
    }

    const data = (await response.json()) as Partial<TIpInFo>;
    return {
      ip: data?.ip || null,
      city: data?.city || null,
      region: data?.region || null,
      country: data?.country || null,
      loc: data?.loc || null,
      org: data?.org || null,
      postal: data?.postal || null,
      timezone: data?.timezone || null,
    };
  } catch (error) {
    Logger.console.error("Failed to fetch user IP information", error);
    return null;
  }
};
