import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import { jwtDecode } from "jwt-decode"; // jwt-decode 라이브러리 import
import header_logo from "../../assets/imgs/logo_w.svg";
import header_menu_stroke from "../../assets/imgs/header_menu.svg";
import myIcon from "../../assets/imgs/header_mypage.svg";
import userIcon from "../../assets/imgs/header_user.svg";
import searchIcon from "../../assets/imgs/header_search.svg";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../../context";

function Header() {
  const navItems = [
    {
      name: "병원 소개",
      path: "/introduce",
      submenu: [
        { path: "/introduce", name: "병원 소개" },
        { path: "/introduce", name: "개요" },
        { path: "/directions", name: "오시는 길" },
        { path: "/department", name: "진료과 소개" },
      ],
    },
    {
      name: "공지사항",
      path: "/notice",
      submenu: [
        { path: "/notice", name: "공지 사항" },
        { path: "/notice", name: "목록" },
      ],
    },
    {
      name: "온라인예약",
      path: "/userreserv",
      submenu: [
        { path: "/userreserv", name: "온라인 예약" },
        { path: "/userreserv", name: "회원 예약" },
        { path: "/nonuserreserve", name: "비회원 예약" },
      ],
    },
    {
      name: "온라인상담",
      path: "/question",
      submenu: [
        { path: "/question", name: "온라인 상담" },
        { path: "/question", name: "목록" },
      ],
    },
    {
      name: "고객 리뷰",
      path: "/review",
      submenu: [
        { path: "/review", name: "고객 리뷰" },
        { path: "/review", name: "목록" },
      ],
    },
  ];

  const [showBox, setShowBox] = useState(true);
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const token = localStorage.getItem("access_token");

  const headerRef = useRef(null); // header 요소를 참조할 ref

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAuth(true); // 토큰이 있으면 로그인 상태로 설정
    } else {
      setAuth(false); // 토큰이 없으면 로그인하지 않은 상태로 설정
    }
  }, [setAuth]);

  let useRole = null;
  if (token) {
    try {
      // 토큰 디코딩
      const decodedToken = jwtDecode(token);
      useRole = decodedToken.roles;
    } catch (e) {
      console.log("토큰 디코딩 오류 : ", e);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShowBox(false);
      } else {
        setShowBox(true);
      }
    };

    const handleMouseEnter = () => {
      setShowBox(true); // 마우스가 화면에 올라오면 메뉴 다시 보이기
    };

    const handleMouseLeave = () => {
      if (window.scrollY > 0) {
        setShowBox(false); // 스크롤을 내리면 메뉴 숨기기
      }
    };

    const headerElement = headerRef.current; // ref를 통해 header 요소를 가져옵니다.

    if (headerElement) {
      headerElement.addEventListener("mouseenter", handleMouseEnter); // header 영역에 마우스가 올라오면 메뉴 보이게 설정
      headerElement.addEventListener("mouseleave", handleMouseLeave); // header 영역에서 마우스가 나가면 메뉴 숨기기
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (headerElement) {
        headerElement.removeEventListener("mouseenter", handleMouseEnter);
        headerElement.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (confirmLogout) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("nick_name");
      localStorage.removeItem("id");
      setAuth(false);
      navigate("/");
    }
  };

  const handleMyPageClick = (e) => {
    if (!auth) {
      e.preventDefault(); // 기본 링크 동작 방지
      alert("로그인이 필요합니다! 로그인 페이지로 이동합니다.");
      navigate("/signIn");
    }
  };

  const handleAdminPageClick = (e) => {
    if (useRole !== "ROLE_ADMIN") {
      e.preventDefault(); // 기본 링크 동작 방지
      alert("관리자만 접근 가능합니다!");
      navigate("/");
    }
  };

  return (
    <HeaderContainer>
      <HeaderSection ref={headerRef}>
        <Logo>
          <Link to="/">
            <img src={header_logo} width="128px" height="36px" alt="logo" />
          </Link>
        </Logo>

        <Navigation>
          <ul>
            <img
              src={header_menu_stroke}
              width="36px"
              height="36px"
              alt="menu"
            />
            {navItems.map((item) => (
              <li key={item.name}>
                <article>
                  <MenuLink to={item.path || "#"}>{item.name}</MenuLink>
                </article>
                {item.submenu && showBox && (
                  <ul>
                    {item.submenu.map((subItem) => (
                      <li key={subItem.name}>
                        <SubLink to={subItem.path}>{subItem.name}</SubLink>
                        <div className="element"></div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Navigation>
        <HederSectionB>
          <LoginBox>
            {useRole === "ROLE_ADMIN" ? (
              <>
                <Link to="/admin/adminuser" onClick={handleAdminPageClick}>
                  <img src={myIcon} alt="관리자페이지" />
                  <LoginButton>관리자</LoginButton>
                </Link>
              </>
            ) : (
              <>
                <Link to="/mypagecheck" onClick={handleMyPageClick}>
                  <img src={myIcon} alt="마이페이지" />
                  <LoginButton>마이페이지</LoginButton>
                </Link>
              </>
            )}

            {auth ? (
              <Link to="/" onClick={handleLogout}>
                <img src={userIcon} />
                <LoginButton>로그아웃</LoginButton>
              </Link>
            ) : (
              <Link to="/signIn">
                <img src={userIcon} />
                <LoginButton>로그인</LoginButton>
              </Link>
            )}
          </LoginBox>
          <SearchBox>
            <input type="search" placeholder="검색어를 입력해주세요."></input>
            <Link to="/">
              <img src={searchIcon} />
            </Link>
          </SearchBox>
        </HederSectionB>
      </HeaderSection>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  display: block;
  width: 100%;
  height: 100px;
  background-color: #0d326f;
`;

const HeaderSection = styled.div`
  //display: flex;
  //align-items: center;
  //justify-content: center;
  //min-width: 1480px;
  //height: 122px;
  display: flex;
  align-items: center;
  justify-content: center;
  //min-width: 1440px;
  height: 100px;
  float: left;
  //margin-left: 120px;
  width: 100%;
  position: fixed;
  z-index: 999999999;
  background-color: #0d326f;
  //backdrop-filter: blur(20px);
`;

const Logo = styled.h1`
  display: flex;
  align-items: center;
  width: 150px;
  height: 100px;
  img {
    margin-left: 5px;
    margin-top: 5px;
  }
`;

//
const Navigation = styled.nav`

   z-index: 99 ;
// width: 820px;
  height: 100px;
  font-weight: 500;
  text-align: center;
  position: relative;
  img {
    position: relative;
    top: -5px;
  }
  ul {
  
  position: relative;
    display: flex;
    list-style: none;
  }
  ul:first-child {
    padding: 40px 50px 20px 20px;

  }
  a{
    font-family: "Noto Sans KR", serif;
  }
  ul li {
    //width: 140px;
    position: relative;
    margin-left: 20px;
    
    &:hover ul {
      display: block;
    }
  }
  ul ul li a{
    margin-right: 20px;
  }
  
  ul ul {
    display: none;
    position: absolute;
    top: 80px;
    left: 0;
    //background: rgb(255, 255, 255);
    width: 100%;
    visibility: hidden;
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    text-align: left;
    padding: 15px 50px 40px 20px;

    //하위메뉴 스타일
    li{
      width: 100px;
      //position: relative;
      margin-bottom: 10px;
      font-size: 14px;
      color: rgb(0, 0, 0);
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      border:none;
      text-align: left;
      float: left;
      
    //border-bottom:1px solid black;
    //text-align: left;
    //right:-15px;
    //position: relative;
    //width: 95px;
    //padding-top:20px;
    }
  }
  li:first-child{
    font-size: 16px;
    font-weight: 700;
  }
  li:hover ul,
  &:hover ul ul {
    display: block;
    visibility: visible;
  }

 //서브메누
 div {
   background-color: #F6F7F8;
      display: none;
      position: fixed;
      height: 180px;
      top: 100px;
      left:0px;
      min-width :100vw;
      width: 100%;
      z-index: -1;
      flex-direction: row;
      padding: 10px;
      box-sizing: border-box;
   
 
    }
    &:hover div {
      display: block;
    }
  }
`;

const MenuLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-size: 16px;
  //lineheight: 16;

  &:hover {
    color: #ffa228;
  }
`;

const SubLink = styled(Link)`
  text-decoration: none;
  color: #111;

  &:hover {
    color: #ffa228;
  }
`;
//네비)오른쪽
const HederSectionB = styled.div`
  //width: 230px;
  //height: 122px;
  //padding: 45px 50px 20px 20px;
  margin-bottom: 25px;

  &:hover {
    color: #ffa228;
  }
`;

const LoginBox = styled.div`
  padding-top: 25px;
  font-size: 12px;
  float: right;
  position: relative;
  color: #fff;
  //lineheight: 16;
  margin-left: 40px;

  a {
    &:hover {
      color: #ffa228;
    }
  }

  a:first-child {
    padding: 16px;
    &:hover {
      color: #ffa228;
    }
  }

  a:nth-child(2) img {
    top: 3px;
    position: relative;
    &:hover {
      color: #ffa228;
    }
  }
`;
// ---------------------------------------------------------------
const LoginButton = styled.button`
  font-family: "Noto Sans KR", serif;
  margin-left: 8px;
  background-color: transparent;
  border: none;
  font-size: 14px;
  cursor: pointer;
  lineheight: 16;
`;

const SearchBox = styled.button`
  //right: 5px;
  top: 20px;
  float: right;
  //width: 190px;
  //height: 25px;
  //background-color: transparent;
  border: none;
  font-size: 12px;
  cursor: pointer;
  position: relative;

  width: 260px;
  height: 30px;
  border-radius: 15px 13px;

  outline: none;
  input {
    //height: 25px;
    //width: 190px;
    //border: none;
    //border-bottom: 1px solid rgba(0,0,0,0.2);
    //padding-bottom: 2px;

    font-size: 13px;
    font-weight: 300;
    border: none;
    background: rgb(255, 255, 255);
    width: 260px;
    height: 30px;
    border-radius: 15px 13px;
    outline: none;
    text-align: end;
  }
  input:focus {
    outline: none;
  }
  img {
    bottom: 5px;
    left: 0px;
    padding-left: 10px;
    position: absolute;
  }
`;

export default Header;
