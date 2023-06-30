import { GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Button, Slider} from 'UnityEngine.UI'
import { TMP_Text } from 'TMPro';
import Manager from '../../../Manager/Manager';

export default class WeaponCardUI extends ZepetoScriptBehaviour {
    public upperLeftNumText: TMP_Text;
    public Stars: GameObject;
    public powerFill: Slider;
    public SpeedFill: Slider;
    public WeaponCardBtn: Button;
    public WeaponNum: number;

   
    
    

    Start() {
        
        this.WeaponCardBtn.onClick.AddListener(() => {
            // 무기 창 떠야된다고 알림 -> StartUI가 받아야함
            Manager.UI.NowPopUpWeaponNum = this.upperLeftNumText.text;
            Manager.UI.ShowPopUpUI("WeaponPopupUI")
        });
    }
}