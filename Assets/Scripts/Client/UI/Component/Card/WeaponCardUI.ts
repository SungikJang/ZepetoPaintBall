import {GameObject} from 'UnityEngine';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {Button, Slider} from 'UnityEngine.UI';
import {TMP_Text} from 'TMPro';
import Manager from '../../../Manager/Manager';

export default class WeaponCardUI extends ZepetoScriptBehaviour {
  public upperLeftNumText: TMP_Text;
  public Stars: GameObject;
  public powerFill: Slider;
  public SpeedFill: Slider;
  public WeaponCardBtn: Button;
  public WeaponNum: number;
  private power: number = 0;
  private speed: number = 0;

  Start() {
    const path = 'Weapon/' + this.upperLeftNumText.text;
    this.power = Manager.Data.GetValueByKeys(path + '/Power') as number;
    this.speed = Manager.Data.GetValueByKeys(path + '/Speed') as number;
    this.powerFill.value = this.power / 500;
    this.SpeedFill.value = this.speed / 40;
    switch (this.upperLeftNumText.text) {
      case '1':
        this.Stars.transform.GetChild(0).gameObject.SetActive(true);
        break;
      case '2':
        this.Stars.transform.GetChild(0).gameObject.SetActive(true);
        this.Stars.transform.GetChild(1).gameObject.SetActive(true);
        break;
      case '3':
        this.Stars.transform.GetChild(0).gameObject.SetActive(true);
        this.Stars.transform.GetChild(1).gameObject.SetActive(true);
        this.Stars.transform.GetChild(2).gameObject.SetActive(true);
        break;
      case '4':
        this.Stars.transform.GetChild(0).gameObject.SetActive(true);
        this.Stars.transform.GetChild(1).gameObject.SetActive(true);
        this.Stars.transform.GetChild(2).gameObject.SetActive(true);
        this.Stars.transform.GetChild(3).gameObject.SetActive(true);
        break;
      case '5':
        this.Stars.transform.GetChild(0).gameObject.SetActive(true);
        break;
      case '6':
        this.Stars.transform.GetChild(0).gameObject.SetActive(true);
        this.Stars.transform.GetChild(1).gameObject.SetActive(true);
        break;
      case '7':
        this.Stars.transform.GetChild(0).gameObject.SetActive(true);
        this.Stars.transform.GetChild(1).gameObject.SetActive(true);
        this.Stars.transform.GetChild(2).gameObject.SetActive(true);
        break;
      case '8':
        this.Stars.transform.GetChild(0).gameObject.SetActive(true);
        this.Stars.transform.GetChild(1).gameObject.SetActive(true);
        this.Stars.transform.GetChild(2).gameObject.SetActive(true);
        this.Stars.transform.GetChild(3).gameObject.SetActive(true);
        break;
      case '9':
        this.Stars.transform.GetChild(0).gameObject.SetActive(true);
        this.Stars.transform.GetChild(1).gameObject.SetActive(true);
        break;
      case '10':
        this.Stars.transform.GetChild(0).gameObject.SetActive(true);
        this.Stars.transform.GetChild(1).gameObject.SetActive(true);
        this.Stars.transform.GetChild(2).gameObject.SetActive(true);
        break;
      case '11':
        this.Stars.transform.GetChild(0).gameObject.SetActive(true);
        this.Stars.transform.GetChild(1).gameObject.SetActive(true);
        this.Stars.transform.GetChild(2).gameObject.SetActive(true);
        this.Stars.transform.GetChild(3).gameObject.SetActive(true);
        break;
      case '12':
        this.Stars.transform.GetChild(0).gameObject.SetActive(true);
        this.Stars.transform.GetChild(1).gameObject.SetActive(true);
        this.Stars.transform.GetChild(2).gameObject.SetActive(true);
        this.Stars.transform.GetChild(3).gameObject.SetActive(true);
        this.Stars.transform.GetChild(4).gameObject.SetActive(true);
        break;
    }
    this.WeaponCardBtn.onClick.AddListener(() => {
      // 무기 창 떠야된다고 알림 -> StartUI가 받아야함
      Manager.UI.NowPopUpWeaponNum = this.upperLeftNumText.text;
      Manager.UI.StartUI.weaponPopUpUIObj.SetActive(true);
    });
  }
}
