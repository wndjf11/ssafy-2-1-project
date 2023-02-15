import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./LiarTitle.module.css";

function LiarTitle({
  socket,
  pochaId,
  pochaUsers,
  pochaInfo,
  liarnum,
  nowtitle,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
  pochaInfo: any;
  liarnum: any;
  nowtitle: any;
}): React.ReactElement {
  const roomName = pochaId;

  const [mynum, setMyNum] = useState<any>(null); // 내번호
  
  const [isliar, setIsliar] = useState<any>(false); 

  const myName = localStorage.getItem("Username"); // 내 이름

  const onClickClose = () => {
    const signalData = "VOTE";
    // 다음 페이지로 이동
    socket.emit("game_liar_signal", roomName, signalData);
  };

  // 내가 몇번째인지
  const setPeopleInfo = () => {
    pochaUsers.forEach((user: any, index: number) => {
      if (user.username === myName) {
        setMyNum(index);
      }
    });
  };

  const setLiarwho = () => {
    if (mynum === liarnum) {
      setIsliar(true);
    }
  };

  useEffect(() => {
    setPeopleInfo(); // 방참가인원 정보
  }, []);

  useEffect(() => {
    setLiarwho();
  }, [mynum]);

  console.log("~~~~~~~~~중에 라이어는-------", liarnum, "mynum---", mynum);
  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.box} ${styles.layout}`}>
        <div className={`${styles.box2} ${styles.layout2}`}>LIAR GAME</div>
        <div className={`${styles.layout5}`}>
          <div className={`${styles.box3}`}>주제 :</div>
          {nowtitle && (
            <div className={`${styles.box4}`} id="maintitle">
              {nowtitle.type}
            </div>
          )}
        </div>
        {nowtitle && (
          <div className={`${styles.layout4}`} id="title">
            {isliar ? "라이어입니다" : nowtitle.word }
          </div>
        )}
        <span className={`${styles.text1}`}>
          두 턴을 돌고 난 후,
          <br />
          NEXT를 클릭하여 라이어를 투표하십시오.
        </span>
        <div className={`${styles.layout6}`}>
          <input
            type="button"
            onClick={onClickClose}
            className={`${styles.retry}`}
            value="NEXT"
          />
        </div>
      </div>
    </div>
  );
}

export default LiarTitle;
