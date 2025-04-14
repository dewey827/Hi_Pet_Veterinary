import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import CommonTable from "../../../components/common/CommonTable";
import CustomPagination from "../../../components/common/CustomPagination";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext, HttpHeadersContext } from "../../../context";
import CommonSearch from "../../../components/common/CommonSearch";

const A_Reservation = () => {
  const [bbsList, setBbsList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCnt, setTotalCnt] = useState(0);
  const [isSearchActive, setIsSearchActive] = useState(false); // 검색 활성 상태 추가
  const [linkValue, setLinkValue] = useState("/a_reservation"); // linkValue 상태 추가
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const { auth, setAuth } = useContext(AuthContext);
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const type = "reservation";
  let useRole = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      useRole = decodedToken.roles;
    } catch (e) {
      console.error("토큰 디코딩 오류: ", e);
    }
  }
  console.log(useRole);

  const columns = [
    { label: "No", field: "id" },
    { label: "닉네임", field: "nickName" },
    { label: "동물", field: "petName" },
    { label: "예약 날짜", field: "reservationDateTime" },
    { label: "삭제", field: "actions" },
  ];

  // 예약 리스트 가져오기
  const getBbsList = async (page) => {
    try {
      const response = await axios.get("/api/admin/reservation", {
        params: { page: page - 1 },
        headers, // Spring pageable 처리
      });
      setBbsList(response.data.content || []);
      console.log("받는 데이터", bbsList);
      setPageSize(response.data.pageSize || 8);
      setTotalCnt(response.data.totalElements);
    } catch (error) {
      console.error("예약 데이터 가져오기 오류:", error);
    }
  };

  // 검색 후 결과 갱신
  const updateBbsList = (data) => {
    if (data && data.content && data.content.length > 0) {
      setBbsList(data.content); // 검색 결과가 있을 때만 데이터 업데이트
      setIsSearchActive(true); // 검색 활성화
    } else {
      setBbsList([]); // 결과가 없으면 빈 배열로 초기화
      setIsSearchActive(false); // 검색 비활성화
    }
  };

  const handleDelete = async (id) => {
    // 나한테만 확인을 띄우는 부분
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");

    if (!isConfirmed) return; // 내가 취소하면 삭제를 진행하지 않음

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    try {
      console.log("받는 아이디", bbsList.id);

      // 바로 삭제 진행
      const deleteResponse = await axios.delete(
        `/api/member/reservation/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (deleteResponse.status === 200) {
        alert(`예약이 삭제되었습니다.`);
        getBbsList(page); // 삭제 후 목록 새로고침
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

  // 데이터에 빈 행 추가
  const addEmptyRows = (data) => {
    const rowsWithEmpty = [];
    data.forEach((item) => {
      rowsWithEmpty.push({});
      rowsWithEmpty.push(item);
    });
    return rowsWithEmpty;
  };

  useEffect(() => {
    getBbsList(page);
  }, [page]);

  const bbsListWithEmptyRows = addEmptyRows(bbsList);

  return (
    <Container>
      <ContentWrapper>
        <CommonTable
          bbsList={bbsListWithEmptyRows.map((item) => ({
            ...item,
            // 삭제 버튼
            actions: item.id ? (
              <button onClick={() => handleDelete(item.id)}>삭제</button>
            ) : null, // 빈 행일 경우 삭제 버튼 없음
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
};

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

export default A_Reservation;
