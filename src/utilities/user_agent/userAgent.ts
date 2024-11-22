import DeviceDetector from "device-detector-js";
import TUserAgent from "../../types/user_agent";

const deviceDetector = new DeviceDetector();

const userAgentParser = (ua?: string): TUserAgent => {
  if (!ua) return;
  const parsedData = deviceDetector.parse(ua);
  return parsedData;
};

export default userAgentParser;
