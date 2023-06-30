import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import {Button, Image} from 'UnityEngine.UI'
import { TMP_Text } from 'TMPro';
import Manager from '../../Manager/Manager';
import MyPlayerController from '../../MyPlayerController/MyPlayerController';

export default class GameSelectPopupUI extends ZepetoScriptBehaviour {
    public flagBtn: Button;
    public siegeBtn: Button;
    public soloFlagBtn: Button;
    public Btn1: Button;
    public Btn2: Button;
    public Btn3: Button;
    

    Start() {
        
        
        this.flagBtn.onClick.AddListener(()=>{
            Manager.FlagGame.GameStart(MyPlayerController.Data.MySessionId);
            Manager.UI.DeletePopUpUI()
        });
        this.siegeBtn.onClick.AddListener(()=>{
            Manager.SiegeGame.GameStart(MyPlayerController.Data.MySessionId);
            Manager.UI.DeletePopUpUI()
        });
        this.soloFlagBtn.onClick.AddListener(()=>{
            // Manager.SoloFlagGame.GameStart(MyPlayerController.Data.MySessionId);
            // Manager.UI.DeletePopUpUI()
        });
        this.Btn1.onClick.AddListener(()=>{
            
        });
        this.Btn2.onClick.AddListener(()=>{

        });
        this.Btn3.onClick.AddListener(()=>{

        });
    }

}