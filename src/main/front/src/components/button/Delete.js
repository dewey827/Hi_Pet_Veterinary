import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

function Delete() {
  const navigate = useNavigate();
  const { noticeId, questionId, reviewId, memberId } = useParams(); // reviewId 및 memberId 추가
  const location = useLocation();

  // 로컬 스토리지에서 access_token을 가져옵니다.
  const token = localStorage.getItem("access_token"); // 'access_token'은 로컬 스토리지에 저장된 토큰 이름입니다.

  // 1️⃣ 공지사항 삭제 함수
  const deleteNotice = async () => {
    try {
      const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
      if (!isConfirmed) return;

      const apiUrl = `/api/admin/notice/${noticeId}`;
      const redirectUrl = "/admin/notice";

      const response = await axios.delete(apiUrl, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("삭제되었습니다.");
        navigate(redirectUrl);
      } else {
        throw new Error("삭제 실패");
      }
    } catch (error) {
      console.error("deleteItem error", error);
      alert("삭제에 실패하였습니다. 다시 시도해 주세요.");
    }
  };

  // 2️⃣ 질문 삭제 함수
  const deleteQuestion = async () => {
    try {
      const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
      if (!isConfirmed) return;

      const isAdmin = location.pathname.includes("/admin");
      const apiUrl = `/api/member/question/${questionId}`;
      const redirectUrl = isAdmin ? "/admin/question" : "/question";

      const response = await axios.delete(apiUrl, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("삭제되었습니다.");
        navigate(redirectUrl);
      } else {
        throw new Error("삭제 실패");
      }
    } catch (error) {
      console.error("deleteItem error", error);
      alert("삭제에 실패하였습니다. 다시 시도해 주세요.");
    }
  };

  // 3️⃣ 리뷰 삭제 함수
  const deleteReview = async () => {
    try {
      const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
      if (!isConfirmed) return;

      const isAdmin = location.pathname.includes("/admin");
      const apiUrl = `/api/member/review/${reviewId}`;
      const redirectUrl = isAdmin ? "/admin/review" : "/review";

      const response = await axios.delete(apiUrl, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("삭제되었습니다.");
        navigate(redirectUrl);
      } else {
        throw new Error("삭제 실패");
      }
    } catch (error) {
      console.error("deleteItem error", error);
      alert("삭제에 실패하였습니다. 다시 시도해 주세요.");
    }
  };

  // 4️⃣ 회원 삭제 함수 (기존 handleDelete 함수)
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
        navigate("/admin/adminuser");
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

  // 삭제 로직을 경로에 맞게 처리
  const deleteItem = async () => {
    if (noticeId) {
      deleteNotice(); // 공지사항 삭제
    } else if (questionId) {
      deleteQuestion(); // 질문 삭제
    } else if (reviewId) {
      deleteReview(); // 리뷰 삭제
    } else if (memberId) {
      handleDelete(memberId); // 회원 삭제
    } else {
      alert("삭제할 항목이 없습니다.");
    }
  };

  return <Button onClick={deleteItem}>삭제</Button>;
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

export default Delete;
