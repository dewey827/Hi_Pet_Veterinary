import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HttpHeadersContext } from "../../context";
import Update from "../../components/button/Update";
import Back from "../../components/button/Back";

function NoticeUpdate() {
  const location = useLocation();
  const { bbs } = location.state || {};
  console.log(bbs);
  const navigate = useNavigate();
  const [title, setTitle] = useState(bbs?.title || "");
  const [content, setContent] = useState(bbs?.content || "");
  const [files, setFiles] = useState([]); // 새로 추가할 파일
  const [existingFiles, setExistingFiles] = useState([]); // 기존 업로드된 파일
  const [pageNumber] = useState(1);
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const noticeId = bbs?.id;


  useEffect(() => {
    if (!noticeId) return;

    setHeaders({
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    });

    getBbsDetail();
  }, [noticeId]);

  // 기존 게시글 정보 가져오기 (파일 포함)
  const getBbsDetail = async () => {
    try {
      const response = await axios.get(`/api/notice/${noticeId}`);
      setTitle(response.data.title);
      setContent(response.data.content);

      if (Array.isArray(response.data.noticeFiles)) {
        setExistingFiles(response.data.noticeFiles);
      } else {
        setExistingFiles([]);
      }
    } catch (error) {
      console.log("[NoticeUpdate.js] getBbsDetail() error :<", error);
    }
  };

  // 제목 변경
  const changeTitle = (event) => {
    setTitle(event.target.value);
  };

  // 내용 변경
  const changeContent = (event) => {
    setContent(event.target.value);
  };

  // 새 파일 추가
  const handleChangeFile = (event) => {
    const selectedFiles = Array.from(event.target.files).slice(0, 5);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  // 기존 파일 삭제
  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(
        `/api/admin/notice/${noticeId}/file/delete?fileId=${fileId}`,
        {
          params: { fileId }, // @RequestParam 방식으로 변경
          headers,
        }
      );
      setExistingFiles(existingFiles.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("파일 삭제 오류:", error);
    }
  };

  /* 파일 업로드 */
  const fileUpload = async (noticeId) => {
    const fd = new FormData();
    files.forEach((file) => fd.append("file", file)); // 파일 추가

    try {
      const response = await axios.post(
        `/api/admin/notice/${noticeId}/file`,
        fd,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data", // 파일 전송 시 Content-Type 설정
          },
        }
      );
      console.log("[file.js] fileUpload() success :D", response.data);
      alert("파일 업로드 성공 :D");
    } catch (err) {
      console.log("[FileData.js] fileUpload() error :<", err);
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <TableBox>
          <Table>
            <tbody>
              <tr>
                <td>
                  <TableTitle
                    type="text"
                    value={title}
                    onChange={changeTitle}
                  />
                </td>
              </tr>
              
              <tr>
                <td>
                  <TableContent value={content} onChange={changeContent} />
                </td>
              </tr>
            </tbody>
          </Table>
        </TableBox>
        <UploadWrapper>
                <FileInputWrapper>
                  {/* 기존 파일 목록 표시 (삭제 가능) */}
                  {existingFiles.length > 0 && (
                    <div>
                      {existingFiles.map((file) => (
                        <div
                          key={file.id}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <span>
                            {file.originFileName} {file.name}
                          </span>
                          <button onClick={() => handleDeleteFile(file.id)}>
                            삭제
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 새로 추가된 파일 목록 */}
                  {files.length > 0 && (
                    <div>
                      {files.map((file, index) => (
                        <div
                          key={index}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 새 파일 추가 */}
                  {files.length < 5 && (
                    <div>
                      <InputFile
                        type="file"
                        name="file"
                        onChange={handleChangeFile}
                        multiple
                      />
                    </div>
                  )}
                </FileInputWrapper>
              </UploadWrapper>
        <BottomBox>
          <Update
            noticeId={noticeId}
            navigate={navigate}
            title={title}
            content={content}
            fileUpload={fileUpload} // 파일 업로드 함수 전달
          />
          <Back pageNumber={pageNumber} itemId={noticeId} />
        </BottomBox>
      </ContentWrapper>
    </Container>
  );
}

//  컨테이너
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
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

//  테이블 박스
const TableBox = styled.div`
  width: 100%;
  margin-top: 20px;
`;

// 테이블
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

//  입력 필드
const TableTitle = styled.input`
  width: 100%;
  height: 40px;
  padding: 5px;
  border: none;
  border-bottom: 1px solid #111111;
  font-size: 20px;
  font-weight: medium;
  font-family: "Noto Sans KR", serif;
  margin-bottom: 30px;

  outline: none;
`;

const TableContent = styled.textarea`
  width: 100%;
  min-height: 400px;
  padding: 5px;
  border: none;
  font-size: 16px;
  font-weight: 300;
  font-family: "Noto Sans KR", serif;
  border: none;
  border-bottom: 1px solid #111111;
  outline: none;
  resize: none;
  overflow-x: hidden;
`;

//  하단 버튼 박스
const BottomBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 20px;
  margin-bottom: 100px;
`;
const UploadWrapper = styled.div`
  margin-bottom: 10px;
  width: 1000px;
`;

const InputFile = styled.input`
  width: 270px;
  font-size: 16px;
  color: #111111;
  cursor: pointer;
  position: relative;
  padding: 10px 20px;
  border: 1px solid #111111;
  border-radius: 5px;
  background-color: white;
  transition: background-color 0.3s ease;
  left: 300px;
  &:hover {
    background-color: #f0f8f0;
  }
`;

const FileInputWrapper = styled.div`
  border: 2px solid #ccc;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 600px;
  width: 100%;
  height: auto;
  min-height: 60px;

  button {
    padding-left: 40px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }
`;

export default NoticeUpdate;
