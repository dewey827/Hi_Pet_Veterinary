import axios from "axios";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { AuthContext, HttpHeadersContext } from "../../context";
import { jwtDecode } from "jwt-decode"; // jwt-decode 라이브러리 import
import { useNavigate } from "react-router-dom";
function Comment(props) {
  const comment = props.comment;
  const commentId = props.comment.id;
  const page = props.page;
  const navigate = useNavigate();
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const memberId = Number(localStorage.getItem("id"));
  const token = localStorage.getItem("access_token");
  let useRole = null;
  if (token) {
    try {
      // 토큰 디코딩
      const decodedToken = jwtDecode(token);
      console.log("유저 롤", decodedToken.roles);
      useRole = decodedToken.roles;
    } catch (e) {
      console.log("토큰 디코딩 오류 : ", e);
    }
  }
  const deleteComment = async () => {
    await axios
      .delete(`/api/member/comment/${commentId}`, { headers: headers })
      .then((resp) => {
        console.log("[BbsComment.js] deleteComment() success :D");
        console.log(resp.data);

        alert("답글을 성공적으로 삭제했습니다 :D");
        //삭제된 댓글 목록 다시 불러오기
      })
      .catch((err) => {
        console.log("[BbsComment.js] deleteComment() error :<");
        console.log(err);
      });
  };
  console.log("댓글 시간", comment);

  return (
    <Container>
      <CommentBox>
        <Table>
          <tbody>
            <tr>
              <Td>{comment.nickName}</Td>
            </tr>
            <tr>
              <Td>{comment.content}</Td>
            </tr>
            <tr>
              <Td>{`${comment.createdDate.split("T")[0]} ${comment.createdDate
                .split("T")[1]
                .slice(0, 5)}`}</Td>
            </tr>
          </tbody>
        </Table>

        <BtnBox>
          {(memberId === comment.memberId || useRole === "ROLE_ADMIN") && (
            <>
              <Btn onClick={deleteComment}>삭제</Btn>
            </>
          )}
        </BtnBox>
      </CommentBox>
    </Container>
  );
}

// 스타일 정의
const Container = styled.div`
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CommentBox = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 10px;
`;

const Table = styled.table`
  width: 100%;
`;

const Td = styled.td`
  padding: 5px;
  font-size: 14px;
`;

const BtnBox = styled.div`
  display: flex;
  gap: 10px;
`;

const Btn = styled.button`
  width: 50px;
  height: 30px;
  border: 1px solid #111111;
  cursor: pointer;
  background-color: #000; /* 검정색 배경 */
  border-radius: 5px;
  color: white;

  &:hover {
    background-color: #333; /* hover 시 더 어두운 검정색 */
  }
`;

export default Comment;
