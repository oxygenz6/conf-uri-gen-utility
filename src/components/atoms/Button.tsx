type Props = React.PropsWithChildren<{
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
}>;

export default function Button({ onClick, children }: Props) {
  return (
    <button
      style={{
        padding: "0.5rem 0.8rem",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
