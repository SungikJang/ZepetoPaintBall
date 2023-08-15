import {Button, Image} from 'UnityEngine.UI';
import {GameObject, Texture} from 'UnityEngine';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import Connector from '../../Network/Connector';
import Manager from '../../Manager/Manager';
import {TMP_Text} from 'TMPro';
import {ZepetoWorldHelper} from 'ZEPETO.World';

export default class GameVoteUI extends ZepetoScriptBehaviour {
  private SeletedGame: string = '';
  public FlagBtn: Button;
  public SiegeBtn: Button;
  public SoloFlagBtn: Button;
  public soloFlagVoteObj: GameObject;
  public flagVoteObj: GameObject;
  public siegeVoteObj: GameObject;
  public goldtext: TMP_Text;
  public zemtext: TMP_Text;

  public timeText: TMP_Text;
  public voteTime: number = 15;

  Start() {
    Manager.UI.GameVoteUI = this;
    Manager.Product.RefreshBalance();
    this.FlagBtn.onClick.AddListener(() => {
      if (this.SeletedGame !== 'Flag') {
        Connector.Instance.ReqToServer('GameVote', {gameName: 'Flag'});
        this.SeletedGame = 'Flag';
      }
    });
    this.SiegeBtn.onClick.AddListener(() => {
      if (this.SeletedGame !== 'Siege') {
        Connector.Instance.ReqToServer('GameVote', {gameName: 'Siege'});
        this.SeletedGame = 'Siege';
      }
    });
    this.SoloFlagBtn.onClick.AddListener(() => {
      if (this.SeletedGame !== 'SoloFlag') {
        Connector.Instance.ReqToServer('GameVote', {gameName: 'SoloFlag'});
        this.SeletedGame = 'SoloFlag';
      }
    });
  }

  public SetGold(quantity: number) {
    this.goldtext.text = quantity.toString();
  }

  public SetZem(quantity: number) {
    this.zemtext.text = quantity.toString();
  }

  CreatUserImage(player: string, userId: string, gameName: string) {
    let mask: GameObject;
    mask = GameObject.Find('Mask' + player);
    if (mask) {
      mask.name = 'Mask';
      mask.SetActive(false);
    }
    if (gameName === 'Flag') {
      for (let i = 0; i < this.flagVoteObj.transform.childCount; i++) {
        if (!this.flagVoteObj.transform.GetChild(i).gameObject.activeSelf) {
          mask = this.flagVoteObj.transform.GetChild(i).gameObject;
          mask.SetActive(true);
          break;
        }
      }
    } else if ('Siege') {
      for (let i = 0; i < this.siegeVoteObj.transform.childCount; i++) {
        if (!this.siegeVoteObj.transform.GetChild(i).gameObject.activeSelf) {
          mask = this.siegeVoteObj.transform.GetChild(i).gameObject;
          mask.SetActive(true);
          break;
        }
      }
    } else {
      for (let i = 0; i < this.soloFlagVoteObj.transform.childCount; i++) {
        if (!this.soloFlagVoteObj.transform.GetChild(i).gameObject.activeSelf) {
          mask = this.soloFlagVoteObj.transform.GetChild(i).gameObject;
          mask.SetActive(true);
          break;
        }
      }
    }
    mask.name = 'Mask' + player;
    ZepetoWorldHelper.GetProfileTexture(
      userId,
      (texture: Texture) => {
        mask.transform.GetChild(0).gameObject.GetComponent<Image>().sprite =
          Manager.UI.GetSprite(texture);
      },
      (error) => {
        console.log(error);
      },
    );
  }

  Update() {
    this.UpdateTime();
  }

  UpdateTime() {
    let sec: number = this.voteTime - Manager.Game.VoteTime;
    this.timeText.text = sec.toString();
  }
}
