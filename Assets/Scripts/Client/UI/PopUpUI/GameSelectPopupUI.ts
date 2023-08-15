import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {Button} from 'UnityEngine.UI';
import Manager from '../../Manager/Manager';
import {GAME_NAME} from '../../Enums';
import Connector from '../../Network/Connector';

export default class GameSelectPopupUI extends ZepetoScriptBehaviour {
  public flagBtn: Button;
  public siegeBtn: Button;
  public soloFlagBtn: Button;
  public Btn1: Button;
  public Btn2: Button;
  public Btn3: Button;

  Start() {
    this.flagBtn.onClick.AddListener(() => {
      Connector.Instance.ReqToServer('OpenGameReq', {gameName: GAME_NAME.Flag});
      Manager.UI.DeletePopUpUI();
    });
    this.siegeBtn.onClick.AddListener(() => {
      Connector.Instance.ReqToServer('OpenGameReq', {gameName: GAME_NAME.Siege});
      Manager.UI.DeletePopUpUI();
    });
    this.soloFlagBtn.onClick.AddListener(() => {
      Connector.Instance.ReqToServer('OpenGameReq', {gameName: GAME_NAME.SoloFlag});
      Manager.UI.DeletePopUpUI();
    });
    this.Btn1.onClick.AddListener(() => {});
    this.Btn2.onClick.AddListener(() => {});
    this.Btn3.onClick.AddListener(() => {});
  }
}
