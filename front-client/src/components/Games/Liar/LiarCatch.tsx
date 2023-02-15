import styles from "./LiarCatch.module.css";

function LiarCatch({
  socket,
  pochaId,
  result,
  liarnum,
}: {
  socket: any;
  pochaId: string;
  result: any;
  liarnum: number;
}): React.ReactElement {
  const roomName = pochaId;

  const onClickClose = () => {
    if ((result.length === 1)&&(result[0] === liarnum)){
      const signalData = "SUCCESS";
      socket.emit("game_liar_signal", roomName, signalData, result);
    }else{
      const signalData = "LOSE";
      socket.emit("game_liar_signal", roomName, signalData, result);
    }
  };

  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.box} ${styles.layout}`}>
        <img
          src={require("src/assets/game_liar/CatchImg.png")}
          className={`${styles.img1}`}
          alt="liarcatch"
        />
        <div className={`${styles.box2} ${styles.layout2}`} id="liar"></div>
        <div className={`${styles.layout4}`}>
          <input type="button" onClick={onClickClose} className={`${styles.retry}`} value="결과보기" />
          
        </div>
      </div>
    </div>
  );
}

export default LiarCatch;
