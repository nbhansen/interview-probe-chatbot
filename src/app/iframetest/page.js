import IFrameClient from "./_components/iframeclient";
import "./style.css";

const IFrame = async ({ searchParams }) => {
  let { height, width, uri } = searchParams;

  if (!height) height = 800;
  if (!width) width = 600;
  if (!uri) uri = "http://localhost:3000/nopage";

  return <IFrameClient uri={uri} width={width} height={height} />;
};

export default IFrame;
