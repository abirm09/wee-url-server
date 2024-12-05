import DeviceDetector from "device-detector-js";
import { TUserAgent } from "../../types";

const deviceDetector = new DeviceDetector();

export const UserAgentParser = (ua?: string): TUserAgent => {
  if (!ua) return;
  const parsedData = deviceDetector.parse(ua);
  return parsedData;
};
