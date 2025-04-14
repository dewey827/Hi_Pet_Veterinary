import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import CommonTable from "../../../components/common/CommonTable";
import CustomPagination from "../../../components/common/CustomPagination";
import { AuthContext, HttpHeadersContext } from "../../../context";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import CommonSearch from "../../../components/common/CommonSearch";

function A_User() {
  const { auth, setAuth } = useContext(AuthContext);
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const [bbsList, setBbsList] = useState([]); // 검색 전 게시판 데이터
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCnt, setTotalCnt] = useState(0);
  const [isSearchActive, setIsSearchActive] = useState(false); // 검색 활성 상태 추가
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const type = "member";
  let useRole = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      useRole = decodedToken.roles;
    } catch (e) {
      console.log("토큰 디코딩 오류 : ", e);
    }
  }
  const linkValue = "adminuser";
  const columns = [
    { label: "No", field: "id" },
    { label: "이메일", field: "email" },
    { label: "닉네임", field: "nickName" },
    { label: "전화번호", field: "phoneNum" },
    { label: "삭제", field: "actions" },
  ];

  // 게시판 리스트 가져오기
  const getBbsList = async (page) => {
    try {
      const response = await axios.get("/api/admin/member", {
        params: { page: page - 1 },
        headers: headers,
      });
      setBbsList(response.data.content || []);
      setPageSize(response.data.pageSize || 8);
      setTotalCnt(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching board data:", error);
    }
  };

  const updateBbsList = (data) => {
    if (data && data.content && data.content.length > 0) {
      setBbsList(data.content); // 검색 결과가 있을 때만 데이터 업데이트
      setIsSearchActive(true); // 검색 활성화
    } else {
      setBbsList([]); // 결과가 없으면 빈 배열로 초기화
      setIsSearchActive(false); // 검색 비활성화
    }
  };

  useEffect(() => {
    setBbsListWithEmptyRows(addEmptyRows(bbsList)); // bbsList가 변경될 때마다 빈 행 추가
  }, [bbsList]); // bbsList가 변경될 때마다 호출

  // 삭제 함수
  const handleDelete = async (memberId) => {
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (!isConfirmed) return;

    try {
      const response = await axios.delete(`/api/admin/member/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("삭제하였습니다.");
        // 삭제 후 목록에서 해당 memberId를 삭제합니다.
        setBbsList(bbsList.filter((item) => item.id !== memberId));
      } else {
        alert("삭제에 실패하였습니다.");
      }
    } catch (error) {
      console.error(
        "Error during deletion:",
        error.response ? error.response.data : error
      );
      alert("삭제에 실패하였습니다.");
    }
  };

  // 페이지가 변경될 때마다 데이터 가져오기
  useEffect(() => {
    getBbsList(page);
  }, [page]);

  // 빈 행 추가하기
  const addEmptyRows = (data) => {
    if (!Array.isArray(data)) {
      return [];
    }
    const rowsWithEmpty = [];
    data.forEach((item, index) => {
      rowsWithEmpty.push({ key: `empty-${index * 2}` });
      rowsWithEmpty.push({ ...item, key: `item-${index * 2 + 1}` });
    });
    return rowsWithEmpty;
  };

  const [bbsListWithEmptyRows, setBbsListWithEmptyRows] = useState(
    addEmptyRows(bbsList)
  );

  const handleEmailClick = (memberId) => {
    navigate(`/admin/adminuser/member/${memberId}`);
  };

  return (
    <Container>
      <ContentWrapper>
        <CommonTable
          bbsList={bbsListWithEmptyRows.map((item, index) => ({
            ...item,
            No: item.id ? index + 1 : null,
            email: item.email ? (
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => handleEmailClick(item.id)}
              >
                {item.email}
              </span>
            ) : null,
            actions: item.id ? (
              <button onClick={() => handleDelete(item.id)}>삭제</button>
            ) : null,
          }))}
          columns={columns}
          linkPrefix={linkValue}
          isSearchActive={isSearchActive} // 검색 활성 상태 전달
        />
        <CommonSearch
          type={type}
          onUpdate={updateBbsList} // 검색 후 업데이트 처리
        />
        <PaginationBox>
          <CustomPagination
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            totalCnt={totalCnt}
          />
        </PaginationBox>
      </ContentWrapper>
    </Container>
  );
}

// 스타일 컴포넌트들
const Container = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PaginationBox = styled.div`
  padding: 10px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1000px;
  height: 50px;
  background-color: #ffffff;
  flex-direction: row;

  .pagination {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  .pagination li {
    display: inline-block;
    margin: 0 5px;
  }
`;

export default A_User;
