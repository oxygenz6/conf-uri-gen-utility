export type TransportNetwork = "tcp" | "kcp" | "ws" | "http" | "quic" | "grpc";
export type TlsSettings = {
  alpn?: Array<string>;
  fingerprint: string;
  serverName: string;
};
export type HttpSettings = {
  headers?: {
    Host?: string;
  };
  host?: string;
  path?: string;
};
export type WsSettings = {
  headers?: {
    Host?: string;
  };
  host?: string;
  path?: string;
};

export type RealitySettings = {
  show: boolean;
  fingerprint: string;
  serverName: string;
  publicKey: string;
  shortId: string;
  spiderX?: string;
};

export type StreamSettings = {
  network: TransportNetwork;
  security: "tls" | "reality" | "none";
  tlsSettings?: TlsSettings;
  wsSettings?: WsSettings;
  httpSettings?: HttpSettings;
  splithttpSettings?: HttpSettings;
  httpupgradeSettings?: HttpSettings;
  realitySettings?: RealitySettings;
};

export type TrojanOutbound = {
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
export type VBasedOutbound = {
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

export type OutboundProtocol =
  | VBasedOutbound["protocol"]
  | TrojanOutbound["protocol"]
  | "freedom"
  | "blackhole";

export type Outbound =
  | {
      protocol: OutboundProtocol;
    }
  | VBasedOutbound
  | TrojanOutbound;
