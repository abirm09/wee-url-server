import { AccessedDeviceType } from "@prisma/client";

export const deviceTypeMap: Record<string, AccessedDeviceType> = {
  desktop: "desktop",
  smartphone: "smartphone",
  tablet: "tablet",
  television: "television",
  camera: "camera",
  car: "car",
  console: "console",
  phablet: "phablet",
  wearable: "wearable",
  peripheral: "peripheral",
  "smart display": "smart_display",
  "portable media player": "portable_media_player",
  "smart speaker": "smart_speaker",
  "feature phone": "feature_phone",
};
