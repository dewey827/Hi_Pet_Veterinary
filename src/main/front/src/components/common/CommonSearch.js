import React, { useState, useEffect } from "react";
import styled from "styled-components";
import searchIcon from "../../assets/imgs/header_search.svg";
import axios from "axios";

function CommonSearch({ type, onUpdate }) {
  const [searchVal, setSearchVal] = useState(""); // 검색어 상태
  const [choiceVal, setChoiceVal] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태

  // 검색 기준 옵션 설정 함수
  const getSelectOptions = () => {
    switch (type) {
      case "member":
        return [
          { value: "nickName", label: "닉네임" },
          { value: "email", label: "이메일" },
          { value: "phoneNum", label: "전화번호" },
        ];
      case "notice":
        return [{ value: "title", label: "제목" }];
      case "question":
        return [
          { value: "title", label: "제목" },
          { value: "writer", label: "작성자" },
        ];
      case "review":
        return [
          { value: "title", label: "제목" },
          { value: "writer", label: "작성자" },
        ];
      case "reservation":
        return [
          { value: "nickName", label: "닉네임" },
          { value: "petName", label: "동물" },
          { value: "departmentName", label: "진료과" },
        ];
      default:
        return [];
    }
  };

  // type이 변경될 때 첫 번째 옵션을 기본값으로 설정
  useEffect(() => {
    const options = getSelectOptions();
    if (options.length > 0) {
      setChoiceVal(options[0].value);
    } else {
      setChoiceVal(null);
    }
  }, [type]);

  const changeChoice = (event) => setChoiceVal(event.target.value);
  const changeSearch = (event) => setSearchVal(event.target.value);

  const getSearch = async () => {
    if (!searchVal || !choiceVal) {
      setErrorMessage("검색 조건이 부족합니다.");
      return;
    }

    try {
      let req = { page: 0 };
      if (
        ["member", "notice", "question", "review", "reservation"].includes(type)
      ) {
        req[choiceVal] = searchVal;
      }
      const response = await axios.post(`/api/search?type=${type}`, req);

      console.log("검색 결과:", response.data);

      if (response.data && response.data.length === 0) {
        setErrorMessage("검색 결과가 없습니다.");
      } else {
        setErrorMessage("");
      }

      if (typeof onUpdate === "function") {
        onUpdate(response.data);
      }
    } catch (error) {
      console.error(
        "검색 실패:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
      if (typeof onUpdate === "function") {
        onUpdate([]);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getSearch();
    }
  };

  return (
    <div>
      <SearchBox>
        <SelectBox>
          <select value={choiceVal || ""} onChange={changeChoice}>
            {getSelectOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </SelectBox>
        <SearchInputBox>
          <input
            type="search"
            value={searchVal}
            onChange={changeSearch}
            onKeyDown={handleKeyDown}
            placeholder="검색어를 입력해주세요."
          />
          <button onClick={getSearch}>
            <img src={searchIcon} alt="검색" />
          </button>
        </SearchInputBox>
      </SearchBox>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </div>
  );
}

// 스타일링 추가
const SearchBox = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
`;

const SelectBox = styled.div`
  margin-right: 10px;
  select {
    padding: 5px;
  }
`;

const SearchInputBox = styled.div`
  display: flex;
  input {
    padding: 5px;
    font-size: 14px;
    border: none;
    border-bottom: 1px solid #111111;
    outline: none;
  }
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
  font-size: 14px;
`;

export default CommonSearch;
