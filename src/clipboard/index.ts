export function copyText(uri: string) {
  return () => {
    navigator.clipboard.writeText(uri).then(() => alert("Text copied!"));
  };
}
