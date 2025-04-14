import React, { useContext, useEffect, useState } from "react";
import { AuthContext, HttpHeadersContext } from "../../../context";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


function ReservationDetail () {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const [reserveDetail, setReserveDetail] = useState({});
    const {reservationId} = useParams();
    
    
    


    const getReserveDetail = async () => {
        try{
            const response = await axios
            .get(`/api/member/reservation/${reservationId}`, {headers:headers});
            console.log("예약 상세", response);
            setReserveDetail(response.data);
            console.log("예약상세데이터", reserveDetail);

        }catch(error){
            console.log("예약 상세 실패", error);
        }
    };
  useEffect(()=> {
    getReserveDetail();

  }, []);


  

  const deleteReserve = async () => {
    try{
        const response = await axios
        .delete(`/api/member/reservation/${reservationId}`, {headers:headers});
        console.log("예약 삭제 완료");
        if (response.status == 200) {
            alert("예약이 삭제되었습니다.")
            navigate("/rervationcheck")
        }
    }catch (error) {
        console.log("예약 삭제 실패", error);
    }
  };

  if (!reserveDetail || !reserveDetail.createdDate) {
    return <p>로딩 중...</p>;
  }
  const [date] = reserveDetail.createdDate.split("T");

return (
    <Container>
        <DetailTitle>예약 상세 정보</DetailTitle>
        <DetailCard>
            <DetailTable>
                <tbody>
                    <TableRow>
                        <TableHeader>진료과목</TableHeader>
                        <TableData>{reserveDetail.departmentName}</TableData>
                    </TableRow>
                    <TableRow>
                        <TableHeader>예약날짜</TableHeader>
                        <TableData>{reserveDetail.availableDate}</TableData>
                    </TableRow>
                    <TableRow>
                        <TableHeader>예약시간</TableHeader>
                        <TableData>{reserveDetail.slotTime}</TableData>
                    </TableRow>
                    <TableRow>
                        <TableHeader>반려동물 이름</TableHeader>
                        <TableData>{reserveDetail.petName}</TableData>
                    </TableRow>
                    <TableRow>
                        <TableHeader>예약자</TableHeader>
                        <TableData>{reserveDetail.memberName}</TableData>
                    </TableRow>
                    <TableRow>
                        <TableHeader>작성일</TableHeader>
                        <TableData>{date}</TableData>
                    </TableRow>
                </tbody>
            </DetailTable>
        </DetailCard>
        <ButtonBox>
        <DeleteButton onClick={deleteReserve}>예약 삭제</DeleteButton>
        <DeleteButton 
          onClick={() => {
            navigate(`/rervationcheck`);
          }}        
        >
            목록</DeleteButton>
            </ButtonBox>
    </Container>
);
}

const Container = styled.div`
width: 100%;
max-width: 600px;
margin: 50px auto;
display: flex;
flex-direction: column;
align-items: center;
gap: 20px;
`;

const DetailTitle = styled.h1`
 font-size: 42px;
 color: #111;
font-weight: bold;
text-align: center;
margin-bottom: 20px;
`;

const DetailCard = styled.div`
width: 100%;
background: #fff;
border-radius: 10px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
padding: 20px;
`;

const DetailTable = styled.table`
width: 100%;
border-collapse: collapse;
`;

const TableRow = styled.tr`
border-bottom: 1px solid #ddd;
`;

const TableHeader = styled.th`
text-align: left;
padding: 12px;
background: #f5f5f5;
font-size: 14px;
color: #111;
font-weight: bold;
width: 35%;
`;

const TableData = styled.td`
text-align: left;
color: #111;
font-size: 14px;
padding: 12px;
color: #333;
`;

const DeleteButton = styled.button`
background: #111111;
color: white;
border: none;
padding: 12px 20px;
font-size: 16px;
border-radius: 5px;
cursor: pointer;
transition: 0.3s;

&:hover {
    background: #cc0000;
}
`;

const LoadingBox = styled.div`
    width: 100%
    text-align: center;
    font-size: 20px;
    color: #111;
    
`
const ButtonBox = styled.p`
    display: flex;
    gap:20px;
`

export default ReservationDetail;