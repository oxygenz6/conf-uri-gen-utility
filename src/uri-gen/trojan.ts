import { extractSharedParams } from "./sharedParams";
import { TrojanOutbound } from "./types";

export const trojanUriGenerator = ({ protocol, ...o }: TrojanOutbound) => {
  return o.settings.servers.map((sv) => {
    const { address: host, port, password } = sv;
    const payload = JSON.parse(
      JSON.stringify({
        ...extractSharedParams(o, host),
      })
    );
    return `trojan://${encodeURIComponent(
      password
    )}@${host}:${port}?${new URLSearchParams(payload)}#${protocol}_${host}`;
  });
};
