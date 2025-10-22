"use client";

import { useEffect } from "react";

const IFrameClient = ({ uri, width, height }) => {
  useEffect(() => {
    const handleMessage = (event) => {
      console.log("Message received from iframe:", JSON.parse(event.data));
    };

    window.addEventListener("message", handleMessage);
  }, [uri]);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <iframe
        src={uri}
        width={width}
        height={height}
        style={{ border: "none", overflow: "hidden" }}
      ></iframe>
    </div>
  );
};

export default IFrameClient;
