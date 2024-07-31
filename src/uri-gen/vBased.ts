import { extractSharedParams } from "./sharedParams";
import { VBasedOutbound } from "./types";

const unescapeFn = window.decodeURI || window.unescape;

function toBase64(v: string) {
  return window.btoa(unescapeFn(encodeURIComponent(v)));
}

export const vBasedXrayUriGenerator = ({ protocol, ...o }: VBasedOutbound) => {
  const encoded: string[] = [];
  const raw: string[] = [];
  o.settings.vnext.forEach((sv) => {
    const { address: host, port, users } = sv;
    const { id: uuid, security: encryption, flow } = users[0];
    let payload: Record<string, string | undefined> = {
      ...extractSharedParams(o, host),
      encryption,
      flow,
    };
    if (
      o.streamSettings.security === "reality" &&
      o.streamSettings.realitySettings
    ) {
      const {
        publicKey: pbk,
        shortId: sid,
        spiderX: spx,
        serverName: sni,
        fingerprint: fp,
      } = o.streamSettings.realitySettings;
      payload = {
        ...payload,
        pbk,
        sid,
        spx,
        sni,
        fp,
      };
    }
    raw.push(
      `${protocol}://${encodeURIComponent(
        uuid
      )}@${host}:${port}?${new URLSearchParams(
        JSON.parse(JSON.stringify(payload))
      )}#${protocol}_${host}_${uuid}`
    );
    encoded.push(
      `${protocol}://${toBase64(
        JSON.stringify({
          id: uuid,
          scy: encryption,
          add: host,
          host: payload.host,
          net: payload.type,
          ps: `#${protocol}_${host}_${uuid}`,
          tls: payload.security,
          path: payload.path,
          fp: payload.fp,
          sni: payload.sni,
          alpn: payload.alpn,
          port: port,
          v: "2",
        })
      )}`
    );
  });
  return [...encoded, ...raw];
};
