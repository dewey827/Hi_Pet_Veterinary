import styled from "styled-components";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import React, { useContext, useState } from "react";
import { HttpHeadersContext } from "../../context";

function UpdateGo() {
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const { noticeId, questionId, reviewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [notice, setNotice] = useState(null);
  const [question, setQuestion] = useState(null);
  const [review, setReview] = useState(null);

  const getBbsDetail = async () => {
    try {
      const response = await axios.get(`/api/notice/${noticeId}`);
      return response.data;
    } catch (error) {
      console.error("getBbsDetail() error:", error);
      return null;
    }
  };

  const getQuestionDetail = async () => {
    try {
      const response = await axios.get(`/api/member/question/${questionId}`, { headers });
      return response.data;
    } catch (error) {
      console.error("getQuestionDetail() error:", error);
      return null;
    }
  };

  const getReviewDetail = async () => {
    try {
      const response = await axios.get(`/api/review/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error("getReviewDetail() error:", error);
      return null;
    }
  };

  const handleEditClick = async () => {
    setHeaders({
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    });

    const isAdmin = location.pathname.includes("/admin");

    let data = null;
    let path = "";

    if (questionId) {
      data = await getQuestionDetail();
      path = `${isAdmin ? "/admin" : ""}/question/${questionId}/update`;
    } else if (reviewId) {
      data = await getReviewDetail();
      path = `${isAdmin ? "/admin" : ""}/review/${reviewId}/update`;
    } else if (noticeId) {
      data = await getBbsDetail();
      path = `${isAdmin ? "/admin" : ""}/notice/${noticeId}/update`;
    }

    if (data) {
      navigate(path, { state: { bbs: data } });
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
  background-color: #000;
  color: white;
  margin-bottom: 50px;

  &:hover {
    background-color: #333;
  }
`;

export default UpdateGo;
