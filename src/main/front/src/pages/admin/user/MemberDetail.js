import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { HttpHeadersContext } from "../../../context";
import Delete from "../../../components/button/Delete";
import Back from "../../../components/button/Back";

function MemberDetail() {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  useEffect(() => {
    setHeaders({
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    });
  }, [setHeaders]);

  useEffect(() => {
    const fetchMemberDetail = async () => {
      if (!memberId) {
        setLoading(false);
        setError("Member ID is missing.");
        return;
      }

      try {
        const response = await axios.get(`/api/admin/member/${memberId}`, {
          headers,
        });
        setMember(response.data);
      } catch (error) {
        console.error("Error fetching member detail:", error);
        setError(error.message || "Failed to fetch member detail.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetail();
  }, [memberId]);

  if (loading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  if (!member) {
    return <ErrorMessage>Member not found</ErrorMessage>;
  }

  return (
    <Container>
      <DetailContainer>
        <Title>Member Detail</Title>
        <DetailBox>
          <DetailItem>
            <strong>Email:</strong> {member.email}
          </DetailItem>
          <DetailItem>
            <strong>Nickname:</strong> {member.nickName}
          </DetailItem>
          <DetailItem>
            <strong>Name:</strong> {member.name}
          </DetailItem>
          <DetailItem>
            <strong>Phone Number:</strong> {member.phoneNum}
          </DetailItem>
          <DetailItem>
            <strong>Birth:</strong> {member.birth}
          </DetailItem>
        </DetailBox>
      </DetailContainer>
      <BottomBox>
        <Delete />
        <Back />
      </BottomBox>
    </Container>
  );
}
// 스타일 컴포넌트들
const Container = styled.div`
  height: 500px;
`;

// 스타일 컴포넌트들
const DetailContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
`;

const DetailBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DetailItem = styled.div`
  font-size: 18px;
  color: #555;
  strong {
    font-weight: bold;
    color: #333;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 20px;
  color: #888;
  margin-top: 50px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 20px;
  color: red;
  margin-top: 50px;
`;

const BottomBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-bottom: 100px;
`;

export default MemberDetail;
