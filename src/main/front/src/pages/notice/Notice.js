import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import CommonTable from "../../components/common/CommonTable";
import CustomPagination from "../../components/common/CustomPagination";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context";
import WriteGo from "../../components/button/WriteGo";
import CommonSearch from "../../components/common/CommonSearch";

function Notice() {
  const [bbsList, setBbsList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCnt, setTotalCnt] = useState(0);
  const token = localStorage.getItem("access_token");
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const type = "notice";
  const [isSearchActive, setIsSearchActive] = useState(false); // 검색 활성 상태 추가
  const [linkValue, setLinkValue] = useState("/notice");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.roles);
      } catch (e) {
        console.log("토큰 디코딩 오류 : ", e);
      }
    }
  }, [token]);

  const columns = [
    { label: "No", field: "id" },
    { label: "제목", field: "title", link: true },
    { label: "작성자", field: "adminName" },
    { label: "작성일", field: "createdDate" },
  ];

  const getBbsList = async (page) => {
    try {
      const response = await axios.get("/api/notice", {
        params: { page: page - 1 },
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
    if (window.location.pathname.includes("/admin")) {
      setLinkValue("/admin/notice");
    } else {
      setLinkValue("/notice");
    }
  }, []);

  useEffect(() => {
    getBbsList(page);
  }, [page]);

  const addEmptyRows = (data) => {
    const rowsWithEmpty = [];
    data.forEach((item) => {
      rowsWithEmpty.push({}); // 빈 데이터 행 추가
      rowsWithEmpty.push(item); // 데이터 행 추가
    });
    return rowsWithEmpty;
  };

  const bbsListWithEmptyRows = addEmptyRows(bbsList);

  return (
    <Container>
      <ContentWrapper>
        <CommonTable
          bbsList={bbsListWithEmptyRows.map((item) => ({
            ...item,
            title: item.title ? (
              <span style={{ color: "blue", cursor: "pointer" }}>
                {item.title}
              </span>
            ) : null,
          }))}
          columns={columns}
          linkPrefix={linkValue}
          isSearchActive={isSearchActive}
        />
        {role === "ROLE_ADMIN" && (
          <BottomBox>
            <WriteGo />
          </BottomBox>
        )}

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

//  하단 버튼 박스
const BottomBox = styled.div`
  display: flex;
  width: 100%;
  max-width: 1000px;
  justify-content: flex-end;
  margin-top: 20px;

  padding-left: 140px;
  padding-right: 140px;
`;

export default Notice;
