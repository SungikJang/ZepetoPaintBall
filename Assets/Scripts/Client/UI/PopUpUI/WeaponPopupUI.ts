import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {Button, Image} from 'UnityEngine.UI';
//import {ProductPurchaseButton} from "ZEPETO.Product";
import {TMP_Text} from 'TMPro';
import {GameObject} from 'UnityEngine';
import Manager from '../../Manager/Manager';
import {ProductService, ProductType} from 'ZEPETO.Product';
import MyPlayerController from '../../MyPlayerController/MyPlayerController';
import Utils from '../../Utils/index';

export default class WeaponPopupUI extends ZepetoScriptBehaviour {
  public weapomImage: Image;
  public lockImage: GameObject;
  public SelectText: GameObject;
  public selectBtn: Button;
  public closeBtn: Button;
  public buyBtn: Button;
  public buyBtnObj: GameObject;
  public powerText: TMP_Text;
  public speedText: TMP_Text;
  public bulletText: TMP_Text;
  public weaponName: TMP_Text;
  public weaponType: TMP_Text;
  public PriceText: TMP_Text;

  private isOwned: boolean = false;

  Start() {}

  OnEnable() {
    ProductService.OnPurchaseCompleted.AddListener((product, response) => {
      if (product.ProductType == ProductType.Item) {
        let s = Utils.ExtractNumberStr(product.productId);
        if (s === Manager.UI.NowPopUpWeaponNum) {
          this.purchaseComplete();
        }
      }
    });
    this.selectBtn.onClick.AddListener(() => {
      if (
        MyPlayerController.Data.MyWeaponInfoArr[Number(Manager.UI.NowPopUpWeaponNum) - 1] === 'O'
      ) {
        if (MyPlayerController.Data.MyPlayer.character.Context.gameObject.activeSelf) {
          if (MyPlayerController.Data.NowWeapon.name !== Manager.UI.NowPopUpWeaponNum) {
            MyPlayerController.Data.EqiupGun(Manager.UI.NowPopUpWeaponNum);
          }
        } else {
          MyPlayerController.Data.WaitingWeeapon = Manager.UI.NowPopUpWeaponNum;
        }
        //장찻
        Manager.UI.StartUI.weaponPopUpUIObj.SetActive(false);
      }
    });
    this.buyBtn.onClick.AddListener(() => {
      Manager.Product.PurchaseItem('gun' + Manager.UI.NowPopUpWeaponNum);
      // this.lockImage.SetActive(false);
      // this.SelectText.SetActive(true);
      //구매
    });
    this.closeBtn.onClick.AddListener(() => {
      Manager.UI.StartUI.weaponPopUpUIObj.SetActive(false);
    });
    if (MyPlayerController.Data.MyWeaponInfoArr[Number(Manager.UI.NowPopUpWeaponNum) - 1] === 'O') {
      this.isOwned = true;
    } else {
      this.isOwned = false;
    }
    const path = 'Weapon/' + Manager.UI.NowPopUpWeaponNum;
    this.weaponName.text = Manager.Data.GetValueByKeys(path + '/Name') as string;
    MyPlayerController.Data.MyWeaponType = this.weaponName.text;
    this.weaponType.text = Manager.Data.GetValueByKeys(path + '/Type') as string;
    let s = Manager.Data.GetValueByKeys(path + '/BuyPrice') as number;
    this.PriceText.text = s.toString();
    s = Manager.Data.GetValueByKeys(path + '/Power') as number;
    this.powerText.text = s.toString();
    s = Manager.Data.GetValueByKeys(path + '/Speed') as number;
    this.speedText.text = s.toString();
    s = Manager.Data.GetValueByKeys(path + '/Bullets') as number;
    this.bulletText.text = s.toString();
    let item = Manager.Resource.LoadSprite('Guns\\' + Manager.UI.NowPopUpWeaponNum);
    this.weapomImage.sprite = item;
    //this.buyBtnObj.GetComponent<ProductPurchaseButton>().SetProductId("gun" + Manager.UI.NowPopUpWeaponNum);
    if (this.isOwned) {
      this.lockImage.SetActive(false);
      this.SelectText.SetActive(true);
    } else {
      this.lockImage.SetActive(true);
      this.SelectText.SetActive(false);
    }
  }

  public purchaseComplete() {
    this.lockImage.SetActive(false);
    this.SelectText.SetActive(true);
  }
}
