import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styles from "./LiarVote.module.css";

function LiarVote({
  socket,
  pochaId,
  pochaUsers,
  pochaInfo,
  liarnum,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
  pochaInfo: any;
  liarnum: any;
}): React.ReactElement {
  // 내 이름
  const myName = localStorage.getItem("Username");

  const roomName = pochaId;
  const { totalCount } = pochaInfo;
  // 내 번호 세팅
  const [myNum, setMyNum] = useState<number>(-1);
  // 사람들 네임
  const [peopleName, setPeopleName] = useState<string[]>([]);

  const [Resultnum, setResultnum] = useState<number>(0);

  // 사람들 스코어
  const [peopleScore, setPeopleScore] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  // 투표여부
  const [peopleVote, setPeopleVote] = useState<number[]>([1, 1, 1, 1, 1, 1]);

  // 손가락들 가져옴
  const txtSpan0 = useRef<any>(null);
  const txtSpan1 = useRef<any>(null);
  const txtSpan2 = useRef<any>(null);
  const txtSpan3 = useRef<any>(null);
  const txtSpan4 = useRef<any>(null);
  const txtSpan5 = useRef<any>(null);
  const [txtSpanList, setTxtSpanList] = useState<any[]>([
    txtSpan0,
    txtSpan1,
    txtSpan2,
    txtSpan3,
    txtSpan4,
    txtSpan5,
  ]);

  // 최초 실행
  useEffect(() => {

    // 접을때 주고 받는 함수
    socket.on("game_liar_vote", (myNum: number, num: number) => {
      finish();
      if (peopleVote[myNum] === 1){
        console.log("새로운배열 갱신되고있냐?", peopleScore);
        const newArray = peopleScore.map((score, index) => {
          if (index === myNum) {
            return score + 1;
          }
          return score;
        });
        console.log("새로운배열?", newArray);
        setPeopleScore((prev) => [...newArray]);
        const newArray2 = peopleVote.map((score, index) => {
          if (index === num) {
            return score - 1;
          }
          return score;
        });
        console.log("새로운배열?", newArray2);
        setPeopleVote((prev) => [...newArray2]);
        console.log("새로운배열zzzzzzzz?", peopleScore);
        console.log("새로운배열zzzzzzzz?", peopleVote);
      }
    });

    return () => {
      socket.off("game_son_fold");
    };
  }, [peopleScore]);

  useEffect(() => {
    // 유저 정보들 세팅
    setPeopleInfo();
    gamestart();
  }, []);

  //손 만들기(인원수 넘어가는 손은 가리기)
  function gamestart() {
    console.log("인원수 체크해서 가리기")
    for (var i = 0; i < 6; i++) {
      if (i >= pochaUsers.length) {
        console.log("가리는거",i)
        txtSpanList[i].current.classList.add("hidden");
      }
    }
  }
  const setPeopleInfo = () => {
    console.log(pochaUsers, "유저들 리스트");
    pochaUsers.forEach((user: any, index: number) => {
      // setPeopleScore();
      // setTxtSpanList((prev) => prev = [txtSpan0, txtSpan1, txtSpan2, txtSpan3, txtSpan4, txtSpan5]);
      setPeopleName((prev) => [...prev, user.nickname]);
      if (user.username === myName) {
        setMyNum(index);
      }
    });
  };

  const onClickClose = () => {
    const signalData = "INTRO";
    // 다음 페이지로 이동
    socket.emit("game_liar_signal", roomName, signalData);
  };

  console.log("vote : 포차 유저 정보------------------", pochaUsers);

  //손가락 접기
  function selectLiar(num:any) {
    console.log("소켓 selectLiar : " + num + "mynum: " + myNum);
    socket.emit("game_liar_vote", roomName, myNum, num);
  }

  //게임 끝인지 확인 
  function finish() {
    let resultNum: number = 0;
    const result: number[] = [];
    console.log("게임 끝인지 확인중입니다", peopleVote, resultNum);
    peopleVote.forEach((vote, index) => {
      console.log("s여기@@@@@@@@@@@@", vote, index);
      if (vote === 0) {
        resultNum = resultNum + 1;
        console.log("정답자", resultNum);
      }
    });
    setResultnum(resultNum);
    if (resultNum === totalCount) {
      const maxValue = Math.max.apply(null, peopleScore);
      peopleScore.forEach((score, index) => {
        console.log("여기8888888888888888888", score, index);
        if (score === maxValue) {
          result.push(index)
        }
      })
      console.log("투표 결과 catch로 보내기", result);
      const data = result;
      const signalData = "CATCH";
      socket.emit("game_liar_signal", roomName, signalData, data);
  }
}

  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.box} ${styles.layout}`}>
        <div className={`${styles.box2} ${styles.layout2}`}>LIAR GAME</div>
        <div className={`${styles.layout5}`}>
          <div className={`${styles.box3}`}>라이어를 투표해주세요.</div>
        </div>
        <div className={`${styles.box4}`}>
          <div className={`${styles.text1} ${styles.showTime}`} id="showtime">{Resultnum}</div>
          <div className={`${styles.text1}`} id="title">표</div>
        </div>
        <div className={`${styles.layout6}`}>
          <div className={`${styles.subjects} flex`} onClick={() => selectLiar(0)} ref={txtSpan0}>
            <div className={`${styles.hiddenBox}`} id="txtSpan0">
              <img src={require("src/assets/game_liar/yield.png")} className={`${styles.subjectsArrow}`} />
            </div>
            <div>{peopleName[0]}</div>
          </div>
          <div className={`${styles.subjects} flex`} onClick={() => selectLiar(1)} ref={txtSpan1}>
            <div className={`${styles.hiddenBox}`} id="txtSpan1">
              <img src={require("src/assets/game_liar/yield.png")} className={`${styles.subjectsArrow}`} />
            </div>
            <div>{peopleName[0]}</div>
          </div>
          <div className={`${styles.subjects} flex`} onClick={() => selectLiar(2)} ref={txtSpan2}>
            <div className={`${styles.hiddenBox}`} id="txtSpan2">
              <img src={require("src/assets/game_liar/yield.png")} className={`${styles.subjectsArrow}`} />
            </div>
            <div>{peopleName[0]}</div>
          </div>
          <div className={`${styles.subjects} flex`} onClick={() => selectLiar(3)} ref={txtSpan3}>
            <div className={`${styles.hiddenBox}`} id="txtSpan3">
              <img src={require("src/assets/game_liar/yield.png")} className={`${styles.subjectsArrow}`} />
            </div>
            <div>{peopleName[0]}</div>
          </div>
          <div className={`${styles.subjects} flex`} onClick={() => selectLiar(4)} ref={txtSpan4}>
            <div className={`${styles.hiddenBox}`} id="txtSpan4">
              <img src={require("src/assets/game_liar/yield.png")} className={`${styles.subjectsArrow}`} />
            </div>
            <div>{peopleName[0]}</div>
          </div>
          <div className={`${styles.subjects} flex`} onClick={() => selectLiar(5)} ref={txtSpan5}>
            <div className={`${styles.hiddenBox}`} id="txtSpan5">
              <img src={require("src/assets/game_liar/yield.png")} className={`${styles.subjectsArrow}`} />
            </div>
            <div>{peopleName[0]}</div>
          </div>
        </div>
        {/* <div className={`${styles.layout6}`}>
          <div className={`${styles.dropdown}`}>
            <button className={`${styles.dropbtn}`}>
              <span className={`${styles.dropbtn_content}`}>라이어는...?</span>
              <span className={`${styles.dropbtn_click} ${styles.dropbtn_click_style}`}
                onClick={onClickdropdown}>arrow_drop_down</span>
            </button>
            <div className={`${styles.dropdown_content}`}>
              <div onClick={selectP(this.innerText)}>{pochaUsers[0]}</div>
              <div onClick={selectP(this.innerText)}>{pochaUsers[1]}</div>
              <div onClick={selectP(this.innerText)}>{pochaUsers[2]}</div>
              <div onClick={selectP(this.innerText)}>{pochaUsers[3]}</div>
              <div onClick={selectP(this.innerText)}>{pochaUsers[4]}</div>
              <div onClick={selectP(this.innerText)}>{pochaUsers[5]}</div>
            </div>
          </div>
          <input
            onClick={onClickVoteLiar}
            type="button"
            className={`${styles.retry}`}
            value="투표하기"
          />
        </div> */}
      </div>
    </div>
  );
}

export default LiarVote;
