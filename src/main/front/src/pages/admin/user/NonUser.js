import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import CommonTable from "../../../components/common/CommonTable";
import CustomPagination from "../../../components/common/CustomPagination";
import { AuthContext, HttpHeadersContext } from "../../../context";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function NonUser() {
  const { auth, setAuth } = useContext(AuthContext);
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const [bbsList, setBbsList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCnt, setTotalCnt] = useState(0);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  const linkValue = "nonuser";
  const columns = [
    { label: "No", field: "id" },
    { label: "이름", field: "name" },
    { label: "전화번호", field: "phoneNum" },
  ];

  const getBbsList = async (page) => {
    try {
      const response = await axios.get("/api/admin/nonMember", {
        params: { page: page - 1 },
        headers: headers,
      });
      setBbsList(response.data.content || []);
      setPageSize(response.data.pageSize || 10);
      setTotalCnt(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching board data:", error);
    }
  };
  useEffect(() => {
    // headers 설정 및 로그인 상태 체크
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("로그인 한 사용자만 게시글을 작성할 수 있습니다 !");
      navigate(-1);
    } else {
      setHeaders({ Authorization: `Bearer ${token}` });
    }
  }, []); // 이 Effect는 한 번만 실행되도록 함
  useEffect(() => {
    getBbsList(page);
  }, [page]);

  const addEmptyRows = (data) => {
    const rowsWithEmpty = [];
    data.forEach((item, index) => {
      rowsWithEmpty.push({ key: `empty-${index * 2}` }); // 빈 데이터 행 추가 (공백 행)
      rowsWithEmpty.push({ ...item, key: `item-${index * 2 + 1}` }); // 데이터 행 추가
    });
    return rowsWithEmpty;
  };

  return (
    <Container>
      <ContentWrapper>
        <CommonTable
          bbsList={bbsList}
          columns={columns}
          linkPrefix={linkValue}
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

const Title = styled.div`
  width: 100%;
  height: 50px;
  margin-top: 100px;
  text-align: left;
  h1 {
    font-weight: bold;
    font-size: 36px;
    font-family: "Noto Sans KR", serif;
  }
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

const WriteBtn = styled.button`
  width: 50px;
  height: 30px;
  font-weight: 400;
  font-size: 16px;
  font-family: "Noto Sans KR", serif;
  background-color: #f4f4f4;
  border: 1px solid #111111;
`;

const WriteBtnBox = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: end;
  margin-top: 30px;
`;

export default NonUser;
