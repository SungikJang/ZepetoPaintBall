import {GameObject, Random} from 'UnityEngine';
import {Button} from 'UnityEngine.UI';
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import Manager from '../../Manager/Manager';
import Connector from '../../Network/Connector';
import {TMP_Text} from 'TMPro';
import {ProductService, ProductType} from 'ZEPETO.Product';
import Utils from '../../Utils/index';
import WeaponPopupUI from '../../UI/PopUpUI/WeaponPopupUI';

export default class StartUI extends ZepetoScriptBehaviour {
  id: string;

  public weaponPopUpUIObj: GameObject;

  public inventoryBtn: Button;
  public weaponChestBtn: Button;
  public passBtn: Button;
  public coinsBtn: Button;

  public GameStartBtn: Button;

  public nowNameObj: GameObject;
  public inventoryNameObj: GameObject;
  public weaponChestNameObj: GameObject;
  public coinsNameObj: GameObject;

  public inventory: GameObject;
  public inventoryBottom: GameObject;
  public weaponChest: GameObject;
  public weaponChestBottom: GameObject;
  public coins: GameObject;
  public coinsBottom: GameObject;

  public goldtext: TMP_Text;
  public zemtext: TMP_Text;

  private nowPage: GameObject;
  private nowPageBottom: GameObject;

  Start() {
    Manager.UI.StartUI = this;
    this.inventory.SetActive(true);
    const icontent = this.inventory.transform.GetChild(0).GetChild(0).GetChild(0);
    for (let i = 0; i < 16; i++) {
      icontent.GetChild(i).GetChild(0).GetChild(0).gameObject.GetComponent<TMP_Text>().text = (
        i + 1
      ).toString();
    }
    this.nowPage = this.inventory;
    this.nowPageBottom = this.inventoryBottom;
    this.inventoryBtn.onClick.AddListener(() => {
      if (!this.inventory.activeSelf) {
        this.nowPage.SetActive(false);
        this.nowPageBottom.SetActive(false);
        this.inventory.SetActive(true);
        this.inventoryBottom.SetActive(true);
        this.nowPage = this.inventory;
        this.nowPageBottom = this.inventoryBottom;
      }
    });
    this.weaponChestBtn.onClick.AddListener(() => {
      if (!this.weaponChest.activeSelf) {
        this.nowPage.SetActive(false);
        this.nowPageBottom.SetActive(false);
        this.weaponChest.SetActive(true);
        this.weaponChestBottom.SetActive(true);
        this.nowPage = this.weaponChest;
        this.nowPageBottom = this.weaponChestBottom;
      }
    });
    this.coinsBtn.onClick.AddListener(() => {
      if (!this.coins.activeSelf) {
        this.nowPage.SetActive(false);
        this.nowPageBottom.SetActive(false);
        this.coins.SetActive(true);
        this.coinsBottom.SetActive(true);
        this.nowPage = this.coins;
        this.nowPageBottom = this.coinsBottom;
      }
    });

    this.GameStartBtn.onClick.AddListener(() => {
      Connector.Instance.ReqToServer('GameStartBtnReq');
    });
  }

  public SetGold(quantity: number) {
    this.goldtext.text = quantity.toString();
  }

  public SetZem(quantity: number) {
    this.zemtext.text = quantity.toString();
  }
}
