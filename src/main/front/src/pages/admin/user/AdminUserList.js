import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Pagination from "react-js-pagination";
import search from "../../../assets/imgs/header_search.png";

function AdminUserList() {
  //BbsList
  const [bbsList, setBbsList] = useState([]);

  //검색용 Hook
  //게시글 조회
  const [choiceVal, setChoiceVal] = useState("");
  const [searchVal, setSearchVal] = useState("");

  //Paging
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCnt, setTotalCnt] = useState(0);

  const getBbsList = async (page) => {
    try {
      const response = await axios.get("http://localhost:8080/board/list", {
        params: { page: page - 1 },
      });

      console.log("[BbsList.js] useEffect() success :D");
      console.log(response.data);

      setBbsList(response.data.content);
      setPageSize(response.data.pageSize);
      setTotalPages(response.data.totalPages);
      setTotalCnt(response.data.totalElements); //★
    } catch (error) {
      console.log("[BbsList.js] useEffect() error :<");
      console.log(error);
    }
  };

  //페이징 보여주기
  const changePage = (page) => {
    setPage(page);
    getBbsList(page);
  };

  const [notices, setNotices] = useState([
    { id: 1, email: "user1@email.com", nick: "nick1", tel: "01012341234" },
    { id: 2, email: "user2@email.com", nick: "nick2", tel: "01056785678" },
    { id: 3, email: "user3@email.com", nick: "nick3", tel: "01099998888" },
    { id: 4, email: "user4@email.com", nick: "nick4", tel: "01011112222" },
    { id: 5, email: "user5@email.com", nick: "nick5", tel: "01033334444" },
    { id: 6, email: "user6@email.com", nick: "nick6", tel: "01055556666" },
    { id: 7, email: "user7@email.com", nick: "nick7", tel: "01077778888" },
    { id: 8, email: "user8@email.com", nick: "nick8", tel: "01099990000" },
  ]);

  const addEmptyRows = (data) => {
    const rowsWithEmpty = [];
    data.forEach((item, index) => {
      rowsWithEmpty.push({}); // 데이터 행 추가
      rowsWithEmpty.push(item); // 빈 데이터 행 추가 (공백 행)
    });
    return rowsWithEmpty;
  };
  const noticesWithEmptyRows = addEmptyRows(notices);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (confirmDelete) {
      setNotices(notices.filter((notice) => notice.id !== id));
    }
  };

  return (
    <Container>
      {/* 제목 표시 */}
      <HomeSectionA>
        <HomeTitle>
          <h1>회원 관리</h1>
        </HomeTitle>
      </HomeSectionA>
      <SearchBox>
        <img src={search} />
        <SearchField type="text" placeholder="검색 할 것을 적어보세요." />
      </SearchBox>

      <NoticeTableBox>
        <NoticeTabled>
          <thead>
            <tr>
              <th>번호</th>
              <th>이메일</th>
              <th>닉네임</th>
              <th>핸드폰 번호</th>
              <th>회원삭제</th>
            </tr>
          </thead>

          <tbody>
            {noticesWithEmptyRows.map((notice, index) => (
              <tr key={index}>
                {notice.id ? (
                  // 데이터가 있을 때
                  <>
                    <td>{notice.id}</td>
                    <td>{notice.email}</td>
                    <td>{notice.nick}</td>
                    <td>{notice.tel}</td>
                    <td>
                      {" "}
                      <button onClick={() => handleDelete(notice.id)}>
                        삭제
                      </button>
                    </td>
                  </>
                ) : (
                  // 빈 데이터 행일 때 (공백 행)
                  <>
                    <td colSpan={4}>&nbsp;</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </NoticeTabled>
      </NoticeTableBox>

      <PaginationBox>
        <Pagination
          className="pagination"
          activePage={page}
          itemsCountPerPage={pageSize}
          totalitemsCount={totalPages}
          prevPageText={"<"}
          nextPageText={">"}
          onChange={changePage}
        />
      </PaginationBox>
    </Container>
  );
}

// 컨테이너
const Container = styled.div`  
width:100%
  max-width: 1920px;
`;
//  검색 박스
const SearchBox = styled.div`
  display: flex;
  width: 1280px;
  height: 90px;
  justify-content: center;
  position: relative;
  img {
    position: absolute;
    left: 180px;
    top: 35px;
    width: 30px;
    height: 30px;
  }
  input {
    padding-left: 50px;
    padding-bottom: 10px;
  }
  input:focus {
    outline: none;
  }
`;

const HomeSectionA = styled.div`
  background-color: #111111;
  grid-column: 3;
  grid-row: 1;
  top: 50px;
  position: relative;
  justify-content: center;
  align-items: center;
  display: flex;
  width: 1000px;
  height: 70px;
`;

const HomeTitle = styled.div`
  color: #ffffff;
  padding: 20px;
  font-size: 32px;
  font-weight: 700;
  display: flex;
`;

//  검색 필드 스타일
const SearchField = styled.input`
  margin-top: 25px;
  width: 920px;
  height: 55px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-weight: regular;
  font-size: 36px;
  font-family: "Noto Sans KR", serif;
`;

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
    width: 1280px;
  }

  
  tbody td {
    padding: 10px;
    font-weight: regular;
    font-size: 20px;
    font-family: "Noto Sans KR", serif;
 vertical-align: middle;

  &:nth-of-type(1) {  /* 첫 번째 <td> */
    width: 80px;
    text-align: center;
  }

  &:nth-of-type(2) {  /* 두 번째 <td> */
    width: 320px;
    text-align: center;
  }

  &:nth-of-type(3) {  /* 세 번째 <td> */
    width: 380px;
    text-align: center;
  }

  &:nth-of-type(4) {  /* 네 번째 <td> */
    width: 350px;
    text-align: center;
  }
     &:nth-of-type(5) {  /* 다섯 번째 <td> */
    width: 150px;
    text-align: center;
  }

`;
//페이지네이션
const PaginationBox = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;

  margin-bottom: 40px;
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: center;
  width: 1000px;
  height: 50px;
  background-color: #ffffff;
  flex-direction: row;

  /* Pagination 스타일 */
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

export default AdminUserList;
