import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Button} from "UnityEngine.UI";
import Manager, { InterManager } from '../../../Manager/Manager';
import { InterMyPlayerController, MyPlayerController } from '../../../MyPlayer/MyPalyerController';
import IOC from '../../../IOC';

export default class PackageBuyButton1 extends ZepetoScriptBehaviour {
    public buyBtn: Button;
    public manager: InterManager;

    public myPlayerController: InterMyPlayerController;

    Start() {
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.buyBtn.onClick.AddListener(()=>{
            this.manager.Product.PurchaseCurrencyPackage("goldpack" + this.gameObject.name)
            // this.lockImage.SetActive(false);
            // this.SelectText.SetActive(true);
            //구매
        });
    }

}