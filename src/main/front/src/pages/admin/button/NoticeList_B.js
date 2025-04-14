import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

function NoticeList_B() {
  return (
    <NoticeContainer>
      <WriteBox>
        <WriteButton to="/noticeWrite">작성</WriteButton>
      </WriteBox>
    </NoticeContainer>
  );
}

const NoticeContainer = styled.div`. 

  margin: auto;
  display: block;
  width: 1000px;
  height: 30px;
  position: relative;
  button {
  }
`;

// 작성/수정 버튼 박스
const WriteBox = styled.div`
  width: 1000px;
height: 60px;
background-color: #111111;
  display: flex;
  gap: 10px;
    align-items: center;
  justify-content: end;
`;

// 작성/수정 버튼 스타일
const WriteButton = styled(Link)`
margin-right: 10px;
   display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
 width: 80px;
height: 40px;
  padding: 5px 10px;
   background: #f4f4f4;
   box-shadow: 0px 3px 1px rgba(244, 244, 244, 0.8);
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
font-size: 16px;
 font-weight: 700;
  &:hover {
  border: 1px solid  #f4f4f4;
    background: #111111;
    color: #f4f4f4;
       box-shadow: 0px 3px 1px  #111111;
  }
`;
export default NoticeList_B;
