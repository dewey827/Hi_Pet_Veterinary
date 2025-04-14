import { Map, MapMarker } from "react-kakao-maps-sdk";
import React from "react";
import styled from "styled-components";

function KakaoMap(props) {
  return (
    <Map
      center={{ lat: 37.48197988243028, lng: 126.89814204687781 }}
      style={{ width: "918px", height: "329px" }}
      level={3}
    >
      {/* 마커 추가 */}
      <MapMarker position={{ lat: 37.48197988243028, lng: 126.89814204687781 }}>
        <MarkerStyle >
          <strong>🏥 하이펫동물병원</strong>
        </MarkerStyle>
      </MapMarker>
    </Map>
  );
}

const MarkerStyle = styled.div`
  background: #ffffff;
  border-Radius: 8px;
  color: #333;
  font-Size: 14px;
  font-Weight: bold;
  padding-left:15px;
`

export default KakaoMap;
