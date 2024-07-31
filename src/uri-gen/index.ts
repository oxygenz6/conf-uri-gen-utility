import { trojanUriGenerator } from "./trojan";
import { Outbound, TrojanOutbound, VBasedOutbound } from "./types";
import { vBasedXrayUriGenerator } from "./vBased";

const generators = {
  trojan: trojanUriGenerator,
  vmess: vBasedXrayUriGenerator,
  vless: vBasedXrayUriGenerator,
};

export default function generateUris(rawData: string) {
  let jsonConf;

  try {
    jsonConf = JSON.parse(rawData);
  } catch (e) {
    alert("Unable to parse configuration.");
    return [];
  }
  const outboundObjects: Array<Outbound> = jsonConf.outbounds;

  const outboundsURIs: string[] = [];
  outboundObjects
    .filter((obj) => !["freedom", "blackhole"].includes(obj.protocol))
    .forEach((outbound) => {
      const protocol = outbound.protocol;

      const outboundURIs = generators[
        protocol as (VBasedOutbound | TrojanOutbound)["protocol"]
      ](outbound as never);
      outboundsURIs.push(...outboundURIs);
    });

  return outboundsURIs;
}
