type Props = {
  version: string;
};

export default function AppVersion({ version }: Props) {
  return (
    <span
      style={{
        textAlign: "center",
        display: "inline-block",
        position: "absolute",
        top: "0",
        right: "0",
        backgroundColor: "black",
        color: "white",
        padding: "0.5rem",
        fontSize: "0.8rem",
      }}
    >
      Version: {version}
    </span>
  );
}
