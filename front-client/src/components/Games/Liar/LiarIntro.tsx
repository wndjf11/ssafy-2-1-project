import styles from "./LiarIntro.module.css";
import { useState, useEffect } from "react";
import LiarManual from "./LiarManual";
import LiarTitle from "./LiarTitle";
import LiarVote from "./LiarVote";
import LiarCatch from "./LiarCatch";
import LiarSuccess from "./LiarSuccess";
import LiarLose from "./LiarLose";
import axios from "axios";

function LiarIntro({
  socket,
  pochaId,
  pochaUsers,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
}): React.ReactElement {
  // 방 이름
  const roomName = pochaId;
  // 내 이름
  const myName = localStorage.getItem("Username");
  // 메뉴얼 클릭
  const [signal, setSignal] = useState<string>("INTRO");

  const [pochaInfo, setPochaInfo] = useState<any>(null);

  const [isHost, setIshost] = useState<any>(null);

  const [result, setResult] = useState<any>(null);

  const [liarnum, setLiarnum] = useState<any>(null); // 라이어의 넘버

  const [mynum, setMyNum] = useState<any>(null); // 내번호

  const [titles, setTitles] = useState<any>(null);

  const [nowtitle, setNowtitle] = useState<any>(null);

  // 포차 정보 요청
  const getPochaInfo = async () => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const {
        data: { data },
      } = await axios({
        method: "GET",
        url: `https://i8e201.p.ssafy.io/api/pocha/${pochaId}`,
        headers: {
          accessToken: accessToken,
        },
      });
      console.log("포차정보 데이터 잘 오냐!? SON", data);
      setPochaInfo(data);
    } catch (error) {
      console.log("Son게임에서 포차정보 에러", error);
    }
  };

  // 라이어 게임 주제 받아오기
  const getLiarSubject = async () => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const {
        data: { data },
      } = await axios({
        url: `https://i8e201.p.ssafy.io/api/pocha/game/liar`,
        headers: {
          accessToken: accessToken,
        },
      });
      setTitles(data);
    } catch (error) {
      console.log("라이어 게임 주제 axios error", error);
    }
  };

   // 이번 턴 주제
   const maintitle = () => {
    if (titles) {
      const data = titles[Math.floor(Math.random() * (titles.length - 1))];
      socket.emit("game_liar_nowtitle", roomName, data);
    }
  };

  useEffect(() => {
    // 라이어 게임 시그널받기
    socket.on("game_liar_signal", (signalData: string, data: any) => {
      getPochaInfo();
      if(signalData === 'CATCH'){
        setResult(data);
      }
      setTimeout(() => {
        setSignal(signalData);
      }, 1000);
    });
    return () => {
      socket.off("game_liar_signal");
    };
  }, []);

  useEffect(() => {
    // 라이어 넘버 받기
    socket.on("game_liar_number",(data: string) => {
      if(!liarnum){
        setLiarnum(data);
      }
    });
    return () => {
      socket.off("game_liar_number");
    };
  }, []);

  useEffect(() => {
    // 라이어 nowtitle 받기
    socket.on("game_liar_nowtitle",(data: string) => {
      if (!nowtitle) {
        setNowtitle(data)
      }
    });
    return () => {
      socket.off("game_liar_nowtitle");
    };
  }, []);

  // 클릭하면 서버로 시그널 보냄
  const onClickSignal = (event: React.MouseEvent<HTMLInputElement>) => {
    const signalData = event.currentTarget.value;
    console.log("시그널 데이터: ", signalData);
    socket.emit("game_liar_signal", roomName, signalData);
  };

  const onClickClose = () => {
    // 선택창으로 돌아가기
    socket.emit("game_back_select", roomName);
  };

  // 방장은 누구?
  const setHostInfo = () => {
    pochaUsers.forEach((user: any, index: number) => {
      if (user.isHost === true) {
        setIshost(index);
      }
    });
  };

  // 내가 몇번째인지
  const setPeopleInfo = () => {
    pochaUsers.forEach((user: any, index: number) => {
      if (user.username === myName) {
        setMyNum(index);
      }
    });
  };

  //라이어 지정하기
  //라이어 넘버 정해주기
  const liarnumber = () => {
    if (mynum === isHost) {
      const totalCount = pochaInfo.totalCount;
      const liarnum = Math.floor(Math.random() * totalCount);
      const data = liarnum
      socket.emit("game_liar_number", roomName, data);
    }
  };

  useEffect(() => {
    // console.log(pochaInfo);
    setHostInfo(); // 방장 누군지 > 라이어 뽑기 해줘야함
    getPochaInfo();
    setPeopleInfo();
  }, []);

  useEffect(() => {
    console.log("%%%%%%%%%    시도하는중");
    console.log("%%%%%%%%%    pochaInfo", pochaInfo);
    console.log("%%%%%%%%%    mynum", mynum);
    console.log("%%%%%%%%%    isHost", isHost);
    console.log("%%%%%%%%%    liarnum", liarnum);
    
    if ((mynum === isHost) && (pochaInfo)) {
      if(!liarnum){
        console.log("라이어 넘버정하는거 시작");
        liarnumber();
        getLiarSubject();
      }
    }
  }, [pochaInfo]);

  useEffect(() => {
    maintitle();
  },[titles]);

  console.log("isHost",isHost)
  console.log("titles",titles)
  console.log("nowtitle",nowtitle)
  console.log("liarnum",liarnum)

  return (
    <>
      {signal === "PLAY" ? (
        <LiarTitle
          socket={socket}
          pochaId={pochaId}
          pochaUsers={pochaUsers}
          pochaInfo={pochaInfo}
          liarnum={liarnum}
          nowtitle={nowtitle}
        />
      ) : null}
      {signal === "MANUAL" ? (
        <LiarManual socket={socket} pochaId={pochaId} pochaUsers={pochaUsers} />
      ) : null}
      {signal === "VOTE" ? (
        <LiarVote
          socket={socket}
          pochaId={pochaId}
          pochaUsers={pochaUsers}
          pochaInfo={pochaInfo}
          liarnum={liarnum}
        />
      ) : null}
      {signal === "CATCH" ? (
        <LiarCatch
          socket={socket}
          pochaId={pochaId}
          result={result}
          liarnum={liarnum}
        />
      ) : null}
      {signal === "SUCCESS" ? (
        <LiarSuccess
          socket={socket}
          pochaId={pochaId}
          result={result}
        />
      ) : null}
      {signal === "LOSE" ? (
        <LiarLose
          socket={socket}
          pochaId={pochaId}
          result={result}
        />
      ) : null}
      {signal === "INTRO" ? (
        <div className={`${styles.layout3}`}>
          <div className={`${styles.box} ${styles.layout}`}>
            <img
              src={require("src/assets/game_liar/LiarImg.png")}
              className={`${styles.img1}`}
              alt=""
            />
            <div className={`${styles.box2} ${styles.layout2}`}>LIAR GAME</div>
            <div className={`${styles.box3} ${styles.layout5}`}>
              라이어 게임
            </div>
            <div className={`${styles.layout4}`}>
              <input
                type="button"
                className={`${styles.retry}`}
                onClick={onClickClose}
                value="EXIT"
              />
              <input
                onClick={onClickSignal}
                type="button"
                className={`${styles.retry}`}
                value="MANUAL"
              />
              <input
                onClick={onClickSignal}
                type="button"
                className={`${styles.retry}`}
                value="PLAY"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default LiarIntro;
