import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function formatDate(dateTime) {
  if (dateTime) {
    const [date] = dateTime.split("T"); // 'T' 기준으로 분리하여 날짜만 추출
    return date; // 'YYYY-MM-DD' 형식 반환
  }
  return ""; // 날짜가 없다면 빈 문자열 반환
}

function CommonTable({
  bbsList = [],
  columns,
  linkPrefix,
  isSearchActive = false,
  isLoading = false, // 로딩 상태 추가
  searchKeyword = "", // 검색어 추가
}) {
  // 검색어가 있을 경우 해당 검색어로 필터링하는 로직
  const filteredBbsList = bbsList.filter((response) => {
    if (searchKeyword) {
      // 제목(title)에 검색어가 포함된 항목만 필터링
      return response.title && response.title.includes(searchKeyword);
    }
    return true; // 검색어가 없으면 필터링하지 않음
  });

  // 결과가 없을 경우 "검색 결과가 없습니다." 메시지 표시
  const noResults = filteredBbsList.length === 0 && isSearchActive;

  return (
    <NoticeTableBox>
      <NoticeTabled>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length}>데이터 로딩 중...</td>
            </tr>
          ) : noResults ? (
            <tr>
              <td colSpan={columns.length}>검색 결과가 없습니다.</td>
            </tr>
          ) : (
            filteredBbsList.map((response, index) => (
              <tr key={index}>
                {columns.map((column, colIndex) => {
                  const data = column.field ? response[column.field] : null;
                  const formattedData =
                    column.field === "createdDate" ? formatDate(data) : data;
                  return (
                    <td key={colIndex}>
                      {column.link ? (
                        <Link to={`${linkPrefix}/${response.id}`}>
                          {formattedData}
                        </Link>
                      ) : (
                        formattedData
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </NoticeTabled>
    </NoticeTableBox>
  );
}

const NoticeTableBox = styled.div`
  width: 100%;
  max-width: 1280px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding-left: 140px;
  padding-right: 140px;
`;

const NoticeTabled = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: #f4f4f4;
    font-weight: bold;
  }

  thead th {
    padding: 10px;
    font-weight: medium;
    font-size: 20px;
    font-family: "Noto Sans KR", serif;
  }

  tbody tr {
    &:nth-child(odd) {
      border: none;
      height: 40px;
    }
    &:nth-child(even) {
      background-color: #f4f4f4;
      border-bottom: 1px solid #111111;
      height: 70px;
    }
  }

  tbody td {
    padding: 10px;
    font-weight: regular;
    font-size: 20px;
    font-family: "Noto Sans KR", serif;
    vertical-align: middle;
  }
`;

export default CommonTable;
