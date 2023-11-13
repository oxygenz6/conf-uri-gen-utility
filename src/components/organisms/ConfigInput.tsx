import { ChangeEvent, createRef, useCallback } from "react";

type Props = {
  setRawData: React.Dispatch<string>;
};

export default function ConfigInput({ setRawData }: Props) {
  const rawDataHolder = createRef<HTMLInputElement>();

  const handleOnDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (rawDataHolder.current)
      rawDataHolder.current.files = e.dataTransfer.files;
  }, []);

  const handleOnFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.target.files?.item(0)?.text().then(setRawData);
  }, []);

  return (
    <div
      style={{
        margin: "2rem auto",
      }}
    >
      <input
        type="file"
        style={{
          display: "none",
        }}
        ref={rawDataHolder}
        onChange={handleOnFileChange}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={handleOnDrop}
        onClick={(e) => {
          e.preventDefault();
          rawDataHolder.current?.click();
        }}
        style={{
          backgroundColor: "violet",
          padding: "1rem",
        }}
      >
        Click here to select the config file or Drag and drop it within this
        area.
      </div>
    </div>
  );
}
