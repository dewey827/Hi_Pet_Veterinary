import React, { useContext, useEffect, useState } from "react";
import { AuthContext, HttpHeadersContext } from "../../context";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ReviewLike() {
  const { auth } = useContext(AuthContext);
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const navigate = useNavigate();
  const { reviewId } = useParams();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 서버에서 좋아요 상태 확인
    const checkLikeStatus = async () => {
      try {
        const response = await axios.get(
          `/member/review/${reviewId}/like/status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        console.log("초기 좋아요 상태:", response.data);
        setIsLiked(response.data); // 서버 응답을 반영
      } catch (error) {
        console.error("좋아요 상태 확인 중 오류:", error);
      }
    };

    checkLikeStatus();
  }, [reviewId]); // reviewId 변경 시 다시 실행

  const reviewLike = async () => {
    if (!auth) {
      alert("로그인 후 사용 가능합니다.");
      return;
    }
    const req = {
      reviewId, // 리뷰 ID
      // memberId,   // 로그인된 사용자의 ID
    };

    try {
      // 좋아요 상태 변경 요청
      await axios.post(`/member/review/${reviewId}/like/toggle`, req, {
        headers,
      });

      // 최신 좋아요 상태 다시 가져오기
      const response = await axios.get(
        `/member/review/${reviewId}/like/status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      console.log("변경 후 좋아요 상태:", response.data);
      setIsLiked(response.data); // 최신 상태 업데이트
    } catch (error) {
      console.error("좋아요 토글 중 오류:", error);
    }
  };

  return (
    <button type="button" onClick={reviewLike}>
      {isLiked ? "❤️ 좋아요 취소" : "🤍 좋아요"}
    </button>
  );
}

export default ReviewLike;
