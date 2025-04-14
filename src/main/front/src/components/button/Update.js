import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { HttpHeadersContext } from "../../context";

function Update({
  noticeId,
  questionId,
  reviewId,
  navigate,
  title,
  content,
  fileUpload,
}) {
  const { headers, setHeaders } = useContext(HttpHeadersContext);

  useEffect(() => {
    setHeaders({
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    });
  }, [setHeaders]);

  const handleEditClick = async () => {
    try {
      let apiUrl = "";
      let redirectUrl = "";
      const isAdmin = window.location.pathname.startsWith("/admin");

      // 수정할 API URL과 리디렉션 URL 설정
      if (noticeId) {
        apiUrl = `/api/admin/notice/${noticeId}`;
        redirectUrl = `/admin/notice/${noticeId}`;
      } else if (questionId) {
        apiUrl = `/api/member/question/${questionId}`;
        redirectUrl = isAdmin
          ? `/admin/question/${questionId}`
          : `/question/${questionId}`;
      } else if (reviewId) {
        apiUrl = `/api/member/review/${reviewId}`;
        redirectUrl = isAdmin
          ? `/admin/review/${reviewId}`
          : `/review/${reviewId}`;
      } else {
        alert("수정할 게시글이 없습니다.");
        return;
      }

      const response = await axios.put(
        apiUrl,
        { title, content },
        { headers: headers }
      );
      if (response.status === 200) {
        // 파일 업로드 함수 호출
        if (fileUpload) {
          await fileUpload(noticeId); // files 상태를 사용하여 파일 업로드
        }

        navigate(redirectUrl); // 해당 게시글에 맞는 URL로 리디렉션
      } else {
        throw new Error("수정 실패");
      }
    } catch (error) {
      console.error("수정 실패:", error);
      alert(`수정에 실패했습니다. 다시 시도해 주세요. 오류: ${error.message}`);
    }
  };

  return <Button onClick={handleEditClick}>수정</Button>;
}

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  background-color: #000; /* 검정색 배경 */
  color: white;
  margin-bottom: 50px;

  &:hover {
    background-color: #333; /* hover 시 더 어두운 검정색 */
  }
`;

export default Update;
