import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Pagination from "react-js-pagination";

function AdminReservationList() {
  //BbsList
  // const [bbsList, setBbsList] = useState([]);

  // //검색용 Hook
  // //게시글 조회
  // const [choiceVal, setChoiceVal] = useState("");
  // const [searchVal, setSearchVal] = useState("");

  // //Paging
  // const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);
  // const [totalPages, setTotalPages] = useState(0);
  // const [totalCnt, setTotalCnt] = useState(0);

  // const getBbsList = async (page) => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8080/api/admin/member/list",
  //       {
  //         params: { page: page - 1 },
  //       }
  //     );

  //     console.log("[BbsList.js] useEffect() success :D");
  //     console.log(response.data);

  //     setBbsList(response.data.content);
  //     setPageSize(response.data.pageSize);
  //     setTotalPages(response.data.totalPages);
  //     setTotalCnt(response.data.totalElements); //★
  //   } catch (error) {
  //     console.log("[BbsList.js] useEffect() error :<");
  //     console.log(error);
  //   }
  // };

  //페이징 보여주기
  // const changePage = (page) => {
  //   setPage(page);
  //   getBbsList(page);
  // };

  return (
    <Container>
      <ContentWrapper>
        <NoticeTableBox>
          <NoticeTable>
            <thead>
              <tr>
                <th>번호</th>
                <th>진료과</th>
                <th>날짜</th>
                <th>시간</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody></tbody>
          </NoticeTable>
        </NoticeTableBox>

        <NoticeSearchBox>
          <select>
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <SearchField type="text" placeholder="검색어" />
          <SearchButton>검색</SearchButton>
        </NoticeSearchBox>
        <PaginationBox>
          {/* <Pagination
            className="pagination"
            activePage={page}
            itemsCountPerPage={pageSize}
            totalitemsCount={totalPages}
            prevPageText={"<"}
            nextPageText={">"}
            onChange={changePage}
          /> */}
        </PaginationBox>
      </ContentWrapper>
    </Container>
  );
}

// 컨테이너
const Container = styled.div`
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

//  내부 콘텐츠
const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1280px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

//   테이블 박스
const NoticeTableBox = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

//   테이블
const NoticeTable = styled.table`
  border: 1px solid black;
  width: 100%;
  height: 400px;
  border-radius: 15px;
  text-align: center;
`;

//  검색 박스
const NoticeSearchBox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
`;

//  검색 필드 스타일
const SearchField = styled.input`
  padding: 5px;
  margin-left: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
const PaginationBox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
`;

const SearchButton = styled.button`
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export default AdminReservationList;
