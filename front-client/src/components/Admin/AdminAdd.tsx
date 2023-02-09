import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminAdd = () => {
  const navigate = useNavigate();
  const [USERNAME, setUSERNAME] = useState();

  const [NickName, setNickName] = useState<any>();
  const [PASSWORD, setPASSWORD] = useState();

  const ChangeNickName = (event: any) => {
    console.log(event.target.value);
    setNickName(event.target.value);
  };
  const ChangePASSWORD = (event: any) => {
    console.log(event.target.value);
    setPASSWORD(event.target.value);
  };

  const ChangeUSERNAME = (event: any) => {
    console.log(event.target.value);
    setUSERNAME(event.target.value);
  };
  return (
    <div className="inline-block align-baseline text-white h-screen w-screen grid grid-cols-5 gap-5">
      <div>
        <div></div>
      </div>
      <form className="col-span-3 grid grid-rows-5 gap-5">
        <div className="text-8xl">AdminPage</div>
        <div className="row-span-3 border-2 border-white grid grid-rows-6 gap-2">
          <div className="text-6xl"> 관리자 추가 </div>

          <div className="grid grid-cols-6 gap-2">
            <div className="text-center pl-5 text-3xl ">NickName :</div>
            <input
              type="text"
              className="col-span-4 bg-black border-2 caret-white"
              placeholder="NickName를 입력하세요"
              onChange={ChangeNickName}
            />
            <div className="flex flex-row m-7">
              <div
                className="right-7 w-[100%] border-white border-2 text-white cursor-pointer"
                onClick={() => {
                  if (NickName.length < 2) {
                    toast.warning(`2글자 이상 입력바랍니다`);
                  } else {
                    axios({
                      method: "post",
                      url: `https://i8e201.p.ssafy.io/api/user/auth/check/nickname`,
                      data: {
                        // changeName: Nickname,
                        // nowName: nowName,
                      },
                    }).then((r) => {
                      const isDouble = r.data.data;
                      if (isDouble) {
                        // toast.success(
                        //   `${nickname}(은)는 수정가능한 닉네임입니다`
                        // );
                        // setModifydisplay(isDouble);
                      } else {
                        // toast.warning(`${nickname}(은)는 중복된 닉네임입니다`);
                        // setModifydisplay(isDouble);
                      }
                    });
                  }
                }}
              >
                중복확인
              </div>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div className="inline-block text-center align-text-bottom pl-5 text-[1.8rem]">
              UserName :
            </div>
            <input
              type="text"
              className="col-span-4 bg-black border-2 caret-white"
              placeholder="USERNAME를 입력하세요"
              onChange={ChangeUSERNAME}
            />
            <div></div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div className="text-center pl-5 text-3xl">PassWord : </div>
            <input
              type="text"
              className="col-span-4 bg-black border-2 caret-white"
              placeholder="PW를 입력하세요"
              onChange={ChangePASSWORD}
            />
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-4"></div>
            <div
              onClick={() => {
                console.log(NickName);
                console.log(PASSWORD);

                axios({
                  method: "post",
                  url: `https://i8e201.p.ssafy.io/api/login`,
                  data: {
                    nickname: NickName,
                    username: USERNAME,
                    password: PASSWORD,
                    // token: localStorage.getItem("accessToken"),
                  },
                }).then((r) => {
                  console.log(r.data);
                  const Info = r.data;
                  if (Info.status === "200") {
                    // console.log(Info.accessToken);
                    localStorage.setItem("accessToken", Info.accessToken);
                    // console.log(Info.refreshToken);
                    localStorage.setItem("refreshToken", Info.refreshToken);
                  } else {
                    toast.warning("로그인실패");
                  }
                });
                // navigate("/adminmain");
              }}
            >
              Login
            </div>
            <div></div>
          </div>
          <div> </div>
        </div>
        <div></div>
      </form>
      <div>
        <div></div>
      </div>
    </div>
  );
};

export default AdminAdd;
