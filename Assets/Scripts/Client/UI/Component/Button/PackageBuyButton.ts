import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {Button} from 'UnityEngine.UI';
import Manager from '../../../Manager/Manager';

export default class PackageBuyButton1 extends ZepetoScriptBehaviour {
  public buyBtn: Button;

  Start() {
    this.buyBtn.onClick.AddListener(() => {
      Manager.Product.PurchaseCurrencyPackage(this.gameObject.name);
      // this.lockImage.SetActive(false);
      // this.SelectText.SetActive(true);
      //구매
    });
  }
}
