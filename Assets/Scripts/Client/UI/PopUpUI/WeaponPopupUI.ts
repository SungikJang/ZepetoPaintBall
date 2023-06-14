import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Button, Image} from 'UnityEngine.UI'
//import {ProductPurchaseButton} from "ZEPETO.Product";
import { TMP_Text } from 'TMPro';
import { GameObject } from 'UnityEngine';
import Manager, { InterManager } from '../../Manager/Manager';
import { InterMyPlayerController, MyPlayerController } from '../../MyPlayer/MyPalyerController';
import IOC from '../../IOC';
import Utils from "../../Utils/index"
import {ProductService, ProductType} from "ZEPETO.Product";

export default class WeaponPopupUI extends ZepetoScriptBehaviour {
    public weapomImage: Image;
    public lockImage: GameObject;
    public SelectText: GameObject;
    public selectBtn: Button;
    public buyBtn: Button;
    public buyBtnObj: GameObject;
    public powerText: TMP_Text;
    public speedText: TMP_Text;
    public bulletText: TMP_Text;
    public weaponName: TMP_Text;
    public weaponType: TMP_Text;
    public PriceText: TMP_Text;
    
    private isOwned: boolean = false;
    
    public manager: InterManager;

    public myPlayerController: InterMyPlayerController;

    Start() {
        ProductService.OnPurchaseCompleted.AddListener((product, response) => {
            if (product.ProductType == ProductType.Item) {
                let s = Utils.ExtractNumberStr(product.productId)
                if(s === this.manager.UI.NowPopUpWeaponNum){
                    this.lockImage.SetActive(false);
                    this.SelectText.SetActive(true);
                }
            }
        });
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.selectBtn.onClick.AddListener(()=>{
            if(this.myPlayerController.MyPlayerData.MyWeaponInfoArr[Number(this.manager.UI.NowPopUpWeaponNum)-1] === "O"){
                if(this.myPlayerController.MyPlayerData.NowWeapon.name !== this.manager.UI.NowPopUpWeaponNum) {
                    this.myPlayerController.MyPlayerData.EqiupGun(this.manager.UI.NowPopUpWeaponNum);
                }
                //장찻
                this.manager.UI.DeletePopUpUI();
            }
        });
        this.buyBtn.onClick.AddListener(()=>{
            this.manager.Product.PurchaseItem("gun" + this.manager.UI.NowPopUpWeaponNum)
            // this.lockImage.SetActive(false);
            // this.SelectText.SetActive(true);
            //구매
        });
    }
    
    OnEnable(){
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        const path = 'Weapon/' + this.manager.UI.NowPopUpWeaponNum;
        this.weaponName.text = this.manager.Data.GetValueByKeys(path + '/Name') as string;
        this.weaponType.text = this.manager.Data.GetValueByKeys(path + '/Type') as string;
        let s = this.manager.Data.GetValueByKeys(path + '/BuyPrice') as number;
        this.PriceText.text = s.toString();
        s = this.manager.Data.GetValueByKeys(path + '/Power') as number;
        this.powerText.text = s.toString();
        s = this.manager.Data.GetValueByKeys(path + '/Speed') as number;
        this.speedText.text = s.toString();
        s = this.manager.Data.GetValueByKeys(path + '/Bullets') as number;
        this.bulletText.text = s.toString();
        let item = this.manager.Resource.LoadSprite('Guns\\' + this.manager.UI.NowPopUpWeaponNum);
        this.weapomImage.sprite = item;
        //this.buyBtnObj.GetComponent<ProductPurchaseButton>().SetProductId("gun" + this.manager.UI.NowPopUpWeaponNum);
        if(this.myPlayerController.MyPlayerData.MyWeaponInfoArr[Number(this.manager.UI.NowPopUpWeaponNum)-1] === "O"){
            this.lockImage.SetActive(false);
            this.SelectText.SetActive(true);
        }
    }

}