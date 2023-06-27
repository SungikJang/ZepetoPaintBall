import { GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Button, Slider} from 'UnityEngine.UI'
import { TMP_Text } from 'TMPro';
import Manager, { InterManager } from '../../../Manager/Manager';
import IOC from '../../../IOC';

export default class WeaponCardUI extends ZepetoScriptBehaviour {
    public upperLeftNumText: TMP_Text;
    public Stars: GameObject;
    public powerFill: Slider;
    public SpeedFill: Slider;
    public WeaponCardBtn: Button;
    public WeaponNum: number;

    public manager: InterManager;
    
    

    Start() {
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.WeaponCardBtn.onClick.AddListener(() => {
            // 무기 창 떠야된다고 알림 -> StartUI가 받아야함
            this.manager.UI.NowPopUpWeaponNum = this.upperLeftNumText.text;
            this.manager.UI.ShowPopUpUI("WeaponPopupUI")
        });
    }
}