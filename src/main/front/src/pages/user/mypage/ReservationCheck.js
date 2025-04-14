import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import CustomPagination from "../../../components/common/CustomPagination";
import { AuthContext, HttpHeadersContext } from "../../../context";
import { Link, useNavigate } from "react-router-dom";

function ReservationCheck() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const [reserveList, setReserveList] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [totalCnt, setTotalCnt] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setHeaders({
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        });

        if (!auth) {
            alert("로그인한 사용자만 조회할 수 있습니다!");
            navigate(-1);
        }
    }, []);

    const getReserveList = async () => {
        try {
            const response = await axios.get("/api/member/reservation", {
                params: { page: page - 1 },
                headers: headers,
            });
            console.log("예약 리스트", response.data);
            setReserveList(response.data.content);
            setPageSize(response.data.pageSize || 8);
            setTotalCnt(response.data.totalElements);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("예약 리스트 불러오기 실패", error);
 // 에러 발생 시 더미 데이터 사용
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getReserveList();
    }, [page]);



    return (
        <ReservCheckContainer>
            <DetailTitle>내 예약 목록</DetailTitle>
            <ReservCheckTableBox>
                <ReservCheckTable>
                    <thead>
                        <TableRow>
                            <TableHeader>예약번호</TableHeader>
                            <TableHeader>닉네임</TableHeader>
                            <TableHeader>날짜</TableHeader>
                            <TableHeader>시간</TableHeader>
                        </TableRow>
                    </thead>
                    <tbody>
                        {loading ? (
                            <TableRow>
                                <TableData colSpan="4">로딩 중...</TableData>
                            </TableRow>
                        ) : reserveList.length > 0 ? (
                            reserveList.map((reservation) => {
                                const [date, time] = reservation.reservationDateTime.split("T");
                                return (
                                    <TableRow 
                                    key={reservation.id}
                                    onClick={() => navigate(`/reserveationdetail/${reservation.id}`)}
                                    >
                                        <TableData>{reservation.id}</TableData>
                                        <TableData>
                                                {reservation.nickName}
                                        </TableData>
                                        <TableData>{date}</TableData>
                                        <TableData>{time.slice(0, 5)}</TableData>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableData colSpan="4">예약된 일정이 없습니다.</TableData>
                            </TableRow>
                        )}
                    </tbody>
                </ReservCheckTable>
            </ReservCheckTableBox>

            <PaginationBox>
                <CustomPagination
                    page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    totalCnt={totalCnt}
                    totalPages={totalPages}
                />
            </PaginationBox>
        </ReservCheckContainer>
    );
}

const ReservCheckContainer = styled.div`
    width: 100%;
    max-width: 900px;
    padding: 20px;
    margin: 40px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const DetailTitle = styled.h2`
    font-size: 42px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
`;

const ReservCheckTableBox = styled.div`
    width: 100%;
    overflow-x: auto;
`;

const ReservCheckTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
`;

const TableRow = styled.tr`
  background-color: #f4f4f4;
`;

const TableHeader = styled.th`
    background-color: #111111;
    color: white;
    font-size: 16px;
    padding: 12px;
    text-align: center;
    border: 1px solid #ddd;
`;

const TableData = styled.td`
    padding: 12px;
    text-align: center;
    border: 1px solid #ddd;
    font-size: 14px;
     cursor: pointer;
`;



const PaginationBox = styled.div`
    margin-top: 20px;
    padding: 10px;
    display: flex;
    justify-content: center;
`;

export default ReservationCheck;
