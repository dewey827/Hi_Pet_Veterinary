import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const AnimalProfile = ({ petData, onPetDataChange }) => {
  const [inputValue, setInputValue] = useState([]);

  useEffect(() => {
    if (petData && Array.isArray(petData)) {
      setInputValue(
        petData.map((pet) => ({
          id: pet.id,
          name: pet.name || "",
          breed: pet.species || "DOG", // 기본값 DOG
          age: pet.age || "",
        }))
      );
    }
    console.log(petData);
  }, [petData]);

  const addContent = () => {
    setInputValue([...inputValue, { name: "", species: "DOG", age: "" }]);
  };

  const deleteContent = (index) => {
    setInputValue((prevInputValue) => {
      const deletedItem = prevInputValue[index]; // 삭제될 항목 저장
      const updatedValues = prevInputValue.filter((_, i) => i !== index); // 새로운 리스트 생성
  
      console.log("삭제된 반려동물 정보:", deletedItem);
      console.log("업데이트된 반려동물 리스트:", updatedValues);
  
      onPetDataChange(updatedValues);
      return updatedValues;
    });
  };
  

  const handleInputChange = (e, index, key) => {
    const newInputValue = [...inputValue];
    newInputValue[index][key] = e.target.value;
    setInputValue(newInputValue);
    onPetDataChange(newInputValue);
  };

  return (
    <AnimalProfileContainer>
      <AddButton onClick={addContent}>+ 반려동물 추가</AddButton>

      {inputValue.map((item, index) => (
        <AnimalTableWrapper key={index}>
          <DeleteButton onClick={() => deleteContent(index)}>삭제</DeleteButton>
          <AnimalTable>
            <tbody>
              {[{ key: "name", label: "이름" }, { key: "breed", label: "종류" }, { key: "age", label: "나이" }].map(({ key, label }, i) => (
                <TableRow key={i}>
                  <TableHead>{label}</TableHead>
                  <TableData>
                    {key === "breed" ? (
                      <Select value={item[key]} onChange={(e) => handleInputChange(e, index, key)}>
                        <option value="DOG">DOG</option>
                        <option value="CAT">CAT</option>
                      </Select>
                    ) : (
                      <Input type="text" value={item[key]} onChange={(e) => handleInputChange(e, index, key)} />
                    )}
                  </TableData>
                </TableRow>
              ))}
            </tbody>
          </AnimalTable>
        </AnimalTableWrapper>
      ))}
    </AnimalProfileContainer>
  );
};

const AnimalProfileContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-family: "Noto Sans KR", serif;
`;

const AddButton = styled.button`
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #111111;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 20px;
  font-family: "Noto Sans KR", serif;
  margin-bottom: 15px;

  &:hover {
    background-color: #111111;
  }
`;

const AnimalTableWrapper = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  font-family: "Noto Sans KR", serif;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: darkred;
  }
`;

const AnimalTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  background-color: #fff;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #ff;
  }
`;

const TableHead = styled.th`
  background: #f2f2f2;
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  width: 30%;
  font-size: 16px;
  font-weight: medium;
`;

const TableData = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
`;

const Input = styled.input`
  width: 100%;
  max-width: 440px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
`;

const Select = styled.select`
  width: 100%;
  max-width: 440px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  background-color: white;
`;

export default AnimalProfile;
