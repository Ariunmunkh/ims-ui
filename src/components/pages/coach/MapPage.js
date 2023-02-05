import React from "react";
import { ReactBingmaps } from "react-bingmaps";
export default function MapPage() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <iframe
        width="100%"
        height={550}
        src="https://lookerstudio.google.com/embed/reporting/0e0992ed-12b0-4d23-b60e-6e04ff144841/page/jfQED"
        frameBorder={0}
        style={{ border: 0 }}
        allowFullScreen
      />

      <iframe
        src="https://www.google.com/maps/d/embed?mid=1RpECl3oS2pvK_hdq6rP3zXIv1qCubuM&ehbc=2E312F"
        title="map"
        width="100%"
        height="100%"
      ></iframe>
      <ReactBingmaps
        bingmapKey="Al5_dVdiKO78I00m1mkAwVz7EmrK9ylIMTqI7qzQvwo2LSruRN2OkQFeRAsIaI24"
        supportedMapTypes={["aerial", "canvasDark"]}
        disableStreetside={true}
        pushPins={[
          {
            location: [47.899168, 106.925506],
            option: { color: "red" },
          },
        ]}
      ></ReactBingmaps>
    </div>
  );
}
