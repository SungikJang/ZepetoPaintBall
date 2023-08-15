import {GameObject, Random} from 'UnityEngine';
import {Button} from 'UnityEngine.UI';
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import Manager from '../../Manager/Manager';
import Connector from '../../Network/Connector';
import {TMP_Text} from 'TMPro';
import MyPlayerController from '../../MyPlayerController/MyPlayerController';

export default class RespawnUI extends ZepetoScriptBehaviour {
  id: string;

  public RespawnBtn: Button;
  public LeaveBtn: Button;

  public inventory: GameObject;

  public goldtext: TMP_Text;
  public diatext: TMP_Text;
  public zemtext: TMP_Text;

  private nowPage: GameObject;
  private nowPageBottom: GameObject;

  Start() {
    Manager.UI.RespawnUI = this;
    this.inventory.SetActive(true);
    Manager.Product.RefreshBalance();
    const icontent = this.inventory.transform.GetChild(1).GetChild(0).GetChild(0);
    for (let i = 0; i < 16; i++) {
      icontent.GetChild(i).GetChild(0).GetChild(0).gameObject.GetComponent<TMP_Text>().text = (
        i + 1
      ).toString();
    }

    this.RespawnBtn.onClick.AddListener(() => {
      Connector.Instance.ReqToServer('RespawnReq');
    });

    this.LeaveBtn.onClick.AddListener(() => {
      Connector.Instance.ReqToServer('LeaveGameReq', {player: MyPlayerController.Data.MySessionId});
    });
  }

  public SetGold(quantity: number) {
    this.goldtext.text = quantity.toString();
  }

  public SetZem(quantity: number) {
    this.zemtext.text = quantity.toString();
  }
}
