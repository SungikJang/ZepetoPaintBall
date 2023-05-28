import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Button, Image} from 'UnityEngine.UI'
import { TMP_Text } from 'TMPro';

export default class WeaponPopupUI extends ZepetoScriptBehaviour {
    public weapomImage: Image;
    public selectOrBuyBtn: Button;
    public upgardeBtn: Button;
    public powerText: TMP_Text;
    public speedText: TMP_Text;
    public weaponName: TMP_Text;
    public weaponLevel: TMP_Text;
    
    private isOwned: boolean = false;

    Start() {
        this.selectOrBuyBtn.onClick.AddListener(()=>{
            //사거나 장착해야함
        });
        this.upgardeBtn.onClick.AddListener(()=>{
            // 강화가능
        });
    }

}