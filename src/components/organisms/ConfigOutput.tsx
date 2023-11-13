import { copyText } from "../../clipboard";
import Button from "../atoms/Button";

type Props = {
  outboundUrls: Array<string>;
};

export default function ConfigOutput({ outboundUrls }: Props) {
  if (outboundUrls.length == 0) {
    return null;
  }
  return (
    <>
      <Button onClick={copyText(outboundUrls?.join("\n"))}>Copy All</Button>
      {outboundUrls.map((uri) => (
        <div
          key={uri}
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            margin: "2rem auto",
          }}
        >
          <Button onClick={copyText(uri)}>Copy</Button>
          <code
            style={{
              display: "inline-block",
              overflowX: "auto",
              whiteSpace: "nowrap",
              maxWidth: "80vw",
            }}
          >
            {uri}
          </code>
        </div>
      ))}
    </>
  );
}
