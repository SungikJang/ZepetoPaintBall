import {Button} from 'UnityEngine.UI';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {TMP_Text} from 'TMPro';
import {GameObject, WaitForSeconds} from 'UnityEngine';
import Manager from '../../Manager/Manager';
import {GAME_NAME} from '../../Enums';
import Connector from '../../Network/Connector';
import MyPlayerController from '../../MyPlayerController/MyPlayerController';

export default class InGameUI extends ZepetoScriptBehaviour {
  public homeBtn: Button;
  public shopBtn: Button;
  public shopObj: GameObject;
  public readyBtn: Button;
  public readyObj: GameObject;
  public ATeamScore: TMP_Text;
  public BTeamScore: TMP_Text;
  public ATeamFlag: GameObject;
  public BTeamFlag: GameObject;
  public AteamSiege: GameObject;
  public BteamSiege: GameObject;
  public ScoreObj1: GameObject;
  public ScoreObj2: GameObject;
  public minText: TMP_Text;
  public secText: TMP_Text;
  public leaveAlertObj: GameObject;
  public InGameWeaponUI: GameObject;

  private instanceSet: boolean = false;

  Start() {
    this.homeBtn.onClick.AddListener(() => {
      Connector.Instance.ReqToServer('LeaveGameReq', {player: MyPlayerController.Data.MySessionId});
    });
    this.readyBtn.onClick.AddListener(() => {
      this.readyObj.SetActive(false);
      this.InGameWeaponUI.SetActive(false);
    });
    this.shopBtn.onClick.AddListener(() => {});
    this.shopObj.SetActive(false);
    this.ATeamFlag.SetActive(false);
    this.BTeamFlag.SetActive(false);
    this.AteamSiege.SetActive(false);
    this.BteamSiege.SetActive(false);
  }

  OnEnable() {
    Manager.UI.InGameUI = this;
    switch (Manager.Game.NowOnGame) {
      case GAME_NAME.Flag:
        this.ScoreObj1.SetActive(true);
        this.ScoreObj2.SetActive(true);
        break;
      case GAME_NAME.Siege:
        this.ScoreObj1.SetActive(true);
        this.ScoreObj2.SetActive(true);
        break;
      case GAME_NAME.SoloFlag:
        break;
    }
  }

  OnDisAble() {
    this.ScoreObj1.SetActive(false);
    this.ScoreObj2.SetActive(false);
  }

  Update() {
    this.UpdateTime();
  }

  UpdateTime() {
    let min: number = 0;
    let sec: number = 0;
    min = Math.floor(Manager.Game.GameTime / 60);
    sec = Math.floor(Manager.Game.GameTime % 60);
    if (min < 10) {
      this.minText.text = '0' + min.toString();
    } else {
      this.minText.text = min.toString();
    }
    if (sec < 10) {
      this.secText.text = '0' + sec.toString();
    } else {
      this.secText.text = sec.toString();
    }
  }
}
