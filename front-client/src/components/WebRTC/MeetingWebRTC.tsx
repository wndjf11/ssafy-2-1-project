import axios from "axios";
import React from "react";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  balanceChange,
  balanceQuestionChange,
  changeNavAlarmReviewEmojiUserData,
  isRomanNormalChange,
  isRtcLoading,
  selectGame,
  showGameSelectModal,
  showPublicModal,
  showRoomUserProfile,
  showRouletteResultModal,
} from "../../store/store";
import Loading from "../Common/Loading";
import RoomUserProfile from "../Common/RoomUserProfile";
import Balance from "../Games/Balance/Balance";
import CallIntro from "../Games/CallMyName/CallIntro";
import GameSelect from "../Games/GameSelect/GameSelect";
import LadderIntro from "../Games/Ladder/LadderIntro";
import LiarIntro from "../Games/Liar/LiarIntro";
import Roulette from "../Games/Roulette/Roulette";
import SonIntro from "../Games/Son/SonIntro";
import TwentyIntro from "../Games/Twenty/TwentyIntro";

const WebRTC = ({
  pochaId,
  socket,
  propIsHost,
  pochaInfo,
  getPochaInfo,
}: {
  pochaId: string;
  socket: any;
  propIsHost: Function;
  pochaInfo: any;
  getPochaInfo: Function;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let accessToken = localStorage.getItem("accessToken");
  const myUserName = localStorage.getItem("Username");
  // webRTC관련
  // const socket = io("https://pocha.online");
  // 나의 비디오 ref
  const myFace = useRef<HTMLVideoElement>(null);
  const myIntroduce = useRef<HTMLDivElement>(null);
  const myHeart = useRef<HTMLDivElement>(null);
  // 음소거 버튼
  const muteBtn = useRef<HTMLButtonElement>(null);
  // 카메라 온오프 버튼
  const cameraBtn = useRef<HTMLButtonElement>(null);
  // 카메라 선택 버튼
  const cameraSelect = useRef<HTMLSelectElement>(null);
  // 옵션 태그 리스트
  const [optionList, setOptionList] = useState<any[]>([]);
  // 하트 시그널 정보
  const [heartInfo, setHeartInfo] = useState<any>({
    // myHeart: 0,
    // peerHeart1: 0,
    // peerHeart2: 0,
    // peerHeart3: 0,
    // peerHeart4: 0,
    // peerHeart5: 0,
  });
  // 짠 카운트
  const [count, setCount] = useState<string>("");

  const [peerUser, setPeerUser] = useState<any>({
    my: myUserName,
  });
  // 자기소개 정보
  const [introduceInfo, setIntroduceInfo] = useState<any>({});

  //비디오 시작
  const [videoOnTime, setVideoOnTime] = useState<any>(null);

  // 비디오 Ref
  const peerFace1 = useRef<any>(null);
  const peerFace2 = useRef<any>(null);
  const peerFace3 = useRef<any>(null);
  const peerFace4 = useRef<any>(null);
  const peerFace5 = useRef<any>(null);

  // 하트 Ref
  const peerHeart1 = useRef<any>(null);
  const peerHeart2 = useRef<any>(null);
  const peerHeart3 = useRef<any>(null);
  const peerHeart4 = useRef<any>(null);
  const peerHeart5 = useRef<any>(null);

  // 자기소개 Ref
  const peerIntroduce1 = useRef<HTMLDivElement>(null);
  const peerIntroduce2 = useRef<HTMLDivElement>(null);
  const peerIntroduce3 = useRef<HTMLDivElement>(null);
  const peerIntroduce4 = useRef<HTMLDivElement>(null);
  const peerIntroduce5 = useRef<HTMLDivElement>(null);

  // 비디오 자르기용 Ref
  const div1 = useRef<HTMLDivElement>(null);
  const div2 = useRef<HTMLDivElement>(null);
  const div3 = useRef<HTMLDivElement>(null);
  const div4 = useRef<HTMLDivElement>(null);
  const div5 = useRef<HTMLDivElement>(null);
  const div6 = useRef<HTMLDivElement>(null);

  const myStream = useRef<any>(null);

  // let myStream: any;
  const roomName: any = pochaId;
  const myPeerConnections = useRef<any>({});
  // let myPeerConnections: any = {};
  // const [userCount, setUserCount] = useState<number>(1);
  const userCount = useRef<number>(1);

  // 방장 체크
  const [isHost, setIsHost] = useState<boolean>(false);

  // webRTC Loading 상태 가져옴
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 유저들 프로파일 모달 상태 가져옴
  const isRoomUserProfile = useAppSelector((state) => {
    return state.RoomUserProfileClickCheck;
  });

  // 요청한 유저프로필 데이터
  const [userProfileData, setUserProfileData] = useState(null);

  // 요청한 포차참여 유저들 데이터
  const [pochaUsers, setPochaUsers] = useState<any>(null);

  // 비디오, 자기소개 보여주기
  async function videoOn(videoElement: any, introduceElement: any) {
    let time = new Date(pochaInfo.createAt);
    time.setHours(time.getHours() + 9);
    time.setSeconds(time.getSeconds() + 60);
    const waitEnd = time.getTime();

    const now = new Date().getTime();

    if (waitEnd <= now) {
      videoElement.current!.style.display = "block";
      introduceElement.current!.style.display = "none";
    } else {
      videoElement.current!.style.display = "none";
      introduceElement.current!.style.display = "block";
      setTimeout(() => {
        videoElement.current!.style.display = "block";
        introduceElement.current!.style.display = "none";
      }, waitEnd - now);
    }
  }

  // 포차 참여유저 데이터 axios 요청
  async function getUsersProfile() {
    console.log(pochaId);
    try {
      const {
        data: { data },
      } = await axios({
        url: `https://i8e201.p.ssafy.io/api/pocha/participant/${pochaId}`,
        headers: {
          accessToken: `${accessToken}`,
        },
      });
      console.log("참여 유저들 데이터?", data);
      // 방장 여부 체크
      data.forEach((user: any) => {
        if (user.username === myUserName) {
          setIsHost(user.isHost);
          propIsHost(user.isHost);
        }
      });
      setPochaUsers(data);
      dispatch(isRtcLoading(false));
      handleWelcomeSubmit(
        data.filter((entity: any) => entity.username === myUserName)[0]
      );
    } catch (error) {
      console.log("포차 참여유저 데이터 axios error", error);
    }
  }

  // 카메라 뮤트
  let muted = false;
  // 카메라 오프
  let cameraOff = false;
  // let userCount = 1;

  // 최초실행
  useEffect(() => {
    //propSocket(socket);
    setIsLoading(false);
    getUsersProfile();
    setVideoOnTime(() => {
      let waitEnd = new Date(pochaInfo.createAt);
      waitEnd.setHours(waitEnd.getHours() + 9);
      waitEnd.setSeconds(waitEnd.getSeconds() + 20);

      return waitEnd.getTime();
    });
  }, []);

  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");
      // const currentCamera = myStream.getVideoTracks()[0];
      cameras.forEach((camera, index) => {
        // const option = React.createElement("option", 	{
        //   value = camera.deviceId,
        // },);
        // console.log('라벨',camera.label)
        const option: JSX.Element = (
          <option key={index} value={camera.deviceId}>
            {camera.label}
          </option>
        );
        // option.value = camera.deviceId;
        // option.innerText = camera.label;
        // if (currentCamera.id === camera.deviceId) {
        //   option.selected = true;
        // }
        // cameraSelect.current?.appendChild(option);
        setOptionList((prev) => [...prev, option]);
      });
    } catch (e) {
      console.log("0", e);
    }
  };

  async function getMedia(deviceId?: string) {
    let myStreamData;
    const initialConstraing = {
      audio: true,
      video: { facingMode: "user" },
    };
    const cameraConstraing: any = {
      audio: true,
      video: { deviceid: { exact: deviceId } },
    };
    try {
      if (deviceId) {
        myStreamData = await navigator.mediaDevices.getUserMedia(
          cameraConstraing
        );
        myStream.current = myStreamData;
        // setMyStream(myStreamData);
        // myStream = await navigator.mediaDevices.getUserMedia(cameraConstraing);
      } else {
        myStreamData = await navigator.mediaDevices.getUserMedia(
          initialConstraing
        );
        myStream.current = myStreamData;
        // setMyStream(myStreamData);
        // myStream = await navigator.mediaDevices.getUserMedia(initialConstraing);
      }
      console.log("마이스트림 오냐?", myStream.current);
      myFace.current!.srcObject = myStream.current;
      myFace.current!.volume = 0;
      myHeart.current?.setAttribute(
        "value",
        myUserName == null ? "" : myUserName
      );
      videoOn(myFace, myIntroduce);
      if (!deviceId) {
        await getCameras();
      }
    } catch (e) {
      console.log("마이스트림 에러", e);
    }
  }

  // 소리 끄는 함수
  function handleMuteClick() {
    myStream.current
      .getAudioTracks()
      .forEach((track: any) => (track.enabled = !track.enabled));
    if (!muted) {
      muteBtn.current!.innerText = "🔈";
    } else {
      muteBtn.current!.innerText = "🔊";
    }
    muted = !muted;
  }

  // 카메라 끄는 함수
  function handleCameraClick() {
    // console.log("꺼지냐", myStream)
    myStream.current
      .getVideoTracks()
      .forEach((track: any) => (track.enabled = !track.enabled));
    if (!cameraOff) {
      cameraBtn.current!.innerText = "Camera On";
    } else {
      cameraBtn.current!.innerText = "Camera Off";
    }
    cameraOff = !cameraOff;
  }

  // 카메라 바꿀때 옵션 변경했으니 getMedia 다시실행해준다(이제는 특정카메라id도 담아서 실행)
  async function handleCameraChange() {
    await getMedia(cameraSelect.current!.value);
    // 카메라 옵션 변경시 업데이트 코드
    myPeerConnections.current.forEach((myPeerConnection: any) => {
      if (myPeerConnection) {
        const videoTrack = myStream.current.getVideoTracks()[0];
        const videoSender = myPeerConnection
          .getSenders()
          .find((sender: any) => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);
      }
    });
  }

  async function handleWelcomeSubmit(userData: any) {
    // event : React.FormEvent<HTMLFormElement>
    // event.preventDefault();
    await getMedia();
    console.log("@@@@@@@@@@@@@@@@", userData);
    setHeartInfo((hearts: any) => {
      hearts[peerUser.my] = 0;
      return { ...hearts };
    });
    setIntroduceInfo((prev: any) => {
      const locaIntroduce = localStorage.getItem("myIntroduce");
      const introduce = locaIntroduce ? locaIntroduce : "[]";
      prev[peerUser.my] = JSON.parse(introduce);
      return { ...prev };
    });
    socket.emit("join_room", {
      roomName,
      username: userData.username,
      nickname: userData.nickname,
      introduce: localStorage.getItem("myIntroduce"),
    });
    // roomName = welcomeInput.current?.value;
    // welcomeInput.current!.value = "";
  }

  // welcomeForm.addEventListener("submit", handleWelcomeSubmit);

  // ------ Socket Code ------
  // Socket Code
  useEffect(() => {
    socket.on("users_of_room", async (users: any) => {
      console.log("--------------------");
      await users.forEach((user: any) => {
        console.log(user);
        myPeerConnections.current[user.id] = {
          username: user.username,
          nickname: user.nickname,
        };
        console.log(
          "방 입장--------------",
          myPeerConnections.current[user.id]
        );
      });
    });

    socket.on("welcome", async (socketId: any, user: any) => {
      let myPeer = makeConnection();

      myPeerConnections.current[socketId] = {
        peer: myPeer,
        username: user.username,
        nickname: user.nickname,
      };
      myPeerConnections.current[socketId].introduce = JSON.parse(
        user.introduce
      );

      console.log(
        "환영!!!!----------------------------",
        myPeerConnections.current[socketId]
      );

      const offer = await myPeerConnections.current[socketId][
        "peer"
      ].createOffer();
      myPeerConnections.current[socketId]["peer"].setLocalDescription(offer);

      const receivers =
        myPeerConnections.current[socketId]["peer"].getReceivers();
      const peerStream = new MediaStream([
        receivers[0].track,
        receivers[1].track,
      ]);
      handleAddStream(
        peerStream,
        myPeerConnections.current[socketId].username,
        myPeerConnections.current[socketId].nickname,
        myPeerConnections.current[socketId].introduce
      );
      console.log("sent the offer");

      socket.emit("offer", offer, socketId, roomName, {
        username: user.username,
        nickname: user.nickname,
        introduce: localStorage.getItem("myIntroduce"),
      });
    });

    socket.on("offer", async (offer: any, socketId: any, userInfo: any) => {
      console.log("received the offer");
      myPeerConnections.current[socketId]["introduce"] = JSON.parse(
        userInfo.introduce
      );
      myPeerConnections.current[socketId]["peer"] = makeConnection();
      myPeerConnections.current[socketId]["peer"].setRemoteDescription(offer);
      const answer = await myPeerConnections.current[socketId][
        "peer"
      ].createAnswer();

      myPeerConnections.current[socketId]["peer"].setLocalDescription(answer);
      const receivers =
        myPeerConnections.current[socketId]["peer"].getReceivers();
      const peerStream = new MediaStream([
        receivers[0].track,
        receivers[1].track,
      ]);
      handleAddStream(
        peerStream,
        myPeerConnections.current[socketId].username,
        myPeerConnections.current[socketId].nickname,
        myPeerConnections.current[socketId].introduce
      );

      socket.emit("answer", answer, socketId, roomName);
      console.log("sent the answer");
    });

    socket.on("answer", (answer: any, socketId: any) => {
      console.log("received the answer");
      myPeerConnections.current[socketId]["peer"].setRemoteDescription(answer);
    });

    socket.on("ice", (ice: any, socketId: any) => {
      console.log("received the candidate");
      if (
        myPeerConnections.current[socketId]["peer"] === null ||
        myPeerConnections.current[socketId]["peer"] === undefined
      ) {
        return;
      }
      myPeerConnections.current[socketId]["peer"].addIceCandidate(ice);
    });

    socket.on("user_exit", ({ id }: any) => {
      const deleteUsername = myPeerConnections.current[id].username;
      setHeartInfo((prev: any) => {
        delete prev[deleteUsername];
        return { ...prev };
      });
      setPeerUser({ my: myUserName });

      delete myPeerConnections.current[id];
      // 사람수 - 2 해야 마지막인덱스값
      // const lastIndex = userCount.current - 2;
      // const lastIndex = userCount - 2
      // peerFace.current[lastIndex].classList.toggle("hidden");

      console.log("==============>방 탈출!!!");
      console.log(id);

      // userCount = 1;
      // setUserCount(1);
      userCount.current = 1;
      // setUserCount(1);

      const keys = Object.keys(myPeerConnections.current);
      for (let socketID of keys) {
        console.log("---------");
        console.log(myPeerConnections.current[socketID]);
        // console.log(myPeerConnections.current[socketID].getReceivers());
        console.log("---------");
        const receivers =
          myPeerConnections.current[socketID]["peer"].getReceivers();
        const peerStream = new MediaStream([
          receivers[0].track,
          receivers[1].track,
        ]);
        handleAddStream(
          peerStream,
          myPeerConnections.current[socketID].username,
          myPeerConnections.current[socketID].nickname,
          myPeerConnections.current[socketID].introduce
        );
      }

      console.log(userCount + "==================");
      let temp = userCount.current;
      // let temp = userCount;
      if (temp < 6) {
        while (temp < 6) {
          // peerFace.current[temp - 1].srcObject = null;
          // if (temp === 1) {
          //   peerFace.current[0].srcObject = null;
          // } else if (temp === 2) {
          //   peerFace.current[1].srcObject = null;
          // } else if (temp === 3) {
          //   peerFace.current[2].srcObject = null;
          // }
          if (temp === 1) {
            peerFace1.current.srcObject = null;
            peerHeart1.current.style.display = "none";
          } else if (temp === 2) {
            peerFace2.current.srcObject = null;
            peerHeart2.current.style.display = "none";
          } else if (temp === 3) {
            peerFace3.current.srcObject = null;
            peerHeart3.current.style.display = "none";
          } else if (temp === 4) {
            peerFace4.current.srcObject = null;
            peerHeart4.current.style.display = "none";
          } else if (temp === 5) {
            peerFace5.current.srcObject = null;
            peerHeart5.current.style.display = "none";
          }
          temp += 1;
        }
      }
    });

    socket.on("room_full", () => {
      toast.info("인원이 가득찬 포차입니다");
      navigate(`/main`);
    });

    return () => {
      socket.off("welcome");
      socket.off("users_of_room");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice");
      socket.off("user_exit");
      socket.off("room_full");
    };
  }, []);

  // ------------ 포차 기능 code --------------
  const [jjanImg, setJjanImg] = useState<any>(
    require("src/assets/theme/jjan1.png")
  );
  //  axios
  // const api = axios.create({
  //   baseURL: "https://i8e201.p.ssafy.io/api",
  //   headers: {
  //     "Content-Type": "application/json;charset=utf-8",
  //   },
  // });

  //  포차 짠 함수
  const jjan = () => {
    let time: number = 3;
    setCount(String(time));
    setJjanImg(require("src/assets/theme/jjan1.png"));
    const interval = setInterval(() => {
      time -= 1;
      setCount(String(time));
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setJjanImg(require("src/assets/theme/jjan2.png"));
      setCount("짠!!!!");
    }, 3000);
    setTimeout(() => {
      setCount("");
      dispatch(showPublicModal(false));
    }, 4000);
  };

  useEffect(() => {
    // 포차 설정 변경! : 방 설정 다시 불러오기.
    socket.on("pocha_change", async () => {
      console.log("포차 설정 변경!----------------------");
      // 방 설정 다시 불러오기!!! 테스트
      getPochaInfo();
      toast.success("포차 설정이 변경되었습니다");
      // await pocha_config_update("3");
    });

    // 포차 시간 연장! : 방 설정 다시 불러오기.
    socket.on("pocha_extension", async () => {
      console.log("포차 시간 연장!----------------------");
      // 방 설정 다시 불러오기!!! 테스트
      // await pocha_config_update("3");
    });

    // 하트 시그널 신호! : 하트 시그널 증가!!
    socket.on("add_heart", (targetUser: any) => {
      setHeartInfo((prev: any) => {
        prev[targetUser] = prev[targetUser] + 1;
        return { ...prev };
      });
    });

    // 포차 짠! 기능 : 방 설정 다시 불러오기.
    socket.on("pocha_cheers", async () => {
      console.log("포차 짠!!!!!------------ㅇ----------");
      jjan();
    });

    // 포차 강퇴 기능 : 이름찾아서 내보내기
    socket.on("ban", (username: any) => {
      console.log(username, "강퇴!!!!-------");
      if (myUserName === username) {
        localStorage.setItem("reloadBan", "true");
        navigate(`/main`);
        window.location.reload();
      }
    });

    return () => {
      socket.off("pocha_change");
      socket.off("pocha_extension");
      socket.off("add_heart");
    };
  }, []);

  // ------------- RTC Code --------------
  function makeConnection() {
    let myPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ],
    });
    myPeerConnection.addEventListener("icecandidate", handleIce);
    //myPeerConnection.addEventListener("addstream", handleAddStream);
    myStream.current.getTracks().forEach((track: any) => {
      myPeerConnection.addTrack(track, myStream.current);
    });
    return myPeerConnection;
  }

  // icecandidate 이벤트시 실행 함수
  function handleIce(data: any) {
    console.log("sent candidate");
    // icecandidate를 만들면 이걸 또 서버로 보내줌
    socket.emit("ice", data.candidate, roomName);
  }

  // addStream 이벤트시 실행 함수
  function handleAddStream(
    stream: any,
    username: string,
    nickname: string,
    introduce: any
  ) {
    console.log("handleAddStream---------------------");

    console.log("사람수ㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜ", userCount.current);

    setHeartInfo((hearts: any) => {
      hearts[username] = hearts[username] ? hearts[username] : 0;
      return { ...hearts };
    });
    setIntroduceInfo((prev: any) => {
      prev[username] = prev[username] ? prev[username] : introduce;
      return { ...prev };
    });

    if (userCount.current === 1) {
      div3.current!.classList.add("hidden");
      peerFace2.current!.classList.add("hidden");
      peerFace1.current.srcObject = stream;
      peerFace1.current.id = username;
      setPeerUser((prev: any) => {
        return { ...prev, peer1: username };
      });
      peerHeart1.current.setAttribute("value", username);
      peerHeart1.current.style.display = "block";
      videoOn(peerFace1, peerIntroduce1);
    } else if (userCount.current === 2) {
      div3.current!.classList.remove("hidden");
      peerFace2.current!.classList.remove("hidden");
      div4.current!.classList.add("hidden");
      peerFace3.current!.classList.add("hidden");
      peerFace2.current.srcObject = stream;
      peerFace2.current.id = username;
      setPeerUser((prev: any) => {
        return { ...prev, peer2: username };
      });
      peerHeart2.current.setAttribute("value", username);
      peerHeart2.current.style.display = "block";
      videoOn(peerFace2, peerIntroduce2);
    } else if (userCount.current === 3) {
      div4.current!.classList.remove("hidden");
      peerFace3.current!.classList.remove("hidden");
      div5.current!.classList.add("hidden");
      peerFace4.current!.classList.add("hidden");
      peerFace3.current.srcObject = stream;
      peerFace3.current.id = username;
      setPeerUser((prev: any) => {
        return { ...prev, peer3: username };
      });
      peerHeart3.current.setAttribute("value", username);
      peerHeart3.current.style.display = "block";
      videoOn(peerFace3, peerIntroduce3);
    } else if (userCount.current === 4) {
      div5.current!.classList.remove("hidden");
      peerFace4.current!.classList.remove("hidden");
      div6.current!.classList.add("hidden");
      peerFace5.current!.classList.add("hidden");
      peerFace4.current.srcObject = stream;
      peerFace4.current.id = username;
      setPeerUser((prev: any) => {
        return { ...prev, peer4: username };
      });
      peerHeart4.current.setAttribute("value", username);
      peerHeart4.current.style.display = "block";
      videoOn(peerFace4, peerIntroduce4);
    } else if (userCount.current === 5) {
      div6.current!.classList.remove("hidden");
      peerFace5.current!.classList.remove("hidden");
      peerFace5.current.srcObject = stream;
      peerFace5.current.id = username;
      setPeerUser((prev: any) => {
        return { ...prev, peer5: username };
      });
      peerHeart5.current.setAttribute("value", username);
      peerHeart5.current.style.display = "block";
      videoOn(peerFace5, peerIntroduce5);
    }

    // console.log("여기 오ㅗㅗㅗㅗㅗㅗㅗㅗㅗ냐?", userCount.current);
    // peerFace.current.srcObject = data.stream;
    // userCount += 1;
    // setUserCount((prev) => prev + 1);
    userCount.current += 1;

    // currentUsers.current.push(1);
    // dispatch(isRtcLoading());
  }

  // 유저들 프로파일 모달 띄우기
  const ShowUserProfile = async (event: React.MouseEvent<any>) => {
  if (userCount.current >= 2) {
    const username = event.currentTarget.id;
    console.log("모달용 데이터 닉?", username);
    const { data } = await axios({
      url: `https://i8e201.p.ssafy.io/api/user/info/${username}`,
      headers: {
        accessToken: `${accessToken}`,
      },
    });
    console.log("모달용 데이터?", data);
    dispatch(changeNavAlarmReviewEmojiUserData(data));
    dispatch(showRoomUserProfile());
    // setUserProfileData(data);
    // dispatch(isRtcLoading(false));
     }
  };

  // 하트 시그널 클릭
  const addHeart = (event: any) => {
    const targetUser = event.target.getAttribute("value");
    socket.emit("add_heart", { roomName, targetUser });
  };
  // ---------------- 게임 관련 --------------------
  const transitionDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      transitionDiv.current!.classList.remove("opacity-0");
    }, 1000);
    // 게임 선택하기
    socket.on("game_select", (gameId: any) => {
      transitionDiv.current!.classList.add("opacity-0");
      console.log("게임아이디 오냐--------", gameId);
      setTimeout(() => {
        // 게임 선택창 끄기
        dispatch(showGameSelectModal(false));
        // 선택한 게임Id 세팅
        dispatch(selectGame(gameId));
        transitionDiv.current!.classList.remove("opacity-0");
      }, 1000);
    });

    // 게임 선택창으로 돌아오기
    socket.on("game_back_select", () => {
      transitionDiv.current!.classList.add("opacity-0");
      console.log("선택창돌아오기오냐--------");
      setTimeout(() => {
        transitionDiv.current!.classList.remove("opacity-0");
        // 룰렛 결과창 끄기
        dispatch(showRouletteResultModal(false));
        // 퍼블릭 모달 끄기
        dispatch(showPublicModal(false));
        // 진행중인 게임 닫기
        dispatch(selectGame("exit"));
        // 게임 선택창 켜기
        dispatch(showGameSelectModal(true));
      }, 1000);
    });

    // 손병호 게임 시그널받기
    socket.on("game_son_signal", (signalData: any) => {
      transitionDiv.current!.classList.add("opacity-0");
      console.log("시그널 gameWebRTC에서 받았냐?", signalData);
      setTimeout(() => {
        transitionDiv.current!.classList.remove("opacity-0");
      }, 1000);
    });

    // 스무고개 시그널 받기
    socket.on("game_twenty_signal", (signalData: any) => {
      transitionDiv.current!.classList.add("opacity-0");
      console.log("twenty : 시그널 gameWebRTC에서 받았냐?", signalData);
      setTimeout(() => {
        transitionDiv.current!.classList.remove("opacity-0");
      }, 1000);
    });

    // 밸런스 게임 시그널받기
    socket.on("game_balance_Intro", (isBalance: any) => {
      console.log("WebRTC에서 roomName에서 받았나?", isBalance);
      dispatch(balanceChange(isBalance));
    });

    // 밸런스 게임 시그널받기
    socket.on("game_balance_typeChange", (choiceType: any) => {
      if (choiceType === "EXIT") {
        dispatch(isRomanNormalChange(null));
      } else {
        dispatch(isRomanNormalChange(choiceType));
      }
      console.log("choiceType?", choiceType);
    });

    // 밸런스 게임 테마별 질문 변경
    socket.on("game_balance_subjectChange", (themeDataList: any) => {
      dispatch(balanceQuestionChange(themeDataList));
    });

    return () => {
      socket.off("game_select");
      socket.off("game_back_select");
      socket.off("game_son_signal");
      socket.off("game_twenty_signal");
    };
  }, []);

  // 게임 선택창 상태
  const isGameSelect = useAppSelector((state) => {
    return state.gameSelectModal;
  });
  // 선택한 게임
  const selectedId = useAppSelector((state) => {
    return state.selectGameId;
  });

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isRoomUserProfile && userProfileData && (
            <RoomUserProfile
              userData={userProfileData}
              pochaId={pochaId}
              isHost={isHost}
              socket={socket}
            />
          )}
          {count ? (
            <div className=" bg-black bg-opacity-70 flex flex-col justify-center z-20 items-center fixed top-0 right-0 bottom-0 left-0">
              <img src={jjanImg} alt="jjan" />
              <div className="text-7xl font-bold text-white fixed top-28 z-30">
                {count}
              </div>
            </div>
          ) : null}
          {pochaInfo && videoOnTime && (
            <>
              <div className="text-white w-full min-h-[85vh] flex justify-evenly">
                <div className="flex flex-col justify-evenly items-center">
                  {/* <div className="flex flex-wrap justify-evenly items-center p-24"> */}
                  {/* 내 비디오 공간 */}
                  <div className="flex flex-col justify-center items-center">
                    <div
                      ref={div1}
                      className="rounded-[1rem] overflow-hidden h-[15rem] w-[28rem] flex items-center "
                    >
                      <video
                        className="object-fill"
                        ref={myFace}
                        playsInline
                        autoPlay
                      ></video>
                      <div ref={myIntroduce} className="border-2 object-fill">
                        {introduceInfo[peerUser.my]}
                      </div>
                    </div>
                    <div ref={myHeart}>💖 x {heartInfo[peerUser.my]}</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div
                      ref={div3}
                      className="rounded-[1rem] overflow-hidden h-[15rem] w-[28rem] items-center hidden"
                    >
                      <video
                        onClick={ShowUserProfile}
                        className=" object-fill cursor-pointer"
                        style={{ display: "none" }}
                        ref={peerFace2}
                        playsInline
                        autoPlay
                      ></video>
                      <div
                        ref={peerIntroduce2}
                        className="border-2 object-fill"
                        style={{ display: "none" }}
                      >
                        {introduceInfo[peerUser.peer2]}
                      </div>
                    </div>
                    <div
                      ref={peerHeart2}
                      className="cursor-pointer"
                      onClick={addHeart}
                      style={{ display: "none" }}
                    >
                      💖 x {heartInfo[peerUser.peer2]}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div
                      ref={div5}
                      className="rounded-[1rem] overflow-hidden h-[15rem] w-[28rem] items-center hidden"
                    >
                      <video
                        onClick={ShowUserProfile}
                        className=" object-fill cursor-pointer"
                        ref={peerFace4}
                        playsInline
                        autoPlay
                      ></video>
                      <div
                        ref={peerIntroduce4}
                        className="border-2 object-fill"
                        style={{ display: "none" }}
                      >
                        {introduceInfo[peerUser.peer4]}
                      </div>
                    </div>
                    <div
                      ref={peerHeart4}
                      className="cursor-pointer"
                      onClick={addHeart}
                      style={{ display: "none" }}
                    >
                      💖 x {heartInfo[peerUser.peer4]}
                    </div>
                  </div>
                </div>
                {/* 게임 공간 */}
                <div
                  ref={transitionDiv}
                  className="flex justify-center items-center min-w-fit w-[47vw] overflow-hidden mt-5 rounded-[20px] transition-all duration-1000 opacity-0"
                >
                  {/* {pochaUsers && <LadderIntro socket={socket} pochaId={pochaId} pochaUsers={pochaUsers}/>} */}
                  {isGameSelect && (
                    <GameSelect socket={socket} pochaId={pochaId} />
                  )}
                  {selectedId === "roul"
                    ? pochaUsers && (
                        <Roulette
                          socket={socket}
                          pochaId={pochaId}
                          pochaUsers={pochaUsers}
                        />
                      )
                    : null}
                  {selectedId === "son"
                    ? pochaUsers && (
                        <SonIntro socket={socket} pochaId={pochaId} />
                      )
                    : null}
                  {selectedId === "bal"
                    ? pochaUsers && (
                        <Balance
                          socket={socket}
                          pochaId={pochaId}
                          pochaUsers={pochaUsers}
                        />
                      )
                    : null}
                  {selectedId === "liar"
                    ? pochaUsers && (
                        <LiarIntro
                          socket={socket}
                          pochaId={pochaId}
                          pochaUsers={pochaUsers}
                        />
                      )
                    : null}
                  {selectedId === "call"
                    ? pochaUsers && (
                        <CallIntro
                          socket={socket}
                          pochaId={pochaId}
                          pochaUsers={pochaUsers}
                        />
                      )
                    : null}
                  {selectedId === "twenty"
                    ? pochaUsers && (
                        <TwentyIntro socket={socket} pochaId={pochaId} />
                      )
                    : null}
                </div>

                {/* 사람 공간 */}
                <div className="flex flex-col justify-evenly items-center">
                  <div className="flex flex-col justify-center items-center">
                    <div
                      ref={div2}
                      className="rounded-[1rem] overflow-hidden h-[15rem] w-[28rem] flex items-center "
                    >
                      <video
                        onClick={ShowUserProfile}
                        className=" object-fill cursor-pointer"
                        ref={peerFace1}
                        playsInline
                        autoPlay
                      ></video>
                      <div
                        ref={peerIntroduce1}
                        className="border-2 object-fill"
                        style={{ display: "none" }}
                      >
                        {introduceInfo[peerUser.peer1]}
                      </div>
                    </div>
                    <div
                      ref={peerHeart1}
                      className="cursor-pointer"
                      onClick={addHeart}
                      style={{ display: "none" }}
                    >
                      💖 x {heartInfo[peerUser.peer1]}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div
                      ref={div4}
                      className="rounded-[1rem] overflow-hidden h-[15rem] w-[28rem] items-center hidden"
                    >
                      <video
                        onClick={ShowUserProfile}
                        className=" object-fill cursor-pointer"
                        ref={peerFace3}
                        playsInline
                        autoPlay
                      ></video>
                      <div
                        ref={peerIntroduce3}
                        className="border-2 object-fill"
                        style={{ display: "none" }}
                      >
                        {introduceInfo[peerUser.peer3]}
                      </div>
                    </div>
                    <div
                      ref={peerHeart3}
                      className="cursor-pointer"
                      onClick={addHeart}
                      style={{ display: "none" }}
                    >
                      💖 x {heartInfo[peerUser.peer3]}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div
                      ref={div6}
                      className="rounded-[1rem] overflow-hidden h-[15rem] w-[28rem] items-center hidden"
                    >
                      <video
                        onClick={ShowUserProfile}
                        className=" object-fill cursor-pointer"
                        ref={peerFace5}
                        playsInline
                        autoPlay
                      ></video>
                      <div
                        ref={peerIntroduce5}
                        className="border-2 object-fill"
                        style={{ display: "none" }}
                      >
                        {introduceInfo[peerUser.peer5]}
                      </div>
                    </div>
                    <div
                      ref={peerHeart5}
                      className="cursor-pointer"
                      onClick={addHeart}
                      style={{ display: "none" }}
                    >
                      💖 x {heartInfo[peerUser.peer5]}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center ">
                <div className="flex w-fit text-white">
                  {/* 뮤트 */}
                  <button
                    className="border-2 px-3"
                    onClick={handleMuteClick}
                    ref={muteBtn}
                  >
                    🔊
                  </button>
                  {/* 카메라 */}
                  <button
                    className="border-2 px-3"
                    onClick={handleCameraClick}
                    ref={cameraBtn}
                  >
                    Camera Off
                  </button>
                  {/* 카메라 옵션 */}
                  <select
                    className="text-black"
                    onInput={handleCameraChange}
                    ref={cameraSelect}
                  >
                    {optionList}
                  </select>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default WebRTC;
