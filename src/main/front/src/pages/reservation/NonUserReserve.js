import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import nonUserImg from "../../assets/imgs/nonUser.png";
function NonUserReserve() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");

  const changeNonMemberName = (event) => {
    setName(event.target.value);
  };

  const regPhoneNumber = (e) => {
    const result = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
      .replace(/(-{1,2})$/g, "");
    setPhoneNum(result);
  };

  // 예약 등록
  const createNonMemberReserve = async () => {
    const req = {
      name: name,
      phoneNum: phoneNum,
    };
    console.log("보내는 데이터", req);

    await axios
      .post("/api/nonMember", req)
      .then((response) => {
        console.log("비회원 예약 성공: ", response.data);
        const reserveId = response.data.id;
        console.log("nonMemberReserveId: ", reserveId);

        alert("비회원 예약이 등록되었습니다.");
        navigate("/");
      })
      .catch((error) => {
        console.log("비회원 예약 실패", error);
      });
  };

  return (
    <LoginContainer>
      <LoginBox>
        <LoginTitle>비회원 예약</LoginTitle>
        <LoginSub>
          하이펫 홈페이지에 방문해주신 여러분 진심으로 환영합니다
        </LoginSub>
      </LoginBox>
      <LoginSection>
        <NonUserImg>
          <img src={nonUserImg} alt="비회원 이미지" width={300} />
          <p>02-837-9922</p>
        </NonUserImg>
        <InputBox>
          <input
            type="text"
            placeholder="이름을 입력해주세요."
            value={name}
            onChange={changeNonMemberName}
          />
          <input
            type="text"
            placeholder="전화번호를 입력해주세요."
            value={phoneNum}
            onChange={regPhoneNumber}
            maxLength={13}
          />
        </InputBox>
        {/* 로그인 버튼*/}
        <SignInButton onClick={createNonMemberReserve}>예약하기</SignInButton>
        <div className="logo_t">
          상단의 연락처로 문의를 주시거나,
          <br />
          연락처를 남겨주시면 빠른 시일내 병원 측에서 연락드리겠습니다.
        </div>
      </LoginSection>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  padding-bottom: 90px;
`;
const NonUserImg = styled.div`
  margin-left: 5px;
`;
// 1.로그인 문구_박스
const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 20vh;
  pointer-events: none;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const LoginTitle = styled.h1`
  font-weight: 700;
  line-height: 1.3em;
  font-size: 42px;
  color: #111;
`;

const LoginSub = styled.p`
  display: block;
  margin-top: 1.5em;
  color: #888888;
  font-size: 14px;
  text-align: center;
`;
const LoginSection = styled.div`
  max-width: 1280px;
  background-color: #f5f7f9;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 65px 0px;

  .logo_t {
    font-size: 24px;
    font-weight: 700;
    color: #0d326f;
    text-align: center;
  }
  p {
    font-family: "Montserrat", serif;
    font-weight: 800;
    margin-top: 10px;
    font-size: 48px;
    color: #0d326f;
    text-align: center;
  }
`;

//3.로그인박스
const InputBox = styled.div`
  margin-top: 60px;
  width: 450px;
  box-sizing: border-box;
  text-align: center;

  input {
    width: 450px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 32px;
    border-radius: 5px;
    border: 1.5px solid #e0e0e0;
    background-color: #fff;
    outline: none;

    font-size: 14.2px;
    color: #0d326f;
    font-weight: 400;
  }

  input:nth-child(2) {
    margin-top: 15px;
  }
`;

//4.로그인 버튼
const SignInButton = styled.button`
  margin-top: 45px;
  width: 450px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
  border-radius: 5px;
  border: none;
  background-color: #0d326f;
  outline: none;

  color: #fff;
  font-weight: 500;
  font-size: 17px;
  margin-bottom: 45px;
  text-align: center;

  &:hover {
    border: 1px solid #ffa228;
    background-color: #ffa228;
  }
`;
export default NonUserReserve;
