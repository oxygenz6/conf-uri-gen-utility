import {
  StreamSettings,
  TlsSettings,
  TransportNetwork,
  TrojanOutbound,
  VBasedOutbound
} from "./types";

type SharedParams = {
  type: TransportNetwork;
  security: StreamSettings["security"];
  fp?: TlsSettings["fingerprint"];
  sni?: TlsSettings["serverName"];
  alpn?: string;
  host?: string;
  path?: string;
};

export const extractSharedParams = (
  o: Omit<TrojanOutbound | VBasedOutbound, "protocol">,
  hostAddress: string
): SharedParams => {
  const output: SharedParams = {
    type: o.streamSettings.network,
    security: o.streamSettings.security,
  };

  if (o.streamSettings.security != "none") {
    output["fp"] = o.streamSettings.tlsSettings?.fingerprint;
    output["sni"] = o.streamSettings.tlsSettings?.serverName;
    output["alpn"] = o.streamSettings.tlsSettings?.alpn?.join(",");
  }

  if (
    ["ws", "http", "splithttp", "httpupgrade"].includes(
      o.streamSettings.network
    )
  ) {
    const networkSettings =
      o.streamSettings.httpSettings ||
      o.streamSettings.wsSettings ||
      o.streamSettings.httpupgradeSettings ||
      o.streamSettings.splithttpSettings;
    output.path = networkSettings?.path;
    output.host =
      networkSettings?.host ||
      networkSettings?.headers?.Host ||
      o.streamSettings.tlsSettings?.serverName ||
      hostAddress;
  }

  return output;
};
