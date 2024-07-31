const unescapeFn = window.decodeURI || window.unescape;

function toBase64(v: string) {
  return window.btoa(unescapeFn(encodeURIComponent(v)));
}

type TransportNetwork = "tcp" | "kcp" | "ws" | "http" | "quic" | "grpc";
type TlsSettings = {
  alpn?: Array<string>;
  fingerprint: string;
  serverName: string;
};
type HttpSettings = {
  headers?: {
    Host?: string;
  };
  path: string;
};
type WsSettings = {
  headers?: {
    Host?: string;
  };
  path: string;
};

type RealitySettings = {
  show: boolean;
  fingerprint: string;
  serverName: string;
  publicKey: string;
  shortId: string;
  spiderX?: string;
};

type StreamSettings = {
  network: TransportNetwork;
  security: "tls" | "reality" | "none";
  tlsSettings?: TlsSettings;
  wsSettings?: WsSettings;
  httpSettings?: HttpSettings;
  realitySettings?: RealitySettings;
};

type TrojanOutbound = {
  protocol: "trojan";
  settings: {
    servers: Array<{
      address: string;
      port: number;
      password: string;
    }>;
  };
  streamSettings: StreamSettings;
  tag: string;
};
type VBasedOutbound = {
  protocol: "vmess" | "vless";
  settings: {
    vnext: Array<{
      address: string;
      port: number;
      users: Array<{
        id: string;
        flow?: "" | "";
        security?: string;
      }>;
    }>;
  };
  streamSettings: StreamSettings;
  tag: string;
};

type OutboundProtocol =
  | VBasedOutbound["protocol"]
  | TrojanOutbound["protocol"]
  | "freedom"
  | "blackhole";

type Outbound =
  | {
      protocol: OutboundProtocol;
    }
  | VBasedOutbound
  | TrojanOutbound;

const extractSharedParams = (
  o: Omit<TrojanOutbound | VBasedOutbound, "protocol">,
  hostAddress: string
) => {
  return {
    type: o.streamSettings.network,
    security: o.streamSettings.security,
    host:
      o.streamSettings.wsSettings?.headers?.Host ||
      o.streamSettings.httpSettings?.headers?.Host ||
      o.streamSettings.tlsSettings?.serverName ||
      hostAddress,
    path:
      o.streamSettings.wsSettings?.path || o.streamSettings.httpSettings?.path,

    // TLS Settings
    fp: o.streamSettings.tlsSettings?.fingerprint,
    sni: o.streamSettings.tlsSettings?.serverName,
    alpn: o.streamSettings.tlsSettings?.alpn?.join(","),
  };
};
const trojanUriGenerator = ({ protocol, ...o }: TrojanOutbound) => {
  const { address: host, port, password } = o.settings.servers[0];
  const payload = JSON.parse(
    JSON.stringify({
      ...extractSharedParams(o, host),
    })
  );

  return [
    `trojan://${encodeURIComponent(
      password
    )}@${host}:${port}?${new URLSearchParams(payload)}#${protocol}_${host}`,
  ];
};

const vBasedXrayUriGenerator = ({ protocol, ...o }: VBasedOutbound) => {
  const { address: host, port, users } = o.settings.vnext[0];
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

  return [
    `${protocol}://${encodeURIComponent(
      uuid
    )}@${host}:${port}?${new URLSearchParams(
      JSON.parse(JSON.stringify(payload))
    )}#${protocol}_${host}_${uuid}`,
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
    )}`,
  ];
};

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
